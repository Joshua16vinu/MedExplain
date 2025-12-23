from flask import Blueprint, g
from middleware.auth_middleware import auth_required
from utils.response import success_response

auth_bp = Blueprint("auth", __name__, url_prefix="/auth")

@auth_bp.route("/me", methods=["GET"])
@auth_required
def get_current_user():
    return success_response({
        "uid": g.user["uid"],
        "email": g.user.get("email"),
        "name": g.user.get("name")
    })
