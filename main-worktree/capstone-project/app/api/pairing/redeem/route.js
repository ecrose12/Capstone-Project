// app/api/pairing/redeem/route.js
import { NextResponse } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { generateDeviceToken } from "@/lib/deviceToken";

function serviceClient() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const code = body?.code?.trim();
  if (!code) {
    return NextResponse.json({ error: "Missing code" }, { status: 400 });
  }

  const svc = serviceClient();

  const { data: pairing } = await svc
    .from("pairing_codes")
    .select("family_id, expires_at, used, device_name")
    .eq("code", code)
    .maybeSingle();

  if (!pairing || pairing.used || new Date(pairing.expires_at) < new Date()) {
    return NextResponse.json({ error: "Invalid or expired code" }, { status: 400 });
  }

  // Mark used immediately so the code can't be redeemed twice
  await svc.from("pairing_codes").update({ used: true }).eq("code", code);

  const { raw, hash } = generateDeviceToken();

  const { error: deviceError } = await svc.from("devices").insert({
    family_id: pairing.family_id,
    device_token_hash: hash,
    device_name: pairing.device_name || "Paired device",
  });

  if (deviceError) {
    return NextResponse.json({ error: deviceError.message }, { status: 500 });
  }

  const response = NextResponse.json({ paired: true });
  response.cookies.set("device_token", raw, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365 * 2, // 2 years
    path: "/",
  });

  return response;
}