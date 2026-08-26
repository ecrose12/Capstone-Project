"use client";
import { useState, useEffect } from "react";
import "./SaveTargetPicker.css";

export default function SaveTargetPicker({ value, onChange }) {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/family/devices");
        const result = await res.json();
        if (!cancelled && res.ok) {
          setDevices(result.devices || []);
        }
      } catch {
        // Non-fatal — just fall back to only the "everyone" option
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading || devices.length === 0) return null;

  return (
    <fieldset className="save-target-picker">
      <legend>Save this for:</legend>
      <label className="save-target-picker__option">
        <input
          type="radio"
          name="save-target"
          checked={value === null}
          onChange={() => onChange(null)}
        />
        Everyone (shared)
      </label>
      {devices.map((device) => (
        <label key={device.id} className="save-target-picker__option">
          <input
            type="radio"
            name="save-target"
            checked={value === device.id}
            onChange={() => onChange(device.id)}
          />
          {device.device_name || "Unnamed device"}
        </label>
      ))}
    </fieldset>
  );
}