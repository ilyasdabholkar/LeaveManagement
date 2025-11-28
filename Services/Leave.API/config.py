import os

class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URI", "mysql+pymysql://root:password@mysql:3306/leave_db")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JSON_SORT_KEYS = False
