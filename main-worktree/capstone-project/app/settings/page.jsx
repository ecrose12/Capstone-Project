"use client";
import { useState, useEffect } from "react";
import { useParentMode } from "@/context/ParentModeContext";
import { useTheme } from "@/context/ThemeContext";
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
const SEARCH_MODE_KEY = "pecs-search-mode";

export default function SettingsPage() {
  const { mode, loading: modeLoading, familyType, hasFamily } = useParentMode();
  const { theme, toggleTheme, loading: themeLoading } = useTheme();
  const isParent = mode === "parent";

  const supabase = createClient();

  const [ttsLanguage, setTtsLanguage] = useState("en-US");
  const [searchMode, setSearchMode] = useState("type");
  const [showPairingEntry, setShowPairingEntry] = useState(false);
  const [upgrading, setUpgrading] = useState(false);
  const [upgradeError, setUpgradeError] = useState("");

  useEffect(() => {
    const stored = window.localStorage.getItem(TTS_STORAGE_KEY);
    if (stored) setTtsLanguage(stored);

    const storedSearchMode = window.localStorage.getItem(SEARCH_MODE_KEY);
    if (storedSearchMode === "type" || storedSearchMode === "category") {
      setSearchMode(storedSearchMode);
    }
  }, []);

  function handleLanguageChange(e) {
    const value = e.target.value;
    setTtsLanguage(value);
    window.localStorage.setItem(TTS_STORAGE_KEY, value);
  }

  function handleSearchModeChange(value) {
    setSearchMode(value);
    window.localStorage.setItem(SEARCH_MODE_KEY, value);
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
  const isSchoolAccount = familyType === "school";

  const modeStatusText = isSchoolAccount
    ? "Teacher Mode is active on this device."
    : isFamilyAccount
    ? "Parent/Caregiver Mode is active on this device."
    : "You're signed in.";

  const signOutLabel = isSchoolAccount
    ? "Exit Teacher Mode"
    : isFamilyAccount
    ? "Exit Parent/Caregiver Mode"
    : "Sign Out";

  return (
    <main className="settings-page">
      <h1 className="settings-page__title">Settings</h1>

      <section className="settings-page__section">
        <h2>Appearance</h2>
        <p>Choose how the app looks.</p>
        <button
          type="button"
          onClick={toggleTheme}
          disabled={themeLoading}
          aria-pressed={theme === "dark"}
        >
          {theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
        </button>
      </section>

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
        <h2>PEC Card Search Style</h2>
        <p>Choose how you'd like to find picture cards when selecting one.</p>
        <div className="settings-page__radio-group">
          <label className="settings-page__radio-option">
            <input
              type="radio"
              name="pecs-search-mode"
              value="type"
              checked={searchMode === "type"}
              onChange={() => handleSearchModeChange("type")}
            />
            Type to Search
          </label>
          <label className="settings-page__radio-option">
            <input
              type="radio"
              name="pecs-search-mode"
              value="category"
              checked={searchMode === "category"}
              onChange={() => handleSearchModeChange("category")}
            />
            Browse by Category
          </label>
        </div>
      </section>

      <section className="settings-page__section">
        <h2>Account</h2>
        {isParent ? (
          <>
            <p role="status">{modeStatusText}</p>
            <button type="button" onClick={handleSignOut}>
              {signOutLabel}
            </button>

            {!isFamilyAccount && !isSchoolAccount && (
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

      {(isFamilyAccount || isSchoolAccount || !hasFamily) && (
        <section className="settings-page__section">
          <h2>Device Pairing</h2>
          {hasFamily ? (
            <p role="status">
              {isSchoolAccount
                ? "This device is linked to your school's account."
                : "This device is linked to a family account."}
            </p>
          ) : (
            <>
              <p role="status">
                {isSchoolAccount
                  ? "This device isn't paired to your school's account yet."
                  : "This device isn't paired to a family yet."}
              </p>
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