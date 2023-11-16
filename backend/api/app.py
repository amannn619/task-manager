from datetime import datetime
from flask import Flask, jsonify, request, render_template, redirect, session, url_for
from flask_cors import CORS
from Model.user import User
from Utils.utils import Utils
from Database.database import Database
import jwt
from functools import wraps

app = Flask(__name__)
CORS(app, expose_headers=["x-access-token", "x-refresh-token"])
secret_key = "asdf"

# middleware


def authenticate(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        access_token = request.headers.get('x-access-token')

        if not access_token:
            return jsonify({"message": "Token is missing"}), 401
        try:
            decoded_token = jwt.decode(
                access_token, secret_key, algorithms=["HS256"])
            user_id = decoded_token['user_id']
            return func(user_id, *args, **kwargs)
        except jwt.ExpiredSignatureError:
            return jsonify({"message": "Token has expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': "InvalidToken"}), 401
        except Exception as e:
            return jsonify({'message': f"e"}), 401
    return wrapper


def verify_session(func):
    @wraps(func)
    def verify_session(*args, ** kwargs):
        refresh_token = request.headers.get('x-refresh-token')
        user_id = request.headers.get('user-id')
        if not (refresh_token and user_id):
            return jsonify({'error': 'User ID and Refresh Token are required in the header'}), 401
        session = User.get_session_by_token(refresh_token)
        if not session:
            return jsonify({"message": "invalid token"})
        user = User.get_user_by_id_and_token(user_id, refresh_token)
        if not user:
            return jsonify({'message': 'user_id and token mismatch'}), 401

        expired = User.has_refresh_token_expired(session['expires_at'])
        if expired:
            return jsonify({'message': 'session expired'}), 401

        return func(user, *args, **kwargs)
    return verify_session


@app.route("/")
def index():
    return "index route"


@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    name = data.get('name')
    username = data.get('username')
    password = data.get('password')
    if not (name or username or password):
        return jsonify("insufficient data"), 406

    user = User.create_user(name, username, password)

    if user == False:
        return jsonify({"message": f"username is already taken.", "success": False}), 409

    session = user.create_session()
    access_token = user.generate_access_token(secret_key)
    response = jsonify(
        {"user_id": user.user_id, "name": user.name, "username": user.username})
    response.headers['x-refresh-token'] = session.token
    response.headers['x-access-token'] = access_token
    return response, 200


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"message": "insufficient data"}), 406

    db = Database()
    user = User.get_user_from_credentials(username, password)
    if user:
        session = user.create_session()
        access_token = user.generate_access_token(secret_key)
        response = jsonify(
            {"user_id": user.user_id, "name": user.name, "username": user.username})
        response.headers['x-refresh-token'] = session.token
        response.headers['x-access-token'] = access_token
        return response, 200
    return jsonify({"message": "invalid credentials"}), 401


@app.route("/generateAccessToken", methods=['GET'])
@verify_session
def generateAccessToken(user):
    access_token = user.generate_access_token(secret_key)
    response = jsonify({'access-token': access_token})
    response.headers['x-access-token'] = access_token
    return response, 200


@app.route('/addList', methods=['POST'])
@authenticate
def addList(user_id):
    data = request.get_json()
    title = data.get("title")
    db = Database()
    list = db.add_list(user_id, title)
    return jsonify(list), 200


@app.route('/getList', methods=['POST'])
@authenticate
def getList(user_id):
    db = Database()
    list = db.get_list(user_id)
    return jsonify(list), 200


@app.route('/updateList', methods=['POST'])
def updateList():
    data = request.get_json()
    list_id = data.get('list_id')
    title = data.get("title")
    db = Database()
    message = db.update_list(list_id, title)
    return jsonify({'message': message}), 200


@app.route('/deleteList', methods=['POST'])
def deleteList():
    data = request.get_json()
    list_id = data.get('list_id')
    db = Database()
    message = db.delete_list(list_id)
    return jsonify({'message': message}), 200


@app.route('/getTasks', methods=['POST'])
@authenticate
def getTasks(user_id):
    data = request.get_json()
    list_id = data.get('list_id')
    db = Database()
    tasks = db.get_tasks(list_id)
    return jsonify(tasks), 200


@app.route('/addTask', methods=['POST'])
@authenticate
def addTask(user_id):
    data = request.get_json()
    list_id = data.get('list_id')
    task_name = data.get('task')
    db = Database()
    task = db.add_task(list_id, task_name)
    return jsonify(task), 200


@app.route('/updateTask', methods=['POST'])
def updateTask():
    data = request.get_json()
    task_id = data.get('task_id')
    task = data.get('task')
    db = Database()
    message = db.update_task(task_id, task)
    return jsonify(message), 200


@app.route('/completeTask', methods=['POST'])
def completeTask():
    data = request.get_json()
    task_id = data.get('task_id')
    db = Database()
    message = db.complete_task(task_id)
    return jsonify(message), 200


@app.route('/restartTask', methods=['POST'])
def comprestartTaskleteTask():
    data = request.get_json()
    task_id = data.get('task_id')
    db = Database()
    message = db.restart_task(task_id)
    return jsonify(message), 200


@app.route('/deleteTask', methods=['POST'])
def deleteTask():
    data = request.get_json()
    task_id = data.get('task_id')
    db = Database()
    message = db.delete_task(task_id)
    return jsonify({'message': message}), 200


if __name__ == "__main__":
    app.run(debug=True)
