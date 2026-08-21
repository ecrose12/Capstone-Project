import NavMenu from '@/components/NavMenu';
import PhraseButton from '@/components/PhraseButton';

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-white px-6 py-6 flex flex-col gap-8 max-w-md mx-auto">
      <NavMenu />
      <h1 className="text-4xl font-extrabold text-center">User Profile</h1>

      {/* TODO: swap in the user's real avatar (e.g. from Supabase Storage
          or a `profiles` table) once that's wired up. */}
      <div
        className="mx-auto w-40 h-40 rounded-full overflow-hidden border-4 border-black bg-gray-100"
        aria-hidden="true"
      />

      <div className="flex flex-col gap-6 mt-4">
        <PhraseButton label="My Intro" href="/intro" variant="primary" />
        <PhraseButton
          label="⭐ Favorite PECs"
          href="/favorites"
          variant="primary"
        />
      </div>
    </main>
  );
}