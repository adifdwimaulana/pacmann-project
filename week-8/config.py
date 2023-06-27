import os
from datetime import timedelta

# mendapatkan path project
basedir = os.path.abspath(os.path.dirname(__file__))

# konfigurasi path database
DB_URI = 'sqlite:///' + os.path.join(basedir, 'app.db')

class Config:
    SECRET_KEY = '123'
    SQLALCHEMY_DATABASE_URI = DB_URI
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    JWT_TOKEN_LOCATION = ["headers"]
    JWT_SECRET_KEY = "super-secret" # "secret-key"
    JWT_ACESS_TOKEN_EXPIRES = timedelta(minutes=15)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)
