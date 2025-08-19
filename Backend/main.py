from flask import Flask,request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from models import User, LeaveRequest
from config import app, db
from datetime import datetime

@app.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify({'users': [user.to_json() for user in users]})


#Create a new user
@app.route('/create_users', methods=['POST'])
def create_user():
    name = request.form.get('username')
    email = request.form.get('email')
    department = request.form.get('department')
    joining_date_str = request.form.get('joining_date')
    role = request.form.get('role', 'employee')
    leave_balance = request.form.get('leave_balance', 45)

    # Required fields check
    if not name or not email or not department or not joining_date_str:
        return {"message": "Missing required fields"}, 400

    # Parse joining_date (support DD-MM-YYYY and YYYY-MM-DD)
    joining_date = None
    for fmt in ("%d-%m-%Y", "%Y-%m-%d"):
        try:
            joining_date = datetime.strptime(joining_date_str, fmt).date()
            break
        except ValueError:
            continue
    if not joining_date:
        return {"message": "Invalid date format. Use DD-MM-YYYY or YYYY-MM-DD"}, 400

    # Validate leave balance
    try:
        leave_balance = int(leave_balance)
    except ValueError:
        return {"message": "Leave balance must be a number"}, 400

    if leave_balance < 0:
        return {"message": "Leave balance cannot be negative."}, 400

    # Check if user exists
    existing_user = User.query.filter_by(username=name).first()
    if existing_user:
        return {"message": "User already exists."}, 400
    existing_email = User.query.filter_by(email=email).first()
    if existing_email:
        return {"message": "Email already exists."}, 400

    # Validate email format (very simple check)
    if '@' not in email or '.' not in email:
        return {"message": "Invalid email address."}, 400

    # Create user
    new_user = User(
        username=name,
        email=email,
        department=department,
        joining_date=joining_date,
        role=role,
        leave_balance=leave_balance
    )

    db.session.add(new_user)
    db.session.commit()

    return {"message": "User created successfully!"}, 200

#Create a new leave request and saves it in leave request table
@app.route('/apply_leave', methods=['POST'])
def leave_apply():
    start_date = request.form.get('start_date')
    end_date = request.form.get('end_date')
    reason = request.form.get('reason')
    name = request.form.get('username')

    def parse_date(date_str):
        for fmt in ("%Y-%m-%d", "%d-%m-%Y"):
            try:
                return datetime.strptime(date_str, fmt).date()
            except ValueError:
                continue
        raise ValueError("Invalid date format. Use YYYY-MM-DD or DD-MM-YYYY")
    # Convert string (YYYY-MM-DD) → Python date
    start_date_d = parse_date(start_date)
    end_date_d = parse_date(end_date)

    if start_date_d > end_date_d:
        return {"message": "Start date cannot be after end date."}, 400

    user = User.query.filter_by(username=name).first()
    if not user:
        return {"message": "User not found."}, 404

    # Calculate total leave days
    total_leave = (end_date_d - start_date_d).days + 1
    print(f"Total leave days requested: {total_leave}")
    # Check leave balance
    if user.leave_balance < total_leave:
        return {"message": "Insufficient leave balance."}, 400

    # Check joining date
    if user.joining_date > start_date_d:
        return {"message": "Leave cannot be applied before joining date."}, 400

     
    # Check if leave request already exists at or in between the requested dates
    overlapping_requests = LeaveRequest.query.filter(
        LeaveRequest.username == name,
        LeaveRequest.start_date <= end_date_d,  
        LeaveRequest.end_date >= start_date_d
    ).all()
    if overlapping_requests:
        return {"message": "Leave request overlaps with an existing request."}, 400
    # Create leave request
    new_leave_request = LeaveRequest(
        username=name,
        start_date=start_date_d,
        end_date=end_date_d,
        reason=reason,
        status='pending'
    )
    db.session.add(new_leave_request)
    db.session.commit()

    return {
        "message": "Leave request submitted successfully!",
        "remaining_balance": user.leave_balance
    }, 200


#Fetch all leave requests
@app.route('/show_leaves', methods=['GET'])
def show_leaves():
    leaves = LeaveRequest.query.all()
    return jsonify({'leaves': [leave.to_json() for leave in leaves]})   

@app.route('/get_leave_bal', methods=['GET'])
def get_leave_balance():
    username = request.args.get('username')
    user = User.query.filter_by(username=username).first()
    if not user:
        return {"message": "User not found."}, 404
    return jsonify({"leave_balance": user.leave_balance})

# This is to be done by the admin to update the leave balance
@app.route('/update_leave_balance', methods=['POST'])
def update_leave_balance():
    leave_id = request.form.get('leave_id')
    status_curr= request.form.get('status')
    leave_no=LeaveRequest.query.filter_by(leave_id=leave_id).first()
    user=User.query.filter_by(username=leave_no.username).first()
    print(f"Updating leave balance for user: {user.username} with leave_id: {leave_id}")
    if not user:
        return {"message": "User not found."}, 404
    if(status_curr != 'approved'):
        leave_no.status = 'rejected'
        db.session.commit()
        return {"message": "Leave request not approved."}, 200
    total_leaves=((leave_no.end_date - leave_no.start_date).days + 1)
    if(user.leave_balance < total_leaves):
        leave_no.status = 'rejected'
        db.session.commit()
        return {"message": "Insufficient leave balance so leave cannot be accepted."}, 200 
    leave_no.status = 'approved'
    user.leave_balance -= total_leaves
    db.session.commit()

    return {"message": "Leave balance updated successfully!"}, 200

@app.route('/cancel_all_leave', methods=['POST'])
def cancel_all_leave():
    username = request.form.get('username')
    user = User.query.filter_by(username=username).first()
    if not user:
        return {"message": "User not found."}, 404
    # Fetch all leave requests for the user
    leave_requests = LeaveRequest.query.filter_by(username=username).all()
    if not leave_requests:
        return {"message": "No leave requests found for this user."}, 404
    # Cancel all leave requests
    for leave in leave_requests:
        db.session.delete(leave)
    db.session.commit()

    return {"message": "All leave requests cancelled successfully!"}, 200

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run()