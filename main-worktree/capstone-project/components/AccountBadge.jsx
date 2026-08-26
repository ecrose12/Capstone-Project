"use client";
import Link from "next/link";
import { useParentMode } from "@/context/ParentModeContext";
import "./AccountBadge.css";

export default function AccountBadge() {
  const { mode, loading, familyType, hasFamily } = useParentMode();

  if (loading) return null;

  const isParent = mode === "parent";

  if (isParent) {
    const badge =
      familyType === "family"
        ? { icon: "🏠", label: "Parent/Caregiver" }
        : familyType === "school"
        ? { icon: "🏫", label: "Teacher" }
        : { icon: "👤", label: "Individual" };

    return (
      <Link href="/settings" className="account-badge account-badge--active" aria-label={`Signed in as ${badge.label}. Go to Settings.`}>
        <span aria-hidden="true">{badge.icon}</span>
        <span className="account-badge__label">{badge.label}</span>
      </Link>
    );
  }

  if (hasFamily) {
    const badge =
      familyType === "school" ? { icon: "🔗", label: "Student" } : { icon: "🔗", label: "Child" };

    return (
      <Link href="/settings" className="account-badge account-badge--active" aria-label={`Paired device: ${badge.label}. Go to Settings.`}>
        <span aria-hidden="true">{badge.icon}</span>
        <span className="account-badge__label">{badge.label}</span>
      </Link>
    );
  }

  return (
    <div className="account-badge account-badge--guest">
      <Link href="/login" className="account-badge__guest-link">
        Log In
      </Link>
      <Link href="/signup" className="account-badge__guest-link account-badge__guest-link--primary">
        Sign Up
      </Link>
    </div>
  );
}