import { ref } from 'vue';

interface AnalysisResult {
  factualAccuracy: number;
  bias: 'left' | 'right' | 'neutral';
  emotionalLevel: string;
  recommendation: string;
}

export function useAnalysis() {
  const result = ref<AnalysisResult | null>(null);

  const analyzeContent = async (text: string) => {
    // Simulate API call
    return new Promise<AnalysisResult>((resolve) => {
      setTimeout(() => {
        resolve({
          factualAccuracy: Math.floor(Math.random() * 30) + 70, // 70-100
          bias: ['left', 'right', 'neutral'][Math.floor(Math.random() * 3)] as 'left' | 'right' | 'neutral',
          emotionalLevel: ['Neutral', 'Slightly emotional', 'Highly emotional', 'Alarmist'][Math.floor(Math.random() * 4)],
          recommendation: [
            'Well-argued and balanced perspective',
            'Consider checking additional sources',
            'Exercise caution - emotional language detected',
            'Recommended to verify claims independently'
          ][Math.floor(Math.random() * 4)]
        });
      }, 2000);
    });
  };

  return {
    result,
    analyzeContent
  };
}