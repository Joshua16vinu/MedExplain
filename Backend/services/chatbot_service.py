from services.gemini_service import client
import os

def generate_chat_response(user_message: str, report_summary: str, conversation_history: list = None) -> str:
    """
    Generate a chatbot response based on user question and report summary.
    
    Args:
        user_message: The user's question
        report_summary: The medical report summary
        conversation_history: Previous messages in the conversation
    
    Returns:
        The chatbot's response
    """
    # Build conversation context
    history_context = ""
    if conversation_history:
        history_context = "\n\nPrevious conversation:\n"
        for msg in conversation_history[-5:]:  # Last 5 messages for context
            role = msg.get("role", "user")
            content = msg.get("content", "")
            history_context += f"{role.capitalize()}: {content}\n"
    
    prompt = f"""You are a helpful medical assistant chatbot designed for rural clinics. You help patients understand their medical reports.

IMPORTANT RULES:
- Base your answers ONLY on the provided report summary
- Do NOT diagnose diseases or conditions
- Do NOT suggest specific treatments or medications
- Use very simple, patient-friendly language
- If you don't know something from the report, say so clearly
- Always remind users to consult with their doctor for medical advice
- Be empathetic and supportive

Medical Report Summary:
{report_summary}
{history_context}

User Question: {user_message}

Please provide a helpful, clear answer based on the report summary above. Remember to be simple and patient-friendly."""

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )
        
        if not hasattr(response, 'text') or not response.text:
            raise ValueError("Empty or invalid response from Gemini API")
        
        return response.text
    except Exception as e:
        raise Exception(f"Error generating chat response: {str(e)}")

