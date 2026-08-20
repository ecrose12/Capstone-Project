import { NextResponse } from "next/server";
import { searchSymbols } from "@/lib/opensymbols";
import { cleanSymbolName } from "@/lib/formatSymbolName";
import { isChildSafeText } from "@/lib/contentFilter";
import { PEC_CATEGORIES } from "@/lib/pecCategories";

// In-memory cache so each category's representative image is only ever
// looked up once per server instance, not on every visitor's request.
let cachedCategories = null;

export async function GET() {
  if (cachedCategories) {
    return NextResponse.json(cachedCategories);
  }

  const results = await Promise.all(
    PEC_CATEGORIES.map(async (category) => {
      try {
        const matches = await searchSymbols(category.query, { safe: true });

        // These thumbnails are cached once and shown to every user,
        // including children — so beyond OpenSymbols' own `safe: true`,
        // also run our own content filter and pick the first match that
        // passes both, rather than blindly using the top result.
        const safeMatch = matches?.find((m) => isChildSafeText(m.name));

        return {
          ...category,
          imageUrl: safeMatch?.image_url ?? null,
          imageName: safeMatch ? cleanSymbolName(safeMatch.name) : null,
        };
      } catch {
        // If a single lookup fails, fall back to no image for that one
        // category rather than breaking the whole list.
        return { ...category, imageUrl: null, imageName: null };
      }
    })
  );

  cachedCategories = results;
  return NextResponse.json(results);
}
