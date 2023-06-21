from flask import Blueprint

authBp = Blueprint('auth', __name__)

from app.auth import routes