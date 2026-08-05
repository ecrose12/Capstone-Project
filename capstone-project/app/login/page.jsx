"use client";
import { useRouter } from "next/navigation";
import ParentLogin from "@/components/ParentLogin";

export default function LoginPage() {
  const router = useRouter();

  return (
    <main className="auth-page">
      <ParentLogin onModeChange={() => router.push("/")} />
    </main>
  );
}
