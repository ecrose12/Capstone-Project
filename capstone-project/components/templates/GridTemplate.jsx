"use client";
import { useState, useCallback } from "react";
import PecsSearch from "../PecsSearch";
import SpeakButton from "../SpeakButton";

export default function GridTemplate({ category }) {
  const isMulti = category.selectionMode === "multi";

  // Single mode: selection is one card or null.
  // Multi mode: selection is an ordered array of cards.
  const [selection, setSelection] = useState(isMulti ? [] : null);

  const handleSelectCard = useCallback(
    (card) => {
      if (isMulti) {
        setSelection((prev) => [...prev, card]);
      } else {
        setSelection(card);
      }
    },
    [isMulti]
  );

  const removeAt = useCallback((index) => {
    setSelection((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const moveCard = useCallback((index, direction) => {
    setSelection((prev) => {
      const next = [...prev];
      const target = index + direction;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }, []);

  function clearSelection() {
    setSelection(isMulti ? [] : null);
  }

  const sentence = isMulti ? selection.map((c) => c.name).join(" ") : null;

  return (
    <div className="grid-template">
      <h1 className="grid-template__title">{category.name}</h1>

      {/* Selection tray */}
      <div
        className="grid-template__tray"
        role="region"
        aria-label={isMulti ? "Selected cards" : "Selected card"}
      >
        {isMulti ? (
          selection.length === 0 ? (
            <p className="grid-template__tray-empty">
              Search below and tap cards to build a sentence.
            </p>
          ) : (
            <>
              <ol className="grid-template__tray-list">
                {selection.map((card, i) => (
                  <li key={`${card.id}-${i}`} className="grid-template__tray-item">
                    <img src={card.imageUrl} alt={card.name} />
                    <span>{card.name}</span>
                    <div className="grid-template__tray-item-controls">
                      <button
                        type="button"
                        onClick={() => moveCard(i, -1)}
                        disabled={i === 0}
                        aria-label={`Move ${card.name} earlier`}
                      >
                        ←
                      </button>
                      <button
                        type="button"
                        onClick={() => moveCard(i, 1)}
                        disabled={i === selection.length - 1}
                        aria-label={`Move ${card.name} later`}
                      >
                        →
                      </button>
                      <button
                        type="button"
                        onClick={() => removeAt(i)}
                        aria-label={`Remove ${card.name}`}
                      >
                        ×
                      </button>
                    </div>
                  </li>
                ))}
              </ol>

              <div className="grid-template__sentence-bar">
                <p>{sentence}</p>
                <SpeakButton text={sentence} />
              </div>
            </>
          )
        ) : selection ? (
          <div className="grid-template__single-selected">
            <img src={selection.imageUrl} alt={selection.name} />
            <span>{selection.name}</span>
            <SpeakButton text={selection.name} />
          </div>
        ) : (
          <p className="grid-template__tray-empty">
            Search below and tap a card to select it.
          </p>
        )}

        {((isMulti && selection.length > 0) || (!isMulti && selection)) && (
          <button type="button" className="grid-template__clear" onClick={clearSelection}>
            Clear
          </button>
        )}
      </div>

      {/* Search / browse grid */}
      <PecsSearch onSelectCard={handleSelectCard} />
    </div>
  );
}