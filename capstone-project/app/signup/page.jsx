"use client";
import { useRouter } from "next/navigation";
import ParentSignup from "@/components/ParentSignup";

export default function SignupPage() {
  const router = useRouter();

  return (
    <main className="auth-page">
      <ParentSignup onSuccess={() => router.push("/")} />
    </main>
  );
}
