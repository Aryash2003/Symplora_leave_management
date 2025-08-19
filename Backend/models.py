from config import *

class User(db.Model):
    id = db.Column(db.Integer, unique=True, primary_key=True)
    username = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    department = db.Column(db.String(100), nullable=False)
    joining_date = db.Column(db.Date, nullable=False)
    role = db.Column(db.String(20), nullable=False, default='employee')

    def __init__(self, **kwargs):
        from datetime import datetime
        joining_date = kwargs.get("joining_date")
        if isinstance(joining_date, str):
            kwargs["joining_date"] = datetime.strptime(joining_date, "%Y-%m-%d").date()
        super().__init__(**kwargs)

    def to_json(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "department": self.department,
            "joining_date": self.joining_date.isoformat(),
            "role": self.role
        }