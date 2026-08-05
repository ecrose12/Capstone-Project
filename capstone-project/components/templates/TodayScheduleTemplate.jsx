"use client";
import { useState, useEffect, useCallback } from "react";
import { useParentMode } from "@/context/ParentModeContext";
import PecSlot from "../PecSlot";
import SpeakButton from "../SpeakButton";
import "./TodayScheduleTemplate.css";

const DEFAULT_ROWS = ["Morning", "Afternoon", "Evening"];
const DEFAULT_ROWS_PER_SECTION = 3;

function makeBlankItem() {
  return {
    id: crypto.randomUUID(),
    card: null,
    text: "New Task",
    completed: false,
  };
}

function makeBlankSchedule(rows) {
  return Object.fromEntries(
    rows.map((r) => [r, Array.from({ length: DEFAULT_ROWS_PER_SECTION }, makeBlankItem)])
  );
}

export default function TodayScheduleTemplate({ category }) {
  const { mode, loading: modeLoading } = useParentMode();
  const rows = category.scheduleRows || DEFAULT_ROWS;

  const [scheduleData, setScheduleData] = useState(() => makeBlankSchedule(rows));
  const [hasSavedSchedule, setHasSavedSchedule] = useState(false);
  const [hasFamily, setHasFamily] = useState(false);
  const [status, setStatus] = useState("loading"); // loading | ready | saving | saved | error
  const [sectionsToPrint, setSectionsToPrint] = useState(() => new Set(rows));

  useEffect(() => {
    if (modeLoading) return;
    let cancelled = false;

    async function load() {
      setStatus("loading");
      try {
        const res = await fetch(`/api/schedule?category_id=${encodeURIComponent(category.id)}`);
        const result = await res.json();
        if (cancelled) return;

        if (!res.ok) {
          setStatus("error");
          return;
        }

        setHasFamily(!!result.hasFamily);

        if (result.data) {
          setHasSavedSchedule(true);
          setScheduleData(result.data);
        } else {
          setHasSavedSchedule(false);
          setScheduleData(makeBlankSchedule(rows));
        }

        setStatus("ready");
      } catch {
        if (!cancelled) setStatus("error");
      }
    }

    load();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modeLoading, category.id]);

  const isParent = mode === "parent";
  const isGuestBuilding = !isParent && !hasSavedSchedule; // no account/pairing, no saved schedule -> temporary, guest can build it themselves
  const isReadOnlyStructure = !isParent && hasSavedSchedule; // viewing a parent-built schedule — can't edit structure, CAN check things off
  const canEditStructure = isParent || isGuestBuilding;

  // Guest sessions clear when leaving the page — nothing was ever persisted.
  useEffect(() => {
    if (!isGuestBuilding) return;
    return () => {
      setScheduleData(makeBlankSchedule(rows));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGuestBuilding]);

  const updateItem = useCallback((rowLabel, itemId, patch) => {
    setScheduleData((prev) => ({
      ...prev,
      [rowLabel]: prev[rowLabel].map((item) =>
        item.id === itemId ? { ...item, ...patch } : item
      ),
    }));
  }, []);

  const addRow = useCallback((rowLabel) => {
    setScheduleData((prev) => ({
      ...prev,
      [rowLabel]: [...prev[rowLabel], makeBlankItem()],
    }));
  }, []);

  const removeRow = useCallback((rowLabel, itemId) => {
    setScheduleData((prev) => ({
      ...prev,
      [rowLabel]: prev[rowLabel].filter((item) => item.id !== itemId),
    }));
  }, []);

  // Reorder a task earlier/later within its own section — e.g. bumping a
  // missed task down so the next one can happen first.
  const moveRow = useCallback((rowLabel, index, direction) => {
    setScheduleData((prev) => {
      const list = prev[rowLabel];
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= list.length) return prev;

      const next = [...list];
      [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
      return { ...prev, [rowLabel]: next };
    });
  }, []);

  // Checkbox toggling is allowed for anyone (parent or child) — it's a
  // daily-use interaction, not a structural edit. Persists immediately
  // via the lightweight /api/schedule/complete route when a family
  // exists; guest sessions just update local state.
  async function toggleComplete(rowLabel, itemId, completed) {
    updateItem(rowLabel, itemId, { completed });

    if (!hasFamily) return;

    try {
      await fetch("/api/schedule/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category_id: category.id,
          row_label: rowLabel,
          item_id: itemId,
          completed,
        }),
      });
    } catch {
      // Non-fatal — the checkbox still reflects locally even if the sync failed.
    }
  }

  async function saveStructure() {
    setStatus("saving");
    try {
      const res = await fetch("/api/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category_id: category.id, data: scheduleData }),
      });

      if (!res.ok) {
        setStatus("error");
        return;
      }

      setHasSavedSchedule(true);
      setHasFamily(true);
      setStatus("saved");
    } catch {
      setStatus("error");
    }
  }

  function handlePrint() {
    window.print();
  }

  function togglePrintSection(rowLabel) {
    setSectionsToPrint((prev) => {
      const next = new Set(prev);
      if (next.has(rowLabel)) {
        next.delete(rowLabel);
      } else {
        next.add(rowLabel);
      }
      return next;
    });
  }

  if (modeLoading || status === "loading") return null;

  return (
    <div className="today-schedule">
      <h1 className="today-schedule__title">{category.name}</h1>

      {status === "error" && (
        <p role="alert" className="today-schedule__notice today-schedule__notice--error">
          Something went wrong loading this schedule. Please try again.
        </p>
      )}

      {isReadOnlyStructure && (
        <p className="today-schedule__notice" role="status">
          This schedule was set up by a parent. You can check off tasks as you go.
        </p>
      )}

      {isGuestBuilding && (
        <p className="today-schedule__notice" role="status">
          {hasFamily
            ? "This device isn't paired, so changes here won't be saved."
            : "You're not signed in — this schedule won't be saved and will clear when you leave this page."}{" "}
          You can download or print it below.
        </p>
      )}

      {rows.map((rowLabel) => (
        <section
          key={rowLabel}
          className={`today-schedule__section${
            sectionsToPrint.has(rowLabel) ? "" : " today-schedule__section--print-hidden"
          }`}
        >
          <h2 className="today-schedule__section-label">{rowLabel}</h2>

          <ul className="today-schedule__list">
            {scheduleData[rowLabel].map((item, index) => (
              <li key={item.id} className="today-schedule__row">
                {canEditStructure && (
                  <div className="today-schedule__row-reorder">
                    <button
                      type="button"
                      onClick={() => moveRow(rowLabel, index, -1)}
                      disabled={index === 0}
                      aria-label={`Move "${item.text}" earlier in ${rowLabel}`}
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => moveRow(rowLabel, index, 1)}
                      disabled={index === scheduleData[rowLabel].length - 1}
                      aria-label={`Move "${item.text}" later in ${rowLabel}`}
                    >
                      ↓
                    </button>
                  </div>
                )}

                <div className="today-schedule__row-icon">
                  <PecSlot
                    label={item.text || "Task"}
                    value={item.card}
                    size="small"
                    onChange={
                      canEditStructure
                        ? (card) => updateItem(rowLabel, item.id, { card })
                        : () => {}
                    }
                  />
                </div>

                {canEditStructure ? (
                  <>
                    <input
                      type="text"
                      className="today-schedule__row-text-input"
                      value={item.text}
                      onChange={(e) => updateItem(rowLabel, item.id, { text: e.target.value })}
                      aria-label={`Task name for this row in ${rowLabel}`}
                    />
                    {/* Inputs can't wrap to a second line, even for print —
                        this hidden-on-screen span takes over for printing
                        so a long task description isn't clipped on paper. */}
                    <span
                      className="today-schedule__row-text today-schedule__row-text--print-only"
                      aria-hidden="true"
                    >
                      {item.text}
                    </span>
                  </>
                ) : (
                  <span className="today-schedule__row-text">{item.text}</span>
                )}

                <SpeakButton text={item.text} />

                <label className="today-schedule__row-checkbox">
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={(e) => toggleComplete(rowLabel, item.id, e.target.checked)}
                    aria-label={`Mark "${item.text}" as ${item.completed ? "not done" : "done"}`}
                  />
                  <span className="today-schedule__checkbox-box" aria-hidden="true" />
                </label>

                {canEditStructure && (
                  <button
                    type="button"
                    className="today-schedule__row-remove"
                    onClick={() => removeRow(rowLabel, item.id)}
                    aria-label={`Remove this row from ${rowLabel}`}
                  >
                    ×
                  </button>
                )}
              </li>
            ))}
          </ul>

          {canEditStructure && (
            <button
              type="button"
              className="today-schedule__add-row"
              onClick={() => addRow(rowLabel)}
            >
              + Add Row
            </button>
          )}
        </section>
      ))}

      <fieldset className="today-schedule__print-picker">
        <legend>Sections to print</legend>
        {rows.map((rowLabel) => (
          <label key={rowLabel} className="today-schedule__print-picker-option">
            <input
              type="checkbox"
              checked={sectionsToPrint.has(rowLabel)}
              onChange={() => togglePrintSection(rowLabel)}
            />
            {rowLabel}
          </label>
        ))}
      </fieldset>

      <div className="today-schedule__actions">
        {isParent && (
          <button type="button" onClick={saveStructure} disabled={status === "saving"}>
            {status === "saving" ? "Saving…" : status === "saved" ? "Saved ✓" : "Save Schedule"}
          </button>
        )}
        <button type="button" onClick={handlePrint} className="today-schedule__print">
          {isGuestBuilding ? "Download / Print" : "Print"}
        </button>
      </div>
    </div>
  );
}