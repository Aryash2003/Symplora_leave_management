from config import *
from datetime import datetime
class User(db.Model):
    username = db.Column(db.String(80), nullable=False,primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    department = db.Column(db.String(100), nullable=False)
    joining_date = db.Column(db.Date, nullable=False)
    leave_balance = db.Column(db.Integer, nullable=False, default=45)
    role = db.Column(db.String(20), nullable=False, default='employee')

    def to_json(self):
        return {
            "username": self.username,
            "email": self.email,
            "department": self.department,
            "joining_date": self.joining_date,
            "role": self.role,
            "leave_balance": self.leave_balance 
        }

        
        
class LeaveRequest(db.Model):
    __tablename__ = 'leave_request'

    username = db.Column(db.String(80), db.ForeignKey('user.username'), primary_key=True)
    leave_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    start_date = db.Column(db.Date, primary_key=True)
    end_date = db.Column(db.Date, nullable=False)
    reason = db.Column(db.String(200), nullable=False)
    status= db.Column(db.String(20), default='pending')


    def to_json(self):
        return {
            "username": self.username,
            "leave_id": self.leave_id,
            "start_date": self.start_date,
            "end_date": self.end_date,
            "reason": self.reason,
            "status": self.status
        }