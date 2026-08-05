// components/templates/DualBoxTemplate.jsx
"use client";
import { useState } from "react";
import PecSlot from "../PecSlot";
import SpeakButton from "../SpeakButton";
import "./DualBoxTemplate.css";

export default function DualBoxTemplate({ category }) {
  const [first, setFirst] = useState(null);
  const [second, setSecond] = useState(null);
  const [labelA, labelB] = category.labels;

  const sentence =
    first && second ? category.ttsTemplate(first.name, second.name) : null;

  function clearAll() {
    setFirst(null);
    setSecond(null);
  }

  return (
    <div className="dual-box-template">
      <h1 className="dual-box-template__title">
        {labelA} <span aria-hidden="true">→</span> {labelB}
      </h1>

      <div className="dual-box-template__row">
        <PecSlot label={labelA} value={first} onChange={setFirst} />
        <div className="dual-box-template__arrow" aria-hidden="true" />
        <PecSlot label={labelB} value={second} onChange={setSecond} />
      </div>

      {sentence && (
        <div className="dual-box-template__sentence-bar">
          <p>{sentence}</p>
          <SpeakButton text={sentence} />
        </div>
      )}

      <button type="button" className="dual-box-template__clear" onClick={clearAll}>
        Clear
      </button>
    </div>
  );
}