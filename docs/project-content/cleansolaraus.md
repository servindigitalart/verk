# System 05 — CleanSolarAus

## Problem

Ranking for a topic at scale requires more content than any editorial team can sustainably produce by hand — but publishing volume without structure produces a pile of thin articles, not authority. The problem is building an operation that can keep producing correctly-researched, well-linked, quality-checked content indefinitely, without a growing headcount.

## System

CleanSolarAus is a Programmatic SEO platform for solar panel maintenance and cleaning across Australia. It is not a content site — it is a content *operation*: a daily automated pipeline researches keywords, generates structured briefs, writes and quality-checks articles, expands semantic clusters, manages internal linking, and deploys itself. Every article is a deliberate node in a larger topical knowledge base, not a standalone post.

## Architecture

- **Presentation** — Astro (static site generation), deployed on Cloudflare Pages
- **Logic** — Python 3.11 pipeline: research agents, SEO analysis, brief generation, writing, QA, semantic expansion
- **Processing** — GitHub Actions running the pipeline daily, automated repository updates and deployment
- **Storage** — Supabase, PostgreSQL
- **AI** — Anthropic Claude Sonnet 4.5 (research, writing, quality assurance)
- **Infrastructure** — Search Console integration (opportunity analysis), internal linking and content-clustering automation

## Current State

Operativo. The pipeline runs daily, unattended: keyword research, brief generation, AI-assisted writing, semantic clustering, quality validation, and deployment all execute without manual editorial intervention.

## Capabilities Demonstrated

- Large-scale automation pipeline engineering, not a one-off script
- Programmatic SEO as a system, not a series of manual publishes
- AI as a production writer/QA step inside a continuous-deployment pipeline
- Self-sustaining content infrastructure that compounds without added headcount
- Long-term knowledge architecture applied to a commercial vertical

## Technologies

Astro, Cloudflare Pages, Supabase, PostgreSQL, Python 3.11, Anthropic Claude Sonnet 4.5, GitHub Actions, Google Search Console

## Public URL

https://cleansolaraus.com/

## Logo Location

`public/project-logos/cleansolaraus/favicon.svg` (also available: `og-default.svg`)

## Recommended Screenshot

None — logo only. Decision documented in `docs/phase-4a-report.md`.

## Recommended Crop

N/A

## Visual Priority

Mid-high. CleanSolarAus proves Verk can engineer continuous, self-sustaining infrastructure — a distinct capability from one-time builds, and the clearest automation-pipeline evidence in the set.
