from flask import Flask
from .extensions import db
from .blueprints.actions import actions_bp
from .blueprints.tooling import tooling_bp
from .blueprints.login import login_bp
from .blueprints.admin import admin_bp
from flask import send_from_directory

def create_app():
    app = Flask(__name__, static_folder='../client/build', static_url_path='/', instance_relative_config=True)
    app.config.from_pyfile('config.py')  
    db.init_app(app)
    app.register_blueprint(actions_bp)
    app.register_blueprint(tooling_bp)
    app.register_blueprint(login_bp)
    app.register_blueprint(admin_bp)

    @app.route("/")
    def react_build():
        return send_from_directory(app.static_folder, 'index.html')

    return app
