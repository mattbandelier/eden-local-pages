// Exercises the real API handler with isolated GHL responses. No requests leave this process.
import assert from 'node:assert/strict';
import { createServer } from 'vite';
const root = new URL('../', import.meta.url).pathname;
const defs = {
  GHL_PRIVATE_INTEGRATION_TOKEN: 'isolated-fixture-token',
  GHL_LOCATION_ID: 'isolated-location',
  GHL_CONCIERGE_COORDINATOR_USER_ID: 'isolated-coordinator',
  GHL_ENABLE_WEBSITE_HAIR_IV_FOLLOWUP: 'true',
};
const server = await createServer({root,configFile:false,server:{middlewareMode:true},appType:'custom',
  define:Object.fromEntries(Object.entries(defs).map(([k,v])=>[`import.meta.env.${k}`,JSON.stringify(v)]))});
const realFetch = globalThis.fetch;
let calls=[], dnd=false, failArchive=false;
globalThis.fetch = async (url, init={}) => {
  const body = init.body ? JSON.parse(init.body) : undefined;
  calls.push({url:String(url),method:init.method||'GET',body});
  assert.ok(String(url).startsWith('https://services.leadconnectorhq.com/'), 'No webhook or unrelated destination');
  if(String(url).endsWith('/contacts/upsert')) return Response.json({contact:{id:'fixture-contact'}});
  if(String(url).endsWith('/contacts/fixture-contact')) return Response.json({contact:{id:'fixture-contact',dnd,tags:[]}});
  if(String(url).endsWith('/notes')) return Response.json({}, {status:failArchive?500:201});
  if(String(url).endsWith('/tasks')) return Response.json({}, {status:201});
  if(String(url).includes('/workflow/')) return Response.json({succeeded:true});
  throw new Error(`Unexpected API request: ${url}`);
};
let ip=0;
const base={firstName:'Isolated',lastName:'Fixture',email:'fixture@example.invalid',phone:'3035550100',
  followupConsent:true,consentVersion:'eden-website-hair-iv-2026-11-10',utmSource:'edenhealthclubs',
  utmMedium:'website',utmCampaign:'iv-offer',attributionEventId:'isolated-route-event',
  workflowKey:'website_iv_visit_v1',service:'iv-therapy',
  sourcePage:'https://landing.edenhealthclubs.com/lp/iv-therapy-denver/'};
try {
  const { POST } = await server.ssrLoadModule('/src/pages/api/lead.ts');
  async function submit(payload) {
    calls=[];
    return POST({request:new Request('http://localhost/api/lead',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(payload)}),clientAddress:`fixture-${++ip}`});
  }
  for(const [payload,workflow] of [
    [base,'c33dd82d-4b1a-4909-bf87-27924a179e73'],
    [{...base,workflowKey:'website_hair_consult_v1',service:'hair-loss-consult',sourcePage:'https://landing.edenhealthclubs.com/hair-loss-consult/greenwood-village/'},'f23ade4d-6bda-435d-bbeb-acf98bc72f7e']
  ]) {
    const res=await submit(payload); assert.equal(res.status,200);
    const enrollments=calls.filter(c=>c.url.includes('/workflow/'));
    assert.equal(enrollments.length,1); assert.ok(enrollments[0].url.endsWith(`/workflow/${workflow}`));
    const upsert=calls[0].body;
    assert.equal('customFields' in upsert,false,'Existing ad attribution must not be overwritten');
    assert.equal('source' in upsert,false,'Existing contact source must not be overwritten');
    assert.equal('dnd' in upsert,false,'Existing opt-outs must not be overwritten');
    const notes=calls.filter(c=>c.url.endsWith('/notes'));
    assert.equal(notes.length,2,'Archive both analytics attribution and consent');
    assert.equal(JSON.parse(notes[0].body.body).payload.event_id,payload.attributionEventId);
    assert.equal(JSON.parse(notes[1].body.body).workflow_id,workflow);
    console.log(`PASS: complete request routes only to ${payload.service}; attribution and consent preserved`);
  }
  for(const payload of [{...base,followupConsent:false},{...base,consentVersion:'outdated'}]) {
    assert.equal((await submit(payload)).status,200);
    assert.equal(calls.some(c=>c.url.includes('/workflow/')),false);
    assert.ok(calls.some(c=>c.url.endsWith('/tasks')));
  }
  console.log('PASS: declined or stale consent captures the inquiry for staff without automated outreach');
  dnd=true;
  assert.equal((await submit(base)).status,200); assert.equal(calls.some(c=>c.url.includes('/workflow/')),false);
  dnd=false;
  console.log('PASS: existing opt-out remains respected');
  for(const payload of [{...base,service:'nad-iv-therapy'},{...base,sourcePage:'/female-bhrt/'},{...base,workflowKey:'website_iv_unknown'}]) {
    assert.equal((await submit(payload)).status,400); assert.equal(calls.length,0);
  }
  console.log('PASS: mismatched or unknown website routes reject before any contact write');
  failArchive=true;
  assert.equal((await submit(base)).status,502); assert.equal(calls.some(c=>c.url.includes('/workflow/')),false);
  console.log('PASS: attribution archive failure cannot trigger outreach');
} finally {
  globalThis.fetch=realFetch;
  await server.close();
}
