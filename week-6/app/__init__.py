from flask import Flask
from config import Config
from app.extension import db, migrate

# import blueprint
from app.task import taskBp
from app.user import userBp

def create_app(config_class = Config):
    # membuat aplication instance flask
    app = Flask(__name__)

    # konfigurasi app
    app.config.from_object(config_class)

    # Initilizae database & migration
    db.init_app(app)
    migrate.init_app(app, db)

    # initialize bluprint
    app.register_blueprint(taskBp, url_prefix='/tasks')
    app.register_blueprint(userBp, url_prefix='/users')

    return app