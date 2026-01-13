from flask import Blueprint, request, g
from middleware.auth_middleware import auth_required
from utils.response import success_response
from services.gemini_service import analyze_symptoms

symptom_checker_bp = Blueprint("symptom_checker", __name__, url_prefix="/symptom-checker")

@symptom_checker_bp.route("/analyze", methods=["POST"])
@auth_required
def analyze_symptoms_route():
    """
    Analyze symptoms and provide possible conditions
    """
    data = request.json
    symptoms = data.get("symptoms")
    language = data.get("language", "en")
    
    if not symptoms:
        return {"error": "symptoms description is required"}, 400
    
    analysis = analyze_symptoms(symptoms, language)
    
    return success_response({
        "symptoms": symptoms,
        "analysis": analysis,
        "language": language
    })