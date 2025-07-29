from fastapi import APIRouter, HTTPException, Depends, Request
from ...models.schemas import ChatRequest, ChatResponse
from ...services.openai_service import OpenAIService
from ...core.config import settings
import logging
from typing import List
from slowapi import Limiter
from slowapi.util import get_remote_address
from ...middleware.security import SecurityMiddleware

# Configure logging
logger = logging.getLogger(__name__)

# Initialize router and services
router = APIRouter()
openai_service = OpenAIService()
limiter = Limiter(key_func=get_remote_address)
security_middleware = SecurityMiddleware()

@router.post(
    "/chat",
    response_model=ChatResponse,
    tags=["chat"],
    summary="Chat with the AI assistant",
    description="Engage in a conversation with the AI assistant about news analysis and bias detection. Optionally use web search for fact verification."
)
@limiter.limit(f"{settings.RATE_LIMIT_PER_MINUTE}/minute")
async def chat(
    request: Request,
    body: ChatRequest,
    limiter: Limiter = Depends(lambda: limiter)
) -> ChatResponse:
    """
    Process a chat request and return the AI's response.
    
    Args:
        request: The HTTP request object (required for slowapi)
        body: The chat request containing the conversation messages
        limiter: Rate limiter instance
        
    Returns:
        ChatResponse: The AI's response to the conversation
        
    Raises:
        HTTPException: If the chat request fails or rate limit is exceeded
    """
    try:
        logger.info("Processing chat request")
        
        # Validación de seguridad
        await security_middleware.validate_request(request, body.dict())
        
        # Validate OpenAI API key
        if not settings.OPENAI_API_KEY:
            raise HTTPException(
                status_code=503,
                detail="OpenAI API key is not configured"
            )
        
        # Validate messages
        if not body.messages:
            raise HTTPException(
                status_code=400,
                detail="No messages provided in the request"
            )
        
        # Validar número de mensajes
        if len(body.messages) > settings.MAX_CHAT_MESSAGES:
            raise HTTPException(
                status_code=400,
                detail={
                    "error": "Too many messages",
                    "message": f"Maximum {settings.MAX_CHAT_MESSAGES} messages allowed",
                    "current_count": len(body.messages)
                }
            )
        
        # Validar longitud de cada mensaje
        for i, msg in enumerate(body.messages):
            if len(msg.content) > settings.MAX_CHAT_MESSAGE_LENGTH:
                raise HTTPException(
                    status_code=400,
                    detail={
                        "error": "Message too long",
                        "message": f"Maximum {settings.MAX_CHAT_MESSAGE_LENGTH} characters per message",
                        "message_index": i,
                        "current_length": len(msg.content)
                    }
                )
        
        # Process chat request
        try:
            response = await openai_service.chat(
                messages=body.messages,
                article_text=body.article_text,
                analysis_result=body.analysis_result,
                use_web_search=body.use_web_search
            )
            
            logger.info("Chat request processed successfully")
            return response
        except ValueError as ve:
            # Manejar errores de validación de tokens
            logger.error(f"Token validation error: {str(ve)}")
            raise HTTPException(
                status_code=400,
                detail={
                    "error": "Conversation too long",
                    "message": str(ve)
                }
            )
        except Exception as e:
            logger.error(f"Error in chat processing: {str(e)}", exc_info=True)
            raise HTTPException(
                status_code=500,
                detail=f"Error processing chat request: {str(e)}"
            )
        
    except HTTPException:
        # Re-lanzar HTTPException sin modificar
        raise
    except Exception as e:
        logger.error(f"Unexpected error in chat endpoint: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"An unexpected error occurred: {str(e)}"
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