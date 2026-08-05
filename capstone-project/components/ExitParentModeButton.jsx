// components/ExitParentModeButton.jsx
"use client";
import { createClient } from "@/lib/supabase/client";

export default function ExitParentModeButton() {
  async function exitParentMode() {
    const supabase = createClient();
    await supabase.auth.signOut();
    // No need to manually set state — onAuthStateChange in the context handles it
  }

  return (
    <button onClick={exitParentMode} className="exit-parent-mode-button">
      Exit Parent Mode
    </button>
  );
}