# System 03 — PRISMA

## Problem

Every film catalog organizes cinema the same way: genre, director, country, year. That taxonomy is administrative, not experiential — it tells you what a film *is filed under*, not what it *feels like*. The problem PRISMA takes on is whether cinema can be discovered through perception — color, atmosphere, rhythm, abstraction — instead of metadata.

## System

PRISMA is a full-stack cinematic knowledge platform built around an original visual taxonomy of film. An automated data pipeline ingests and normalizes film metadata, then an AI-assisted curation layer scores each film across custom dimensions (color classification, visual rhythm, emotional temperature, abstraction) that do not exist in any standard film database. The result is an exploration experience — catalog, people, studios, watchlists, public profiles — built entirely around this invented taxonomy rather than a rebuilt IMDb.

## Architecture

- **Presentation** — Astro (hybrid SSR), TypeScript, deployed on Vercel
- **Logic** — Supabase (PostgreSQL, authentication, APIs)
- **Processing** — Python data pipeline: automated ingestion, normalization, metadata processing
- **Storage** — PostgreSQL (Supabase)
- **AI** — movie enrichment, color classification, visual rhythm scoring, emotional-temperature scoring, abstraction scoring, curatorial metadata generation
- **External sources** — TMDB and other movie metadata providers

## Current State

En Evolución. Visual taxonomy (color, emotional, abstraction, rhythm dimensions), movie/people/studio catalogs, authentication, watchlists, viewed-movie tracking, and public profiles are live. The taxonomy itself is designed to keep expanding.

## Capabilities Demonstrated

- Original knowledge architecture: inventing a taxonomy rather than adopting an existing one
- Complex, custom data modeling at catalog scale
- AI-assisted enrichment pipelines applied to subjective, qualitative dimensions (not just structured extraction)
- SSR application architecture in Astro
- The willingness to rethink an entire category instead of rebuilding it

## Technologies

Astro, TypeScript, Supabase, PostgreSQL, Python, TMDB API, Vercel

## Public URL

https://prisma-site-eight.vercel.app/

## Logo Location

`public/project-logos/prisma/logo.png` (also available: `prisma-logo-blanco.png`, `isotipo.png`)

## Recommended Screenshot

None — logo only. Decision documented in `docs/phase-4a-report.md`.

## Recommended Crop

N/A

## Visual Priority

Third-highest. PRISMA is the clearest evidence that Verk designs new knowledge systems rather than reproducing existing ones — the capability most aligned with the brand's own "La Obra" philosophy of building a system, not a surface.
