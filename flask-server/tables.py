
from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy import inspect, DateTime, BigInteger, Identity, ForeignKey
import datetime


class Base(DeclarativeBase):
    pass

db = SQLAlchemy(model_class=Base)

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
    current_state: Mapped[int]
    
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

class Employees(db.Model):
    __tablename__ = "employees"
    employee_id: Mapped[int] = mapped_column(primary_key=True)
    first_name: Mapped[str]
    last_name: Mapped[str]

class OperationsLog(db.Model):
    __tablename__ = 'operations_log'
    operations_id: Mapped[int] = mapped_column(BigInteger, Identity(), primary_key=True)
    employee_id: Mapped[int] = mapped_column(ForeignKey("employees.employee_id"))
    date: Mapped[datetime.datetime] = mapped_column(DateTime)

class Dies(db.Model):
    __tablename__ = "dies"
    tool_number: Mapped[str] = mapped_column(primary_key=True)
    punch_depth: Mapped[float]
    material_thickness: Mapped[float]
    company: Mapped[str] =  mapped_column(nullable=False)

def model_to_dict(obj): 
    return {c.key: getattr(obj, c.key) for c in db.inspect(obj).mapper.column_attrs}