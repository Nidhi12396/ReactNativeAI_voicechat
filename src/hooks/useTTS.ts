// src/hooks/useTTS.ts
import { useState, useCallback } from 'react';
import Tts from 'react-native-tts';

export interface UseTTSReturn {
  isSpeaking: boolean;
  speak: (text: string) => void;
  stop: () => void;
}

export function useTTS(): UseTTSReturn {
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Initialize TTS once on first speak
  const speak = useCallback((text: string) => {
    if (!text.trim()) return;
    try {
      Tts.stop();
      // Pass numbers as plain JS numbers, no config object
      Tts.setDefaultRate(0.5);
      Tts.setDefaultPitch(1.0);
      Tts.setDefaultLanguage('en-US');
      Tts.speak(text);
      setIsSpeaking(true);

      Tts.addEventListener('tts-finish', () => setIsSpeaking(false));
      Tts.addEventListener('tts-cancel', () => setIsSpeaking(false));
    } catch (e) {
      console.warn('TTS error:', e);
      setIsSpeaking(false);
    }
  }, []);

  const stop = useCallback(() => {
    try {
      Tts.stop();
    } catch (e) {
      console.warn('TTS stop error:', e);
    }
    setIsSpeaking(false);
  }, []);

  return { isSpeaking, speak, stop };
}