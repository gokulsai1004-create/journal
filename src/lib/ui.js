// Small pieces of behaviour, kept out of App.jsx so the pages stay readable.
//
// Everything here checks prefers-reduced-motion and does nothing when it is
// set. Motion that cannot be turned off is not a design decision, it is an
// imposition, and somebody who gets motion sick should still be able to read.

import { useEffect, useState } from "react";

export const stillness = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Light or dark, remembered. The palette already had both; there was just no
 *  way to choose, which meant a reader in a bright room had no option. */
export function useTheme() {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("theme") || "auto";
    } catch {
      // A private window throws on localStorage. That is a missing preference,
      // not a broken page: fall back to following the system.
      return "auto";
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "auto") root.removeAttribute("data-theme");
    else root.setAttribute("data-theme", theme);
    try {
      localStorage.setItem("theme", theme);
    } catch {
      /* nothing to do; the page still renders correctly */
    }
  }, [theme]);

  return [theme, setTheme];
}

/** How far down the article you are, 0 to 1. Drawn as a hairline at the top,
 *  because on a long entry "am I nearly there" is a real question. */
export function useProgress() {
  const [at, setAt] = useState(0);

  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      const doc = document.documentElement;
      const run = doc.scrollHeight - doc.clientHeight;
      setAt(run > 0 ? Math.min(1, doc.scrollTop / run) : 0);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return at;
}

/** Fade and lift each item as it arrives. One observer for the whole page. */
export function useReveal(deps = []) {
  useEffect(() => {
    const items = document.querySelectorAll("[data-reveal]");
    // Marked with an attribute rather than a class. React owns className and
    // rewrites the whole attribute on any re-render, so a class added here gets
    // wiped the next time anything on the page changes state, and the element
    // silently goes back to invisible. React does not manage data-in.
    const show = (el) => el.setAttribute("data-in", "");
    if (stillness() || !("IntersectionObserver" in window)) {
      items.forEach(show);
      return;
    }
    const seen = new IntersectionObserver(
      (rows) => {
        rows.forEach((row) => {
          if (row.isIntersecting) {
            show(row.target);
            seen.unobserve(row.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
    );

    // Anything already on screen is shown now, without waiting to be told. An
    // observer only reports a crossing, so a masthead that was never below the
    // fold has no crossing to report, and a page that is not being painted
    // computes no intersections at all. Either way the reader gets a blank
    // heading, which is the worst possible failure for a thing whose only job
    // is to make text appear.
    //
    // Measured here rather than inside requestAnimationFrame, because a frame
    // callback does not run while a tab is unpainted either, so the rescue was
    // waiting on the same thing it was rescuing. Layout is already committed by
    // the time an effect runs, so just ask.
    items.forEach((el) => {
      const box = el.getBoundingClientRect();
      if (box.top < window.innerHeight && box.bottom > 0) show(el);
      else seen.observe(el);
    });

    return () => seen.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
