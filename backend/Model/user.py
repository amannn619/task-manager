from Database.database import Database
from Utils.utils import Utils
import jwt
from datetime import datetime, timedelta
import time
import secrets


class Session:
    def __init__(self, session_id, user_id, token, expires_at):
        self.session_id = session_id
        self.user_id = user_id
        self.token = token
        self.expires_at = expires_at


class User:

    def __init__(self, name, username, password, user_id=None):
        self.name = name
        self.username = username
        self.password = password
        self.user_id = user_id
        # self.session = []

    def generate_access_token(self, secret_key):
        payload = {'user_id': self.user_id,
                   'exp': datetime.utcnow() + timedelta(minutes=15)
                   }
        token = jwt.encode(payload, secret_key, algorithm='HS256')
        return token

    def generate_refresh_token(self):
        return secrets.token_hex(32)

    def create_session(self):
        refresh_token = self.generate_refresh_token()
        expires_at = Utils.generate_refresh_token_expiry_time()
        db = Database()
        session_id = db.create_session(self, refresh_token, expires_at)
        session = Session(session_id, self.user_id, refresh_token, expires_at)
        return session

    def add_user(self):
        db = Database()
        user_id = user_id = db.add_user(self)
        if isinstance(user_id, int):
            self.user_id = user_id
            return self
        else:
            return False

    @staticmethod
    def create_user(name, username, password):
        db = Database()
        password = Utils.hash_password(password)
        user = User(name, username, password)
        user = user.add_user()
        return user

    @staticmethod
    def get_user_by_id_and_token(user_id, token):
        db = Database()
        user_dict = db.get_user_by_id_and_token(user_id, token)
        if user_dict and user_dict['user_id']:
            user = User(user_dict['name'], user_dict['username'],
                        user_dict['password'], user_id=user_dict['user_id'])
            return user
        return user_dict

    @staticmethod
    def get_user_from_credentials(username, password):
        db = Database()
        password = Utils.hash_password(password)
        user_dict = db.get_user_from_credentials(username, password)
        if user_dict and user_dict['user_id']:
            user = User(user_dict['name'], user_dict['username'],
                        user_dict['password'], user_id=user_dict['user_id'])
            return user
        return user_dict

    @staticmethod
    def get_session_by_token(token):
        db = Database()
        session_dict = db.get_session_by_token(token)
        return session_dict

    @staticmethod
    def has_refresh_token_expired(expires_at):
        seconds_since_epoch = int(time.time())
        return expires_at <= seconds_since_epoch
