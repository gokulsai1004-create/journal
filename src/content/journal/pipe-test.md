---
title: Testing the pipe
date: 2026-09-06
by: Gokul Sai
draft: true
blurb: A throwaway entry that exists to prove the machinery works.
---

This entry exists to test the pipeline, not to be read. Delete it once a real
one replaces it.

## What it is checking

The point is that one file becomes two things without either being retyped.

- A page on the site, from `build.py`
- An email, from `draft.py`, with the styles inlined so a mail client cannot
  strip them

Bold looks like **this**, italic like *this*, and a link like
[this one](https://example.com).

> A quote, to check the left rule survives the trip into an inbox.

Code should keep its spacing:

```
py -3 draft.py pipe-test
```

And `inline code` should stay readable in the middle of a sentence.

---

If every one of those looks right in a real mail client, the machinery is done
and the only thing left is having something to say.
