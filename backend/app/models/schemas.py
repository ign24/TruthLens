from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from enum import Enum

class PoliticalBias(str, Enum):
    NEUTRAL = "neutral"
    CENTER_LEFT = "center-left"
    LEFT_LEANING = "left-leaning"
    CENTER_RIGHT = "center-right"
    RIGHT_LEANING = "right-leaning"
    ANTI_GOVERNMENT = "anti-government"
    PRO_GOVERNMENT = "pro-government"
    OTHER = "other"

class AnalysisRequest(BaseModel):
    text: str = Field(..., description="The text content to analyze")
    url: Optional[str] = Field(None, description="Optional URL of the article")
    title: Optional[str] = Field(None, description="Optional title of the article")

class AnalysisResponse(BaseModel):
    factual_accuracy: float
    bias: PoliticalBias
    emotional_tone: float
    recommendation: str
    details: Dict[str, Any]

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    article_text: Optional[str] = None
    analysis_result: Optional[Dict[str, Any]] = None
    use_web_search: Optional[bool] = Field(default=False, description="Whether to use web search for answering the question")

class ChatResponse(BaseModel):
    message: ChatMessage 