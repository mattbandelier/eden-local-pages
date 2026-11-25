import assert from 'node:assert/strict';
import { createServer } from 'vite';

const root = new URL('../', import.meta.url).pathname;
const defs = {
  GHL_PRIVATE_INTEGRATION_TOKEN: 'isolated-fixture-token',
  GHL_LOCATION_ID: 'isolated-location',
  GHL_CONCIERGE_COORDINATOR_USER_ID: 'isolated-coordinator',
  GLP_LEADS_ENABLED: 'true',
};
const server = await createServer({
  root, configFile: false, server: { middlewareMode: true }, appType: 'custom',
  define: Object.fromEntries(Object.entries(defs).map(([key, value]) => [`import.meta.env.${key}`, JSON.stringify(value)])),
});
const realFetch = globalThis.fetch;
let calls = [];
globalThis.fetch = async (url, init = {}) => {
  const endpoint = String(url);
  calls.push({ endpoint, method: init.method || 'GET', body: init.body ? JSON.parse(init.body) : null });
  assert.ok(endpoint.startsWith('https://services.leadconnectorhq.com/'));
  if (endpoint.endsWith('/contacts/upsert')) return Response.json({ contact: { id: 'fixture-contact' } });
  if (endpoint.endsWith('/notes')) return Response.json({}, { status: 201 });
  if (endpoint.endsWith('/tags')) return Response.json({}, { status: 201 });
  if (endpoint.includes('/workflow/')) return Response.json({ succeeded: true });
  throw new Error(`Unexpected API request: ${endpoint}`);
};

try {
  const { POST } = await server.ssrLoadModule('/src/pages/api/lead.ts');
  for (const [service, workflowKey, offerName, sourceTag, workflowId] of [
    ['glp-1-intro-offer', 'glp1_intro_3_month', 'GLP-1 Three-Month Intro', null, 'a6319875-f4f3-4bc9-b67d-fef23981b1d4'],
    ['glp-1-microdosing-inquiry', 'glp1_lower_dose_inquiry', 'GLP-1 Lower-Dose Consultation', null, '1526f6a7-c4cd-48e9-9de9-f9b59e3a9e63'],
    ['glp-1-semaglutide-offer', 'glp1_semaglutide_3_month', 'Semaglutide Three-Month Intro', 'glp1_sema_3_month_inquiry', '570cbcdf-9adf-45a9-9b72-42705fc33ebc'],
    ['glp-1-tirzepatide-offer', 'glp1_tirzepatide_3_month', 'Tirzepatide Three-Month Intro', 'glp1_tirz_3_month_inquiry', '515e8efe-a4d4-4c99-9fcd-f4c7d3deb971'],
  ]) {
    calls = [];
    const response = await POST({
      request: new Request('http://localhost/api/lead', {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          firstName: 'Isolated', lastName: 'Fixture', email: 'fixture@example.invalid', phone: '3035550100',
          service, workflowKey, offerName, smsOptIn: true, sourcePage: `https://landing.edenhealthclubs.com/lp/${service}/`,
        }),
      }),
      clientAddress: `fixture-${service}`,
    });
    assert.equal(response.status, 200);
    const upsert = calls.find(({ endpoint }) => endpoint.endsWith('/contacts/upsert'));
    assert.ok(upsert);
    assert.deepEqual(upsert.body.customFields.filter(({ id }) => id === 'praFKSA8J4PW5Zl6S5Ul'), [
      { id: 'praFKSA8J4PW5Zl6S5Ul', field_value: offerName },
    ]);
    const tags = calls.find(({ endpoint, method }) => endpoint.endsWith('/tags') && method === 'POST');
    if (sourceTag) assert.ok(tags.body.tags.includes(sourceTag));
    assert.ok(tags.body.tags.includes('glp1_sms_opt_in'));
    assert.equal(calls.filter(({ endpoint }) => endpoint.endsWith('/notes')).length, 1);
    assert.equal(calls.filter(({ endpoint }) => endpoint.includes('/workflow/')).length, 1);
    assert.ok(calls.some(({ endpoint }) => endpoint.endsWith(`/workflow/${workflowId}`)));
  }
} finally {
  globalThis.fetch = realFetch;
  await server.close();
}
