from flask import Blueprint, request, jsonify
from supabase_client import supabase
from auth import require_auth
from datetime import datetime, timezone

goals_bp = Blueprint("goals", __name__)


def compute_goal_stats(tasks):
    """Calculate percent_complete and time_taken_hours from tasks list."""
    if not tasks:
        return 0, 0.0

    percent = sum(t["percent_complete"] for t in tasks) // len(tasks)

    total_seconds = 0
    for task in tasks:
        if task.get("started_at") and task.get("completed_at"):
            start = datetime.fromisoformat(task["started_at"].replace("Z", "+00:00"))
            end = datetime.fromisoformat(task["completed_at"].replace("Z", "+00:00"))
            total_seconds += max(0, (end - start).total_seconds())

    return percent, round(total_seconds / 3600, 1)


@goals_bp.route("/", methods=["GET"])
@require_auth
def get_goals():
    result = (
        supabase.table("goals")
        .select("*, tasks(*)")
        .eq("user_id", request.user_id)
        .order("created_at")
        .execute()
    )
    goals = result.data
    for goal in goals:
        tasks = goal.get("tasks", [])
        goal["percent_complete"], goal["time_taken_hours"] = compute_goal_stats(tasks)
    return jsonify(goals)


@goals_bp.route("/", methods=["POST"])
@require_auth
def create_goal():
    data = request.json
    # Enforce max 3 goals per user
    existing = (
        supabase.table("goals")
        .select("id", count="exact")
        .eq("user_id", request.user_id)
        .execute()
    )
    if existing.count >= 3:
        return jsonify({"error": "Maximum 3 goals allowed"}), 400

    result = supabase.table("goals").insert({
        "user_id": request.user_id,
        "title": data["title"],
        "deadline": data.get("deadline"),
    }).execute()
    result.data[0]["tasks"] = []
    result.data[0]["percent_complete"] = 0
    result.data[0]["time_taken_hours"] = 0.0
    return jsonify(result.data[0]), 201


@goals_bp.route("/<goal_id>", methods=["PUT"])
@require_auth
def update_goal(goal_id):
    data = request.json
    result = (
        supabase.table("goals")
        .update({"title": data.get("title"), "deadline": data.get("deadline")})
        .eq("id", goal_id)
        .eq("user_id", request.user_id)
        .execute()
    )
    return jsonify(result.data[0])


@goals_bp.route("/<goal_id>", methods=["DELETE"])
@require_auth
def delete_goal(goal_id):
    supabase.table("goals").delete().eq("id", goal_id).eq("user_id", request.user_id).execute()
    return jsonify({"message": "Goal deleted"}), 200
