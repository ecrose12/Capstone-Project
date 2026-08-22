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
          <p>
            Elizabeth is the co-creator of My Words Matter, built during the
            OKCoders 2026 coding bootcamp. Passionate about accessible
            technology, she set out to build a free, easy-to-use
            communication tool so cost and waiting lists never stand
            between someone and their voice.
          </p>
        </div>

        <div className="team-page__card">
          <Image
            src="/team/laura-sohl.jpg"
            alt="Laura Sohl"
            width={200}
            height={200}
            className="team-page__photo"
          />
          <h2>Laura Sohl</h2>

          <p>
            With an M.S. in Industrial/Organizational Psychology, Laura
            brings something many designers and developers don't — a
            research-backed understanding of human behavior. She likes
            seeing why people make the decisions they do, what frustrates
            them, and how to design systems that fit the way they think and
            work.
          </p>

          <p>
            For over a decade at her state agency, she's worked at the
            intersection of two roles: designer and program manager. She's
            translated complex scientific and technical information into
            clear, accessible communications — designing annual reports,
            infographics, research catalogs, and conference materials for
            audiences ranging from legislators to the general public. On
            the program management side, she's onboarded newly awarded
            PIs and monitored the submission and review of quarterly
            progress reports, budget and contract modifications, and
            invoices for over 100 projects annually.
          </p>

          <p className="team-page__toolkit-label">Her toolkit spans the full design process:</p>
          <ul className="team-page__toolkit-list">
            <li>→ UX research &amp; usability testing</li>
            <li>→ Information architecture &amp; content design</li>
            <li>→ Visual design: Figma, Adobe InDesign, Illustrator, Photoshop, Canva</li>
            <li>→ Front-end basics: HTML, CSS, JavaScript (currently expanding via full-stack bootcamp)</li>
            <li>→ Scientific &amp; data visualization</li>
          </ul>

          <p>
            <strong>Certifications:</strong> UX Design (Google/Coursera,
            2025) · Graphic Design (RISD, 2025) · Scientific Illustration
            (2020)
          </p>

          <p>
            Laura is currently open to new roles in design and
            development, as well as program management.
          </p>

          <p>
            📎 Portfolio:{" "}
            <a href="http://sohlsmith.com/" target="_blank" rel="noopener noreferrer">
              sohlsmith.com
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}