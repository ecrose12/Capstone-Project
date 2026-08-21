import { createClient } from './client';

export const DEFAULT_INTRO =
  'Hi, I use this app to help me communicate. Thank you for your patience.';

/** Loads the text spoken when the user taps "Introduce Myself". */
export async function getIntro(userId: string): Promise<string> {
  const supabase = createClient();
  if (!supabase) return DEFAULT_INTRO;

  const { data, error } = await supabase
    .from('user_intro')
    .select('intro_text')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    console.error('Error loading intro:', error.message);
    return DEFAULT_INTRO;
  }
  return data?.intro_text ?? DEFAULT_INTRO;
}

/** Saves the user's custom introduction text. */
export async function saveIntro(
  userId: string,
  introText: string
): Promise<boolean> {
  const supabase = createClient();
  if (!supabase) return false;

  const { error } = await supabase.from('user_intro').upsert({
    user_id: userId,
    intro_text: introText,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    console.error('Error saving intro:', error.message);
    return false;
  }
  return true;
}