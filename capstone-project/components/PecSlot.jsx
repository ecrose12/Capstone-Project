// components/PecSlot.jsx
"use client";
import { useState } from "react";
import PecPickerModal from "./PecPickerModal";
import SpeakButton from "./SpeakButton";

export default function PecSlot({ label, value, onChange, size = "large" }) {
  const [pickerOpen, setPickerOpen] = useState(false);

  return (
    <div className={`pec-slot pec-slot--${size}`}>
      <button
        type="button"
        className="pec-slot__box"
        onClick={() => setPickerOpen(true)}
        aria-label={
          value
            ? `${label}: ${value.name}. Tap to change.`
            : `${label}: empty. Tap to choose a picture card.`
        }
      >
        {value ? (
          <img src={value.imageUrl} alt={value.name} />
        ) : (
          <span className="pec-slot__placeholder" aria-hidden="true">+</span>
        )}
      </button>

      <div className="pec-slot__footer">
        <span className="pec-slot__label">{value ? value.name : label}</span>
        {value && <SpeakButton text={value.name} />}
      </div>

      {pickerOpen && (
        <PecPickerModal
          onSelect={(symbol) => {
            onChange(symbol);
            setPickerOpen(false);
          }}
          onClose={() => setPickerOpen(false)}
        />
      )}
    </div>
  );
}