from config import *
from models import *

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=False, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    department= db.Column(db.String(100), nullable=False)
    joining_date = db.Column(db.Date, nullable=False)

    def to_json(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'department': self.department,
            'joining_date': self.joining_date.isoformat()
        }