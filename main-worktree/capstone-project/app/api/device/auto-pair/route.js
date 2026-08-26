// app/api/device/auto-pair/route.js
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { generateDeviceToken } from "@/lib/deviceToken";
import { cookies } from "next/headers";

function serviceClient() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const cookieStore = await cookies();
  if (cookieStore.get("device_token")?.value) {
    // Already paired — nothing to do
    return NextResponse.json({ alreadyPaired: true });
  }

  const svc = serviceClient();

  // Find this parent's existing family, or create one
  const { data: membership } = await svc
    .from("family_parents")
    .select("family_id")
    .eq("parent_id", user.id)
    .maybeSingle();

  let familyId = membership?.family_id;

  if (!familyId) {
    const { data: family, error: familyError } = await svc
      .from("families")
      .insert({ name: `${user.email}'s family` })
      .select("id")
      .single();

    if (familyError) {
      return NextResponse.json({ error: familyError.message }, { status: 500 });
    }

    familyId = family.id;

    const { error: linkError } = await svc
      .from("family_parents")
      .insert({ family_id: familyId, parent_id: user.id });

    if (linkError) {
      return NextResponse.json({ error: linkError.message }, { status: 500 });
    }
  }

  const { raw, hash } = generateDeviceToken();

  const { error: deviceError } = await svc.from("devices").insert({
    family_id: familyId,
    device_token_hash: hash,
    device_name: "This device",
  });

  if (deviceError) {
    return NextResponse.json({ error: deviceError.message }, { status: 500 });
  }

  const response = NextResponse.json({ paired: true, familyId });
  response.cookies.set("device_token", raw, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365 * 2, // 2 years — a device pairing, not a login session
    path: "/",
  });

  return response;
}