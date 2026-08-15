// app/api/account-invite/generate/route.js
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { generatePairingCode } from "@/lib/deviceToken";

function serviceClient() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

export async function POST(request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const { role } = await request.json();
  if (!["parent", "child"].includes(role)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  const svc = serviceClient();
  const { data: membership } = await svc
    .from("family_members")
    .select("family_id, role")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!membership || membership.role !== "parent") {
    return NextResponse.json({ error: "Only a parent can invite new accounts" }, { status: 403 });
  }

  const code = generatePairingCode();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

  await svc.from("account_invites").insert({
    code,
    family_id: membership.family_id,
    role,
    created_by: user.id,
    expires_at: expiresAt,
  });

  return NextResponse.json({ code, role, expiresAt });
}