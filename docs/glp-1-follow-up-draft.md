# GLP-1 lead follow-up | draft for GHL

These messages are for the two GLP-1 landing pages only. They are not live in GHL. Use the lead's page and selected interest to choose the opening line; never imply that a lower dose, medication, or prescription is guaranteed. Do not put health history, dose, or other sensitive details in SMS or subject lines.

## Send rules

- Start only after a form lead is accepted into its exact GLP-1 workflow. Do not enroll the same submission in the general weight-loss sequence.
- Emails may go to form submitters who provided an email and have not unsubscribed. SMS requires the optional SMS checkbox and no SMS opt-out. Calls require appropriate contact permission and no call opt-out.
- Stop all follow-up on a verified booking. Stop each channel on its own opt-out. An answered call can end future call attempts without ending permitted email or SMS. A voicemail is not an answered call.
- Use Eden's approved sender domain and existing brand email shell: white body, forest-green header/button, dark-green text, Eden logo, readable mobile font, postal address, and unsubscribe footer. No brown text on green backgrounds.
- Booking CTA remains **reply or call 720-605-7678** until a direct, working Zenoti consultation link and booking-stop event are verified. Do not send a lead back to the form they already completed.

## Email 1 | Immediately

**Subject:** Your consultation request at Eden

**Preview:** We received your request. Here is the next step.

**Heading:** Let's talk through your options.

Hi {{contact.first_name}},

Thanks for reaching out to Eden Health Club. Our Greenwood Village team received your request for an in-person GLP-1 consultation. We will follow up to help find a time that works for you.

You do not need to choose a medication or dose before meeting a provider. The initial conversation is complimentary; your provider will review whether treatment and any lab work are appropriate.

**Button:** Call Eden to find a time → `tel:+17206057678`

Prefer email? Reply here and tell us a good time to reach you.

## Email 2 | Day 2

**Subject:** What happens at your first Eden visit

**Preview:** A real conversation before any treatment decision.

**Heading:** Start with the whole picture.

Hi {{contact.first_name}},

Your first visit is a chance to discuss your goals, health history, and questions with an Eden provider in Greenwood Village. If you asked about a lower-dose approach, bring that up. The evidence for GLP-1 microdosing is limited, and your provider can explain what is known and what remains uncertain.

There is no obligation to start treatment, and no prescription is guaranteed. If labs are needed, the team will explain the cost before ordering them.

**Button:** Call about my consultation → `tel:+17206057678`

## Email 3 | Day 4

**Subject:** A clearer look at your options

**Preview:** The first three months and the month-four choices, clearly.

**Heading:** No guessing about the offer.

Hi {{contact.first_name}},

If a provider prescribes an eligible compounded GLP-1 medication, Eden's introductory medication price is $99 per month for compounded semaglutide or $129 per month for compounded tirzepatide for months 1 through 3. The introductory price is the same for any dose the provider prescribes within Eden's available options. Asking about a lower-dose approach does not create a separate price.

After month 3, the regular medication prices are $249 or $349 per month without membership. Membership pricing and credits may change your net medication cost; our team can explain the complete billing before you decide. Provider-required lab work may cost extra. Compounded drugs are not FDA-approved.

**Button:** Talk through the pricing → `tel:+17206057678`

## Email 4 | Day 7

**Subject:** Questions worth bringing to your visit

**Preview:** Three useful questions for your provider.

**Heading:** Make the visit yours.

Hi {{contact.first_name}},

It is okay to come in with questions rather than a decision. You might ask:

1. Which options, if any, fit my health history and goals?
2. What are the known risks and uncertainties, especially if I am curious about a lower-dose approach?
3. What would the complete cost be after the three-month introductory period?

Your provider can help you weigh those answers. Treatment, dose, and any needed testing are clinical decisions, not promises made by this email.

**Button:** Call Eden with a question → `tel:+17206057678`

## Email 5 | Day 12

**Subject:** Still want to talk through your options?

**Preview:** We are here when you are ready for a conversation.

**Heading:** A conversation is a good first step.

Hi {{contact.first_name}},

If GLP-1 care is still on your mind, we would be glad to help you arrange a complimentary initial consultation in Greenwood Village. You can ask about standard treatment, lower-dose questions, or whether a different next step makes more sense.

Just reply to this email or call our team. If now is not the right time, no action is needed.

**Button:** Call Eden → `tel:+17206057678`

## SMS | Opt-in only

**Immediate:** Hi {{contact.first_name}}, this is Eden Health Club. We received your consultation request. We can help find an in-person time in Greenwood Village. Reply with a good time to call, or call 720-605-7678. Reply STOP to opt out.

**Day 3:** Hi {{contact.first_name}}, Eden here. Have questions before scheduling your complimentary consultation? Reply here and our team can help. Reply STOP to opt out.

**Day 8:** Hi {{contact.first_name}}, checking in from Eden. If you still want to talk with a provider, reply here or call 720-605-7678. Reply STOP to opt out.

## Calls and internal alert

- Day 0: one assigned-user callback attempt during staffed hours. Internal label: `GLP-1 intro | {{contact.name}}` or `GLP-1 lower-dose question | {{contact.name}}`.
- Day 3: one additional call only if no answered conversation or booking. Leave one concise voicemail if appropriate: "Hi, this is Eden Health Club returning your consultation request. Please call us at 720-605-7678."
- Do not place another automated call after a confirmed answered conversation. A voicemail does not count as answered. Do not place calls after a verified booking or call opt-out.

## Launch checks

1. Replace copied general-weight-loss conditions and messages in the two draft workflows. Ensure direct enrollment from each page reaches the first action.
2. Send one test lead per page and confirm exactly one workflow enrollment, one first email, and SMS only when opted in.
3. Verify sender, formatting, call assignment, channel opt-outs, and booking-stop timing before publishing workflows or enabling the forms.
4. Confirm the applicable Google Ads healthcare certification and page review status separately. A draft or acknowledged application is not approval.
