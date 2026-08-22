import "./coming-soon-page.css";

export default function ComingSoonPage() {
  return (
    <main className="coming-soon-page">
      <h1>Coming Soon to My Words Matter</h1>
      <p className="coming-soon-page__intro">
        Here's a look at what we're working on next:
      </p>

      <ul className="coming-soon-page__list">
        <li>
          <strong>My Favorite Words</strong> — a personal, quick-access list
          of the words and cards you use most
        </li>
        <li>
          <strong>My Word Combinations</strong> — save frequently-used
          combinations of cards (like a favorite meal order) to speak in one
          tap
        </li>
        <li>
          <strong>My Favorite Words at School (or Work)</strong> — a
          separate favorites list tailored to school or work settings
        </li>
        <li>
          <strong>Recently Used PECs</strong> — quick access to the cards
          you've used most recently
        </li>
        <li>
          <strong>App/Website Tour</strong> — a guided walkthrough to help
          new users get oriented
        </li>
        <li>
          <strong>Saved Lists</strong> — manage all your saved lists in one
          place (likely from your Account page)
        </li>
        <li>
          <strong>My Family</strong> — a page to view and manage everyone
          connected to your family account
        </li>
      </ul>
    </main>
  );
}