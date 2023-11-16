import time
import hashlib


class Utils:
    @staticmethod
    def hash_password(password):
        hasher = hashlib.sha256()
        hasher.update(password.encode('utf-8'))
        return hasher.hexdigest()

    @staticmethod
    def generate_refresh_token_expiry_time():
        days_until_expire = 10
        seconds_until_expire = days_until_expire * 24 * 60 * 60
        return int(time.time()) + seconds_until_expire
