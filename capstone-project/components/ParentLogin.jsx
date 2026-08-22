"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import PasswordField from "@/components/PasswordField";
import "./ParentLogin.css";

export default function ParentLogin({ onModeChange }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
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

  return (
    <form onSubmit={handleLogin} className="parent-gate">
      <h2>Log In</h2>
      <label htmlFor="login-email">Email</label>
      <input id="login-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <label htmlFor="login-password">Password</label>
      <PasswordField
        id="login-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="current-password"
        required
      />
      {error && <p role="alert">{error}</p>}
      <button type="submit">Log In</button>
    </form>
  );
}