// app/api/account-invite/redeem/route.js
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
import { createClient as createServiceClient } from "@supabase/supabase-js";

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

  const { code } = await request.json();
  if (!code) return NextResponse.json({ error: "Missing code" }, { status: 400 });

  const svc = serviceClient();
  const { data: invite } = await svc
    .from("account_invites")
    .select("family_id, role, expires_at, used")
    .eq("code", code.trim())
    .maybeSingle();

  if (!invite || invite.used || new Date(invite.expires_at) < new Date()) {
    return NextResponse.json({ error: "Invalid or expired code" }, { status: 400 });
  }

  await svc.from("account_invites").update({ used: true }).eq("code", code.trim());

  const { error } = await svc.from("family_members").insert({
    family_id: invite.family_id,
    user_id: user.id,
    role: invite.role,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ joined: true, role: invite.role });
}
