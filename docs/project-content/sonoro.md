# System 01 — Sonoro

## Problem

Long-form written content (books, manuscripts, structured documents) is hard to consume without dedicating uninterrupted reading time. The problem is not "turn text into audio" — narration tools have existed for years. The problem is building a *pipeline* that can take an arbitrary uploaded document, understand its structure (chapters, metadata, language), and produce a narrated, chaptered, exportable audiobook reliably, at scale, without a human in the loop for every file.

## System

Sonoro is a SaaS platform that converts long-form written content into narrated audiobooks. The system spans upload → document analysis → metadata enrichment → chapter generation → AI narration → export → subscription-gated delivery. It is designed around resilience: jobs can fail and recover, retries are automatic, and the architecture assumes failure as a normal operating condition rather than an edge case.

## Architecture

- **Presentation** — Astro + React Islands + TypeScript
- **Logic** — Python, FastAPI
- **Processing** — Redis-backed queues, asynchronous workers (document analysis, TTS generation, retries/failure recovery)
- **Storage** — PostgreSQL, S3-compatible object storage (audio files, covers)
- **Infrastructure** — subscription/usage metering, Stripe billing
- **AI** — Google Cloud Text-to-Speech (narration), Google Books + Open Library (metadata enrichment), language detection, automated cover generation, document analysis

## Current State

Operativo. PDF upload and narration pipeline is live in production, with EPUB/DOCX/TXT ingestion planned as the next input formats. The backend carries more than 700 automated tests — the highest test-coverage evidence among Verk's systems.

## Capabilities Demonstrated

- Distributed, queue-based asynchronous processing
- AI as a production pipeline component (not a demo feature)
- SaaS subscription architecture (metering, billing, plan gating)
- Resilience-first backend design (retries, failure recovery) over raw speed
- Full-stack ownership: frontend, API, workers, storage, billing, in one coherent system

## Technologies

Astro, React, TypeScript, Python, FastAPI, PostgreSQL, Redis, S3-compatible storage, Google Cloud Text-to-Speech, Google Books API, Open Library API, Stripe

## Public URL

https://sonoro-six.vercel.app/

## Logo Location

`public/project-logos/sonoro/favicon.svg`

## Recommended Screenshot

None — logo only. Decision documented in `docs/phase-4a-report.md`.

## Recommended Crop

N/A

## Visual Priority

Highest in the section. Sonoro is the featured system — the one project given the dark-inset treatment (per `docs/16-systems-architecture.md`), because it is the single strongest piece of evidence that Verk designs and ships distributed, AI-integrated, production-grade backend systems.
