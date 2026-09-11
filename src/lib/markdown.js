// Enough markdown for prose, and deliberately not a full implementation.
//
// The same rules as the Python renderer in ../builders/build.py, on purpose:
// one entry has to look the same on the site and in the email, and two
// different parsers drift apart the week nobody is watching.

const escapeMap = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" };
const escape = (text) => String(text ?? "").replace(/[&<>"]/g, (c) => escapeMap[c]);

// Inline, minus code spans, which are handled separately so a snippet showing
// `<div>` renders as text instead of becoming one.
function inlineRest(chunk) {
  return escape(chunk)
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/(?<!\w)\*([^*\n]+)\*(?!\w)/g, "<em>$1</em>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
}

function inline(text) {
  const out = [];
  let index = 0;
  for (const match of text.matchAll(/`[^`]+`/g)) {
    out.push(inlineRest(text.slice(index, match.index)));
    out.push(`<code>${escape(match[0].slice(1, -1))}</code>`);
    index = match.index + match[0].length;
  }
  out.push(inlineRest(text.slice(index)));
  return out.join("");
}

const BULLET = /^([-*]|\d+[.)])\s+/;
const BREAKS = /^(#{1,4}\s|>|```|[-*]\s|\d+[.)]\s|-{3,}$)/;

export function markdown(source) {
  const lines = String(source ?? "").replace(/\r\n/g, "\n").split("\n");
  const out = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed.startsWith("```")) {
      i += 1;
      const block = [];
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        block.push(lines[i]);
        i += 1;
      }
      i += 1;
      out.push(`<pre><code>${escape(block.join("\n"))}</code></pre>`);
      continue;
    }

    if (!trimmed) { i += 1; continue; }

    if (/^-{3,}$/.test(trimmed)) { out.push("<hr>"); i += 1; continue; }

    const heading = /^(#{1,4})\s+(.*)$/.exec(trimmed);
    if (heading) {
      // h1 is the entry title, so the body starts at h2.
      const level = heading[1].length + 1;
      out.push(`<h${level}>${inline(heading[2])}</h${level}>`);
      i += 1;
      continue;
    }

    if (trimmed.startsWith(">")) {
      const block = [];
      while (i < lines.length && lines[i].trim().startsWith(">")) {
        block.push(lines[i].trim().replace(/^>+\s?/, ""));
        i += 1;
      }
      out.push(`<blockquote>${inline(block.join(" "))}</blockquote>`);
      continue;
    }

    if (BULLET.test(trimmed)) {
      const ordered = /^\d+[.)]\s+/.test(trimmed);
      const items = [];
      while (i < lines.length && BULLET.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(BULLET, ""));
        i += 1;
        // An item that wraps onto an indented line is still that item. Without
        // this the tail becomes its own paragraph underneath the list.
        while (i < lines.length && lines[i].trim() && /^[ \t]/.test(lines[i])
               && !BULLET.test(lines[i].trim())) {
          items[items.length - 1] += " " + lines[i].trim();
          i += 1;
        }
      }
      const tag = ordered ? "ol" : "ul";
      out.push(`<${tag}>${items.map((t) => `<li>${inline(t)}</li>`).join("")}</${tag}>`);
      continue;
    }

    const block = [];
    while (i < lines.length && lines[i].trim() && !BREAKS.test(lines[i].trim())) {
      block.push(lines[i].trim());
      i += 1;
    }
    out.push(`<p>${inline(block.join(" "))}</p>`);
  }

  return out.join("\n");
}

export function words(source) {
  return String(source ?? "").trim().split(/\s+/).filter(Boolean).length;
}
