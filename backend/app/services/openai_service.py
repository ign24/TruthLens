from typing import Optional, List, Dict, Any
import logging
import json
from openai import AsyncOpenAI
from ..models.schemas import AnalysisResponse
from ..core.config import settings
from .storage_service import StorageService
from ..models.schemas import PoliticalBias
from ..utils.retriever import search_web
import unicodedata

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

TRIGGER_KEYWORDS = [
    # Español
    "veracidad", "verificar", "fuente", "es cierto", "analicemos", "comprobar", "chequear", "buscar en internet",
    # Inglés
    "truth", "verify", "source", "fact check", "fact-check", "check this", "is it true", "analyze", "search online"
]

def normalize(text):
    return ''.join(
        c for c in unicodedata.normalize('NFD', text.lower())
        if unicodedata.category(c) != 'Mn'
    )

def should_use_web_search(message: str, use_web_search_flag: bool = False) -> bool:
    norm_msg = normalize(message)
    return use_web_search_flag or any(kw in norm_msg for kw in TRIGGER_KEYWORDS)

class OpenAIService:
    def __init__(self):
        self.client = AsyncOpenAI(
            api_key=settings.OPENAI_API_KEY,
            max_retries=2,
            timeout=10.0,
        )
        self.model = settings.OPENAI_MODEL
        self.storage = StorageService()
        logger.info(f"OpenAIService initialized with model: {self.model}")

    async def analyze_text(
        self,
        text: str,
        url: Optional[str] = None,
        title: Optional[str] = None
    ) -> AnalysisResponse:
        # Prepare the prompt
        prompt = f"""
        Provide a detailed analysis and recommendation.

        Text: {text}
        {f'URL: {url}' if url else ''}
        {f'Title: {title}' if title else ''}

        Please provide a detailed analysis that includes:

        1. Truthfulness Analysis (0-100%):
           - Overall truthfulness score
           - Key indicators affecting truthfulness
           - Specific examples from the text supporting the score
           - Factors considered and their weight in the evaluation
           - Comparison with similar content

        2. Bias Analysis:
           - Bias classification (must be one of the following):
             * neutral
             * center-left
             * left-leaning
             * center-right
             * right-leaning
             * anti-government
             * pro-government
             * other (specify)
           - Language patterns indicating bias
           - Specific examples of biased language
           - Context and implications of bias
           - Effect of bias on the overall message

        3. Emotional Tone Analysis:
           - Tone classification (neutral, emotional, alarmist, balanced)
           - Emotional language patterns
           - Specific examples of emotional language
           - Impact of tone on the message
           - Effect on credibility

        4. Reader Recommendation:
           - General recommendation
           - Key factors to consider
           - Specific concerns
           - Relationship with other classifications

        Please provide specific examples from the text for each section and explain how you reached each conclusion.
        """

        # Call OpenAI API
        response = await self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": "You are an expert in news verification and objectivity analysis. Use clear and accessible language for the general public. For bias analysis, use EXACTLY one of the specified classifications."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=1000
        )

        # Parse the response
        analysis_text = response.choices[0].message.content
        
        try:
            # Parse the response to extract scores and details
            # Convert the bias string to the corresponding PoliticalBias enum value
            bias_str = "neutral"  # Default value, should be extracted from analysis_text
            try:
                bias_enum = PoliticalBias(bias_str.lower())
            except ValueError:
                bias_enum = PoliticalBias.OTHER

            analysis_response = AnalysisResponse(
                factual_accuracy=0.8,  # These would be parsed from the response
                bias=bias_enum,
                emotional_tone=0.5,
                recommendation="This news appears to be generally truthful but shows some bias.",
                details={"raw_analysis": analysis_text}
            )
            
            # Save article and analysis
            self.storage.save_article(text, analysis_response.dict())
            
            return analysis_response
        except Exception as e:
            raise Exception(f"Error parsing OpenAI response: {str(e)}")

    async def chat(
        self,
        messages: List[Dict[str, str]],
        article_text: Optional[str] = None,
        analysis_result: Optional[Dict] = None,
        use_web_search: bool = False
    ) -> Dict[str, Any]:
        """Chat with the model about an article and its analysis."""
        try:
            # Get current article from storage
            current_article = self.storage.get_current_article()
            
            # Prepare system message with context
            system_message = {
                "role": "system",
                "content": (
                    "You are an assistant specialized in news analysis and AI explainability for journalists.\n"
                    "- If the user explicitly asks about the analysis, scores (factual accuracy, bias, emotional tone, recommendations), or requests explanations about the analysis result, use the context of the article and analysis_result to answer clearly, briefly, and educationally.\n"
                    "- If the user asks about sources, suggest how to find reliable information or how to fact-check.\n"
                    "- If the user asks about emotions, explain how they were detected and what they mean in the context of the article.\n"
                    "- If the user does NOT mention anything related to the analysis, respond as a conversational journalistic assistant specialized in text analysis, but do NOT mention the analysis unless it is relevant to the question.\n"
                    "- Do not repeat unnecessary information and keep answers brief and useful.\n"
                    "- Always respond in English unless the user's input is in Spanish; in that case, respond in Spanish.\n"
                    "Remember: Only use the analysis_result and article_text if the user's question requires it."
                )
            }

            # Add article context if available
            if current_article:
                system_message["content"] += f"\n\nArticle to analyze:\n{current_article['text']}"
                if current_article.get('analysis'):
                    system_message["content"] += f"\n\nCurrent analysis:\n{json.dumps(current_article['analysis'], indent=2)}"

            # Get the last user message (multilingual trigger)
            last_user_message = next((msg.content for msg in reversed(messages) if msg.role == "user"), None)
            trigger_web_search = False
            if last_user_message:
                trigger_web_search = should_use_web_search(last_user_message, use_web_search)

            # If web search is requested (by flag or trigger), perform the search and add results to context
            if trigger_web_search:
                try:
                    # Use 10 results if the message is about verifying news (using multilingual trigger)
                    num_results = 10 if any(kw in normalize(last_user_message) for kw in [
                        "veracidad", "verificar", "fact check", "fact-check", "analicemos", "truth", "verify", "fact check", "fact-check", "analyze"
                    ]) else 5
                    logger.info(f"Performing web search with {num_results} results for query: {last_user_message}")
                    search_results = search_web(last_user_message, num_results=num_results)
                    if search_results:
                        system_message["content"] += "\n\nWeb search results (use ONLY these sources):\n"
                        for idx, result in enumerate(search_results, 1):
                            system_message["content"] += f"\n[{idx}] Title: {result['title']}\nSnippet: {result['snippet']}\nURL: {result['url']}\n"
                        system_message["content"] += ("\nInstructions: You MUST base your answer ONLY on the web search results above. "
                            "For every claim, cite the source with its URL in parentheses. "
                            "At the end of your answer, list all the URLs you checked as 'Sources checked:'. "
                            "If none of the sources are relevant, reply: 'I couldn't find any reliable sources to verify that information. If you want, you can try rephrasing your question, provide more details, or ask about a related topic!' "
                            "Do NOT use your own knowledge or make up information. Respond in the same language as the user.")
                    else:
                        logger.warning("No search results found")
                except Exception as e:
                    logger.error(f"Error during web search: {str(e)}", exc_info=True)
                    raise Exception(f"Error during web search: {str(e)}")

            # Prepare messages with system context
            full_messages = [system_message] + [{"role": msg.role, "content": msg.content} for msg in messages]
            logger.info(f"Sending request to OpenAI with {len(full_messages)} messages")

            # Get response from OpenAI
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=full_messages,
                temperature=0.7,
                max_tokens=150  # Limit response length
            )

            return {
                "message": {
                    "role": "assistant",
                    "content": response.choices[0].message.content
                }
            }

        except Exception as e:
            logger.error(f"Error in OpenAI communication: {str(e)}", exc_info=True)
            raise Exception(f"Error in OpenAI communication: {str(e)}") 