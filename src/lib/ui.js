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
    // rewrites the whole attribute on any re-render, so a class added here got
    // wiped the moment the keyboard walk changed a highlight, and two entries
    // silently went invisible. React does not manage data-in, so it survives.
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
    items.forEach((el) => seen.observe(el));
    return () => seen.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/** Walk the list with the keyboard and open with enter.
 *
 *  Rare enough that people notice, and the reason it is here rather than as a
 *  flourish: a list you can only reach with a mouse is a list some people
 *  cannot reach at all.
 */
export function useKeys(count, onOpen) {
  const [at, setAt] = useState(-1);

  useEffect(() => {
    const typing = (el) =>
      el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable);

    const onKey = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey || typing(document.activeElement)) return;
      const down = e.key === "ArrowDown" || e.key === "j";
      const up = e.key === "ArrowUp" || e.key === "k";
      if (!down && !up && e.key !== "Enter") return;
      if (count === 0) return;

      if (e.key === "Enter") {
        if (at >= 0) {
          e.preventDefault();
          onOpen(at);
        }
        return;
      }
      e.preventDefault();
      setAt((was) => {
        const next = was < 0 ? (down ? 0 : count - 1) : was + (down ? 1 : -1);
        return Math.max(0, Math.min(count - 1, next));
      });
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [count, at, onOpen]);

  useEffect(() => {
    if (at < 0) return;
    const el = document.querySelectorAll("[data-walk]")[at];
    if (el) el.scrollIntoView({ block: "nearest",
      behavior: stillness() ? "auto" : "smooth" });
  }, [at]);

  return at;
}
