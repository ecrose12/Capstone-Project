# My Words Matter

A free, web-based picture communication app that helps anyone express needs, choices, emotions, and ideas through visual symbols and Picture Exchange Communication (PEC) tools.

**Live site:** [mywordsmatter.app](https://mywordsmatter.app)

## About

Access to traditional AAC (Augmentative and Alternative Communication) devices can take months of evaluations, referrals, and insurance approvals — and still cost thousands of dollars. My Words Matter exists so that anyone, in any situation, can use picture-based communication tools without cost, without waiting, and without jumping through institutional hoops.

Read more on the [About page](https://mywordsmatter.app/about).

## Tech Stack

**Frontend**
- [Next.js](https://nextjs.org/) 16 (App Router)
- [React](https://react.dev/) 19
- Tailwind CSS v4 + DaisyUI
- TypeScript / JavaScript (mixed)

**Backend & Database**
- Next.js API Routes
- [Supabase](https://supabase.com/) (Postgres, Auth)

**Content**
- [OpenSymbols.org](https://www.opensymbols.org/) — open-source picture symbol library

**Email**
- [Resend](https://resend.com/)

**PWA**
- [Serwist](https://serwist.pages.dev/) — service worker & offline support

**Hosting**
- [Cloudflare Workers](https://workers.cloudflare.com/) via [OpenNext](https://opennext.js.org/)

## Features

- Nine customizable PEC template types (Single PEC Selector, Sentence Creator, Emergency Cards, Schedules, Chore Lists, First/Then, Consequence/Reward, and more)
- Text-to-Speech playback for any card or phrase
- Three account types: Individual, Parent/Caregiver, and School Administrator/Teacher
- Device Pairing — children and students connect via a one-time code, with no email or login required
- Two search modes: type-to-search or Browse by Category
- Two-layer content filtering, with automatic safe search enforced for all School accounts
- Light/Dark mode, installable as a Progressive Web App
- ADA-accessible design: large touch targets, high-contrast themes, visible focus states

See [FEATURES.md](./FEATURES.md) for the full list.

## Getting Started

```bash
cd capstone-project
npm install
```

Create a `.env.local` file with the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=
OPENSYMBOLS_SECRET=
RESEND_API_KEY=
EMAIL_FROM=
SUPPORT_TEAM_EMAILS=
ADMIN_EMAILS=
NEXT_PUBLIC_APP_URL=
```

Run the dev server:

```bash
npm run dev
```

## Deployment

Deployed to Cloudflare Workers via OpenNext:

```bash
npm run deploy
```

## Creators

- **[Elizabeth Crose](https://mywordsmatter.app/team)** — Full Stack Developer
- **[Laura Sohl](https://mywordsmatter.app/team)** — UX/Design ([sohlsmith.com](http://sohlsmith.com/))

Built during the OKCoders 2026 Full Stack, AI-Enhanced Software Development bootcamp through Techlahoma.

## Acknowledgments

- [OpenSymbols.org](https://www.opensymbols.org/) for the open-source symbol database
- The Techlahoma Foundation
- Our OKCoders 2026 instructors, Bryan and Derrick
