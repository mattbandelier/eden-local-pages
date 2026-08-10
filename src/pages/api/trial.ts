import type { APIRoute } from "astro";

export const prerender = false;

const requiredFields = ["first_name", "last_name", "email", "phone", "state"] as const;

export const POST: APIRoute = async ({ request }) => {
  const webhookUrl = import.meta.env.GHL_WEBHOOK_URL;
  if (!webhookUrl) {
    return Response.json({ error: "Trial enrollment is being connected. Please try again shortly." }, { status: 503 });
  }

  let payload: Record<string, unknown>;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  if (requiredFields.some((field) => typeof payload[field] !== "string" || !String(payload[field]).trim())) {
    return Response.json({ error: "Please complete every field." }, { status: 400 });
  }

  const email = String(payload.email).trim().toLowerCase();
  const phone = String(payload.phone).replace(/\D/g, "");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || phone.length < 10 || phone.length > 15) {
    return Response.json({ error: "Please enter a valid email and phone number." }, { status: 400 });
  }

  const cleanPayload = {
    first_name: String(payload.first_name).trim(),
    last_name: String(payload.last_name).trim(),
    email,
    phone,
    state: String(payload.state).trim(),
    utm_source: String(payload.utm_source || ""),
    utm_medium: String(payload.utm_medium || ""),
    utm_campaign: String(payload.utm_campaign || ""),
    submitted_at: new Date().toISOString(),
  };

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cleanPayload),
    });
    if (!response.ok) throw new Error(`GHL returned ${response.status}`);
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "We could not start your trial. Please try again." }, { status: 502 });
  }
};
