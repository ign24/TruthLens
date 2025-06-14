from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from app.core.config import settings
from app.api.routes import analyze, chat, translator
import logging
import os
from fastapi import WebSocket
from app.websockets.voice_handler import handle_voice_websocket
from dotenv import load_dotenv
from pathlib import Path
from app.routes import image_analysis

# Configure logging for application-wide error tracking and monitoring
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize rate limiter to prevent API abuse
limiter = Limiter(key_func=get_remote_address)

load_dotenv()
logger.debug("Environment variables loaded")

class VoiceAssistantManager:
    def __init__(self):
        self.elevenlabs_api_key = os.getenv("ELEVENLABS_API_KEY")
        self.elevenlabs_agent_id = os.getenv("AGENT_ID")
        self.elevenlabs_base_url = "https://api.elevenlabs.io/v1"
        self.model_id = "flash_v2.5"

def create_app() -> FastAPI:
    """
    Create and configure the FastAPI application with all necessary middleware and routes.
    
    Returns:
        FastAPI: Configured FastAPI application instance with CORS, rate limiting, and error handling
    """
    app = FastAPI(
        title=settings.PROJECT_NAME,
        description="API for analyzing news articles and detecting bias",
        version=settings.VERSION,
        docs_url="/docs",
        redoc_url="/redoc"
    )

    # Configure rate limiting middleware to protect API endpoints
    app.state.limiter = limiter
    app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
    app.add_middleware(SlowAPIMiddleware)

    # Configure CORS middleware to allow frontend access
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.BACKEND_CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Mount static files directory for audio files using relative path
    temp_dir = Path(__file__).parent / "app" / "data" / "temp"
    temp_dir.mkdir(parents=True, exist_ok=True)
    app.mount("/static", StaticFiles(directory=str(temp_dir)), name="static")

    @app.get("/")
    async def root():
        """
        Root endpoint that provides basic API information and available endpoints.
        """
        return {
            "message": f"Welcome to {settings.PROJECT_NAME}",
            "version": settings.VERSION,
            "docs": "/docs",
            "endpoints": {
                "analyze": f"{settings.API_V1_STR}/analyze",
                "chat": f"{settings.API_V1_STR}/chat"
                # "health": f"{settings.API_V1_STR}/health"  # Health check disabled to save tokens
            }
        }

    # Health check endpoint disabled to save tokens
    """
    @app.get(f"{settings.API_V1_STR}/health")
    async def health_check():
        Health check endpoint to verify the API is running and monitor its status.
        return {
            "status": "healthy",
            "version": settings.VERSION
        }
    """

    @app.exception_handler(Exception)
    async def global_exception_handler(request: Request, exc: Exception):
        """
        Global exception handler for unhandled exceptions to provide consistent error responses.
        
        Args:
            request: The request that caused the exception
            exc: The exception that was raised
        """
        logger.error(f"Unhandled exception: {str(exc)}", exc_info=True)
        return JSONResponse(
            status_code=500,
            content={"detail": "Internal server error"}
        )

    # Include API routers for different functionality
    app.include_router(analyze.router, prefix=settings.API_V1_STR, tags=["analysis"])
    app.include_router(chat.router, prefix=settings.API_V1_STR, tags=["chat"])
    app.include_router(translator.router, prefix=settings.API_V1_STR, tags=["translator"])
    app.include_router(image_analysis.router, prefix="/api", tags=["image-analysis"])

    # Voice WebSocket endpoint
    @app.websocket("/ws/voice")
    async def voice_websocket_endpoint(websocket: WebSocket):
        """WebSocket endpoint for voice assistant"""
        await handle_voice_websocket(websocket)

    return app

app = create_app()

if __name__ == "__main__":
    import uvicorn
    logger.info("Starting TruthLens API server...")
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=5000,
        reload=True,
        log_level="info"
    )