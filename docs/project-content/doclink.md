# System 02 — DocLink

## Problem

Medical clinics have digital growth potential that nobody is systematically identifying, contacting, or converting. Building a website for a clinic solves nothing on its own — the real problem is the absence of an acquisition system: something that finds the clinics worth reaching, proves the opportunity, turns that proof into a lead, and carries that lead into a paying, retained customer.

## System

DocLink is a full SaaS growth platform for medical clinics, combining prospecting, SEO intelligence, automated website generation, and a customer portal inside one architecture. It is not a marketing website generator — it is an acquisition ecosystem: a prospecting service finds and scores clinics, an SEO intelligence service quantifies their opportunity, a directory and website generator produces the proof, and a customer portal converts the claimed lead into a subscriber on a tiered plan.

## Architecture

- **Presentation** — Next.js, React (customer portal, product surfaces), Astro (marketing site)
- **Logic** — Python, FastAPI, organized as microservices (Prospector, SEO Intelligence, Directory, Website Generator, Automation Engine)
- **Processing** — Automation engine coordinating multi-step acquisition workflows
- **Storage** — PostgreSQL, Supabase
- **Infrastructure** — Railway, Redis, Clerk (authentication), Paddle (subscriptions), Resend (communication)
- **AI** — multiple engines for research, content generation, automation, lead scoring, and enrichment

## Current State

En Evolución. Automated prospecting, lead scoring, directory generation, the claim flow, and the Starter/Growth/Pro subscription tiers are functional. The long-term objective — becoming a complete operating system for medical practice growth — is an active, expanding build.

## Capabilities Demonstrated

- Platform-level thinking: multiple independent services connected into one coherent business system
- Microservices architecture in a real commercial context, not a tech-demo
- AI-assisted scoring and enrichment as a decision-making layer, not a content generator
- Full acquisition-to-retention funnel: prospecting → proof → conversion → subscription
- Multi-tenant, multi-user SaaS architecture

## Technologies

Python, FastAPI, Next.js, React, Clerk, Astro, Railway, Redis, PostgreSQL, Supabase, Paddle, Resend

## Public URL

https://b2b-prospector-zc4e-git-main-minecraftleon182-8293s-projects.vercel.app/

## Logo Location

`public/project-logos/doclink/doclink-logo-dark.png` (also available: `doclink-logo-light.png`, `doclink-icon.png`)

## Recommended Screenshot

None — logo only. Decision documented in `docs/phase-4a-report.md`.

## Recommended Crop

N/A

## Visual Priority

Second-highest. DocLink is the strongest evidence of Verk's ability to design and connect multiple independent systems into one business platform — the capability that most directly extends Verk's own pitch ("sistemas, no sitios") to a client-facing case.
