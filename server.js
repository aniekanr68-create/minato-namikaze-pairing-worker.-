import "dotenv/config";
import express from "express";
import rateLimit from "express-rate-limit";
import crypto from "node:crypto";

const app = express();
const port = Number(process.env.PORT || 3000);
const serviceName = "MINATO NAMIKAZE Pairing Worker";

app.disable("x-powered-by");
app.use(express.json({ limit: "8kb", strict: true }));

// Basic hardening headers. Put the worker behind Render's HTTPS endpoint.
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("Cache-Control", "no-store");
  next();
});

const requestLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: "Too many requests. Please wait and try again." }
});

function constantTimeEqual(a, b) {
  const left = Buffer.from(String(a));
  const right = Buffer.from(String(b));
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}

function requireApiKey(req, res, next) {
  const configured = process.env.WORKER_API_KEY;
  const provided = req.get("x-api-key") || "";

  if (!configured || configured.length < 32) {
    return res.status(503).json({
      status: "not_configured",
      error: "Worker API authentication is not configured."
    });
  }

  if (!provided || !constantTimeEqual(provided, configured)) {
    return res.status(401).json({ error: "Unauthorized." });
  }

  return next();
}

app.get("/", (_req, res) => {
  res.status(200).json({
    service: serviceName,
    status: "online",
    pairingEnabled: false,
    message: "Worker scaffold is online. WhatsApp pairing is intentionally disabled."
  });
});

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    service: serviceName,
    pairingEnabled: false
  });
});

// Protected placeholder only. No WhatsApp library, pairing code, or session is
// created here. This route stays disabled until a secure integration is added.
app.post("/api/pairing/request", requestLimiter, requireApiKey, (_req, res) => {
  return res.status(503).json({
    status: "pairing_disabled",
    message: "Pairing is disabled until a reviewed WhatsApp integration, secure session storage, and deployment secrets are configured. No code was generated."
  });
});

app.use((_req, res) => {
  res.status(404).json({ error: "Not found." });
});

app.listen(port, "0.0.0.0", () => {
  console.log(`${serviceName} listening on port ${port}`);
  console.log("Pairing is disabled by design.");
});
