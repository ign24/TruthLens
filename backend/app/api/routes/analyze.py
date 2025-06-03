from fastapi import APIRouter, HTTPException, Depends
from ...models.schemas import AnalysisRequest, AnalysisResponse
from ...services.openai_service import OpenAIService
from ...core.config import settings
import logging
from typing import Optional
from slowapi import Limiter
from slowapi.util import get_remote_address

# Configure logging
logger = logging.getLogger(__name__)

# Initialize router and services
router = APIRouter()
openai_service = OpenAIService()
limiter = Limiter(key_func=get_remote_address)

@router.post(
    "/analyze",
    response_model=AnalysisResponse,
    tags=["analysis"],
    summary="Analyze text for bias and factual accuracy",
    description="Analyzes the provided text, URL, and title for potential bias and factual accuracy using AI."
)
@limiter.limit(f"{settings.RATE_LIMIT_PER_MINUTE}/minute")
async def analyze_text(
    request: AnalysisRequest,
    limiter: Limiter = Depends(lambda: limiter)
) -> AnalysisResponse:
    """
    Analyze text for bias and factual accuracy.
    
    Args:
        request: The analysis request containing text, URL, and title
        limiter: Rate limiter instance
        
    Returns:
        AnalysisResponse: Analysis results including bias score and factual accuracy
        
    Raises:
        HTTPException: If the analysis fails or rate limit is exceeded
    """
    try:
        logger.info(f"Processing analysis request for URL: {request.url}")
        
        # Validate OpenAI API key
        if not settings.OPENAI_API_KEY:
            raise HTTPException(
                status_code=503,
                detail="OpenAI API key is not configured"
            )
        
        # Perform analysis
        result = await openai_service.analyze_text(
            text=request.text,
            url=request.url,
            title=request.title
        )
        
        logger.info(f"Analysis completed successfully for URL: {request.url}")
        return result
        
    except Exception as e:
        logger.error(f"Error analyzing text: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail="An error occurred while analyzing the text"
        ) 