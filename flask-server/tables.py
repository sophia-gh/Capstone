
from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy import inspect, DateTime, BigInteger, Identity, ForeignKey 
import datetime
import enum

class Base(DeclarativeBase):
    pass

db = SQLAlchemy(model_class=Base)

class CurrentState(str, enum.Enum):
    active = 'active'
    trash = 'trash'
    not_current_rev = 'not_current_rev'
    missing = 'missing'
    inventory = 'inventory'
    
class Components(db.Model):
    __tablename__ = "components"
    tool_number: Mapped[str] = mapped_column(primary_key=True)
    detail_number: Mapped[str] = mapped_column(primary_key=True)
    build_number: Mapped[str] = mapped_column(primary_key=True)
    component_number: Mapped[int] = mapped_column(primary_key=True)
    revision: Mapped[int]
    lifetime_hits: Mapped[int]
    current_hits: Mapped[int]
    current_height: Mapped[float]
    current_state: Mapped[CurrentState]    

class ComponentDetails(db.Model):
    __tablename__ = "component_details"
    tool_number: Mapped[str] = mapped_column(primary_key=True)
    detail_number: Mapped[str] = mapped_column(primary_key=True)
    min_height: Mapped[float]
    nominal_height: Mapped[float]
    low_quantity: Mapped[int]
    frequency_to_sharpen: Mapped[int]
    description: Mapped[int | None]
    number_used_in_tool: Mapped[int]
    cost: Mapped[float]
    current_revision: Mapped[int]

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

class OperationsLog(db.Model):
    __tablename__ = 'operations_log'
    operations_id: Mapped[int] = mapped_column(BigInteger, Identity(), primary_key=True)
    employee_id: Mapped[int] = mapped_column(ForeignKey("employees.employee_id"))
    date: Mapped[datetime.datetime] = mapped_column(DateTime)

class DieStatus(str, enum.Enum):
    in_production = "in_production"
    serviced = "serviced"
    not_serveiced = "not_serviced"

class Dies(db.Model):
    __tablename__ = "dies"
    tool_number: Mapped[str] = mapped_column(primary_key=True)
    punch_depth: Mapped[float]
    material_thickness: Mapped[float]
    company: Mapped[str] =  mapped_column(nullable=False)
    status: Mapped[DieStatus]
    
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
    operations_id: Mapped[int] = mapped_column(BigInteger, Identity(), primary_key=True)
    tool_number: Mapped[str] = mapped_column(primary_key=True)   
    detail_number: Mapped[str] = mapped_column(primary_key=True)
    build_number: Mapped[str] = mapped_column(primary_key=True)
    component_number: Mapped[int] = mapped_column(primary_key=True)

class InsertComponentDetails(db.Model):
    __tablename__ = "insert_component_details" 
    
    tool_number: Mapped[str] = mapped_column(primary_key=True)   
    detail_number: Mapped[str] = mapped_column(primary_key=True)
    build_number: Mapped[str] = mapped_column(primary_key=True)

class UpdateComponentsDetails(db.Model):
    __tablename__ = "update_component_details" 
    operations_id: Mapped[int] = mapped_column(BigInteger, Identity(), primary_key=True)
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

class UpdateComponentCurrentHeight(db.Model):
    __tablename__ = "update_component_current_height"   
    operations_id: Mapped[int] = mapped_column(BigInteger, Identity(), primary_key=True)
    tool_number: Mapped[str] = mapped_column(primary_key=True)   
    detail_number: Mapped[str] = mapped_column(primary_key=True)
    build_number: Mapped[str] = mapped_column(primary_key=True)
    component_number: Mapped[int] = mapped_column(primary_key=True)
    old_current_height: Mapped[float]
    old_current_height: Mapped[float] 

class UpdateComponentRevision(db.Model):
    __tablename__ = "update_component_revision"     
    operations_id: Mapped[int] = mapped_column(BigInteger, Identity(), primary_key=True)
    tool_number: Mapped[str] = mapped_column(primary_key=True)   
    detail_number: Mapped[str] = mapped_column(primary_key=True)
    build_number: Mapped[str] = mapped_column(primary_key=True)
    component_number: Mapped[int] = mapped_column(primary_key=True)
    old_revision: Mapped[int]
    new_reivision: Mapped[int] 

class UpdateComponetState(db.Model):
    __tablename__ = "update_component_state"     
    operations_id: Mapped[int] = mapped_column(BigInteger, Identity(), primary_key=True)
    tool_number: Mapped[str] = mapped_column(primary_key=True)   
    detail_number: Mapped[str] = mapped_column(primary_key=True)
    build_number: Mapped[str] = mapped_column(primary_key=True)
    component_number: Mapped[int] = mapped_column(primary_key=True)
    old_state: Mapped[int]
    new_state: Mapped[int]
    description: Mapped[str]

def model_to_dict(obj): 
    return {c.key: getattr(obj, c.key) for c in db.inspect(obj).mapper.column_attrs}