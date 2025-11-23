from ..extensions import db
from ..tables import *
from flask import jsonify, request, Blueprint 
import traceback

tooling_bp = Blueprint('tooling_bp', __name__)

# select * from dies where company;
@tooling_bp.route("/getAllDiesFromCompany", methods=['POST'])
def get_AllDiesFromCompany():
    data = request.get_json()
    company = data.get('company')
    statement = db.select(Dies).where(Dies.company == company)
    die_query = db.session.scalars(statement).all() 
    dies_dict = [model_to_dict(Die) for Die in die_query]
    return jsonify(dies_dict)

#select * from components where tool_number = '607636044-5';
@tooling_bp.route("/getComponentsForDie", methods=['POST'])
def get_ComponentsForDie():
    data = request.get_json()
    tool_number = data.get('tool_number')
    statement = db.select(Components).where(Components.tool_number == tool_number)
    components_query = db.session.scalars(statement).all() 
    components_dict = [model_to_dict(component) for component in components_query]  
    return jsonify(components_dict) 
    
# select * from component_details where tool_number = '607636044-5';
@tooling_bp.route("/getAllComponentDetailsForDie", methods=['POST'])
def get_AllComponentDetailsForDie():
    data = request.get_json()
    tool_number = data.get('tool_number')
    statement = db.select(ComponentDetails).where(ComponentDetails.tool_number == tool_number)
    component_details_query = db.session.scalars(statement).all() 
    component_details_dict = [model_to_dict(ComponentDetail) for ComponentDetail in component_details_query]
    return jsonify(component_details_dict)
    
# select detail_number from component_details where tool_number = '607636044-5';
@tooling_bp.route("/getAllDetailNumbersForDie", methods=['POST'])
def get_AllDetailNumbersForDie():
    data = request.get_json()
    tool_number = data.get('tool_number')
    statement = db.select(ComponentDetails.detail_number).where(ComponentDetails.tool_number == tool_number)
    component_details_query = db.session.scalars(statement).all() 
    component_details_dict = [model_to_dict(ComponentDetail) for ComponentDetail in component_details_query]
    return jsonify(component_details_dict)
    
# select distinct company from dies;
@tooling_bp.route("/getAllCompanies")
def get_AllCompanies():
    statement = db.select(Dies.company).distinct()
    companies_query = db.session.scalars(statement).all()
    companies_dict = [model_to_dict(company) for company in companies_query]
    return jsonify(companies_dict)

# select * from components where status = 'active' and tool_number = '607636044-5'; 
@tooling_bp.route("/getAllActiveComponentsForDie", methods=['POST'])
def get_AllActiveComponentsForDie():
    data = request.get_json()
    tool_number = data.get('tool_number')
    status = data.get('status')
    statement = db.select(Components.status).where(Components.status == 'active').where(Components.tool_number == tool_number)
    component_details_query = db.session.scalars(statement).all() 
    component_details_dict = [model_to_dict(Component) for Component in component_details_query]
    return jsonify(component_details_dict)

@tooling_bp.route('/addComponent', methods=['POST'])
def add_component():
    data = request.get_json()
    tool_number = data.get('tool_number')
    detail_number = data.get('detail_number')
    component_number = data.get('component_number')
    try:
        if not tool_number or not detail_number or not component_number:
            return jsonify({'message': 'Missing required fields'})

        statement = db.select(ComponentDetails).where(
            ComponentDetails.tool_number == tool_number,
            ComponentDetails.detail_number == detail_number
        )
        detail_obj = db.session.scalars(statement).first()
        if not detail_obj:
            return jsonify({'message': 'Detail number not found for this die'})
        nominal_height = detail_obj.nominal_height
        statement2 = db.select(func.max(Components.build_number)).where(
            Components.tool_number == tool_number
        )
        last_build = db.session.scalar(statement2)
        last_build_int = int(last_build) if last_build is not None else 0
        next_build_number = last_build_int + 1
        next_build_number_str = str(next_build_number)
        new_component = Components(
            tool_number=tool_number,
            detail_number=detail_number,
            component_number=component_number,
            build_number=next_build_number_str,
            revision=1,
            lifetime_hits=0,
            current_hits=0,
            current_height=nominal_height,
            current_state=CurrentState.active
        )
        db.session.add(new_component)
        db.session.commit()
        return jsonify({'message': 'added component successfully'})
    except:
        traceback.print_exc()
        return jsonify({'message': 'error adding component'})

# select * from dies;
@tooling_bp.route("/getAllDies") 
def get_AllDies(): 
    statement = db.select(Dies) 
    die_query = db.session.scalars(statement).all() 
    dies_dict = [model_to_dict(Die) for Die in die_query]
    return jsonify(dies_dict)