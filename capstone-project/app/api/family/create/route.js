// app/api/family/create/route.js
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";

function serviceClient() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

export async function POST(request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const { type } = await request.json();
  if (!["family", "individual"].includes(type)) {
    return NextResponse.json({ error: "Invalid account type" }, { status: 400 });
  }

  const svc = serviceClient();

  // Don't create a second family if this user already belongs to one
  const { data: existing } = await svc
    .from("family_members")
    .select("family_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ familyId: existing.family_id, alreadyExists: true });
  }

  const { data: family, error: familyError } = await svc
    .from("families")
    .insert({ name: `${user.email}'s ${type === "individual" ? "account" : "family"}`, family_type: type })
    .select("id")
    .single();

  if (familyError) {
    return NextResponse.json({ error: familyError.message }, { status: 500 });
  }

  const { error: memberError } = await svc
    .from("family_members")
    .insert({ family_id: family.id, user_id: user.id, role: "parent" });

  if (memberError) {
    return NextResponse.json({ error: memberError.message }, { status: 500 });
  }

  return NextResponse.json({ familyId: family.id, type });
}