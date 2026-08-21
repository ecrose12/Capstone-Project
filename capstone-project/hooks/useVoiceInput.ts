'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

type UseVoiceInputOptions = {
  onResult: (transcript: string) => void;
};

/**
 * Wraps the browser's SpeechRecognition API for voice search. Safari/iOS
 * support is spotty, so always pair this with a working text input as
 * the fallback — never make voice the only way in.
 */
export function useVoiceInput({ onResult }: UseVoiceInputOptions) {
  const [listening, setListening] = useState(false);
  // Start false on both server and client so the first client render
  // matches the server-rendered HTML exactly — then flip it after mount,
  // once we're safely in the browser. This avoids a hydration mismatch.
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    setIsSupported(
      'SpeechRecognition' in window || 'webkitSpeechRecognition' in window
    );
  }, []);

  const start = useCallback(() => {
    if (!isSupported || listening) return;

    const SpeechRecognitionCtor =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognitionCtor();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
    };

    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  }, [isSupported, listening, onResult]);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
    setListening(false);
  }, []);

  return { start, stop, listening, isSupported };
}