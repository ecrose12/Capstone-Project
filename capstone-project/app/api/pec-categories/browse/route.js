import { NextResponse } from "next/server";
import { searchSymbols } from "@/lib/opensymbols";
import { resolveFamilyContext } from "@/lib/familyContext";
import { cleanSymbolName } from "@/lib/formatSymbolName";
import { filterChildSafeSymbols } from "@/lib/contentFilter";
import { PEC_CATEGORIES } from "@/lib/pecCategories";
import { CATEGORY_RELEVANCE_TERMS } from "@/lib/categoryRelevance";

function isRelevant(name, categoryId) {
  const terms = CATEGORY_RELEVANCE_TERMS[categoryId];
  if (!terms) return true;
  const lower = name.toLowerCase();
  return terms.some((term) => lower.includes(term));
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const categoryId = searchParams.get("category");

  const category = PEC_CATEGORIES.find((c) => c.id === categoryId);
  if (!category) {
    return NextResponse.json({ error: "Unknown category" }, { status: 400 });
  }

  const { isParent, alwaysSafeSearch } = await resolveFamilyContext();
  const useSafeSearch = !isParent || alwaysSafeSearch;

  try {
    const results = await searchSymbols(category.query, { safe: useSafeSearch });
    let simplified = results.map((r) => ({
      id: r.id,
      name: cleanSymbolName(r.name),
      imageUrl: r.image_url,
      license: r.license,
    }));

    simplified = simplified.filter((s) => isRelevant(s.name, categoryId));

    if (useSafeSearch) {
      simplified = filterChildSafeSymbols(simplified);
    }

    return NextResponse.json(simplified);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Symbol search unavailable" }, { status: 502 });
  }
}