# ChatMern

This repo now goes beyond the original tutorial app and showcases a more production-ready chat stack:

- Redis-backed Socket.io fan-out for horizontal scaling
- Cursor-based message pagination for infinite scroll
- Typing indicators plus delivered/read receipts
- S3 pre-signed uploads for media attachments
- A FastAPI microservice for smart replies and lightweight sentiment analysis
- Helmet, auth rate limiting, Jest + Supertest coverage, Docker, Kubernetes, and GitHub Actions

## Environment

Copy `.env.example` to `.env` and fill in the required values.

## Local development

```bash
npm install
npm install --prefix frontend
npm run server
npm run dev --prefix frontend
```

## Tests

```bash
npm test
```

## Docker Compose

```bash
docker compose up --build
```

This starts MongoDB, Redis, the Node backend, the React frontend via Nginx, and the FastAPI NLP service.

## Kubernetes

Sample manifests are available in `k8s/`.
