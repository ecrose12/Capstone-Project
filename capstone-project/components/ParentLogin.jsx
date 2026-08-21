"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import "./ParentLogin.css";

export default function ParentLogin({ onModeChange }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [resetStatus, setResetStatus] = useState(""); // "" | "sending" | "sent" | "error"
  const supabase = createClient();

  async function handleLogin(e) {
    e.preventDefault();
    setError("");

    const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });
    if (loginError) {
      setError("Incorrect email or password.");
      return;
    }
    onModeChange?.("parent");
  }

  async function handleForgotPassword() {
    if (!email.trim()) {
      setError("Enter your email above first, then tap \"Forgot password?\"");
      return;
    }
    setError("");
    setResetStatus("sending");
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (resetError) {
        setResetStatus("error");
        return;
      }
      setResetStatus("sent");
    } catch {
      setResetStatus("error");
    }
  }

  return (
    <form onSubmit={handleLogin} className="parent-gate">
      <h2>Log In</h2>
      <label htmlFor="login-email">Email</label>
      <input id="login-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <label htmlFor="login-password">Password</label>
      <input id="login-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      {error && <p role="alert">{error}</p>}
      <button type="submit">Log In</button>

      <button
        type="button"
        className="parent-gate__forgot-password"
        onClick={handleForgotPassword}
        disabled={resetStatus === "sending"}
      >
        {resetStatus === "sending" ? "Sending…" : "Forgot password?"}
      </button>

      {resetStatus === "sent" && (
        <p role="status" className="parent-gate__reset-status">
          Check your email for a link to reset your password.
        </p>
      )}
      {resetStatus === "error" && (
        <p role="alert">Couldn't send the reset email. Please try again.</p>
      )}
    </form>
  );
}