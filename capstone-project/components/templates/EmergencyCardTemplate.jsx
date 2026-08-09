"use client";
import { useState, useEffect, useCallback } from "react";
import { useParentMode } from "@/context/ParentModeContext";
import PecSlot from "../PecSlot";
import SpeakButton from "../SpeakButton";
import "./EmergencyCardTemplate.css";

function makeBlankPresetCard() {
  return { id: crypto.randomUUID(), text: "New phrase", card: null };
}

const BASIC_INFO_FIELDS = [
  { key: "name", label: "Full Name" },
  { key: "age", label: "Age / Date of Birth" },
  { key: "condition", label: "Diagnosis / Condition" },
];

const MEDICAL_ID_FIELDS = [
  { key: "allergies", label: "Allergies" },
  { key: "medications", label: "Medications" },
  { key: "conditions", label: "Medical Conditions" },
  { key: "bloodType", label: "Blood Type" },
];

const EMERGENCY_CONTACT_FIELDS = [
  { key: "name", label: "Contact Name" },
  { key: "relationship", label: "Relationship" },
  { key: "phone", label: "Phone Number" },
];

export default function EmergencyCardTemplate({ category }) {
  const { mode, loading: modeLoading } = useParentMode();
  const isParent = mode === "parent";

  const [presetCards, setPresetCards] = useState([]);
  const [basicInfo, setBasicInfo] = useState({});
  const [medicalId, setMedicalId] = useState({});
  const [emergencyContact, setEmergencyContact] = useState({});
  const [showBasicInfo, setShowBasicInfo] = useState(false);
  const [showMedicalId, setShowMedicalId] = useState(false);
  const [showEmergencyContact, setShowEmergencyContact] = useState(false);
  const [hasFamily, setHasFamily] = useState(false);
  const [status, setStatus] = useState("loading"); // loading | ready | saving | saved | error
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (modeLoading) return;
    let cancelled = false;

    async function load() {
      setStatus("loading");
      try {
        const res = await fetch("/api/emergency");
        const result = await res.json();
        if (cancelled) return;

        if (!res.ok) {
          setStatus("error");
          return;
        }

        setHasFamily(!!result.hasFamily);
        setPresetCards(result.presetCards || []);
        setBasicInfo(result.basicInfo || {});
        setMedicalId(result.medicalId || {});
        setEmergencyContact(result.emergencyContact || {});
        setShowBasicInfo(!!result.showBasicInfo);
        setShowMedicalId(!!result.showMedicalId);
        setShowEmergencyContact(!!result.showEmergencyContact);
        setStatus("ready");
      } catch {
        if (!cancelled) setStatus("error");
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [modeLoading]);

  const updatePresetCard = useCallback((id, patch) => {
    setPresetCards((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  }, []);

  function addPresetCard() {
    setPresetCards((prev) => [...prev, makeBlankPresetCard()]);
  }

  function removePresetCard(id) {
    setPresetCards((prev) => prev.filter((c) => c.id !== id));
  }

  async function saveAll() {
    setStatus("saving");
    try {
      const res = await fetch("/api/emergency", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          presetCards,
          basicInfo,
          medicalId,
          emergencyContact,
          showBasicInfo,
          showMedicalId,
          showEmergencyContact,
        }),
      });

      if (!res.ok) {
        setStatus("error");
        return;
      }

      setHasFamily(true);
      setStatus("saved");
      setEditing(false);
    } catch {
      setStatus("error");
    }
  }

  function handlePrint() {
    window.print();
  }

  if (modeLoading || status === "loading") return null;

  const hasBasicInfoContent = Object.values(basicInfo).some((v) => v && v.trim?.());
  const hasMedicalIdContent = Object.values(medicalId).some((v) => v && v.trim?.());
  const hasContactContent = Object.values(emergencyContact).some((v) => v && v.trim?.());

  return (
    <div className="emergency-card">
      <h1 className="emergency-card__title">{category.name}</h1>

      {status === "error" && (
        <p role="alert" className="emergency-card__notice emergency-card__notice--error">
          Something went wrong loading this page. Please try again.
        </p>
      )}

      {isParent && !hasFamily && (
        <p className="emergency-card__notice" role="status">
          Sign in and save to keep this information available across devices.
        </p>
      )}

      {/* Preset communication cards — always visible to everyone */}
      <section className="emergency-card__section">
        <h2 className="emergency-card__section-title">Quick Phrases</h2>
        <div className="emergency-card__preset-grid">
          {presetCards.map((item) => (
            <div key={item.id} className="emergency-card__preset-card">
              <PecSlot
                label={item.text}
                value={item.card}
                size="small"
                onChange={editing ? (card) => updatePresetCard(item.id, { card }) : () => {}}
              />
              {editing ? (
                <input
                  type="text"
                  className="emergency-card__preset-input"
                  value={item.text}
                  onChange={(e) => updatePresetCard(item.id, { text: e.target.value })}
                  aria-label="Phrase text"
                />
              ) : (
                <span className="emergency-card__preset-text">{item.text}</span>
              )}
              <SpeakButton text={item.text} />
              {editing && (
                <button
                  type="button"
                  className="emergency-card__preset-remove"
                  onClick={() => removePresetCard(item.id)}
                  aria-label={`Remove phrase "${item.text}"`}
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
        {editing && (
          <button type="button" className="emergency-card__add-phrase" onClick={addPresetCard}>
            + Add Phrase
          </button>
        )}
      </section>

      {/* Basic Info — visible if shown, or always visible to a parent editing */}
      {(editing || (showBasicInfo && hasBasicInfoContent)) && (
        <section className="emergency-card__section">
          <h2 className="emergency-card__section-title">Basic Information</h2>
          {editing && (
            <label className="emergency-card__toggle">
              <input
                type="checkbox"
                checked={showBasicInfo}
                onChange={(e) => setShowBasicInfo(e.target.checked)}
              />
              Show this section
            </label>
          )}
          <dl className="emergency-card__field-list">
            {BASIC_INFO_FIELDS.map((field) => (
              <div key={field.key} className="emergency-card__field">
                <dt>{field.label}</dt>
                {editing ? (
                  <input
                    type="text"
                    value={basicInfo[field.key] || ""}
                    onChange={(e) =>
                      setBasicInfo((prev) => ({ ...prev, [field.key]: e.target.value }))
                    }
                    aria-label={field.label}
                  />
                ) : (
                  <dd>{basicInfo[field.key] || "—"}</dd>
                )}
              </div>
            ))}
          </dl>
        </section>
      )}

      {/* Medical ID */}
      {(editing || (showMedicalId && hasMedicalIdContent)) && (
        <section className="emergency-card__section">
          <h2 className="emergency-card__section-title">Medical ID</h2>
          {editing && (
            <label className="emergency-card__toggle">
              <input
                type="checkbox"
                checked={showMedicalId}
                onChange={(e) => setShowMedicalId(e.target.checked)}
              />
              Show this section
            </label>
          )}
          <dl className="emergency-card__field-list">
            {MEDICAL_ID_FIELDS.map((field) => (
              <div key={field.key} className="emergency-card__field">
                <dt>{field.label}</dt>
                {editing ? (
                  <input
                    type="text"
                    value={medicalId[field.key] || ""}
                    onChange={(e) =>
                      setMedicalId((prev) => ({ ...prev, [field.key]: e.target.value }))
                    }
                    aria-label={field.label}
                  />
                ) : (
                  <dd>{medicalId[field.key] || "—"}</dd>
                )}
              </div>
            ))}
          </dl>
        </section>
      )}

      {/* Emergency Contact */}
      {(editing || (showEmergencyContact && hasContactContent)) && (
        <section className="emergency-card__section">
          <h2 className="emergency-card__section-title">Emergency Contact</h2>
          {editing && (
            <label className="emergency-card__toggle">
              <input
                type="checkbox"
                checked={showEmergencyContact}
                onChange={(e) => setShowEmergencyContact(e.target.checked)}
              />
              Show this section
            </label>
          )}
          <dl className="emergency-card__field-list">
            {EMERGENCY_CONTACT_FIELDS.map((field) => (
              <div key={field.key} className="emergency-card__field">
                <dt>{field.label}</dt>
                {editing ? (
                  <input
                    type="text"
                    value={emergencyContact[field.key] || ""}
                    onChange={(e) =>
                      setEmergencyContact((prev) => ({ ...prev, [field.key]: e.target.value }))
                    }
                    aria-label={field.label}
                  />
                ) : (
                  <dd>{emergencyContact[field.key] || "—"}</dd>
                )}
              </div>
            ))}
          </dl>
        </section>
      )}

      <div className="emergency-card__actions">
        {isParent && !editing && (
          <button type="button" onClick={() => setEditing(true)}>
            Edit
          </button>
        )}
        {isParent && editing && (
          <button type="button" onClick={saveAll} disabled={status === "saving"}>
            {status === "saving" ? "Saving…" : status === "saved" ? "Saved ✓" : "Save"}
          </button>
        )}
        <button type="button" onClick={handlePrint} className="emergency-card__print">
          Print / Download
        </button>
      </div>
    </div>
  );
}