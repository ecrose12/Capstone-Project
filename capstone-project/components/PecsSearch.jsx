// components/PecsSearch.jsx
"use client";
import { useState, useCallback, useRef, useEffect } from "react";
import { useParentMode } from "@/context/ParentModeContext";
import "./PecsSearch.css";

export default function PecsSearch({ onSelectCard }) {
  const { mode, loading: modeLoading } = useParentMode();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | loading | error | done
  const debounceRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const id = setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
    return () => clearTimeout(id);
  }, []);

  const runSearch = useCallback(async (term) => {
    if (!term.trim()) {
      setResults([]);
      setStatus("idle");
      return;
    }
    setStatus("loading");
    try {
      const res = await fetch(`/api/symbols/search?q=${encodeURIComponent(term)}`);
      if (!res.ok) throw new Error("Search failed");
      const data = await res.json();
      setResults(data);
      setStatus("done");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  }, []);

  function handleChange(e) {
    const value = e.target.value;
    setQuery(value);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => runSearch(value), 400);
  }

  if (modeLoading) return null;

  return (
    <div className="pecs-search">
      <div className="pecs-mode-indicator" aria-live="polite">
        {mode === "parent" ? "Parent Mode" : "Child Mode"}
      </div>
      <label htmlFor="pecs-search-input" className="pecs-search-label">
        Search for a picture card
      </label>
      <input
        ref={inputRef}
        id="pecs-search-input"
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="e.g. eat, happy, ball"
        autoComplete="off"
        className="pecs-search-input"
      />
      {status === "loading" && <p role="status">Searching…</p>}
      {status === "error" && (
        <p role="alert">Something went wrong. Please try again.</p>
      )}
      <div className="pecs-results-grid" role="list">
        {results.map((symbol) => (
          <button
            key={symbol.id}
            role="listitem"
            className="pecs-card-button"
            onClick={() => onSelectCard(symbol)}
            aria-label={`Select card: ${symbol.name}`}
          >
            <img src={symbol.imageUrl} alt={symbol.name} loading="lazy" />
            <span>{symbol.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}