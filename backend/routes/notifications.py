import os
import json
from flask import Blueprint, request, jsonify
from supabase_client import supabase
from auth import require_auth
from pywebpush import webpush, WebPushException

notifications_bp = Blueprint("notifications", __name__)


def send_push(subscription_info, title, body):
    try:
        webpush(
            subscription_info=subscription_info,
            data=json.dumps({"title": title, "body": body}),
            vapid_private_key=os.getenv("VAPID_PRIVATE_KEY"),
            vapid_claims={"sub": os.getenv("VAPID_CLAIM_EMAIL")},
        )
        return True
    except WebPushException as e:
        print(f"Push failed: {e}")
        return False


@notifications_bp.route("/subscribe", methods=["POST"])
@require_auth
def subscribe():
    subscription = request.json.get("subscription")
    if not subscription:
        return jsonify({"error": "Missing subscription"}), 400

    endpoint = subscription.get("endpoint")
    supabase.table("push_subscriptions").upsert({
        "user_id": request.user_id,
        "endpoint": endpoint,
        "subscription": subscription,
    }, on_conflict="endpoint").execute()

    return jsonify({"message": "Subscribed"}), 201


@notifications_bp.route("/unsubscribe", methods=["POST"])
@require_auth
def unsubscribe():
    endpoint = request.json.get("endpoint")
    supabase.table("push_subscriptions").delete().eq("endpoint", endpoint).eq("user_id", request.user_id).execute()
    return jsonify({"message": "Unsubscribed"}), 200


@notifications_bp.route("/vapid-public-key", methods=["GET"])
def get_vapid_key():
    return jsonify({"key": os.getenv("VAPID_PUBLIC_KEY")})
