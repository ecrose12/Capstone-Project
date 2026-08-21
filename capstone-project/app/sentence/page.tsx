'use client';

import { useState } from 'react';
import PecTile from '@/components/PecTile';
import MicIcon from '@/components/MicIcon';
import { searchSymbols, type Symbol } from '@/lib/symbols';
import { useSpeech } from '@/hooks/useSpeech';
import type { PecLike } from '@/lib/supabase/types';
import './sentence-creator-page.css';

const MAX_SLOTS = 12;

export default function SentenceCreatorPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Symbol[]>([]);
  const [slots, setSlots] = useState<(PecLike | null)[]>(
    Array(MAX_SLOTS).fill(null)
  );
  const { speak } = useSpeech();

  const handleSearch = async (value: string) => {
    setQuery(value);
    if (!value.trim()) {
      setResults([]);
      return;
    }
    setResults(await searchSymbols(value));
  };

  const addToNextSlot = (symbol: Symbol) => {
    setSlots((prev) => {
      const next = [...prev];
      const emptyIndex = next.findIndex((slot) => slot === null);
      if (emptyIndex !== -1) {
        next[emptyIndex] = { label: symbol.name, image_url: symbol.imageUrl };
      }
      return next;
    });
    setQuery('');
    setResults([]);
  };

  const clearSlot = (index: number) => {
    setSlots((prev) => prev.map((slot, i) => (i === index ? null : slot)));
  };

  const speakSentence = () => {
    const sentence = slots
      .filter((s): s is PecLike => s !== null)
      .map((s) => s.label)
      .join(' ');
    if (sentence) speak(sentence);
  };

  return (
    <main className="sentence-creator-page">
      <h1 className="sentence-creator-page__title">Sentence Creator</h1>

      <label className="sentence-creator-page__label" htmlFor="sentence-search">
        Search for a picture card:
      </label>
      <input
        id="sentence-search"
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Enter search term here"
        className="sentence-creator-page__input"
      />

      {results.length > 0 && (
        <ul className="sentence-creator-page__results">
          {results.map((symbol) => (
            <li key={symbol.id}>
              <button
                type="button"
                onClick={() => addToNextSlot(symbol)}
                className="sentence-creator-page__result-chip"
              >
                {symbol.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={symbol.imageUrl}
                    alt=""
                    className="sentence-creator-page__result-thumb"
                  />
                )}
                {symbol.name}
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="sentence-creator-page__sentence" aria-label="Sentence">
        {slots.map((pec, i) => (
          <div key={i} className="sentence-creator-page__slot-wrap">
            <PecTile
              pec={pec}
              onClick={() => (pec ? clearSlot(i) : undefined)}
              size="slot"
            />
            {i < slots.length - 1 && (
              <span className="sentence-creator-page__plus" aria-hidden="true">
                +
              </span>
            )}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={speakSentence}
        className="sentence-creator-page__speak-button"
        aria-label="Speak sentence"
      >
        <MicIcon size={48} />
        <span className="sentence-creator-page__speak-label">Speak Sentence</span>
      </button>
    </main>
  );
}
