export type Symbol = {
  id: string;
  name: string;
  imageUrl: string | null;
  license?: string;
};

/**
 * Searches the live PECS symbol database via your own
 * /api/symbols/search route — which already applies child-safe
 * filtering server-side. Never call the underlying symbol service
 * directly from the client; that filtering only happens here.
 */
export async function searchSymbols(query: string): Promise<Symbol[]> {
  if (!query.trim()) return [];

  const res = await fetch(`/api/symbols/search?q=${encodeURIComponent(query.trim())}`);
  if (!res.ok) {
    console.error('Symbol search failed:', res.status);
    return [];
  }
  return res.json();
}