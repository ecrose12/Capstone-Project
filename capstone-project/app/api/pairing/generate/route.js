// app/api/pairing/generate/route.js
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { generatePairingCode } from "@/lib/deviceToken";

function serviceClient() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

const CODE_LIFETIME_MS = 10 * 60 * 1000; // 10 minutes

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const svc = serviceClient();

  const { data: membership } = await svc
    .from("family_parents")
    .select("family_id")
    .eq("parent_id", user.id)
    .maybeSingle();

  if (!membership) {
    return NextResponse.json(
      { error: "No family found for this account. Sign in on this device first to create one." },
      { status: 400 }
    );
  }

  // Retry once on the rare chance of a collision on the code primary key
  for (let attempt = 0; attempt < 2; attempt++) {
    const code = generatePairingCode();
    const expiresAt = new Date(Date.now() + CODE_LIFETIME_MS).toISOString();

    const { error } = await svc.from("pairing_codes").insert({
      code,
      family_id: membership.family_id,
      created_by: user.id,
      expires_at: expiresAt,
    });

    if (!error) {
      return NextResponse.json({ code, expiresAt });
    }
  }

  return NextResponse.json({ error: "Could not generate a code. Try again." }, { status: 500 });
}