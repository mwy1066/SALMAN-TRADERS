# Product catalogue intake

## Current supplied inventory

The owner supplied 40 products on 12 October 2026: 26 hybrid inverters and 14 lithium batteries. Thirty-nine new entries are maintained in `lib/owner-catalogue.ts`; Hystorix 5kWh uses the existing PowerHub 5.12kWh database listing by explicit owner confirmation. The rest of this template is for exact model numbers, photos, prices and further specifications when available. The supplied list itself does not establish stock quantities or warranty terms.

Use one copy of this entry per product. Leave uncertain fields blank; an empty price is displayed as “Price on enquiry”. Supply exact-model source material before adding technical, safety, certification or compatibility claims.

## Product entry

- **Brand:**
- **Exact model / product name:**
- **Category:** Hybrid Inverters / Lithium Batteries / Solar Panels / UPS Systems
- **Price in PKR, or price on enquiry:**
- **Price confirmed on:**
- **Availability / stock, confirmed on:**
- **Product image file or approved URL:**
- **Manufacturer datasheet URL or source file:**
- **Source page / label supporting the exact model:**
- **Specifications to display, with units:**
- **Warranty terms and provider, if confirmed:**
- **Compatibility / certification claims, with matching source pages:**
- **Description approved for publication:**

Do not include private serial numbers, customer invoices, passwords or access keys. A similarly named product's datasheet is not evidence for this model.

## Launch selection

- Which confirmed products should be included at launch?
- Should categories without listings remain visible for enquiries?
- Who will maintain product prices and availability after launch?

The read-only audit can be refreshed with:

```powershell
node --env-file=.env.local scripts/catalogue-audit.mjs
```

Its report is saved to `output/launch-preparation/catalogue-audit.md`. It checks missing fields and category coverage; it does not independently verify manufacturer claims or change the database.
