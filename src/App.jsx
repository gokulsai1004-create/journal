import { BrowserRouter, Routes, Route, Link, useParams } from "react-router-dom";
import { useState } from "react";
import { entries, published, bySlug } from "./lib/journal.js";
import { byDate, allTags } from "./lib/built.js";
import { useTheme, useProgress, useReveal } from "./lib/ui.js";
import { Rise, Drift } from "./lib/Type.jsx";
import "./styles.css";

const SITE = "Gokul Sai";
const TAGLINE =
  "One entry whenever I actually learn something building. What broke, what " +
  "it cost, what I would do differently.";

// Drafts are visible while running locally so an unfinished entry can be read
// at its own URL, and hidden in a build so it cannot go out by accident.
const visible = import.meta.env.DEV ? entries : published;

function Index() {
  useReveal();

  return (
    <div className="wrap">
      <Switch />
      <header className="mast" data-reveal>
        <h1><Rise text={SITE} /></h1>
        <p><Drift text={TAGLINE} delay={0.42} /></p>
      </header>

      {visible.length === 0 ? (
        <p className="empty">
          Nothing written yet. That is an empty folder, not a failure to read
          it.
        </p>
      ) : (
        visible.map((entry) => (
          <Link
            className="entry-link"
            key={entry.slug}
            to={`/e/${entry.slug}`}
            data-reveal
          >
            <div className="t">
              <span className="arrow" aria-hidden="true">&rarr;</span>
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
  // Keyed on the filter so a newly shown tool arrives rather than appears.
  useReveal([tag]);

  return (
    <div className="wrap">
      <Switch />
      <header className="mast">
        <Link className="back" to="/">← {SITE}</Link>
        <h1><Rise text="Everything I have built" step={0.026} /></h1>
        <p>
          <Drift
            text="Ten public repositories, all written on my own, oldest at the bottom. The first one is from August."
            delay={0.5}
          />
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
        <article className="tool" key={tag + t.name} data-reveal>
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

const MODES = ["auto", "light", "dark"];

function Switch() {
  const [theme, setTheme] = useTheme();
  const next = MODES[(MODES.indexOf(theme) + 1) % MODES.length];
  return (
    <button
      className="switch"
      onClick={() => setTheme(next)}
      title={`Theme: ${theme}. Click for ${next}.`}
      aria-label={`Theme: ${theme}. Switch to ${next}.`}
    >
      {theme}
    </button>
  );
}

function Entry() {
  const { slug } = useParams();
  const entry = bySlug(slug);
  const read = useProgress();

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
      <div className="read" style={{ transform: `scaleX(${read})` }} />
      <Switch />
      <header className="mast">
        <Link className="back" to="/">← {SITE}</Link>
      </header>
      <article>
        <h1><Rise text={entry.title} step={0.016} /></h1>
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
    // The router has to know it is living under a prefix, or every link it
    // builds points at the root of the domain and leaves the site.
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/e/:slug" element={<Entry />} />
        <Route path="/built" element={<Built />} />
        <Route path="*" element={<Index />} />
      </Routes>
    </BrowserRouter>
  );
}
