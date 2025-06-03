from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from app.core.config import settings
from app.api.routes import analyze, chat
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize rate limiter
limiter = Limiter(key_func=get_remote_address)

def create_app() -> FastAPI:
    """
    Create and configure the FastAPI application.
    
    Returns:
        FastAPI: Configured FastAPI application instance
    """
    app = FastAPI(
        title=settings.PROJECT_NAME,
        description="API for analyzing news articles and detecting bias",
        version=settings.VERSION,
        docs_url="/docs",
        redoc_url="/redoc"
    )

    # Configure rate limiting
    app.state.limiter = limiter
    app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
    app.add_middleware(SlowAPIMiddleware)

    # Configure CORS
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.BACKEND_CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.get("/")
    async def root():
        """
        Root endpoint that provides basic API information.
        """
        return {
            "message": f"Welcome to {settings.PROJECT_NAME}",
            "version": settings.VERSION,
            "docs": "/docs",
            "endpoints": {
                "analyze": f"{settings.API_V1_STR}/analyze",
                "chat": f"{settings.API_V1_STR}/chat",
                "health": f"{settings.API_V1_STR}/health"
            }
        }

    @app.get(f"{settings.API_V1_STR}/health")
    async def health_check():
        """
        Health check endpoint to verify the API is running.
        """
        return {
            "status": "healthy",
            "version": settings.VERSION
        }

    @app.exception_handler(Exception)
    async def global_exception_handler(request: Request, exc: Exception):
        """
        Global exception handler for unhandled exceptions.
        
        Args:
            request: The request that caused the exception
            exc: The exception that was raised
        """
        logger.error(f"Unhandled exception: {str(exc)}", exc_info=True)
        return JSONResponse(
            status_code=500,
            content={"detail": "Internal server error"}
        )

    # Include routers
    app.include_router(analyze.router, prefix=settings.API_V1_STR, tags=["analysis"])
    app.include_router(chat.router, prefix=settings.API_V1_STR, tags=["chat"])

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