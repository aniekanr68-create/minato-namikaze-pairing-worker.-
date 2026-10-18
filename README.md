# MINATO NAMIKAZE Pairing Worker

A separate Node.js/Express service scaffold for the MINATO NAMIKAZE PAIRING website.

## Current status

**WhatsApp pairing is disabled.** This project does not generate pairing codes, connect a WhatsApp account, or store WhatsApp session credentials. The pairing endpoint returns HTTP `503` by design until a reviewed integration and secure session-storage plan are implemented.

Do not connect the existing website to this service yet.

## Included endpoints

- `GET /` — service status
- `GET /health` — health check for hosting providers
- `POST /api/pairing/request` — protected placeholder that deliberately returns `503`

The placeholder requires `x-api-key` authentication. Requests are rate-limited. These protections are starter safeguards, not a substitute for a complete security review.

## Requirements

- Node.js 20 or newer
- npm

## Run locally

1. Download or clone this repository.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Copy `.env.example` to `.env`.
4. Replace `WORKER_API_KEY` with a long, random secret. For example, on a computer with OpenSSL:

   ```bash
   openssl rand -hex 32
   ```

   Do not share the key in chat or commit `.env`.
5. Start the service:

   ```bash
   npm start
   ```

6. Visit `http://localhost:3000/health`. It should return a JSON health response.

The pairing endpoint remains disabled even if you set `PAIRING_ENABLED=true`; this scaffold intentionally does not implement pairing.

## Deploy on Render

1. Push this repository to GitHub.
2. Sign in to [Render](https://render.com/).
3. Choose **New + → Web Service** and connect this repository.
4. Use these settings:
   - **Runtime:** Node
   - **Build command:** `npm install`
   - **Start command:** `npm start`
   - **Health check path:** `/health`
5. Add `WORKER_API_KEY` under the Render service's Environment settings. Use a randomly generated secret of at least 32 characters. Do not paste secrets into source files.
6. Deploy the service and open `/health` on its Render URL. Confirm it returns `"status":"ok"`.
7. Keep the existing website disconnected until authentication, rate limits, privacy, and the intended WhatsApp integration have been reviewed and tested.

### Persistent storage warning

This starter does not create or store WhatsApp sessions. If a future approved integration stores session data, use an appropriate encrypted/persistent storage design and restrict access. Render's default filesystem is ephemeral; do not rely on it for durable session storage. Review Render's current persistent disk documentation and pricing before choosing a storage architecture.

## Security notes

- Never commit `.env`, API keys, QR data, pairing codes, or session credentials.
- Do not expose an unauthenticated endpoint that can request pairing codes.
- Add origin checks and stronger per-user authorization before allowing a browser website to call protected endpoints. CORS alone is not authentication.
- Rotate any secret that is accidentally exposed.
- Use only accounts you own or are explicitly authorized to link.
- WhatsApp Web companion libraries are unofficial and may change or be restricted. Review the current WhatsApp terms and the library's security and maintenance status before selecting an integration.

## Integration checklist before enabling pairing

- [ ] Choose and review a supported WhatsApp integration.
- [ ] Confirm the account owner explicitly authorizes linking.
- [ ] Add proper authentication/authorization between the website and worker.
- [ ] Add request validation, per-user rate limits, abuse protection, and audit-safe logging.
- [ ] Design secure session storage, backups, access controls, and deletion.
- [ ] Ensure secrets are stored only in the hosting provider's environment settings.
- [ ] Test failure handling, restart behavior, and session revocation.
- [ ] Review relevant terms and privacy obligations.
- [ ] Only then implement pairing and update the website's backend to call this worker.

This repository is a scaffold, not a functioning WhatsApp pairing service.
