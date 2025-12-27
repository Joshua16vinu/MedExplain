# from services.gemini_service import client
# import os
# from utils.language import get_language_instruction

# def generate_chat_response(user_message: str, report_summary: str, conversation_history: list = None , language: str = "en") -> str:
#     f"""
#     LANGUAGE RULE (VERY IMPORTANT):
#     {get_language_instruction(language)}

#     Generate a chatbot response based on user question and report summary.
    
#     Args:
#         user_message: The user's question
#         report_summary: The medical report summary
#         conversation_history: Previous messages in the conversation
    
#     Returns:
#         The chatbot's response
#     """
#     # Build conversation context
#     history_context = ""
#     if conversation_history:
#         history_context = "\n\nPrevious conversation:\n"
#         for msg in conversation_history[-5:]:  # Last 5 messages for context
#             role = msg.get("role", "user")
#             content = msg.get("content", "")
#             history_context += f"{role.capitalize()}: {content}\n"
    
#     prompt = f"""You are a helpful medical assistant chatbot designed for rural clinics. You help patients understand their medical reports.

# IMPORTANT RULES:
# - Base your answers ONLY on the provided report summary
# - Do NOT diagnose diseases or conditions
# - Do NOT suggest specific treatments or medications
# - Use very simple, patient-friendly language
# - If you don't know something from the report, say so clearly
# - Always remind users to consult with their doctor for medical advice
# - Be empathetic and supportive

# Medical Report Summary:
# {report_summary}
# {history_context}

# User Question: {user_message}

# Please provide a helpful, clear answer based on the report summary above. Remember to be simple and patient-friendly."""

#     try:
#         response = client.models.generate_content(
#             model="gemini-2.5-flash",
#             contents=prompt
#         )
        
#         if not hasattr(response, 'text') or not response.text:
#             raise ValueError("Empty or invalid response from Gemini API")
        
#         return response.text
#     except Exception as e:
#         raise Exception(f"Error generating chat response: {str(e)}")

from services.gemini_service import client
from utils.language import get_language_instruction

def generate_chat_response(
    user_message: str,
    report_summary: str,
    conversation_history: list = None,
    language: str = "en"
) -> str:

    # Build conversation context
    history_context = ""
    if conversation_history:
        history_context = "\n\nPrevious conversation:\n"
        for msg in conversation_history[-5:]:
            role = msg.get("role", "user")
            content = msg.get("content", "")
            history_context += f"{role.capitalize()}: {content}\n"

#     prompt = f"""
# You are a helpful medical assistant chatbot designed for rural clinics.

# LANGUAGE RULE (MANDATORY):
# {get_language_instruction(language)}

# IMPORTANT RULES:
# - Base your answers ONLY on the provided report summary
# - Do NOT diagnose diseases or conditions
# - Do NOT suggest specific treatments or medications
# - Use very simple, patient-friendly language
# - If you don't know something from the report, say so clearly
# - Always remind users to consult with their doctor for medical advice
# - Be empathetic and supportive

# Medical Report Summary:
# {report_summary}
# {history_context}

# User Question:
# {user_message}

# Provide a clear, patient-friendly answer following ALL rules above.
# """
#     prompt=f"""
# You are a helpful medical assistant chatbot designed for rural clinics.

# LANGUAGE RULE (MANDATORY):
# {get_language_instruction(language)}

# STRICT BEHAVIOR RULES (MUST FOLLOW):
# - Answer ONLY the user’s question — do not add extra information
# - Base your response ONLY on:
#   1) The provided Medical Report Summary
#   2) The Previous Context (if given)
# - Do NOT use outside medical knowledge
# - Do NOT diagnose any disease or condition
# - Do NOT suggest treatments, medicines, tests, dosages, or home remedies
# - Do NOT give general medical advice
# - If the answer is NOT clearly mentioned in the report, say exactly:
#   "This information is not mentioned in the report"
# - Use very simple, patient-friendly language
# - Keep answers short, clear, and to the point
# - Be calm, empathetic, and reassuring
# - ALWAYS remind the user to consult a doctor or healthcare worker

# Medical Report Summary:
# {report_summary}

# Previous Conversation Context (if any):
# {history_context}

# User Question:
# {user_message}

# RESPONSE FORMAT (MANDATORY):

# 1. **Direct Answer**
#    - Give a clear and specific answer to the user’s question.
#    - Do not add explanations unless needed to answer the question.

# 2. **Based on the Report**
#    - Briefly explain which part of the report the answer comes from.
#    - If not available, clearly say it is not mentioned.

# 3. **Doctor Reminder**
#    - One simple sentence reminding the user to consult a doctor.

# IMPORTANT:
# - Do NOT write anything outside this format
# - Do NOT add assumptions
# """
    prompt = f"""You are a medical assistant helping patients understand their reports.

LANGUAGE RULE (MANDATORY):
{get_language_instruction(language)}

RULES:
1. Answer using ONLY the report information
2. Use very simple language
3. Be direct and clear
4. If asked about a value: state the value and what it means in ONE clear sentence
5. If not in report, say: "This is not mentioned in the report"
6. Do NOT diagnose or suggest treatments
7. Always remind to consult doctor

Medical Report:
{report_summary}
{history_context}

Question: {user_message}

Give a clear, simple answer in 2-3 sentences. Then remind them to see their doctor."""

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )

        if not hasattr(response, "text") or not response.text:
            raise ValueError("Empty or invalid response from Gemini API")

        return response.text

    except Exception as e:
        raise Exception(f"Error generating chat response: {str(e)}")
