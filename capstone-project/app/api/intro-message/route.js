import { NextResponse } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { resolveFamilyContext } from "@/lib/familyContext";

function serviceClient() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

export async function GET() {
  const { familyId, isParent } = await resolveFamilyContext();

  if (!familyId) {
    return NextResponse.json({ message: null, locked: false, hasFamily: false, isParent });
  }

  const svc = serviceClient();
  const { data, error } = await svc
    .from("family_settings")
    .select("intro_message, intro_message_locked, updated_at")
    .eq("family_id", familyId)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    message: data?.intro_message ?? null,
    locked: data?.intro_message_locked ?? false,
    updatedAt: data?.updated_at ?? null,
    hasFamily: true,
    isParent,
  });
}

export async function POST(request) {
  const { familyId, isParent } = await resolveFamilyContext();

  if (!familyId) {
    return NextResponse.json(
      { error: "This device isn't paired to a family yet" },
      { status: 403 }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const svc = serviceClient();

  // Check current lock state before allowing a non-parent write.
  const { data: existing } = await svc
    .from("family_settings")
    .select("intro_message_locked")
    .eq("family_id", familyId)
    .maybeSingle();

  const currentlyLocked = existing?.intro_message_locked ?? false;

  if (currentlyLocked && !isParent) {
    return NextResponse.json(
      { error: "This message is locked. Ask a parent to unlock it or make the change." },
      { status: 403 }
    );
  }

  // Only a parent may change the lock itself, regardless of current state.
  const wantsLockChange = typeof body?.locked === "boolean";
  if (wantsLockChange && !isParent) {
    return NextResponse.json(
      { error: "Only a parent can lock or unlock this setting" },
      { status: 403 }
    );
  }

  const update = { family_id: familyId, updated_at: new Date().toISOString() };

  if (typeof body?.message === "string") {
    const message = body.message.trim();
    if (!message) {
      return NextResponse.json({ error: "Message cannot be empty" }, { status: 400 });
    }
    if (message.length > 300) {
      return NextResponse.json({ error: "Message is too long" }, { status: 400 });
    }
    update.intro_message = message;
  }

  if (wantsLockChange) {
    update.intro_message_locked = body.locked;
  }

  if (!("intro_message" in update) && !("intro_message_locked" in update)) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  const { error } = await svc
    .from("family_settings")
    .upsert(update, { onConflict: "family_id" });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    saved: true,
    message: update.intro_message,
    locked: wantsLockChange ? update.intro_message_locked : currentlyLocked,
  });
}