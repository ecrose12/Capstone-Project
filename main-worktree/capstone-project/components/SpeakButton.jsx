// components/SpeakButton.jsx
"use client";

export default function SpeakButton({ text }) {
  function speak() {
    if (!("speechSynthesis" in window)) return;
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.cancel(); // stop any prior speech first
    window.speechSynthesis.speak(utterance);
  }

  return (
    <button
      type="button"
      className="speak-button"
      onClick={speak}
      aria-label={`Speak: ${text}`}
    >
      🔊
    </button>
  );
}