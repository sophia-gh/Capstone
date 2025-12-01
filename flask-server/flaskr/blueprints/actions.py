from ..extensions import db
from ..tables import *
from flask import jsonify, request, session, send_from_directory, Blueprint 
from werkzeug.security import generate_password_hash, check_password_hash
import datetime 
import traceback

actions_bp = Blueprint('actions_bp', __name__)

@actions_bp.route('/startProductionRun', methods=['POST'])
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
        ).where(ComponentDetails.tool_number == tool_number and Components.tool_number == tool_number) 
    componentDetailsQuery = db.session.execute(statement2).all()
    try:
        ActiveCountList = {} 
        if componentDetailsQuery:
            for detailNumber in componentDetailsQuery:
                print(f"Checking detail {detailNumber}: used={detailNumber.number_used_in_tool}, active={detailNumber.active_component_count}")
                
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

@actions_bp.route('/endProductionRun', methods=['POST'])
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
    ).where(Components.tool_number == tool_number
    ).where(Components.current_state == CurrentState.active
    ).values(current_hits = Components.current_hits + number_of_hits, lifetime_hits = Components.lifetime_hits + number_of_hits
    ).returning(Components.current_hits, Components.lifetime_hits)
    updateHitsQuery = db.session.execute(statement2).first()
    try:
        if updateHitsQuery:
            statement3 = db.update(Dies).where(Dies.tool_number == tool_number).values(status = DieStatus.not_serviced).returning(Dies.tool_number, Dies.status)
            updateDieStateQuery = db.session.execute(statement3).first()
            print(updateDieStateQuery)
            if updateDieStateQuery:
                db.session.commit()
                return jsonify({'message' : 'production run ended successfully'})
    except:
        return jsonify('error stopping production run')

@actions_bp.route("/serviceDie", methods=['POST'])
def service_die():
    data  = request.get_json()
    tool_number = data.get('tool_number')
    statement = db.select(Dies).where(Dies.tool_number == tool_number)
    dieQuery = db.session.scalars(statement).first()

    if dieQuery:
        if dieQuery.status == DieStatus.in_production: 
            return jsonify({'message' : 'die in production'})

    statement2 = db.select(
        ComponentDetails.detail_number, 
        ComponentDetails.number_used_in_tool, 
        func.count(case((Components.current_state == CurrentState.active, 1))).label('active_component_count')
        ).join(Components
        ).group_by(ComponentDetails.detail_number, ComponentDetails.number_used_in_tool
        ).where(ComponentDetails.tool_number == tool_number and Components.tool_number == tool_number) 
    componentDetailsQuery = db.session.execute(statement2).all()
    try:
        ActiveCountList = {} 
        if componentDetailsQuery:
            for detailNumber in componentDetailsQuery:
                print(f"Checking detail {detailNumber}: used={detailNumber.number_used_in_tool}, active={detailNumber.active_component_count}")
                
                if detailNumber.number_used_in_tool != detailNumber.active_component_count:
                    ActiveCountList[detailNumber.detail_number] = detailNumber.active_component_count 
            if ActiveCountList:
                return jsonify({'message' : 'current number of active components does not meet required number for production'})

            statement3 = db.update(Dies).where(Dies.tool_number == tool_number).values(status = DieStatus.serviced).returning(Dies.tool_number, Dies.status)
            updateDieStateQuery = db.session.execute(statement3).all()
            if updateDieStateQuery:
                db.session.commit()
                return jsonify({'message' : 'successfully serviced die'}) 
    except:
        return jsonify({'message' : 'error run'})    

@actions_bp.route('/grindComponent', methods=['POST'])
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
        return jsonify({'message': 'component is currently active'})
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
                    return jsonify({'message': f'removed {material_removed} from component'})
    except:
        return jsonify({'message': 'Component not found'})

@actions_bp.route('/updateComponentState', methods=['POST'])
def update_component_state():
    data = request.get_json()
    tool_number = data.get('tool_number')
    detail_number = data.get('detail_number')
    build_number = data.get('build_number')
    component_number = data.get('component_number')
    current_state = data.get('current_state')
    new_state = data.get('new_state')
    print('Current State:', current_state)
    # Check if die is in production when setting component to active
    if new_state == 'active':
        checkInProduction = db.select(Dies).where(Dies.tool_number == tool_number)
        checkInProductionQuery = db.session.scalars(checkInProduction).first()
        if checkInProductionQuery:
            if checkInProductionQuery.status == DieStatus.in_production: 
                return jsonify({'message' : 'cannot update component state to active while die in production'})
    # Check if die is in production and previous state is active
    if current_state == 'active':
        checkInProduction = db.select(Dies).where(Dies.tool_number == tool_number)
        checkInProductionQuery = db.session.scalars(checkInProduction).first()
        if checkInProductionQuery:
            if checkInProductionQuery.status == DieStatus.in_production: 
                return jsonify({'message' : 'cannot update component state from active while die in production'})
    statement = db.select(Components).where(
        Components.tool_number == tool_number,
        Components.detail_number == detail_number,
        Components.build_number == build_number,
        Components.component_number == component_number
    )
    current_component = db.session.scalars(statement).first()
    if not current_component:
        return jsonify({'message': 'Component not found'})
    old_state = current_component.current_state
    state_enum = CurrentState[new_state]
    try:
        statement1 = (
            db.update(Components
            ).where(Components.tool_number == tool_number
            ).where(Components.detail_number == detail_number
            ).where(Components.build_number == build_number
            ).where(Components.component_number == component_number
            ).values(current_state=state_enum
            ).returning(Components.component_number)
        )
        result = db.session.execute(statement1).first()
        if not result:
            return jsonify({'message': 'Component unchanged'})
        statement2 = db.insert(OperationsLog).values(
            employee_id=session.get('employee_id'),
            date=datetime.datetime.now()
        ).returning(OperationsLog.operation_id) 
        update_operations_log = db.session.execute(statement2).first()  
        if not update_operations_log:
            return jsonify({'message': 'Error logging operation'})
        description_text = f"Changed from {old_state} to {state_enum.name}"
        statement3 = db.insert(UpdateComponentState).values(
            operation_id=update_operations_log.operation_id,
            tool_number=tool_number,
            detail_number=detail_number,
            build_number=build_number,
            component_number=component_number,
            old_state=old_state, 
            new_state=state_enum,
            description=description_text
        )
        update_current_state = db.session.execute(statement3)
        if (update_current_state):
            db.session.commit()
            return jsonify({"message": "state updated", "new_state": new_state})

    except Exception as e:
        traceback.print_exc(e)
        return jsonify({'message': 'error updating component state'})

    









