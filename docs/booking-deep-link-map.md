# Eden Booking Deep-Link Map

The center is `a1fda69e-77f9-4077-bb8a-3b06349b6af3`.

`CategoryId` is the preferred route format. The category GUIDs below were verified from the live Zenoti webstore tabs on 2026-07-17. Service IDs remain in the mapping only as fallbacks or for records where a category route is not the best fit.

| Service page | Zenoti category | CategoryId | Current verified route | Status |
| --- | --- | --- | --- | --- |
| `/botox/`, fillers, skin, laser, BBL, PRF | Aesthetics | `a9c8d747-23e2-48d0-be6e-cb5035f28119` | Category deep link | Verified |
| `/diamondglow-facial/` | Aesthetics | `a9c8d747-23e2-48d0-be6e-cb5035f28119` | Aesthetic category | Internal-only service |
| `/medical-weight-loss/` | Medical Weight Loss | `acf1793f-ec03-493a-a64a-47b43c8356a9` | Category deep link | Verified |
| Hormone routes | Wellness | `8e453ae4-b52e-47f8-9847-387cdb875a9e` | Category deep link | Verified |
| `/peptide-therapy/` | Peptide Therapy | `6b5ed79c-9e80-4d55-8754-cc764ff27003` | Category deep link | Verified |
| `/iv-therapy/`, `/nad-iv-therapy/` | Wellness | `8e453ae4-b52e-47f8-9847-387cdb875a9e` | Category deep link | Verified; NAD uses custom tab |
| Recovery routes | Recovery Services | `741f5f51-643d-4a38-953b-646ef331efda` | Category deep link | Verified |
| Fitness routes (`/fitness-performance-v2/`, `/fitness-performance-*/`) | Fitness | `443d8251-1411-4b7a-9d2a-6ad642137d91` | Category deep link | Verified |

The hormone aliases (`/mens-hormone-optimization/`, `/menopause-hormone-therapy/`, `/hormone-therapy-cost/`, `/hormone-optimization/`, and `/womens-hormone-optimization/`) use the same HRT consultation route as `/female-bhrt/` and `/male-trt/`.

The same mapping applies to Greenwood Village combination pages such as `/botox/greenwood-village/`. The category IDs are centralized in `src/lib/booking.ts` so future Zenoti category changes have one update point.
