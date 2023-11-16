import mysql.connector
import os
import json


class Database:
    database = "taskmanager"
    user = "root"
    password = "root"
    host = "127.0.0.1"
    port = 3306

    def __init__(self):
        self.database = Database.database
        self.user = Database.user
        self.password = Database.password
        self.host = Database.host
        self.port = Database.port
        self.connection = None

    def connect(self):
        try:
            self.connection = mysql.connector.connect(
                database=self.database,
                user=self.user,
                password=self.password,
                host=self.host,
                port=self.port,
            )
        except Exception as e:
            print("Error connecting to database: " + str(e))

    def disconnect(self):
        if self.connection:
            self.connection.close()
            print("DB is disconnected")
            self.connection = None

    def add_user(self, user):
        if self.connection is None:
            self.connect()
        cur = self.connection.cursor()
        try:
            query = "INSERT INTO user (name, username, password) VALUES (%s, %s, %s);"
            values = (user.name, user.username, user.password)
            cur.execute(query, values)
            self.connection.commit()
            cur.execute("SELECT LAST_INSERT_ID();")
            user_id = cur.fetchone()[0]
            return user_id
        except Exception as e:
            return {"message": f"{e}"}

    # def check_username_exists(self, username):
    #     if self.connection is None:
    #         self.connect()
    #     cur = self.connection.cursor()
    #     query = "SELECT * FROM user WHERE username = %s;"
    #     values = (username,)
    #     cur.execute(query, values)
    #     res = cur.fetchone()
    #     if res:
    #         return True
    #     return False

    def get_user_from_username(self, username):
        if self.connection is None:
            self.connect()
        cur = self.connection.cursor()
        query = "SELECT * FROM user WHERE username = %s;"
        values = (username,)
        cur.execute(query, values)
        res = cur.fetchone()
        column_names = [desc[0] for desc in cur.description]
        return dict(zip(column_names, res))

    def add_list(self, user_id, title):
        if self.connection is None:
            self.connect()
        cur = self.connection.cursor()
        try:
            query = "INSERT INTO lists (user_id, title) VALUES (%s, %s);"
            values = (user_id, title)
            cur.execute(query, values)
            self.connection.commit()

            cur.execute("SELECT LAST_INSERT_ID();")
            list_id = cur.fetchone()[0]
            query = "SELECT * FROM lists WHERE list_id = %s;"
            values = (list_id,)
            cur.execute(query, values)
            res = cur.fetchone()
            column_names = [desc[0] for desc in cur.description]
            list_dict = dict(zip(column_names, res))
            return list_dict
        except Exception as e:
            return {"message": f"{e}"}

    def get_list(self, user_id):
        if self.connection is None:
            self.connect()
        cur = self.connection.cursor()
        try:
            if user_id:
                query = f"SELECT * FROM lists WHERE user_id = {user_id};"
            else:
                query = f"SELECT * FROM lists WHERE user_id is null;"
            cur.execute(query)
            res = cur.fetchall()
            column_names = [desc[0] for desc in cur.description]
            results_as_dict = [dict(zip(column_names, row)) for row in res]
            return results_as_dict
        except Exception as e:
            return {"message": f"{e}"}

    def update_list(self, list_id, title):
        if self.connection is None:
            self.connect()
        cur = self.connection.cursor()
        try:
            query = "UPDATE lists SET title = %s WHERE list_id = %s;"
            values = (title, list_id)
            cur.execute(query, values)
            self.connection.commit()
            return 'success'
        except Exception as e:
            return f"{e}"

    def delete_list(self, list_id):
        if self.connection is None:
            self.connect()
        cur = self.connection.cursor()
        try:
            print(list_id)
            cur.execute("DELETE FROM tasks WHERE list_id = %s;", (list_id,))
            cur.execute("DELETE FROM lists WHERE list_id = %s;", (list_id,))
            self.connection.commit()
            return 'success'
        except Exception as e:
            return f"{e}"

    def get_tasks(self, list_id):
        if self.connection is None:
            self.connect()
        cur = self.connection.cursor()
        try:
            query = f"SELECT * FROM tasks WHERE list_id = {list_id};"
            cur.execute(query)
            res = cur.fetchall()
            column_names = [desc[0] for desc in cur.description]
            tasks = [dict(zip(column_names, row)) for row in res]
            return tasks
        except Exception as e:
            return {"message": f"{e}"}

    def add_task(self, list_id, task_name):
        if self.connection is None:
            self.connect()
        cur = self.connection.cursor()
        try:
            query = f"INSERT INTO tasks (list_id, task, completed) values (%s, %s, false);"
            values = (list_id, task_name)
            cur.execute(query, values)
            self.connection.commit()
            task = {'list_id': list_id, "task": task_name}
            return task
        except Exception as e:
            return {"message": f"{e}"}

    def update_task(self, task_id, task):
        if self.connection is None:
            self.connect()
        cur = self.connection.cursor()
        try:
            query = f"UPDATE tasks SET task = %s WHERE task_id = %s;"
            values = (task, task_id)
            cur.execute(query, values)
            self.connection.commit()
            return 'success'
        except Exception as e:
            return {"message": f"{e}"}

    def complete_task(self, task_id):
        if self.connection is None:
            self.connect()
        cur = self.connection.cursor()
        try:
            query = f"UPDATE tasks SET completed = true WHERE task_id = %s;"
            values = (task_id,)
            cur.execute(query, values)
            self.connection.commit()
            return 'success'
        except Exception as e:
            return {"message": f"{e}"}

    def restart_task(self, task_id):
        if self.connection is None:
            self.connect()
        cur = self.connection.cursor()
        try:
            query = f"UPDATE tasks SET completed = false WHERE task_id = %s;"
            values = (task_id,)
            cur.execute(query, values)
            self.connection.commit()
            return 'success'
        except Exception as e:
            return {"message": f"{e}"}

    def delete_task(self, task_id):
        if self.connection is None:
            self.connect()
        cur = self.connection.cursor()
        try:
            print(task_id)
            cur.execute("DELETE FROM tasks WHERE task_id = %s;", (task_id,))
            self.connection.commit()
            return 'success'
        except Exception as e:
            return f"{e}"

    def create_session(self, user, token, expires_at):
        if self.connection is None:
            self.connect()
        cur = self.connection.cursor()
        try:
            query = f"INSERT INTO session (user_id, token, expires_at) values (%s, %s, %s);"
            values = (user.user_id, token, expires_at)
            cur.execute(query, values)
            self.connection.commit()
            cur.execute("SELECT LAST_INSERT_ID();")
            session_id = cur.fetchone()[0]
            return session_id
        except Exception as e:
            return {"message": f"{e}"}

    def get_user_by_id_and_token(self, user_id, token):
        if self.connection is None:
            self.connect()
        cur = self.connection.cursor()
        try:
            query = f"""SELECT u.*
                        FROM session as s
                        JOIN user as u
                        ON s.user_id = u.user_id
                        WHERE s.user_id = %s AND s.token = %s ;"""
            values = (user_id, token)
            cur.execute(query, values)
            res = cur.fetchone()
            if res:
                column_names = [desc[0] for desc in cur.description]
                user_dict = dict(zip(column_names, res))
                return user_dict
            else:
                return False
        except Exception as e:
            return {"message": f"{e}"}

    def get_user_from_credentials(self, username, password):
        if self.connection is None:
            self.connect()
        cur = self.connection.cursor()
        try:
            query = "SELECT * FROM user WHERE username = %s and password = %s;"
            values = (username, password)
            cur.execute(query, values)
            res = cur.fetchone()
            if res:
                column_names = [desc[0] for desc in cur.description]
                return dict(zip(column_names, res))
            return False
        except Exception as e:
            return {"message": f"{e}"}

    def get_session_by_token(self, token):
        if self.connection is None:
            self.connect()
        cur = self.connection.cursor()
        try:
            query = "SELECT * FROM session WHERE token = %s;"
            values = (token,)
            cur.execute(query, values)
            res = cur.fetchone()
            if res:
                column_names = [desc[0] for desc in cur.description]
                return dict(zip(column_names, res))
            return False
        except Exception as e:
            return {"message": f"{e}"}


if __name__ == "__main__":
    db = Database()
    db.connect()
