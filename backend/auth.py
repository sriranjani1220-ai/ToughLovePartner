from functools import wraps
from flask import request, jsonify
from supabase_client import supabase


def require_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get("Authorization", "")
        token = auth_header.replace("Bearer ", "").strip()
        if not token:
            return jsonify({"error": "Unauthorized"}), 401
        try:
            user = supabase.auth.get_user(token)
            request.user_id = user.user.id
        except Exception as e:
            print(f"[AUTH ERROR] {type(e).__name__}: {e}")
            return jsonify({"error": "Invalid token"}), 401
        return f(*args, **kwargs)
    return decorated
