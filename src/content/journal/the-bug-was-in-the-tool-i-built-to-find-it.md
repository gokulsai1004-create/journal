---
title: The bug was in the tool I built to find the bug
date: 2026-09-11
dek: A check that cannot fail is not a check. I found that out five times in one day.
tags: [tools, testing, measurement]
---

A few days ago I built something called firstwrong. You paste in your homework
working, one step per line, and it tells you the first line that is wrong. That
is all it tells you. No solution, no hint, no next step. You go back and look at
that line yourself, which is the part that makes it stick.

The whole point of it is a deletion. The model has to solve the problem
internally to compare, but only three values are ever read out of its reply. Any
solution it writes goes into a variable and out of scope, unread. There is no
code path that prints it.

Then I ran a review over my own repos and found that firstwrong had a bug.

When the model's answer could not be read, for any reason, firstwrong printed
**"No wrong line found."**

That is a pass. That is the tool telling a student their working is fine,
because it could not read the reply. It is exactly the failure the tool exists
to prevent, sitting inside the tool built to prevent it.

## Then it turned out to be five

So I went looking, and found the same shape in four more things I had written.

**apisurface** compares two versions of an npm package and tells you what got
removed. It printed `0 changes, this is a real zero` for @types/node while
actually reading 1 file out of 89. It was not wrong about the file it read. It
was wrong about how many files there were.

**skillcheck** counts which of my installed skills I have ever used. If the
folder it scans is missing or unreadable, `os.walk` returns nothing, so it
printed `60 skills installed, 0 ever used, across 0 sessions` and exited 0. That
is byte for byte what it prints on a machine that genuinely never used a skill.

**mdwatch** watches an agent workspace and tells me what needs attention. A
`tasks.json` with a byte order mark at the front made it print **"No open
tasks."** while a task inside that file was sitting at blocked.

**synth** turns a research paper into a summary where every claim carries its
page number. It was silently truncating papers, because the tool it uses to read
a page returns nothing both for a blank page in the middle and for a page past
the end. A paper with a blank page four became a three page paper. Then it
accused the model of citing pages that do not exist.

Five for five. Every tool I have written that reads something and reports a
count had the same bug, and I did not know until I looked.

## The thing they all get wrong

A zero means two completely different things and my code kept printing one
symbol for both.

**Nothing was there** is a result. **I could not look** is not a result. A
program that prints them the same way is lying, and the worst part is that it
lies most confidently exactly when it has failed.

I knew this. I had written it down as a rule before any of this happened.
painpoint-finder, the first real thing I built, carries a blocked state in the
type system specifically so a rate limited source can never read as "nobody has
this problem." I wrote that on purpose, was pleased with it, and then wrote the
same bug five more times in a row.

Knowing a rule and having the reflex are not the same thing, and I found that
out by being wrong five times in one afternoon.

## What I actually did about it

Fixed all five. Then wrote 124 tests, and this is the part I would not have
bothered with a month ago: **every single one was proved by breaking the code
first and checking that the test failed.**

That mattered more than it sounds. Two of the tests I wrote were passing without
testing anything. One of them was comparing an empty list to an empty list. It
was green, it looked like coverage, and it checked nothing at all. I only found
it because I went back and broke the thing it was supposed to be watching, and
the test stayed green.

A passing test means nothing until you have watched it fail.

## It kept happening all day

Later the same day I measured Bluetooth signal strength, because I want to build
a tag game where your phone knows when another player is close. I left a laptop
and a beacon completely still for ten minutes and took 145 readings.

The readings spanned **35 dBm** with nothing moving. Two beacons at genuinely
different distances differed by 8. So the noise is four times the signal, and a
single reading cannot tell two metres from ten. Working out what it would cost to
average past that: about 31 samples, which is two minutes. A tag has to happen in
about two seconds.

So the design I had in my head cannot work, and it cost me an afternoon instead
of a month. Same lesson in different clothes. A reading that cannot tell two
metres from ten is a measurement that does not know the difference between a
result and a failure to look.

And then, in the evening, I put a map into the game and checked it on my laptop
and it looked perfect. I opened it on my phone and every tile said **API KEY
REQUIRED** across it. The map service had started requiring a key. My laptop had
the old tiles cached, so my check passed on evidence that was already stale.

Three times in one day, in three completely different places: I checked
something, the check came back clean, and the check was clean because it had not
actually looked.

## What I am taking from this

I do not think the lesson is "be more careful." I was being careful.

The lesson is that **a check that cannot fail is not a check**, and you only find
out which kind you have by trying to break it. Breaking the code to see if the
test notices. Leaving the hardware still to see how much it lies. Opening it on a
device that has never seen it before.

Everything I ship from now on gets that treatment, and I am writing this down
partly so I cannot pretend later that I already knew.
