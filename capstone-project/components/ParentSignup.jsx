"use client";
import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import "./ParentSignup.css";

const STEP_CHOOSE_TYPE = "choose-type";
const STEP_PERSONAL_CHOOSE_TYPE = "personal-choose-type";
const STEP_SCHOOL_CHOOSE_TYPE = "school-choose-type";
const STEP_STUDENT_CODE = "student-code";
const STEP_AGE_CHECK = "age-check";
const STEP_CHILD_PATH = "child-path";
const STEP_FORM = "form";
const STEP_SUCCESS = "success";
const STEP_FAILURE = "failure";

export default function ParentSignup() {
  const [step, setStep] = useState(STEP_CHOOSE_TYPE);
  const [accountType, setAccountType] = useState(""); // "individual" | "family" | "school" | "child"
  const [childMethod, setChildMethod] = useState("code"); // "code" | "email"

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [coParentInviteCode, setCoParentInviteCode] = useState("");
  const [childInviteCode, setChildInviteCode] = useState("");
  const [parentEmail, setParentEmail] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  function chooseAccountType(type) {
    setAccountType(type);
    setStep(STEP_AGE_CHECK);
  }

  // School staff are assumed to be adults — skip the age check and go
  // straight to the signup form.
  function chooseSchoolStaff() {
    setAccountType("school");
    setStep(STEP_FORM);
  }

  function chooseChildAccount() {
    setAccountType("child");
    setStep(STEP_CHILD_PATH);
  }

  function answerAgeCheck(isThirteenOrOlder) {
    if (isThirteenOrOlder) {
      setStep(STEP_FORM);
    } else {
      setAccountType("child");
      setStep(STEP_CHILD_PATH);
    }
  }

  async function handleIndividualOrParentSignup(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { data, error: signUpError } = await supabase.auth.signUp({ email, password });

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

  async function handleChildSignupWithCode(e) {
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

    const res = await fetch("/api/account-invite/redeem", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: childInviteCode.trim() }),
    });

    if (!res.ok) {
      const result = await res.json().catch(() => ({}));
      setError(result.error || "That invite code didn't work.");
      setLoading(false);
      setStep(STEP_FAILURE);
      return;
    }

    setLoading(false);
    setStep(STEP_SUCCESS);
  }

  async function handleChildRequestParentSetup(e) {
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

    const res = await fetch("/api/child-access-request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ parentEmail: parentEmail.trim() }),
    });

    if (!res.ok) {
      const result = await res.json().catch(() => ({}));
      setError(result.error || "Couldn't send the request.");
      setLoading(false);
      setStep(STEP_FAILURE);
      return;
    }

    setLoading(false);
    setStep(STEP_SUCCESS);
  }

  // --- Top-level split: personal/family use, or school use ---
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

  // --- Personal/family branch: original three options, unchanged ---
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
          <button type="button" onClick={chooseChildAccount}>
            Child Account
          </button>
        </div>
        <button type="button" className="signup__back" onClick={() => setStep(STEP_CHOOSE_TYPE)}>
          ← Back
        </button>
      </div>
    );
  }

  // --- School branch: staff account, or student account via code only ---
  if (step === STEP_SCHOOL_CHOOSE_TYPE) {
    return (
      <div className="signup">
        <h2>School / Educational Use</h2>
        <p>What kind of account is this?</p>
        <div className="signup__type-options">
          <button type="button" onClick={chooseSchoolStaff}>
            School Employee / Administrator
          </button>
          <button type="button" onClick={() => setStep(STEP_STUDENT_CODE)}>
            Student Account
          </button>
        </div>
        <button type="button" className="signup__back" onClick={() => setStep(STEP_CHOOSE_TYPE)}>
          ← Back
        </button>
      </div>
    );
  }

  // --- Student accounts require a code from their school — no
  //     alternative self-service path, unlike the personal Child flow.
  if (step === STEP_STUDENT_CODE) {
    return (
      <div className="signup">
        <h2>Student Account</h2>
        <p>Enter the invite code your school gave you to set up your account.</p>
        <form onSubmit={handleChildSignupWithCode}>
          <label htmlFor="student-email">Email</label>
          <input id="student-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <label htmlFor="student-password">Password</label>
          <input id="student-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={8} required />
          <label htmlFor="student-invite-code">Invite Code</label>
          <input
            id="student-invite-code"
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={childInviteCode}
            onChange={(e) => setChildInviteCode(e.target.value)}
            required
          />
          {error && <p role="alert">{error}</p>}
          <button type="submit" disabled={loading}>
            {loading ? "Creating account…" : "Sign Up"}
          </button>
        </form>
        <button type="button" className="signup__back" onClick={() => setStep(STEP_SCHOOL_CHOOSE_TYPE)}>
          ← Back
        </button>
      </div>
    );
  }

  if (step === STEP_AGE_CHECK) {
    return (
      <div className="signup">
        <h2>One Quick Question</h2>
        <p>Are you 13 years of age or older?</p>
        <div className="signup__age-options">
          <button type="button" onClick={() => answerAgeCheck(true)}>
            Yes, I'm 13 or older
          </button>
          <button type="button" onClick={() => answerAgeCheck(false)}>
            No, I'm under 13
          </button>
        </div>
        <button type="button" className="signup__back" onClick={() => setStep(STEP_PERSONAL_CHOOSE_TYPE)}>
          ← Back
        </button>
      </div>
    );
  }

  if (step === STEP_CHILD_PATH) {
    return (
      <div className="signup">
        <h2>Child Account</h2>
        <p>
          A parent or caregiver needs to set this account up with you. Do you
          already have an invite code from them?
        </p>

        <div className="signup__type-options">
          <button
            type="button"
            className={childMethod === "code" ? "signup__selected" : ""}
            onClick={() => setChildMethod("code")}
          >
            I have an invite code
          </button>
          <button
            type="button"
            className={childMethod === "email" ? "signup__selected" : ""}
            onClick={() => setChildMethod("email")}
          >
            I don't have a code
          </button>
        </div>

        {childMethod === "code" ? (
          <form onSubmit={handleChildSignupWithCode}>
            <label htmlFor="child-email">Email</label>
            <input id="child-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <label htmlFor="child-password">Password</label>
            <input id="child-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={8} required />
            <label htmlFor="child-invite-code">Invite Code</label>
            <input
              id="child-invite-code"
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={childInviteCode}
              onChange={(e) => setChildInviteCode(e.target.value)}
              required
            />
            {error && <p role="alert">{error}</p>}
            <button type="submit" disabled={loading}>
              {loading ? "Creating account…" : "Sign Up"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleChildRequestParentSetup}>
            <label htmlFor="child-email-2">Email</label>
            <input id="child-email-2" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <label htmlFor="child-password-2">Password</label>
            <input id="child-password-2" type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={8} required />
            <label htmlFor="parent-email">Parent or Caregiver's Email</label>
            <input
              id="parent-email"
              type="email"
              value={parentEmail}
              onChange={(e) => setParentEmail(e.target.value)}
              required
            />
            <p className="signup__hint">
              We'll let them know you'd like to use this app, so they can set
              up a Parent/Caregiver account and give permission.
            </p>
            {error && <p role="alert">{error}</p>}
            <button type="submit" disabled={loading}>
              {loading ? "Sending…" : "Send Request"}
            </button>
          </form>
        )}

        <button type="button" className="signup__back" onClick={() => setStep(STEP_PERSONAL_CHOOSE_TYPE)}>
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

    return (
      <div className="signup">
        <h2>{heading}</h2>
        <form onSubmit={handleIndividualOrParentSignup}>
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
        <button
          type="button"
          className="signup__back"
          onClick={() =>
            setStep(accountType === "school" ? STEP_SCHOOL_CHOOSE_TYPE : STEP_AGE_CHECK)
          }
        >
          ← Back
        </button>
      </div>
    );
  }

  if (step === STEP_SUCCESS) {
    return (
      <div className="signup signup__result signup__result--success" role="status">
        {accountType === "child" && childMethod === "email" ? (
          <>
            <h2>Request Sent!</h2>
            <p>
              We let your parent or caregiver know. Once they set up their
              account, you'll be able to use the app together.
            </p>
          </>
        ) : (
          <>
            <h2>Account created successfully!</h2>
            <p>
              Please <Link href="/login">log in</Link>.
            </p>
          </>
        )}
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