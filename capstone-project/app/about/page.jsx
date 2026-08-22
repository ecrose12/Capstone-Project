import "./about-page.css";

export default function AboutPage() {
  return (
    <main className="about-page">
      <h1>About My Words Matter</h1>

      <p>
        My Words Matter is a free, web-based picture communication app that
        helps anyone express needs, choices, emotions, and ideas through
        visual symbols and Picture Exchange Communication (PEC) tools.
      </p>

      <p>
        Communication barriers — whether temporary or ongoing — can leave
        people feeling frustrated, embarrassed, or isolated. The person
        trying to help often feels the same confusion. These moments range
        from everyday inconveniences to situations where clear communication
        truly matters. Every person deserves a simple, universal way to be
        understood, no matter the reason the barrier exists.
      </p>

      <p>
        This app was created because access to traditional AAC devices can
        take many months of evaluations, referrals, paperwork, insurance
        prior authorizations, denials, and appeals — and still cost
        thousands of dollars. One family's experience with a Via Mini 8
        running TouchChat took 16–18 months and carried a retail price of
        $7,315. No one should have to wait that long or face that financial
        barrier simply to have a voice.
      </p>

      <p>
        My Words Matter exists so that anyone, in any situation, can use
        picture-based communication tools without cost, without waiting, and
        without jumping through institutional hoops. It is built to stay
        free so that financial barriers never stand between someone and the
        ability to communicate.
      </p>

      <p>
        We are grateful to OpenSymbols.org for the open-source symbol
        database that powers the app, to the Techlahoma Foundation for its
        support, and to our outstanding OKCoders 2026 instructors, Bryan and
        Derrick, whose guidance helped bring this project to life.
      </p>

      <hr className="about-page__divider" />

      <h2>My Words Matter Unique Features</h2>

      <h4>Communication &amp; Templates</h4>
      <ul>
        <li>
          Nine customizable PEC template types: Single PEC Selector,
          Sentence Creator, Emergency Cards, Today's Schedule, Daily Task
          Checklist, Detailed Daily Chore List, Weekly Chore List,
          First/Then, and Consequence/Reward
        </li>
        <li>Text-to-Speech playback for any card, sentence, or schedule item</li>
        <li>
          Custom, parent-lockable "Introduction Message" button for
          self-advocacy in new situations
        </li>
        <li>
          Printable templates and checklists, styled specifically for
          clean print output
        </li>
      </ul>

      <h4>Accounts &amp; Access</h4>
      <ul>
        <li>
          Three account types: Individual, Parent/Caregiver &amp; Child, and
          School Administrator/Teacher &amp; Student
        </li>
        <li>
          Role-based permissions — children/students can use and check off
          items, but only parents/admins can edit templates or account
          settings
        </li>
        <li>
          Device Pairing — connect a child's or student's device with a
          one-time code, with zero email or login required for the child
        </li>
        <li>Password reset / account recovery for adult accounts</li>
      </ul>

      <h4>Search &amp; Safety</h4>
      <ul>
        <li>Two ways to find picture cards: type-to-search or Browse by Category</li>
        <li>
          Two independent layers of content filtering (a third-party
          safety filter plus a custom-built keyword/phrase filter) for
          Child Mode
        </li>
        <li>
          Automatic, non-optional safe search for all School accounts —
          protects every user on a school's account, including staff, with
          nothing for an admin to forget to enable
        </li>
      </ul>

      <h4>Accessibility &amp; Usability</h4>
      <ul>
        <li>
          Built to ADA-accessible standards: large touch targets,
          high-contrast color themes, visible focus states throughout
        </li>
        <li>Light and Dark mode</li>
        <li>
          Installable as a Progressive Web App — works offline and adds a
          home-screen icon like a native app
        </li>
        <li>
          Multi-language voice selection for Text-to-Speech (English
          US/UK, Spanish Spain/Mexico, French, German)
        </li>
      </ul>

      <h4>Cost &amp; Access</h4>
      <ul>
        <li>
          Completely free, with no waiting periods, insurance approvals,
          or paperwork — powered by the open-source OpenSymbols picture
          library
        </li>
      </ul>

      <h4>Support</h4>
      <ul>
        <li>Built-in Contact Support form with a dedicated admin reply system</li>
      </ul>

      <hr className="about-page__divider" />

      <h2>Why My Words Matter Creators Chose PECS as the Communication Model</h2>

      <ol className="about-page__numbered-list">
        <li>
          <strong>Builds Independent, Functional Communication</strong>
          <p>
            PECS focuses on initiating communication rather than waiting to
            be prompted. Users learn to approach someone and hand over a
            picture to request what they want. This creates a clear,
            successful exchange that is immediately reinforced. Over time,
            it expands from single-picture requests to building sentences,
            answering questions, and commenting. It does not require
            prerequisite skills like speech imitation, pointing, or
            matching.
          </p>
        </li>
        <li>
          <strong>Reduces Frustration and Challenging Behaviors</strong>
          <p>
            When someone cannot express needs, wants, or discomfort,
            frustration often leads to tantrums, aggression, withdrawal, or
            other problem behaviors. PECS gives a reliable alternative way
            to communicate, which frequently decreases these behaviors.
            Multiple studies and reviews note reductions in challenging
            behavior once functional communication is established.
          </p>
        </li>
        <li>
          <strong>Supports (and Often Encourages) Spoken Language</strong>
          <p>
            A common concern is that using pictures will prevent speech.
            Research consistently shows the opposite: PECS does not hinder
            speech development and, for many learners, is associated with
            increased vocalizations and spoken words over time. The
            successful experience of communicating appears to motivate
            further attempts at speech.
          </p>
        </li>
        <li>
          <strong>Increases Independence, Confidence, and Choice-Making</strong>
          <p>
            Users gain the ability to make requests and choices on their own
            (food, activities, breaks, etc.). This fosters autonomy,
            self-advocacy, and greater confidence. Caregivers often report
            less reliance on guessing or constant prompting.
          </p>
        </li>
        <li>
          <strong>Improves Social Interaction</strong>
          <p>
            The physical act of exchanging a picture requires approaching
            and engaging another person. This naturally supports
            turn-taking, joint attention, and relationship-building with
            family, peers, teachers, and others.
          </p>
        </li>
        <li>
          <strong>Practical, Portable, and Universally Understandable</strong>
          <ul>
            <li>
              Pictures and symbols are easy for most communication partners
              to understand (unlike some signs or unclear speech).
            </li>
            <li>
              The system is relatively low-cost and highly portable —
              usable at home, school, in the community, or via digital
              apps.
            </li>
            <li>
              It works across settings and can be individualized with
              photos, icons, or symbols that match the person's age and
              interests.
            </li>
          </ul>
        </li>
        <li>
          <strong>Strong Evidence Base</strong>
          <p>
            PECS is recognized as an evidence-based practice. Reviews and
            studies (including randomized controlled trials and
            meta-analyses) show it effectively teaches functional
            communication, especially requesting and initiating. Benefits
            have been documented for children and adults with autism and
            other disabilities.
          </p>
        </li>
      </ol>

      <p>
        In short, PECS gives people a concrete, successful way to be
        understood when speech is limited or unavailable. It reduces
        isolation and frustration, builds independence, supports social
        connection, and often opens the door to more communication
        (including speech) over time. This is why picture-based tools
        remain a foundational, practical option for so many individuals and
        families.
      </p>

      <hr className="about-page__divider" />

      <h2>PECS vs. AAC: A Comparison</h2>

      <p>
        PECS (Picture Exchange Communication System) is a structured,
        evidence-based teaching protocol that uses physical picture cards.
        The user learns to pick up a picture and hand it to a communication
        partner in exchange for a desired item, activity, or response. It
        progresses through six phases, starting with simple requests and
        building toward sentence construction and commenting.
      </p>

      <p>
        AAC apps (Augmentative and Alternative Communication apps) are
        digital tools that run on phones, tablets, or computers. Users
        select symbols or words on a screen. Many produce spoken output
        (text-to-speech or recorded voices). Some apps are designed to
        support PECS-style exchanges; others offer more advanced, dynamic
        systems with large vocabularies, core words, sentence building, and
        customization.
      </p>

      <h3>Format &amp; How Communication Happens</h3>

      <div className="about-page__table-wrap">
        <table className="about-page__table">
          <thead>
            <tr>
              <th>Aspect</th>
              <th>Traditional PECS</th>
              <th>AAC Apps</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Medium</td>
              <td>Physical laminated cards or communication book</td>
              <td>Digital symbols on a screen</td>
            </tr>
            <tr>
              <td>Action</td>
              <td>Physically hand a picture to a partner</td>
              <td>Tap or select symbols (may include speech)</td>
            </tr>
            <tr>
              <td>Speech Output</td>
              <td>None (unless the partner speaks the word)</td>
              <td>Usually yes — device "speaks" the message</td>
            </tr>
            <tr>
              <td>Social Demand</td>
              <td>High — requires approaching and exchanging with a person</td>
              <td>Variable — can be used with less physical approach</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>Key Strengths</h3>

      <h4>Traditional PECS strengths</h4>
      <ul>
        <li>Strong focus on initiating communication (the user starts the interaction).</li>
        <li>No technology required — works anywhere, no battery or software issues.</li>
        <li>Pictures are immediately understandable to almost anyone.</li>
        <li>Relatively low material cost once set up.</li>
        <li>Excellent evidence base for teaching early requesting and reducing frustration-related behaviors.</li>
        <li>Builds a tangible sense of successful communication through the physical exchange.</li>
      </ul>

      <h4>AAC app strengths</h4>
      <ul>
        <li>Much larger and more flexible vocabularies that are easy to expand or search.</li>
        <li>Built-in speech output gives the user an independent "voice."</li>
        <li>Easier sentence building, commenting, asking questions, and more complex language.</li>
        <li>Highly customizable (personal photos, voices, layouts, categories).</li>
        <li>Convenient updates — no need to print and laminate new cards.</li>
        <li>Many users (and families) prefer the digital format once basic skills are learned.</li>
        <li>Can support a wider range of communication functions beyond requesting.</li>
      </ul>

      <h3>Limitations</h3>

      <h4>Traditional PECS limitations</h4>
      <ul>
        <li>Vocabulary size is limited by what can physically fit in a book or binder.</li>
        <li>Creating, organizing, and carrying cards takes time and effort.</li>
        <li>No voice output — the communication partner must interpret and often speak the message.</li>
        <li>Can become cumbersome as the user's vocabulary grows.</li>
        <li>Less ideal for rapid conversation or more advanced language needs.</li>
      </ul>

      <h4>AAC app limitations</h4>
      <ul>
        <li>Depends on a charged device and working software.</li>
        <li>Can be expensive (especially dedicated speech-generating devices or premium apps; some free or low-cost options exist).</li>
        <li>May have a steeper initial learning curve for very young or tech-unfamiliar users.</li>
        <li>Risk of over-reliance on the device or reduced physical social approach if not taught carefully.</li>
        <li>Screen time and device durability can be practical concerns.</li>
      </ul>

      <h3>Research Snapshot</h3>
      <p>
        Studies comparing PECS and speech-generating devices/apps generally
        find that both can effectively teach requesting skills. Acquisition
        speed is often similar. Many participants eventually show a
        preference for the digital option once they can use both. Some
        research suggests tablet-based AAC can support broader
        communication gains over longer periods, while PECS remains
        particularly strong for teaching the foundational skill of
        initiating an exchange.
      </p>

      <h3>Practical Bottom Line</h3>
      <ul>
        <li>
          Start with PECS when the main goals are teaching communication
          intent, independent requesting, and reducing frustration in early
          stages — especially if technology access is limited or the user
          benefits from a highly tangible system.
        </li>
        <li>
          Move to (or combine with) AAC apps when the user needs a larger
          vocabulary, speech output, faster message creation, or more
          advanced language functions.
        </li>
        <li>
          Many people successfully use both: PECS (or a low-tech backup)
          alongside a digital app. Free web-based picture communication
          tools can serve as an accessible bridge or everyday option that
          removes cost and device barriers.
        </li>
      </ul>

      <p>
        The best system is the one that matches the individual's motor
        skills, cognitive level, environment, preferences, and the support
        available from family, teachers, or therapists. Trialing options and
        observing what the person actually uses successfully is usually
        more important than choosing one approach exclusively.
      </p>
    </main>
  );
}