from functools import wraps
from flask import request, g
from services.auth_service import verify_firebase_token
from utils.exception import AuthError

def auth_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get("Authorization")

        if not auth_header or not auth_header.startswith("Bearer "):
            raise AuthError()

        token = auth_header.replace("Bearer ", "")
        user = verify_firebase_token(token)

        g.user = user   # attach user to request context
        return f(*args, **kwargs)

    return decorated
