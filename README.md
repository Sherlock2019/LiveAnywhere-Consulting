# Relocate Anywhere Network

Relocate Anywhere Network (RAN) is the consumer relocation platform for LiveAnywhere Consulting. The working MVP begins with USA ↔ Vietnam and turns a life goal into a route across immigration, documents, moving, housing, work and settling.

## What is included

- Booking-style relocation search with working origin/destination swap, goals, timing and budgets
- Animated MapLibre route map for USA ↔ Vietnam
- Nine-step assessment and data-driven readiness calculation
- Personal move result with source-linked immigration route cards
- Vietnam destination pages, smart budget calculator and “what if?” city comparison
- Filterable mock housing and job marketplaces
- Services, pricing, corporate, partners, intent and SEO pages
- Interactive customer-dashboard and admin demonstrations
- PostgreSQL schema, migration/seed workflow and Docker packaging
- English-first copy with locale-aware architecture ready for Vietnamese content

Immigration information is general information, not legal advice. Production launch requires qualified counsel, current official-source verification, real partner vetting and a security review.

## Run with Docker

1. Copy `.env.example` to `.env` and set a `POSTGRES_PASSWORD` value.
2. Start the application:

   ```bash
   docker compose up --build
   ```

3. Open `http://localhost:3000`.

The application container applies the checked-in migrations and seeds idempotent demo data before starting.

## Run locally with npm

Requires Node.js 20.9+ and PostgreSQL.

```bash
npm install
cp .env.example .env
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

Useful checks:

```bash
npm test
npm run build
npm run lint
```

## AWS EC2 deployment

1. Launch an Ubuntu 24.04 EC2 instance with at least 2 vCPU / 4 GB RAM for image builds.
2. Allow inbound SSH only from your administration IP. Allow HTTP/HTTPS from the internet.
3. Clone this repository, run `deploy/ec2-bootstrap.sh` (installs Docker and Nginx, proxies port 80 to the app), then log out and back in.
4. Run `./start.sh deploy`. On first run it writes `.env` with a generated `POSTGRES_PASSWORD`, sets `NEXT_PUBLIC_SITE_URL` to the instance's public IP (override with `SITE_URL=https://your.domain ./start.sh deploy`), starts the containers and waits for the app to respond.
5. For a domain, set `server_name` in `/etc/nginx/sites-available/ran` and issue a TLS certificate (for example with Certbot).
6. For production, move PostgreSQL to Amazon RDS, keep the database private, store secrets in AWS Systems Manager Parameter Store or Secrets Manager, send logs to CloudWatch, and back up the database.

The included Compose database is suitable for a self-contained demo, not the recommended production data tier.

## Image credits

- Da Nang: Andrea Schaffer, CC BY 2.0, via Wikimedia Commons
- Ho Chi Minh City skyline: Tri Nguyen, CC BY 2.0, via Wikimedia Commons
- Hoàn Kiếm Lake, Hanoi: Daderot, CC0, via Wikimedia Commons

See [ARCHITECTURE.md](./ARCHITECTURE.md) for the application and data design.
