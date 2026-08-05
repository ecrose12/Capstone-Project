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
      return { familyId: data.family_id, isParent: data.role === "parent", userId: user.id, role: data.role };
    }
    // Signed in, but not yet linked to any family
    return { familyId: null, isParent: false, userId: user.id, role: null };
  }

  // Not logged in — check for a paired device token (unchanged from before)
  const cookieStore = await cookies();
  const deviceToken = cookieStore.get("device_token")?.value;
  if (!deviceToken) return { familyId: null, isParent: false };

  const svc = serviceClient();
  const { data: device } = await svc
    .from("devices")
    .select("family_id")
    .eq("device_token_hash", hashToken(deviceToken))
    .maybeSingle();

  if (!device) return { familyId: null, isParent: false };

  svc.from("devices").update({ last_seen_at: new Date().toISOString() })
    .eq("device_token_hash", hashToken(deviceToken)).then(() => {});

  return { familyId: device.family_id, isParent: false };
}