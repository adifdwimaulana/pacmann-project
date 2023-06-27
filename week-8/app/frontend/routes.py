from app.frontend import frontendBp
from flask import render_template
from flask_jwt_extended import jwt_required, get_jwt_identity

@frontendBp.route('', strict_slashes = False)
def home():
    return render_template('/tasks/index.html')

@frontendBp.route('auth/login', strict_slashes = False)
def login():
    return render_template('/auth/login.html')

@frontendBp.route('auth/register', strict_slashes = False)
def register():
    return render_template('/auth/register.html')