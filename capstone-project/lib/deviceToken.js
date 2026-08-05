// lib/deviceToken.js
import crypto from "crypto";

// Generates a new device token.
// `raw` is what gets stored in the client's cookie.
// `hash` is what gets stored in the database — never store the raw token.
export function generateDeviceToken() {
  const raw = crypto.randomBytes(32).toString("hex");
  const hash = crypto.createHash("sha256").update(raw).digest("hex");
  return { raw, hash };
}

export function hashToken(raw) {
  return crypto.createHash("sha256").update(raw).digest("hex");
}

// 6-digit numeric pairing code, easy to type on a child's device.
export function generatePairingCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}