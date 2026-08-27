import { NextResponse } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { resolveFamilyContext } from "@/lib/familyContext";

function serviceClient() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const categoryId = searchParams.get("category_id");

  if (!categoryId) {
    return NextResponse.json({ error: "Missing category_id" }, { status: 400 });
  }

  const { familyId, isParent, deviceId } = await resolveFamilyContext();

  if (!familyId) {
    return NextResponse.json({ data: null, isParent, hasFamily: false });
  }

  const svc = serviceClient();
  let row = null;

  // A paired device checks for its own saved version first.
  if (deviceId) {
    const { data, error } = await svc
      .from("schedules")
      .select("data, updated_at")
      .eq("family_id", familyId)
      .eq("category_id", categoryId)
      .eq("device_id", deviceId)
      .maybeSingle();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    row = data;
  }

  // Fall back to the shared version — either this isn't a paired device
  // (it's the parent/teacher's own account), or the device has no
  // version of its own saved yet.
  if (!row) {
    const { data, error } = await svc
      .from("schedules")
      .select("data, updated_at")
      .eq("family_id", familyId)
      .eq("category_id", categoryId)
      .is("device_id", null)
      .maybeSingle();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    row = data;
  }

  return NextResponse.json({
    data: row?.data ?? null,
    updatedAt: row?.updated_at ?? null,
    isParent,
    hasFamily: true,
  });
}

export async function POST(request) {
  const { familyId, isParent } = await resolveFamilyContext();

  if (!isParent) {
    return NextResponse.json({ error: "Only a signed-in parent can save a schedule" }, { status: 403 });
  }

  if (!familyId) {
    return NextResponse.json(
      { error: "No family found for this account yet. Try signing out and back in." },
      { status: 400 }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { category_id: categoryId, data, device_id: deviceId } = body || {};
  if (!categoryId || typeof data !== "object" || data === null) {
    return NextResponse.json({ error: "Missing category_id or data" }, { status: 400 });
  }

  const svc = serviceClient();

  if (deviceId) {
    const { data: device } = await svc
      .from("devices")
      .select("id")
      .eq("id", deviceId)
      .eq("family_id", familyId)
      .maybeSingle();
    if (!device) {
      return NextResponse.json({ error: "That device wasn't found for this account." }, { status: 400 });
    }
  }

  let existingQuery = svc
    .from("schedules")
    .select("id")
    .eq("family_id", familyId)
    .eq("category_id", categoryId);
  existingQuery = deviceId
    ? existingQuery.eq("device_id", deviceId)
    : existingQuery.is("device_id", null);

  const { data: existing, error: findError } = await existingQuery.maybeSingle();
  if (findError) {
    return NextResponse.json({ error: findError.message }, { status: 500 });
  }

  const payload = {
    family_id: familyId,
    category_id: categoryId,
    device_id: deviceId || null,
    data,
    updated_at: new Date().toISOString(),
  };

  const { error } = existing
    ? await svc.from("schedules").update(payload).eq("id", existing.id)
    : await svc.from("schedules").insert(payload);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ saved: true });
}