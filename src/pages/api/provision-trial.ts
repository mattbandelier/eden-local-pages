import { randomUUID } from "node:crypto";
import type { APIRoute } from "astro";
import { log, provision, redact, secretsMatch } from "../../lib/server/eden-live-provision.js";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const requestId = request.headers.get("x-vercel-id") || randomUUID();
  let payload: Record<string, unknown> = {};
  try { payload = await request.json(); } catch { /* validation returns a 400 below */ }
  log("webhook_received", { request_id: requestId, method: request.method, payload: redact(payload) });

  if (!secretsMatch(request.headers.get("x-eden-webhook-secret"), import.meta.env.EDEN_WEBHOOK_SECRET)) {
    log("webhook_rejected", { request_id: requestId, reason: "invalid_secret", payload: redact(payload) });
    return Response.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const result = await provision(payload, { requestId });
    return Response.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Provisioning failed.";
    const status = message.startsWith("Missing required") || message.includes("invalid") ? 400 : 500;
    return Response.json({ status: "failed", error: message, request_id: requestId }, { status });
  }
};
