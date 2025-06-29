import { ref } from 'vue';
import { getApiUrl, checkApiHealth } from '../config/api';

interface AnalysisResult {
  factual_accuracy: number;
  bias: string;
  emotional_tone: string;
  recommendation: string;
  analysis_explanation?: string;
}

console.log('Using backend:', getApiUrl('ANALYZE'));

export function useAnalysis() {
  const result = ref<AnalysisResult | null>(null);
  const isApiHealthy = ref(true);

  const analyzeContent = async (text: string): Promise<AnalysisResult> => {
    // Check API health before sending request
    if (!isApiHealthy.value) {
      isApiHealthy.value = await checkApiHealth();
      if (!isApiHealthy.value) {
        throw new Error('El servidor no está disponible. Por favor, intenta más tarde.');
      }
    }

    console.log('Sending analysis request to:', getApiUrl('ANALYZE'));
    
    const response = await fetch(getApiUrl('ANALYZE'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('Analysis error:', {
        status: response.status,
        statusText: response.statusText,
        errorData
      });

      // Handle specific error cases
      if (response.status === 404) {
        throw new Error('El endpoint de análisis no está disponible. Por favor, verifica la configuración del servidor.');
      } else if (response.status === 503) {
        isApiHealthy.value = false;
        throw new Error('El servidor está temporalmente no disponible. Por favor, intenta más tarde.');
      } else {
        throw new Error(`Error en el análisis: ${response.status} ${response.statusText}`);
      }
    }

    const data = await response.json();
    console.log('Analysis response:', data);

    const formatted: AnalysisResult = {
      factual_accuracy: data.factual_accuracy,
      bias: data.bias,
      emotional_tone: data.emotional_tone,
      recommendation: data.recommendation,
      analysis_explanation: JSON.stringify(data)
    };

    result.value = formatted;
    return formatted;
  };

  return {
    result,
    analyzeContent,
    isApiHealthy
  };
}