# Render deployment instructions

These steps deploy the **disabled worker scaffold** as a separate web service. They do not change the existing MINATO NAMIKAZE website.

1. Upload these files to the GitHub repository.
2. Open https://render.com/ and sign in.
3. Select **New + → Web Service**.
4. Connect the `minato-namikaze-pairing-worker.-` repository.
5. Configure:
   - Runtime: **Node**
   - Build command: `npm install`
   - Start command: `npm start`
   - Health check path: `/health`
6. In **Environment**, add `WORKER_API_KEY` with a cryptographically random secret of at least 32 characters. Generate it locally with `openssl rand -hex 32` if available. Keep it private.
7. Deploy and visit `https://YOUR-SERVICE.onrender.com/health`.
8. Confirm the response reports `"status":"ok"` and `"pairingEnabled":false`.
9. Do not connect the website or enable pairing yet. The pairing route intentionally returns HTTP 503.

## Important hosting notes

- Render free web services may spin down when idle.
- The filesystem of a typical web service is ephemeral. This starter does not store session data. If a future implementation needs session persistence, plan that separately before implementing it.
- Never put API keys or session credentials in GitHub source code or frontend JavaScript.
