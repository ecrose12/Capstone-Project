"use client";
import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import "./ParentSignup.css";

const STEP_CHOOSE_TYPE = "choose-type";
const STEP_PERSONAL_CHOOSE_TYPE = "personal-choose-type";
const STEP_SCHOOL_CHOOSE_TYPE = "school-choose-type";
const STEP_FORM = "form";
const STEP_SUCCESS = "success";
const STEP_FAILURE = "failure";

export default function ParentSignup() {
  const [step, setStep] = useState(STEP_CHOOSE_TYPE);
  const [accountType, setAccountType] = useState(""); // "individual" | "family" | "school"

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [coParentInviteCode, setCoParentInviteCode] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  function chooseAccountType(type) {
    setAccountType(type);
    setStep(STEP_FORM);
  }

  async function handleSignup(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: signUpError } = await supabase.auth.signUp({ email, password });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      setStep(STEP_FAILURE);
      return;
    }

    if ((accountType === "family" || accountType === "school") && coParentInviteCode.trim()) {
      const res = await fetch("/api/account-invite/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: coParentInviteCode.trim() }),
      });
      if (!res.ok) {
        const result = await res.json().catch(() => ({}));
        setError(result.error || "Couldn't join with that invite code.");
        setLoading(false);
        setStep(STEP_FAILURE);
        return;
      }
      setLoading(false);
      setStep(STEP_SUCCESS);
      return;
    }

    const res = await fetch("/api/family/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: accountType }),
    });

    if (!res.ok) {
      const result = await res.json().catch(() => ({}));
      setError(result.error || "Couldn't set up your account.");
      setLoading(false);
      setStep(STEP_FAILURE);
      return;
    }

    setLoading(false);
    setStep(STEP_SUCCESS);
  }

  if (step === STEP_CHOOSE_TYPE) {
    return (
      <div className="signup">
        <h2>Create Account</h2>
        <p>Who is this account for?</p>
        <div className="signup__type-options">
          <button type="button" onClick={() => setStep(STEP_PERSONAL_CHOOSE_TYPE)}>
            Personal / Family Use
          </button>
          <button type="button" onClick={() => setStep(STEP_SCHOOL_CHOOSE_TYPE)}>
            School / Educational Use
          </button>
        </div>
      </div>
    );
  }

  if (step === STEP_PERSONAL_CHOOSE_TYPE) {
    return (
      <div className="signup">
        <h2>Personal / Family Use</h2>
        <p>What kind of account is this?</p>
        <div className="signup__type-options">
          <button type="button" onClick={() => chooseAccountType("individual")}>
            Individual User
          </button>
          <button type="button" onClick={() => chooseAccountType("family")}>
            Parent/Caregiver User
          </button>
        </div>
        <button type="button" className="signup__back" onClick={() => setStep(STEP_CHOOSE_TYPE)}>
          ← Back
        </button>
      </div>
    );
  }

  if (step === STEP_SCHOOL_CHOOSE_TYPE) {
    return (
      <div className="signup">
        <h2>School / Educational Use</h2>
        <p>Create your School Employee/Administrator account below.</p>
        <div className="signup__type-options">
          <button type="button" onClick={() => chooseAccountType("school")}>
            School Employee / Administrator
          </button>
        </div>
        <button type="button" className="signup__back" onClick={() => setStep(STEP_CHOOSE_TYPE)}>
          ← Back
        </button>
      </div>
    );
  }

  if (step === STEP_FORM) {
    const heading =
      accountType === "individual"
        ? "Individual User"
        : accountType === "school"
        ? "School Employee / Administrator"
        : "Parent/Caregiver User";

    const backStep =
      accountType === "school" ? STEP_SCHOOL_CHOOSE_TYPE : STEP_PERSONAL_CHOOSE_TYPE;

    return (
      <div className="signup">
        <h2>{heading}</h2>
        <form onSubmit={handleSignup}>
          <label htmlFor="signup-email">Email</label>
          <input id="signup-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <label htmlFor="signup-password">Password</label>
          <input id="signup-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={8} required />

          {(accountType === "family" || accountType === "school") && (
            <>
              <label htmlFor="co-parent-code">
                Invite code (optional — only if joining an existing{" "}
                {accountType === "school" ? "school" : "family"} account)
              </label>
              <input
                id="co-parent-code"
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={coParentInviteCode}
                onChange={(e) => setCoParentInviteCode(e.target.value)}
              />
            </>
          )}

          {error && <p role="alert">{error}</p>}
          <button type="submit" disabled={loading}>
            {loading ? "Creating account…" : "Sign Up"}
          </button>
        </form>
        <button type="button" className="signup__back" onClick={() => setStep(backStep)}>
          ← Back
        </button>
      </div>
    );
  }

  if (step === STEP_SUCCESS) {
    return (
      <div className="signup signup__result signup__result--success" role="status">
        <h2>Account created successfully!</h2>
        <p>
          Please <Link href="/login">log in</Link>.
        </p>
      </div>
    );
  }

  if (step === STEP_FAILURE) {
    return (
      <div className="signup signup__result signup__result--failure" role="alert">
        <h2>Account creation failed.</h2>
        {error && <p className="signup__hint">{error}</p>}
        <p>
          Please try again, or contact My Words Matter user support{" "}
          <Link href="/support">here</Link>.
        </p>
        <button type="button" onClick={() => setStep(STEP_CHOOSE_TYPE)}>
          Try Again
        </button>
      </div>
    );
  }

  return null;
}