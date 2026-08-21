export type Pec = {
  id: string;
  user_id: string;
  label: string;
  image_url: string | null;
  category: string | null;
  is_favorite: boolean;
  created_at: string;
};

// The minimal shape PecTile needs to render + speak a card — satisfied
// by both a saved Pec (from Supabase) and a live symbol search result
// that hasn't been saved yet (e.g. a Sentence Creator slot).
export type PecLike = {
  id?: string;
  label: string;
  image_url: string | null;
};