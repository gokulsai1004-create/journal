// Everything I have built, with the date it started and what it actually does.
//
// Dates are the repository creation dates, not guesses. Descriptions carry a
// number wherever there is one, because "a tool that searches sources" and
// "searches six sources and reports BLOCKED rather than a false zero" are
// different claims and only one of them is checkable.
//
// Adding one is adding an object. Newest first is done by sorting on `date`,
// so the order here does not matter.

export const tools = [
  {
    name: "outbabyout",
    date: "2026-09-11",
    lang: "HTML, Python",
    tags: ["games", "web"],
    what: "Real-life tag with a revive, so nobody is ever out for good. Two teams, a twenty minute timer, most players standing wins. Three pages: the rules, a live match console that enforces them as you play, and a field map you can put anywhere on earth.",
    note: "The rules exist in Python and in JavaScript, so twelve tests lift the JavaScript verbatim out of the page and check the two still agree.",
    url: "https://github.com/gokulsai1004-create/outbabyout",
    live: "https://gokulsai1004-create.github.io/outbabyout",
  },
  {
    name: "firstwrong",
    date: "2026-09-09",
    lang: "Python",
    tags: ["learning"],
    what: "Tells you the first line of your homework working that is wrong, and nothing else. No solution, no hint. The model has to solve it internally to compare, but only three values are ever read out of the reply, so the answer is unreachable in the code rather than politely withheld.",
    note: "44 test cases. 25 of 25 on ordinary problems, 16 of 19 on a hard set written blind against it.",
    url: "https://github.com/gokulsai1004-create/firstwrong",
  },
  {
    name: "synth",
    date: "2026-09-09",
    lang: "Python",
    tags: ["research"],
    what: "Turns a research paper into a summary where every claim carries its page number, then checks that page. Not whether the claim is true, only whether it can be found where it says. Nothing in it can mark a claim false, so nothing does.",
    note: "74 tests. One file, no dependencies, $0.0017 a call. Attention Is All You Need: 41 claims, 0 dropped anchors.",
    url: "https://github.com/gokulsai1004-create/synth",
  },
  {
    name: "skillcheck",
    date: "2026-09-09",
    lang: "Python",
    tags: ["agents"],
    what: "Counts which of the skills installed on your machine have ever actually been used, and scores them against whatever you are about to build. Installing a skill feels like acquiring a capability. It is not.",
    note: "The number that started it: 60 installed, 5 ever used, across 230 sessions. 34 tests.",
    url: "https://github.com/gokulsai1004-create/skillcheck",
  },
  {
    name: "mdwatch",
    date: "2026-09-09",
    lang: "Python",
    tags: ["agents"],
    what: "A read-only terminal watch on an agent workspace, which speaks up only when something needs a human. The workspace depends on a single writer, so this one never writes to it at all.",
    note: "Read-only was proved, not promised: the whole thing copied, write permission stripped from all 244 files, then run. 16 tests.",
    url: "https://github.com/gokulsai1004-create/mdwatch",
  },
  {
    name: "specextract",
    date: "2026-09-09",
    lang: "Python",
    tags: ["documents"],
    what: "Pulls the checkable spec out of a document and says which parts are missing. The missing list is the point: a spec with a hole in it should read as a spec with a hole in it, never as a shorter spec.",
    note: "50 tests.",
    url: "https://github.com/gokulsai1004-create/specextract",
  },
  {
    name: "apisurface",
    date: "2026-09-05",
    lang: "Python",
    tags: ["measurement"],
    what: "Compares two versions of an npm package and tells you what was removed from its public API, read from the published code rather than from a changelog nobody wrote.",
    note: "An audit found it printing 0 changes, this is a real zero while reading 1 file out of 89. The fix was deleting 84 lines. 36 tests.",
    url: "https://github.com/gokulsai1004-create/apisurface",
  },
  {
    name: "publicsearch",
    date: "2026-09-01",
    lang: "Python",
    tags: ["research"],
    what: "The source layer on its own: five public sources, no API key, and a blocked source reported as blocked. Pulled out of painpoint-finder so other things could use it.",
    note: "Honest state: it is still a copy rather than a real extraction, and the two need to agree on one home.",
    url: "https://github.com/gokulsai1004-create/publicsearch",
  },
  {
    name: "painpoint-finder",
    date: "2026-08-30",
    lang: "Python",
    tags: ["research"],
    what: "Give it a problem and it searches six public sources for people describing that problem right now, then pulls out whoever already shipped it. It drafts an opener. It never sends one.",
    note: "A rate limited source comes back as BLOCKED, never as nobody has this problem, and that difference is carried in the type system so a caller cannot forget it. 126 tests.",
    url: "https://github.com/gokulsai1004-create/painpoint-finder",
  },
  {
    name: "cloud-pet",
    date: "2026-08-12",
    lang: "Python",
    tags: ["desktop"],
    what: "A pixel companion that sits on top of the screen, changes mood with what the machine is doing, and answers three questions about my week: what matters today, who has not replied, and what I shipped.",
    note: "Zero dependencies. It asks Windows directly through ctypes instead of installing anything. Started from Matthew Park's costpriority; the difference is that the ranks are exclusive, so only one thing can be P0.",
    url: "https://github.com/gokulsai1004-create/cloud-pet",
  },
];

export const byDate = [...tools].sort((a, b) => (a.date < b.date ? 1 : -1));

/** Every tag in use, most used first. The categories, derived rather than
 *  maintained by hand, so a tag can never exist in the list and nowhere else. */
export const allTags = Object.entries(
  tools.reduce((count, t) => {
    for (const tag of t.tags) count[tag] = (count[tag] || 0) + 1;
    return count;
  }, {})
).sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1));
