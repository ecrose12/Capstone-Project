// context/ParentModeContext.jsx
"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const ParentModeContext = createContext({
  mode: "child",
  loading: true,
});

export function ParentModeProvider({ children }) {
  const [mode, setMode] = useState("child");
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    // Check current session on load
    supabase.auth.getUser().then(({ data: { user } }) => {
      setMode(user ? "parent" : "child");
      setLoading(false);
    });

    // Stay in sync automatically — covers login, logout, and session expiry
    // context/ParentModeContext.jsx — add inside the auth state listener
const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
  setMode(session?.user ? "parent" : "child");
  if (session?.user) {
    fetch("/api/device/auto-pair", { method: "POST" }).catch(() => {});
  }
});
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <ParentModeContext.Provider value={{ mode, loading }}>
      {children}
    </ParentModeContext.Provider>
  );
}

export function useParentMode() {
  return useContext(ParentModeContext);
}