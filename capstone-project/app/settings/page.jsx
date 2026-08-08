"use client";
import { useState, useEffect } from "react";
import { useParentMode } from "@/context/ParentModeContext";
import { createClient } from "@/lib/supabase/client";
import GeneratePairingCode from "@/components/GeneratePairingCode";
import DevicePairing from "@/components/DevicePairing";
import "./settings-page.css";

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
  const { mode, loading: modeLoading, familyType, hasFamily } = useParentMode();
  const isParent = mode === "parent";

  const supabase = createClient();

  const [ttsLanguage, setTtsLanguage] = useState("en-US");
  const [showPairingEntry, setShowPairingEntry] = useState(false);
  const [upgrading, setUpgrading] = useState(false);
  const [upgradeError, setUpgradeError] = useState("");

  useEffect(() => {
    const stored = window.localStorage.getItem(TTS_STORAGE_KEY);
    if (stored) setTtsLanguage(stored);
  }, []);

  function handleLanguageChange(e) {
    const value = e.target.value;
    setTtsLanguage(value);
    window.localStorage.setItem(TTS_STORAGE_KEY, value);
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
  }

  async function handleSwitchToFamily() {
    setUpgrading(true);
    setUpgradeError("");
    try {
      const res = await fetch("/api/family/switch-to-family", { method: "POST" });
      const result = await res.json().catch(() => ({}));
      if (!res.ok) {
        setUpgradeError(result.error || "Couldn't switch to Family Mode.");
        setUpgrading(false);
        return;
      }
      window.location.reload();
    } catch {
      setUpgradeError("Couldn't reach the server. Try again.");
      setUpgrading(false);
    }
  }

  if (modeLoading) return null;

  const isFamilyAccount = familyType === "family";

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
        <h2>Account</h2>
        {isParent ? (
          <>
            <p role="status">
              {isFamilyAccount ? "Parent/Caregiver Mode is active on this device." : "You're signed in."}
            </p>
            <button type="button" onClick={handleSignOut}>
              {isFamilyAccount ? "Exit Parent/Caregiver Mode" : "Sign Out"}
            </button>

            {!isFamilyAccount && (
              <div className="settings-page__upgrade">
                <p>
                  Want to add a child or set up shared devices? You can switch
                  this account to Parent/Caregiver Mode at any time — nothing
                  you've already set up will be lost.
                </p>
                <button type="button" onClick={handleSwitchToFamily} disabled={upgrading}>
                  {upgrading ? "Switching…" : "Switch to Parent/Caregiver Mode"}
                </button>
                {upgradeError && <p role="alert">{upgradeError}</p>}
              </div>
            )}
          </>
        ) : (
          <p>
            Not signed in. <a href="/login">Log in</a> to make changes here.
          </p>
        )}
      </section>

      {isFamilyAccount && (
        <section className="settings-page__section">
          <h2>Device Pairing</h2>
          {hasFamily ? (
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
      )}
    </main>
  );
}