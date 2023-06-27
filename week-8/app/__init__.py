from flask import Flask
from config import Config
from app.extension import db, migrate, jwt

# import blueprint
from app.task import taskBp
from app.user import userBp
from app.auth import authBp
from app.frontend import frontendBp

def create_app(config_class = Config):
    # membuat aplication instance flask
    app = Flask(__name__)

    # konfigurasi app
    app.config.from_object(config_class)

    # Initilizae database & migration
    db.init_app(app)
    migrate.init_app(app, db)

    # Initialize JWT
    jwt.init_app(app)

    # initialize bluprint
    app.register_blueprint(taskBp, url_prefix='/api/tasks')
    app.register_blueprint(userBp, url_prefix='/api/users')
    app.register_blueprint(authBp, url_prefix='/api/auth')
    app.register_blueprint(frontendBp, url_prefix = "/")

    return app