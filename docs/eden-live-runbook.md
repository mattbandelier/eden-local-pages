# Eden Live Trial Runbook

The landing page is served at `https://landing.edenhealthclubs.com/eden-live/`.

## Routes

- `POST /api/trial/` sends the browser form submission to the GHL inbound webhook.
- `POST /api/provision-trial/` accepts the signed GHL workflow webhook and provisions Exercise.com.
- `POST /api/provision-trial/test/` runs the disabled-by-default sandbox round trip.

This project enforces trailing slashes. Use the route URLs exactly as shown.

## Vercel environment

Landing form and tracking:

- `GHL_WEBHOOK_URL`
- `PUBLIC_META_PIXEL_ID`
- `PUBLIC_GOOGLE_TAG_ID`

Exercise.com provisioning:

- `EDEN_WEBHOOK_SECRET`
- `EXERCISE_API_BASE_URL`
- `EXERCISE_API_KEY`
- `EXERCISE_API_TOKEN`, or `EXERCISE_EMAIL` and `EXERCISE_PASSWORD`
- `EXERCISE_TRIAL_PLAN_ID`
- `EXERCISE_LOGIN_URL`
- `SLACK_ALERTS_WEBHOOK`

Optional sandbox variables are `ALLOW_PROVISION_TEST`, `EXERCISE_SANDBOX_API_BASE_URL`, `EXERCISE_SANDBOX_API_KEY`, `EXERCISE_SANDBOX_API_TOKEN`, `EXERCISE_SANDBOX_EMAIL`, `EXERCISE_SANDBOX_PASSWORD`, and `EXERCISE_SANDBOX_TRIAL_PLAN_ID`.

## GHL workflow

1. Trigger when a contact receives the `eden_live_trial` tag.
2. POST JSON to `https://landing.edenhealthclubs.com/api/provision-trial/`.
3. Send `X-Eden-Webhook-Secret` with the same value as `EDEN_WEBHOOK_SECRET`.
4. Include `first_name`, `last_name`, `email`, `phone`, `state`, `ghl_contact_id`, and `trial_start_date`.
5. Store `exercise_com_user_id` and `exercise_com_login_url` from the response.
6. Enable retries for non-2xx responses. The provisioner is idempotent by exact email.

## Checks

Missing secret must return `401`:

```bash
curl -i https://landing.edenhealthclubs.com/api/provision-trial/ \
  -H 'Content-Type: application/json' \
  -d '{"first_name":"Eden"}'
```

Happy path after the production secret and trial plan are configured:

```bash
curl -i https://landing.edenhealthclubs.com/api/provision-trial/ \
  -H 'Content-Type: application/json' \
  -H 'X-Eden-Webhook-Secret: YOUR_SECRET' \
  -d '{"first_name":"Eden","last_name":"Test","email":"eden.test@example.com","phone":"7205550199","state":"CO","ghl_contact_id":"ghl-test-1","trial_start_date":"2026-08-10"}'
```

Use `state: "FL"` to verify `waitlist_state`; Wave 1 states receive `licensed_state`.

## Failure response

1. Find the request ID in the GHL webhook attempt and Vercel logs.
2. Search for `service=eden-live-provisioner`; email and phone are logged only as 12-character SHA-256 hashes.
3. For `401`, repair the shared-secret header. For `400`, repair and replay the payload.
4. For auth failures, verify the Exercise.com org token and API token or service credentials.
5. For plan failures, confirm `EXERCISE_TRIAL_PLAN_ID` is the numeric ID for `Eden Live Trial - 7 Day`.
6. Confirm the Slack alert reached `#ops-alerts`, resolve the error, and replay the GHL action.
7. Confirm GHL stores the returned Exercise.com user ID and login URL.

Exercise.com calls retry three times with exponential backoff. Configure a Vercel Log Drain with at least 30 days of retention before production traffic.
