# from google.cloud import speech_v1p1beta1 as speech
# from gtts import gTTS
# import os
# import io

# # Lazy client initialization for Speech-to-Text
# _speech_client = None


# def get_speech_client():
#     """Lazy initialization of Speech-to-Text client"""
#     global _speech_client
#     if _speech_client is None:
#         if not os.environ.get('GOOGLE_APPLICATION_CREDENTIALS'):
#             os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = 'serviceAccountKey.json'
#         _speech_client = speech.SpeechClient()
#         print("✅ Speech-to-Text client initialized (Google Cloud)")
#     return _speech_client


# def get_language_config(language: str):
#     """Get language-specific configuration"""
#     configs = {
#         "en": {
#             "stt_code": "en-IN",  # Google Cloud Speech-to-Text
#             "tts_code": "en",     # gTTS language code
#             "tts_tld": "co.in"    # gTTS accent (Indian English)
#         },
#         "hi": {
#             "stt_code": "hi-IN",
#             "tts_code": "hi",
#             "tts_tld": "co.in"
#         },
#         "mr": {
#             "stt_code": "mr-IN",
#             "tts_code": "mr",
#             "tts_tld": "co.in"
#         }
#     }
#     return configs.get(language, configs["en"])


# def speech_to_text(audio_bytes: bytes, language: str = "en") -> str:
#     """
#     Convert speech to text using Google Cloud Speech-to-Text
#     (Works with Python 3.13)
    
#     Args:
#         audio_bytes: Audio data in bytes
#         language: Language code ("en", "hi", "mr")
    
#     Returns:
#         Transcribed text
#     """
#     try:
#         lang_config = get_language_config(language)
#         speech_client = get_speech_client()
        
#         audio = speech.RecognitionAudio(content=audio_bytes)
        
#         # Try WEBM_OPUS first (most browsers use this)
#         config = speech.RecognitionConfig(
#             encoding=speech.RecognitionConfig.AudioEncoding.WEBM_OPUS,
#             sample_rate_hertz=48000,
#             language_code=lang_config["stt_code"],
#             enable_automatic_punctuation=True,
#             model="latest_long",
#             use_enhanced=True
#         )
        
#         try:
#             response = speech_client.recognize(config=config, audio=audio)
#         except Exception as e:
#             # If WEBM fails, try LINEAR16 (WAV)
#             print(f"⚠️ WEBM failed, trying LINEAR16: {e}")
#             config.encoding = speech.RecognitionConfig.AudioEncoding.LINEAR16
#             config.sample_rate_hertz = 16000
#             response = speech_client.recognize(config=config, audio=audio)
        
#         if not response.results:
#             print("⚠️ No speech detected")
#             return ""
        
#         transcript = response.results[0].alternatives[0].transcript
#         confidence = response.results[0].alternatives[0].confidence
        
#         print(f"✅ Transcribed ({confidence:.2%} confidence): {transcript}")
        
#         return transcript.strip()
    
#     except Exception as e:
#         print(f"❌ Speech-to-text error: {str(e)}")
#         raise Exception(f"Speech recognition failed: {str(e)}")


# def text_to_speech(text: str, language: str = "en", voice_gender: str = "female") -> bytes:
#     """
#     Convert text to speech using gTTS (free, simple)
    
#     Args:
#         text: Text to convert to speech
#         language: Language code ("en", "hi", "mr")
#         voice_gender: "female" or "male" (gTTS doesn't support gender, ignored)
    
#     Returns:
#         Audio data as bytes (MP3 format)
#     """
#     try:
#         lang_config = get_language_config(language)
        
#         # Create gTTS object
#         tts = gTTS(
#             text=text,
#             lang=lang_config["tts_code"],
#             tld=lang_config["tts_tld"],  # Indian accent
#             slow=False
#         )
        
#         # Convert to bytes
#         audio_fp = io.BytesIO()
#         tts.write_to_fp(audio_fp)
#         audio_fp.seek(0)
#         audio_bytes = audio_fp.read()
        
#         print(f"✅ Generated speech ({len(audio_bytes)} bytes): {text[:50]}...")
        
#         return audio_bytes
    
#     except Exception as e:
#         print(f"❌ Text-to-speech error: {str(e)}")
#         raise Exception(f"Speech synthesis failed: {str(e)}")


# def get_supported_languages():
#     """Get list of supported languages"""
#     return {
#         "en": "English (India)",
#         "hi": "Hindi (भारत)",
#         "mr": "Marathi (मराठी)"
#     }

# from google.cloud import speech_v1p1beta1 as speech
from google.cloud import speech

from gtts import gTTS
from services.gemini_service import client
from utils.language import get_language_instruction
import os
import io

# Lazy client initialization for Speech-to-Text
_speech_client = None


def get_speech_client():
    """Lazy initialization of Speech-to-Text client"""
    global _speech_client
    if _speech_client is None:
        if not os.environ.get('GOOGLE_APPLICATION_CREDENTIALS'):
            os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = 'serviceAccountKey.json'
        _speech_client = speech.SpeechClient()
        print("✅ Speech-to-Text client initialized (Google Cloud)")
    return _speech_client


def get_language_config(language: str):
    """Get language-specific configuration"""
    configs = {
        "en": {
            "stt_code": "en-IN",  # Google Cloud Speech-to-Text
            "tts_code": "en",     # gTTS language code
            "tts_tld": "co.in"    # gTTS accent (Indian English)
        },
        "hi": {
            "stt_code": "hi-IN",
            "tts_code": "hi",
            "tts_tld": "co.in"
        },
        "mr": {
            "stt_code": "mr-IN",
            "tts_code": "mr",
            "tts_tld": "co.in"
        }
    }
    return configs.get(language, configs["en"])


def speech_to_text(audio_bytes: bytes, language: str = "en") -> str:
    """
    Convert speech to text using Google Cloud Speech-to-Text
    (Works with Python 3.13)
    
    Args:
        audio_bytes: Audio data in bytes
        language: Language code ("en", "hi", "mr")
    
    Returns:
        Transcribed text
    """
    try:
        lang_config = get_language_config(language)
        speech_client = get_speech_client()
        
        audio = speech.RecognitionAudio(content=audio_bytes)
        
        # Try WEBM_OPUS first (most browsers use this)
        config = speech.RecognitionConfig(
            encoding=speech.RecognitionConfig.AudioEncoding.WEBM_OPUS,
            sample_rate_hertz=48000,
            language_code=lang_config["stt_code"],
            enable_automatic_punctuation=True,
            model="latest_long",
            use_enhanced=True
        )
        
        try:
            response = speech_client.recognize(config=config, audio=audio)
        except Exception as e:
            # If WEBM fails, try LINEAR16 (WAV)
            print(f"⚠️ WEBM failed, trying LINEAR16: {e}")
            config.encoding = speech.RecognitionConfig.AudioEncoding.LINEAR16
            config.sample_rate_hertz = 16000
            response = speech_client.recognize(config=config, audio=audio)
        
        if not response.results:
            print("⚠️ No speech detected")
            return ""
        
        transcript = response.results[0].alternatives[0].transcript
        confidence = response.results[0].alternatives[0].confidence
        
        print(f"✅ Transcribed ({confidence:.2%} confidence): {transcript}")
        
        return transcript.strip()
    
    except Exception as e:
        print(f"❌ Speech-to-text error: {str(e)}")
        raise Exception(f"Speech recognition failed: {str(e)}")


def text_to_speech(text: str, language: str = "en", voice_gender: str = "female") -> bytes:
    """
    Convert text to speech using gTTS (free, simple)
    
    Args:
        text: Text to convert to speech
        language: Language code ("en", "hi", "mr")
        voice_gender: "female" or "male" (gTTS doesn't support gender, ignored)
    
    Returns:
        Audio data as bytes (MP3 format)
    """
    try:
        lang_config = get_language_config(language)
        
        # Create gTTS object
        tts = gTTS(
            text=text,
            lang=lang_config["tts_code"],
            tld=lang_config["tts_tld"],  # Indian accent
            slow=False
        )
        
        # Convert to bytes
        audio_fp = io.BytesIO()
        tts.write_to_fp(audio_fp)
        audio_fp.seek(0)
        audio_bytes = audio_fp.read()
        
        print(f"✅ Generated speech ({len(audio_bytes)} bytes): {text[:50]}...")
        
        return audio_bytes
    
    except Exception as e:
        print(f"❌ Text-to-speech error: {str(e)}")
        raise Exception(f"Speech synthesis failed: {str(e)}")


def generate_voice_chat_response(
    user_message: str,
    report_summary: str,
    conversation_history: list = None,
    language: str = "en"
) -> str:
    """
    Generate a SHORT, voice-optimized chatbot response.
    
    Voice responses should be:
    - Brief and conversational (2-3 sentences max)
    - Easy to understand when spoken
    - Direct answers without extra formatting
    - Natural for speech synthesis
    
    Args:
        user_message: The user's question
        report_summary: The medical report summary
        conversation_history: Previous messages in the conversation
        language: Language code ("en", "hi", "mr")
    
    Returns:
        A short, voice-friendly response
    """
    
    # Build conversation context (keep it minimal for voice)
    history_context = ""
    if conversation_history:
        # Only last 3 messages for voice (keep context short)
        recent_messages = conversation_history[-3:]
        if recent_messages:
            history_context = "\n\nRecent conversation:\n"
            for msg in recent_messages:
                role = msg.get("role", "user")
                content = msg.get("content", "")
                # Truncate long messages for voice context
                if len(content) > 100:
                    content = content[:100] + "..."
                history_context += f"{role}: {content}\n"
    
    prompt = f"""You are a voice assistant helping patients understand their medical reports.

LANGUAGE RULE (MANDATORY):
{get_language_instruction(language)}

VOICE RESPONSE RULES (VERY IMPORTANT):
- Keep your answer SHORT - maximum 2 to 3 sentences
- Speak naturally like you're talking to someone
- Be direct and clear
- NO bullet points, NO formatting, NO markdown
- Give ONLY the most important information
- Use simple everyday words
- If asked about a test value, say the value and what it means in ONE sentence
- Always end with a gentle reminder to consult a doctor

DO NOT:
- Diagnose any disease
- Suggest treatments or medicines
- Give long explanations
- Use medical jargon

Medical Report Summary:
{report_summary}
{history_context}

User Question: {user_message}

Give a SHORT, clear, voice-friendly answer (2 sentences maximum).
Remember: This will be spoken out loud, so keep it brief and conversational."""

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )
        
        if not hasattr(response, "text") or not response.text:
            raise ValueError("Empty or invalid response from Gemini API")
        
        # Clean up the response for voice
        voice_response = response.text.strip()
        
        # Remove markdown formatting that doesn't work well in speech
        voice_response = voice_response.replace("**", "")
        voice_response = voice_response.replace("*", "")
        voice_response = voice_response.replace("#", "")
        voice_response = voice_response.replace("- ", "")
        
        # If response is too long, truncate intelligently
        sentences = voice_response.split(". ")
        if len(sentences) > 3:
            # Keep first 3 sentences
            voice_response = ". ".join(sentences[:3]) + "."
        
        print(f"✅ Generated voice response: {voice_response[:100]}...")
        
        return voice_response
    
    except Exception as e:
        print(f"❌ Error generating voice response: {str(e)}")
        raise Exception(f"Error generating chat response: {str(e)}")


def get_supported_languages():
    """Get list of supported languages"""
    return {
        "en": "English (India)",
        "hi": "Hindi (भारत)",
        "mr": "Marathi (मराठी)"
    }