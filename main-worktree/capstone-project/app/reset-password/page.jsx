"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import "./reset-password-page.css";

export default function ResetPasswordPage() {
  const router = useRouter();
  const supabase = createClient();

  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("idle"); // idle | saving | success

  useEffect(() => {
    async function establishRecoverySession() {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      if (code) {
        await supabase.auth.exchangeCodeForSession(code);
      }
      setReady(true);
    }
    establishRecoverySession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    setStatus("saving");
    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      setError(updateError.message || "Couldn't update your password. Try again.");
      setStatus("idle");
      return;
    }

    setStatus("success");
    setTimeout(() => router.push("/login"), 2000);
  }

  if (!ready) return null;

  if (status === "success") {
    return (
      <main className="reset-password-page">
        <div className="reset-password-page__card" role="status">
          <h1>Password Updated!</h1>
          <p>Taking you to the login page…</p>
        </div>
      </main>
    );
  }

  return (
    <main className="reset-password-page">
      <form onSubmit={handleSubmit} className="reset-password-page__card">
        <h1>Set a New Password</h1>
        <label htmlFor="new-password">New Password</label>
        <input
          id="new-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={8}
          required
        />
        <label htmlFor="confirm-password">Confirm New Password</label>
        <input
          id="confirm-password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          minLength={8}
          required
        />
        {error && <p role="alert">{error}</p>}
        <button type="submit" disabled={status === "saving"}>
          {status === "saving" ? "Saving…" : "Update Password"}
        </button>
      </form>
    </main>
  );
}