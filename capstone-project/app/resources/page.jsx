import { RESOURCE_LINKS } from "@/lib/resources";
import "./resources-page.css";

export default function ResourcesPage() {
  return (
        <main id="tour-resources-list" className="resources-page">
      <h1 className="resources-page__title">Resource Links</h1>
      <p className="resources-page__intro">
        Helpful external resources for social stories, PECS, and visual
        supports. These links open in a new tab.
      </p>

      {RESOURCE_LINKS.map((group) => (
        <section key={group.category} className="resources-page__section">
          <h2>{group.category}</h2>
          <ul className="resources-page__list">
            {group.links.map((link) => (
              <li key={link.url} className="resources-page__item">
                <a href={link.url} target="_blank" rel="noopener noreferrer">
                  {link.title}
                </a>
                <p>{link.description}</p>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </main>
  );
}
