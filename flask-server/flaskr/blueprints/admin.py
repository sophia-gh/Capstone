from ..extensions import db
from ..tables import *
from flask import jsonify, request, Blueprint 
from werkzeug.security import generate_password_hash, check_password_hash

admin_bp = Blueprint('admin_bp', __name__)

@admin_bp.route("/createEmployee", methods=['POST'])
def create_Employee():
    try:
        data = request.get_json()
        employee_id = data.get('employee_id')
        first_name = data.get('first_name')
        last_name = data.get('last_name')
        job_title = data.get('job_title')
        password = data.get('password')
        print(job_title)
        hashed_password = generate_password_hash(password)  
        new_employee = Employees(
            employee_id=employee_id,
            first_name=first_name,
            last_name=last_name,
            password=hashed_password,
            employed=True,
            job_title=job_title
        )
        db.session.add(new_employee)
        db.session.commit()
        return jsonify({'message': 'Employee created successfully'})
    except:
        return jsonify({'message': 'Error creating employee'})

@admin_bp.route('/lockUnlockEmployee', methods=['POST'])
def lockUnlock_Employee():
    data = request.get_json()
    employee_id = data.get('employee_id')
    statement = db.select(Employees).where(Employees.employee_id == employee_id)
    user_query = db.session.scalars(statement).first() 
    try:
        if user_query:
            if user_query.employed == True:
                user_query.employed = False
                db.session.commit() 
            else:
                user_query.employed = True        
                db.session.commit()
        return jsonify({'message': user_query.employed})
    except:
        return jsonify({'message': 'Employee not found'})

@admin_bp.route('/changeJobTitle', methods=['POST'])
def change_JobTitle():
    data = request.get_json()
    employee_id = data.get('employee_id')
    new_job_title = data.get('new_job_title')
    statement = db.select(Employees).where(Employees.employee_id == employee_id)
    user_query = db.session.scalars(statement).first() 
    try:
        if user_query:
            user_query.job_title = new_job_title
            db.session.commit()
            return jsonify({'message': 'Job title changed successfully'})
    except:
        return jsonify({'message': 'Employee not found'})

@admin_bp.route('/getAllEmployees')
def get_AllEmployees():
    statement = db.select(Employees)
    employees_query = db.session.scalars(statement).all() 
    employees_dict = [model_to_dict(employee) for employee in employees_query]
    return jsonify(employees_dict)