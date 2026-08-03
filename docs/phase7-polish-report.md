# Verk — Phase 7 Polish Report
> Companion to `docs/20-editorial-polish-audit.md`. That document is the
> log; this one is the reasoning, the trade-offs, and — at the end — the
> ruthless self-critique the brief explicitly asked for.

---

## Creative reasoning

The brief's own instruction was the right one to take literally: "if
something already works, ask only: can it become more elegant?" Phases 5
and 6 were construction phases — a color rhythm rebuilt from nothing, a
mobile experience rebuilt from nothing, real bugs found and fixed in both.
Phase 7 is not a third construction phase wearing a different name. Coming
into it with a quota of changes to hit would have meant inventing problems
— exactly what "no complexity for its own sake" forbids. The honest
creative posture here was closer to a copy editor's than a designer's:
read closely, mark what's actually wrong, leave everything else exactly
where the last two phases of real work put it.

## Design reasoning

The two fixes made — the lime hover color and the duplicated easing curve
— share the same shape: two things that were supposed to be identical had
quietly become not-quite-identical. That specific failure mode (drift
between values that should be one value) is the purest version of what
"visual consistency" means in this brief: not "does everything look nice,"
but "does the system only say one thing where it's supposed to." Both
fixes resolve to a single token now, which means the next person who
tunes the lime hover or the primary easing does it once, in one place, and
it's correct everywhere instead of correct in two places and off by a
rounding error in a third.

## Engineering reasoning

Neither fix touched a value a visitor would consciously register — that
was the point. `#D4FF00` vs. `#CEFF00` and `var(--ease-out-expo)` vs. its
own literal expansion are both zero-visual-diff changes. The value of
fixing them isn't in tomorrow's screenshot; it's in preventing next
month's real drift, when someone tunes one occurrence under deadline
pressure and doesn't know three others exist. That's a maintainability
argument, not a design argument — worth naming honestly rather than
dressing up as a perceptual improvement it isn't.

## Trade-offs

Time this phase spent verifying two apparent bugs were **not** bugs (the
skip-link, the nav/headline overlap) instead of "fixing" them outright was
time not spent hunting for a third or fourth genuine micro-refinement.
That trade was made deliberately: shipping a change that "fixes" a
non-problem is worse than shipping no change, because it adds code whose
only job is to silence a false alarm, which is its own kind of complexity
the brief explicitly forbids ("no complexity for its own sake"). Confirming
a non-bug and writing it down is the correct output of a rigorous audit,
even though it produces zero lines of shipped CSS.

---

## What was deliberately NOT touched, and why

**Services' "+" toggle marker occasionally wraps onto its own line on
narrow phones**, specifically for "Integraciones CRM" around 375–390px —
the marker is a `::after` pseudo-element with a natural break opportunity
before it, and at that exact name length and viewport width, the browser's
line-breaking puts the "+" alone on the next line. A structurally clean
fix (gluing the marker to the last word without affecting the name's own
ability to wrap when it needs to) would require either JavaScript
measurement or a markup change — both disproportionate to a cosmetic
wobble that appears on one item, at one width, for one language's word
length. Documented here, deliberately left alone, rather than solved with
a hack (a non-breaking space glued in copy, a magic-number `min-width`)
that the brief's own "avoid hacks" instruction from the mobile phase
already ruled out as the wrong kind of fix.

**The Hero's reveal timing, Método's stagger, Sistemas' disclosure
animation, and the CTA's silence beat** were all re-watched, repeatedly,
against the brief's own questions ("too early, too late, too fast, too
slow"). None produced a concrete, defensible case for a different number.
Changing a duration because a phase brief asks you to look for something
to change, without a specific reason the new number is better, is the
"software engineer" mode of thinking this phase explicitly asked to set
aside.

**No dependency, component, section, or animation was added.** The
brief's forbidden list was treated as load-bearing, not aspirational.

---

## Final self-critique

The brief asked to attack the work, not defend it. Here's the attack,
aimed at Phases 5–7 as they stand today, not just at this phase in
isolation:

**What still feels slightly generic:** the mobile hamburger-to-X icon
morph (Phase 6). It's correctly built and accessible, but it is also the
single most common mobile-nav pattern that exists — the one place this
site currently looks like "a well-built site" rather than "a Verk-specific
decision." Every reference agency in this project's own moodboard would
recognize it immediately as competent, not as theirs. It was not touched
this phase because replacing it would be an addition/redesign, not a
refinement — but it's the honest answer to "what's still generic," and
it's worth a real design pass in a future phase that's actually scoped for
that kind of invention.

**What still feels slightly unfinished:** Sistemas on mobile, named
already in the Phase 6 report and still true — a long, linear scroll
through six chapters and ten systems. It is not broken, and the
alternative (hiding content behind an undiscovered horizontal swipe) was
correctly rejected in Phase 6 for being a worse failure mode. But "the
alternative would be worse" is different from "this is the strongest
possible version," and it's worth naming that gap honestly rather than
letting the earlier rejection stand in for a real solution.

**What still distracts from the content:** nothing found this pass that
wasn't already named. This is either a sign the last two phases of real
work actually landed, or a sign this pass didn't look hard enough — the
honest position, given the scope of what Phases 5–6 already rebuilt, is
the former, but it's stated as a claim that a future audit should be free
to disprove, not as a closed case.

**Would Dieter Rams keep the two things fixed this phase?** He'd never
have let them drift apart in the first place — which is exactly the
argument for having fixed them now rather than leaving "close enough."

---

## Validation

`astro check` — 0 errors, 0 warnings, 0 hints.
`npm run build` — clean.
Desktop (1440px) and mobile (390px) re-screenshotted after both fixes;
no regression in either.

Stopping here, per the brief's own stop condition — no new sections, no
CMS, no i18n, no backend. Waiting for review.
