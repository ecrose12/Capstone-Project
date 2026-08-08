"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useParentMode } from "@/context/ParentModeContext";
import ParentLogin from "@/components/ParentLogin";
import "../auth-page.css";

export default function LoginPage() {
  const router = useRouter();
  const { mode, loading } = useParentMode();

  // Redirect to home once a session is detected (mode flips to "parent"
  // for any signed-in account — individual, parent/caregiver, or otherwise).
  useEffect(() => {
    if (!loading && mode === "parent") {
      router.push("/");
    }
  }, [loading, mode, router]);

  return (
    <main className="auth-page">
      <ParentLogin />
    </main>
  );
}