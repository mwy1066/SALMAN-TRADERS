# Salman Traders website

A Next.js catalogue with product details, category/brand filtering, and a persistent WhatsApp enquiry cart. The existing Supabase `Products` table is combined with the owner's catalogue in `lib/owner-catalogue.ts`.

## Run locally

Use Node.js 22.18 or newer for the native TypeScript unit tests. This implementation was checked with Node.js 26.11.1.

```powershell
npm install
npm run dev
```

Open the Local URL printed by Next.js. Both development and production builds use Webpack, the bundler verified for this project. The site uses the existing Arial system-font stack and does not download Google Fonts during builds.

The existing `.env.local` must contain:

```text
NEXT_PUBLIC_SUPABASE_URL=<your Supabase project URL>
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<your Supabase publishable key>
```

The product service also accepts server-only `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY` overrides. The integration check uses these to connect to an isolated local fixture service. Do not commit `.env.local`.

## Production and verification

```powershell
npm test
npm run build
node tests/catalog-integration.mjs
node tests/seo-integration.mjs
npm run start
```

- `npm test`: 19 unit tests covering saved-cart restoration, invalid data, storage failures, quantities, enquiry encoding, category aliases, nullable product fields, owner-list completeness, specification fidelity, catalogue merging, canonical configuration, sitemap encoding and safe structured data.
- `npm run build`: production compilation and TypeScript validation. The homepage and product detail routes render on demand.
- `node tests/catalog-integration.mjs`: run after building. Starts a temporary production server on `127.0.0.1:3101` and a fixture service on an available loopback port; checks data freshness, missing products, empty results, outages, and recovery. It does not write to the real database. Both temporary processes are closed when the checks finish.
- `npm run start`: serve the latest production build.
- `node tests/seo-integration.mjs`: run after building. Uses a fixture catalogue and temporary production server on `127.0.0.1:3102` to inspect rendered SEO, sitemap failure/recovery, preview noindex behavior and the 1200 × 630 sharing image. Saves the image to `output/launch-preparation/share-image.png` for visual review. No real database writes.

On Windows, use `npm.cmd` if the shell's script policy blocks `npm.ps1`. If stale generated development route types conflict after a route-layout change, stop the development server and refresh the generated `.next/dev/types` cache before rebuilding; application files do not need to be removed.

## Product data and enquiry behavior

The application reads `id`, `name`, `brand`, `category`, `price`, `image_url`, `description`, and `stock_quantity`. Requests bypass the Next.js data cache and have a 10-second timeout. Invalid or missing prices display as **Price on enquiry**. A genuinely missing product returns 404; a product-service failure uses the retry flow.

The 12 October owner list adds 39 source-managed entries (26 inverters and 13 batteries). The owner confirmed that its Hystorix 5kWh entry is the existing PowerHub 5.12kWh database record, resulting in 40 current listings. That record retains its original ID, photo, price and description. New listings have no inferred stock, price, photo, warranty or model number. Phase/IP/LV/HV/series details are limited to the supplied list. Capacity cards identify products while photos are pending.

Edit `lib/owner-catalogue.ts` to maintain these new entries. They are not inserted into Supabase by this implementation. Database records take precedence on identical IDs; if migrating into a UUID-only table, explicitly map the new database ID to the existing public URL before removing a source entry. Do not simply duplicate the entries under new IDs, because that would duplicate listings and break saved product links. Database service failures still use the error flow rather than silently hiding its products.

The catalogue offers brand filtering, name/capacity/specification search and batches of 12 cards. Category changes reset the brand/search filters. All product URLs are included in the configured production sitemap regardless of the current display batch.

Cart selections are saved in this browser under `salman-traders.enquiry-cart.v1`, restored after reloads, and synchronized between open tabs. They are not synchronized between devices. Quantity controls allow 1–999 units per item. If browser storage is unavailable, the current session remains usable and the cart shows a notice.

Cart prices are saved estimates. The WhatsApp draft contains product names, quantities, and links, and asks the team to confirm current prices, availability and delivery. The customer reviews and sends the message in WhatsApp. This is a quotation flow; it does not create an order or take payment.

Product links in the draft use the current website origin. Local previews therefore produce local links; a deployed site will produce links for its deployed domain. The enquiry number remains the one already configured in the original project.

## Project map

- `app/SiteHeader.tsx`: shared navigation and cart count.
- `app/page.tsx`, `app/ProductCatalog.tsx`: homepage and category/search experience.
- `app/products/[id]/page.tsx`: request-time product data, metadata and add-to-cart control.
- `app/cart/page.tsx`, `context/CartContext.tsx`, `lib/cart.ts`: enquiry cart, persistence and draft generation.
- `lib/catalog.ts`, `lib/products.ts`, `lib/supabase.ts`: product normalization and server-side reads.
- `app/ProductDataError.tsx`, `app/products/[id]/error.tsx`: service failure and retry UI.

The original audit is preserved in `WEBSITE-REVIEW.md`. Completed work and browser evidence are recorded in `IMPLEMENTATION-NOTES.md`.

## Before launch

Complete the intended catalogue using exact-model specifications and confirmed business details. `CATALOGUE-INTAKE.md` lists the required inputs. Run the read-only completeness audit with `node --env-file=.env.local scripts/catalogue-audit.mjs`; its report is saved to `output/launch-preparation/catalogue-audit.md`.

### Domain and search settings

`.env.example` contains configuration names without real credentials. Set these on the chosen host **before building**:

```text
SITE_URL=https://<your-confirmed-domain>
SITE_INDEXABLE=false
```

Use the preferred HTTPS origin only: no path, query string, credentials or port. A configured invalid value fails clearly instead of silently publishing broken canonicals. `SITE_URL` stays blank locally until the domain is confirmed; no domain is guessed from a request header or preview URL.

Keep `SITE_INDEXABLE=false` on preview environments. They receive noindex metadata, robots.txt disallows crawling, and sitemap.xml returns 404. These search directives do not provide access control; use the host's private-preview feature if access restrictions are needed.

After content and hosting checks, set `SITE_INDEXABLE=true` only in the production environment and rebuild/redeploy. The homepage and category filter views canonicalize to the homepage. Each product has its own canonical and social metadata. The cart remains noindex and has no canonical. The sitemap lists the homepage and current products, excludes cart/filter URLs, and responds with 503 and Retry-After if the catalogue is unavailable.

The supplied Salman Traders logo is used for the browser icon and the `/share-image` card. Organization/WebSite structured data contains the established name, domain and logo. No unverified ratings, addresses, certification claims or product offers were added to schema.

### Hosting handoff

Use a host that supports a Next.js Node server with dynamic routes, not a static-only export. Configure the existing Supabase URL and publishable key, run `npm ci` and `npm run build`, then use the host's Next.js adapter or `npm run start`. Select a Node version supported by that host and Next.js; the native test scripts require Node 22.18 or newer. Review anonymous read permissions for public product fields in Supabase before launch. Do not add a service-role key to browser-visible configuration.

Validate HTTPS and the preferred-domain redirect, inspect `/robots.txt` and `/sitemap.xml`, check a real product's title/canonical/share preview, and test the hosted WhatsApp enquiry on the intended customer devices. Submit the production sitemap to the site's search-console account after launch. Hosting, DNS, account configuration and deployment remain pending the actual domain/host choice. The current local implementation has not been published.


## Supabase authentication

Email/password authentication uses `@supabase/ssr` cookie sessions and the project's existing Supabase URL and publishable key. The catalogue's stateless public client is kept separate. No service-role key is required and no application data schema is changed.

Routes:

- `/login`, `/signup`, `/forgot-password`: public forms.
- `/auth/callback`: exchanges a Supabase PKCE email confirmation/recovery code for a session. Email links must be opened in the browser that requested them.
- `/account` and all descendants: protected account area; `/account/password` changes the password.
- `/dashboard`: protected alias that redirects to `/account`.
- `/api/account`: returns only the current verified user's ID/email, or 401; never returns tokens.
- `/auth/sign-in`, `/auth/sign-up`, `/auth/forgot-password`, `/auth/update-password`, `/auth/sign-out`: POST-only handlers. Forms require the configured same origin. Sign-out ends this browser's session.

The header's account icon leads to `/account`, redirecting signed-out visitors to login. Home, products and the existing browser-local enquiry cart stay public. Creating an account does not turn the enquiry cart into order storage or grant administrative access.

Next.js 16 `proxy.ts` refreshes sessions and checks verified claims. Protected pages and the API also call `getUser()` before returning private data; cookie presence alone is never accepted. User-editable metadata is not used for access decisions. Auth responses are private/no-store and noindex. Auth forms submit directly to server routes and work without JavaScript. Session cookies are HttpOnly and SameSite=Lax, and use Secure when AUTH_SITE_URL is HTTPS. No browser-side Auth client is needed for this flow.

### Auth dashboard configuration

Set `AUTH_SITE_URL=http://localhost:3000` for local development; the local default is this value. Before using another port/domain, set its exact origin. On the deployed host use `AUTH_SITE_URL=https://<your-real-domain>`; `SITE_URL` is accepted as a fallback. Unrecognized form origins are rejected with 403.

In the **existing app project's** Supabase dashboard, open **Authentication → URL Configuration**:

1. Set **Site URL** to the origin used by the app.
2. Add `http://localhost:3000/auth/callback` and `http://localhost:3000/auth/callback?next=**` for local confirmation and reset links.
3. Add the equivalent two URLs for your actual HTTPS deployment. Avoid global wildcards in production.
4. Keep email/password enabled and email confirmation enabled. The default confirmation/recovery email templates can use `{{ .ConfirmationURL }}` with this PKCE flow.

The configured project when implemented was `kobtyqgefyupbqagdqpu`, which the existing app already used, rather than the separate project named Salman Traders. Verify `.env.local` when switching environments. Password reset and email confirmation need the correct allowed callback URLs and a working Supabase email provider. No real registration emails are sent by the automated tests.

### Auth verification

```powershell
npm test
npm run lint
npm run build
node tests/auth-integration.mjs
```

The integration test launches an isolated Auth fixture and production Next.js server on loopback. It checks anonymous redirects, 401 API responses, forged sessions, sign-in cookies, return URLs, session refresh, sign-out, sign-up confirmation, password recovery, rejected cross-origin posts, and private-response cache headers. The fixture never creates live Supabase accounts or emails users. Complete a real confirmation/reset round trip with your own account after configuring the dashboard callback URLs.
