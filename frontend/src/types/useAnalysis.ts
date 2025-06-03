export interface Sentiments {
    joy: number;
    trust: number;
    fear: number;
    surprise: number;
    sadness: number;
    disgust: number;
    anger: number;
    anticipation: number;
}

export interface AnalysisResponse {
    factual_accuracy: number;
    bias: string;
    emotional_tone: string;
    recommendation: string;
    analysis_explanation?: {
        factual_accuracy: {
            score: number;
            key_indicators: string;
            examples_from_text: string;
            weight_of_factors: string;
            comparison_with_similar_content: string;
        };
        bias: {
            classification: string;
            language_patterns: string;
            examples_of_bias: string;
            context_and_implications: string;
            effect_on_message: string;
        };
        emotional_tone: {
            classification: string;
            emotional_language_patterns: string;
            examples_of_emotional_language: string;
            impact_on_message: string;
            effect_on_credibility: string;
        };
        recommendation: {
            text: string;
            key_factors: string;
            specific_concerns: string;
            relation_to_other_classifications: string;
        };
    };
    article_type?: {
        objective: number;
        subjective: number;
        speculative: number;
        emotive: number;
        clickbait: number;
    };
    sentiments?: {
        joy: number;
        trust: number;
        fear: number;
        surprise: number;
        sadness: number;
        disgust: number;
        anger: number;
        anticipation: number;
    };
}

export interface AnalysisRequest {
    text: string;
    examples_from_text: string;
} 