# Architecture

## Product shape

The homepage is both a narrative and a working surface. The first viewport collects a small relocation brief; the result expands into assessment, route information, destination fit, cost planning and execution services.

```text
Origin + destination + household + goal + date + budget
                         |
                         v
             Assessment / rules engine
                         |
          +--------------+--------------+
          |              |              |
     Route cards     City fit       Move budget
          |              |              |
          +--------------+--------------+
                         |
                  Customer move plan
                         |
     Tasks · documents · partners · timeline · messages
```

## Application layers

- `src/app`: Next.js App Router entry pointsand metadata.
- `src/components`: reusable search, map, assessment, results, marketplace and dashboard experiences.
- `src/data`: replaceable launch/demo content. React components do not encode country-specific rule branches.
- `src/lib/assessment.ts`: deterministic, tested planning logic. It produces an informational readiness score, not legal eligibility.
- `prisma/schema.prisma`: normalized PostgreSQL model for users, cases, immigration content, tasks, marketplace records, orders, messages and auditing.
- `prisma/seed.ts`: idempotent launch data and the demo move.

## Immigration safety model

Each route has a status, public label, official source and verification date. Production should add:

- scheduled stale-source detection and review queues;
- two-person approval for legal-content changes;
- immutable audit records;
- jurisdiction-specific professional review;
- clear versioning so saved plans can be reconciled after a rule changes.

The UI never turns the readiness score into a legal eligibility score and does not promise a visa, green card, job or investment outcome.

## Data and security

The development document vault stores metadata only. A production document service should use private object storage, encryption at rest and in transit, short-lived signed URLs, malware scanning, MFA, least-privilege RBAC, audit logs, retention/deletion controls and GDPR/privacy review.

The app has no authentication; all pages, including the demo dashboard and admin demo, are public. Add identity, verified email, MFA and role-gating before storing real customer data.

## Internationalization

Content is currently English-first. Country, visa, service and marketplace records are data-driven. The next production step is locale-prefixed routing plus translation records for English and Vietnamese, followed by French, Spanish, Chinese, Japanese and Korean.

## Deployment

The Next.js build uses standalone output. Docker Compose runs the application and PostgreSQL for a complete demo. On AWS EC2, use Nginx for TLS termination and reverse proxying. Production should use RDS, managed secrets, CloudWatch logs, automated backups and a CI/CD image pipeline.
