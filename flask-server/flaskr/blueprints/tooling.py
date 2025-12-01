from ..extensions import db
from ..tables import *
from flask import jsonify, request, Blueprint 
import traceback
from sqlalchemy import Column, String, text
from sqlalchemy.sql import func, literal_column

tooling_bp = Blueprint('tooling_bp', __name__)

@tooling_bp.route("/getAllComponentsForAllDies", methods=["GET"])
def get_all_components_for_all_dies():
    comps = Components.query.all()
    return jsonify([model_to_dict(c) for c in comps])

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
            # revision=1, automatically done in db
            lifetime_hits=0,
            current_hits=0,
            # current_height=nominal_height, automatically done in db
            current_state=CurrentState.inventory
        )
        db.session.add(new_component)
        db.session.commit()
        return jsonify({'message': 'added component successfully'}, {'message2': f'Added component {new_component.tool_number}-{new_component.detail_number}-b{new_component.build_number}-{new_component.component_number} successfully'})
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

@tooling_bp.route("/getOperationsForDie", methods=['POST'])
def get_OperationsLogForDie():
    data = request.get_json()
    tool_number = data.get('tool_number')
    sql_statement = text("""select operations_log.*,
                            case
                            when exists(
                            select 1
                            from operations_log
                            left join insert_component
                            on operations_log.operation_id = insert_component.operation_id
                            ) then 'insert component'
                            end as description
                            from operations_log 
                            inner join insert_component
                            on operations_log.operation_id = insert_component.operation_id
                            where insert_component.tool_number = :tool_number
                            union all
                            select operations_log.*,
                            case
                            when exists(
                            select 1
                            from operations_log
                            left join insert_component_details
                            on operations_log.operation_id = insert_component_details.operation_id
                            ) then 'insert component details'
                            end as description
                            from operations_log
                            inner join insert_component_details
                            on operations_log.operation_id = insert_component_details.operation_id
                            where insert_component_details.tool_number = :tool_number
                            union all
                            select operations_log.*,
                            case
                            when exists(
                            select 1
                            from operations_log
                            left join update_component_current_height
                            on operations_log.operation_id = update_component_current_height.operation_id
                            ) then 'update component current height'
                            end as description
                            from operations_log
                            inner join update_component_current_height
                            on operations_log.operation_id = update_component_current_height.operation_id
                            where update_component_current_height.tool_number = :tool_number
                            union all
                            select operations_log.*,
                            case
                            when exists(
                            select 1
                            from operations_log
                            left join update_component_details
                            on operations_log.operation_id = update_component_details.operation_id
                            ) then 'update component details'
                            end as description
                            from operations_log
                            inner join update_component_details
                            on operations_log.operation_id = update_component_details.operation_id 
                            where update_component_details.tool_number = :tool_number
                            union all
                            select operations_log.*,
                            case
                            when exists(
                            select 1
                            from operations_log
                            left join update_component_revision
                            on operations_log.operation_id = update_component_revision.operation_id
                            ) then 'update component revision'
                            end as description
                            from operations_log
                            inner join update_component_revision
                            on operations_log.operation_id = update_component_revision.operation_id
                            where update_component_revision.tool_number = :tool_number
                            union all
                            select operations_log.*,
                            case
                            when exists(
                            select 1
                            from operations_log
                            left join update_component_state
                            on operations_log.operation_id = update_component_state.operation_id
                            ) then 'update component state'
                            end as description
                            from operations_log
                            inner join update_component_state
                            on operations_log.operation_id = update_component_state.operation_id 
                            where update_component_state.tool_number = :tool_number;""")
    
    operations_log_query = db.session.execute(sql_statement, {"tool_number": tool_number}).all() 
    operationsLogList = [dict(operations_log._mapping) for operations_log in operations_log_query]
    return jsonify(operationsLogList)

@tooling_bp.route("/getComponentsJoinComponentDetails", methods=['POST'])
def get_ComponentsJoinComponentDetails():
    data = request.get_json()
    tool_number = data.get('tool_number')
    sql_statement = text("""select t1.detail_number, t1.build_number, t1.component_number, 
                            t1.revision, t1.lifetime_hits, t1.current_hits, t1.current_height,
                            t1.current_state, t2.min_height, t2.nominal_height, t2.low_quantity, 
                            t2.frequency_to_sharpen, t2.description, t2.number_used_in_tool, t2.cost, 
                            t2.current_revision from components as t1 join component_details as t2 on 
                            t1.detail_number = t2.detail_number where t1.tool_number = :tool_number and t2.tool_number = :tool_number;""")
    
    components_query = db.session.execute(sql_statement, {"tool_number": tool_number}).all() 
    componentsList = [dict(component._mapping) for component in components_query]
    return jsonify(componentsList)

@tooling_bp.route("/removeComponent", methods=['POST'])
def remove_Component():
    data = request.get_json()
    tool_number = data.get('tool_number')
    detail_number = data.get('detail_number')
    build_number = data.get('build_number')
    component_number = data.get('component_number')
    try:
        statement = db.delete(Components).where(
            Components.tool_number == tool_number,
            Components.detail_number == detail_number,
            Components.build_number == build_number,
            Components.component_number == component_number
        ).returning(Components.tool_number, Components.current_state)
        delete_component_query = db.session.execute(statement).first()
        print(delete_component_query.current_state)
        if delete_component_query:
            if delete_component_query.current_state == CurrentState.active:
                return jsonify({'message': 'cannot remove component while it is active'})
            db.session.commit()
            return jsonify({'message': 'removed component successfully'})
        else:
            return jsonify({'message': 'component not found'})
    except:
        traceback.print_exc()
        return jsonify({'message': 'error removing component'})

@tooling_bp.route("/getDieState", methods=['POST'])
def get_DieState():
    data = request.get_json()
    tool_number = data.get('tool_number')
    try:
        statement = db.select(Dies.status).where(Dies.tool_number == tool_number)
        die_state_query = db.session.scalars(statement).first()
        if die_state_query:
            print(die_state_query)
            return jsonify({'message': die_state_query})
        else:
            return jsonify({'message': 'die not found'})
    except:
        traceback.print_exc()
        return jsonify({'message': 'error retrieving die state'})