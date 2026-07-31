# The Golden Store — Architecture

## Overview

The Golden Store is a production-ready e-commerce platform built with Next.js, TypeScript, and a secure backend architecture. It prioritizes security, usability, performance, and maintainability.

## Design Principles

1. **Security First** — All user input is validated server-side. No credentials are exposed. API keys and secrets are environment-only.
2. **Data Abstraction** — The backend has a clear separation between API, business logic, and data layer. Database implementations can be swapped without breaking the frontend.
3. **Guest-First** — No customer accounts or authentication. Orders are created as guests with privacy-conscious visitor tracking.
4. **No Hardcoding** — Products, prices, categories, and inventory come exclusively from the data store (Google Sheets initially, pluggable later).

## Architecture Layers

### Frontend Layer (`/app`)
- **Pages**: `page.tsx` (home), `products/page.tsx`, `checkout/page.tsx`
- **Components**: Reusable React components with server-side data fetching
- **Styling**: `globals.css` with CSS variables for theming (matte black, metallic gold)
- **No direct backend calls** — All communication goes through the API layer

### API Layer (`/app/api`)
- **`/api/products`** — GET: Returns all active products and categories
- **`/api/orders`** — POST: Creates a new order with server-side validation and rate limiting
- **Rate Limiting**: 10 requests/hour per IP on `/api/orders` to prevent abuse
- **Error Handling**: All failures return predictable error messages and HTTP status codes

### Business Logic & Validation (`/lib/validation`)
- **Zod Schemas**: `orderPayloadSchema` validates all order data structure and constraints
- **Server-side only** — No validation logic in browser
- **Type Safety**: TypeScript types derived from Zod schemas

### Data Layer (`/lib/data`)
- **Repository Pattern**: `DataStore` interface defines all data operations
- **Adapters**:
  - `memoryStore` — In-memory implementation for development
  - `googleSheetsAdapter` — Google Sheets implementation (stub, ready for integration)
- **Types**: `ProductItem`, `CategoryItem`, `OrderPayload`, `OrderRecord`
- **Single Source of Truth**: Google Sheets is the authoritative inventory source

### Utilities (`/lib/utils`)
- **`rateLimit.ts`** — In-memory rate limiting with configurable windows
- **`logging.ts`** — Structured logging with error tracking (integration points for Sentry, Datadog, etc.)

### Security (`/middleware.ts`)
- **Security Headers**: X-Content-Type-Options, X-Frame-Options, X-XSS-Protection, HSTS
- **Applied globally** to all pages except API routes and static files

## Data Flow

### Product Discovery
```
Browser → GET /api/products → API Layer → Data Store → Memory/Google Sheets → JSON
```

### Order Creation
```
Browser Form → POST /api/orders → Validation (Zod) → Data Store → Memory/Google Sheets
Database confirms → API returns orderId → Browser shows confirmation
```

## Security Model

### Trust Boundaries
- **Browser is untrusted** — All input validated server-side
- **API is trusted** — Only the backend writes orders
- **Data Store is trusted** — Google Sheets is the inventory source of truth

### CSRF & XSS Protection
- Next.js built-in CSRF protection for forms
- No inline scripts or dynamic HTML injection
- All user input sanitized before storage

### Rate Limiting
- API endpoints are rate-limited per IP
- Prevents abuse and DoS attacks
- Headers inform clients of remaining quota

## Environment Configuration

### Required Variables
- `SHEET_ID` — Google Sheets ID (optional, uses memory store if absent)
- `GOOGLE_SERVICE_ACCOUNT_KEY_PATH` — Path to service account JSON (optional)

### Example `.env.local`
```
# Leave commented to use memory store
# SHEET_ID=your-sheet-id
# GOOGLE_SERVICE_ACCOUNT_KEY_PATH=/path/to/key.json
```

## Error Handling

All errors are:
1. **Logged** — For debugging and audit trails
2. **Handled** — Graceful fallbacks, no crashes
3. **User-friendly** — Clear messages without exposing internals
4. **Categorized** — Validation errors (422), not found (404), server errors (500)

## Database Schema (Google Sheets)

### `products` sheet
- `id`, `name`, `description`, `price_cents`, `currency`, `category_ids`, `stock_quantity`, `status`, `images`
- `images` is pipe-separated (`|`) image URLs, e.g. `https://example.com/a.jpg|https://example.com/b.jpg`
  (pipe rather than comma, since URLs can contain commas in query strings)

### `categories` sheet
- `id`, `name`, `description`

### `orders` sheet
- `id`, `created_at`, `customer_name`, `customer_email`, `shipping_address_json`, `items_json`, `status`, `notes`, (reserved column, formerly `stripe_session_id`)
- `status` is one of: `pending_payment`, `paid`, `payment_failed`, `fulfilled`, `cancelled`

## Roadmap for Phase 2

1. ~~**Google Sheets Integration** — Implement `googleSheetsAdapter` with full CRUD~~ ✅ Done
2. ~~**Admin Dashboard** — Inventory and order management UI~~ ✅ Done (key-gated at `/admin/products`)
3. ~~**Payment Processing** — PayFast checkout~~ ✅ Done
4. **Image Hosting** — Currently URL-only (admin pastes a link to an externally-hosted image). No direct file upload/storage yet — would need an object storage service like Vercel Blob or Cloudinary.
5. ~~**Email Notifications** — Order confirmations~~ ✅ Done (sent after payment confirms, via PayFast ITN webhook)
6. **Analytics** — Track visitor and sales metrics
7. **Performance** — Image optimization, caching strategies, CDN

## Deployment

- **Platform**: Vercel (Next.js recommended) or any Node.js host
- **Secrets**: All env variables must be set in production environment
- **HTTPS**: Required (automatic on Vercel)
- **Logging**: Integrate with external service (Sentry, Datadog, CloudWatch)
