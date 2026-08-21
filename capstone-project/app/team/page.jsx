import "./team-page.css";

export default function TeamPage() {
  return (
    <main className="team-page">
      <h1>Meet the Creators</h1>
      <p className="team-page__intro">
        My Words Matter was created by:
      </p>

      <div className="team-page__grid">
        {/* Placeholder — replace with real names/bios/photos */}
        <div className="team-page__card">
          <h2>Elizabeth Crose</h2>
          <p>Creator bio goes here.</p>
        </div>
        <div className="team-page__card">
          <h2>Laura Sohl</h2>
          <p>Creator bio goes here.</p>
        </div>
      </div>
    </main>
  );
}