import argparse
from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from tables import *

parser = argparse.ArgumentParser(description="Run Flask app with custom DB credentials")
parser.add_argument("--password", required=True, help="Database password")
parser.add_argument("--database", default="tooldbdev", help="Database name (default: tooldbdev)")
args = parser.parse_args()

db_uri = f"postgresql://postgres:{args.password}@{args.database}"

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = db_uri
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(model_class=Base)
db.init_app(app)

@app.route("/getAllDiesFromCompany", methods=['POST'])
def get_AllDiesFromCompany():
    data = request.get_json()
    company = data.get('company')
    statement = db.select(Dies).where(Dies.company == company)
    die_query = db.session.scalars(statement).all() 
    dies_dict = [model_to_dict(Die) for Die in die_query]
    return jsonify(dies_dict)

    
@app.route("/getComponentsForDie", methods=['POST'])
def get_ComponentsForDie():
    data = request.get_json()
    tool_number = data.get('tool_number')
    statement = db.select(Components).where(Components.tool_number == tool_number)
    components_query = db.session.scalars(statement).all() 
    components_dict = [model_to_dict(component) for component in components_query]  
    return jsonify(components_dict) 

@app.route("/getAllComponentDetailsForDie", methods=['POST'])
def get_AllComponentDetailsForDie():
    data = request.get_json()
    tool_number = data.get('tool_number')
    statement = db.select(ComponentDetails).where(ComponentDetails.tool_number == tool_number)
    component_details_query = db.session.scalars(statement).all() 
    component_details_dict = [model_to_dict(ComponentDetail) for ComponentDetail in component_details_query]
    return jsonify(component_details_dict)

@app.route("/getAllDetailNumbersForDie", methods=['POST'])
def get_AllDetailNumbersForDie():
    data = request.get_json()
    tool_number = data.get('tool_number')
    statement = db.select(ComponentDetails.detail_number).where(ComponentDetails.tool_number == tool_number)
    component_details_query = db.session.scalars(statement).all() 
    component_details_dict = [model_to_dict(ComponentDetail) for ComponentDetail in component_details_query]
    return jsonify(component_details_dict)

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)