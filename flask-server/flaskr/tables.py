from __future__ import annotations
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import Mapped, mapped_column, relationship, Bundle
from sqlalchemy import inspect, Date, BigInteger, Identity, ForeignKey, Integer, Sequence, func, case, and_
from datetime import date
import enum
from typing import List
from .extensions import db

class CurrentState(str, enum.Enum):
    active = 'active'
    trash = 'trash'
    not_current_rev = 'not_current_rev'
    missing = 'missing'
    inventory = 'inventory'
    
class Components(db.Model):
    __tablename__ = "components"
    tool_number: Mapped[str] = mapped_column(primary_key=True)
    detail_number: Mapped[str] = mapped_column(ForeignKey('component_details.detail_number'), primary_key=True)
    build_number: Mapped[str] = mapped_column(primary_key=True)
    component_number: Mapped[int] = mapped_column(primary_key=True)
    revision: Mapped[int]
    lifetime_hits: Mapped[int]
    current_hits: Mapped[int]
    current_height: Mapped[float]
    current_state: Mapped[CurrentState]    
    parent: Mapped[ComponentDetails] = relationship(back_populates='child')
    
class ComponentDetails(db.Model):
    __tablename__ = "component_details"
    tool_number: Mapped[str] = mapped_column(ForeignKey('dies.tool_number'), primary_key=True)
    detail_number: Mapped[str] = mapped_column(primary_key=True)
    min_height: Mapped[float]
    nominal_height: Mapped[float]
    low_quantity: Mapped[int]
    frequency_to_sharpen: Mapped[int]
    description: Mapped[int | None]
    number_used_in_tool: Mapped[int]
    cost: Mapped[float]
    current_revision: Mapped[int]
    child: Mapped[List[Components]] = relationship(back_populates='parent')
    parent: Mapped[Dies] = relationship(back_populates='children2')

class JobTitle(str, enum.Enum):
    press_tech = "press_tech"
    tool_maker = "tool_maker"
    engineer = "engineer"
    tool_manager = "tool_manager"
    admin = "admin"

class Employees(db.Model):
    __tablename__ = "employees"
    employee_id: Mapped[int] = mapped_column(primary_key=True)
    first_name: Mapped[str]
    last_name: Mapped[str] 
    password: Mapped[str]
    employed: Mapped[bool]
    job_title: Mapped[JobTitle] 
    children: Mapped[List["OperationsLog"]] = relationship(back_populates='parent') 

class OperationsLog(db.Model):
    __tablename__ = 'operations_log'
    operation_id: Mapped[int] = mapped_column(BigInteger, Identity(start=1, cycle=True), primary_key=True)
    employee_id: Mapped[int] = mapped_column(ForeignKey('employees.employee_id'))
    date: Mapped[date] = mapped_column(Date)
    parent: Mapped[Employees] = relationship(back_populates='children')
    child: Mapped["InsertComponent"] = relationship(back_populates='parent')
    child2: Mapped["InsertComponentDetails"] = relationship(back_populates='parent')
    child3: Mapped["UpdateComponentsDetails"] = relationship(back_populates='parent')
    child4: Mapped["UpdateComponentCurrentHeight"] = relationship(back_populates='parent')
    child5: Mapped["UpdateComponentRevision"] = relationship(back_populates='parent')
    child6: Mapped["UpdateComponentState"] = relationship(back_populates='parent')

class DieStatus(str, enum.Enum):
    in_production = "in_production"
    serviced = "serviced"
    not_serviced = "not_serviced"

class Dies(db.Model):
    __tablename__ = "dies"
    tool_number: Mapped[str] = mapped_column(primary_key=True)
    punch_depth: Mapped[float]
    material_thickness: Mapped[float]
    company: Mapped[str] =  mapped_column(nullable=False)
    status: Mapped[DieStatus]
    # children: Mapped[List[Components]] = relationship(back_populates='parent2')
    children2: Mapped[List[ComponentDetails]] = relationship(back_populates='parent')

class DeletedComponents(db.Model):
    __tablename__ = "deleted_components" 
    tool_number: Mapped[str] = mapped_column(primary_key=True)   
    detail_number: Mapped[str] = mapped_column(primary_key=True)
    build_number: Mapped[str] = mapped_column(primary_key=True)
    component_number: Mapped[int] = mapped_column(primary_key=True)
    revision: Mapped[int]
    lifetime_hits: Mapped[int]

class InsertComponent(db.Model):
    __tablename__ = "insert_component"   
    operation_id: Mapped[int] = mapped_column(ForeignKey('operations_log.operation_id'), primary_key=True)
    tool_number: Mapped[str] = mapped_column(primary_key=True)   
    detail_number: Mapped[str] = mapped_column(primary_key=True)
    build_number: Mapped[str] = mapped_column(primary_key=True)
    component_number: Mapped[int] = mapped_column(primary_key=True)
    parent: Mapped[OperationsLog] = relationship(back_populates='child')

class InsertComponentDetails(db.Model):
    __tablename__ = "insert_component_details" 
    operation_id: Mapped[int] = mapped_column(ForeignKey('operations_log.operation_id'), primary_key=True)
    tool_number: Mapped[str] = mapped_column(primary_key=True)   
    detail_number: Mapped[str] = mapped_column(primary_key=True)
    build_number: Mapped[str] = mapped_column(primary_key=True)
    parent: Mapped[OperationsLog] = relationship(back_populates='child2')

class UpdateComponentsDetails(db.Model):
    __tablename__ = "update_component_details" 
    operation_id: Mapped[int] = mapped_column(ForeignKey('operations_log.operation_id'), primary_key=True)
    tool_number: Mapped[str] = mapped_column(primary_key=True)   
    detail_number: Mapped[str] = mapped_column(primary_key=True)
    build_number: Mapped[str] = mapped_column(primary_key=True)
    old_min_height: Mapped[float] 
    old_nominal_height: Mapped[float]
    old_low_quantity: Mapped[int]         
    old_frequency_to_sharpen: Mapped[int] 
    old_description: Mapped[str]          
    old_number_used_in_tool: Mapped[int]  
    old_cost: Mapped[float]                 
    old_current_revision: Mapped[int]     
    new_min_height: Mapped[float]           
    new_nominal_height: Mapped[float]       
    new_low_quantity: Mapped[int]         
    new_frequency_to_sharpen: Mapped[int] 
    new_description: Mapped[str]         
    new_number_used_in_tool: Mapped[int] 
    new_cost: Mapped[float]                
    new_current_revision: Mapped[int] 
    parent: Mapped[OperationsLog] = relationship(back_populates='child3')

class UpdateComponentCurrentHeight(db.Model):
    __tablename__ = "update_component_current_height"   
    operation_id: Mapped[int] = mapped_column(ForeignKey('operations_log.operation_id'), primary_key=True)
    tool_number: Mapped[str] = mapped_column(primary_key=True)   
    detail_number: Mapped[str] = mapped_column(primary_key=True)
    build_number: Mapped[str] = mapped_column(primary_key=True)
    component_number: Mapped[int] = mapped_column(primary_key=True)
    old_height: Mapped[float]
    new_height: Mapped[float] 
    parent: Mapped[OperationsLog] = relationship(back_populates='child4')

class UpdateComponentRevision(db.Model):
    __tablename__ = "update_component_revision"     
    operation_id: Mapped[int] = mapped_column(ForeignKey('operations_log.operation_id'), primary_key=True)
    tool_number: Mapped[str] = mapped_column(primary_key=True)   
    detail_number: Mapped[str] = mapped_column(primary_key=True)
    build_number: Mapped[str] = mapped_column(primary_key=True)
    component_number: Mapped[int] = mapped_column(primary_key=True)
    old_revision: Mapped[int]
    new_revision: Mapped[int] 
    parent: Mapped[OperationsLog] = relationship(back_populates='child5')

class UpdateComponentState(db.Model):
    __tablename__ = "update_component_state"     
    operation_id: Mapped[int] = mapped_column(ForeignKey('operations_log.operation_id'), primary_key=True)
    tool_number: Mapped[str] = mapped_column(primary_key=True)   
    detail_number: Mapped[str] = mapped_column(primary_key=True)
    build_number: Mapped[str] = mapped_column(primary_key=True)
    component_number: Mapped[int] = mapped_column(primary_key=True)
    old_state: Mapped[int]
    new_state: Mapped[int]
    description: Mapped[str]
    parent: Mapped[OperationsLog] = relationship(back_populates='child6')

def model_to_dict(obj): 
    return {c.key: getattr(obj, c.key) for c in db.inspect(obj).mapper.column_attrs}

