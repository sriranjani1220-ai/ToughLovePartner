import os
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
from routes.goals import goals_bp
from routes.tasks import tasks_bp
from routes.notifications import notifications_bp
from scheduler import init_scheduler

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": os.getenv("FRONTEND_URL", "http://localhost:5173")}})

app.register_blueprint(goals_bp, url_prefix="/api/goals")
app.register_blueprint(tasks_bp, url_prefix="/api/tasks")
app.register_blueprint(notifications_bp, url_prefix="/api/notifications")

init_scheduler(app)

if __name__ == "__main__":
    app.run(debug=True, port=5000)
