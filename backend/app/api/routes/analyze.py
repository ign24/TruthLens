from fastapi import APIRouter, HTTPException, Depends, Request
from ...models.schemas import AnalysisRequest, AnalysisResponse
from ...services.openai_service import OpenAIService
from ...core.config import settings
import logging
from typing import Optional
from slowapi import Limiter
from slowapi.util import get_remote_address
from ...services.storage_service import StorageService
from ...middleware.security import SecurityMiddleware

# Configure logging
logger = logging.getLogger(__name__)

# Initialize router and services
router = APIRouter()
openai_service = OpenAIService()
limiter = Limiter(key_func=get_remote_address)
storage_service = StorageService()
security_middleware = SecurityMiddleware()

@router.post(
    "/analyze",
    response_model=AnalysisResponse,
    tags=["analysis"],
    summary="Analyze text for bias and factual accuracy",
    description="Analyzes the provided text, URL, and title for potential bias and factual accuracy using AI."
)
@limiter.limit(f"{settings.RATE_LIMIT_PER_MINUTE}/minute")
async def analyze_text(
    request: Request,
    body: AnalysisRequest,
    limiter: Limiter = Depends(lambda: limiter)
) -> AnalysisResponse:
    """
    Analyze text for bias and factual accuracy.
    
    Args:
        request: The HTTP request object (required for slowapi)
        body: The analysis request containing text, URL, and title
        limiter: Rate limiter instance
        
    Returns:
        AnalysisResponse: Analysis results including bias score and factual accuracy
        
    Raises:
        HTTPException: If the analysis fails or rate limit is exceeded
    """
    try:
        logger.info(f"Processing analysis request for URL: {body.url}")
        
        # Validación de seguridad
        await security_middleware.validate_request(request, body.dict())
        
        # Validar OpenAI API key
        if not settings.OPENAI_API_KEY:
            raise HTTPException(
                status_code=503,
                detail="OpenAI API key is not configured"
            )
        
        # Validar longitud del texto
        if len(body.text) > settings.MAX_TEXT_LENGTH:
            raise HTTPException(
                status_code=400,
                detail={
                    "error": "Text too long",
                    "message": f"Maximum {settings.MAX_TEXT_LENGTH} characters allowed",
                    "current_length": len(body.text)
                }
            )
        
        # Perform analysis
        result = await openai_service.analyze_text(
            text=body.text,
            url=body.url,
            title=body.title
        )
        # Save input and result to database
        storage_service.save_analysis(
            tipo_analisis="texto",
            input_original=body.text,
            resultado=result.dict()
        )
        logger.info(f"Analysis completed successfully for URL: {body.url}")
        return result
        
    except HTTPException:
        # Re-lanzar HTTPException sin modificar
        raise
    except ValueError as ve:
        # Manejar errores de validación de tokens
        logger.error(f"Validation error: {str(ve)}")
        raise HTTPException(
            status_code=400,
            detail={
                "error": "Input validation failed",
                "message": str(ve)
            }
        )
    except Exception as e:
        logger.error(f"Error analyzing text: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail="An error occurred while analyzing the text"
        )

@router.get("/quota-info")
async def get_quota_info(request: Request):
    """
    Get quota information for the current IP
    """
    try:
        quota_info = await security_middleware.get_quota_info(request)
        return quota_info
    except Exception as e:
        logger.error(f"Error getting quota info: {e}")
        raise HTTPException(
            status_code=500,
            detail="Error retrieving quota information"
        ) 