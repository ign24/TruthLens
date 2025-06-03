from pydantic import BaseModel, Field
from typing import Optional, Dict, Any

class AnalysisResponse(BaseModel):
    """
    Response model for article analysis containing factual accuracy, bias assessment,
    emotional tone, and detailed analysis components.
    """
    factual_accuracy: int = Field(..., ge=0, le=100)
    bias: str
    emotional_tone: str
    recommendation: str
    analysis_explanation: Optional[Dict[str, Any]] = Field(default=None, description="Detailed analysis explanation")
    article_type: Optional[Dict[str, float]] = None
    sentiments: Optional[Dict[str, float]] = None

class AnalysisRequest(BaseModel):
    """
    Request model for article analysis containing the text to analyze.
    """
    text: str = Field(..., min_length=1)

class ChatRequest(BaseModel):
    """
    Request model for chat interactions containing the user message,
    original text, and previous analysis.
    """
    message: str
    text: str
    analysis: AnalysisResponse

class ChatResponse(BaseModel):
    """
    Response model for chat interactions containing the AI's response.
    """
    response: str 