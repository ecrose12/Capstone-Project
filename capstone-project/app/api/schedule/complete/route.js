import { NextResponse } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { resolveFamilyContext } from "@/lib/familyContext";

function serviceClient() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

export async function POST(request) {
  // Deliberately does NOT require isParent — checking off a task is a
  // day-to-day interaction for whoever is using the device, not a
  // structural edit. Only add/remove/edit-text/change-card stay parent-only.
  const { familyId } = await resolveFamilyContext();

  if (!familyId) {
    return NextResponse.json(
      { error: "This device isn't linked to a saved schedule" },
      { status: 403 }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { category_id: categoryId, row_label: rowLabel, item_id: itemId, completed } = body || {};
  if (!categoryId || !rowLabel || !itemId || typeof completed !== "boolean") {
    return NextResponse.json({ error: "Missing category_id, row_label, item_id, or completed" }, { status: 400 });
  }

  const svc = serviceClient();

  const { data: existing, error: fetchError } = await svc
    .from("schedules")
    .select("data")
    .eq("family_id", familyId)
    .eq("category_id", categoryId)
    .maybeSingle();

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 });
  }

  if (!existing?.data?.[rowLabel]) {
    return NextResponse.json({ error: "Schedule row not found" }, { status: 404 });
  }

  const updatedData = { ...existing.data };
  updatedData[rowLabel] = updatedData[rowLabel].map((item) =>
    item.id === itemId ? { ...item, completed } : item
  );

  const { error: saveError } = await svc
    .from("schedules")
    .upsert(
      {
        family_id: familyId,
        category_id: categoryId,
        data: updatedData,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "family_id,category_id" }
    );

  if (saveError) {
    return NextResponse.json({ error: saveError.message }, { status: 500 });
  }

  return NextResponse.json({ saved: true });
}