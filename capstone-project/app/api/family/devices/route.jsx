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

  if (!isParent) {
    return NextResponse.json({ error: "Only a signed-in parent can view devices" }, { status: 403 });
  }

  if (!familyId) {
    return NextResponse.json({ devices: [] });
  }

  const svc = serviceClient();
  const { data, error } = await svc
    .from("devices")
    .select("id, device_name, paired_at, last_seen_at")
    .eq("family_id", familyId)
    .order("last_seen_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ devices: data || [] });
}