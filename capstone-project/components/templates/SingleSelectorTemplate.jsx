"use client";
import { useState } from "react";
import PecSlot from "../PecSlot";
import SpeakButton from "../SpeakButton";
import "./SingleSelectorTemplate.css";

export default function SingleSelectorTemplate({ category }) {
  const [selected, setSelected] = useState(null);

  function clear() {
    setSelected(null);
  }

  return (
    <div className="single-selector-template">
      <h1 className="single-selector-template__title">{category.name}</h1>

      <div className="single-selector-template__row">
        <PecSlot label={category.name} value={selected} onChange={setSelected} />
      </div>

      {selected && (
        <div className="single-selector-template__sentence-bar">
          <p>{selected.name}</p>
          <SpeakButton text={selected.name} />
        </div>
      )}

      <button type="button" className="single-selector-template__clear" onClick={clear}>
        Clear
      </button>
    </div>
  );
}