from pydantic_settings import BaseSettings
from functools import lru_cache
from typing import List
import logging

# Configure logging
logger = logging.getLogger(__name__)

class Settings(BaseSettings):
    # Environment
    ENV: str = "development"
    HOST: str = "0.0.0.0"
    PORT: int = 5000

    # API Settings
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "TruthLens API"
    VERSION: str = "1.0.0"

    # CORS Settings
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "https://truthlensai.netlify.app"
    ]

    # OpenAI Settings
    OPENAI_API_KEY: str
    OPENAI_MODEL: str = "gpt-4o"

    # Serper API Settings
    SERPER_API_KEY: str
    SERPER_API_URL: str = "https://google.serper.dev/search"

    # ElevenLabs Settings
    ELEVENLABS_API_KEY: str
    ELEVENLABS_BASE_URL: str = "https://api.elevenlabs.io/v1"
    ELEVENLABS_MODEL_ID: str = "turbo_v2"
    ELEVENLABS_AGENT_ID: str = ""

    # Supabase Settings
    SUPABASE_URL: str
    SUPABASE_KEY: str

    # Security Settings - Input Limits
    MAX_TEXT_LENGTH: int = 10000  # 10KB por análisis
    MAX_CHAT_MESSAGES: int = 20   # Máximo 20 mensajes por conversación
    MAX_CHAT_MESSAGE_LENGTH: int = 2000  # 2KB por mensaje
    MAX_TOKENS_PER_REQUEST: int = 4000  # Límite de tokens por request
    MAX_DAILY_REQUESTS: int = 100  # 100 requests por IP por día

    # Rate Limiting - Más estricto
    RATE_LIMIT_PER_MINUTE: int = 30  # Reducido de 60 a 30
    RATE_LIMIT_PER_HOUR: int = 200
    RATE_LIMIT_PER_DAY: int = 1000

    # Test Settings
    TEST_API_BASE_URL: str = "http://localhost:8000"

    class Config:
        case_sensitive = True
        env_file = ".env"  # Solo útil en desarrollo

@lru_cache()
def get_settings() -> Settings:
    settings = Settings()
    return settings

settings = get_settings() 