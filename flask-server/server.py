import argparse
from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from tables import *

parser = argparse.ArgumentParser(description="Run Flask app with custom DB credentials")
parser.add_argument("--password", required=True, help="Database password")
parser.add_argument("--database", default="tooldbdev", help="Database name (default: tooldbdev)")
args = parser.parse_args()

db_uri = f"postgresql://postgres:{args.password}@/{args.database}"

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = db_uri
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(model_class=Base)
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