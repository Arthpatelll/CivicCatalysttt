import { useState, useEffect } from 'react';

interface SpeechRecognitionState {
  isListening: boolean;
  transcript: string;
  error: string | null;
  isSupported: boolean;
}

export const useSpeechRecognition = (language: string = 'en-US') => {
  const [state, setState] = useState<SpeechRecognitionState>({
    isListening: false,
    transcript: '',
    error: null,
    isSupported: false
  });

  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        const recognitionInstance = new SpeechRecognition();
        recognitionInstance.continuous = false;
        recognitionInstance.interimResults = false;
        recognitionInstance.lang = language;

        recognitionInstance.onstart = () => {
          setState(prev => ({ ...prev, isListening: true, error: null }));
        };

        recognitionInstance.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setState(prev => ({ ...prev, transcript, isListening: false }));
        };

        recognitionInstance.onerror = (event: any) => {
          setState(prev => ({ ...prev, error: event.error, isListening: false }));
        };

        recognitionInstance.onend = () => {
          setState(prev => ({ ...prev, isListening: false }));
        };

        setRecognition(recognitionInstance);
        setState(prev => ({ ...prev, isSupported: true }));
      } else {
        setState(prev => ({ ...prev, isSupported: false }));
      }
    }
  }, [language]);

  const startListening = () => {
    if (recognition && !state.isListening) {
      recognition.start();
    }
  };

  const stopListening = () => {
    if (recognition && state.isListening) {
      recognition.stop();
    }
  };

  const resetTranscript = () => {
    setState(prev => ({ ...prev, transcript: '' }));
  };

  return {
    ...state,
    startListening,
    stopListening,
    resetTranscript
  };
};