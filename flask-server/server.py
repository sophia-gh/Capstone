from flask import Flask, jsonify, request, session
from flask_sqlalchemy import SQLAlchemy
from tables import *
from werkzeug.security import generate_password_hash, check_password_hash
import datetime 

app = Flask(__name__, instance_relative_config=True)
app.config.from_pyfile('config.py')  

db = SQLAlchemy(model_class=Base)
db.init_app(app)

@app.route("/login", methods=['POST'])
def login():
    data = request.get_json()
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
    return jsonify({'user': True})

@app.route('/logout')
def logout():
    session.pop('employee_id', None)
    session.pop('first_name', None)
    session.pop('last_name', None)
    session.pop('job_title', None)
    return jsonify({'message': 'Logged out successfully'})

@app.route("/createEmployee", methods=['POST'])
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

@app.route('/lockUnlockEmployee', methods=['POST'])
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

@app.route('/changeJobTitle', methods=['POST'])
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

# select * from dies;
@app.route("/getAllDies") 
def get_AllDies(): 
    statement = db.select(Dies) 
    die_query = db.session.scalars(statement).all() 
    dies_dict = [model_to_dict(Die) for Die in die_query]
    return jsonify(dies_dict)

@app.route('/getAllEmployees')
def get_AllEmployees():
    statement = db.select(Employees)
    employees_query = db.session.scalars(statement).all() 
    employees_dict = [model_to_dict(employee) for employee in employees_query]
    return jsonify(employees_dict)

# select * from dies where company;
@app.route("/getAllDiesFromCompany", methods=['POST'])
def get_AllDiesFromCompany():
    data = request.get_json()
    company = data.get('company')
    statement = db.select(Dies).where(Dies.company == company)
    die_query = db.session.scalars(statement).all() 
    dies_dict = [model_to_dict(Die) for Die in die_query]
    return jsonify(dies_dict)

#select * from components where tool_number = '607636044-5';
@app.route("/getComponentsForDie", methods=['POST'])
def get_ComponentsForDie():
    data = request.get_json()
    tool_number = data.get('tool_number')
    statement = db.select(Components).where(Components.tool_number == tool_number)
    components_query = db.session.scalars(statement).all() 
    components_dict = [model_to_dict(component) for component in components_query]  
    return jsonify(components_dict) 
    
# select * from component_details where tool_number = '607636044-5';
@app.route("/getAllComponentDetailsForDie", methods=['POST'])
def get_AllComponentDetailsForDie():
    data = request.get_json()
    tool_number = data.get('tool_number')
    statement = db.select(ComponentDetails).where(ComponentDetails.tool_number == tool_number)
    component_details_query = db.session.scalars(statement).all() 
    component_details_dict = [model_to_dict(ComponentDetail) for ComponentDetail in component_details_query]
    return jsonify(component_details_dict)
    
# select detail_number from component_details where tool_number = '607636044-5';
@app.route("/getAllDetailNumbersForDie", methods=['POST'])
def get_AllDetailNumbersForDie():
    data = request.get_json()
    tool_number = data.get('tool_number')
    statement = db.select(ComponentDetails.detail_number).where(ComponentDetails.tool_number == tool_number)
    component_details_query = db.session.scalars(statement).all() 
    component_details_dict = [model_to_dict(ComponentDetail) for ComponentDetail in component_details_query]
    return jsonify(component_details_dict)
    
# select distinct company from dies;
@app.route("/getAllCompanies")
def get_AllCompanies():
    statement = db.select(Dies.company).distinct()
    companies_query = db.session.scalars(statement).all()
    companies_dict = [model_to_dict(company) for company in companies_query]
    return jsonify(companies_dict)

# select * from components where status = 'active' and tool_number = '607636044-5'; 
@app.route("/getAllActiveComponentsForDie", methods=['POST'])
def get_AllActiveComponentsForDie():
    data = request.get_json()
    tool_number = data.get('tool_number')
    status = data.get('status')
    statement = db.select(Components.status).where(Components.status == 'active').where(Components.tool_number == tool_number)
    component_details_query = db.session.scalars(statement).all() 
    component_dict = [model_to_dict(Component) for Component in component_details_query]
    return jsonify(component_details_dict)

# select
#         t1.detail_number, 
#         t1.number_used_in_tool, 
#         COUNT(case when t2.current_state = 'active'::status then 1 end) as active_components 
# from 
# 	component_details as t1 
# left join 
# 	components as t2 on t1.tool_number = t2.tool_number and t1.detail_number = t2.detail_number
# where 
# 	t1.tool_number = '607636044-5' group by t1.detail_number, t1.number_used_in_tool;

@app.route('/startProductionRun', methods=['POST'])
def start_production_run():
    data  = request.get_json()
    tool_number = data.get('tool_number')
    statement = db.select(Dies).where(Dies.tool_number == tool_number)
    dieQuery = db.session.scalars(statement).first()

    if dieQuery:
        if dieQuery.status == DieStatus.in_production: 
            return jsonify({'message' : 'already in production'})

    statement2 = db.select(
        ComponentDetails.detail_number, 
        ComponentDetails.number_used_in_tool, 
        func.count(case((Components.current_state == CurrentState.active, 1))).label('active_component_count')
        ).join(Components
        ).group_by(ComponentDetails.detail_number, ComponentDetails.number_used_in_tool
        ).where(ComponentDetails.tool_number == tool_number and Component.tool_number == tool_number) 
    componentDetailsQuery = db.session.execute(statement2).all()
    try:
        ActiveCountList = {} 
        if componentDetailsQuery:
            for detailNumber in componentDetailsQuery:
                if detailNumber.number_used_in_tool != detailNumber.active_component_count:
                    ActiveCountList[detailNumber.detail_number] = detailNumber.active_component_count 
            if ActiveCountList:
                return jsonify(ActiveCountList)
            statement3 = db.update(Dies).where(Dies.tool_number == tool_number).values(status = DieStatus.in_production).returning(Dies.tool_number, Dies.status)
            updateDieStateQuery = db.session.execute(statement3).all()
            if updateDieStateQuery:
                db.session.commit()
                return jsonify({'message' : 'successfully started production run'}) 
    except:
        return jsonify({'message' : 'error starting production run'})    

@app.route('/endProductionRun', methods=['POST'])
def end_production_run():
    data = request.get_json()
    tool_number = data.get('tool_number')
    number_of_hits = data.get('number_of_hits')
    statement = db.select(Dies).where(Dies.tool_number == tool_number)
    dieQuery = db.session.scalars(statement).first()
    if dieQuery:
        if dieQuery.status != DieStatus.in_production:
            print('not in production')
            return jsonify('not in production')
    statement2 = db.update(Components
    ).where(Components.tool_number == tool_number and Component.current_state == CurrentState.active
    ).values(current_hits = Components.current_hits + number_of_hits, lifetime_hits = Components.lifetime_hits + number_of_hits
    ).returning(Components.current_hits, Components.lifetime_hits)
    updateHitsQuery = db.session.execute(statement2).first()
    try:
        if updateHitsQuery:
            statement3 = db.update(Dies).where(Dies.tool_number == tool_number).values(status = DieStatus.not_serviced).returning(Dies.tool_number, Dies.status)
            updateDieStateQuery = db.session.execute(statement3).first()
            print(updateDieStateQuery)
            print('ss')
            if updateDieStateQuery:
                print('yes')
                db.session.commit()
                return jsonify({'message' : 'production run ended successfully'})
    except:
        return jsonify('error stopping production run')


@app.route('/grindComponent', methods=['POST'])
def grind_Component():
    data = request.get_json()
    tool_number = data.get('tool_number')
    detail_number = data.get('detail_number')
    build_number = data.get('build_number')
    component_number = data.get('component_number')
    material_removed = data.get('material_removed')
    statement = db.update(Components
        ).where(Components.detail_number == detail_number
        ).where(Components.tool_number == tool_number
        ).where(Components.build_number == build_number
        ).where(Components.component_number == component_number
        ).values(current_height=Components.current_height - material_removed, current_hits = 0
        ).returning(Components.current_height, Components.current_state) 
    component_update_current_height = db.session.execute(statement).first()
    print(component_update_current_height)
    if component_update_current_height.current_state == CurrentState.active:
        return jsonify('component is currently active')
    try:
        if component_update_current_height: 
            statement2 = db.insert(OperationsLog).values(
                employee_id=session.get('employee_id'),
                date=datetime.datetime.now()
            ).returning(OperationsLog.operation_id) 
            update_operations_log = db.session.execute(statement2).first()  
            if (update_operations_log): 
                statement3 = db.insert(UpdateComponentCurrentHeight).values(
                    operation_id=update_operations_log.operation_id,
                    tool_number=tool_number,
                    detail_number=detail_number,
                    build_number=build_number,
                    component_number=component_number,
                    old_height=component_update_current_height.current_height + float(material_removed), 
                    new_height=component_update_current_height.current_height
                ) 
                update_update_current_height = db.session.execute(statement3)
                if (update_update_current_height):
                    db.session.commit()
                    return jsonify({'message': f'removed {material_removed} successfully'})
    except:
        return jsonify({'message': 'Component not found'})

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)
