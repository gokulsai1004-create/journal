import { BrowserRouter, Routes, Route, Link, useParams } from "react-router-dom";
import { useState } from "react";
import { entries, published, bySlug } from "./lib/journal.js";
import { byDate, allTags } from "./lib/built.js";
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

      <footer>
        Plain markdown files in a repo. No CMS, no database.
        {"  ·  "}
        <Link className="more" to="/built">Everything I have built →</Link>
      </footer>
    </div>
  );
}

function Built() {
  // null means everything. Categories filter the list rather than hiding it
  // behind a menu, because there are ten things and a menu would be the
  // bigger interface.
  const [tag, setTag] = useState(null);
  const shown = tag ? byDate.filter((t) => t.tags.includes(tag)) : byDate;

  return (
    <div className="wrap">
      <header className="mast">
        <Link className="back" to="/">← {SITE}</Link>
        <h1>Everything I have built</h1>
        <p>
          Ten public repositories, all written on my own, oldest at the bottom.
          The first one is from August.
        </p>
      </header>

      <div className="tags">
        <button
          className={"tag" + (tag === null ? " on" : "")}
          onClick={() => setTag(null)}
        >
          all <span>{byDate.length}</span>
        </button>
        {allTags.map(([name, count]) => (
          <button
            key={name}
            className={"tag" + (tag === name ? " on" : "")}
            onClick={() => setTag(tag === name ? null : name)}
          >
            {name} <span>{count}</span>
          </button>
        ))}
      </div>

      {shown.map((t) => (
        <article className="tool" key={t.name}>
          <div className="tool-head">
            <h2>
              <a href={t.url}>{t.name}</a>
            </h2>
            <div className="m">
              {t.date}
              {"  ·  "}
              {t.lang}
            </div>
          </div>
          <p>{t.what}</p>
          {t.note && <p className="note">{t.note}</p>}
          <div className="m links">
            <a href={t.url}>source</a>
            {t.live && <a href={t.live}>open it</a>}
          </div>
        </article>
      ))}

      <footer>
        <Link to="/">← the writing</Link>
      </footer>
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
        <Route path="/built" element={<Built />} />
        <Route path="*" element={<Index />} />
      </Routes>
    </BrowserRouter>
  );
}
