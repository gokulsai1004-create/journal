# Journal — Gokul Sai

One entry whenever I actually learn something building. What broke, what it cost,
what I would do differently.

I am Gokul Sai. 16, Hyderabad. The code is in git; this is for the part git does
not keep, which is the thinking, and specifically the parts where I was wrong.

## Three rules

**Write it the week it happens.** A lesson written six months later is a lesson
invented six months later.

**Specifics or nothing.** No "work hard and stay consistent." What broke, what
the number was, what it cost.

**Publish before it is good.** Being cringe is never cringe.

## Writing an entry

Copy `src/content/journal/_template.md`, rename it to the slug you want, write.
That is the whole publishing step: there is no CMS and no database, and Vite
inlines the markdown at build time.

```
---
title: The thing that happened
date: 2026-09-11
dek: One line that makes someone want to read it.
tags: [tools, testing]
draft: true
---
```

`draft: true` shows while running locally so an unfinished entry can be read at
its own URL, and is hidden in a build so it cannot go out by accident. A filename
starting with `_` never appears anywhere.

## Running it

```
npm install
npm run dev        # drafts visible
npm run build      # drafts excluded
npm run lint
```

React, Vite and react-router. The markdown renderer escapes every value it does
not itself emit, and the only source is files in this repo.

## Elsewhere

[github.com/VGokulsai](https://github.com/VGokulsai) — twelve
public repos, all written on my own.

- **painpoint-finder** — searches six public sources for people describing a
  problem. A rate limited source comes back as blocked, never as "nobody has this
  problem."
- **firstwrong** — tells you the first line of your working that is wrong, and
  nothing else.
- **synth** — turns a research paper into a summary where every claim carries its
  page number, then checks that page.
- **outbabyout** — real-life tag with a revive. Rules, a live match console and a
  field map at
  [vgokulsai.github.io/outbabyout](https://vgokulsai.github.io/outbabyout).

gokulsai1004@gmail.com
