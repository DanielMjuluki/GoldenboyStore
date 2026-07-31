# Goldenboy Store - Integration & Setup Guide

## Overview

Your store now has three major upgrades:

1. **Admin Dashboard** (`/admin/products`) - Upload & manage products, services, and software
2. **Projects Portfolio** (`/projects`) - Full history from 2022 onwards with portfolio items
3. **Social Media Integration** - Framework ready for real-time data sync

---

## 1. Admin Dashboard (`/admin/products`)

### Access Control
The admin dashboard and its API routes require an admin key. Set `ADMIN_API_KEY` in
`.env.local` (generate one with `openssl rand -hex 32`). Without this variable set,
admin routes are disabled entirely (fail closed) — they will not fall back to being open.

Visiting `/admin/products` first shows a key-entry screen. The key is kept in
`sessionStorage` for that browser tab only (not a cookie, no customer account created)
and sent as `Authorization: Bearer <key>` on every admin request.

This is intentionally minimal — a single shared secret for the store owner, not a
user/account system. For a production deployment with multiple admins or higher
stakes, swap this for a real auth provider.

### Features
- ✅ Add new products/services/software
- ✅ Set pricing, delivery times, and stock/booking limits
- ✅ Edit existing products (price, stock, status, etc.)
- ✅ Mark items as active / draft / inactive (draft and inactive are hidden from the storefront)
- ✅ Manage existing products (edit/delete) — now writes through to the real data store (memory store or Google Sheets), not just a UI demo

### How to Use
1. Navigate to `/admin/products` and enter your admin key
2. Click "Add New Product"
3. Fill out the form:
   - **Product Name**: Title of your service/product
   - **Price**: Cost in USD
   - **Description**: Detailed info about what you're offering
   - **Stock/Availability**: Leave blank for unlimited bookings, or set a number
   - **Category**: Apparel, digital, or merchandise
   - **Status**: Active products are visible in the store; draft/inactive are hidden
4. Click "Add Product" to save
5. Use the pencil icon on an existing row to edit it, or the trash icon to delete it

---

## 2. Projects Portfolio Page (`/projects`)

### Current Projects (2022-2024)
Your journey is now showcased with:
- **2022**: The Great Pivot (UCT dropout), Online Barber co-founding
- **2023**: Goldenboy Media launch, Kingdome Brand creation, Web dev services
- **2024**: Goldenboy Store unification

### Customizing Projects
Edit `/app/projects/page.tsx` to add more projects, change dates, or update descriptions.

---

## 3. Social Media Integration (Real Data Sync)

### Current Status
- Framework is in place at `/api/social-media`
- Currently returns placeholder data
- Ready for real API connections

### Setup Instructions

To enable **real-time social media stats**, follow these steps:

#### Step 1: Get API Keys

**Instagram/Meta Graph API:**
```
1. Go to https://developers.facebook.com/
2. Create an app → Select "Consumer" type
3. Add Instagram Basic Display product
4. Create a User Access Token
5. Get your Instagram Business Account ID
```

**TikTok API:**
```
1. Visit https://developers.tiktok.com/
2. Create a developer account
3. Create an app in TikTok for Creators
4. Get Client Key and Client Secret
5. Request access to Analytics API
```

**YouTube API:**
```
1. Go to https://console.cloud.google.com/
2. Enable YouTube Data API v3
3. Create OAuth 2.0 credentials
4. Download JSON credentials file
```

**Twitter/X API:**
```
1. Visit https://developer.twitter.com/
2. Create an app with "Read" permissions
3. Generate Bearer Token
4. Get access to Twitter API v2
```

#### Step 2: Add Environment Variables

Create or update `.env.local` in your project root:

```env
# Social Media API Keys
INSTAGRAM_ACCESS_TOKEN=your_token_here
INSTAGRAM_BUSINESS_ACCOUNT_ID=your_account_id

TIKTOK_CLIENT_KEY=your_key_here
TIKTOK_CLIENT_SECRET=your_secret_here

YOUTUBE_API_KEY=your_key_here

TWITTER_BEARER_TOKEN=your_token_here
```

#### Step 3: Implement API Functions

In `/app/api/social-media/route.ts`, replace the placeholder functions:

**Example: Instagram Implementation**
```typescript
async function fetchInstagramStats(): Promise<SocialStats> {
  const response = await fetch(
    `https://graph.instagram.com/me?fields=followers_count,username,ig_id&access_token=${process.env.INSTAGRAM_ACCESS_TOKEN}`
  );
  const data = await response.json();

  return {
    platform: 'instagram',
    followers: data.followers_count,
    handle: data.username,
    verified: true,
    lastUpdated: new Date().toISOString(),
  };
}
```

**Example: YouTube Implementation**
```typescript
async function fetchYouTubeStats(): Promise<SocialStats> {
  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/channels?part=statistics&forUsername=yourUsername&key=${process.env.YOUTUBE_API_KEY}`
  );
  const data = await response.json();
  const channel = data.items[0];

  return {
    platform: 'youtube',
    followers: parseInt(channel.statistics.subscriberCount),
    handle: '@YourHandle',
    verified: true,
    lastUpdated: new Date().toISOString(),
  };
}
```

#### Step 4: Manual Sync

Once configured, social stats will automatically sync when:
- Homepage loads
- User visits `/`
- You call `POST /api/social-media/sync`

To manually trigger: `curl -X POST http://localhost:3000/api/social-media/sync`

### Data Displayed on Homepage

The homepage now shows:
- Real follower counts across all platforms
- Monthly view count
- Brand deals count
- Live social media links to your profiles
- Sync status indicator

---

## 4. Product Types Supported

### Service
- One-time or recurring
- Examples: Content Creation Sprint, Brand Strategy Session
- Delivery time: Days/weeks
- Stock: Optional booking limits

### Physical Product
- Merch, apparel, accessories
- Inventory tracking
- Shipping/fulfillment info

### Software
- Digital tools, apps, plugins
- Delivery: Instant download or login
- No inventory needed
- Examples: Video editing preset packs, brand templates

### Digital Product
- E-books, guides, courses, templates
- Instant delivery
- Recurring: Option for subscriptions

---

## 5. Connecting to Database (Optional)

Currently, products are stored in memory. To persist data:

### Option A: Google Sheets (Current)
Already set up in `/lib/data/googleSheetsAdapter.ts`
- Update your Google Sheet ID in the adapter
- Products automatically sync

### Option B: Supabase
```typescript
// Install: npm install @supabase/supabase-js

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

// Then use in your data store
```

### Option C: Firebase
```typescript
// Install: npm install firebase

import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

// Use Firestore for product storage
```

---

## 6. File Structure

```
app/
├── page.tsx                    # Homepage (syncs real stats)
├── projects/page.tsx          # Your portfolio/history
├── products/page.tsx          # Services catalog
├── admin/
│   └── products/page.tsx       # Admin dashboard
├── api/
│   ├── admin/products/         # Product CRUD endpoints
│   └── social-media/route.ts   # Social stats sync
└── globals.css                 # All styling

lib/
├── data/
│   ├── types.ts               # Extended types for projects, stats
│   ├── googleSheetsAdapter.ts # Sheet integration
│   └── repository.ts          # Data access layer
```

---

## 7. Next Steps

1. **Get API Keys** for your social media platforms
2. **Set Environment Variables** in `.env.local`
3. **Implement API Functions** in `/api/social-media/route.ts`
4. **Test** by reloading the homepage - stats should update
5. **Add Products** via `/admin/products`
6. **Customize Projects** page with your real history

---

## 8. Support & Troubleshooting

### Stats Not Syncing?
- Check environment variables are set correctly
- Verify API keys haven't expired
- Check browser console for errors
- See `/api/social-media/route.ts` for API response format

### Products Not Saving?
- Ensure admin endpoint is accessible
- Check network tab for API errors
- Verify data format matches `ProductItemExtended` type

### Projects Page Missing Styling?
- Run `npm run build` to regenerate CSS
- Clear browser cache
- Restart dev server: `npm run dev`

---

## Questions?

All integration points are documented in the code.
Look for `TODO:` comments for where to implement real API calls.
