"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const ParentModeContext = createContext({
  mode: "child",
  loading: true,
  familyType: null, // "family" | "individual" | null
  hasFamily: false,
});

export function ParentModeProvider({ children }) {
  const [mode, setMode] = useState("child");
  const [loading, setLoading] = useState(true);
  const [familyType, setFamilyType] = useState(null);
  const [hasFamily, setHasFamily] = useState(false);
  const supabase = createClient();

  async function refreshFamilyStatus() {
    try {
      const res = await fetch("/api/device/status");
      const data = await res.json();
      setHasFamily(!!data.hasFamily);
      setFamilyType(data.familyType ?? null);
    } catch {
      setHasFamily(false);
      setFamilyType(null);
    }
  }

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      setMode(user ? "parent" : "child");
      await refreshFamilyStatus();
      setLoading(false);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setMode(session?.user ? "parent" : "child");
      if (session?.user) {
        fetch("/api/device/auto-pair", { method: "POST" }).catch(() => {});
      }
      await refreshFamilyStatus();
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ParentModeContext.Provider value={{ mode, loading, familyType, hasFamily }}>
      {children}
    </ParentModeContext.Provider>
  );
}

export function useParentMode() {
  return useContext(ParentModeContext);
}