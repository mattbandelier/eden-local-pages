# Phase 5 Spec — GTM, GA4, Google Ads Conversion Tracking
Repo: eden-local-pages Status: MVP live in production. Phase 5 turns on analytics + conversion attribution. ADR anchors: ARCHITECTURE.md ADR-009 (GTM as single tag manager), ADR-010 (no client-side JS unless necessary), ADR-014 (LegitScript compliance).


## 1. Goal
After Phase 5:

Every page on landing.edenhealthclubs.com loads the in-house GTM container (GTM-5ZZLQFMN).
GA4 receives pageviews and custom events: lead_submit, lead_submit_attempt, lead_submit_error, phone_click, plus engagement signals.
Google Ads conversion tracking fires on lead_submit and is verified end-to-end (no longer shows as "not fully configured" in Google Ads).
Enhanced Conversions are wired (hashed email + phone passed through the conversion event), enabling Google Ads to match offline closed-won conversions back to the original ad click.
Lead attribution chain works in production: a click on a Google Ad with a unique gclid → landing page → lead form submit → GHL receives the lead with gclid + UTMs → Google Ads conversion fires with enhanced conversion data → the gclid is matched back to the campaign for true ROAS measurement.

What this phase does NOT do:

Build custom GA4 dashboards (post-launch optimization)
Server-side tagging (Phase 8+ if relevant)
Cookie consent banner (Phase 8+ — currently relying on GHL workflow's TCPA opt-in for SMS; GDPR/CCPA for analytics deferred unless legal counsel flags it)


## 2. Your tracking IDs (canonical reference)
These get used throughout the GTM tag configuration. Copy from here verbatim:



## 3. Prerequisites
Before starting:

The MVP commit is deployed on Vercel (your push from earlier is live).
Verify the lead form end-to-end with a real test lead from https://landing.edenhealthclubs.com/iv-therapy/littleton/. This is the open item from MVP launch — do it now if you haven't. Confirm the lead lands in GHL with full field context. Phase 5 verification depends on knowing the form chain works.
You are signed into Google Tag Manager with admin access to the Eden Health Club (in-house) account / Eden Health Club — Landing Pages container.
You are signed into Google Analytics with admin access to the new in-house GA4 property.
You are signed into Google Ads with admin access to account 876-346-6047.


## 4. Code changes — BaseLayout.astro
This is the only code change in Phase 5. Codex/Claude Code applies this exact patch.
### Step 4.1 — Add env var to Vercel
In Vercel dashboard → eden-local-pages project → Settings → Environment Variables:

Name: PUBLIC_GTM_CONTAINER_ID
Value: GTM-5ZZLQFMN
Environments: Production + Preview + Development
Type: Plain (not sensitive — container IDs are public anyway)

The PUBLIC_ prefix is required by Astro/Vite to expose the var to client-rendered HTML.
### Step 4.2 — Update BaseLayout.astro
Add the GTM snippet in two places: <head> (the loader) and immediately after <body> opens (the noscript fallback). The container ID comes from the env var, with a graceful no-op when missing.

In src/layouts/BaseLayout.astro, add to the frontmatter:

const gtmId = import.meta.env.PUBLIC_GTM_CONTAINER_ID;

In the <head> section, add after the existing meta tags / before the closing </head>:

{gtmId && (
	<>
		{/* GTM container */}
		<script is:inline define:vars={{ gtmId }}>
			(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
			new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
			j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
			'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
			})(window,document,'script','dataLayer',gtmId);
		</script>
	</>
)}

In the <body> section, immediately after the opening <body> tag:

{gtmId && (
	<noscript>
		<iframe
			src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
			height="0"
			width="0"
			style="display:none;visibility:hidden"
		></iframe>
	</noscript>
)}
### Step 4.3 — Verify the build
npm run build

Confirm 182 pages still generate cleanly. Open dist/index.html and confirm:

gtm.js?id=GTM-5ZZLQFMN appears in the <head>
The noscript iframe appears immediately after <body>
No leakage of any other env var (especially not GHL_WEBHOOK_URL)
### Step 4.4 — Commit + push
git add src/layouts/BaseLayout.astro
git commit -m "feat(phase-5): inject GTM container in BaseLayout via PUBLIC_GTM_CONTAINER_ID env var"
git push

Vercel auto-deploys. Wait for Ready status before moving to Step 5 — the GTM Preview mode connection in the next step requires the container to be loading on the live site.


## 5. GTM UI configuration
This is the bulk of Phase 5. Done in the GTM web UI at https://tagmanager.google.com — Codex cannot do this for you. Plan ~45–60 minutes.

Open the Eden Health Club — Landing Pages container (GTM-5ZZLQFMN). All steps below happen inside this container's Workspace.
### Step 5.1 — Create built-in variables
Tags need variables to read context from the dataLayer. Enable these built-in variables:

Sidebar → Variables
Top right → Configure (in the Built-In Variables panel)
Check Page URL, Page Hostname, Page Path, Referrer, Click URL, Click Classes, Click ID
Close the panel
### Step 5.2 — Create User-Defined Variables (5 total)
Same Variables page → User-Defined Variables → New

Variable 1 — DLV: service_slug

Type: Data Layer Variable
Name: DLV: service_slug
Data Layer Variable Name: service_slug
Default Value: leave blank
Save

Variable 2 — DLV: suburb_slug

Type: Data Layer Variable
Name: DLV: suburb_slug
Data Layer Variable Name: suburb_slug
Save

Variable 3 — DLV: sms_opt_in

Type: Data Layer Variable
Name: DLV: sms_opt_in
Data Layer Variable Name: sms_opt_in
Save

Variable 4 — DLV: phone_number

Type: Data Layer Variable
Name: DLV: phone_number
Data Layer Variable Name: phone_number
Save

Variable 5 — DLV: error_type

Type: Data Layer Variable
Name: DLV: error_type
Data Layer Variable Name: error_type
Save
### Step 5.3 — Create Triggers (6 total)
Sidebar → Triggers → New for each.

Trigger 1 — All Pages

Type: Page View
Name: Trigger: All Pages
Fires on: All Page Views
Save

Trigger 2 — Custom Event: lead_submit

Type: Custom Event
Name: Trigger: lead_submit
Event name: lead_submit
Save

Trigger 3 — Custom Event: lead_submit_attempt

Type: Custom Event
Name: Trigger: lead_submit_attempt
Event name: lead_submit_attempt
Save

Trigger 4 — Custom Event: lead_submit_error

Type: Custom Event
Name: Trigger: lead_submit_error
Event name: lead_submit_error
Save

Trigger 5 — Custom Event: phone_click

Type: Custom Event
Name: Trigger: phone_click
Event name: phone_click
Save

Trigger 6 — Hostname Filter (Landing Subdomain Only)

Type: Page View
Name: Trigger: Landing Subdomain Only
Fires on: Some Page Views
Filter: Page Hostname equals landing.edenhealthclubs.com
Save

(This last trigger is defensive — ensures tags only fire on the landing subdomain even if the container ID somehow gets included elsewhere. Apply to the GA4 Config tag in Step 5.4.)
### Step 5.4 — Create Tags
Sidebar → Tags → New for each.

Tag 1 — GA4 Configuration

Tag Type: Google Analytics: GA4 Configuration
Name: GA4 — Configuration
Measurement ID: G-80TZN3GM35
Send a page view event when this configuration loads: checked
Configuration Settings: leave default
Fields to Set: leave empty
User Properties: leave empty
Trigger: Trigger: Landing Subdomain Only
Save

Tag 2 — GA4 Event: lead_submit

Tag Type: Google Analytics: GA4 Event
Name: GA4 Event — lead_submit
Configuration Tag: select GA4 — Configuration
Event Name: lead_submit
Event Parameters:
service_slug = {{DLV: service_slug}}
suburb_slug = {{DLV: suburb_slug}}
sms_opt_in = {{DLV: sms_opt_in}}
Trigger: Trigger: lead_submit
Save

Tag 3 — GA4 Event: lead_submit_attempt

Same pattern as Tag 2
Event Name: lead_submit_attempt
Event Parameters: service_slug, suburb_slug
Trigger: Trigger: lead_submit_attempt
Save

Tag 4 — GA4 Event: lead_submit_error

Same pattern
Event Name: lead_submit_error
Event Parameters: service_slug, suburb_slug, error_type = {{DLV: error_type}}
Trigger: Trigger: lead_submit_error
Save

Tag 5 — GA4 Event: phone_click

Same pattern
Event Name: phone_click
Event Parameters: phone_number = {{DLV: phone_number}}, page_path = {{Page Path}}
Trigger: Trigger: phone_click
Save

Tag 6 — Google Ads Conversion Tracking (lead_submit = primary conversion)

Tag Type: Google Ads Conversion Tracking
Name: Google Ads — Conversion: Lead Form Submit
Conversion ID: supply the approved value through the protected deployment configuration
Conversion Label: supply the approved value through the protected deployment configuration
Conversion Value: leave blank (or 0 — per ADR, no value in v1)
Conversion Currency Code: leave blank
Order ID: leave blank
Trigger: Trigger: lead_submit
Save

Tag 7 — Google Ads Conversion: Enhanced Conversions Wiring

Enhanced Conversions enables Google to match offline conversions back to ad clicks even if cookies are blocked. This is configured as a setting on the Conversion Tracking tag created above, not a separate tag.

Open Google Ads — Conversion: Lead Form Submit again
Scroll to Include user-provided data from your website
Check the box
Select Manual configuration
Provide the variable mappings:
Email = create a new Data Layer Variable: DLV: user_email (Data Layer Variable Name: user_email)
Phone Number = create a new Data Layer Variable: DLV: user_phone (Data Layer Variable Name: user_phone)
Save

Note: For these to populate, the LeadForm.astro will need a tiny update to also push hashed user data into the dataLayer when the form succeeds. Codex/Claude Code applies this when the GTM tags are confirmed working — see Step 6.5. Don't sweat it now.
### Step 5.5 — Preview mode test
Top right of GTM → Preview button (next to Submit).

Enter your live URL: https://landing.edenhealthclubs.com/iv-therapy/littleton/
Click Connect
A new browser tab opens with the connected page; Tag Assistant opens in the original tab
In Tag Assistant, you should see:
Container Loaded with GTM-5ZZLQFMN
Page View event firing
GA4 — Configuration tag firing
In the live page tab, fill out the lead form with a real-looking test lead and submit
Watch Tag Assistant for the firing events:
lead_submit_attempt → GA4 Event — lead_submit_attempt fires
On success: lead_submit → both GA4 Event — lead_submit and Google Ads — Conversion: Lead Form Submit fire
Tap the page's phone link if present → phone_click → GA4 Event — phone_click fires

If any tag doesn't fire: check that the corresponding trigger's event name matches exactly (case-sensitive). Check that the DLV variable names match what src/lib/tracking.ts actually pushes.
### Step 5.6 — Submit + publish container
Once Preview mode confirms tags fire correctly:

Top right of GTM → Submit
Version name: v1 — Phase 5 launch tracking
Description: GA4 config, lead_submit/attempt/error events, phone_click, Google Ads conversion + enhanced conversions wiring
Click Publish

Container goes live within 1–2 minutes for end users.


## 6. Verification
### Step 6.1 — GA4 real-time verification
Open GA4 → your property → Reports → Realtime
In a private/incognito window, open https://landing.edenhealthclubs.com/iv-therapy/littleton/
Within 30 seconds, GA4 Realtime should show 1 active user, 1 pageview
Submit a test lead in the same window
Within 30 seconds, GA4 Realtime → Event count by Event name should show lead_submit_attempt followed by lead_submit
### Step 6.2 — Google Ads conversion verification
Open Google Ads → Tools → Conversions
The Landing - Lead Form Submit action's status should change from "Unverified" to "Recording conversions" within ~24 hours of the first real conversion firing
To force a verification test now: use Google's Tag Diagnostics tool from the conversion action detail page
Once status is Recording conversions, conversion tracking is fully live
### Step 6.3 — Enhanced Conversions verification
Google Ads → Tools → Conversions → click Landing - Lead Form Submit
Scroll to Enhanced conversions section
Status should show "Healthy" within 24–48 hours of leads flowing in
If status shows "Unhealthy" or "Pending data", check that DLV: user_email and DLV: user_phone are actually being pushed by src/lib/tracking.ts on form success (see Step 6.5)
### Step 6.4 — End-to-end attribution test (paid traffic loop)
Once Google Ads campaigns are running, perform this test once per quarter to confirm the full chain:

Click one of your own Google Ads using a phone or non-cached browser
The destination URL will have a gclid parameter
Submit a real-looking test lead from the destination landing page
Within 30 seconds: GHL receives the lead with gclid populated
Within 24 hours: Google Ads attributes 1 conversion to the campaign that produced the click
Result: closed loop attribution. You can now answer "which ad produced which lead?"
### Step 6.5 — Patch LeadForm.astro for enhanced conversions
After tags are confirmed working in Steps 6.1–6.3, apply this small code change to enable enhanced conversions:

In src/components/content/LeadForm.astro, find the success block in the <script> (where trackLeadSubmit is called). Add immediately before that call:

// Push email + phone to dataLayer for Google Ads Enhanced Conversions
if (typeof window !== "undefined") {
	window.dataLayer = window.dataLayer || [];
	window.dataLayer.push({
		user_email: payload.email,
		user_phone: payload.phone,
	});
}

Commit:

git add src/components/content/LeadForm.astro
git commit -m "feat(phase-5): push hashed user data to dataLayer for Google Ads Enhanced Conversions"
git push

Wait 24–48 hours for Google to evaluate and update Enhanced Conversions status to Healthy.


## 7. Acceptance criteria
Phase 5 is done when all of the following are true:

npm run build passes; 182 pages generate; GTM snippet in <head> and noscript in <body> of every generated HTML page.
Tag Assistant Preview shows GA4 Config + all 4 Event tags + Google Ads Conversion tag firing on the expected user actions on https://landing.edenhealthclubs.com/iv-therapy/littleton/.
GA4 Realtime receives pageviews + lead_submit events from real test traffic.
Google Ads conversion action Landing - Lead Form Submit status moves to Recording conversions within 24 hours of first real lead conversion.
Enhanced Conversions status shows Healthy within 48 hours of LeadForm.astro patch (Step 6.5) shipping + first real leads flowing.
End-to-end attribution test (Step 6.4) confirms gclid round-trips correctly through GHL and back to Google Ads.


## 8. Time estimates
Code (Step 4): ~15 minutes Codex/Claude Code + verify build
GTM UI configuration (Step 5): ~45–60 minutes you in the GTM UI (the bulk of Phase 5)
Preview mode verification (Step 5.5): ~15 minutes
Publish container + first GA4/Ads verification (Steps 6.1–6.3): ~30 minutes active + ~24 hours waiting for Google Ads conversion status update
LeadForm enhanced-conversions patch (Step 6.5): ~10 minutes Codex/Claude Code + verify

Total active time: ~2 hours. Full verification including Google Ads status confirmation: ~24–48 hours wall-clock.


## 9. What's next after Phase 5
Phase 5 closes the analytics + attribution loop. Post-Phase-5 priorities:

Run real Google Ads campaigns at modest budget ($1.5K–$3K/month per the executive brief recommendation) to start accumulating conversion data.
Build a GA4 Looker Studio dashboard showing leads-per-service, leads-per-suburb, cost-per-lead-by-campaign. ~2 hours of work, post-launch.
Phase 6 (custom imagery) when there's enough traffic data to identify which combo pages should get high-quality hero photography first.
Phase 7 polish (a11y final pass, Search Console manual submission, schema.org validation final pass).
Brand alignment audit of the landing pages vs the main site (visual + voice gap analysis). Tell me when you want this — I'll fetch a representative landing page and the closest main-site equivalent, compare them, and produce a prioritized punch list of small UX fixes.

Phase 8+ candidates (post-validation):

LegitScript certification (unlocks drug-name keywords)
Server-side tagging migration (better ad block resistance)
A/B testing infrastructure
Per-neighborhood pages for high-performing suburbs
aggregateRating schema once a real review feed exists


| Asset | Value |
| --- | --- |
| GTM container ID | GTM-5ZZLQFMN |
| GA4 Measurement ID | G-80TZN3GM35 |
| Google Ads account customer ID | 876-346-6047 |
| Google Ads conversion destination | Vercel env var `PUBLIC_GOOGLE_ADS_BOOKING_SEND_TO` |
| Google Ads conversion label | Included in Vercel env var `PUBLIC_GOOGLE_ADS_BOOKING_SEND_TO` |
| Google Ads conversion action name | Landing - Lead Form Submit |
