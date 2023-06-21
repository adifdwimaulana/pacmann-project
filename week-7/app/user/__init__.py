from flask import Blueprint

userBp = Blueprint('user', __name__)

from app.user import routes