"use client";
import { useState, useEffect } from "react";
import { useParentMode } from "@/context/ParentModeContext";
import { createClient } from "@/lib/supabase/client";
import GeneratePairingCode from "@/components/GeneratePairingCode";
import DevicePairing from "@/components/DevicePairing";

const TTS_LANGUAGES = [
  { code: "en-US", label: "English (US)" },
  { code: "en-GB", label: "English (UK)" },
  { code: "es-ES", label: "Spanish (Spain)" },
  { code: "es-MX", label: "Spanish (Mexico)" },
  { code: "fr-FR", label: "French" },
  { code: "de-DE", label: "German" },
];

const TTS_STORAGE_KEY = "pecs-tts-language";

export default function SettingsPage() {
  const { mode, loading: modeLoading } = useParentMode();
  const isParent = mode === "parent";
  const supabase = createClient();

  const [ttsLanguage, setTtsLanguage] = useState("en-US");
  const [status, setStatus] = useState({ hasFamily: false, isParent: false, loading: true });
  const [showPairingEntry, setShowPairingEntry] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(TTS_STORAGE_KEY);
    if (stored) setTtsLanguage(stored);
  }, []);

  useEffect(() => {
    if (modeLoading) return;
    let cancelled = false;

    fetch("/api/device/status")
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setStatus({ ...data, loading: false });
      })
      .catch(() => {
        if (!cancelled) setStatus((prev) => ({ ...prev, loading: false }));
      });

    return () => {
      cancelled = true;
    };
  }, [modeLoading]);

  function handleLanguageChange(e) {
    const value = e.target.value;
    setTtsLanguage(value);
    window.localStorage.setItem(TTS_STORAGE_KEY, value);
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
  }

  if (modeLoading || status.loading) return null;

  return (
    <main className="settings-page">
      <h1 className="settings-page__title">Settings</h1>

      <section className="settings-page__section">
        <h2>Text-to-Speech Language</h2>
        <label htmlFor="tts-language-select">Choose the voice language</label>
        <select id="tts-language-select" value={ttsLanguage} onChange={handleLanguageChange}>
          {TTS_LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.label}
            </option>
          ))}
        </select>
      </section>

      <section className="settings-page__section">
        <h2>Parent / Child Mode</h2>
        {isParent ? (
          <>
            <p role="status">Parent Mode is active on this device.</p>
            <button type="button" onClick={handleSignOut}>
              Exit Parent Mode
            </button>
          </>
        ) : (
          <p>
            Not in Parent Mode. <a href="/login">Log in</a> to make changes here.
          </p>
        )}
      </section>

      <section className="settings-page__section">
        <h2>Device Pairing</h2>
        {status.hasFamily ? (
          <p role="status">This device is linked to a family account.</p>
        ) : (
          <>
            <p role="status">This device isn't paired to a family yet.</p>
            {!showPairingEntry && (
              <button type="button" onClick={() => setShowPairingEntry(true)}>
                Enter a Pairing Code
              </button>
            )}
            {showPairingEntry && (
              <DevicePairing
                onPaired={() => window.location.reload()}
                onSkip={() => setShowPairingEntry(false)}
              />
            )}
          </>
        )}

        {isParent && (
          <div className="settings-page__generate-code">
            <GeneratePairingCode />
          </div>
        )}
      </section>
    </main>
  );
}
