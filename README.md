# Capstone
Github Repository for Capstone Fall 2025 Project

### To Run Inital Starter code (In WSL Ubuntu)
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
    ```

5. **from the virtual environment, run the server.py file**
    ``` cmd
    python3 server.py --password [your password] --database [your database]
    ```
    **alternatively run Flask command** *not sure if this will work with the command line args*
    ````    
    flask --app server run --debug 
    ````
    *this will start the server on local host*

6. **in a seperate terminal, navigate to the `client` directory**

7. **install dependencies**
    ``` cmd
    npm install
    ```
8. **run the npm start command to start the flask app on local host**
    ``` cmd
    npm start
    ```
    *if successful it will open a browser to the local host url the app is running in*
    *alternatively, click the local host or network link*

9. **the api example page should display the data stored in the server.py file, should look like this** 
    *on this page do `ctrl + shift + i` and click `console` to see console output for debugging*

## Clean Up After Running
1. Navigate to the terminal where your virtual environment is running and deactivate your virtual environment
    ```cmd
    deactivate
    ```
    *if successfull the tag `(venv)` will no longer appear before the path on the command line*
2. In the terminal where your react app is running, do `ctrl + c` to kill the process

