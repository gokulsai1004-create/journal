---
title: I left a laptop still for ten minutes
date: 2026-09-11
dek: The noise turned out to be four times the signal, and it killed the design before I had written a line of the game.
tags: [measurement, hardware, bluetooth]
draft: true
---

I want to build a tag game where your phone knows when another player is close.
Before writing any of that, I wanted to know if it was even true, so instead of
building the game I left a laptop and a Bluetooth beacon on a shelf and started
measuring.

## The first ten readings

Nothing moved. Ten consecutive readings off the same still beacon spanned
**24 dBm** — a minimum of -74, a maximum of -50, a standard deviation of 7.7.

Indoors, signal falls roughly 6 dBm per doubling of distance. A 24 dBm spread
with nothing moving is therefore about four doublings of pure ambiguity — the
noise alone covers something like one metre to sixteen. That is the entire
range the game is supposed to distinguish, gone before either phone has taken
a step.

## Averaging looked like it would save it

It looked fixable. Twelve samples of one beacon tightened the standard error of
the median down to about **1.1 dBm**, and two beacons sitting at genuinely
different distances separated by 12 dBm at the median. So I kept going,
because a median that behaves is a design you can still ship. Their raw
ranges still overlapped the whole time.

## Then I left it alone for ten minutes

Ten minutes, completely still, **145 rounds**.

Fan A came back with a median of -68 and an end-to-end spread of **35 dBm**
(-78 to -43), stdev 11.1. Fan B held a tighter median of -76 with an 18 dBm
spread, stdev 6.9. The two medians — two beacons at genuinely different
distances — differ by only **8 dBm**. A single stationary beacon swings 35.
The longer I watched, the worse it got: 24 dBm over ten readings, 35 over 145.

The noise is four times the signal. There is no version of "closer" and
"farther" that survives that ratio on a single reading.

## The cost of a confident answer

Averaging still works, so I worked out what it would actually cost. Separating
an 8 dBm gap against a stdev of 11.1 needs about **31 samples**. At the rate I
was actually seeing them, 14.4 a minute, that is about **two minutes** to get
one answer you can trust.

A tag has to happen in about two seconds. Two minutes against two seconds is a
60x gap, and it is not the kind of gap you close by tuning a threshold. It is
the kind you close by not asking the radio the question.

## What killed the design outright

So the design in my head — phone notices nearby player by signal strength —
cannot work. Not "needs more samples," not "needs a better beacon." The
ambiguity is sitting in the radio, before any code of mine runs, and no amount
of software fixes a measurement that cannot tell two metres from ten.

I had not written the game yet. I had only written `ruler.py` and `soak.py`,
two small scripts to ask the question first. Keeping them is the whole point —
they are the evidence for why the design is what it is, not what it almost was.

What it is instead: a QR code on the target's screen, or an NFC tap. Instant,
cannot be faked from across the street, needs no background advertising,
does not care that addresses rotate, works on every phone, costs no battery.
It also matches the actual game — you are standing in front of the person when
you tag them, not hoping a radio agrees.

On the way out, a twenty-second scan of the room turned up something worse
than the noise: the two ceiling fans advertised steadily the whole time, and
every other device came and went under a rotating address, seen only a few
times each. Phones randomise their Bluetooth address for privacy and do not
advertise continuously unless an app is deliberately doing it in the
background. That is a bigger wall than the RSSI one — it is why contact
tracing needed Apple and Google to build it into the OS rather than shipping
it as an ordinary app — and it still needs verifying properly before I write
a line of that code.

## What I am taking from this

I did not build the tag game and then find out the radio could not carry it.
I measured the radio first, on a shelf, with nothing running but a stopwatch,
and it told me the design was dead in an afternoon instead of telling me after
a month of building the rest of the app around it.

That is the whole value of taking the measurement before the thing it is
measuring exists: the answer can still be no, and no costs you an afternoon
instead of a month.
