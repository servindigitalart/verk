# System 04 — UX Analyzer

## Problem

Design decisions made from memory or inspiration boards are subjective and unfalsifiable. Before designing anything premium, there has to be a way to know — structurally, not impressionistically — how premium digital experiences are actually built: their layout rhythm, motion stack, navigation patterns, hover and scroll behavior.

## System

UX Analyzer is an internal research platform that reverse-engineers premium websites. It automates a full inspection: crawling a site, capturing desktop and mobile screenshots and section-level captures, extracting DOM and computed styles, detecting the animation/motion stack and framework in use, and running AI-assisted visual interpretation over the result. The output is a structured dataset — JSON, Markdown reports, screenshots, GIF recordings — that can directly inform a future design decision instead of a guess.

## Architecture

- **Presentation** — none (internal CLI/report tool, no public interface)
- **Logic** — Python, FastAPI
- **Processing** — Playwright browser automation (crawling, screenshot capture, section detection)
- **AI** — Gemini (visual analysis, design interpretation, brand analysis, motion analysis)
- **Storage** — local structured output: JSON, Markdown, screenshots, GIFs, technical reports

## Current State

Investigación. No public URL — this is an internal tool, run locally, that produces a design-research package rather than a shipped product.

## Capabilities Demonstrated

- Building internal tooling, not just client-facing product
- Combining browser automation with AI to turn qualitative observation into structured data
- Reverse-engineering complex systems methodically, rather than approximating them
- Design research as a discipline that precedes design work — Verk studies before it builds

## Technologies

Python, FastAPI, Playwright, Gemini

## Public URL

None — internal tool.

## Logo Location

None. UX Analyzer has no dedicated logo in `public/project-logos/` — it will be represented by name/label only in the Systems section, consistent with its internal, no-public-face nature.

## Recommended Screenshot

None — internal tool, no public interface to capture.

## Recommended Crop

N/A

## Visual Priority

Deliberately conceptual, not "low." *(Updated Phase 4B)* Rendered without a logo and with a narrower measure than the standard rows — it should read as a pause for reflection between two production systems (PRISMA before it, CleanSolarAus after), not as a lesser entry. Positioned fourth, immediately after the three most output-dense systems, so it lands right when a reader might start assuming Verk is only about shipped product.
