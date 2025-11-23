from ..extensions import db
from ..tables import *
from flask import jsonify, request, session, send_from_directory, Blueprint 
from werkzeug.security import generate_password_hash, check_password_hash
import datetime 
import traceback


login_bp = Blueprint('login_bp', __name__)


@login_bp.route("/login", methods=['POST'])
def login():
    data = request.get_json()
    employee_id = data.get('employee_id')
    password = data.get('password')
    employee_id = data.get('employee_id')
    password = data.get('password')
    statement = db.select(Employees).where(Employees.employee_id == employee_id).where(Employees.employed == True)
    user_query = db.session.scalars(statement).first()  
    check_hashed_password = generate_password_hash(password)
    if not user_query or not check_password_hash(user_query.password, password):
        return jsonify({'user': False})
    session['employee_id'] = user_query.employee_id
    session['first_name'] = user_query.first_name
    session['last_name'] = user_query.last_name
    session['job_title'] = user_query.job_title
    print(f"Current session: {session}")
    return jsonify({'user': True, 'job_title' : session.get('job_title')})

@login_bp.route('/logout')
def logout():
    session.pop('employee_id', None)
    session.pop('first_name', None)
    session.pop('last_name', None)
    session.pop('job_title', None)
    return jsonify({'message': 'Logged out successfully'})

@login_bp.route('/currentUser')
def current_user():
    if 'employee_id' in session:
        return jsonify({
            'employee_id': session.get('employee_id'),
            'first_name': session.get('first_name'),
            'last_name': session.get('last_name'),
            'job_title': session.get('job_title')
        })
    return jsonify({'user': False})