'use client';

import { useEffect, useState } from 'react';
import MicIcon from '@/components/MicIcon';
import { searchSymbols, type Symbol } from '@/lib/symbols';
import { saveSymbolAsFavorite } from '@/lib/supabase/pecs';
import { createClient } from '@/lib/supabase/client';
import { useSpeech } from '@/hooks/useSpeech';
import { useVoiceInput } from '@/hooks/useVoiceInput';
import './pec-selector-page.css';

export default function PecSelectorPage() {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Symbol | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const { speak } = useSpeech();

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null);
    });
  }, []);

  const handleSearch = async (value: string) => {
    setQuery(value);
    setSaved(false);
    if (!value.trim()) {
      setSelected(null);
      return;
    }
    setLoading(true);
    const found = await searchSymbols(value);
    setSelected(found[0] ?? null);
    setLoading(false);
  };

  const { start: startListening, listening, isSupported: voiceSupported } =
    useVoiceInput({ onResult: handleSearch });

  const handleSave = async () => {
    if (!selected || !userId) return;
    setSaving(true);
    const result = await saveSymbolAsFavorite(selected, userId);
    setSaving(false);
    setSaved(!!result);
  };

  return (
    <main className="pec-selector-page">
      <h1 className="pec-selector-page__title">
        Single PEC
        <br />
        Selector Card
      </h1>

      <label className="pec-selector-page__label" htmlFor="pec-search">
        Search for a picture card:
      </label>
      <input
        id="pec-search"
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Enter search term here"
        className="pec-selector-page__input"
      />

      <button
        type="button"
        onClick={() => selected && speak(selected.name)}
        disabled={!selected}
        className="pec-selector-page__preview"
        aria-label={selected ? `Play ${selected.name}` : 'Search for a picture card'}
      >
        {loading ? (
          <span className="pec-selector-page__preview-text">Searching…</span>
        ) : selected?.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={selected.imageUrl}
            alt={selected.name}
            className="pec-selector-page__preview-image"
          />
        ) : (
          <span className="pec-selector-page__preview-text">
            {selected ? selected.name : 'Search for picture here'}
          </span>
        )}
      </button>

      <div className="pec-selector-page__actions">
        {voiceSupported && (
          <button
            type="button"
            onClick={startListening}
            aria-label={listening ? 'Listening…' : 'Search by voice'}
            className={`pec-selector-page__voice-button${listening ? ' pec-selector-page__voice-button--listening' : ''}`}
          >
            <MicIcon />
          </button>
        )}
        <button
          type="button"
          onClick={handleSave}
          disabled={!selected || !userId || saving}
          className="pec-selector-page__save-button"
          aria-label="Save to favorites"
        >
          <span className="pec-selector-page__save-icon" aria-hidden="true">⭐</span>
          <span className="pec-selector-page__save-label">
            {saved ? 'Saved!' : saving ? 'Saving…' : 'Save to Favorites'}
          </span>
        </button>
      </div>
    </main>
  );
}