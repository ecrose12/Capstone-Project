// components/ParentSignup.jsx
"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ParentSignup({ onSuccess }) {
  const [accountType, setAccountType] = useState("individual"); // individual | new-family | join-family
  const [inviteCode, setInviteCode] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  async function handleSignup(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: signUpError } = await supabase.auth.signUp({ email, password });
    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    if (accountType === "join-family") {
      const res = await fetch("/api/account-invite/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: inviteCode.trim() }),
      });
      if (!res.ok) {
        const result = await res.json().catch(() => ({}));
        setError(result.error || "Couldn't join with that code.");
        setLoading(false);
        return;
      }
    } else {
      // individual or new-family — create the family/account explicitly now
      const res = await fetch("/api/family/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: accountType === "individual" ? "individual" : "family" }),
      });
      if (!res.ok) {
        const result = await res.json().catch(() => ({}));
        setError(result.error || "Couldn't set up your account.");
        setLoading(false);
        return;
      }
    }

    setLoading(false);
    onSuccess();
  }

  return (
    <form onSubmit={handleSignup} className="parent-signup">
      <h2>Create Account</h2>

      <fieldset>
        <legend>What kind of account is this?</legend>
        <label>
          <input
            type="radio"
            name="accountType"
            value="individual"
            checked={accountType === "individual"}
            onChange={() => setAccountType("individual")}
          />
          Just for me
        </label>
        <label>
          <input
            type="radio"
            name="accountType"
            value="new-family"
            checked={accountType === "new-family"}
            onChange={() => setAccountType("new-family")}
          />
          Start a new family (Parent)
        </label>
        <label>
          <input
            type="radio"
            name="accountType"
            value="join-family"
            checked={accountType === "join-family"}
            onChange={() => setAccountType("join-family")}
          />
          Join an existing family with an invite code
        </label>
      </fieldset>

      {accountType === "join-family" && (
        <div>
          <label htmlFor="invite-code">Invite Code</label>
          <input
            id="invite-code"
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value)}
            required
          />
          <p className="parent-signup__hint">
            Your role (Parent or Child) is set by whoever gave you this code.
          </p>
        </div>
      )}

      <label htmlFor="signup-email">Email</label>
      <input id="signup-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <label htmlFor="signup-password">Password</label>
      <input id="signup-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={8} required />

      {error && <p role="alert">{error}</p>}
      <button type="submit" disabled={loading}>
        {loading ? "Creating account…" : "Sign Up"}
      </button>
    </form>
  );
}