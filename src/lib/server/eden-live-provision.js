import { createHash, randomUUID, timingSafeEqual } from "node:crypto";

const ACTIVE_STATES = new Set(["CO", "TX", "AZ", "UT", "NV", "WA", "TN"]);
const REQUIRED = ["first_name", "last_name", "email", "phone", "state", "ghl_contact_id", "trial_start_date"];

export function hash(value) {
  return createHash("sha256").update(String(value || "")).digest("hex").slice(0, 12);
}

export function redact(payload = {}) {
  return {
    email_hash: hash(payload.email),
    phone_hash: hash(payload.phone),
    state: payload.state,
    ghl_contact_hash: hash(payload.ghl_contact_id),
    trial_start_date: payload.trial_start_date
  };
}

export function log(event, fields = {}) {
  console.log(JSON.stringify({ timestamp: new Date().toISOString(), service: "eden-live-provisioner", event, ...fields }));
}

export function secretsMatch(provided, expected) {
  if (!provided || !expected) return false;
  const supplied = Buffer.from(String(provided));
  const configured = Buffer.from(String(expected));
  return supplied.length === configured.length && timingSafeEqual(supplied, configured);
}

export function validate(payload) {
  const missing = REQUIRED.filter((field) => typeof payload?.[field] !== "string" || !payload[field].trim());
  if (missing.length) throw new Error(`Missing required fields: ${missing.join(", ")}`);
  const state = payload.state.trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(state)) throw new Error("State must be a two-letter US abbreviation.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) throw new Error("Email is invalid.");
  const phone = payload.phone.replace(/\D/g, "");
  if (phone.length < 10 || phone.length > 15) throw new Error("Phone is invalid.");
  if (Number.isNaN(Date.parse(payload.trial_start_date))) throw new Error("trial_start_date is invalid.");
  return { ...payload, state, phone, email: payload.email.trim().toLowerCase() };
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function requestWithRetry(url, options, context) {
  let lastError;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetch(url, options);
      const text = await response.text();
      const data = text ? JSON.parse(text) : {};
      log("exercise_response", { operation: context.operation, attempt, status_code: response.status, request_id: context.requestId });
      if (response.ok) return data;
      if (response.status >= 400 && response.status < 500 && response.status !== 408 && response.status !== 429) {
        throw Object.assign(new Error(`Exercise.com ${context.operation} returned ${response.status}`), { terminal: true, status: response.status });
      }
      throw new Error(`Exercise.com ${context.operation} returned ${response.status}`);
    } catch (error) {
      lastError = error;
      if (error.terminal || attempt === 3) break;
      const delayMs = 250 * (2 ** (attempt - 1));
      log("exercise_retry", { operation: context.operation, attempt, delay_ms: delayMs, request_id: context.requestId, error: error.message });
      await sleep(delayMs);
    }
  }
  throw lastError;
}

function config(sandbox = false) {
  const prefix = sandbox ? "EXERCISE_SANDBOX_" : "EXERCISE_";
  return {
    baseUrl: process.env[`${prefix}BASE_URL`] || "https://train.demoexercise.com",
    apiKey: process.env[`${prefix}API_KEY`] || "",
    apiToken: process.env[`${prefix}API_TOKEN`] || "",
    planId: process.env[`${prefix}TRIAL_PLAN_ID`] || "",
    email: sandbox ? "" : process.env.EXERCISE_EMAIL || "",
    password: sandbox ? "" : process.env.EXERCISE_PASSWORD || ""
  };
}

async function getApiToken(cfg, requestId) {
  if (cfg.apiToken) return cfg.apiToken;
  if (!cfg.email || !cfg.password) throw new Error("EXERCISE_API_TOKEN or Exercise.com service credentials are required.");
  const data = await requestWithRetry(`${cfg.baseUrl}/api/v4/users/sign_in`, {
    method: "POST",
    headers: { "Authorization": `Bearer ${cfg.apiKey}`, "Content-Type": "application/json", "Accept": "application/json" },
    body: JSON.stringify({ email: cfg.email, password: cfg.password })
  }, { operation: "sign_in", requestId });
  const token = data.auth_token || data.api_token || data.user?.auth_token;
  if (!token) throw new Error("Exercise.com sign-in returned no API token.");
  return token;
}

function headers(cfg, apiToken) {
  return {
    "Authorization": `Bearer ${cfg.apiKey}`,
    "API-TOKEN": apiToken,
    "Content-Type": "application/json",
    "Accept": "application/json"
  };
}

function clientId(client) {
  return client?.id || client?.user_id || client?.userId;
}

async function findClient(cfg, apiToken, email, requestId) {
  const query = new URLSearchParams({ "q[client_search]": email, per: "5" });
  const data = await requestWithRetry(`${cfg.baseUrl}/api/v2/clients/?${query}`, { headers: headers(cfg, apiToken) }, { operation: "find_client", requestId });
  const clients = data?.client || data?.clients || [];
  return (Array.isArray(clients) ? clients : [clients]).find((client) => String(client?.email || "").toLowerCase() === email) || null;
}

async function createClient(cfg, apiToken, payload, tags, requestId) {
  const data = await requestWithRetry(`${cfg.baseUrl}/api/v2/clients/`, {
    method: "POST",
    headers: headers(cfg, apiToken),
    body: JSON.stringify({ client: {
      first_name: payload.first_name.trim(),
      last_name: payload.last_name.trim(),
      email: payload.email,
      phone_number: payload.phone,
      tag_list: tags.join(","),
      send_welcome_email: false
    } })
  }, { operation: "create_client", requestId });
  return data?.client || data;
}

async function assignPlan(cfg, apiToken, id, payload, requestId) {
  const query = new URLSearchParams({
    client_ids: String(id),
    week_plan: String(cfg.planId),
    notify_plan: "false",
    send_welcome_email: "false",
    started_at: payload.trial_start_date
  });
  await requestWithRetry(`${cfg.baseUrl}/api/v3/clients/bulk_update?${query}`, { headers: headers(cfg, apiToken) }, { operation: "assign_trial_plan", requestId });
}

async function updateTags(cfg, apiToken, client, payload, tags, requestId) {
  const id = clientId(client);
  const existing = Array.isArray(client.tags) ? client.tags.map((tag) => tag.name || tag) : String(client.tag_list || "").split(",");
  const tagList = [...new Set([...existing, ...tags].map((tag) => String(tag).trim()).filter(Boolean))];
  await requestWithRetry(`${cfg.baseUrl}/api/v2/clients/${id}`, {
    method: "PUT",
    headers: headers(cfg, apiToken),
    body: JSON.stringify({ client: { tag_list: tagList.join(","), phone_number: payload.phone } })
  }, { operation: "update_client_tags", requestId });
}

async function alertSlack(payload, error, requestId) {
  const url = process.env.SLACK_ALERTS_WEBHOOK;
  if (!url) { log("slack_alert_skipped", { reason: "missing_webhook", request_id: requestId }); return; }
  try {
    const response = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({
      text: `Eden Live provisioning failed\nRequest: ${requestId}\nError: ${error.message}\nPayload: ${JSON.stringify(redact(payload))}`
    }) });
    log("slack_alert", { status_code: response.status, request_id: requestId });
  } catch (alertError) {
    log("slack_alert_failed", { request_id: requestId, error: alertError.message });
  }
}

export async function provision(rawPayload, { sandbox = false, requestId = randomUUID() } = {}) {
  const payload = validate(rawPayload);
  const cfg = config(sandbox);
  if (!cfg.apiKey || !cfg.planId) throw new Error(`Missing ${sandbox ? "sandbox " : ""}Exercise.com API configuration.`);
  const routeTag = ACTIVE_STATES.has(payload.state) ? "licensed_state" : "waitlist_state";
  const tags = [`state:${payload.state}`, "trial_active", routeTag];
  log("provision_started", { request_id: requestId, sandbox, payload: redact(payload), tags });

  try {
    const apiToken = await getApiToken(cfg, requestId);
    let client = await findClient(cfg, apiToken, payload.email, requestId);
    let existing = true;
    if (!client) { client = await createClient(cfg, apiToken, payload, tags, requestId); existing = false; }
    const id = clientId(client);
    if (!id) throw new Error("Exercise.com returned no user ID.");
    if (existing) await updateTags(cfg, apiToken, client, payload, tags, requestId);
    await assignPlan(cfg, apiToken, id, payload, requestId);
    log("provision_succeeded", { request_id: requestId, exercise_user_id: id, existing, payload: redact(payload) });
    return { status: "provisioned", exercise_com_user_id: id, exercise_com_login_url: process.env.EXERCISE_LOGIN_URL || "https://fit.edenhealthclubs.com" };
  } catch (error) {
    log("provision_failed", { request_id: requestId, payload: redact(payload), error: error.message });
    if (!sandbox) await alertSlack(payload, error, requestId);
    throw error;
  }
}
