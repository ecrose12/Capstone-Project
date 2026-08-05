"use client";
import { useState } from "react";
import PecSlot from "../PecSlot";
import SpeakButton from "../SpeakButton";
import "./SentenceCreatorTemplate.css";

const DEFAULT_MAX_WORDS = 20;

function makeBlankWord() {
  return { id: crypto.randomUUID(), card: null };
}

export default function SentenceCreatorTemplate({ category }) {
  const maxWords = category.maxWords || DEFAULT_MAX_WORDS;
  const [words, setWords] = useState(() => [makeBlankWord()]);

  function updateCard(id, card) {
    setWords((prev) => prev.map((w) => (w.id === id ? { ...w, card } : w)));
  }

  function addWord() {
    setWords((prev) => (prev.length >= maxWords ? prev : [...prev, makeBlankWord()]));
  }

  function removeWord(id) {
    setWords((prev) => (prev.length <= 1 ? prev : prev.filter((w) => w.id !== id)));
  }

  function moveWord(index, direction) {
    setWords((prev) => {
      const target = index + direction;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function clearAll() {
    setWords([makeBlankWord()]);
  }

  const sentence = words
    .filter((w) => w.card)
    .map((w) => w.card.name)
    .join(" ");

  return (
    <div className="sentence-creator">
      <h1 className="sentence-creator__title">{category.name}</h1>

      <div className="sentence-creator__words">
        {words.map((word, index) => (
          <div key={word.id} className="sentence-creator__word">
            {words.length > 1 && (
              <div className="sentence-creator__word-controls">
                <button
                  type="button"
                  onClick={() => moveWord(index, -1)}
                  disabled={index === 0}
                  aria-label={`Move word ${index + 1} earlier in the sentence`}
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={() => moveWord(index, 1)}
                  disabled={index === words.length - 1}
                  aria-label={`Move word ${index + 1} later in the sentence`}
                >
                  →
                </button>
                <button
                  type="button"
                  className="sentence-creator__word-remove"
                  onClick={() => removeWord(word.id)}
                  aria-label={`Remove word ${index + 1}`}
                >
                  ×
                </button>
              </div>
            )}

            <PecSlot
              label={`Word ${index + 1}`}
              value={word.card}
              onChange={(card) => updateCard(word.id, card)}
            />
          </div>
        ))}
      </div>

      <button
        type="button"
        className="sentence-creator__add-word"
        onClick={addWord}
        disabled={words.length >= maxWords}
      >
        {words.length >= maxWords ? `Maximum ${maxWords} words` : "+ Add Word"}
      </button>

      {sentence && (
        <div className="sentence-creator__sentence-bar">
          <p>{sentence}</p>
          <SpeakButton text={sentence} />
        </div>
      )}

      <button type="button" className="sentence-creator__clear" onClick={clearAll}>
        Clear
      </button>
    </div>
  );
}