# Cœur de l'Om — Regional Visibility & SEO Optimisation Plan

**Site:** coeurdelom.fr (Next.js App Router, i18n `fr` / `de` / `en`)
**Plan date:** 2026-06-17
**Sources:** `~/Library/Mobile Documents/.../website optimisation Coeurdelom/`
(Task List, Visibility Checklist, Additional Content, Regional Copy FR-DE-EN, SEO Keywords, Local Business Listings Requirements)

This plan turns the six handover documents into a sequenced, code-aware backlog. The handover was written from the *outside* (reviewing the live site); this plan adds what the **codebase actually contains**, which changes several tasks materially. Read the "Reality check vs. the handover" box before starting.

---

## Reality check vs. the handover

A scan of the repo shows three handover assumptions are **already partly solved in code** — and one problem is **worse** than described. Verify these first; they reshape the work.

| Handover said | Code actually shows | Impact on the task |
|---|---|---|
| "Create and submit a sitemap.xml — none currently resolves" | `app/sitemap.ts` **exists**, emits all pages × 3 langs **with hreflang alternates**; `app/robots.ts` **exists** and points to the sitemap. | Task shrinks to: **verify it builds & resolves in production**, then submit in Search Console. Likely a deploy/indexing gap, not a missing file. |
| "Add LocalBusiness schema markup (name, address, geo, phone, services)" | `components/StructuredData.tsx` **already emits** `LocalBusiness` + `MedicalBusiness` + `WebSite` JSON-LD, incl. address & opening hours. | Task shrinks to: **add `geo` coordinates + `telephone`, confirm it's injected on every page, validate** with Rich Results Test. Not a from-scratch build. |
| "Check hreflang reciprocity" | Only `chromobiotest` sets per-page `alternates.languages`; the rest rely on the sitemap. `og:locale` is **hardcoded `fr_FR`** in `app/[lang]/layout.tsx`. | Real work remains: per-page `alternates` + dynamic `og:locale`. |
| "Make FAQ answers crawlable (hidden by CSS, not loaded after click)" | **Worse:** `components/TherapyFAQ.tsx` renders only `currentQuestions[selectedQuestion]?.answer` — exactly **one** answer is in the DOM, controlled by React state. All other answers are **absent** from server HTML until a click. | The fix is required and is a **real refactor** (render all answers, hide inactive ones with CSS), not a one-line tweak. This also unblocks FAQPage schema. |

> Treat the table above as the first hour of work: open each file, confirm the current state in the deployed build (View Source / `curl`), and adjust estimates. Everything below assumes these confirmations.

---

## Phase 0 — Decide before touching anything (blocks everything else)

These are **decisions for Valérie**, not dev work, but every later task depends on them.

- [ ] **Lock the canonical NAP** (Name / Address / Phone). This exact string must appear identically on the site, in JSON-LD, and in every directory & platform listing — mismatches are the #1 cause of Google/Apple verification delays.
  - Name: `Cœur de l'Om`
  - Address: `140 rue Pioch Boutonnet, 34090 Montpellier, France`
  - **Phone: UNDECIDED** — does Valérie want to take calls? If no phone, NAP is name+address only, and the phone-dependent items below are dropped.
- [ ] **Pricing display** — show indicative session price per therapy, or duration only? (Currently only Massage Amma shows a duration.)
- [ ] **Blog byline** — articles show "Valérie **Jourdan**", meta-author tag says "Valérie **Heydlauf**". Which is correct? (See Phase 2.)
- [ ] **Verification documents** for Google Business Profile (business licence, utility bill, bank statement, or filmed walkthrough — all must show the canonical NAP). Decide which is available now.

---

## Phase 1 — On-site quick wins (no budget, copy already written)

All copy/ALT/meta text is **already authored** in the handover docs — this phase is implementation only. Drop-in values are in the [Appendix](#appendix--drop-in-meta-copy).

### 1.1 Fix the broken language signals *(High — Quick)*
The fr/de/en pages currently share identical French title/description, and `og:locale` is hardcoded to `fr_FR`. Search engines read all three as the same page.
- [ ] `app/[lang]/layout.tsx` — make `og:locale` dynamic per `lang` (`fr_FR` / `de_DE` / `en_US`); `alternateLocale` already lists the other two.
- [ ] Add per-page `alternates.languages` (fr/de/en + `canonical`) to each `generateMetadata`, mirroring the pattern already in `app/[lang]/chromobiotest/page.tsx`.
- [ ] Pull each page's title/description from the dictionaries (or the appendix values) so they differ per language.
- [ ] After deploy, run **Merkle hreflang tester** — each version must reference all three, including itself.

### 1.2 Work Montpellier + Pioch Boutonnet into visible copy *(High — Quick)*
Right now no visible page text names a city; only the legal notice has the address.
- [ ] Homepage: add the new intro paragraph under the existing tagline (Regional Copy doc, all 3 langs) → `lib/dictionaries/{fr,de,en}.json` (`home.*`), rendered by `app/[lang]/page.tsx`.
- [ ] About / Qui-suis-je: revised "meditation space … located in Montpellier" paragraph → dict `about.*`.
- [ ] Contact: add the visible **address block** (see 1.4).
- [ ] Update H1s per the Regional Copy doc.

### 1.3 Add Montpellier to Therapies / Why / ChromobioTest meta *(High — Quick)*
These three were *not* covered by the Regional Copy doc and currently carry no location in their meta.
- [ ] Add "Montpellier" to title + description (all 3 langs) in each page's `generateMetadata`. Values in the [Appendix](#appendix--drop-in-meta-copy) (from the Keyword Map).

### 1.4 Visible address + embedded map on Contact *(High — Quick)*
- [ ] `app/[lang]/contact/page.tsx` — add address block above/beside the form:
  `Cœur de l'Om · 140 rue Pioch Boutonnet, 34090 Montpellier · Cabinet ouvert sur rendez-vous` (localised — see Regional Copy doc).
- [ ] Embed a Google Map of the address.

### 1.5 Localise every image ALT text *(High — Quick)*
`components/OfficeCarousel.tsx` hardcodes **French** ALT on all language versions.
- [ ] Move ALT strings into the dictionaries (or a per-lang manifest) and look them up by `lang`. Full FR/DE/EN ALT text for all 8 gallery photos, the About portrait, the logo, the 7 therapy icons and the 4 "Why" icons is in **Additional Content §1** — drop-in.
- [ ] Therapy-icon ALT already uses `therapy.title` (localised) — verify it matches the doc's intent (therapy name, not Montpellier).

### 1.6 Sitemap + Search Console *(High — Quick — see reality-check)*
- [ ] Confirm `https://coeurdelom.fr/sitemap.xml` and `/robots.txt` resolve on the **production** deploy (they exist in code as `app/sitemap.ts` / `app/robots.ts`).
- [ ] Verify the property in **Google Search Console**, submit the sitemap, and inspect why a `site:coeurdelom.fr` search returns almost nothing (indexing/coverage report).

### 1.7 Free PageSpeed check *(High — Quick)*
- [ ] Run pagespeed.web.dev — likely flags unoptimised images / lazy-loading. Note: site already uses `next/image`, so wins may be modest.

---

## Phase 2 — On-site, needs some dev/content time

### 2.1 FAQ crawlability + FAQPage schema *(Medium — Moderate — see reality-check)*
- [ ] Refactor `components/TherapyFAQ.tsx` so **all** answers render into static HTML (e.g. map every Q&A into the DOM, hide inactive ones with CSS / `hidden` attribute) instead of rendering only the state-selected one. Confirm the answer text appears in **View Source** for every therapy and every tab.
- [ ] Once crawlable, add **FAQPage** JSON-LD built from the existing accordion Q&A (Reiki, Soins vibratoires, Méditation, ChromoBioÉnergie, Tambour, Massage Amma, Feng Shui). Validate with Rich Results Test.
- [ ] Apply the same check to `components/FAQAccordion.tsx` and the About-page FAQ tabs (template-level, not just Therapies).

### 2.2 Blog: internal links + byline fix *(Medium — Quick)*
The blog is **not** empty — 13 translated articles (latest 30/03/2026). Gap is usage, not volume.
- [ ] Add internal links from articles → relevant `/therapies` sections and `/contact` (e.g. the Méditation article → Méditation entry + booking).
- [ ] Resolve the byline mismatch ("Valérie Jourdan" in `post.author` from Airtable vs `authors: [{ name: "Valérie Heydlauf" }]` in `app/[lang]/layout.tsx`). Pick one, fix at source (Airtable field and/or layout).
- [ ] Future articles: use the long-tail keywords from the Keyword Map (one per article, in title + H1).

### 2.3 Contact details: phone + availability *(Medium — Quick — depends on Phase 0)*
- [ ] If a phone number is chosen, add it + stated availability ("sur rendez-vous") next to the email and booking link, and add `telephone` to the JSON-LD. (Part of NAP consistency.)

### 2.4 Session duration / pricing per therapy *(Medium — Moderate — depends on Phase 0)*
- [ ] Add indicative duration (and price, if sharing) to each therapy. Only Massage Amma ("30 min") currently has one.

### 2.5 Descriptive image filenames *(Medium — Quick, batch at next image update)*
- [ ] Rename `IMG_2681.jpeg` → `cabinet-naturopathie-montpellier.jpg`, etc. Update references in `OfficeCarousel.tsx` / manifest. Low individual value; do as a batch.

### 2.6 LocalBusiness schema completion *(High — Moderate — see reality-check)*
- [ ] In `components/StructuredData.tsx`, add `geo` (lat/long for 140 rue Pioch Boutonnet) and `telephone` (if chosen); confirm the component is rendered on **every** page; validate with Rich Results Test.

---

## Phase 3 — Off-site listings & directories

Sequence matters: **Google first**, then Bing (imports from Google), Apple in parallel. Use the locked NAP everywhere.

### 3.1 Google Business Profile *(High — Moderate)* — single highest-impact step
- [ ] Claim/create for "Cœur de l'Om", 140 rue Pioch Boutonnet, 34090 Montpellier.
- [ ] Category: Naturopathic practitioner / Wellness centre. Add phone, hours, booking link `cal.com/coeurdelom`, photos (the 8 office gallery shots), and the ready-written description (Additional Content §3, all 3 langs).
- [ ] Verification: prepare a NAP-matching document or filmed walkthrough (see Phase 0). GPS-tagged/original photos only — no stock/AI images.

### 3.2 Bing Places *(Medium — Quick)*
- [ ] After Google is live, register at bingplaces.com (Microsoft account + address; no doc upload) and **Import from Google** to avoid re-entry. Now feeds Copilot local answers.

### 3.3 Apple Business Connect *(Medium — Moderate, can run in parallel)*
- [ ] Set up at businessconnect.apple.com with a domain work email + Apple ID (2FA). Verify via **DNS TXT record** (faster — domain is controlled directly) rather than waiting on document review. 14-day window; review up to 5 business days.

### 3.4 French wellness/health directories *(Medium — Quick)*
Submit with identical NAP to: PagesJaunes, Annuaire AEMN, annuaire.naturopathe.net, Resalib, Annuaire Thérapeutes, Annuaire Santé Bien-être, Therapeutes.com. (URLs in the Visibility Checklist §4.)

### 3.5 Facebook Business Page *(Medium — Quick)*
- [ ] Replace the personal profile (`facebook.com/profile.php?id=100093266420283`, hardcoded in `components/Footer.tsx:29`) with a proper **Business Page** (custom username, address, hours, booking link, category).
- [ ] Update the footer link once live. (Personal profiles are invisible to logged-out users and don't get indexed.)

---

## Phase 4 — Ongoing / investment

- [ ] **Google reviews** — once GBP is live, ask satisfied clients; respond to each (review-driven niche).
- [ ] **Backlinks beyond directories** — Cers-TA Heilpraktiker/naturopathe directory, Médoucine, La Plateforme Bien-Être; cross-link with neighbourhood practices (Studio Ginkgo, Om Sweet Om — same Pioch Boutonnet area); local Montpellier press / "what's on" sites.
- [ ] **Instagram** with location tags (Montpellier, Pioch Boutonnet) — none exists; also feeds GBP photos and review prompts.
- [ ] **Testimonials section** on-site *(Low — Moderate)* — add once Google reviews exist to draw from (currently no trust signals beyond the diplomas list).

---

## Keyword & copy strategy (apply throughout)

From the SEO Keywords workbook — bake these into the meta/H1/body work above:
- **Lead with "naturopathe Montpellier"**, not "Heilpraktikerin" (near-zero FR search volume; keep it as a *credential* in body/About copy only).
- **Add "soins énergétiques" / "énergéticienne"** as secondary keywords — that's what Montpellier competitors rank for; "soins vibratoires" stays as the brand differentiator.
- **Chromobio-Énergie** = low-competition branded long-tail → the ChromobioTest page is well placed to own it; don't fight generic "chromothérapie".
- **DE/EN serve a different audience** (German/English-speaking residents & expats in/around Montpellier) — phrase intros for them ("deutschsprachige Praxis in Montpellier" / "English-speaking naturopath"), don't mirror French intent.
- **Indexing first** — keywords do nothing until pages are crawled (Phase 1.6).

---

## Open questions / decisions (owner: Valérie)

1. Phone number — take calls? (gates NAP, JSON-LD `telephone`, several listing fields)
2. Show prices, or duration only?
3. Correct blog byline — Jourdan or Heydlauf?
4. Which GBP verification path (document vs filmed walkthrough)?
5. German homepage tagline still has the redundant "fließenden Energiefluss" ("flowing energy-flow") — fix to "den Energiefluss harmonisieren" at next copy update?

---

## Appendix — drop-in meta copy

Per-page meta titles/descriptions (from the Keyword Map & Regional Copy docs). Full body copy, the complete ALT-text set, and the GBP description live in the source documents — referenced inline above rather than duplicated in full here.

### Français
| Page | Meta title | Meta description |
|---|---|---|
| Accueil | Cœur de l'Om — Naturopathe et Soins Vibratoires à Montpellier \| Valérie Heydlauf | Cabinet de naturopathie à Montpellier (quartier Pioch Boutonnet). Soins vibratoires, méditation et Chromobio-Énergie avec Valérie Heydlauf, Heilpraktikerin diplômée depuis plus de 20 ans. Prenez rendez-vous en ligne. |
| Qui suis-je ? | Qui suis-je ? Valérie Heydlauf, Naturopathe à Montpellier \| Cœur de l'Om | Valérie Heydlauf, Heilpraktikerin diplômée en Allemagne depuis 2004, exerce à Montpellier. Spécialiste en Chromobio-Énergie et soins vibratoires, plus de 20 ans d'expérience en naturopathie holistique. |
| Soins / Thérapies | Soins Vibratoires et Énergétiques à Montpellier \| Cœur de l'Om | Reiki, chromothérapie, médecine traditionnelle chinoise, Feng Shui et tambour chamanique à Montpellier. Découvrez les soins vibratoires et énergétiques proposés par Cœur de l'Om. |
| Pourquoi | Pourquoi Consulter un Naturopathe à Montpellier ? \| Cœur de l'Om | Découvrez les bienfaits des soins énergétiques et d'une approche holistique du bien-être avec Cœur de l'Om, cabinet de naturopathie à Montpellier. |
| ChromobioTest | ChromobioTest — Bilan Chromobio-Énergie à Montpellier \| Cœur de l'Om | Réalisez votre bilan énergétique en couleur avec le ChromobioTest, méthode de chromothérapie en trois dimensions proposée à Montpellier par Cœur de l'Om. |
| Contact | Prendre Rendez-vous à Montpellier \| Cœur de l'Om | Réservez votre consultation de naturopathie, soins vibratoires ou méditation au cabinet Cœur de l'Om, 140 rue Pioch Boutonnet à Montpellier. Réservation en ligne disponible. |

### Deutsch
| Page | Meta title | Meta description |
|---|---|---|
| Startseite | Cœur de l'Om — Heilpraktikerin und Schwingungstherapie in Montpellier | Naturheilpraxis in Montpellier (Stadtviertel Pioch Boutonnet). Schwingungstherapie, Meditation und Chromobio-Energie mit Valérie Heydlauf, diplomierte Heilpraktikerin mit über 20 Jahren Erfahrung. Termin online vereinbaren. |
| Wer bin ich? | Wer bin ich? Valérie Heydlauf, Heilpraktikerin in Montpellier \| Cœur de l'Om | Valérie Heydlauf, diplomierte Heilpraktikerin seit 2004, praktiziert in Montpellier. Spezialisiert auf Chromobio-Energie und Schwingungstherapie, über 20 Jahre Erfahrung in ganzheitlicher Naturheilkunde. |
| Behandlungen | Schwingungstherapie und Energiebehandlungen in Montpellier \| Cœur de l'Om | Reiki, Chromotherapie, Traditionelle Chinesische Medizin, Feng-Shui-Beratung und schamanische Trommel in Montpellier. Entdecken Sie die Schwingungstherapie von Cœur de l'Om. |
| Warum | Vorteile der Naturheilkunde in Montpellier \| Cœur de l'Om | Erfahren Sie, wie Schwingungstherapie wirkt und warum ein ganzheitlicher Ansatz Ihr Wohlbefinden stärkt. Naturheilpraxis Cœur de l'Om in Montpellier. |
| ChromobioTest | Chromobio-Energie-Test in Montpellier \| Cœur de l'Om | Erstellen Sie Ihre Farbtherapie-Bilanz mit dem Chromobio-Energie-Test, einer dreidimensionalen Chromotherapie-Methode der Praxis Cœur de l'Om in Montpellier. |
| Kontakt & Termin | Termin in Montpellier vereinbaren \| Cœur de l'Om | Vereinbaren Sie Ihren Termin für Naturheilkunde, Schwingungstherapie oder Meditation in der Praxis Cœur de l'Om, 140 rue Pioch Boutonnet in Montpellier. Online-Buchung verfügbar. |

### English
| Page | Meta title | Meta description |
|---|---|---|
| Homepage | Cœur de l'Om — Naturopath and Vibratory Healing in Montpellier | Naturopathy practice in Montpellier (Pioch Boutonnet district). Vibratory healing, meditation and Chromobio-Energy with Valérie Heydlauf, a certified Heilpraktikerin with over 20 years' experience. Book an appointment online. |
| About Me | About Valérie Heydlauf, Naturopath in Montpellier \| Cœur de l'Om | Valérie Heydlauf, a certified Heilpraktikerin since 2004, practises in Montpellier. Specialising in Chromobio-Energy and vibratory healing, with over 20 years of experience in holistic naturopathy. |
| Therapies | Vibratory Healing and Energy Therapies in Montpellier \| Cœur de l'Om | Reiki, chromotherapy, Traditional Chinese Medicine, Feng Shui consultations and shamanic drum sessions in Montpellier. Discover the vibratory healing therapies offered at Cœur de l'Om. |
| Why | Benefits of Naturopathy in Montpellier \| Cœur de l'Om | Discover how energy healing works and why a holistic approach supports lasting wellbeing. Naturopathy practice Cœur de l'Om in Montpellier. |
| ChromobioTest | Chromobio-Energy Test in Montpellier \| Cœur de l'Om | Get your colour therapy assessment with the Chromobio-Energy test, a three-dimensional chromotherapy method offered at Cœur de l'Om in Montpellier. |
| Contact | Book an Appointment in Montpellier \| Cœur de l'Om | Book your naturopathy, vibratory healing or meditation consultation at Cœur de l'Om, 140 rue Pioch Boutonnet in Montpellier. Online booking available. |

---

## Key files (implementation map)

| Concern | File |
|---|---|
| Root metadata, `og:locale`, author tag | `app/[lang]/layout.tsx` |
| Per-page meta (hreflang pattern to copy) | `app/[lang]/chromobiotest/page.tsx` |
| Page metas to localise | `app/[lang]/{page,about,therapies,why,contact,blog}/page.tsx` |
| Sitemap / robots (already exist) | `app/sitemap.ts`, `app/robots.ts` |
| JSON-LD (add geo + telephone + FAQPage) | `components/StructuredData.tsx` |
| FAQ crawlability refactor | `components/TherapyFAQ.tsx`, `components/FAQAccordion.tsx` |
| Localise carousel ALT text | `components/OfficeCarousel.tsx` |
| Facebook link to update | `components/Footer.tsx` (line ~29) |
| Copy strings | `lib/dictionaries/{fr,de,en}.json` (loader: `lib/i18n.ts`) |
| Gallery images to rename | `public/images/office/*.jpeg` |
