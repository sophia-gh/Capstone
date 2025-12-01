from ..extensions import db
from ..tables import *
from flask import jsonify, request, Blueprint, session 
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
            if user_query.employee_id != session.get('employee_id'):
                if user_query.employed == True:
                    user_query.employed = False
                    db.session.commit() 
                else:
                    user_query.employed = True        
                    db.session.commit()
            else:
                return jsonify({'message': 'Cannot lock/unlock your own account'})
        return jsonify({'message': user_query.employed})
    except:
        return jsonify({'message': 'Employee not found'})

@admin_bp.route('/updateEmployee', methods=['POST'])
def change_JobTitle():
    data = request.get_json()
    employee_id = data.get('employee_id')
    employee_first_name = data.get('first_name')
    employee_last_name = data.get('last_name')
    new_job_title = data.get('job_title')
    statement = db.select(Employees).where(Employees.employee_id == employee_id)
    user_query = db.session.scalars(statement).first() 
    match new_job_title:
        case 'admin':
            new_job_title = JobTitle.admin
        case 'tool_manager':
            new_job_title = JobTitle.tool_manager
        case 'press_tech':
            new_job_title = JobTitle.press_tech
        case 'engineer':
            new_job_title = JobTitle.engineer
        case 'tool_maker':
            new_job_title = JobTitle.tool_maker
        case _:
            return jsonify({'message': 'Invalid job title'})
    try:
        if user_query:
            if user_query.employee_id != session.get('employee_id'):
                statement2 = db.update(Employees).where(Employees.employee_id == employee_id
                ).values(first_name=employee_first_name, last_name=employee_last_name, job_title=new_job_title
                ).returning(Employees.first_name, Employees.last_name, Employees.job_title)
                updateEmployee = db.session.execute(statement2).first()
                db.session.commit()
                return jsonify({'message': 'Employee profile edited successfully'})
            else:
                return jsonify({'message': 'Cannot edit your own profile'})
    except:
        return jsonify({'message': 'Employee not found'})

@admin_bp.route('/getAllEmployees')
def get_AllEmployees():
    statement = db.select(Employees)
    employees_query = db.session.scalars(statement).all() 
    employees_dict = [model_to_dict(employee) for employee in employees_query]
    return jsonify(employees_dict)

@admin_bp.route('/updatePassword', methods=['POST'])
def update_Password():
    data = request.get_json()
    employee_id = data.get('employee_id')
    new_password = data.get('new_password')
    hashed_password = generate_password_hash(new_password)  
    statement = db.select(Employees).where(Employees.employee_id == employee_id)
    user_query = db.session.scalars(statement).first() 
    try:
        if user_query:
            statement2 = db.update(Employees).where(Employees.employee_id == employee_id
            ).values(password=hashed_password
            ).returning(Employees.employee_id)
            db.session.execute(statement2)
            db.session.commit()
        return jsonify({'message': 'Password updated successfully'})
    except:
        return jsonify({'message': 'Employee not found'})

@admin_bp.route('/newPassword', methods=['POST'])
def new_password():
    data = request.get_json()
    employee_id = data.get('employee_id')
    new_password = data.get('new_password')
    if not new_password:
        return jsonify({'message': 'No password provided'})
    try:   
        hashed_password = generate_password_hash(new_password)  
        statement = db.update(Employees
            ).where(Employees.employee_id == employee_id
            ).values(password=hashed_password
            ).returning(Employees.employee_id) 
        update_password = db.session.scalars(statement).first()

        if update_password: 
            db.session.commit()
            return jsonify({'message': 'New password set successfully'})
        return jsonify({'message': 'Employee not found'})
    
    except Exception as e:
        print(traceback.format_exc(e))
        return jsonify({'message': 'Error setting password'})

# @app.route('/editProfile', methods=['POST'])
# def edit_profile():
#     data = request.get_json()
#     first_name = data.get('first_name')
#     last_name = data.get('last_name')
#     job_title = data.get('job_title')
#     employee_id = data.get('employee_id')
#     try:   
#         statement = db.update(Employees
#             ).where(Employees.employee_id == employee_id
#             ).values(first_name=first_name, last_name=last_name, job_title=job_title
#             ).returning(Employees.employee_id) 
#         update_profile = db.session.scalars(statement).first()

#         if update_profile: 
#             db.session.commit()
#             return jsonify({'message': 'Profile edited successfully'})
#         return jsonify({'message': 'Employee not found'})
    
#     except Exception as e:
#         print(traceback.format_exc(e))
#         return jsonify({'message': 'Error editing profile'})