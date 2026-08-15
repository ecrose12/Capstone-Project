"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import "./GeneratePairingCode.css";

const CODE_LIFETIME_SECONDS = 10 * 60;

export default function GeneratePairingCode() {
  const [code, setCode] = useState(null);
  const [expiresAt, setExpiresAt] = useState(null);
  const [secondsLeft, setSecondsLeft] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const intervalRef = useRef(null);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => clearTimer, [clearTimer]);

  async function generate() {
    setError("");
    setLoading(true);
    clearTimer();

    try {
      const res = await fetch("/api/pairing/generate", { method: "POST" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Couldn't generate a code. Try again.");
        setLoading(false);
        return;
      }

      const data = await res.json();
      setCode(data.code);
      setExpiresAt(data.expiresAt);
      setSecondsLeft(CODE_LIFETIME_SECONDS);
      setLoading(false);

      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearTimer();
            setCode(null);
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    } catch {
      setError("Couldn't reach the server. Check your connection and try again.");
      setLoading(false);
    }
  }

  const minutes = secondsLeft != null ? Math.floor(secondsLeft / 60) : null;
  const seconds = secondsLeft != null ? secondsLeft % 60 : null;

  return (
    <div className="generate-pairing-code">
      <h2 className="generate-pairing-code__title">Pair a New Device</h2>
      <p className="generate-pairing-code__instructions">
        Generate a code and enter it on the device you want to pair. Codes
        expire after 10 minutes.
      </p>

      {!code && (
        <button
          type="button"
          onClick={generate}
          disabled={loading}
          className="generate-pairing-code__button"
        >
          {loading ? "Generating…" : "Generate Code"}
        </button>
      )}

      {code && (
        <div className="generate-pairing-code__result" aria-live="polite">
          <p className="generate-pairing-code__code" aria-label={`Pairing code: ${code.split("").join(" ")}`}>
            {code}
          </p>
          <p className="generate-pairing-code__expiry">
            Expires in {minutes}:{String(seconds).padStart(2, "0")}
          </p>
          <button
            type="button"
            onClick={generate}
            disabled={loading}
            className="generate-pairing-code__regenerate"
          >
            Generate a new code
          </button>
        </div>
      )}

      {error && (
        <p role="alert" className="generate-pairing-code__error">
          {error}
        </p>
      )}
    </div>
  );
}