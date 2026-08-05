// components/DevicePairing.jsx
"use client";
import { useState, useRef } from "react";

export default function DevicePairing({ onPaired, onSkip }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  function handleCodeChange(e) {
    // Digits only, max 6 — keeps the field forgiving of stray taps
    const digitsOnly = e.target.value.replace(/\D/g, "").slice(0, 6);
    setCode(digitsOnly);
    if (error) setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (code.length !== 6) {
      setError("Enter the 6-digit code shown on the parent's device.");
      inputRef.current?.focus();
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/pairing/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "That code didn't work. Check it and try again.");
        setLoading(false);
        inputRef.current?.focus();
        return;
      }

      onPaired?.();
    } catch {
      setError("Couldn't reach the server. Check your connection and try again.");
      setLoading(false);
    }
  }

  return (
    <div className="device-pairing">
      <h1 className="device-pairing__title">Pair This Device</h1>
      <p className="device-pairing__instructions">
        On the parent's device, go to Settings and select{" "}
        <strong>Pair a New Device</strong> to get a code. Enter that code
        below.
      </p>

      <form onSubmit={handleSubmit} noValidate>
        <label htmlFor="pairing-code" className="device-pairing__label">
          6-digit code
        </label>
        <input
          ref={inputRef}
          id="pairing-code"
          name="pairing-code"
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="[0-9]*"
          maxLength={6}
          value={code}
          onChange={handleCodeChange}
          disabled={loading}
          aria-describedby={error ? "pairing-code-error" : undefined}
          aria-invalid={!!error}
          className="device-pairing__input"
        />

        {error && (
          <p id="pairing-code-error" role="alert" className="device-pairing__error">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading || code.length !== 6}
          className="device-pairing__submit"
        >
          {loading ? "Pairing…" : "Pair Device"}
        </button>
      </form>

      {onSkip && (
        <button
          type="button"
          onClick={onSkip}
          className="device-pairing__skip"
        >
          Skip for now — use this device without saving
        </button>
      )}

      <p className="device-pairing__skip-note">
        No code handy? A parent can also sign in directly on this device
        instead of pairing.
      </p>
    </div>
  );
}