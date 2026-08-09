"use client";
import { useState } from "react";
import "./support-page.css";

export default function SupportPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    setError("");

    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      if (!res.ok) {
        const result = await res.json().catch(() => ({}));
        setError(result.error || "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      setStatus("sent");
    } catch {
      setError("Couldn't reach the server. Please try again.");
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <main className="support-page">
        <h1>Contact My Words Matter Support</h1>
        <p role="status">
          Thanks — your message has been received. We'll get back to you as
          soon as we can.
        </p>
      </main>
    );
  }

  return (
    <main className="support-page">
      <h1>Contact My Words Matter Support</h1>
      <p>Having trouble, or have a question? Send us a message below.</p>

      <form onSubmit={handleSubmit} className="support-page__form">
        <label htmlFor="support-name">Name</label>
        <input id="support-name" type="text" value={name} onChange={(e) => setName(e.target.value)} required />

        <label htmlFor="support-email">Email</label>
        <input id="support-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

        <label htmlFor="support-message">How can we help?</label>
        <textarea
          id="support-message"
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />

        {error && <p role="alert">{error}</p>}

        <button type="submit" disabled={status === "sending"}>
          {status === "sending" ? "Sending…" : "Send Message"}
        </button>
      </form>
    </main>
  );
}
