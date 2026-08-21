'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import NavMenu from '@/components/NavMenu';
import { createClient } from '@/lib/supabase/client';
import { DEFAULT_INTRO, getIntro, saveIntro } from '@/lib/supabase/intro';

export default function EditIntroPage() {
  const router = useRouter();
  const [text, setText] = useState(DEFAULT_INTRO);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const {
        data: { user } = { user: null },
      } = supabase
        ? await supabase.auth.getUser()
        : { data: { user: null } };

      const uid = user?.id ?? null;
      setUserId(uid);

      if (uid) {
        setText(await getIntro(uid));
      }
      setLoading(false);
    }
    load();
  }, []);

  const handleSave = async () => {
    if (!userId) {
      // No signed-in user — nothing to persist yet.
      router.push('/profile');
      return;
    }
    setSaving(true);
    await saveIntro(userId, text);
    setSaving(false);
    router.push('/profile');
  };

  return (
    <main className="min-h-screen bg-white px-6 py-6 flex flex-col gap-6 max-w-md mx-auto">
      <NavMenu />
      <h1 className="text-4xl font-extrabold text-center">
        Edit Your Introduction
      </h1>
      <p className="text-xl font-bold text-center">
        What should be spoken when you tap &quot;Introduce Myself&quot;?
      </p>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={loading}
        rows={8}
        className="textarea border-2 border-black rounded-lg text-lg p-4 w-full resize-none focus:outline-none focus:ring-4 focus:ring-[#1656b3]/40"
        aria-label="Introduction text"
      />

      <div className="flex justify-between gap-4 mt-2">
        <button
          type="button"
          onClick={() => router.push('/profile')}
          className="btn btn-outline flex-1 rounded-full border-2 border-[#1656b3] text-[#1656b3] text-xl normal-case"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving || loading}
          className="btn flex-1 rounded-full bg-[#1656b3] border-2 border-black text-white text-xl normal-case"
        >
          {saving ? 'Saving…' : 'Save'}
        </button>
      </div>
    </main>
  );
}
