"use client";
import { useState, useEffect, useCallback } from "react";
import { useParentMode } from "@/context/ParentModeContext";
import PecSlot from "../PecSlot";
import SpeakButton from "../SpeakButton";
import "./WeeklyChoreListTemplate.css";

const DEFAULT_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

function makeBlankDayItem() {
  return {
    id: crypto.randomUUID(),
    card: null,
    text: "",
    completed: false,
  };
}

function makeBlankSchedule(days) {
  // Each day holds an array with exactly one item, so this reuses the
  // exact same /api/schedule and /api/schedule/complete routes as the
  // other schedule templates without any backend changes.
  return Object.fromEntries(days.map((d) => [d, [makeBlankDayItem()]]));
}

export default function WeeklyChoreListTemplate({ category }) {
  const { mode, loading: modeLoading } = useParentMode();
  const days = category.scheduleRows || DEFAULT_DAYS;

  const [scheduleData, setScheduleData] = useState(() => makeBlankSchedule(days));
  const [hasSavedSchedule, setHasSavedSchedule] = useState(false);
  const [hasFamily, setHasFamily] = useState(false);
  const [status, setStatus] = useState("loading"); // loading | ready | saving | saved | error

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
          setScheduleData(makeBlankSchedule(days));
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
  const isGuestBuilding = !isParent && !hasSavedSchedule;
  const isReadOnlyStructure = !isParent && hasSavedSchedule;
  const canEditStructure = isParent || isGuestBuilding;

  useEffect(() => {
    if (!isGuestBuilding) return;
    return () => {
      setScheduleData(makeBlankSchedule(days));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGuestBuilding]);

  const updateDay = useCallback((day, patch) => {
    setScheduleData((prev) => ({
      ...prev,
      [day]: [{ ...prev[day][0], ...patch }],
    }));
  }, []);

  // Checkbox toggling is allowed for anyone, parent or child — checking
  // off a chore is a daily interaction, not a structural edit.
  async function toggleComplete(day, completed) {
    const item = scheduleData[day][0];
    updateDay(day, { completed });

    if (!hasFamily) return;

    try {
      await fetch("/api/schedule/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category_id: category.id,
          row_label: day,
          item_id: item.id,
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

  if (modeLoading || status === "loading") return null;

  return (
    <div className="weekly-chore">
      <h1 className="weekly-chore__title">{category.name}</h1>

      {status === "error" && (
        <p role="alert" className="weekly-chore__notice weekly-chore__notice--error">
          Something went wrong loading this chore list. Please try again.
        </p>
      )}

      {isReadOnlyStructure && (
        <p className="weekly-chore__notice" role="status">
          This chore list was set up by a parent. You can check off chores as you go.
        </p>
      )}

      {isGuestBuilding && (
        <p className="weekly-chore__notice" role="status">
          {hasFamily
            ? "This device isn't paired, so changes here won't be saved."
            : "You're not signed in — this chore list won't be saved and will clear when you leave this page."}{" "}
          You can download or print it below.
        </p>
      )}

      <div className="weekly-chore__table" role="table">
        <div className="weekly-chore__row weekly-chore__row--header" role="row">
          <div className="weekly-chore__cell weekly-chore__cell--day" role="columnheader">
            Day
          </div>
          <div className="weekly-chore__cell weekly-chore__cell--todo" role="columnheader">
            To Do
          </div>
          <div className="weekly-chore__cell weekly-chore__cell--done" role="columnheader">
            Done
          </div>
        </div>

        {days.map((day) => {
          const item = scheduleData[day][0];
          return (
            <div key={day} className="weekly-chore__row" role="row">
              <div className="weekly-chore__cell weekly-chore__cell--day" role="cell">
                {day}
              </div>

              <div className="weekly-chore__cell weekly-chore__cell--todo" role="cell">
                <PecSlot
                  label={item.text || "Chore"}
                  value={item.card}
                  size="small"
                  onChange={canEditStructure ? (card) => updateDay(day, { card }) : () => {}}
                />

                {canEditStructure ? (
                  <input
                    type="text"
                    className="weekly-chore__text-input"
                    value={item.text}
                    onChange={(e) => updateDay(day, { text: e.target.value })}
                    placeholder="Describe the chore"
                    aria-label={`Chore description for ${day}`}
                  />
                ) : (
                  <span className="weekly-chore__text">{item.text}</span>
                )}

                {item.text && (
                  <>
                    <span className="weekly-chore__text--print-only" aria-hidden="true">
                      {item.text}
                    </span>
                    <SpeakButton text={item.text} />
                  </>
                )}
              </div>

              <div className="weekly-chore__cell weekly-chore__cell--done" role="cell">
                <label className="weekly-chore__checkbox">
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={(e) => toggleComplete(day, e.target.checked)}
                    aria-label={`Mark ${day}'s chore as ${item.completed ? "not done" : "done"}`}
                  />
                  <span className="weekly-chore__checkbox-box" aria-hidden="true" />
                </label>
              </div>
            </div>
          );
        })}
      </div>

      <div className="weekly-chore__actions">
        {isParent && (
          <button type="button" onClick={saveStructure} disabled={status === "saving"}>
            {status === "saving" ? "Saving…" : status === "saved" ? "Saved ✓" : "Save Chore List"}
          </button>
        )}
        <button type="button" onClick={handlePrint} className="weekly-chore__print">
          {isGuestBuilding ? "Download / Print" : "Print"}
        </button>
      </div>
    </div>
  );
}