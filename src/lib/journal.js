// Every entry, read from the markdown files at build time.
//
// import.meta.glob with eager+raw means Vite inlines the files into the bundle,
// so there is no fetch at runtime and no CMS anywhere. Writing an entry is
// adding a file; that is the whole publishing step.

import { markdown, words } from "./markdown.js";

const files = import.meta.glob("../content/journal/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
});

// Deliberately small: a YAML parser is a dependency, and entries only ever
// carry a handful of flat string fields.
function frontmatter(raw) {
  const meta = {};
  let body = raw;
  if (raw.startsWith("---")) {
    const parts = raw.split("---");
    if (parts.length >= 3) {
      body = parts.slice(2).join("---");
      for (const line of parts[1].trim().split("\n")) {
        const at = line.indexOf(":");
        if (at > 0) meta[line.slice(0, at).trim()] = line.slice(at + 1).trim();
      }
    }
  }
  return { meta, body: body.trim() };
}

export const entries = Object.entries(files)
  .map(([path, raw]) => {
    const slug = path.split("/").pop().replace(/\.md$/, "");
    const { meta, body } = frontmatter(raw);
    return {
      slug,
      title: meta.title || slug,
      date: meta.date || "",
      dek: meta.dek || meta.blurb || "",
      tags: (meta.tags || "").replace(/[[\]]/g, "").split(",")
        .map((t) => t.trim()).filter(Boolean),
      // A file starting with _ is a template. It is filtered out below rather
      // than being allowed to appear anywhere it might be mistaken for writing.
      template: slug.startsWith("_"),
      draft: String(meta.draft).toLowerCase() === "true",
      minutes: Math.max(1, Math.round(words(body) / 200)),
      body,
      html: markdown(body),
    };
  })
  .filter((entry) => !entry.template)
  .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

export const published = entries.filter((entry) => !entry.draft);

export const bySlug = (slug) => entries.find((entry) => entry.slug === slug);
