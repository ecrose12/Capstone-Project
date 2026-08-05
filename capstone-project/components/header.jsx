// components/Header.jsx
"use client";
import { useParentMode } from "@/context/ParentModeContext";
import ExitParentModeButton from "./ExitParentModeButton";

export default function Header() {
  const { mode, loading } = useParentMode();

  if (loading) return null; // avoid a flash of the wrong mode while checking session

  return (
    <header>
      <h1>PECS Cards</h1>
      {mode === "parent" && <ExitParentModeButton />}
    </header>
  );
}