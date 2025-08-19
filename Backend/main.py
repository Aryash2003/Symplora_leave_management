from flask import Flask,request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from models import User
from config import app, db

@app.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify({'users': [user.to_json() for user in users]})

from datetime import datetime

@app.route('/create_users', methods=['POST'])
def create_user():
    name = request.form.get('username')
    email = request.form.get('email')
    department = request.form.get('department')
    joining_date_str = request.form.get('joining_date')
    id = request.form.get('id')

    # Convert string (YYYY-MM-DD) → Python date
    joining_date = datetime.strptime(joining_date_str, "%Y-%m-%d").date()

    new_user = User(
        id=id,
        username=name,
        email=email,
        department=department,
        joining_date=joining_date
    )

    db.session.add(new_user)
    db.session.commit()

    return {"message": "User created successfully!"}

@app.route('/leave_apply', methods=['POST'])
def leave_apply():
    start_date = request.form.get('start_date')
    end_date = request.form.get('end_date')
    reason = request.form.get('reason')
    user_id = request.form.get('user_id')

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)