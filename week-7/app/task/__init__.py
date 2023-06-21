from flask import Blueprint

taskBp = Blueprint('task', __name__)

from app.task import routes