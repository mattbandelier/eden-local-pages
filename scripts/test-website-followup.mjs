import test from 'node:test';
import assert from 'node:assert/strict';
import { websiteFollowupRoute, websiteFollowupDecision, WEBSITE_FOLLOWUP_CONSENT_VERSION } from '../src/lib/website-followup.ts';
import { routeWebsiteFollowup } from '../src/lib/server/website-followup.ts';

const iv = { workflowKey: 'website_iv_visit_v1', service: 'iv-therapy', sourcePage: 'https://landing.edenhealthclubs.com/lp/iv-therapy-denver/?eden_workflow=website_iv_visit_v1', followupConsent: true, consentVersion: WEBSITE_FOLLOWUP_CONSENT_VERSION, submittedAt: '2026-11-10T22:00:00.000Z', attributionEventId: 'isolated-test' };
const contact = { id: 'test-contact', dnd: false, dndSettings: { SMS: { status: 'inactive' }, Call: { status: 'inactive' }, Email: { status: 'inactive' } }, tags: [] };

test('IV route cannot accept another service or another form path', () => {
  assert.equal(websiteFollowupRoute(iv).workflowId, 'c33dd82d-4b1a-4909-bf87-27924a179e73');
  for (const service of ['hair-loss-consult','peptide-therapy','female-bhrt','male-trt','medical-weight-loss','nad-iv-therapy']) assert.equal(websiteFollowupRoute({...iv, service}), null);
  assert.equal(websiteFollowupRoute({...iv, sourcePage:'/female-bhrt/'}), null);
  assert.equal(websiteFollowupRoute({...iv, workflowKey:null}), null);
  assert.equal(websiteFollowupRoute({...iv, workflowKey:'__proto__'}), null);
});
test('Hair has a distinct route and never resolves to IV', () => {
  const hair = {...iv, workflowKey:'website_hair_consult_v1', service:'hair-loss-consult', sourcePage:'https://landing.edenhealthclubs.com/hair-loss-consult/greenwood-village/'};
  assert.equal(websiteFollowupRoute(hair).workflowId,'f23ade4d-6bda-435d-bbeb-acf98bc72f7e');
});
test('consent, release switch, all-channel and per-channel DND fail closed', () => {
  assert.equal(websiteFollowupDecision(iv, contact, true),'enroll');
  assert.equal(websiteFollowupDecision(iv, contact, false),'not_activated');
  assert.equal(websiteFollowupDecision({...iv,followupConsent:false},contact,true),'no_consent');
  assert.equal(websiteFollowupDecision({...iv,consentVersion:'old'},contact,true),'no_consent');
  assert.equal(websiteFollowupDecision(iv,null,true),'dnd_unverified');
  assert.equal(websiteFollowupDecision(iv,{id:'test-contact'},true),'dnd_unverified');
  assert.equal(websiteFollowupDecision(iv,{...contact,dnd:true},true),'opted_out');
  for (const channel of ['SMS','Call','Email','sms','call','email']) assert.equal(websiteFollowupDecision(iv,{...contact,dndSettings:{[channel]:{status:'active'}}},true),'opted_out');
  assert.equal(websiteFollowupDecision(iv,{...contact,tags:['booked appointment']},true),'already_booked');
});

function mock(contactData = contact, options = {}) {
  const calls=[];
  const fetcher=async(url, init={})=>{
    calls.push({url, ...init, body:init.body ? JSON.parse(init.body) : undefined});
    if (!init.method) return new Response(JSON.stringify({contact:contactData}),{status:options.readFails ? 500 : 200});
    if (url.endsWith('/notes')) return new Response('{}',{status:options.noteFails ? 500 : 201});
    if (url.includes('/workflow/')) return new Response(JSON.stringify({succeeded:!options.enrollFails}),{status:200});
    if (url.endsWith('/tasks')) return new Response('{}',{status:201});
    throw new Error('Unexpected request '+url);
  };
  return {calls,fetcher};
}
test('eligible IV is recorded before exactly one IV enrollment; never calls webhook or shared workflow',async()=>{
  const m=mock();
  assert.equal(await routeWebsiteFollowup({token:'test',contactId:'test-contact',payload:iv,enabled:true,fetcher:m.fetcher}),true);
  assert.deepEqual(m.calls.map(c=>c.method||'GET'),['GET','POST','POST']);
  assert.ok(m.calls[1].url.endsWith('/notes'));
  assert.ok(m.calls[2].url.endsWith('/workflow/c33dd82d-4b1a-4909-bf87-27924a179e73'));
  const evidence=JSON.parse(m.calls[1].body.body);
  assert.equal(evidence.consent,true); assert.equal(evidence.consent_version,WEBSITE_FOLLOWUP_CONSENT_VERSION);
});
test('unchecked consent, DND and unpublished release still save staff task and never enroll',async()=>{
  for (const [payload,c,enabled] of [[{...iv,followupConsent:false},contact,true],[iv,{...contact,dnd:true},true],[iv,contact,false]]) {
    const m=mock(c);
    assert.equal(await routeWebsiteFollowup({token:'test',contactId:'test-contact',payload,enabled,fetcher:m.fetcher}),true);
    assert.ok(m.calls.at(-1).url.endsWith('/tasks'));
    assert.equal(m.calls.some(c=>c.url.includes('/workflow/')),false);
    assert.equal(m.calls.some(c=>c.method==='PUT'),false);
  }
});
test('failed consent archive prevents enrollment; failed enrollment creates a staff review task',async()=>{
  const m=mock(contact,{noteFails:true});
  assert.equal(await routeWebsiteFollowup({token:'test',contactId:'test-contact',payload:iv,enabled:true,fetcher:m.fetcher}),false);
  assert.equal(m.calls.some(c=>c.url.includes('/workflow/')),false);
  const n=mock(contact,{enrollFails:true});
  assert.equal(await routeWebsiteFollowup({token:'test',contactId:'test-contact',payload:iv,enabled:true,fetcher:n.fetcher}),true);
  assert.ok(n.calls.at(-1).url.endsWith('/tasks'));
});
test('unreadable DND results in staff task only',async()=>{
  const m=mock(contact,{readFails:true});
  assert.equal(await routeWebsiteFollowup({token:'test',contactId:'test-contact',payload:iv,enabled:true,fetcher:m.fetcher}),true);
  assert.equal(m.calls.some(c=>c.url.includes('/workflow/')),false);
});
