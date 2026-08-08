import { NextResponse } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { resolveFamilyContext } from "@/lib/familyContext";
import { searchSymbols } from "@/lib/opensymbols";
import { cleanSymbolName } from "@/lib/formatSymbolName";

function serviceClient() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

// Each default phrase paired with a simpler search keyword — OpenSymbols'
// library matches single concepts much better than full sentences, so
// "I need medical assistance" searches "medical" rather than the whole phrase.
const DEFAULT_PRESET_PHRASES = [
  { text: "I need help", query: "help" },
  { text: "I am hurt", query: "hurt" },
  { text: "I need medical assistance", query: "medical" },
  { text: "I need police assistance", query: "police" },
  { text: "Please take me to the school nurse", query: "nurse" },
  { text: "I am lost", query: "lost" },
  { text: "I am nonverbal", query: "nonverbal" },
  { text: "Please contact my parent", query: "parent" },
  { text: "I feel overwhelmed", query: "overwhelmed" },
  { text: "I can't breathe", query: "breathe" },
  { text: "I don't understand", query: "confused" },
  { text: "Call 911", query: "911" },
];

// In-memory cache so the default set only gets searched once per server
// instance, not on every request from every guest/first-time viewer.
let cachedDefaults = null;

async function getDefaultPresetCards() {
  if (cachedDefaults) return cachedDefaults;

  const results = await Promise.all(
    DEFAULT_PRESET_PHRASES.map(async ({ text, query }) => {
      try {
        const matches = await searchSymbols(query, { safe: true });
        const top = matches?.[0];
        const card = top
          ? {
              id: top.id,
              name: cleanSymbolName(top.name),
              imageUrl: top.image_url,
              license: top.license,
            }
          : null;
        return { id: text, text, card };
      } catch {
        // If a single lookup fails (rate limit, network hiccup), fall back
        // to no image for that one phrase rather than failing the whole set.
        return { id: text, text, card: null };
      }
    })
  );

  cachedDefaults = results;
  return results;
}

export async function GET() {
  const { familyId, isParent } = await resolveFamilyContext();

  if (!familyId) {
    return NextResponse.json({
      hasFamily: false,
      isParent,
      presetCards: await getDefaultPresetCards(),
      basicInfo: {},
      medicalId: {},
      emergencyContact: {},
      showBasicInfo: false,
      showMedicalId: false,
      showEmergencyContact: false,
    });
  }

  const svc = serviceClient();
  const { data, error } = await svc
    .from("emergency_info")
    .select("*")
    .eq("family_id", familyId)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    hasFamily: true,
    isParent,
    presetCards:
      data?.preset_cards?.length > 0
        ? data.preset_cards
        : await getDefaultPresetCards(),
    basicInfo: data?.basic_info ?? {},
    medicalId: data?.medical_id ?? {},
    emergencyContact: data?.emergency_contact ?? {},
    showBasicInfo: data?.show_basic_info ?? false,
    showMedicalId: data?.show_medical_id ?? false,
    showEmergencyContact: data?.show_emergency_contact ?? false,
  });
}

export async function POST(request) {
  const { familyId, isParent } = await resolveFamilyContext();

  if (!isParent) {
    return NextResponse.json({ error: "Only a signed-in parent can edit this" }, { status: 403 });
  }
  if (!familyId) {
    return NextResponse.json({ error: "No family found for this account" }, { status: 400 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const {
    presetCards,
    basicInfo,
    medicalId,
    emergencyContact,
    showBasicInfo,
    showMedicalId,
    showEmergencyContact,
  } = body || {};

  const svc = serviceClient();
  const { error } = await svc.from("emergency_info").upsert(
    {
      family_id: familyId,
      preset_cards: presetCards ?? [],
      basic_info: basicInfo ?? {},
      medical_id: medicalId ?? {},
      emergency_contact: emergencyContact ?? {},
      show_basic_info: !!showBasicInfo,
      show_medical_id: !!showMedicalId,
      show_emergency_contact: !!showEmergencyContact,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "family_id" }
  );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ saved: true });
}