"use client";
import { useState, useEffect } from "react";
import "./support-inbox.css";

export default function SupportInboxPage() {
  const [requests, setRequests] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready | unauthorized | error
  const [replyDrafts, setReplyDrafts] = useState({});
  const [sendingId, setSendingId] = useState(null);
  const [sentIds, setSentIds] = useState(new Set());

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/support/requests");
        if (res.status === 403) {
          setStatus("unauthorized");
          return;
        }
        if (!res.ok) {
          setStatus("error");
          return;
        }
        const data = await res.json();
        setRequests(data.requests || []);
        setStatus("ready");
      } catch {
        setStatus("error");
      }
    }
    load();
  }, []);

  function updateDraft(id, value) {
    setReplyDrafts((prev) => ({ ...prev, [id]: value }));
  }

  async function sendReply(id) {
    const message = replyDrafts[id]?.trim();
    if (!message) return;

    setSendingId(id);
    try {
      const res = await fetch(`/api/support/requests/${id}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      if (!res.ok) {
        const result = await res.json().catch(() => ({}));
        alert(result.error || "Failed to send reply.");
        setSendingId(null);
        return;
      }

      setSentIds((prev) => new Set(prev).add(id));
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: "resolved" } : r))
      );
    } finally {
      setSendingId(null);
    }
  }

  if (status === "loading") return null;

  if (status === "unauthorized") {
    return (
      <main className="support-inbox">
        <h1>Support Inbox</h1>
        <p role="alert">You're not authorized to view this page.</p>
      </main>
    );
  }

  if (status === "error") {
    return (
      <main className="support-inbox">
        <h1>Support Inbox</h1>
        <p role="alert">Something went wrong loading requests. Please try again.</p>
      </main>
    );
  }

  return (
    <main className="support-inbox">
      <h1>Support Inbox</h1>

      {requests.length === 0 ? (
        <p>No support requests yet.</p>
      ) : (
        <ul className="support-inbox__list">
          {requests.map((req) => (
            <li key={req.id} className="support-inbox__item">
              <div className="support-inbox__meta">
                <strong>{req.name}</strong> ({req.email}) —{" "}
                {new Date(req.created_at).toLocaleString()}
                {req.status === "resolved" && (
                  <span className="support-inbox__resolved-badge">Replied</span>
                )}
              </div>
              <p className="support-inbox__message">{req.message}</p>

              {req.reply_message && (
                <div className="support-inbox__previous-reply">
                  <strong>Your reply:</strong> {req.reply_message}
                </div>
              )}

              {!sentIds.has(req.id) && req.status !== "resolved" && (
                <div className="support-inbox__reply-box">
                  <label htmlFor={`reply-${req.id}`}>Reply</label>
                  <textarea
                    id={`reply-${req.id}`}
                    rows={4}
                    value={replyDrafts[req.id] || ""}
                    onChange={(e) => updateDraft(req.id, e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => sendReply(req.id)}
                    disabled={sendingId === req.id || !replyDrafts[req.id]?.trim()}
                  >
                    {sendingId === req.id ? "Sending…" : "Send Reply"}
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}