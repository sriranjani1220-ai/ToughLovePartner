from flask import Blueprint, request, jsonify
from supabase_client import supabase
from auth import require_auth
from datetime import datetime, date, timezone

tasks_bp = Blueprint("tasks", __name__)


def _user_owns_goal(goal_id, user_id):
    result = supabase.table("goals").select("id").eq("id", goal_id).eq("user_id", user_id).execute()
    return len(result.data) > 0


@tasks_bp.route("/", methods=["POST"])
@require_auth
def create_task():
    data = request.json
    goal_id = data.get("goal_id")
    if not _user_owns_goal(goal_id, request.user_id):
        return jsonify({"error": "Forbidden"}), 403

    due_date = data.get("due_date")
    result = supabase.table("tasks").insert({
        "goal_id": goal_id,
        "title": data["title"],
        "due_date": due_date,
        "original_due_date": due_date,
        "status": "not_started",
        "percent_complete": 0,
    }).execute()
    return jsonify(result.data[0]), 201


@tasks_bp.route("/<task_id>", methods=["PUT"])
@require_auth
def update_task(task_id):
    data = request.json

    # Verify ownership via goal
    existing = supabase.table("tasks").select("*, goals(user_id)").eq("id", task_id).execute()
    if not existing.data or existing.data[0]["goals"]["user_id"] != request.user_id:
        return jsonify({"error": "Forbidden"}), 403

    current = existing.data[0]
    update_data = {}

    if "title" in data:
        update_data["title"] = data["title"]
    if "due_date" in data:
        update_data["due_date"] = data["due_date"]

    new_status = data.get("status", current["status"])
    new_percent = data.get("percent_complete", current["percent_complete"])

    if new_status == "completed":
        update_data["status"] = "completed"
        update_data["percent_complete"] = 100
        update_data["completed_at"] = datetime.now(timezone.utc).isoformat()
        if not current.get("started_at"):
            update_data["started_at"] = update_data["completed_at"]
    elif new_status == "in_progress":
        update_data["status"] = "in_progress"
        update_data["percent_complete"] = max(1, min(99, new_percent))
        if not current.get("started_at"):
            update_data["started_at"] = datetime.now(timezone.utc).isoformat()
        update_data["completed_at"] = None
    elif new_status == "not_started":
        update_data["status"] = "not_started"
        update_data["percent_complete"] = 0
        update_data["started_at"] = None
        update_data["completed_at"] = None

    result = supabase.table("tasks").update(update_data).eq("id", task_id).execute()
    return jsonify(result.data[0])


@tasks_bp.route("/<task_id>", methods=["DELETE"])
@require_auth
def delete_task(task_id):
    existing = supabase.table("tasks").select("*, goals(user_id)").eq("id", task_id).execute()
    if not existing.data or existing.data[0]["goals"]["user_id"] != request.user_id:
        return jsonify({"error": "Forbidden"}), 403

    supabase.table("tasks").delete().eq("id", task_id).execute()
    return jsonify({"message": "Task deleted"}), 200


@tasks_bp.route("/overdue", methods=["GET"])
@require_auth
def get_overdue_tasks():
    today = date.today().isoformat()
    result = (
        supabase.table("tasks")
        .select("*, goals!inner(title, user_id)")
        .eq("goals.user_id", request.user_id)
        .lt("due_date", today)
        .neq("status", "completed")
        .execute()
    )
    return jsonify(result.data)
