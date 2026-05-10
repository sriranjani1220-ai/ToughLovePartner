import json
import os
from datetime import date
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
from pywebpush import webpush, WebPushException
from supabase_client import supabase


def _send_push(subscription_info, title, body):
    try:
        webpush(
            subscription_info=subscription_info,
            data=json.dumps({"title": title, "body": body}),
            vapid_private_key=os.getenv("VAPID_PRIVATE_KEY"),
            vapid_claims={"sub": os.getenv("VAPID_CLAIM_EMAIL")},
        )
    except WebPushException as e:
        print(f"Push error: {e}")


def _get_subscriptions_for_user(user_id):
    result = supabase.table("push_subscriptions").select("subscription").eq("user_id", user_id).execute()
    return [row["subscription"] for row in result.data]


def morning_summary():
    """8:00 AM — send each user a summary of today's tasks."""
    today = date.today().isoformat()

    # Get all goals with incomplete tasks due today or overdue
    goals_result = supabase.table("goals").select("user_id, title, tasks(title, due_date, status)").execute()

    user_tasks = {}
    for goal in goals_result.data:
        uid = goal["user_id"]
        for task in goal.get("tasks", []):
            if task["status"] != "completed" and (task.get("due_date") is None or task["due_date"] <= today):
                user_tasks.setdefault(uid, []).append(task["title"])

    for user_id, task_titles in user_tasks.items():
        subs = _get_subscriptions_for_user(user_id)
        count = len(task_titles)
        body = f"You have {count} task{'s' if count > 1 else ''} to tackle today. You've got this!"
        for sub in subs:
            _send_push(sub, "Good morning! Your tasks for today", body)


def overdue_nudge():
    """6:00 PM — nudge users with overdue incomplete tasks."""
    today = date.today().isoformat()

    tasks_result = (
        supabase.table("tasks")
        .select("title, due_date, goals(user_id)")
        .lt("due_date", today)
        .neq("status", "completed")
        .execute()
    )

    user_overdue = {}
    for task in tasks_result.data:
        uid = task["goals"]["user_id"]
        user_overdue.setdefault(uid, []).append(task["title"])

    for user_id, task_titles in user_overdue.items():
        subs = _get_subscriptions_for_user(user_id)
        count = len(task_titles)
        body = f"{count} overdue task{'s' if count > 1 else ''} still waiting. Even 10 minutes moves the needle."
        for sub in subs:
            _send_push(sub, "Don't let these slip away", body)


def init_scheduler(app):
    scheduler = BackgroundScheduler()
    scheduler.add_job(morning_summary, CronTrigger(hour=8, minute=0))
    scheduler.add_job(overdue_nudge, CronTrigger(hour=18, minute=0))
    scheduler.start()
    return scheduler
