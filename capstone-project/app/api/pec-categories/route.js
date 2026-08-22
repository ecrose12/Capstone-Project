import { NextResponse } from "next/server";
import { searchSymbols } from "@/lib/opensymbols";
import { cleanSymbolName } from "@/lib/formatSymbolName";
import { isChildSafeText } from "@/lib/contentFilter";
import { PEC_CATEGORIES } from "@/lib/pecCategories";

let cachedCategories = null;

export async function GET() {
  if (cachedCategories) {
    return NextResponse.json(cachedCategories);
  }

  const results = await Promise.all(
    PEC_CATEGORIES.map(async (category) => {
      try {
        const matches = await searchSymbols(category.queries[0], { safe: true });
        const safeMatch = matches?.find((m) => isChildSafeText(m.name));

        return {
          id: category.id,
          label: category.label,
          imageUrl: safeMatch?.image_url ?? null,
          imageName: safeMatch ? cleanSymbolName(safeMatch.name) : null,
        };
      } catch {
        return { id: category.id, label: category.label, imageUrl: null, imageName: null };
      }
    })
  );

  cachedCategories = results;
  return NextResponse.json(results);
}