# System 08 — Bloom Undies

## Problem

Menstrual and sexual health tracking apps typically optimize for engagement — streaks, notifications, social feeds — in a category where the actual need is privacy, trust, and calm. The problem is designing a health product that treats restraint as a feature, not a limitation.

## System

Bloom Undies is a mobile application for tracking menstrual cycle, sexual health, and hormonal wellbeing, built local-first and privacy-first so it remains usable and trustworthy without connectivity or third-party data exposure. Future versions extend the product into Bloom Circles — anonymous, moderated communities for education and emotional support.

## Architecture

- **Presentation** — Flutter, Dart, Clean Architecture, Riverpod
- **Storage** — Hive (local, encrypted, offline-first)
- **Infrastructure (planned)** — Firebase Authentication, Firestore, Cloud Functions, Firebase Cloud Messaging, Gemini-assisted moderation (for Bloom Circles)

## Current State

Desarrollo Activo. Cycle tracking, onboarding, settings, local encrypted storage, and the Bloom theme system are built. Authentication and community (Bloom Circles) infrastructure exist as architecture, ahead of beta deployment.

## Capabilities Demonstrated

- Privacy-first, offline-first product architecture
- Designing for trust and emotional safety rather than engagement metrics
- Long-term product architecture that can grow (community layer) without compromising the local-first foundation
- Restraint as a deliberate design capability — the opposite instinct from most consumer mobile products

## Technologies

Flutter, Dart, Riverpod, Hive, Firebase (planned), Gemini (planned)

## Public URL

None — mobile application, pre-launch.

## Logo Location

`public/project-logos/bloom undies/bloom undies logo simplificado con coral.png` (also available: `ISOTIPO BLOOM UNDIES.png`)

## Recommended Screenshot

None — logo only. Decision documented in `docs/phase-4a-report.md`.

## Recommended Crop

N/A

## Visual Priority

Lower. Bloom Undies is pre-launch and the least infrastructurally dense system in the set, but it is retained deliberately as proof that Verk's product thinking includes restraint, not only technical spectacle.
