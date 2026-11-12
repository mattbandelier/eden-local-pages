# GLP-1 lead follow-up | draft for GHL

These messages are for the two GLP-1 landing pages only. The isolated GHL workflow (`9b637d94-b172-4a35-bafb-8403a4761575`) is Published with no trigger, re-entry off, stop-on-response off, five Eden-branded emails at days 0, 2, 4, 7, and 12, a day-0 callback, and a tag-gated day-0 SMS. Direct enrollment is performed by the site's lead endpoint. The emails use the live Eden logo in a deep-green banner, light-green service strip, full clinic address, and GHL's enabled default unsubscribe footer. Their buttons call Eden to arrange the private $0 consultation; do not claim online self-booking. The older copied GLP drafts are not targets. Production form gates remain off. A preview-only flag is staged for testing, but end-to-end delivery, call routing, and booking stop are not proven yet. Never imply that a lower dose, medication, or prescription is guaranteed. Do not put health history, dose, or other sensitive details in SMS or subject lines.

## Zenoti consultation routing

On Nov 12, Zenoti service `GLP-1 Initial Consultation` (`8d8ce50e-be73-4d15-93b4-623d2d419b9b`) was created for Greenwood Village at $0 and set to 30 minutes. Online Booking and Allow customer to book this service are off. Staff must book the requested consultation; do not link to the older public $100 Medical Weight Loss Consultation or promise an online self-booking link. The visible service resources are Catherine Hosteny, Katherine Morrison, Mya Sedillo, and Test Notifications; Tiffany is absent, but the complete intended provider roster is not yet verified. The old $100 service was not changed.

## Send rules

- Start only after a form lead is accepted into its exact GLP-1 workflow. Do not enroll the same submission in the general weight-loss sequence.
- Emails may go to form submitters who provided an email and have not unsubscribed. SMS requires the optional SMS checkbox and no SMS opt-out. Calls require appropriate contact permission and no call opt-out.
- Stop all follow-up on a verified booking. Stop each channel on its own opt-out. An answered call can end future call attempts without ending permitted email or SMS. A voicemail is not an answered call.
- Use Eden's approved sender domain and existing brand email shell: white body, forest-green header/button, dark-green text, Eden logo, readable mobile font, postal address, and unsubscribe footer. No brown text on green backgrounds.
- Matt wants an actionable **Your next step** CTA. Because this service is staff-booked, the email button calls Eden and the lead may reply with a preferred day. Do not send a lead back to the form they already completed.

## Email 1 | Immediately

**Subject:** Let's schedule your Eden visit

**Preview:** Your complimentary first conversation starts here.

**Heading:** Let's get your first visit on the calendar.

Hi {{contact.first_name}},

We received your request for an in-person GLP-1 consultation at Eden in Greenwood Village. The first conversation is complimentary. Call us to find a time, or reply with a day that works and our team will follow up.

You do not need to choose a medication or dose first. Your provider will review your goals and whether treatment or lab work is appropriate.

**Button:** Call to schedule my visit → `tel:+17206057678`

Prefer email? Reply here and tell us a good time to reach you.

## Email 2 | Day 2

**Subject:** What to expect at your first visit

**Preview:** A real conversation before any treatment decision.

**Heading:** Your visit starts with you.

Hi {{contact.first_name}},

At your visit, an Eden provider will review your goals, health history, and questions. Curious about a lower-dose approach? Bring it up; the evidence for GLP-1 microdosing is limited, and your provider can explain what is known and uncertain.

Call to reserve a time, or reply with your preferred day. There is no obligation to start treatment and no prescription is guaranteed. If labs are needed, we will explain the cost before ordering them.

**Button:** Call to schedule my visit → `tel:+17206057678`

## Email 3 | Day 4

**Subject:** Your first 3 months at Eden

**Preview:** See the introductory offer, then book your first visit.

**Heading:** Start with an in-person visit.

Hi {{contact.first_name}},

Your first three months of prescribed compounded medication are $99/month for semaglutide or $129/month for tirzepatide, at any dose your provider prescribes from Eden's available options.

Ready to take the first step? Call to schedule your complimentary in-person consultation in Greenwood Village, or reply with a day that works for you.

**Button:** Call to book my consultation → `tel:+17206057678`

After month 3, regular medication pricing without membership is $249/$349 per month. Optional membership credits may lower the net cost. Treatment and dose depend on provider assessment; a prescription is not guaranteed. Provider-required lab work may cost extra. Compounded drugs are not FDA-approved.

## Email 4 | Day 7

**Subject:** Ready to book your Eden visit?

**Preview:** Bring your questions; we'll help with the next step.

**Heading:** Bring your questions. We'll make time.

Hi {{contact.first_name}},

It is okay to come in with questions rather than a decision. You might ask:

1. Which options, if any, fit my health history and goals?
2. What are the known risks and uncertainties, especially if I am curious about a lower-dose approach?
3. What would the complete cost be after the three-month introductory period?

Reply with a day that works or call us to schedule. Your provider can help you weigh those answers; treatment, dose, and any needed testing are clinical decisions.

**Button:** Call to schedule my visit → `tel:+17206057678`

## Email 5 | Day 12

**Subject:** Your Eden consultation is still available

**Preview:** Reply with a day or call to schedule.

**Heading:** Ready for your first visit?

Hi {{contact.first_name}},

If you are still interested in GLP-1 care, we can help you schedule a complimentary initial consultation in Greenwood Village. Bring questions about treatment, a lower-dose approach, or whether another next step is more appropriate.

Reply with a day that works or call our team. If now is not the right time, no action is needed.

**Button:** Call to schedule my visit → `tel:+17206057678`

## SMS | Opt-in only

**Immediate:** Hi {{contact.first_name}}, this is Eden Health Club. We received your consultation request. We can help find an in-person time in Greenwood Village. Reply with a good time to call, or call 720-605-7678. Reply STOP to opt out.

**Day 3:** Hi {{contact.first_name}}, Eden here. Have questions before scheduling your complimentary consultation? Reply here and our team can help. Reply STOP to opt out.

**Day 8:** Hi {{contact.first_name}}, checking in from Eden. If you still want to talk with a provider, reply here or call 720-605-7678. Reply STOP to opt out.

## Calls and internal alert

- Day 0: one assigned-user callback attempt during staffed hours. Internal label: `GLP-1 intro | {{contact.name}}` or `GLP-1 lower-dose question | {{contact.name}}`.
- Day 3: one additional call only if no answered conversation or booking. Leave one concise voicemail if appropriate: "Hi, this is Eden Health Club returning your consultation request. Please call us at 720-605-7678."
- Do not place another automated call after a confirmed answered conversation. A voicemail does not count as answered. Do not place calls after a verified booking or call opt-out.

## Launch checks

1. The new isolated workflow is Published. Non-SMS leads rejoin the email sequence via Go To. GHL Business Profile has its default unsubscribe link enabled and lists the clinic at 5990 S University Blvd, Greenwood Village, CO 80121; verify the actual delivered footer, sender, and assigned-user call routing. Do not publish the copied general-weight-loss drafts.
2. Send one test lead per page and confirm exactly one workflow enrollment, one first email, and SMS only when opted in.
3. Verify sender, formatting, call assignment, channel opt-outs, and booking-stop timing before publishing workflows or enabling the forms.
4. Matt confirmed clinical/legal approval of the compounded semaglutide/tirzepatide any-prescribed-dose introductory offer and pharmacy-vial imagery. Google emailed on Nov 12 that Dietz account 311-270-1872 was certified for Healthcare and medicines on the requested domain(s), with up to 24 hours for propagation. This is not approval of the new ads or their destinations; verify those separately before paid launch.
5. The existing Zenoti paid-booking-stop job uses an explicit GHL workflow allowlist. [PR #1](https://github.com/mattbandelier/zenoti-google-tracking/pull/1) adding the GLP workflow ID was merged Nov 12; 13 focused tests passed locally. A read-only run of the new version and a real active-to-past transition on a QA booking remain to be verified before claiming the stop works end to end.
