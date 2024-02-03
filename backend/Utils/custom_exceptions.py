class NotFoundException(Exception):
    def __init__(self, message="Not Found", status_code=400, description=None):
        super().__init__(message)
        self.status_code = status_code
        self.description = description

    def to_dict(self):
        return {'message': str(self), 'description': self.description}


class AuthenticationException(Exception):
    def __init__(self, message="Authentication Error", status_code=401, description=None):
        super().__init__(message)
        self.status_code = status_code
        self.description = description

    def to_dict(self):
        return {'message': str(self), 'description': self.description}
