import { NextResponse } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { resolveFamilyContext } from "@/lib/familyContext";
import { getCategory } from "@/lib/categories";

function serviceClient() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

export async function GET() {
  const { familyId, isParent } = await resolveFamilyContext();

  if (!isParent) {
    return NextResponse.json({ error: "Only a signed-in parent can view this" }, { status: 403 });
  }
  if (!familyId) {
    return NextResponse.json({ devices: [] });
  }

  const svc = serviceClient();

  const [devicesResult, scheduleResult, emergencyResult] = await Promise.all([
    svc
      .from("devices")
      .select("id, device_name, paired_at, last_seen_at")
      .eq("family_id", familyId)
      .order("last_seen_at", { ascending: false }),
    svc
      .from("schedules")
      .select("device_id, category_id, updated_at")
      .eq("family_id", familyId)
      .not("device_id", "is", null),
    svc
      .from("emergency_info")
      .select("device_id, updated_at")
      .eq("family_id", familyId)
      .not("device_id", "is", null),
  ]);

  if (devicesResult.error) {
    return NextResponse.json({ error: devicesResult.error.message }, { status: 500 });
  }
  if (scheduleResult.error) {
    return NextResponse.json({ error: scheduleResult.error.message }, { status: 500 });
  }
  if (emergencyResult.error) {
    return NextResponse.json({ error: emergencyResult.error.message }, { status: 500 });
  }

  const scheduleRows = scheduleResult.data || [];
  const emergencyRows = emergencyResult.data || [];

  const devices = (devicesResult.data || []).map((device) => {
    const savedTemplates = [];

    for (const row of scheduleRows) {
      if (row.device_id === device.id) {
        const category = getCategory(row.category_id);
        savedTemplates.push({
          categoryId: row.category_id,
          categoryName: category?.name || row.category_id,
          updatedAt: row.updated_at,
        });
      }
    }

    const emergencyRow = emergencyRows.find((r) => r.device_id === device.id);
    if (emergencyRow) {
      savedTemplates.push({
        categoryId: "emergency-cards",
        categoryName: "In An Emergency",
        updatedAt: emergencyRow.updated_at,
      });
    }

    return {
      id: device.id,
      deviceName: device.device_name,
      pairedAt: device.paired_at,
      lastSeenAt: device.last_seen_at,
      savedTemplates,
    };
  });

  return NextResponse.json({ devices });
}