# GLP-1 lead follow-up | draft for GHL

These messages are for the two GLP-1 landing pages only. They are not live in GHL. A new isolated workflow (`9b637d94-b172-4a35-bafb-8403a4761575`) is in Draft with no trigger, re-entry off, stop-on-response off, and five saved, Eden-branded emails at days 0, 2, 4, 7, and 12. The emails use the live Eden logo in a deep-green banner, light-green service strip, full clinic address, and GHL's enabled default unsubscribe footer. One offer-email test reached Matt's approved personal inbox; Matt rejected its pricing-led language. Days 0, 2, 4, and 7 were revised toward a scheduling CTA in the saved GHL draft, but Matt then requested a stronger "Your next step" CTA to a free consultation deep link. That final copy and destination are still blocked. Both new form slugs route to that workflow in the branch; the older copied GLP drafts are not targets. Both public form gates remain off. The SMS, calls, enrollment test, and booking stop are not verified or live. Use the lead's page and selected interest to choose the opening line; never imply that a lower dose, medication, or prescription is guaranteed. Do not put health history, dose, or other sensitive details in SMS or subject lines.

## Launch blocker: complimentary consult does not match Zenoti

On Nov 12, the public Zenoti WEIGHT LOSS category showed only Medical Weight Loss Consultation, Virtual Medical Weight Loss Consultation, and Medical Weight Loss Panel. Selecting the in-person 45-minute consultation and a time displayed a **$100.00** total before BOOK NOW. No complimentary GLP-1 consultation or direct-booking URL was verified. Both GLP preview pages and the GHL draft currently say the initial consultation is complimentary. Do not publish those claims or link an email to the $100 booking as if it were free. Create or configure a genuinely $0 directly bookable GLP-1/medical-weight-loss consultation, verify the checkout total and deep link, then update the landing pages and emails to use that destination. Alternatively, revise all complimentary claims to the actual booked price after Matt approves the different offer.

## Send rules

- Start only after a form lead is accepted into its exact GLP-1 workflow. Do not enroll the same submission in the general weight-loss sequence.
- Emails may go to form submitters who provided an email and have not unsubscribed. SMS requires the optional SMS checkbox and no SMS opt-out. Calls require appropriate contact permission and no call opt-out.
- Stop all follow-up on a verified booking. Stop each channel on its own opt-out. An answered call can end future call attempts without ending permitted email or SMS. A voicemail is not an answered call.
- Use Eden's approved sender domain and existing brand email shell: white body, forest-green header/button, dark-green text, Eden logo, readable mobile font, postal address, and unsubscribe footer. No brown text on green backgrounds.
- Matt wants an actionable **Your next step** CTA to a directly bookable complimentary consultation, not a "talk through pricing" CTA. The direct link is a launch blocker until Zenoti's checkout shows $0 and the booking-stop event is verified. Do not send a lead back to the form they already completed.

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

1. Finish the new isolated workflow. The five email actions and timing are saved. GHL Business Profile has its default unsubscribe link enabled and lists the clinic at 5990 S University Blvd, Greenwood Village, CO 80121; verify the actual delivered footer and sender before publication. Add opt-in-only SMS and assigned-user calls. Do not publish the copied general-weight-loss drafts.
2. Send one test lead per page and confirm exactly one workflow enrollment, one first email, and SMS only when opted in.
3. Verify sender, formatting, call assignment, channel opt-outs, and booking-stop timing before publishing workflows or enabling the forms.
4. Matt confirmed clinical/legal approval of the compounded semaglutide/tirzepatide any-prescribed-dose introductory offer and pharmacy-vial imagery. Google emailed on Nov 12 that Dietz account 311-270-1872 was certified for Healthcare and medicines on the requested domain(s), with up to 24 hours for propagation. This is not approval of the new ads or their destinations; verify those separately before paid launch.
5. The existing Zenoti paid-booking-stop job uses an explicit GHL workflow allowlist. A narrow update adding the GLP workflow ID is committed on `fix/glp-booking-stop-coverage` in `zenoti-google-tracking`, with the focused unit tests passing. It is not merged/deployed. Prove an active-to-past transition on a test booking after deployment before opening lead capture.
