import { BrowserRouter, Routes, Route, Link, useParams } from "react-router-dom";
import { entries, published, bySlug } from "./lib/journal.js";
import "./styles.css";

const SITE = "Gokul Sai";
const TAGLINE =
  "One entry whenever I actually learn something building. What broke, what " +
  "it cost, what I would do differently.";

// Drafts are visible while running locally so an unfinished entry can be read
// at its own URL, and hidden in a build so it cannot go out by accident.
const visible = import.meta.env.DEV ? entries : published;

function Index() {
  return (
    <div className="wrap">
      <header className="mast">
        <h1>{SITE}</h1>
        <p>{TAGLINE}</p>
      </header>

      {visible.length === 0 ? (
        <p className="empty">
          Nothing written yet. That is an empty folder, not a failure to read
          it.
        </p>
      ) : (
        visible.map((entry) => (
          <Link className="entry-link" key={entry.slug} to={`/e/${entry.slug}`}>
            <div className="t">
              {entry.title}
              {entry.draft && <span className="flag">draft</span>}
            </div>
            {entry.dek && <div className="d">{entry.dek}</div>}
            <div className="m">
              {[entry.date, `${entry.minutes} min`].filter(Boolean).join("  ·  ")}
            </div>
          </Link>
        ))
      )}

      <footer>Plain markdown files in a repo. No CMS, no database.</footer>
    </div>
  );
}

function Entry() {
  const { slug } = useParams();
  const entry = bySlug(slug);

  if (!entry) {
    // Say which one is missing. "Not found" with no subject is a dead end.
    return (
      <div className="wrap">
        <header className="mast">
          <Link className="back" to="/">← {SITE}</Link>
          <h1>No entry called “{slug}”</h1>
          <p>
            It may be a draft that is not in this build, or the link may be
            wrong. Either way nothing was lost.
          </p>
        </header>
      </div>
    );
  }

  return (
    <div className="wrap">
      <header className="mast">
        <Link className="back" to="/">← {SITE}</Link>
      </header>
      <article>
        <h1>{entry.title}</h1>
        <p className="byline">
          {[entry.date, `${entry.minutes} min`].filter(Boolean).join("  ·  ")}
        </p>
        {/* The markdown renderer escapes every value it does not itself emit,
            and the only source is files in this repo. */}
        <div dangerouslySetInnerHTML={{ __html: entry.html }} />
      </article>
      <footer>
        <Link to="/">← everything else</Link>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/e/:slug" element={<Entry />} />
        <Route path="*" element={<Index />} />
      </Routes>
    </BrowserRouter>
  );
}
