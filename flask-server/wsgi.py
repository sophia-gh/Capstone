import sys
import flaskr
# from flaskr import create_app
# sys.path.insert(0, './flaskr')
app = flaskr.create_app()
# from flaskr import create_app
if __name__ == "__main__":
    # create_app = flaskr.create_app()
    # create_app.run()
    flaskr.create_app.run()
# app = create_app()
