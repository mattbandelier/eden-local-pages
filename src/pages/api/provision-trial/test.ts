import { randomUUID } from "node:crypto";
import type { APIRoute } from "astro";
import { log, provision, secretsMatch } from "../../../lib/server/eden-live-provision.js";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const requestId = request.headers.get("x-vercel-id") || randomUUID();
  if (import.meta.env.ALLOW_PROVISION_TEST !== "true") return Response.json({ error: "Not found." }, { status: 404 });
  if (!secretsMatch(request.headers.get("x-eden-webhook-secret"), import.meta.env.EDEN_WEBHOOK_SECRET)) {
    log("sandbox_test_rejected", { request_id: requestId });
    return Response.json({ error: "Unauthorized." }, { status: 401 });
  }

  let input: Record<string, string> = {};
  try { input = await request.json(); } catch { /* defaults are safe sandbox data */ }
  const payload = {
    first_name: "Eden",
    last_name: "Sandbox",
    email: input.email || `eden-sandbox+${Date.now()}@example.com`,
    phone: input.phone || "7205550199",
    state: input.state || "CO",
    ghl_contact_id: input.ghl_contact_id || `sandbox-${Date.now()}`,
    trial_start_date: input.trial_start_date || new Date().toISOString().slice(0, 10),
  };

  try {
    const result = await provision(payload, { sandbox: true, requestId });
    return Response.json({ test: true, request_id: requestId, input: { ...payload, email: "[redacted]", phone: "[redacted]" }, result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Sandbox provisioning failed.";
    return Response.json({ test: true, request_id: requestId, status: "failed", error: message }, { status: 500 });
  }
};
