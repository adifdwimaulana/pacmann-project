from flask import Flask, render_template
from .task import task
from .user import user

def create_app():
    app = Flask(__name__)

    app.register_blueprint(task.task_bp, url_prefix="/tasks")
    app.register_blueprint(user.user_bp, url_prefix="/users")

    @app.route("/")
    def index():
        return render_template('index.html')
    
    return app