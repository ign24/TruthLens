def get_analysis_prompt(text: str, url: str = None, title: str = None) -> str:
    return f"""
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