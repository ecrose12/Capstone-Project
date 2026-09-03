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
            Elizabeth is a Full Stack Developer and co-creator of My Words
            Matter, built during the OKCoders 2026 Full Stack,
            AI-Enhanced Software Development bootcamp through Techlahoma.
            Passionate about accessible technology, she set out to build a
            free, easy-to-use communication tool so cost and waiting lists
            never stand between someone and their voice.
          </p>
          <p>
            Her path into software development follows years of
            hands-on experience spanning payroll, human resources, finance,
            public-sector education, and community service — work that
            gave her a practical understanding of how people actually
            interact with systems, processes, and technology. For the past three
            years, she has supported the Human Resources, Payroll, and Finance
            departments as an Administrative Assistant for a public school
            district, where accuracy, organization, confidentiality, and
            clear communication were essential every day. She's currently
            scouting schools to complete her Computer Science degree and
            working toward her Google UX Design Professional Certification
            ahead of the Spring 2027 semester.
          </p>
          <p>
            Community involvement has long been part of Elizabeth's life.
            She has served on the Board of Directors for the Mighty
            Miracles Foundation and remains active with the Down Syndrome
            Association of Tulsa — experiences that let her advocate for
            others, build meaningful relationships, and support
            organizations making a real difference for individuals and
            families.
          </p>
          <p>
            Her move into software development is a natural extension of
            that experience — driven by how technology can make everyday
            processes more efficient, accessible, and user-friendly,
            backed by an understanding of both the people using a system
            and what it takes to build one that actually works for them.
          </p>
           <p>
            📎 LinkedIn:{" "}
            <a href="https://www.linkedin.com/in/elizabeth-crose/" target="_blank" rel="noopener noreferrer">
              linkedin.com/in/elizabeth-crose
            </a>
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
            Laura is a Full Stack Developer and co-creator of My Words
            Matter, built during the OKCoders 2026 Full Stack,
            AI-Enhanced Software Development bootcamp through Techlahoma. 
            With her graduate training, Laura
            brings something many designers and developers don't — a
            research-backed understanding of human behavior. She likes
            seeing why people make the decisions they do, what frustrates
            them, and how to design systems that fit the way they think and
            work.
          </p>

          <p>
            Laura has over over 10 years of experience translating complex information into clear, accessible communications. She combines UX research and design skills with formal training in graphic design and full-stack development. Her M.S. in Industrial/Organizational Psychology provides a strong foundation in human factors and user behavior. 
          </p>

          <p className="team-page__toolkit-label">She is comfortable working through the full design process:</p>
          <ul className="team-page__toolkit-list">
            <li>→ UX research &amp; usability testing</li>
            <li>→ Information architecture &amp; content design</li>
            <li>→ Visual design: Adobe XD, InDesign, Illustrator, Photoshop, Figma, Canva, Microsoft Power Apps</li>
            <li>→ Front-end basics: HTML, CSS, JavaScript </li>
            <li>→ Scientific &amp; data visualization</li>
          </ul>

          <p>
            <strong>Certifications:</strong> OK Coders Full-stack Bootcamp (Techlahoma, 2026) · UX Design (Google/Coursera,
            2025) · Graphic Design (RISD, 2025) · Scientific Illustration
            (2020)
          </p>

           <p>
            📎 LinkedIn:{" "}
            <a href="https://www.linkedin.com/in/laura-sohl-smith/" target="_blank" rel="noopener noreferrer">
              linkedin.com/in/laura-sohl-smith
            </a>
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