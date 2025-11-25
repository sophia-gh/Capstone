
1. **navigate to `flask-server` directory**
2. **create the virtual environment for the flask server**
    ``` cmd
    python3 -m venv venv
    ```

3. **activate the virtual environment**
    ``` cmd
    source venv/bin/activate
    ```
    *if successfull the tag `(venv)` will appear before the path on the command line* 

4. **in your virtual environment, install Flask**
    ``` cmd
    pip install Flask
    pip install gunicorn
    pip install sqlalchemy
    pip install psycopg2
    ```
5. **in your flask-server directory create a folder called instance and inside create a file called config.py and enter code below. Create a unique secret key and enter your postgres username/password/database name in sqlalchemy_database_uri**
    ```
    DEBUG = False
    TESTING = False
    SECRET_KEY = 'secret key here'

    SQLALCHEMY_DATABASE_URI = "postgresql://username:password@localhost:5432/databaseName"
    SQLACLHEMY_ECHO = True 
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    ```

6. **install postgres and migrate schema.sql to your database**
   
    *for instructions installing postgres and migrating schema, head to https://www.postgresql.org/docs/

5. **in you terminal start local server**
    ````    
    flask --app server run --debug 
    ````
    *this will start the server on local host, debug is optional*

7. **in a seperate terminal, navigate to the `client` directory**

8. **install dependencies**
    ``` cmd
    npm install
    ```
9. **run the npm start command to start the flask app on local host**
    ``` cmd
    npm start
    ```
    *if successful it will open a browser to the local host url the app is running in*
    *alternatively, click the local host or network link*

10. **the api example page should display the data stored in the server.py file, should look like this** 
    *on this page do `ctrl + shift + i` and click `console` to see console output for debugging*

## Clean Up After Running
1. Navigate to the terminal where your virtual environment is running and deactivate your virtual environment
    ```cmd
    deactivate
    ```
    *if successful the tag `(venv)` will no longer appear before the path on the command line*
2. In the terminal where your react app is running, do `ctrl + c` to kill the process

## Run from gunicorn server
1. **after completing above installation create build of client directory** 
    ```cmd
    npm run build
    ```
    *if successful in your client folder there will be a build folder
2. **from the flask-server directory run gunicorn server**
    ```cmd
    gunicorn -w 4 wsgi:app
    ```
    *if successful you can follow link to webpage

    