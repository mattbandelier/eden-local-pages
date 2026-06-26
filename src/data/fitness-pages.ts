export type FitnessPage = {
  slug: string;
  title: string;
  description: string;
  h1: string;
  eyebrow: string;
  heroHeadline: string;
  summary: string;
  primaryCta: string;
  secondaryCta: string;
  proof: string[];
  builtFor: string[];
  sections: Array<{
    eyebrow: string;
    title: string;
    body: string;
    bullets?: string[];
  }>;
  related: Array<{
    label: string;
    href: string;
    text: string;
  }>;
  faqs: Array<{
    question: string;
    answer: string;
  }>;
};

const coreRelated = [
  {
    label: "InBody scans",
    href: "https://edenhealthclubs.com/functional-medicine/inbody/",
    text: "Track fat, muscle, and body composition beyond the scale."
  },
  {
    label: "Medical weight loss",
    href: "https://edenhealthclubs.com/functional-medicine/medical-weight-loss/",
    text: "Provider-guided weight loss support that can connect with training."
  },
  {
    label: "Peptide therapy",
    href: "https://edenhealthclubs.com/peptide-therapy/",
    text: "Clinician-guided protocols for recovery, body composition, sleep, and longevity goals."
  },
  {
    label: "IV therapy",
    href: "https://edenhealthclubs.com/wellness-recovery/iv-therapy/",
    text: "Hydration, recovery, energy, immunity, glow, relief, and performance support."
  },
  {
    label: "Wellness injections",
    href: "https://edenhealthclubs.com/functional-medicine/wellness-injections/",
    text: "Targeted support for energy, recovery, metabolism, immunity, and wellness."
  },
  {
    label: "Hormone therapy",
    href: "https://edenhealthclubs.com/hormone-replacement-therapy/",
    text: "Hormone care for men and women with labs, monitoring, and provider oversight."
  }
];

const baseProof = [
  "Greenwood Village near DTC",
  "Medical wellness inside a working fitness facility",
  "Training + recovery + body composition",
  "Built for the south Denver lifestyle"
];

const systemSection = {
  eyebrow: "Why Eden is different",
  title: "Medical wellness and coached training, inside one working fitness facility.",
  body:
    "Most gyms and studios stop at the workout. Eden connects coached training, body composition tracking, recovery, medical wellness, and aesthetics inside one Greenwood Village facility, so your plan can match the body you are actually trying to build.",
  bullets: [
    "Coached strength, personal training, semi-private training, and group fitness",
    "InBody scans to track muscle, fat, and progress beyond the scale",
    "Recovery tools including IV therapy, wellness injections, red light, sauna, and compression",
    "Medical weight loss, hormone care, peptide therapy, and functional medicine support when appropriate",
    "Aesthetics and skin health available in the same Eden facility"
  ]
};

const reviewSignalsSection = {
  eyebrow: "Client experience",
  title: "People come for results and stay for the way Eden feels.",
  body:
    "Clients describe attentive coaching, small-group energy, clear wellness guidance, a beautiful facility, recovery tools nearby, and a team that makes the process feel personal instead of transactional.",
  bullets: [
    "Small-group coaching with real attention to form, strength, and confidence",
    "Support for strength, Pilates, weightlifting goals, and feeling stronger",
    "Clear explanations around labs, fatigue, brain fog, stress, and next steps",
    "Recovery tools, a clean facility, and a welcoming community under one roof"
  ]
};

function page(input: Omit<FitnessPage, "proof" | "related"> & Partial<Pick<FitnessPage, "proof" | "related">>): FitnessPage {
  const sections = [
    ...input.sections.slice(0, 2),
    reviewSignalsSection,
    ...input.sections.slice(2)
  ];

  return {
    proof: baseProof,
    related: coreRelated,
    ...input,
    sections
  };
}

type AreaFitnessInput = {
  slug: string;
  area: string;
  areaPhrase: string;
  titleArea: string;
  descriptionArea: string;
  localAngle: string;
  driveAngle: string;
  audience: string[];
  nearby: string[];
  incomeSignal: string;
};

function areaFitnessPage(input: AreaFitnessInput): FitnessPage {
  return page({
    slug: input.slug,
    title: `Fitness and Performance Training ${input.titleArea} | Eden Health Club`,
    description: `Outcome-based fitness and performance training ${input.descriptionArea}: strength, body recomposition, GLP-1 muscle support, recovery, longevity, Pilates-style movement, and medical wellness at Eden Health Club.`,
    h1: `Fitness and Performance Training ${input.titleArea}`,
    eyebrow: "Local fitness. Bigger outcomes.",
    heroHeadline: "Strength, body composition, recovery, and wellness under one Greenwood Village roof.",
    summary: `${input.areaPhrase} clients use Eden for more than workouts: coached strength, InBody body composition scans, recovery, IV therapy, wellness injections, hormones, peptides, functional medicine, aesthetics, and medical weight loss support when appropriate.`,
    primaryCta: "Book a Fitness Assessment",
    secondaryCta: "See Eden's system",
    proof: [
      `Built for ${input.area}`,
      "Built for nearby south Denver clients",
      "Training + InBody + recovery",
      "Medical wellness inside a working fitness facility"
    ],
    builtFor: [
      ...input.audience,
      "GLP-1, perimenopause, longevity, and body composition clients",
      "Pilates, barre, yoga, strength, and recovery seekers"
    ],
    sections: [
      {
        eyebrow: "Local demand",
        title: `${input.area} clients do not need another generic gym search.`,
        body: input.localAngle,
        bullets: [
          "Personal training and semi-private training for accountability",
          "Group fitness, strength, Pilates-inspired movement, barre, yoga, and mobility options",
          "Body recomposition, GLP-1 strength support, longevity training, and recovery planning",
          "InBody tracking and wellness services that can support the next step"
        ]
      },
      {
        eyebrow: "Why the drive makes sense",
        title: "People will drive for an integrated plan, not a random class.",
        body: input.driveAngle,
        bullets: [
          "Greenwood Village facility near DTC",
          `Relevant for ${input.nearby.join(", ")}`,
          "Designed for clients who want measurable change, not just attendance",
          input.incomeSignal
        ]
      },
      systemSection,
      {
        eyebrow: "What people compare",
        title: `A smarter fitness option near ${input.area}.`,
        body:
          `Clients comparing personal training, strength training, semi-private training, group fitness, Pilates-inspired movement, body recomposition, GLP-1 strength support, and recovery performance ${input.descriptionArea} can start with Eden when they want one plan instead of disconnected providers.`
      }
    ],
    related: [
      {
        label: "Fitness + Performance",
        href: "https://edenhealthclubs.com/fitness-performance/",
        text: "Main Eden fitness hub for strength, body composition, recovery, and programs."
      },
      ...coreRelated
    ],
    faqs: [
      {
        question: `Where can I find fitness and performance training ${input.descriptionArea}?`,
        answer:
          `Eden Health Club is located in Greenwood Village near DTC and serves ${input.area} clients looking for strength training, personal training, semi-private training, group fitness, recovery, body composition tracking, and medical wellness support.`
      },
      {
        question: `Is Eden close enough for ${input.area} clients?`,
        answer:
          `${input.driveAngle} Eden is designed for clients who want one destination for training, recovery, body composition, medical wellness, and aesthetics instead of piecing together separate providers.`
      },
      {
        question: "What makes Eden different from a local gym or boutique studio?",
        answer:
          "Eden connects coached fitness with InBody scans, recovery, IV therapy, wellness injections, hormone care, peptide therapy, medical weight loss support, functional medicine, and aesthetics inside one working fitness facility."
      }
    ]
  });
}

const areaFitnessPages: FitnessPage[] = [
  areaFitnessPage({
    slug: "fitness-performance-denver-tech-center",
    area: "Denver Tech Center",
    areaPhrase: "Denver Tech Center and DTC corridor",
    titleArea: "near Denver Tech Center",
    descriptionArea: "near Denver Tech Center",
    localAngle:
      "DTC has the exact client profile Eden should capture: busy professionals, executives, founders, parents, and high-output adults who want efficient fitness, better recovery, and measurable body composition without driving all over Denver.",
    driveAngle:
      "Eden sits in Greenwood Village near the Denver Tech Center corridor, making it a practical destination for people who want to train, recover, scan, and access wellness support before work, after work, or between appointments.",
    audience: [
      "Busy professionals near DTC",
      "Executives who want efficient coaching",
      "People who want strength, recovery, and energy support"
    ],
    nearby: ["Greenwood Village", "Belleview Station", "Orchard", "Arapahoe at Village Center"],
    incomeSignal: "DTC searchers often value convenience, efficiency, and premium support over bargain fitness."
  }),
  areaFitnessPage({
    slug: "fitness-performance-cherry-hills-village",
    area: "Cherry Hills Village",
    areaPhrase: "Cherry Hills Village",
    titleArea: "near Cherry Hills Village",
    descriptionArea: "near Cherry Hills Village",
    localAngle:
      "Cherry Hills Village is a premium wellness market where the right buyer is not looking for the cheapest class. They are looking for strength, longevity, body composition, recovery, aesthetics, and a high-trust environment.",
    driveAngle:
      "Eden is close enough for Cherry Hills Village clients who want one polished Greenwood Village destination for fitness, recovery, body composition, aesthetics, and medical wellness support.",
    audience: [
      "Cherry Hills clients focused on longevity and strength",
      "Aesthetics clients who want fitness connected to the bigger plan",
      "Adults who want a premium wellness environment"
    ],
    nearby: ["Cherry Hills Village", "University Boulevard", "Orchard Road", "Greenwood Village"],
    incomeSignal: "Cherry Hills is one of the strongest premium wellness markets around Eden."
  }),
  areaFitnessPage({
    slug: "fitness-performance-centennial",
    area: "Centennial",
    areaPhrase: "Centennial",
    titleArea: "near Centennial",
    descriptionArea: "near Centennial",
    localAngle:
      "Centennial has a large base of active adults, parents, professionals, and midlife clients who are searching for strength, weight loss support, Pilates, yoga, recovery, and sustainable fitness close to home.",
    driveAngle:
      "Eden is a practical north/west Centennial option for people who want a stronger fitness answer than a crowded gym or single-format studio.",
    audience: [
      "Centennial adults who want measurable strength and body composition",
      "Parents and professionals who need efficient training",
      "GLP-1, weight loss, longevity, and recovery clients"
    ],
    nearby: ["Centennial", "Southglenn", "Arapahoe Road", "Greenwood Village"],
    incomeSignal: "Centennial has a large high-intent local market for premium fitness and wellness services."
  }),
  areaFitnessPage({
    slug: "fitness-performance-englewood",
    area: "Englewood",
    areaPhrase: "Englewood",
    titleArea: "near Englewood",
    descriptionArea: "near Englewood",
    localAngle:
      "Englewood searchers often compare gyms, studios, personal trainers, yoga, Pilates, and wellness clinics separately. Eden gives them one destination where fitness can connect with recovery and medical wellness.",
    driveAngle:
      "Eden is close enough for south Englewood and University Boulevard clients who want a more complete facility than a standard gym, class studio, or med spa.",
    audience: [
      "Englewood clients comparing gyms and studios",
      "Strength and recovery seekers",
      "People who want fitness connected to wellness support"
    ],
    nearby: ["Englewood", "South Broadway", "University Boulevard", "Cherry Hills"],
    incomeSignal: "Englewood adds strong nearby search volume while staying inside the realistic local drive radius."
  }),
  areaFitnessPage({
    slug: "fitness-performance-littleton",
    area: "Littleton",
    areaPhrase: "Littleton",
    titleArea: "near Littleton",
    descriptionArea: "near Littleton",
    localAngle:
      "Littleton has strong demand for personal training, Pilates, yoga, strength, active aging, recovery, and weight-loss-adjacent fitness. Eden should capture the clients who want a higher-touch plan than a neighborhood gym.",
    driveAngle:
      "Eden is a realistic option for north and east Littleton clients who want fitness, body composition, recovery, and wellness services in one Greenwood Village facility.",
    audience: [
      "Littleton clients focused on strength and longevity",
      "Active adults who want recovery and mobility",
      "People looking for personal training, Pilates, yoga, or body recomposition"
    ],
    nearby: ["Littleton", "Southglenn", "Cherry Hills", "Greenwood Village"],
    incomeSignal: "Littleton gives Eden a strong active-adult and family wellness market inside the 10-mile ring."
  }),
  areaFitnessPage({
    slug: "fitness-performance-south-denver",
    area: "South Denver",
    areaPhrase: "South Denver",
    titleArea: "near South Denver",
    descriptionArea: "near South Denver",
    localAngle:
      "South Denver searchers have plenty of gyms and studios, but fewer places where training, recovery, InBody scans, aesthetics, hormone care, peptides, IV therapy, and wellness injections can connect into one plan.",
    driveAngle:
      "Eden should not chase all of Denver for routine fitness. South Denver is the right edge: close enough for high-intent clients who want the integrated Eden model and are willing to drive for a better answer.",
    audience: [
      "South Denver clients who want an integrated wellness club",
      "Pilates, barre, yoga, strength, and recovery seekers",
      "Clients who want body composition and medical wellness connected"
    ],
    nearby: ["South Denver", "University Hills", "Wellshire", "Cherry Hills", "DTC"],
    incomeSignal: "South Denver expands the addressable market without stretching beyond Eden's realistic service radius."
  })
];

type KeywordFitnessInput = {
  slug: string;
  title: string;
  description: string;
  h1: string;
  eyebrow: string;
  heroHeadline: string;
  summary: string;
  primaryCta: string;
  intent: string;
  edenAngle: string;
  bullets: string[];
  builtFor: string[];
  faqs: Array<{
    question: string;
    answer: string;
  }>;
};

function keywordFitnessPage(input: KeywordFitnessInput): FitnessPage {
  return page({
    slug: input.slug,
    title: input.title,
    description: input.description,
    h1: input.h1,
    eyebrow: input.eyebrow,
    heroHeadline: input.heroHeadline,
    summary: input.summary,
    primaryCta: input.primaryCta,
    secondaryCta: "See how Eden works",
    builtFor: input.builtFor,
    sections: [
      {
        eyebrow: "Client goal",
        title: "This is the decision behind the visit.",
        body: input.intent,
        bullets: input.bullets
      },
      {
        eyebrow: "Eden advantage",
        title: "The workout is only one part of the result.",
        body: input.edenAngle,
        bullets: [
          "Coached training inside a real fitness facility",
          "InBody scans for fat, muscle, and body composition tracking",
          "Recovery, IV therapy, wellness injections, hormones, peptides, and functional medicine nearby",
          "Aesthetics and medical weight loss support when appropriate"
        ]
      },
      systemSection
    ],
    faqs: input.faqs
  });
}

const priorityKeywordPages: FitnessPage[] = [
  keywordFitnessPage({
    slug: "personal-training-denver-tech-center",
    title: "Personal Training near Denver Tech Center | Eden Health Club",
    description:
      "Personal training near Denver Tech Center for strength, body composition, recovery, and performance at Eden Health Club in Greenwood Village.",
    h1: "Personal Training near Denver Tech Center",
    eyebrow: "Private coaching. Bigger system.",
    heroHeadline: "Personal training for people who want measurable change.",
    summary:
      "Eden gives DTC-area clients personal training that can connect with InBody scans, recovery, medical weight loss support, hormones, peptides, IV therapy, wellness injections, and aesthetics when the goal calls for more.",
    primaryCta: "Book a Personal Training Assessment",
    intent:
      "People searching personal training near DTC usually want accountability, efficient coaching, strength, fat loss, and a plan that fits a demanding schedule.",
    edenAngle:
      "Eden can turn personal training into a fuller body-composition and wellness plan instead of stopping at sessions and sets.",
    bullets: [
      "Personal training near Denver Tech Center",
      "Private coaching for strength and body composition",
      "Efficient training for busy professionals",
      "Recovery and wellness services in the same facility"
    ],
    builtFor: ["DTC professionals", "Private training clients", "Strength and fat-loss goals", "People who want accountability"],
    faqs: [
      {
        question: "Where can I find personal training near Denver Tech Center?",
        answer:
          "Eden Health Club offers personal training in Greenwood Village near DTC, with strength coaching, InBody scans, recovery, and medical wellness support available under one roof."
      },
      {
        question: "Is Eden personal training only for advanced clients?",
        answer: "No. Eden can match training to your current level, goals, schedule, and recovery needs."
      },
      {
        question: "Can personal training connect with weight loss or hormones?",
        answer:
          "Yes. Eden can connect training with medical weight loss support, hormone care, InBody tracking, recovery, and wellness services when appropriate."
      }
    ]
  }),
  keywordFitnessPage({
    slug: "semi-private-training-denver-tech-center",
    title: "Semi-Private Training near Denver Tech Center | Eden Health Club",
    description:
      "Semi-private training near Denver Tech Center with small-format coaching, accountability, strength, body composition, and recovery support at Eden Health Club.",
    h1: "Semi-Private Training near Denver Tech Center",
    eyebrow: "Small format. Real coaching.",
    heroHeadline: "More coaching than a class, more energy than training alone.",
    summary:
      "Semi-private training at Eden gives DTC-area clients structure, accountability, strength, and a path into recovery and wellness support without feeling lost in a crowded gym.",
    primaryCta: "Book a Semi-Private Assessment",
    intent:
      "Semi-private training searches usually come from people who want coaching and accountability but do not necessarily want the cost or intensity of private training every time.",
    edenAngle:
      "Eden can make semi-private training a smart entry point into body composition, recovery, GLP-1 muscle protection, longevity, and wellness support.",
    bullets: [
      "Semi-private training near DTC",
      "Small-group accountability",
      "Strength-focused coaching",
      "A better bridge than a generic group class"
    ],
    builtFor: ["DTC clients who want accountability", "Friends or partners training together", "Busy adults", "Strength beginners"],
    faqs: [
      {
        question: "What is semi-private training?",
        answer:
          "Semi-private training is small-format coaching where a trainer works with a small number of clients, giving more attention than a large class while keeping energy and accountability."
      },
      {
        question: "Does Eden offer semi-private training near DTC?",
        answer:
          "Eden Health Club offers small-format fitness and performance training options in Greenwood Village near Denver Tech Center."
      },
      {
        question: "Is semi-private training good for body composition?",
        answer:
          "It can be. Eden can connect semi-private training with InBody scans, strength programming, recovery, and wellness support for body-composition goals."
      }
    ]
  }),
  keywordFitnessPage({
    slug: "strength-training-denver-tech-center",
    title: "Strength Training near Denver Tech Center | Eden Health Club",
    description:
      "Strength training near Denver Tech Center for muscle, metabolism, body composition, longevity, and recovery at Eden Health Club.",
    h1: "Strength Training near Denver Tech Center",
    eyebrow: "Muscle. Metabolism. Longevity.",
    heroHeadline: "Strength training is the foundation of the Eden fitness system.",
    summary:
      "Build strength near DTC in a facility where training can connect with InBody scans, recovery, GLP-1 muscle preservation, hormones, peptides, IV therapy, wellness injections, and aesthetics.",
    primaryCta: "Book a Strength Assessment",
    intent:
      "Strength training searches are not just about lifting weights. They signal demand for muscle, metabolism, fat loss, longevity, confidence, and a body that holds up.",
    edenAngle:
      "Eden turns strength training into a measurable plan by pairing coaching with body composition tracking and wellness support.",
    bullets: [
      "Strength training near DTC",
      "Muscle preservation and body composition",
      "Longevity-focused strength",
      "Recovery support for consistency"
    ],
    builtFor: ["Adults who want to build muscle", "GLP-1 and weight-loss clients", "Longevity-focused adults", "DTC professionals"],
    faqs: [
      {
        question: "Where can I find strength training near Denver Tech Center?",
        answer:
          "Eden Health Club offers strength training in Greenwood Village near DTC with coaching, InBody scans, recovery, and wellness services."
      },
      {
        question: "Why does strength training matter for weight loss?",
        answer:
          "Strength training helps preserve lean muscle, support metabolism, and improve body composition while weight changes."
      },
      {
        question: "Can beginners start strength training at Eden?",
        answer: "Yes. Eden can adapt strength training to your starting point, experience, goals, and recovery needs."
      }
    ]
  }),
  keywordFitnessPage({
    slug: "glp-1-strength-training-denver-tech-center",
    title: "GLP-1 Strength Training near Denver Tech Center | Eden Health Club",
    description:
      "GLP-1 strength training near Denver Tech Center for muscle preservation, body composition, recovery, and medical weight loss support at Eden Health Club.",
    h1: "GLP-1 Strength Training near Denver Tech Center",
    eyebrow: "Lose weight without losing the body you want.",
    heroHeadline: "GLP-1 weight loss needs a muscle-protection plan.",
    summary:
      "Eden helps DTC-area GLP-1 and medical weight loss clients protect muscle, track body composition, build strength, and connect recovery or wellness support when appropriate.",
    primaryCta: "Book a GLP-1 Strength Assessment",
    intent:
      "GLP-1 searches are shifting from medication-only curiosity toward long-term maintenance, muscle preservation, protein, strength, and body composition.",
    edenAngle:
      "Eden can support the missing fitness layer around GLP-1 weight loss: resistance training, InBody scans, recovery, and a plan for what happens after the scale moves.",
    bullets: [
      "GLP-1 strength training near DTC",
      "Muscle preservation during weight loss",
      "InBody scans to track fat and lean mass",
      "Recovery and wellness support when appropriate"
    ],
    builtFor: ["GLP-1 users", "Medical weight loss clients", "People losing weight quickly", "Clients worried about muscle loss"],
    faqs: [
      {
        question: "Why do GLP-1 clients need strength training?",
        answer:
          "Strength training helps protect lean muscle and supports metabolism while weight changes. InBody scans can help track whether the loss is fat, muscle, or both."
      },
      {
        question: "Does Eden offer GLP-1 strength training near DTC?",
        answer:
          "Yes. Eden Health Club is in Greenwood Village near DTC and can connect GLP-1 support, strength training, body composition tracking, and recovery."
      },
      {
        question: "Can I use Eden if another provider prescribed my medication?",
        answer:
          "Yes. Eden can support the training, InBody, recovery, and wellness side while respecting your existing medical care."
      }
    ]
  }),
  keywordFitnessPage({
    slug: "body-recomposition-denver-tech-center",
    title: "Body Recomposition near Denver Tech Center | Eden Health Club",
    description:
      "Body recomposition near Denver Tech Center with strength training, InBody scans, recovery, and wellness support at Eden Health Club.",
    h1: "Body Recomposition near Denver Tech Center",
    eyebrow: "Fat loss. Muscle. Measurement.",
    heroHeadline: "Change the body, not just the scale.",
    summary:
      "Eden helps DTC-area clients lose fat, preserve or build muscle, track InBody changes, and connect training with recovery, medical wellness, and aesthetics when appropriate.",
    primaryCta: "Book a Body Composition Assessment",
    intent:
      "Body recomposition is one of the best keywords for Eden because it captures people who want fat loss, muscle, shape, strength, confidence, and objective measurement.",
    edenAngle:
      "Eden can own this space because body recomposition needs more than a class: strength, InBody tracking, recovery, nutrition direction, and wellness support.",
    bullets: [
      "Body recomposition near DTC",
      "InBody scans and body composition tracking",
      "Fat loss while protecting muscle",
      "Fitness connected with wellness and aesthetics"
    ],
    builtFor: ["Fat-loss clients", "GLP-1 clients", "Strength and shape goals", "People frustrated by the scale"],
    faqs: [
      {
        question: "What is body recomposition?",
        answer:
          "Body recomposition means improving the ratio of fat mass to lean muscle mass, not simply chasing a lower body weight."
      },
      {
        question: "Where can I get body composition training near DTC?",
        answer:
          "Eden Health Club offers body composition-focused fitness in Greenwood Village near DTC with InBody scans, strength training, recovery, and wellness support."
      },
      {
        question: "Can body recomposition connect with aesthetics?",
        answer:
          "Yes. Eden can connect body composition goals with fitness, recovery, medical weight loss support, hormones, peptides, and aesthetics when appropriate."
      }
    ]
  }),
  keywordFitnessPage({
    slug: "pilates-denver-tech-center",
    title: "Pilates near Denver Tech Center | Eden Health Club",
    description:
      "Pilates-inspired strength, core, mobility, and recovery support near Denver Tech Center at Eden Health Club in Greenwood Village.",
    h1: "Pilates near Denver Tech Center",
    eyebrow: "Core. Control. Strength.",
    heroHeadline: "Pilates-style movement with a stronger wellness system behind it.",
    summary:
      "Eden gives DTC-area Pilates searchers a bigger answer: core, posture, mobility, low-impact strength, recovery, InBody tracking, and wellness support in one Greenwood Village facility.",
    primaryCta: "Explore Pilates-Style Training",
    intent:
      "Pilates searches usually come from people who want tone, posture, core strength, low-impact training, mobility, and a polished studio experience.",
    edenAngle:
      "Eden can capture Pilates intent while offering the next layer: strength, body composition, recovery, medical wellness, and aesthetics.",
    bullets: [
      "Pilates near DTC",
      "Core, posture, and mobility",
      "Low-impact strength training",
      "Recovery and wellness services nearby"
    ],
    builtFor: ["Pilates seekers near DTC", "Low-impact training clients", "Core and posture goals", "Studio clients ready for strength"],
    faqs: [
      {
        question: "Does Eden offer Pilates near Denver Tech Center?",
        answer:
          "Eden offers Pilates-inspired strength, core, mobility, and group fitness options in Greenwood Village near DTC depending on current programming."
      },
      {
        question: "How is Eden different from a Pilates studio?",
        answer:
          "Eden connects Pilates-style movement with strength training, InBody scans, recovery, wellness injections, IV therapy, hormones, peptides, medical weight loss support, and aesthetics."
      },
      {
        question: "Is Pilates-style training good for beginners?",
        answer:
          "Yes. Pilates-inspired training can be adapted for beginners while supporting core strength, control, posture, and mobility."
      }
    ]
  }),
  keywordFitnessPage({
    slug: "perimenopause-fitness-greenwood-village",
    title: "Perimenopause Fitness in Greenwood Village | Eden Health Club",
    description:
      "Perimenopause fitness in Greenwood Village for strength, body composition, muscle preservation, recovery, hormone-aware wellness, and confidence at Eden Health Club.",
    h1: "Perimenopause Fitness in Greenwood Village",
    eyebrow: "Strength for a changing body.",
    heroHeadline: "When your body changes, your fitness plan has to get smarter.",
    summary:
      "Eden helps women navigating perimenopause and menopause changes with strength training, InBody scans, recovery, hormone-aware wellness, functional medicine, IV therapy, wellness injections, peptides, and aesthetics when appropriate.",
    primaryCta: "Book a Perimenopause Fitness Assessment",
    intent:
      "Perimenopause fitness is a trend-shift keyword because many women are searching for why weight, recovery, sleep, strength, and body composition feel different in midlife.",
    edenAngle:
      "Eden can win this because the answer is not just another class. It is strength, body composition tracking, recovery, hormone conversations, wellness support, and aesthetics under one roof.",
    bullets: [
      "Perimenopause fitness in Greenwood Village",
      "Strength training for midlife body changes",
      "Body composition and InBody tracking",
      "Hormone-aware wellness support when appropriate"
    ],
    builtFor: ["Women 35+", "Perimenopause and menopause changes", "Midlife strength and body composition", "Energy, sleep, recovery, and confidence goals"],
    faqs: [
      {
        question: "Can strength training help during perimenopause?",
        answer:
          "Strength training can support lean muscle, body composition, metabolism, confidence, and bone-supportive loading during midlife changes."
      },
      {
        question: "Does Eden offer perimenopause fitness in Greenwood Village?",
        answer:
          "Yes. Eden can connect fitness, InBody tracking, recovery, hormone-aware wellness, functional medicine, and aesthetics for women navigating perimenopause or menopause changes."
      },
      {
        question: "Is this a hormone program or a fitness program?",
        answer:
          "It starts with fitness and body composition, but Eden can connect hormone care, functional medicine, recovery, and wellness support when appropriate."
      }
    ]
  }),
  keywordFitnessPage({
    slug: "medical-weight-loss-fitness-greenwood-village",
    title: "Medical Weight Loss Fitness in Greenwood Village | Eden Health Club",
    description:
      "Medical weight loss fitness in Greenwood Village with strength training, InBody scans, GLP-1 muscle support, recovery, and wellness services at Eden Health Club.",
    h1: "Medical Weight Loss Fitness in Greenwood Village",
    eyebrow: "Weight loss needs strength.",
    heroHeadline: "The missing piece in weight loss is often muscle.",
    summary:
      "Eden helps medical weight loss and GLP-1 clients connect weight change with strength training, InBody scans, recovery, wellness injections, IV therapy, peptides, hormones, and long-term maintenance support.",
    primaryCta: "Book a Weight Loss Fitness Assessment",
    intent:
      "Medical weight loss searches are high-value, but the fitness layer is often underserved. People need to protect lean mass, rebuild strength, and maintain results.",
    edenAngle:
      "Eden can bridge medical weight loss and fitness because training, body composition tracking, recovery, and wellness support can all live in one facility.",
    bullets: [
      "Medical weight loss fitness in Greenwood Village",
      "GLP-1 muscle preservation",
      "InBody scans for fat and lean mass",
      "Strength and maintenance after weight loss"
    ],
    builtFor: ["Medical weight loss clients", "GLP-1 clients", "People worried about muscle loss", "Long-term maintenance goals"],
    faqs: [
      {
        question: "Why does fitness matter during medical weight loss?",
        answer:
          "Strength training can help protect lean muscle, support metabolism, improve body composition, and create a stronger maintenance plan while weight changes."
      },
      {
        question: "Does Eden combine medical weight loss and fitness?",
        answer:
          "Eden offers medical weight loss support, fitness, InBody scans, recovery, wellness injections, IV therapy, peptides, hormones, and aesthetics in one Greenwood Village facility."
      },
      {
        question: "Can this help after weight loss?",
        answer:
          "Yes. Eden can help build the maintenance phase around strength, body composition, recovery, habits, and follow-up measurement."
      }
    ]
  })
];

export const fitnessPages: FitnessPage[] = [
  page({
    slug: "strength-training-greenwood-village",
    title: "Strength Training in Greenwood Village | Eden Health Club",
    description:
      "Build muscle, protect metabolism, and improve body composition with strength training at Eden Health Club in Greenwood Village, where fitness connects with recovery and medical wellness.",
    h1: "Strength Training in Greenwood Village",
    eyebrow: "Strength. Recovery. Optimization.",
    heroHeadline: "Real medical treatment inside a working fitness facility.",
    summary:
      "Build muscle, protect metabolism, improve body composition, and recover better at Eden Health Club, where strength training can connect with InBody scans, recovery, IV therapy, wellness injections, hormones, peptides, and medical weight loss support.",
    primaryCta: "Book Your Strength Assessment",
    secondaryCta: "Explore the system",
    builtFor: ["Fat loss without losing muscle", "GLP-1 and medical weight loss clients", "Adults who want to age stronger", "Busy professionals who need efficient training"],
    sections: [
      {
        eyebrow: "Why it matters",
        title: "Strength is the foundation of body optimization.",
        body:
          "Strength training is not just a gym category. It is the lever behind muscle, metabolism, posture, bone health, confidence, and long-term function. Eden builds the plan around the body you want to keep, not just the weight you want to lose."
      },
      {
        eyebrow: "How Eden trains",
        title: "Coached strength with a bigger wellness system behind it.",
        body:
          "Your training can be supported by body composition scans, recovery services, medical weight loss, hormone care, peptide therapy, IV therapy, and wellness injections when clinically appropriate.",
        bullets: ["Progressive strength work", "Coach-led form and accountability", "Body composition tracking", "Recovery and wellness support under one roof"]
      },
      systemSection
    ],
    faqs: [
      {
        question: "Where can I find strength training in Greenwood Village?",
        answer:
          "Eden Health Club offers strength training in Greenwood Village near DTC, with personal training, semi-private training, group fitness, body composition tracking, and recovery services under one roof."
      },
      {
        question: "Can strength training help with weight loss?",
        answer:
          "Yes. Strength training helps preserve and build lean muscle, which supports metabolism, body composition, and long-term weight management."
      },
      {
        question: "Is strength training useful if I am taking a GLP-1 medication?",
        answer:
          "Strength training is especially important during weight loss because it helps protect muscle and metabolism while body weight changes."
      }
    ]
  }),
  page({
    slug: "performance-training-greenwood-village",
    title: "Performance Training in Greenwood Village | Eden Health Club",
    description:
      "Train for strength, energy, recovery, and body optimization with performance training at Eden Health Club in Greenwood Village near DTC.",
    h1: "Performance Training in Greenwood Village",
    eyebrow: "Train for the body you actually need",
    heroHeadline: "Performance training inside a facility built to optimize everything.",
    summary:
      "Eden helps active adults build strength, improve conditioning, recover faster, and track body composition inside a working fitness facility with real medical treatment available under the same roof.",
    primaryCta: "Book a Performance Assessment",
    secondaryCta: "See how Eden works",
    builtFor: ["Active adults", "Executives and high performers", "Athletes and former athletes", "People who want strength, energy, and recovery"],
    sections: [
      {
        eyebrow: "Not just athletes",
        title: "Performance is how well your body handles your life.",
        body:
          "For some clients, performance means sport. For others, it means sharper workdays, better recovery, stronger training sessions, steadier energy, and the capacity to do more without breaking down."
      },
      {
        eyebrow: "What Eden connects",
        title: "Strength, conditioning, recovery, and medical wellness in one place.",
        body:
          "Eden's performance model can connect training with InBody scans, recovery tools, IV therapy, wellness injections, peptide therapy, hormone care, and functional medicine support.",
        bullets: ["Strength and conditioning", "Mobility and durability", "Recovery planning", "Body composition and metabolic support"]
      },
      systemSection
    ],
    faqs: [
      {
        question: "Where can I find performance training in Greenwood Village?",
        answer:
          "Eden Health Club offers performance-focused training in Greenwood Village near DTC, with strength coaching, group fitness, recovery services, body composition tracking, and medical wellness support under one roof."
      },
      {
        question: "Is performance training only for athletes?",
        answer:
          "No. Performance training is useful for athletes, active adults, executives, parents, and anyone who wants more strength, energy, durability, and recovery capacity."
      },
      {
        question: "How is Eden different from a performance gym?",
        answer:
          "Eden connects training with recovery, InBody scans, medical weight loss, hormones, peptides, IV therapy, wellness injections, and aesthetics inside one facility."
      }
    ]
  }),
  page({
    slug: "longevity-training-greenwood-village",
    title: "Longevity Training in Greenwood Village | Eden Health Club",
    description:
      "Build strength, mobility, body composition, and recovery capacity with longevity training at Eden Health Club in Greenwood Village.",
    h1: "Longevity Training in Greenwood Village",
    eyebrow: "Train for healthspan",
    heroHeadline: "A stronger body is an anti-aging strategy.",
    summary:
      "Longevity training at Eden focuses on strength, muscle, mobility, balance, recovery, body composition, and medical wellness support so you can keep doing what you love for longer.",
    primaryCta: "Book a Longevity Assessment",
    secondaryCta: "Explore recovery",
    builtFor: ["Adults 35+", "Active aging clients", "Longevity-focused professionals", "People who want to stay strong, mobile, and capable"],
    sections: [
      {
        eyebrow: "Healthspan",
        title: "Longevity is not passive. You train for it.",
        body:
          "Muscle, mobility, balance, and recovery are the physical infrastructure of aging well. Eden builds longevity training around the systems that help you stay strong, capable, and independent."
      },
      {
        eyebrow: "Beyond workouts",
        title: "A longevity plan should connect training with recovery and treatment.",
        body:
          "Eden can connect strength work with InBody scans, hormone care, peptide therapy, IV therapy, wellness injections, and recovery services, so the plan is bigger than exercise alone."
      },
      systemSection
    ],
    faqs: [
      {
        question: "What is longevity training?",
        answer:
          "Longevity training is exercise programming designed to support strength, muscle, mobility, balance, body composition, recovery, and long-term physical independence."
      },
      {
        question: "Does strength training support longevity?",
        answer:
          "Strength training supports muscle, metabolism, bone health, balance, and function, all of which matter for healthy aging and healthspan."
      },
      {
        question: "How does Eden support longevity beyond workouts?",
        answer:
          "Eden can connect training with InBody scans, recovery services, hormone care, peptide therapy, IV therapy, wellness injections, and functional medicine."
      }
    ]
  }),
  page({
    slug: "anti-aging-strength-training-greenwood-village",
    title: "Healthy Aging Strength Training in Greenwood Village | Eden Health Club",
    description:
      "Use strength training, recovery, body composition tracking, and wellness support as part of a healthy aging fitness strategy at Eden Health Club in Greenwood Village.",
    h1: "Healthy Aging Strength Training in Greenwood Village",
    eyebrow: "Muscle matters at every age",
    heroHeadline: "Aging well is not just skincare. It is strength, recovery, and metabolism.",
    summary:
      "Eden connects strength training with body composition, recovery, hormone care, peptides, IV therapy, wellness injections, and aesthetics so healthy aging is not limited to what happens in the mirror.",
    primaryCta: "Book a Healthy Aging Fitness Assessment",
    secondaryCta: "Explore body composition",
    builtFor: ["Women and men over 40", "Clients focused on muscle and metabolism", "Aesthetics clients who want the body to match", "People who want to look, feel, and function younger"],
    sections: [
      {
        eyebrow: "The deeper layer",
        title: "The body has a healthy aging strategy too.",
        body:
          "Skin, face, and aesthetics matter, but muscle, metabolism, recovery, hormones, and mobility are the deeper foundation. Eden brings those pieces into one environment."
      },
      {
        eyebrow: "Train smarter",
        title: "Strength after 40 and 50 should be precise, progressive, and recoverable.",
        body:
          "The goal is not to beat yourself up. It is to build muscle, protect joints, support metabolism, improve posture, and train in a way your body can adapt to."
      },
      systemSection
    ],
    faqs: [
      {
        question: "What is healthy aging strength training?",
        answer:
          "Healthy aging strength training focuses on building and preserving muscle, mobility, metabolism, balance, and body composition as the body changes with age."
      },
      {
        question: "Is healthy aging fitness different from regular fitness?",
        answer:
          "Yes. Healthy aging fitness prioritizes strength, recovery, mobility, body composition, hormone-aware planning, and long-term function instead of random calorie burn."
      },
      {
        question: "Can Eden connect healthy aging fitness with aesthetics?",
        answer:
          "Yes. Eden offers fitness, recovery, functional medicine, hormone care, peptides, wellness injections, and aesthetics under one roof."
      }
    ]
  }),
  page({
    slug: "glp-1-strength-training-greenwood-village",
    title: "GLP-1 Strength Training in Greenwood Village | Eden Health Club",
    description:
      "Pair GLP-1 weight loss with strength training, InBody scans, recovery, and medical wellness support at Eden Health Club in Greenwood Village.",
    h1: "GLP-1 Strength Training in Greenwood Village",
    eyebrow: "Protect muscle while the weight comes off",
    heroHeadline: "Do not just lose weight. Protect your muscle and metabolism.",
    summary:
      "GLP-1 medications can change the number on the scale. Eden helps you protect what matters while your body changes: muscle, strength, metabolism, energy, confidence, and long-term body composition.",
    primaryCta: "Book a Body Composition Assessment",
    secondaryCta: "Explore weight loss support",
    builtFor: ["GLP-1 clients", "Medical weight loss clients", "People losing weight quickly", "Anyone who wants fat loss without getting weaker"],
    sections: [
      {
        eyebrow: "The missing piece",
        title: "Weight loss without muscle protection is an incomplete plan.",
        body:
          "When appetite drops and weight changes quickly, strength training and body composition tracking become essential. Eden helps clients focus on the result they actually want: less fat, more strength, better energy, and a body that can hold the outcome."
      },
      {
        eyebrow: "Track the right thing",
        title: "InBody turns the scale into a smarter conversation.",
        body:
          "InBody scans help track lean mass, fat mass, and progress beyond weight alone. That data can guide training, recovery, protein habits, and next steps with Eden's medical wellness team."
      },
      systemSection
    ],
    faqs: [
      {
        question: "Why should I strength train while using GLP-1 medication?",
        answer:
          "Strength training can help protect lean muscle and support metabolism during weight loss. Eden uses training, body composition tracking, and medical wellness support to help clients pursue better long-term outcomes."
      },
      {
        question: "Does Eden offer GLP-1 weight loss support?",
        answer:
          "Yes. Eden offers medically supervised weight loss services and can connect weight loss care with InBody tracking, training, recovery, and wellness support."
      },
      {
        question: "Can InBody scans show whether I am losing fat or muscle?",
        answer:
          "InBody scans provide body composition information, including fat mass and lean mass, which can help guide a smarter training and weight loss plan."
      }
    ]
  }),
  page({
    slug: "body-composition-training-greenwood-village",
    title: "Body Composition Training in Greenwood Village | Eden Health Club",
    description:
      "Go beyond the scale with InBody-guided body composition training at Eden Health Club in Greenwood Village. Build muscle, lose fat, and track what matters.",
    h1: "Body Composition Training in Greenwood Village",
    eyebrow: "Measure what matters",
    heroHeadline: "Stop guessing. Train with body composition data.",
    summary:
      "Eden connects InBody scans, strength training, recovery, medical weight loss, hormone care, and wellness support so your plan is built around more than a scale number.",
    primaryCta: "Book an InBody + Fitness Assessment",
    secondaryCta: "Learn about InBody",
    builtFor: ["Fat loss clients", "Muscle gain clients", "GLP-1 clients", "Anyone tired of scale-only progress"],
    sections: [
      {
        eyebrow: "Beyond the scale",
        title: "The scale cannot tell you what you are made of.",
        body:
          "Body composition training focuses on fat mass, lean mass, strength, and measurable change. It helps keep the goal clear: improve the body, not just the number."
      },
      {
        eyebrow: "The Eden advantage",
        title: "Data, training, and medical wellness can sit in the same plan.",
        body:
          "InBody scans can support conversations around strength training, medical weight loss, hormones, recovery, wellness injections, and long-term progress."
      },
      systemSection
    ],
    faqs: [
      {
        question: "What is body composition training?",
        answer:
          "Body composition training focuses on changing the ratio of fat mass to lean mass, not just lowering scale weight. At Eden, this can include InBody scans, strength training, nutrition support, and medical wellness services."
      },
      {
        question: "Where can I get an InBody scan in Greenwood Village?",
        answer:
          "Eden Health Club offers InBody scans in Greenwood Village as part of its fitness, functional medicine, and body composition services."
      },
      {
        question: "Is body composition training good for weight loss?",
        answer:
          "Yes. Body composition training helps clients focus on fat loss, muscle preservation, strength, and long-term metabolic health."
      }
    ]
  }),
  page({
    slug: "recovery-performance-greenwood-village",
    title: "Recovery and Performance in Greenwood Village | Eden Health Club",
    description:
      "Build a recovery and performance plan at Eden Health Club in Greenwood Village with training, body composition, red light, sauna, compression, IV therapy, wellness injections, and medical wellness support.",
    h1: "Recovery and Performance in Greenwood Village",
    eyebrow: "Train hard. Recover on purpose.",
    heroHeadline: "Recovery is not the break from training. It is part of the result.",
    summary:
      "Eden connects coached training, body composition, red light therapy, infrared sauna, compression, IV therapy, wellness injections, peptide therapy options, and medical wellness support inside one Greenwood Village facility.",
    primaryCta: "Book a Recovery Assessment",
    secondaryCta: "Explore recovery services",
    proof: [
      "Greenwood Village near DTC",
      "Recovery + training + body composition",
      "IV, red light, sauna, compression",
      "Medical wellness under one roof"
    ],
    builtFor: [
      "Active adults who train hard but feel under-recovered",
      "DTC professionals managing stress, travel, and long workdays",
      "Weight-loss and body composition clients protecting strength",
      "Former athletes who want structure without a random gym plan",
      "Clients comparing recovery studios, gyms, and wellness clinics"
    ],
    sections: [
      {
        eyebrow: "The bottleneck",
        title: "You do not adapt from training. You adapt from recovering.",
        body:
          "If soreness, stress, poor sleep, travel, dehydration, or inconsistent energy keep dragging you down, the plan needs more than another hard workout. Eden treats recovery as part of performance, then connects it to the training and wellness support that fits your goals.",
        bullets: [
          "Review what is slowing progress: soreness, stress, energy, sleep, travel, hydration, or consistency",
          "Connect recovery tools with strength, conditioning, and body composition goals",
          "Use InBody-style tracking when body composition is part of the plan",
          "Route into medical wellness consults when symptoms, history, or goals suggest a deeper review"
        ]
      },
      {
        eyebrow: "Recovery tools",
        title: "Recovery support should be selected with a reason.",
        body:
          "Eden's recovery ecosystem gives active clients multiple ways to support hydration, energy, soreness, mobility, readiness, and consistency, with medical oversight where appropriate. The point is not to collect services. The point is to choose the right recovery layer for the way you train and live.",
        bullets: [
          "Red light therapy, infrared sauna, and compression for recovery routines",
          "IV therapy and wellness injections for eligible clients seeking hydration, energy, immunity, or performance support",
          "Peptide therapy options when medically appropriate and provider-reviewed",
          "Training and coaching nearby so recovery is connected to the work, not separate from it"
        ]
      },
      {
        eyebrow: "Local fit",
        title: "A recovery destination for Greenwood Village, DTC, and south Denver.",
        body:
          "Recovery and performance searches around Greenwood Village are often coming from active adults, professionals, parents, and weight-loss clients who want a smarter plan than a single class, single treatment, or one-off recovery session. Eden gives them a place to start, measure, train, recover, and adjust."
      },
      systemSection,
      {
        eyebrow: "What to expect",
        title: "Start with the goal, then match the recovery plan.",
        body:
          "The right next step depends on what you are trying to change: soreness, consistency, strength, energy, body composition, stress load, travel recovery, or overall readiness. Eden's assessment helps turn that into a practical plan instead of guesswork.",
        bullets: [
          "Clarify your main recovery or performance goal",
          "Review current training, schedule, and recovery habits",
          "Identify which Eden services may be useful now versus later",
          "Create a practical first step that can be followed up by the team"
        ]
      }
    ],
    related: [
      {
        label: "Performance Lab",
        href: "/performance-lab-greenwood-village/",
        text: "Start with a broader assessment when you want help choosing the right path."
      },
      {
        label: "IV therapy",
        href: "/iv-therapy/greenwood-village/",
        text: "Explore IV therapy options for hydration, energy, recovery, glow, immunity, and performance support."
      },
      {
        label: "NAD IV therapy",
        href: "/nad-iv-therapy/greenwood-village/",
        text: "Learn about NAD IV therapy in Greenwood Village for eligible clients."
      },
      {
        label: "Body composition training",
        href: "/body-composition-training-greenwood-village/",
        text: "Connect recovery with measurable body composition and strength goals."
      },
      {
        label: "Strength training",
        href: "/strength-training-greenwood-village/",
        text: "Build the training side of your performance and recovery plan."
      },
      {
        label: "Medical spa services",
        href: "/medical-spa-denver/",
        text: "Explore Eden's aesthetics, skin health, wellness, and performance environment."
      }
    ],
    faqs: [
      {
        question: "Where can I find recovery services in Greenwood Village?",
        answer:
          "Eden Health Club offers recovery services in Greenwood Village near Denver Tech Center, including red light therapy, infrared sauna, compression therapy, IV therapy, wellness injections, peptide therapy options, and training support."
      },
      {
        question: "Can recovery services support workout performance?",
        answer:
          "Recovery services may support hydration, muscle soreness, energy, mobility, stress, and readiness depending on the service, your goals, and individual fit. Eden helps connect recovery to your training and wellness plan."
      },
      {
        question: "How is Eden different from a recovery studio?",
        answer:
          "Eden combines recovery services with training, body composition, medical wellness, hormones, peptides, IV therapy, wellness injections, and aesthetics under one roof, so the recovery plan is connected to the bigger picture."
      },
      {
        question: "Is this page for athletes only?",
        answer:
          "No. Recovery and Performance is built for active adults, busy professionals, parents, weight-loss clients, and former athletes who want more energy, better consistency, and a clearer plan."
      },
      {
        question: "What areas does Eden serve for recovery and performance?",
        answer:
          "Eden is located at 5990 S University Blvd in Greenwood Village and serves Denver Tech Center, Cherry Hills Village, Centennial, Englewood, Littleton, Denver, and the south metro."
      }
    ]
  }),
  page({
    slug: "executive-fitness-greenwood-village",
    title: "Executive Fitness in Greenwood Village | Eden Health Club",
    description:
      "Executive fitness at Eden Health Club helps busy professionals near DTC build strength, energy, recovery, and body composition with wellness support under one roof.",
    h1: "Executive Fitness in Greenwood Village",
    eyebrow: "For high performers with full calendars",
    heroHeadline: "Your body should not be the bottleneck.",
    summary:
      "Eden helps busy professionals build strength, improve body composition, recover better, and support energy with training, recovery, and medical wellness services inside one Greenwood Village facility near DTC.",
    primaryCta: "Book an Executive Fitness Assessment",
    secondaryCta: "Explore personal training",
    builtFor: ["DTC professionals", "Founders and executives", "Busy parents", "People who need efficient, high-leverage training"],
    sections: [
      {
        eyebrow: "No wasted effort",
        title: "Fitness for people who cannot afford random.",
        body:
          "Executive fitness at Eden is built for efficient strength work, better energy, smarter recovery, and body composition progress without trying to stitch together separate providers."
      },
      {
        eyebrow: "Energy and recovery",
        title: "Training, recovery, and wellness support can point in the same direction.",
        body:
          "When the calendar is full, Eden's advantage is proximity: training, InBody, IV therapy, wellness injections, hormones, peptides, and recovery services can all live in one plan."
      },
      systemSection
    ],
    faqs: [
      {
        question: "What is executive fitness?",
        answer:
          "Executive fitness is training and wellness support designed for busy professionals who need efficient strength training, recovery, energy support, and body composition results."
      },
      {
        question: "Is Eden near Denver Tech Center?",
        answer:
          "Yes. Eden Health Club is located in Greenwood Village near DTC and serves clients throughout the south Denver metro."
      },
      {
        question: "Can executive fitness include recovery or wellness services?",
        answer:
          "Yes. Eden can connect fitness with IV therapy, wellness injections, recovery services, InBody scans, hormone care, and peptide therapy when appropriate."
      }
    ]
  }),
  page({
    slug: "semi-private-personal-training-greenwood-village",
    title: "Semi-Private Personal Training in Greenwood Village | Eden Health Club",
    description:
      "Get small-format coaching, accountability, and strength training at Eden Health Club with semi-private personal training in Greenwood Village.",
    h1: "Semi-Private Personal Training in Greenwood Village",
    eyebrow: "Small group energy. Personal coaching.",
    heroHeadline: "More attention than a class. More energy than training alone.",
    summary:
      "Semi-private training at Eden gives you focused coaching, structure, accountability, and strength work inside a facility where training can connect with recovery, body composition, and medical wellness support.",
    primaryCta: "Book a Semi-Private Assessment",
    secondaryCta: "See training options",
    builtFor: ["People who want accountability", "Clients who dislike crowded gyms", "Friends or partners training together", "Anyone who wants coaching without training alone"],
    sections: [
      {
        eyebrow: "Small format",
        title: "The sweet spot between personal training and group fitness.",
        body:
          "Semi-private training gives you coaching, structure, and accountability in a smaller environment, with more attention than a large class and more energy than solo training."
      },
      {
        eyebrow: "Connected care",
        title: "Small-group training can still connect to the bigger Eden system.",
        body:
          "Your training can connect with InBody scans, recovery, IV therapy, wellness injections, and medical wellness services when they fit your goals."
      },
      systemSection
    ],
    faqs: [
      {
        question: "What is semi-private personal training?",
        answer:
          "Semi-private personal training is small-format coaching where a trainer works with a small number of clients at once. It gives more coaching than a large class while keeping the energy and accountability of training with others."
      },
      {
        question: "Does Eden offer semi-private training in Greenwood Village?",
        answer:
          "Yes. Eden offers fitness and performance training options in Greenwood Village, including personal and small-format training experiences."
      },
      {
        question: "Is semi-private training good for beginners?",
        answer:
          "Yes. Semi-private training can be adapted to your current fitness level while still giving you structure and coaching."
      }
    ]
  }),
  page({
    slug: "group-fitness-classes-greenwood-village",
    title: "Group Fitness Classes in Greenwood Village | Eden Health Club",
    description:
      "Explore group fitness classes in Greenwood Village at Eden Health Club, with strength-focused training, recovery, and wellness services under one roof.",
    h1: "Group Fitness Classes in Greenwood Village",
    eyebrow: "Classes with a bigger system behind them",
    heroHeadline: "Group fitness inside a facility built for optimization.",
    summary:
      "Eden's group fitness classes are built for strength, energy, endurance, and consistency, with recovery, InBody scans, IV therapy, wellness injections, hormones, peptides, and medical weight loss support available under the same roof.",
    primaryCta: "Book a Class",
    secondaryCta: "Explore fitness options",
    builtFor: ["People who want coached classes", "Clients who want variety", "Strength and conditioning seekers", "Anyone who wants recovery nearby"],
    sections: [
      {
        eyebrow: "Beyond class packs",
        title: "A class should be part of a bigger result.",
        body:
          "Eden's group fitness environment is designed for people who want energy and community without giving up the broader support system: training, recovery, body composition, and medical wellness."
      },
      {
        eyebrow: "Formats",
        title: "Strength, conditioning, mobility, barre-inspired, and yoga-informed movement.",
        body:
          "Eden can capture the class demand people are already searching for while offering a more complete destination than a single-format studio."
      },
      systemSection
    ],
    faqs: [
      {
        question: "Where can I take group fitness classes in Greenwood Village?",
        answer:
          "Eden Health Club offers group fitness in Greenwood Village near DTC, with strength-focused classes and access to recovery and wellness services."
      },
      {
        question: "How is Eden different from a boutique fitness studio?",
        answer:
          "Eden offers fitness classes inside a broader wellness facility with recovery, InBody, medical weight loss, hormone care, IV therapy, wellness injections, peptides, and aesthetics available under one roof."
      },
      {
        question: "Are Eden's group fitness classes beginner-friendly?",
        answer:
          "Eden's training team can help clients choose the right fitness option based on experience, goals, and comfort level."
      }
    ]
  }),
  page({
    slug: "barre-classes-greenwood-village",
    title: "Barre Classes in Greenwood Village | Eden Health Club",
    description:
      "Discover barre-inspired strength, sculpt, balance, and core training at Eden Health Club in Greenwood Village, connected to recovery and wellness support.",
    h1: "Barre Classes in Greenwood Village",
    eyebrow: "Sculpt. Stabilize. Strengthen.",
    heroHeadline: "Barre-inspired movement inside a facility built for more than classes.",
    summary:
      "Eden brings low-impact sculpt, core work, balance, and strength into a working fitness facility where recovery, body composition, wellness injections, IV therapy, and medical treatment can all support the bigger plan.",
    primaryCta: "Try Barre at Eden",
    secondaryCta: "Explore group fitness",
    builtFor: ["Low-impact strength seekers", "Core and posture goals", "Clients who like sculpt classes", "People who want recovery and wellness support nearby"],
    sections: [
      {
        eyebrow: "Class intent",
        title: "Low-impact does not mean low-results.",
        body:
          "Barre-inspired training can support core strength, glute strength, posture, balance, muscular endurance, and low-impact conditioning."
      },
      {
        eyebrow: "Why Eden",
        title: "A barre-only studio cannot offer the Eden system.",
        body:
          "Eden lets clients pair barre-inspired movement with strength training, InBody tracking, recovery, IV therapy, wellness injections, and medical wellness support."
      },
      systemSection
    ],
    faqs: [
      {
        question: "Does Eden offer barre classes in Greenwood Village?",
        answer:
          "Eden offers barre-inspired movement and group fitness options in Greenwood Village. Clients can contact Eden for the current class schedule and best fit."
      },
      {
        question: "What are barre classes good for?",
        answer:
          "Barre-inspired training can support core strength, glute strength, posture, balance, muscular endurance, and low-impact conditioning."
      },
      {
        question: "How is Eden different from a barre studio?",
        answer:
          "Eden connects barre-inspired movement with strength training, recovery, body composition tracking, and medical wellness services inside one facility."
      }
    ]
  }),
  page({
    slug: "yoga-classes-greenwood-village",
    title: "Yoga Classes in Greenwood Village | Eden Health Club",
    description:
      "Yoga at Eden Health Club in Greenwood Village supports mobility, recovery, balance, breath, and long-term performance inside a full wellness facility.",
    h1: "Yoga Classes in Greenwood Village",
    eyebrow: "Mobility. Breath. Recovery.",
    heroHeadline: "Yoga for people who want their body to work better.",
    summary:
      "Yoga at Eden supports flexibility, balance, breath, nervous system regulation, and recovery inside a facility where training, recovery, IV therapy, wellness injections, body composition, and medical wellness can work together.",
    primaryCta: "View Yoga Options",
    secondaryCta: "Explore recovery",
    builtFor: ["Mobility goals", "Recovery-focused clients", "Strength clients who need balance", "People managing stress and stiffness"],
    sections: [
      {
        eyebrow: "Recovery",
        title: "Mobility and breath are performance tools.",
        body:
          "Yoga can support mobility, balance, flexibility, breath, and stress regulation, all of which can complement strength training and recovery."
      },
      {
        eyebrow: "The Eden difference",
        title: "Yoga can sit next to recovery, IV therapy, and body composition.",
        body:
          "Instead of existing as a separate studio habit, yoga at Eden can connect with recovery services, InBody scans, training, and medical wellness support."
      },
      systemSection
    ],
    faqs: [
      {
        question: "Does Eden offer yoga classes in Greenwood Village?",
        answer:
          "Eden offers fitness and recovery services in Greenwood Village, including yoga or mobility-focused options depending on the current class schedule."
      },
      {
        question: "Is yoga useful for recovery?",
        answer:
          "Yoga can support mobility, breath, balance, flexibility, and stress regulation, all of which can complement strength training and recovery."
      },
      {
        question: "Can I combine yoga with recovery services at Eden?",
        answer:
          "Yes. Eden's recovery services include options such as infrared sauna, red light therapy, compression therapy, and IV therapy."
      }
    ]
  }),
  page({
    slug: "pilates-strength-training-greenwood-village",
    title: "Pilates Strength Training in Greenwood Village | Eden Health Club",
    description:
      "Explore Pilates-inspired strength, core, control, and mobility training at Eden Health Club in Greenwood Village.",
    h1: "Pilates Strength Training in Greenwood Village",
    eyebrow: "Core. Control. Strength.",
    heroHeadline: "Pilates-inspired training with a stronger system behind it.",
    summary:
      "Eden brings Pilates-inspired core work, control, mobility, and low-impact strength into a working fitness facility where training can connect with recovery, InBody scans, wellness injections, IV therapy, and medical wellness support.",
    primaryCta: "Try Pilates-Inspired Training",
    secondaryCta: "Explore group fitness",
    builtFor: ["Core strength goals", "Low-impact training seekers", "Mobility and posture goals", "Clients comparing Pilates studios"],
    sections: [
      {
        eyebrow: "Control",
        title: "Core, posture, mobility, and strength belong together.",
        body:
          "Pilates-inspired strength training uses core control, alignment, mobility, and low-impact strength principles while connecting them to broader fitness and performance goals."
      },
      {
        eyebrow: "More than a studio",
        title: "Eden gives the Pilates searcher a bigger answer.",
        body:
          "The page can capture Pilates demand while positioning Eden as a more complete destination for strength, recovery, body composition, medical wellness, and aesthetics."
      },
      systemSection
    ],
    faqs: [
      {
        question: "Does Eden offer Pilates in Greenwood Village?",
        answer:
          "Eden offers Pilates-inspired strength, core, mobility, and group fitness options depending on the current schedule and programming."
      },
      {
        question: "What is Pilates-inspired strength training?",
        answer:
          "Pilates-inspired strength training uses core control, alignment, mobility, and low-impact strength principles while connecting them to broader fitness and performance goals."
      },
      {
        question: "How is Eden different from a Pilates studio?",
        answer:
          "Eden offers movement training inside a facility that also supports recovery, body composition, wellness injections, IV therapy, hormones, peptides, medical weight loss, and aesthetics."
      }
    ]
  }),
  page({
    slug: "performance-lab-greenwood-village",
    title: "Performance Lab in Greenwood Village | Eden Health Club",
    description:
      "Book a Performance Lab assessment at Eden Health Club in Greenwood Village: body composition, strength, recovery, wellness planning, and next-step guidance under one roof.",
    h1: "Performance Lab in Greenwood Village",
    eyebrow: "Measure. Train. Recover. Optimize.",
    heroHeadline: "Start with a real baseline before you choose the next plan.",
    summary:
      "Eden's Performance Lab helps active adults, busy professionals, weight-loss clients, and wellness-minded clients understand where they are now, what is limiting progress, and which Eden path makes the most sense next.",
    primaryCta: "Book a Performance Assessment",
    secondaryCta: "See what is included",
    proof: [
      "Greenwood Village near DTC",
      "Body composition + coaching + recovery",
      "Medical wellness under one roof",
      "Clear next-step guidance"
    ],
    builtFor: [
      "People who feel stuck despite working out",
      "GLP-1 and weight-loss clients protecting muscle",
      "Busy professionals who want energy and structure",
      "Active adults who want recovery and performance support",
      "Clients comparing fitness, wellness, and body composition options"
    ],
    sections: [
      {
        eyebrow: "The offer",
        title: "Start with a practical snapshot of where your body is now.",
        body:
          "If you are not sure whether the next move is training, recovery, body composition work, IV therapy, medical wellness, or a deeper consult, the Performance Lab gives you a better first step. Eden starts with your goals, your current routine, and the gaps that may be holding you back.",
        bullets: [
          "Body composition and goal review",
          "Strength, recovery, energy, schedule, and consistency discussion",
          "A practical next-step plan based on what you actually want to change",
          "Routing into training, recovery, wellness, aesthetics, or medical consults when appropriate"
        ]
      },
      {
        eyebrow: "Why this works",
        title: "Most people do not need another random workout. They need the right starting point.",
        body:
          "Performance Lab is intentionally broader than a single service. It is built for people who know they want to feel, look, move, or recover better, but want guidance before choosing a class, consult, package, or treatment path.",
        bullets: [
          "Helpful for fitness, body composition, recovery, and wellness goals",
          "Simple first step for people comparing Eden with gyms, med spas, and wellness clinics",
          "Specific enough to take action today",
          "Flexible enough to route different goals after the assessment request"
        ]
      },
      {
        eyebrow: "What Eden connects",
        title: "One assessment can point to the right combination.",
        body:
          "Eden can connect fitness, InBody-style body composition tracking, recovery services, IV therapy, wellness injections, hormone care, peptide therapy, medical weight loss, functional medicine, and aesthetics when those services match your goals and provider review.",
        bullets: [
          "Training and coaching for strength, body composition, and accountability",
          "Recovery tools for soreness, stress, hydration, and readiness",
          "Medical wellness consults when labs, symptoms, or history suggest a deeper review",
          "Aesthetics and skin health for clients who want the outside to match the work inside"
        ]
      },
      systemSection,
      {
        eyebrow: "Local advantage",
        title: "A premium performance assessment near Denver Tech Center.",
        body:
          "Greenwood Village, DTC, Cherry Hills Village, Centennial, Englewood, Littleton, and South Denver are full of busy adults who value time, trust, measurable change, and a place that can connect multiple wellness paths without sending them all over town."
      }
    ],
    related: [
      {
        label: "Fitness + Performance",
        href: "https://edenhealthclubs.com/fitness-performance/",
        text: "Explore Eden's broader fitness, coaching, and performance environment."
      },
      {
        label: "InBody scans",
        href: "https://edenhealthclubs.com/functional-medicine/inbody/",
        text: "Use body composition data to understand muscle, fat, and progress beyond the scale."
      },
      {
        label: "Recovery services",
        href: "https://edenhealthclubs.com/wellness-recovery/",
        text: "Support recovery with IV therapy, red light, sauna, compression, and related services."
      },
      {
        label: "Medical weight loss",
        href: "https://edenhealthclubs.com/functional-medicine/medical-weight-loss/",
        text: "Provider-guided weight-loss support for eligible clients who want a monitored plan."
      },
      {
        label: "Peptide therapy",
        href: "https://edenhealthclubs.com/peptide-therapy/",
        text: "Clinician-guided wellness and recovery protocols when medically appropriate."
      },
      {
        label: "Medical spa services",
        href: "/medical-spa-denver/",
        text: "Connect performance, wellness, and aesthetics inside the Eden environment."
      }
    ],
    faqs: [
      {
        question: "What is the Eden Performance Lab?",
        answer:
          "The Eden Performance Lab is a first-step assessment for clients who want help with strength, body composition, energy, recovery, wellness planning, or choosing the right service path inside Eden Health Club."
      },
      {
        question: "Is this only for athletes?",
        answer:
          "No. The Performance Lab is built for active adults, busy professionals, weight-loss clients, former athletes, parents, and wellness-minded clients who want their body to work better."
      },
      {
        question: "What can the assessment lead to?",
        answer:
          "Depending on your goals, Eden may recommend training, body composition tracking, recovery services, IV therapy, wellness injections, functional medicine, medical weight loss, hormone care, peptide therapy, or aesthetics consults when appropriate."
      },
      {
        question: "Is this a good first step if I am comparing gyms, med spas, and wellness clinics?",
        answer:
          "Yes. Performance Lab is designed for people comparing fitness, recovery, body composition, and wellness options around Greenwood Village and Denver Tech Center who want a more complete starting point than a single class or one-off service."
      },
      {
        question: "Where is the Performance Lab located?",
        answer:
          "Eden Health Club is located at 5990 S University Blvd in Greenwood Village near Denver Tech Center, serving Cherry Hills Village, Centennial, Englewood, Littleton, Denver, and the south metro."
      }
    ]
  }),
  ...areaFitnessPages,
  ...priorityKeywordPages
];

export function getFitnessPage(slug: string) {
  return fitnessPages.find((page) => page.slug === slug);
}
