// components/PecsSearch.jsx
"use client";
import { useState, useCallback, useRef, useEffect } from "react";
import { useParentMode } from "@/context/ParentModeContext";
import "./PecsSearch.css";

const SEARCH_MODE_KEY = "pecs-search-mode";

export default function PecsSearch({ onSelectCard }) {
  const { mode, loading: modeLoading } = useParentMode();
  const [searchMode, setSearchMode] = useState("type"); // "type" | "category"
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | loading | error | done
  const debounceRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const stored = window.localStorage.getItem(SEARCH_MODE_KEY);
    if (stored === "type" || stored === "category") {
      setSearchMode(stored);
    }
  }, []);

  useEffect(() => {
    if (searchMode !== "category" || categories.length > 0) return;
    setCategoriesLoading(true);
    fetch("/api/pec-categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch(() => setCategories([]))
      .finally(() => setCategoriesLoading(false));
  }, [searchMode, categories.length]);

  useEffect(() => {
    if (searchMode !== "type") return;
    const id = setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
    return () => clearTimeout(id);
  }, [searchMode]);

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

  async function handleSelectCategory(category) {
    setActiveCategory(category);
    setStatus("loading");
    try {
      const res = await fetch(`/api/pec-categories/browse?category=${category.id}`);
      if (!res.ok) throw new Error("Search failed");
      const data = await res.json();
      setResults(data);
      setStatus("done");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  }

  function handleBackToCategories() {
    setActiveCategory(null);
    setResults([]);
    setStatus("idle");
  }

  if (modeLoading) return null;

  const modeLabel = mode === "parent" ? "Parent Mode" : "Child Mode";

  if (searchMode === "category") {
    return (
      <div className="pecs-search">
        <div className="pecs-mode-indicator" aria-live="polite">
          {modeLabel}
        </div>

        {!activeCategory ? (
          <>
            <p className="pecs-search-label">Choose a category</p>

            {categoriesLoading && <p role="status">Loading categories…</p>}

            <div className="pecs-category-grid" role="list">
              {categories.map((category) => (
                <button
                  key={category.id}
                  role="listitem"
                  type="button"
                  className="pecs-category-button"
                  onClick={() => handleSelectCategory(category)}
                  aria-label={category.label}
                >
                  {category.imageUrl ? (
                    <img src={category.imageUrl} alt="" loading="lazy" />
                  ) : (
                    <span className="pecs-category-button__placeholder" aria-hidden="true">
                      +
                    </span>
                  )}
                  <span className="pecs-category-button__label">{category.label}</span>
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <button
              type="button"
              className="pecs-category-back"
              onClick={handleBackToCategories}
            >
              ← All Categories
            </button>
            <p className="pecs-search-label">{activeCategory.label}</p>

            {status === "loading" && <p role="status">Searching…</p>}
            {status === "error" && (
              <p role="alert">Something went wrong. Please try again.</p>
            )}
            {status === "done" && results.length === 0 && (
              <p role="status">No cards found for this category.</p>
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
          </>
        )}
      </div>
    );
  }

  return (
    <div className="pecs-search">
      <div className="pecs-mode-indicator" aria-live="polite">
        {modeLabel}
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