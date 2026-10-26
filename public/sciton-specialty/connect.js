(() => {
  const variant = document.getElementById('app').dataset.variant;
  const interests = { hair: 'Forever BARE BBL hair reduction', acne: 'Forever Clear acne care - BBL booking service', skintyte: 'SkinTyte' };
  const incoming = new URLSearchParams(location.search);
  const attributionKeys = ['gclid', 'gbraid', 'wbraid', 'fbclid', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
  document.querySelector('.draft-nav')?.remove();
  document.querySelector('.preview-note')?.remove();
  document.querySelector('.detail-photo').src = '/assets/eden-health-club-reception.webp';
  document.querySelectorAll('.example-layout img').forEach(img => {
    img.src = '/sciton-specialty/' + img.getAttribute('src');
  });
  const call = document.querySelector('.specialty-call');
  call.innerHTML = '<span>Call Eden</span><span class="specialty-call-number">720-605-7678</span>';
  document.querySelector('.footer .wrap span:last-child').innerHTML = 'Results vary. Clinical assessment required. <a href="https://edenhealthclubs.com/privacy-policy/">Privacy</a>';

  const services = {
    hair: [
      ['Bikini', '119a876a-f20c-4a5c-a66d-a9037188c98e'],
      ['Brazilian', '28ed8c0a-b8ed-45af-b254-40652e4c267d'],
      ['Lip & chin', '39365b3f-02ce-4df1-8598-4c7931f4fdd0'],
      ['Underarms', 'a44971e3-3ee6-4d76-9a4a-07961af53360']
    ],
    acne: [
      ['BBL Face', 'be36fade-09e5-42e1-902f-1c490396ccc0'],
      ['BBL Face & neck', 'e1f70e0d-dbce-4a66-a54f-917da4ae433b'],
      ['BBL Face, neck & chest', 'd58533d6-1740-4789-8f83-0028a29b4d65']
    ],
    skintyte: [['SkinTyte Face', 'df1ddc9c-b5be-4744-9322-a2e8ba1015d6']]
  };
  const booking = document.createElement('section');
  booking.id = 'booking';
  booking.className = 'section specialty-booking';
  const wrap = document.createElement('div');
  wrap.className = 'wrap';
  wrap.innerHTML = '<p class="eyebrow">Your next step</p><h2>Choose your appointment</h2>';
  const note = document.createElement('p');
  note.textContent = variant === 'acne'
    ? 'Acne-care appointments use our BBL booking services. Please include acne care in your booking notes so the team can confirm the right appointment.'
    : 'Choose an available treatment area below. For another area or help choosing, call Eden and we will guide you.';
  wrap.append(note);
  const links = document.createElement('div');
  links.className = 'specialty-booking-links';
  for (const [label, id] of services[variant]) {
    const link = document.createElement('a');
    const url = new URL('https://edenhealthclubs.zenoti.com/webstoreNew/services/a1fda69e-77f9-4077-bb8a-3b06349b6af3');
    url.searchParams.set('serviceid', id);
    for (const name of attributionKeys) {
      const value = incoming.get(name);
      if (value) url.searchParams.set(name, value);
    }
    link.href = url.toString();
    link.className = 'cta';
    link.textContent = label;
    links.append(link);
  }
  wrap.append(links);
  const help = document.createElement('p');
  help.innerHTML = 'Questions or another area? <a href="tel:+17206057678">Call 720-605-7678</a>. Mention your 50% first-treatment offer; the team will confirm eligibility and full pricing before treatment.';
  wrap.append(help);
  booking.append(wrap);
  document.querySelector('#request').after(booking);
  if (location.hash === '#booking') booking.scrollIntoView({ block: 'start' });

  const formId = 'QzQyQa3LTHZb3JNmQN0b';
  const formUrl = new URL(`https://api.leadconnectorhq.com/widget/form/${formId}`);
  for (const name of attributionKeys) {
    const value = incoming.get(name);
    if (value) formUrl.searchParams.set(name, value);
  }
  formUrl.searchParams.set('multi_line_7j7a', interests[variant]);
  const frame = document.createElement('iframe');
  frame.id = `inline-${formId}`;
  frame.src = formUrl.toString();
  frame.title = `Request your ${interests[variant]} offer`;
  frame.className = 'specialty-lead-frame';
  Object.assign(frame.dataset, {
    layout: JSON.stringify({ id: 'INLINE' }), triggerType: 'alwaysShow', triggerValue: '',
    activationType: 'alwaysActivated', activationValue: '', deactivationType: 'neverDeactivate',
    deactivationValue: '', formName: 'Google | Specialty BBL | Hair Removal + Acne + SkinTyte | 50% First Treatment',
    height: '1580', layoutIframeId: `inline-${formId}`, formId,
    cookieConsent: 'true', cookieConsentProvider: 'auto'
  });
  document.querySelector('#request form').replaceWith(frame);
  const embed = document.createElement('script');
  embed.src = 'https://link.msgsndr.com/js/form_embed.js';
  document.body.append(embed);
})();
