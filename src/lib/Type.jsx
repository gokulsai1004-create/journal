// Text that arrives instead of appearing.
//
// Each character or word gets its own span behind an overflow-hidden line, and
// rises into place a beat after the one before it. The stagger is what makes it
// read as one movement rather than a lot of small ones.
//
// Every piece of this is off when prefers-reduced-motion is set, and off means
// the text is simply there, not that it fades slower.

import { Fragment } from "react";
import { stillness } from "./ui.js";

/** A heading whose letters rise from behind the line, one after another. */
export function Rise({ text, className = "", step = 0.038, delay = 0 }) {
  const still = stillness();
  // Words are kept whole so a narrow screen never breaks a word in half, and
  // the spaces between them stay real spaces rather than empty spans.
  const words = text.split(" ");
  let n = 0;

  return (
    <span className={"rise " + className} aria-label={text}>
      {words.map((word, w) => (
        <Fragment key={w}>
        <span className="rise-word" aria-hidden="true">
          {[...word].map((ch, i) => {
            const at = delay + n++ * step;
            return (
              <span className="rise-mask" key={i}>
                <span
                  className="rise-ch"
                  style={still ? undefined : { transitionDelay: `${at}s` }}
                >
                  {ch}
                </span>
              </span>
            );
          })}
        </span>
        {/* A real space, not a CSS margin. The gap has to survive being read
            rather than looked at: copy the heading, or open it in reader mode,
            and a margin leaves you with one long unbroken word. */}
        {w < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </span>
  );
}

/** A paragraph whose words fade up in sequence. Softer than Rise, for the
 *  line under a heading that should follow it rather than compete. */
export function Drift({ text, className = "", step = 0.022, delay = 0 }) {
  const still = stillness();
  return (
    <span className={"drift " + className} aria-label={text}>
      {text.split(" ").map((word, i) => (
        <span
          className="drift-word"
          key={i}
          aria-hidden="true"
          style={still ? undefined : { transitionDelay: `${delay + i * step}s` }}
        >
          {word}
          {i < text.split(" ").length - 1 ? " " : ""}
        </span>
      ))}
    </span>
  );
}
