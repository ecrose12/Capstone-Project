'use client';

import { useCallback } from 'react';

/**
 * Wraps the browser's Web Speech API (SpeechSynthesis) so any component
 * can speak text out loud on tap. This is the core interaction for an
 * AAC app — every card, button, and phrase should call `speak()`.
 */
export function useSpeech() {
  const isSupported =
    typeof window !== 'undefined' && 'speechSynthesis' in window;

  const speak = useCallback(
    (text: string) => {
      if (!isSupported || !text) return;

      // Cancel anything currently being spoken so taps feel responsive
      // instead of queuing up a backlog of utterances.
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    },
    [isSupported]
  );

  const stop = useCallback(() => {
    if (isSupported) window.speechSynthesis.cancel();
  }, [isSupported]);

  return { speak, stop, isSupported };
}
