import { createClient } from './client';
import type { Pec } from './types';
import type { Symbol } from '../symbols';

/**
 * Searches only the cards this user has already saved (their personal
 * collection) — NOT the live symbol database. For finding new cards to
 * add, use `searchSymbols` from `lib/symbols.ts` instead.
 */
export async function searchPecs(query: string): Promise<Pec[]> {
  const supabase = createClient();
  if (!supabase) return [];

  let request = supabase.from('pecs').select('*').order('label');
  if (query.trim()) {
    request = request.ilike('label', `%${query.trim()}%`);
  }

  const { data, error } = await request;
  if (error) {
    console.error('Error searching PECs:', error.message);
    return [];
  }
  return data ?? [];
}

/** Loads every card the user has marked as a favorite. */
export async function getFavoritePecs(): Promise<Pec[]> {
  const supabase = createClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('pecs')
    .select('*')
    .eq('is_favorite', true)
    .order('label');

  if (error) {
    console.error('Error loading favorite PECs:', error.message);
    return [];
  }
  return data ?? [];
}

/** Marks (or unmarks) a saved card as a favorite. */
export async function toggleFavorite(
  pecId: string,
  isFavorite: boolean
): Promise<boolean> {
  const supabase = createClient();
  if (!supabase) return false;

  const { error } = await supabase
    .from('pecs')
    .update({ is_favorite: isFavorite })
    .eq('id', pecId);

  if (error) {
    console.error('Error updating favorite:', error.message);
    return false;
  }
  return true;
}

/**
 * Saves a symbol from the live search (`searchSymbols`) as a new card
 * in this user's personal collection.
 * TODO: always inserts a new row — if the same symbol gets saved twice
 * you'll get two rows. Add a duplicate check (e.g. by image_url) if
 * that becomes annoying in practice.
 */
export async function saveSymbolAsFavorite(
  symbol: Symbol,
  userId: string
): Promise<Pec | null> {
  const supabase = createClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('pecs')
    .insert({
      label: symbol.name,
      image_url: symbol.imageUrl,
      user_id: userId,
      is_favorite: true,
    })
    .select()
    .single();

  if (error) {
    console.error('Error saving favorite:', error.message);
    return null;
  }
  return data;
}