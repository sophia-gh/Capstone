import argparse
from flask import Flask, jsonify, request, session
from flask_sqlalchemy import SQLAlchemy
from tables import *

app = Flask(__name__, instance_relative_config=True)
app.config.from_pyfile('config.py')    

db = SQLAlchemy(model_class=Base)
db.init_app(app)

@app.route("/login", methods=['POST'])
def login():
    data = request.get_json()
    employee_id= data.get('employee_id')
    password = data.get('password')  
    statement = db.select(Employees).where(Employees.employee_id == employee_id).where(Employees.password == password)
    user_query = db.session.scalars(statement).first()  
    if not user_query:
        return jsonify({'user': False})
    session['employee_id'] = user_query.employee_id
    session['first_name'] = user_query.first_name
    session['last_name'] = user_query.last_name
    print(f"Current session: {session}")
    return jsonify({'user': True})

@app.route('/logout')
def logout():
    session.pop('employee_id', None)
    session.pop('first_name', None)
    session.pop('last_name', None)
    return jsonify({'message': 'Logged out successfully'})

@app.route("/getAllDies") 
def get_AllDies(): 
    statement = db.select(Dies) 
    die_query = db.session.scalars(statement).all() 
    dies_dict = [model_to_dict(Die) for Die in die_query]
    return jsonify(dies_dict)

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
    component_dict = [model_to_dict(Component) for Component in component_query]
    return jsonify(component_details_dict)
    
if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)