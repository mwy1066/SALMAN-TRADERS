# Salman Traders website review

Reviewed on 12 October 2026 (Asia/Karachi).

The existing project provides a working catalogue foundation. It is not ready for a public launch with the current shopping-cart journey, product refresh behavior, and search metadata. Preserve the existing Salman Traders identity and architecture while completing those areas.

## Scope and continuity

- Reviewed the application source in this directory, the available recent exchanges from **ST WEBSITE**, and both attached screenshots.
- The conversation import exposed five recent exchanges. Earlier assistant responses were reference markers, so the full original plan was not available.
- This review made no intentional feature or design changes and did not publish the site, change database records, or send WhatsApp messages. Builds generated local Next.js output.
- The directory is not currently a Git repository. Create a version-control checkpoint before implementation work.

## Current implementation

- Next.js 16.4.0, React 19.3.0, TypeScript, Tailwind CSS, and Supabase, as declared in `package.json`.
- Homepage with mobile navigation, hero, categories, searchable/filterable catalogue, About section, and contact footer.
- Database-backed product detail route at `/products/[id]`.
- Product-specific WhatsApp enquiry links.
- Client-side cart context and a `/cart` route with quantities, removal, subtotal, and clear-cart controls.
- The tested production preview displayed one product record, **Hystorix PowerHub 5.12kWh**, at **PKR 230,000**. These are current application values, not independently verified commercial or manufacturer facts.

## Priorities

### 1. Complete the cart and enquiry journey — high

**Evidence:** `app/AddToCartButton.tsx:16`, `context/CartContext.tsx:38`, `app/cart/page.tsx:88`, and both homepage headers.

The homepage offers **Add to Cart**, but no visible navigation links to `/cart`. The cart is stored only in React memory. Browser reproduction: click **Add to Cart**, observe **Added to Cart**, then open `/cart` with a full navigation; the cart is empty. The cart page has no action to send its contents as an enquiry or complete an order, and no quantity adjustment control. Product detail pages only expose a single-product enquiry.

**Recommended outcome:** A visible cart/enquiry link and count on mobile and desktop; selections retained across reloads; editable quantities and removal; an enquiry action containing selected product names, quantities, and product URLs. Keep price and availability subject to confirmation where appropriate.

The existing site emphasizes WhatsApp enquiries. A quotation basket is the closest fit to the current implementation. Direct online checkout would require a separate, explicit scope covering payments, order storage, delivery, and policies.

**Acceptance:** Add two items or two units, navigate between pages, reload, adjust quantities, remove an item, and review a correctly encoded WhatsApp enquiry containing the final selection. Opening a draft is separate from sending a message.

### 2. Keep catalogue data current and handle failures — high

**Evidence:** `app/page.tsx:5`, `app/page.tsx:161`, `app/products/[id]/page.tsx:14`, and the successful production build's route summary.

The production build classified `/` as static and `/products/[id]` as dynamic. The homepage product list is therefore captured at build time; there is no configured revalidation policy. Database changes can leave homepage prices or listings out of date while product details use newer data. This was established from build output and source; no database records were changed to simulate a price update.

The homepage ignores the query's `error` and passes an empty array when data is unavailable. A failed query can appear to customers as an empty catalogue, including during a build. Product details turn every database error into `notFound()`, so a temporary service problem appears as a missing product.

**Recommended outcome:** Choose explicit request-time loading or bounded revalidation for the catalogue. Distinguish empty results, failed requests, and missing products. Add useful retry/contact guidance, check required configuration, and validate nullable product fields before filtering or displaying prices.

**Acceptance:** A controlled product update appears on the homepage within the agreed refresh window; a simulated request failure produces an error state rather than an empty catalogue or false product 404. Perform fault tests in a controlled environment.

### 3. Repair desktop branding and share navigation — high visibility

**Evidence:** `app/page.tsx:13`, `app/page.tsx:27`, `app/page.tsx:31`, and the 1440px browser preview.

The desktop header has a white background and a white company-name heading. The company name is invisible, and the pale green tagline has poor contrast. The mobile header uses readable dark text. Product and cart pages have separate navigation implementations.

**Recommended outcome:** One consistent, accessible header across the homepage, product pages, and cart; readable brand colors at all breakpoints; working product, contact, and cart navigation.

**Acceptance:** Check desktop, tablet, and narrow mobile layouts, including keyboard focus and menu operation. Retain the supplied Salman Traders logo.

### 4. Establish a dependable production build — release requirement

**Evidence:** Build runs during this review.

- `node node_modules/typescript/bin/tsc --noEmit --incremental false`: passed.
- `npm.cmd run build`: failed first because Google Fonts could not be fetched in the restricted environment.
- Network-enabled retry: failed with an internal Turbopack error while processing `app/globals.css`; its child Node process exited before connecting.
- `npm.cmd run build -- --webpack`: passed compilation, TypeScript, static generation, and trace collection.
- The resulting production output served successfully with `next start` and was used for browser checks.

**Recommended outcome:** Select and document a reproducible bundler/runtime configuration for deployment. Investigate the default Turbopack failure without assuming it is caused by application CSS. Either use the imported Geist fonts consistently or remove/self-host the unused fonts; the current body style explicitly uses Arial.

**Acceptance:** The chosen documented production command succeeds from a clean environment and serves the expected routes. Hosting-specific validation remains necessary.

### 5. Replace starter SEO and improve page semantics — before launch

**Evidence:** `app/layout.tsx:16`, `app/page.tsx:27`, `app/page.tsx:83`, and the browser page title.

All tested pages use **Create Next App** and the starter description. There is no product-specific metadata implementation, sitemap route, robots route, canonical configuration, or structured data in the reviewed source. The homepage lacks a `main` landmark. Its sole H1 is the brand in the desktop-only navigation; the mobile layout has no visible H1, while the hero uses H2.

**Recommended outcome:** Accurate business and product titles/descriptions, a visible descriptive homepage H1, a main landmark, social-sharing metadata, sitemap, and robots configuration. Configure canonical URLs once the real domain is known. Use verified business/product facts for structured data; do not invent ratings, warranties, prices, certifications, or addresses.

**Acceptance:** Inspect rendered metadata for the homepage and a product, validate the sitemap and crawl directives on the intended domain, and confirm accessible page structure.

### 6. Finish catalogue behavior and content — before launch

**Evidence:** `app/page.tsx:128`, `app/page.tsx:141`, `app/ProductCatalog.tsx:23`, `app/ProductCatalog.tsx:89`, and browser checks.

- All homepage category cards point to the same `#products` anchor. Clicking **Hybrid Inverters** still displays the battery; the card does not activate the relevant filter.
- The catalogue filter uses **Lithium Battery**, while category cards use **Lithium Batteries**. The current product matches the filter, but a shared category definition would avoid future mismatches.
- A no-match text search says **No products available in this category yet**, which incorrectly describes the search result.
- Only one product appeared during the review. Complete the intended launch catalogue with confirmed product details and appropriate stock/price handling.
- The displayed product description includes safety, certification, enclosure, and compatibility claims. Their presence in the database does not verify them; reconcile them with exact-model manufacturer documents before launch.

**Recommended outcome:** Category cards select the intended category, filters have a visible and accessible selected state, search has accurate empty-result wording, and product specifications are easy to scan and supported by source documents.

## Verification completed

| Check | Result |
| --- | --- |
| TypeScript | Passed |
| Default production build | Failed in this environment; details above |
| Webpack production build | Passed |
| Production server | Served homepage, cart, and a real product detail page |
| Mobile menu at 390px | Opened; selecting Products closed it and navigated to the catalogue |
| Product search | Matching search retained the product; nonmatching search showed an empty state |
| Battery filter | Displayed the current matching product |
| Category card | Confirmed it scrolls without selecting a filter |
| Cart | Add feedback appeared; full navigation to cart lost the selection |
| Desktop header at 1440px | Confirmed white company-name text on white background |
| Narrow layout at 320px | No document-level horizontal overflow on sampled homepage and product page |
| Homepage images | All image elements reported loaded in the inspected desktop DOM |
| Browser console | No error/warning entries returned during the sampled checks |
| Product details | Loaded name, price, availability wording, description, image, and enquiry link |

The mobile samples are not a complete device/accessibility audit. No live-domain deployment, database row-level-security policy, manufacturer specification, real WhatsApp delivery, analytics, or payment flow was verified. No performance score was measured.

## Recommended implementation order

1. Create a recoverable source checkpoint and settle the production build command.
2. Repair and share the header; connect a persistent cart/enquiry flow.
3. Set catalogue refresh behavior and distinguish product-data errors from empty/missing results.
4. Correct category navigation, finish verified product content, and add SEO/semantic structure.
5. Run the complete mobile/desktop enquiry journey and the target hosting checks before launch.

The first implementation milestone is complete when a visitor can find a product, select items, return later without losing them, review an accurate enquiry, and reach Salman Traders through a clear contact action while the catalogue remains current and errors are understandable.
