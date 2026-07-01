// src/hooks/useVoice.ts
import { useState, useEffect, useCallback } from 'react';
import { Platform, PermissionsAndroid, Alert } from 'react-native';
import Voice, {
  SpeechResultsEvent,
  SpeechErrorEvent,
  SpeechStartEvent,
  SpeechEndEvent,
} from '@react-native-voice/voice';

export interface UseVoiceReturn {
  isListening: boolean;
  spokenText: string;
  error: string | null;
  startListening: () => Promise<void>;
  stopListening: () => Promise<void>;
  resetSpokenText: () => void;
}

export function useVoice(): UseVoiceReturn {
  const [isListening, setIsListening] = useState(false);
  const [spokenText, setSpokenText] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Voice.onSpeechStart = (_e: SpeechStartEvent) => {
      setIsListening(true);
      setError(null);
    };

    Voice.onSpeechEnd = (_e: SpeechEndEvent) => {
      setIsListening(false);
    };

    Voice.onSpeechResults = (e: SpeechResultsEvent) => {
      if (e.value && e.value.length > 0) {
        setSpokenText(e.value[0]);
      }
    };

    Voice.onSpeechError = (e: SpeechErrorEvent) => {
      setIsListening(false);
      const msg = e.error?.message || 'Voice recognition error.';
      // Ignore "no-speech" as it's not really an error
      if (!msg.includes('No speech') && !msg.includes('7')) {
        setError(msg);
      }
    };

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const requestMicPermission = async (): Promise<boolean> => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'Microphone Permission',
            message: 'Nova needs access to your microphone to listen to your voice.',
            buttonPositive: 'Allow',
            buttonNegative: 'Deny',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch {
        return false;
      }
    }
    // iOS permissions are declared in Info.plist
    return true;
  };

  const startListening = useCallback(async () => {
    const hasPermission = await requestMicPermission();
    if (!hasPermission) {
      Alert.alert('Permission Required', 'Microphone access is needed to use voice features.');
      return;
    }
    try {
      setSpokenText('');
      setError(null);
      await Voice.start('en-US');
    } catch (e: any) {
      setError(e.message || 'Failed to start listening.');
      setIsListening(false);
    }
  }, []);

  const stopListening = useCallback(async () => {
    try {
      await Voice.stop();
      setIsListening(false);
    } catch (e: any) {
      setError(e.message || 'Failed to stop listening.');
    }
  }, []);

  const resetSpokenText = useCallback(() => {
    setSpokenText('');
    setError(null);
  }, []);

  return {
    isListening,
    spokenText,
    error,
    startListening,
    stopListening,
    resetSpokenText,
  };
}
