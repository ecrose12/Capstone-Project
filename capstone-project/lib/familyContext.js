// lib/familyContext.js
import { createClient as createServerClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { hashToken } from "./deviceToken";
import { cookies } from "next/headers";

function serviceClient() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

async function getFamilyType(svc, familyId) {
  if (!familyId) return null;
  const { data } = await svc
    .from("families")
    .select("family_type")
    .eq("id", familyId)
    .maybeSingle();
  return data?.family_type ?? null;
}

export async function resolveFamilyContext() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    const { data } = await supabase
      .from("family_members")
      .select("family_id, role")
      .eq("user_id", user.id)
      .maybeSingle();

    if (data) {
      const svc = serviceClient();
      const familyType = await getFamilyType(svc, data.family_id);
      return {
        familyId: data.family_id,
        isParent: data.role === "parent",
        alwaysSafeSearch: familyType === "school",
        familyType,
        userId: user.id,
        role: data.role,
        deviceId: null,
      };
    }
    return {
      familyId: null,
      isParent: false,
      alwaysSafeSearch: false,
      familyType: null,
      userId: user.id,
      role: null,
      deviceId: null,
    };
  }

  const cookieStore = await cookies();
  const deviceToken = cookieStore.get("device_token")?.value;
  if (!deviceToken) {
    return { familyId: null, isParent: false, alwaysSafeSearch: false, familyType: null, deviceId: null };
  }

  const svc = serviceClient();
  const { data: device } = await svc
    .from("devices")
    .select("id, family_id")
    .eq("device_token_hash", hashToken(deviceToken))
    .maybeSingle();

  if (!device) {
    return { familyId: null, isParent: false, alwaysSafeSearch: false, familyType: null, deviceId: null };
  }

  svc.from("devices").update({ last_seen_at: new Date().toISOString() })
    .eq("device_token_hash", hashToken(deviceToken)).then(() => {});

  const familyType = await getFamilyType(svc, device.family_id);
  return {
    familyId: device.family_id,
    isParent: false,
    alwaysSafeSearch: familyType === "school",
    familyType,
    deviceId: device.id,
  };
}