# System 06 — Riot

## Problem

Event apps generally treat events as listings — a searchable feed of things happening nearby. That model ignores how people actually decide to go somewhere: through a host, an invitation, a social circle. The problem is building an event platform organized around communities and relationships, not a calendar.

## System

Riot is a mobile-first social platform for discovering, organizing, and experiencing real-world events. It combines event discovery, host and organizer flows, invitations, access requests, ticketing, QR check-in, and a social graph inside one feature-first architecture. The product is currently transitioning from a functional legacy build into a larger long-term architecture.

## Architecture

- **Presentation** — Flutter, Dart, feature-first architecture (repositories, services, models, blocs)
- **Logic / Processing** — Firebase Cloud Functions
- **Storage** — Firestore, Realtime Database
- **Infrastructure** — Firebase Authentication, Security Rules, Push Notifications, QR validation

## Current State

En Evolución. Authentication, profiles, map, events, hosts, invitations, access requests, ticket architecture, QR check-in, notifications, and the social graph are functional. The architecture is being actively rebuilt from its legacy foundation toward the long-term structure.

## Capabilities Demonstrated

- Real-time application architecture (Firestore, live state)
- Complex permission systems: access requests, invitations, host-controlled visibility
- Ticketing and QR-based access-control infrastructure
- Product thinking at consumer scale, not a client deliverable
- Social-graph architecture inside a mobile-first product

## Technologies

Flutter, Dart, Firebase (Firestore, Cloud Functions, Authentication, Cloud Messaging), Realtime Database

## Public URL

None — mobile application, not web-deployed.

## Logo Location

`public/project-logos/riot/riot-logo.png`

## Recommended Screenshot

None — logo only. Decision documented in `docs/phase-4a-report.md`.

## Recommended Crop

N/A

## Visual Priority

Mid. Riot demonstrates ambitious, multi-system consumer product architecture — placed after the research/knowledge systems to open the "product thinking" portion of the section.
