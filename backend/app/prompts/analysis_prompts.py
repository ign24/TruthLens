from typing import Optional

def get_analysis_prompt(text: str, url: Optional[str] = None, title: Optional[str] = None) -> str:
    """
    Generate the main analysis prompt for text analysis.
    
    Args:
        text: The text to analyze
        url: Optional URL of the article
        title: Optional title of the article
        
    Returns:
        str: The formatted prompt
    """
    context = f"Text to analyze:\n{text}\n"
    if url:
        context += f"\nURL: {url}\n"
    if title:
        context += f"\nTitle: {title}\n"

    return f"""Analyze the following text for factual accuracy, bias, emotional tone, and provide a detailed analysis.
{context}

Return your analysis as a valid JSON object with ALL the following fields, even if some values are zero, empty, or not applicable. Do NOT omit any field. Use the exact structure and field names below:

{{
    "factual_accuracy": <integer from 0-100>,
    "bias": <one of: \"neutral\", \"center-left\", \"left-leaning\", \"center-right\", \"right-leaning\", \"anti-government\", \"pro-government\", \"other\">,
    "emotional_tone": <one of: \"neutral\", \"positive\", \"negative\", \"mixed\">,
    "recommendation": <string>,
    "article_type": {{
        "objective": <float 0-1>,
        "subjective": <float 0-1>,
        "speculative": <float 0-1>,
        "emotive": <float 0-1>,
        "clickbait": <float 0-1>
    }},
    "sentiments": {{
        "joy": <float 0-1>,
        "trust": <float 0-1>,
        "fear": <float 0-1>,
        "surprise": <float 0-1>,
        "sadness": <float 0-1>,
        "disgust": <float 0-1>,
        "anger": <float 0-1>,
        "anticipation": <float 0-1>
    }},
    "analysis_explanation": {{
        "factual_accuracy": {{
            "score": <integer 0-100>,
            "key_indicators": <string>,
            "examples_from_text": <string>,
            "weight_of_factors": <string>,
            "comparison_with_similar_content": <string>
        }},
        "bias": {{
            "classification": <string>,
            "language_patterns": <string>,
            "examples_of_bias": <string>,
            "context_and_implications": <string>,
            "effect_on_message": <string>
        }},
        "emotional_tone": {{
            "classification": <string>,
            "emotional_language_patterns": <string>,
            "examples_of_emotional_language": <string>,
            "impact_on_message": <string>,
            "effect_on_credibility": <string>
        }},
        "recommendation": {{
            "text": <string>,
            "key_factors": <string>,
            "specific_concerns": <string>,
            "relation_to_other_classifications": <string>
        }}
    }}
}}

IMPORTANT: The field "sentiments" MUST always be a JSON object with ALL of the following keys: "joy", "trust", "fear", "surprise", "sadness", "disgust", "anger", "anticipation". Do not use a string or array. If a value is not present, use 0.
If you do not have data for a field, use 0 for numbers, "" for strings, and [] for arrays. Do NOT omit any field. Return only the JSON object, nothing else.
"""

def get_system_prompt() -> str:
    """
    Get the system prompt for the analysis.
    
    Returns:
        str: The system prompt
    """
    return """You are an expert in news verification and objectivity analysis. Use clear and accessible language for the general public. For bias analysis, use EXACTLY one of the specified classifications."""

def get_chat_system_prompt() -> str:
    """
    Get the system prompt for chat interactions.
    
    Returns:
        str: The system prompt
    """
    return """You are an assistant specialized in news analysis and AI explainability for journalists.
- If the user explicitly asks about the analysis, scores (factual accuracy, bias, emotional tone, recommendations), or requests explanations about the analysis result, use the context of the article and analysis_result to answer clearly, briefly, and educationally.
- If the user asks about sources, suggest how to find reliable information or how to fact-check.
- If the user asks about emotions, explain how they were detected and what they mean in the context of the article.
- If the user does NOT mention anything related to the analysis, respond as a conversational journalistic assistant specialized in text analysis, but do NOT mention the analysis unless it is relevant to the question.
- Do not repeat unnecessary information and keep answers brief and useful.
- Always respond in English unless the user's input is in Spanish; in that case, respond in Spanish.
Remember: Only use the analysis_result and article_text if the user's question requires it."""

def get_web_search_instructions() -> str:
    """
    Get the instructions for web search results.
    
    Returns:
        str: The web search instructions
    """
    return """Instructions: You MUST base your answer ONLY on the web search results above. 
For every claim, cite the source with its URL in parentheses. 
At the end of your answer, list all the URLs you checked as 'Sources checked:'. 
If none of the sources are relevant, reply: 'I couldn't find any reliable sources to verify that information. If you want, you can try rephrasing your question, provide more details, or ask about a related topic!' 
Do NOT use your own knowledge or make up information. Respond in the same language as the user.""" 