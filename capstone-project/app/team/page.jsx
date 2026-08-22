import Image from "next/image";
import "./team-page.css";

export default function TeamPage() {
  return (
    <main className="team-page">
      <h1>Meet the Creators</h1>
      <p className="team-page__intro">
        My Words Matter was created by:
      </p>

      <div className="team-page__grid">
        <div className="team-page__card">
          <Image
            src="/team/elizabeth-crose.jpg"
            alt="Elizabeth Crose"
            width={200}
            height={200}
            className="team-page__photo"
          />
          <h2>Elizabeth Crose</h2>
          <p>Creator bio goes here.</p>
        </div>
        {/* Placeholder — replace with real photo/bio */}
        <div className="team-page__card">
          <div className="team-page__photo team-page__photo--placeholder" aria-hidden="true">
            +
          </div>
          <h2>Laura Sohl</h2>
          <p>Creator bio goes here.</p>
        </div>
      </div>
    </main>
  );
}
