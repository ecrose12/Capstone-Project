import "./coming-soon-page.css";

export default function ComingSoonPage() {
  return (
    <main className="coming-soon-page">
      <h1>Coming Soon to My Words Matter</h1>
      <p className="coming-soon-page__intro">
        Here's a look at what we're working on next:
      </p>

      {/* Placeholder — replace with your real roadmap */}
      <ul className="coming-soon-page__list">
        <li>More PEC card categories</li>
        <li>Additional language support</li>
        <li>Expanded school/classroom tools</li>
      </ul>
    </main>
  );
}