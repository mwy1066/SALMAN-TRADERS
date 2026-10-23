# First implementation pass — 12 October 2026

This is the follow-up to the original `WEBSITE-REVIEW.md` audit. The review remains a historical record of the starting point.

## Completed

- Replaced separate headers with a shared, readable Salman Traders header on the homepage, product pages and cart. Added a visible cart count, mobile navigation, Escape-key dismissal, skip link and keyboard focus outlines.
- Added browser storage for the enquiry cart, safe restoration, quantity controls, item removal, clear-cart behavior, and synchronization between tabs. Storage failures leave the current session usable and display a notice.
- Added a WhatsApp enquiry draft containing product names, quantities and product URLs. Saved prices are clearly labeled estimates and are not included as confirmed prices in the draft.
- Added the cart control to product details, alongside the existing individual enquiry option.
- Changed the homepage and product detail routes to request-time data loading. Product requests bypass caching and time out after 10 seconds.
- Separated service failures, empty catalogues and missing products. Added retry/contact guidance and kept genuine missing-product 404 behavior.
- Normalized nullable fields and missing prices, and selected explicit public catalogue columns.
- Connected category cards, filters and footer category links; normalized the lithium-battery category name; corrected the empty-search message and added a clear-search control.
- Replaced starter metadata with Salman Traders titles/descriptions and product-specific metadata. Added a visible homepage H1 and main landmark; marked the cart as noindex.
- Set the standard dev/build commands to the verified Webpack path and removed unused build-time Google Font downloads.

## Checkpoint

`.checkpoints/before-enquiry-flow-2026-10-12.zip` contains the original application source, public assets, package files and project configuration. Environment files, dependencies and build outputs were excluded. No Git repository was initialized.

## Verification

| Check | Result |
| --- | --- |
| Unit tests | 11 passed |
| Standard `npm run build` | Passed, including TypeScript; the generated homepage and product detail routes are dynamic |
| Fixture-service integration checks | Five groups passed: fresh data, genuine 404, empty catalogue, service failure, recovery |
| Real Supabase catalogue | Existing Hystorix listing and product detail page loaded successfully |
| Category navigation | Hybrid Inverters excludes the battery; Lithium Batteries restores it |
| Cart navigation/reload | Two units remained selected after a full page reload |
| Cross-tab synchronization | Increasing quantity to three updated the second tab and its subtotal/draft |
| Quantity decrease | Updated quantity, line total, subtotal and enquiry text |
| Removal/reload | Removed product stayed removed after reload |
| Product detail | Shared header, product-specific title, add-to-cart control and existing description verified |
| Search | No-match message, Clear Search and restored listing verified |
| Mobile menu | Navigation closed the menu; Escape dismissed it and returned focus to the toggle |
| Desktop layout | Checked at 1440px |
| Narrow mobile layout | Cart and product page checked at 320px; no document-level horizontal overflow |
| Mobile homepage | Checked at 390px; no document-level horizontal overflow; one H1 and one main landmark |
| Browser console | No error or warning entries returned during the sampled final flow |
| WhatsApp | Encoded destination and draft contents inspected; no message sent |

The browser cart was returned to one unit after the test sequence. No real product records were altered. A restricted build attempt initially hit a filesystem permission error in generated output; the authorized build completed successfully.

## Screenshots

Evidence from the local production preview is saved in `output/implementation-2026-10-12/`:

- `desktop-home.jpg`: readable shared header and existing hero.
- `desktop-cart.jpg`: two-unit quotation basket and enquiry action.
- `mobile-home.jpg`: 390px homepage.
- `mobile-cart.jpg`: full cart at 320px.

## Follow-up verification — 12 October 2026

At the user's request, reran the 11 unit tests, production build, lint and all five integration check groups. All passed. Lint initially found the footer Home link using an HTML anchor and two incorrectly positioned image-warning comments; the link now uses Next Link and the comments are scoped correctly. The final lint run returned zero errors or warnings, and the final build passed TypeScript.

The real catalogue loaded in the production browser preview. Adding a second unit, opening the cart and reloading preserved quantity two and the PKR 460,000 saved estimate. The WhatsApp draft included the product and quantity. The cart fit a 320px viewport without horizontal overflow; the sampled browser console returned no warnings or errors. The original one-unit cart was restored after verification. A fresh desktop capture is saved as `output/implementation-2026-10-12/recheck-desktop-cart.jpg`.

## Remaining launch work

- Complete and verify the intended product catalogue and any model-specific claims already in the database.
- Confirm domain/hosting and enable the prepared canonical, sitemap and indexing configuration on the production deployment.
- Verify the final hosted pages and actual enquiry destination on the intended customer devices.

The site has not been deployed. Automated fault tests used a separate local fixture service. Persistence is browser-local, not an account or cross-device feature, and saved prices remain estimates until confirmed by the team.

## Second implementation pass — launch preparation

- Added an explicit `SITE_URL` / `SITE_INDEXABLE` configuration with a blank-domain, noindex default for local and preview environments. Invalid configured origins fail clearly. `.env.example` contains names and empty placeholders only.
- Added canonical and Open Graph/Twitter metadata for the homepage and products. Category query views canonicalize to the homepage; the cart retains noindex and has no canonical.
- Added dynamic robots.txt and sitemap.xml endpoints. Public sitemaps use current catalogue records, exclude cart/filter URLs, and report a temporary service failure with 503/Retry-After rather than returning an incomplete successful sitemap.
- Added Organization/WebSite JSON-LD using established business identity and the configured domain. Product commercial and technical claims were not promoted to structured data.
- Replaced the starter favicon with the supplied logo reference. Added a 1200 × 630 sharing card generated from the supplied logo and existing brand colors.
- Added a reusable, read-only catalogue audit and `CATALOGUE-INTAKE.md`. The live audit on 12 October found one Hystorix battery listing and no inverter, panel or UPS listings. Exact-model evidence and commercial confirmation remain outstanding.
- Created `.checkpoints/before-launch-seo-2026-10-12.zip` before changing application files, including the original favicon. No environment keys were included.

Production indexing remains disabled until the real domain and launch settings are provided. No database records or hosting accounts were changed.

### Second-pass verification

- All 16 unit tests passed; lint passed without warnings or errors.
- Production compilation and TypeScript passed; robots.txt, sitemap.xml and the sharing image appear as dynamic routes.
- All five existing catalogue integration groups passed after the changes.
- All four new SEO integration groups passed: rendered metadata/schema/icon, public sitemap and outage recovery, sharing-image generation, and preview isolation.
- Rendered canonicals were checked using an isolated HTTPS example domain. Next.js normalizes the homepage canonical by removing its trailing slash; URL equivalence is verified in the test.
- The 1200 × 630 PNG was visually inspected: the supplied logo, headings, category line and quotation call to action are readable and unclipped. Saved at `output/launch-preparation/share-image.png`.
- The live read-only audit succeeded and found one public product. Product specifications and commercial claims are still unverified against manufacturer/owner sources.
- Temporary verification servers were stopped. No deployment or message sending occurred.

## Third implementation pass — owner catalogue (completed 13 October 2026)

- Added 39 owner-supplied entries alongside the existing database listing: 26 hybrid inverters and 13 new batteries. The website now contains 40 listings in total, including 14 batteries.
- The owner explicitly confirmed that Hystorix 5kWh is the existing PowerHub 5.12kWh product. Its database ID, stored price, photo and description were preserved; no duplicate was added.
- Added brand filtering, specification/capacity search, and Show More Products in batches of 12. Category changes reset filters.
- Added neutral brand/capacity cards where photos are missing. No product photos or model codes were invented. New entries show Price on enquiry and Contact for Availability.
- Retained phase, LV/HV, IP ratings, series and Pytes 51V exactly as supplied. These are owner-provided details; exact-model datasheets and additional assets are still pending.
- Extended the catalogue audit and sitemap checks to cover the merged source/database catalogue. New entries live in `lib/owner-catalogue.ts`; no database records were inserted or changed.
- Created `.checkpoints/before-catalogue-expansion-2026-10-12.zip` before application edits.

### Verification

- All 19 unit tests passed, including counts, unique IDs, specification fidelity and database merge precedence.
- Production build, TypeScript and lint passed without errors or warnings.
- All six catalogue integration groups and four SEO integration groups passed. New source-managed product routes and their sitemap URLs were verified.
- Live read-only audit confirmed 40 website listings from one database row plus 39 owner entries.
- Desktop browser: 40 products, Show More expanded 12 cards to 24, SAJ plus IP66 returned the expected four entries, and the SAJ 6kW detail page showed its supplied phase and IP66 rating.
- Mobile browser: battery category showed 14 entries; GoodWe filter returned three batteries. Catalogue and GoodWe 14.3kWh detail page fit at 320px with no horizontal overflow.
- Inspected the user's existing mixed-price cart without changing it: PowerHub retained PKR 230,000; Dyness 10kWh showed Price on enquiry; summary showed Known-price subtotal and a quotation-needed notice. WhatsApp draft included both products and quantities. No message was sent.
- Sampled browser console returned no errors or warnings.
- Evidence: `output/catalogue-expansion/desktop-catalogue.jpg` and `output/catalogue-expansion/mobile-catalogue.jpg`.

Next content inputs: official product-page links, exact model identifiers, approved images and matching datasheets. Links can be supplied one brand at a time. Downloaded files are only needed when linked content is inaccessible. Domain/hosting remains undecided in this chat.

## Header and hero browser annotations — 13 October 2026

- Applied the final successive colour choices: outer header #827e7e, full-width header row #a5a8a2 and action area #aaa7a7. Earlier white/green/black experiments were superseded by the later values.
- Removed the header's Solar Energy Solutions tagline, the hero eyebrow line and the hero descriptive paragraph. Preserved the supplied logo and established Salman Traders spelling.
- Desktop header uses three balanced columns: logo/name on the left, centred navigation, and Cart/WhatsApp on the right. Row height is 100px; navigation uses 20px, weight 900 Arial and 28px spacing. The logo/name uses Georgia with a 2px gap and an approximately 301px desktop footprint. WhatsApp has a 1px border and approximately 135px width.
- Translated the experimental 2900px row width to 100% of the viewport. The brand uses readable 16px mobile/24px desktop type rather than a 90px inherited size. The action group fits both controls rather than forcing them into 71px or 171px. The later button annotations and explicit right-side-controls instruction were taken to supersede the ambiguous DELETE note on that group; black/brown styling was removed.
- Desktop navigation begins at 1280px; smaller screens retain the menu and cart. Hero heading uses a 218px minimum height from 768px upward and natural mobile height, preventing clipping when text wraps or grows.
- Production build, TypeScript and lint passed. Browser checks at 1480px, 1280px and 320px found no horizontal overflow; navigation centre matched header centre at 1480px, desktop header measured 100px and hero heading measured 218px. Mobile menu and Escape/focus return worked. Sampled console contained no warnings or errors.
- Checkpoint: `.checkpoints/before-header-annotations-2026-10-13.zip`. Screenshots: `output/header-annotations/desktop.jpg` and `output/header-annotations/mobile.jpg`.

### Follow-up header refinements

- Updated header row/mobile-menu background to #f8fcf4 and the action area to #f9f7f7.
- Changed the header wordmark to title-case Salman Traders at font weight 600. Enlarged the existing logo to 84 × 84px from 640px upward and a 52px-wide, 60px-high contain box on smaller screens, preserving its aspect ratio. Image font weight has no visual effect and was not used to simulate a logo change.
- Renamed the category display label to Solar Inverters across the category card, filter, footer and product category labels. Preserved the existing hybrid-inverters URL and added a solar-inverters alias, so existing links and stored category values still select the same 26 products. Individual product names retain their hybrid designation.
- All 19 unit tests, lint, TypeScript and the production build passed. Browser verified exact colours, title case, weight 600 and an 84px logo at 1480px. Mobile checked at 320px without horizontal overflow. Existing inverter category URL returned 26 products.
- Latest screenshots: `output/header-annotations/light-header-desktop.jpg` and `output/header-annotations/light-header-mobile.jpg`.
