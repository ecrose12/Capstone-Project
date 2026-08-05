import { NextResponse } from "next/server";
import { searchSymbols } from "@/lib/opensymbols";
import { resolveFamilyContext } from "@/lib/familyContext";
import { cleanSymbolName } from "@/lib/formatSymbolName";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query || query.trim().length === 0) {
    return NextResponse.json({ error: "Missing search query" }, { status: 400 });
  }

  // Safe search is controlled entirely server-side based on session/device
  // state — the client never sends a "safe" flag, so there's nothing for a
  // child (or a bug) to flip.
  const { isParent } = await resolveFamilyContext();

  try {
    const results = await searchSymbols(query.trim(), { safe: !isParent });
    const simplified = results.map((r) => ({
      id: r.id,
      name: cleanSymbolName(r.name),
      imageUrl: r.image_url,
      license: r.license,
    }));
    return NextResponse.json(simplified);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Symbol search unavailable" }, { status: 502 });
  }
}