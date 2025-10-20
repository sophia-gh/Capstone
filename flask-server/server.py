from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from tables import *

db = SQLAlchemy(model_class=Base)
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:databa53KEy@localhost:5432/toolingInventory'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

@app.route("/getDies")
def get_dies():
    die_query= db.session.scalars(db.select(Dies)).all() 
    dies_dict = [model_to_dict(Die) for Die in die_query]
    return jsonify(dies_dict)

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)

