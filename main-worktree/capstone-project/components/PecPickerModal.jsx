// components/PecPickerModal.jsx
"use client";
import { useEffect, useRef } from "react";
import PecsSearch from "./PecsSearch";
import "./PecPickerModal.css";

export default function PecPickerModal({ onSelect, onClose }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    dialogRef.current?.focus();
    function onKeyDown(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div className="pec-modal-overlay" role="presentation" onClick={onClose}>
      <div
        className="pec-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Choose a picture card"
        ref={dialogRef}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="pec-modal__close" onClick={onClose} aria-label="Close">
          ×
        </button>
        <PecsSearch onSelectCard={onSelect} />
      </div>
    </div>
  );
}