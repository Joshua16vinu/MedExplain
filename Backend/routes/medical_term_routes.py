from flask import Blueprint, request, g
from middleware.auth_middleware import auth_required
from utils.response import success_response
from services.gemini_service import explain_medical_term

medical_term_bp = Blueprint("medical_term", __name__, url_prefix="/medical-term")

@medical_term_bp.route("/explain", methods=["POST"])
@auth_required
def explain_term():
    """
    Explain a medical term in simple language
    """
    data = request.json
    term = data.get("term")
    language = data.get("language", "en")
    
    if not term:
        return {"error": "term is required"}, 400
    
    explanation = explain_medical_term(term, language)
    
    return success_response({
        "term": term,
        "explanation": explanation,
        "language": language
    })