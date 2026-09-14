# SignFlow

SignFlow is a secure digital document signing and workflow platform built for modern teams and organizations.

**Company:** SignFlow Technologies

[![License: AGPL-3.0](https://img.shields.io/badge/License-AGPL%20v3-purple.svg)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg?logo=typescript)](https://www.typescriptlang.org/)
[![React Router v7](https://img.shields.io/badge/Framework-React%20Router%20v7-red.svg)](https://reactrouter.com/)
[![Prisma](https://img.shields.io/badge/ORM-Prisma-teal.svg?logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38B2AC.svg?logo=tailwind-css)](https://tailwindcss.com/)

---

## Overview

SignFlow provides organizations with a complete, self-hostable platform for managing electronic document execution. From contract drafting and multi-recipient signing workflows to cryptographic document sealing and immutable audit logs, SignFlow ensures signing processes are frictionless, legally defensible, and secure.

## Key Capabilities

Every capability listed below is implemented and functional in this codebase:

- **Document Ingestion & Management:** Upload and process standard PDF documents (up to 50MB) with automatic page rendering, item ordering, and multi-document envelope support.
- **Visual Field Preparation:** Drag-and-drop field authoring canvas powered by Konva, supporting Signature, Initials, Name, Email, Date, Text, Checkbox, Radio, and Dropdown fields.
- **Flexible Recipient Workflows:** Configure multiple signing participants with granular roles (*Signer*, *Approver*, *Viewer*), sequential or parallel signing order, and delivery preferences.
- **Frictionless Recipient Experience:** Responsive signing interface accessible on desktop and mobile without mandatory account creation.
- **Cryptographic PDF Sealing:** Digitally sign and seal executed PDFs using standard cryptographic signatures (`@libpdf/core`), embedding tamper-evident certificates directly into the document.
- **Comprehensive Audit Trail:** Automatic tracking of all envelope lifecycle events (creation, delivery, views, field entries, signatures, completion) with timestamp and IP verification.
- **Document Templates:** Create reusable document templates with pre-configured fields and placeholder roles for standardized agreements.
- **Teams & Multi-Tenancy:** Multi-tenant organization and team workspaces with role-based member management.
- **Developer API & Embeds:** Programmatic envelope creation, webhook event distribution, and embeddable authoring and signing flows.

## Live Demo & Local Quickstart

Run SignFlow locally in a few minutes using the pre-configured Docker development environment:

### Prerequisites

- **Node.js:** v20+ (Node v24 recommended)
- **Docker & Docker Compose**
- **npm**

### Quickstart

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Chetannn18/SignFlow.git
   cd SignFlow
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   *(Review `.env` to customize settings or enable demo bypass if desired).*

3. **Start infrastructure services (PostgreSQL, Redis, Gotenberg, Mailserver, MinIO):**
   ```bash
   docker compose -f docker/development/compose.yml up -d
   ```

4. **Install dependencies:**
   ```bash
   npm install
   ```

5. **Start the application development server:**
   ```bash
   npm run dev
   ```

### Access Points

- **SignFlow Application:** [http://localhost:3000](http://localhost:3000)
- **Local Mailbox (Inbucket):** [http://localhost:9000](http://localhost:9000)
- **Local S3 Dashboard (MinIO):** [http://localhost:9001](http://localhost:9001)
- **PostgreSQL Database:** `localhost:54320` (`user: documenso`, `database: documenso`)

## Architecture

SignFlow is structured as an enterprise-grade TypeScript monorepo managed with Turborepo:

- **Frontend & App Server:** [React Router v7](https://reactrouter.com/) and [Remix](https://remix.run/) running on a [Hono](https://hono.dev/) server in [`apps/remix`](./apps/remix).
- **UI System:** [Tailwind CSS](https://tailwindcss.com/) with [shadcn/ui](https://ui.shadcn.com/) and [Radix UI](https://www.radix-ui.com/) accessible primitives.
- **API & RPC Layer:** Type-safe API endpoints using [tRPC](https://trpc.io/) and OpenAPI v1 schemas in [`packages/trpc`](./packages/trpc) and [`packages/api`](./packages/api).
- **Database & State:** [PostgreSQL](https://www.postgresql.org/) with [Prisma ORM](https://www.prisma.io/) and Kysely query builder in [`packages/prisma`](./packages/prisma).
- **Signing & Cryptography:** Digital signature generation and PDF manipulation using [`@libpdf/core`](https://www.npmjs.com/package/@libpdf/core) and [`@cantoo/pdf-lib`](https://github.com/cantoo-scribe/pdf-lib) in [`packages/signing`](./packages/signing).
- **Email Infrastructure:** React-based transactional email templating powered by [`@react-email`](https://react.email/) in [`packages/email`](./packages/email).
- **Testing & Quality:** End-to-end testing with [Playwright](https://playwright.dev/) in [`packages/app-tests`](./packages/app-tests) and formatting with [Biome](https://biomejs.dev/).

## Development Commands

- `npm run dev` — Launch development server
- `npm run lint` — Lint all packages
- `npm run lint:fix` — Automatically fix linting and formatting issues
- `npm run format` — Format code across the monorepo with Biome
- `npm run test:dev -w @documenso/app-tests` — Run Playwright E2E tests

## Project Status

SignFlow is an actively maintained enterprise MVP by **SignFlow Technologies**. The platform is in active development with a focus on modern B2B SaaS workflows, security, and seamless signing user experiences.

## License & Attribution

This project is licensed under the **GNU Affero General Public License v3.0 (AGPL-3.0)**. See the [`LICENSE`](./LICENSE) file for the complete license terms.

### Upstream Open-Source Notice
SignFlow includes software and components derived from the open-source **Documenso** project (originally copyright © Documenso, Inc. and contributors, licensed under AGPL-3.0). In accordance with the GNU Affero General Public License v3.0:
- All original copyright notices, license headers, and attribution files have been faithfully preserved throughout the codebase.
- Source code modifications are distributed under the same AGPL-3.0 license terms.
- For historical context, original upstream documentation, and contributions from the Documenso open-source community, visit the upstream project repository at [https://github.com/documenso/documenso](https://github.com/documenso/documenso).
