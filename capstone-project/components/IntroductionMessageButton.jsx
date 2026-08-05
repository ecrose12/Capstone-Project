"use client";
import { useState, useEffect, useRef } from "react";
import { useParentMode } from "@/context/ParentModeContext";

const STORAGE_KEY = "pecs-intro-message";
const DEFAULT_MESSAGE =
  "Hi, I use this app to help me communicate. Thank you for your patience.";

export default function IntroductionMessageButton() {
  const { mode, loading: modeLoading } = useParentMode();
  const isParent = mode === "parent";

  const [message, setMessage] = useState(DEFAULT_MESSAGE);
  const [locked, setLocked] = useState(false);
  const [hasFamily, setHasFamily] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const [draftLocked, setDraftLocked] = useState(false);
  const [saveStatus, setSaveStatus] = useState("idle"); // idle | saving | error
  const [saveError, setSaveError] = useState("");
  const dialogRef = useRef(null);

  useEffect(() => {
    if (modeLoading) return;
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/intro-message");
        const result = await res.json();
        if (cancelled) return;

        setHasFamily(!!result.hasFamily);
        setLocked(!!result.locked);

        if (result.hasFamily && result.message) {
          setMessage(result.message);
        } else {
          const stored = window.localStorage.getItem(STORAGE_KEY);
          if (stored) setMessage(stored);
        }
      } catch {
        if (!cancelled) {
          const stored = window.localStorage.getItem(STORAGE_KEY);
          if (stored) setMessage(stored);
        }
      } finally {
        if (!cancelled) setLoaded(true);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [modeLoading]);

  // A non-parent can't edit at all while locked.
  const canEdit = isParent || !locked;

  useEffect(() => {
    if (editing) {
      setDraft(message);
      setDraftLocked(locked);
      setSaveError("");
      dialogRef.current?.focus();
    }
  }, [editing, message, locked]);

  useEffect(() => {
    if (!editing) return;
    function onKeyDown(e) {
      if (e.key === "Escape") setEditing(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [editing]);

  function speak() {
    if (!("speechSynthesis" in window)) return;
    const utterance = new SpeechSynthesisUtterance(message);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }

  async function saveDraft() {
    const trimmed = draft.trim();
    const next = trimmed.length > 0 ? trimmed : DEFAULT_MESSAGE;

    window.localStorage.setItem(STORAGE_KEY, next);

    if (!hasFamily) {
      setMessage(next);
      setEditing(false);
      return;
    }

    setSaveStatus("saving");
    setSaveError("");

    const payload = { message: next };
    if (isParent) {
      payload.locked = draftLocked;
    }

    try {
      const res = await fetch("/api/intro-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json().catch(() => ({}));

      if (!res.ok) {
        setSaveStatus("error");
        setSaveError(result.error || "Couldn't save. Try again.");
        return;
      }

      setMessage(next);
      if (isParent) setLocked(draftLocked);
      setSaveStatus("idle");
      setEditing(false);
    } catch {
      setSaveStatus("error");
      setSaveError("Couldn't reach the server. Try again.");
    }
  }

  if (!loaded) return null;

  return (
    <div className="intro-message">
      <button
        type="button"
        className="intro-message__speak-button"
        onClick={speak}
        aria-label="Introduce myself"
      >
        🔊 Introduce Myself
      </button>

      <button
        type="button"
        className="intro-message__edit-button"
        onClick={() => setEditing(true)}
        disabled={!canEdit}
        aria-label={
          canEdit
            ? "Edit introduction message"
            : "Editing is locked by a parent"
        }
        title={canEdit ? undefined : "Locked by a parent"}
      >
        {canEdit ? "✎" : "🔒"}
      </button>

      {editing && (
        <div
          className="intro-message__overlay"
          role="presentation"
          onClick={() => setEditing(false)}
        >
          <div
            className="intro-message__dialog"
            role="dialog"
            aria-modal="true"
            aria-label="Edit introduction message"
            ref={dialogRef}
            tabIndex={-1}
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Edit Your Introduction</h2>
            <label htmlFor="intro-message-input">
              What should be spoken when you tap "Introduce Myself"?
            </label>
            <textarea
              id="intro-message-input"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={4}
              maxLength={300}
            />

            {isParent && hasFamily && (
              <label className="intro-message__lock-toggle">
                <input
                  type="checkbox"
                  checked={draftLocked}
                  onChange={(e) => setDraftLocked(e.target.checked)}
                />
                Lock this message so it can't be changed without me
              </label>
            )}

            {!hasFamily && (
              <p className="intro-message__notice" role="status">
                This device isn't linked to an account, so this will only be
                saved here.
              </p>
            )}

            {saveStatus === "error" && (
              <p role="alert" className="intro-message__error">
                {saveError}
              </p>
            )}

            <div className="intro-message__dialog-actions">
              <button type="button" onClick={() => setEditing(false)}>
                Cancel
              </button>
              <button
                type="button"
                onClick={saveDraft}
                disabled={saveStatus === "saving"}
              >
                {saveStatus === "saving" ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}