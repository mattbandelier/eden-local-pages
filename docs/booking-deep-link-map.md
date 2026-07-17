# Eden Booking Deep-Link Map

The center is `a1fda69e-77f9-4077-bb8a-3b06349b6af3`.

`CategoryId` is the preferred route format. The current implementation uses the verified Zenoti `serviceid` consultation link when a category ID is not yet confirmed, and falls back to `/book/?service=...` when no public service ID is verified.

| Service page | Zenoti category | CategoryId | Current verified route | Status |
| --- | --- | --- | --- | --- |
| `/botox/` | Aesthetics | TODO | Aesthetic Consultation (`36c44f93-eb18-40e2-b6e4-ea5a199ee0f8`) | Working fallback |
| `/dermal-fillers/` | Aesthetics | TODO | Aesthetic Consultation (`36c44f93-eb18-40e2-b6e4-ea5a199ee0f8`) | Working fallback |
| `/diamondglow-facial/` | Aesthetics | TODO | Aesthetic Consultation (`36c44f93-eb18-40e2-b6e4-ea5a199ee0f8`) | Internal-only service |
| `/lip-filler/` | Aesthetics | TODO | Aesthetic Consultation (`36c44f93-eb18-40e2-b6e4-ea5a199ee0f8`) | Working fallback |
| `/microneedling/` | Aesthetics | TODO | Aesthetic Consultation (`36c44f93-eb18-40e2-b6e4-ea5a199ee0f8`) | Working fallback |
| `/bbl-photofacial/` | Aesthetics | TODO | Aesthetic Consultation (`36c44f93-eb18-40e2-b6e4-ea5a199ee0f8`) | Working fallback |
| `/prf-hair-restoration/` | Aesthetics | TODO | Aesthetic Consultation (`36c44f93-eb18-40e2-b6e4-ea5a199ee0f8`) | Working fallback |
| `/medical-weight-loss/` | Medical Weight Loss | TODO | Medical Weight Loss Consultation (`0a0e47c6-8a0c-4abe-87eb-d189cfbe7dd5`) | Working fallback |
| `/female-bhrt/` | Wellness / HRT | TODO | HRT Consultation (`e6dab53c-810b-454d-9935-d9df45174d44`) | Working fallback |
| `/male-trt/` | Wellness / HRT | TODO | HRT Consultation (`e6dab53c-810b-454d-9935-d9df45174d44`) | Working fallback |
| `/peptide-therapy/` | Peptide Therapy | TODO | Peptide Therapy Consultation (`9b57954f-0ce4-46bc-a175-51fc49cd8762`) | Working fallback |
| `/iv-therapy/` | Wellness | TODO | `/book/?service=iv-therapy` | Needs public Zenoti route |
| `/nad-iv-therapy/` | Wellness | TODO | `/book/?service=nad-iv-therapy` | Needs public Zenoti route |
| Fitness routes (`/fitness-performance-v2/`, `/fitness-performance-*/`) | Fitness | TODO | Fitness Consultation (`09dae419-488d-4f7a-807a-8694f2f439f6`) | Working fallback |

The hormone aliases (`/mens-hormone-optimization/`, `/menopause-hormone-therapy/`, `/hormone-therapy-cost/`, `/hormone-optimization/`, and `/womens-hormone-optimization/`) use the same HRT consultation route as `/female-bhrt/` and `/male-trt/`.

The same mapping applies to Greenwood Village combination pages such as `/botox/greenwood-village/`. Replace the TODOs in `src/lib/booking.ts` once Zenoti admin confirms the category IDs.
