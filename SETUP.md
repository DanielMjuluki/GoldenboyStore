# Setup & Development Guide

## Prerequisites

- Node.js 18+ and npm/yarn
- Git

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration

Copy the example environment file:
```bash
cp .env.example .env.local
```

For development, the in-memory data store is used by default (no configuration needed).

### 3. Start Development Server
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Testing the Platform

### Home Page
- Visit `http://localhost:3000`
- See hero section, features, and navigation

### Browse Products
- Click "Browse collections"
- Displays sample products from memory store:
  - Premium Wireless Headphones ($299.99)
  - Luxury Watch ($149.99)
  - Premium Cotton T-Shirt ($39.99)

### Guest Checkout
- Click "Guest checkout" on home or products page
- Fill in contact and shipping information
- Submit form to create an order
- See confirmation with Order ID

### API Endpoints

#### Get Products
```bash
curl http://localhost:3000/api/products
```

Response:
```json
{
  "products": [...],
  "categories": [...]
}
```

#### Create Order
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "shippingAddress": {
      "line1": "123 Main St",
      "city": "New York",
      "region": "NY",
      "postalCode": "10001",
      "country": "United States"
    },
    "items": [{"productId": "sample_1", "quantity": 1}]
  }'
```

Response:
```json
{
  "orderId": "order_550e8400-e29b-41d4-a716-446655440000"
}
```

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── products/route.ts      # GET products
│   │   └── orders/route.ts        # POST orders
│   ├── checkout/page.tsx          # Checkout form page
│   ├── products/page.tsx          # Products listing
│   ├── layout.tsx                 # Root layout
│   ├── page.tsx                   # Home page
│   └── globals.css                # Global styles
├── lib/
│   ├── components/
│   │   └── CheckoutForm.tsx       # Reusable checkout form
│   ├── data/
│   │   ├── types.ts               # Data types
│   │   ├── repository.ts          # DataStore interface
│   │   ├── memoryStore.ts         # In-memory implementation
│   │   ├── googleSheetsAdapter.ts # Google Sheets impl
│   │   └── index.ts               # Export data store
│   ├── validation/
│   │   └── order.ts               # Zod schemas
│   └── utils/
│       ├── rateLimit.ts           # Rate limiting
│       └── logging.ts             # Error logging
├── middleware.ts                  # Security headers
├── next.config.mjs                # Next.js config
├── tsconfig.json                  # TypeScript config
├── package.json                   # Dependencies
├── ARCHITECTURE.md                # Architecture guide
└── .env.example                   # Environment template
```

## Development Workflow

### Make Code Changes
Edit files in `app/`, `lib/`, or root config files.

### TypeScript Compilation
```bash
npm run build
```

### Run Linter
```bash
npm run lint
```

### Production Build
```bash
npm run build
npm run start
```

## Security Checklist

- ✅ All input validated server-side (Zod)
- ✅ No credentials in code (env vars only)
- ✅ Security headers applied globally
- ✅ Rate limiting on API endpoints
- ✅ Error messages don't expose internals
- ✅ No direct Google Sheets access from browser
- ✅ Server-side order creation only

## Adding Features

### New API Route
1. Create `app/api/[name]/route.ts`
2. Import `{ NextResponse } from 'next/server'`
3. Export `GET`, `POST`, etc. functions
4. Add rate limiting if needed
5. Validate input with Zod
6. Log errors

### New Page
1. Create `app/[name]/page.tsx`
2. Fetch data server-side if needed
3. Use client-side components for interactivity
4. Import styles from `globals.css`

### Add Database Fields
1. Update `lib/data/types.ts` interfaces
2. Update Zod schemas in `lib/validation/`
3. Update `memoryStore.ts` sample data
4. Update `googleSheetsAdapter.ts` when integrating

## Troubleshooting

### Products not showing?
- Check that `memoryStore.ts` has sample products initialized
- Visit `/api/products` to debug the API response

### Order fails to submit?
- Check browser console for validation errors
- Verify all required fields are filled
- Check rate limit (max 10 requests/hour per IP)

### Google Sheets integration issues?
- Verify `SHEET_ID` and `GOOGLE_SERVICE_ACCOUNT_KEY_PATH` in `.env.local`
- Check service account has Editor permissions on the sheet
- See `ARCHITECTURE.md` for schema requirements

## Next Steps

1. Integrate Google Sheets adapter
2. Add order confirmation emails
3. Build admin dashboard
4. Implement payment processing
5. Add image hosting
6. Set up analytics
7. Deploy to production

See `ARCHITECTURE.md` for more details on each phase.
