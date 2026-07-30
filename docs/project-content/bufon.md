# System 07 — Bufón

## Problem

A multiplayer party game succeeds or fails on emotional rhythm, not feature count. The problem is not "build voting rounds and a leaderboard" — it's engineering the timing, reveal, and feedback of a session so that a room of people actually feels tension, surprise, and laughter, on purpose.

## System

Bufón is a multiplayer social party game built around real-time rooms, voting rounds, and a cinematic reveal sequence. Every design decision — audio, haptics, confetti, timing — is tuned toward the emotional rhythm of a live session rather than toward screen-by-screen functionality. The product evolved deliberately from "functional multiplayer" to "emotionally memorable multiplayer."

## Architecture

- **Presentation** — Flutter, Dart, Riverpod (domain models, repositories, services)
- **Logic / Processing** — Firebase Firestore, realtime multiplayer state (rooms, players, rounds, voting, answers)
- **Storage** — Firestore (leaderboards, season/progression system)
- **Infrastructure** — Anonymous Authentication
- **Experience layer** — minimal audio design, haptic feedback, confetti, timed reveal sequencing (game feel as an engineered layer, not a visual afterthought)

## Current State

En Evolución. Multiplayer rooms, voting, room management, the reveal system, and interaction polish (sound, haptics, timing) are functional. Leaderboard and monetization systems are in active development.

## Capabilities Demonstrated

- Real-time multiplayer systems engineering
- Interaction design and "game feel" as an explicit, tunable system
- Behavioral/emotional UX — designing for a felt experience, not just a functional one
- Evidence that Verk treats software quality as experiential, not only functional

## Technologies

Flutter, Dart, Riverpod, Firebase (Firestore, Anonymous Authentication)

## Public URL

None — mobile application, not web-deployed.

## Logo Location

`public/project-logos/bufon/BUFON-LOGO.png` (also available: `BUFON-ISOTIPE.png`)

## Recommended Screenshot

None — logo only. Decision documented in `docs/phase-4a-report.md`.

## Recommended Crop

N/A

## Visual Priority

Mid-low. Bufón closes the product-thinking cluster with the most experiential, least infrastructural capability in the set — deliberately placed after Riot to move from "systems that grant access" to "systems that create feeling."
