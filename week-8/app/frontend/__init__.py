from flask import Blueprint
from flask_cors import CORS

frontendBp = Blueprint('frontend', __name__)
CORS(frontendBp)
from app.frontend import routes