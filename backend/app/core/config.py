from pydantic_settings import BaseSettings
from functools import lru_cache
import os
from typing import List
from dotenv import load_dotenv
import logging

# Configure logging
logger = logging.getLogger(__name__)

# Load environment variables from .env file
load_dotenv()

class Settings(BaseSettings):
    """
    Application settings class that loads and validates environment variables.
    All settings are loaded from environment variables with fallback values.
    """
    # API Settings
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "TruthLens API"
    VERSION: str = "1.0.0"
    
    # CORS Settings
    # In development, only allow localhost:5173. In production, only allow the Netlify domain.
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:5173" if os.getenv("ENV", "development") == "development" else "https://truthlens-ai.netlify.app"
    ]
    
    # OpenAI Settings
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    OPENAI_MODEL: str = os.getenv("OPENAI_MODEL", "gpt-4-turbo-preview")
    
    # Serper API Settings
    SERPER_API_KEY: str = os.getenv("SERPER_API_KEY", "")
    
    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = int(os.getenv("RATE_LIMIT_PER_MINUTE", "60"))
    
    def validate_settings(self) -> None:
        """
        Validate critical settings and log warnings for missing or invalid values.
        """
        if not self.OPENAI_API_KEY:
            logger.warning("OPENAI_API_KEY is not set. API functionality will be limited.")
        
        if not self.SERPER_API_KEY:
            logger.warning("SERPER_API_KEY is not set. Search functionality will be limited.")
        
        if not self.BACKEND_CORS_ORIGINS:
            logger.warning("No CORS origins configured. API may not be accessible from frontend.")
    
    class Config:
        case_sensitive = True
        env_file = ".env"

@lru_cache()
def get_settings() -> Settings:
    """
    Get cached settings instance.
    
    Returns:
        Settings: Application settings instance
    """
    settings = Settings()
    settings.validate_settings()
    return settings

settings = get_settings() 