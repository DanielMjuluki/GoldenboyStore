# Goldenboy Store Implementation Plan

This document outlines the backend work needed to turn the current storefront into a fully functional business platform for products, services, and payments using PayFast.

## 1. Core backend goals

The app should support:
- product browsing and purchasing
- service booking / service inquiry submissions
- admin product and order management
- payment processing through PayFast
- order confirmation and notifications
- real social media stats

## 2. Payment integration with PayFast

### What needs to be implemented
- Add PayFast merchant credentials to environment variables
- Create a payment initiation endpoint
- Create a PayFast return and cancel URL flow
- Create a webhook/notify endpoint for payment updates
- Store payment status in the orders data layer
- Update order status after successful payment

### Required environment variables
- `PAYFAST_MERCHANT_ID`
- `PAYFAST_MERCHANT_KEY`
- `PAYFAST_PASS_PHRASE`
- `PAYFAST_MODE` = `sandbox` or `live`
- `PAYFAST_RETURN_URL`
- `PAYFAST_CANCEL_URL`
- `PAYFAST_NOTIFY_URL`
- `NEXT_PUBLIC_SITE_URL`

### PayFast integration steps
1. Create a PayFast merchant account
2. Configure sandbox/live credentials
3. Add endpoints for:
   - payment initiation
   - return URL
   - cancel URL
   - notify URL
4. Generate signature using PayFast’s required fields
5. Redirect customers to PayFast checkout
6. Verify incoming notify requests
7. Mark orders as paid / failed / pending based on webhook response

## 3. Data storage

### Recommended data source
Use Google Sheets initially for:
- products
- categories
- orders
- service inquiries

### Required sheets
- `products`
- `categories`
- `orders`
- `inquiries` (recommended)

### Product fields
- `id`
- `name`
- `description`
- `price_cents`
- `currency`
- `category_ids`
- `images`
- `stock_quantity`
- `status`

### Order fields
- `id`
- `created_at`
- `customer_name`
- `customer_email`
- `shipping_address_json`
- `items_json`
- `status`
- `notes`
- `stripe_session_id` (rename or replace with `payment_reference` for PayFast)

## 4. Service inquiry backend

The current services tab uses an email link. For a proper backend experience:
- create an API route for inquiries
- store inquiry submissions in Google Sheets or a database
- send an email notification to the business inbox
- optionally save the submission in a CRM or admin dashboard

### Inquiry fields
- name
- email
- service type
- budget / timeline
- project details

## 5. Admin backend

The admin pages should eventually support:
- login/authentication
- product CRUD operations
- category management
- viewing orders
- updating order status
- viewing service inquiries

### Recommended admin auth approach
- simple password-based auth initially
- later upgrade to secure auth with NextAuth or Clerk

## 6. Social media backend

To make the homepage stats dynamic:
- connect Instagram API
- connect TikTok API
- connect YouTube API
- connect X/Twitter API

### What should be stored
- follower counts
- monthly views estimate
- last sync timestamp

## 7. Email notifications

To support order and inquiry communication:
- configure SMTP
- send confirmation emails for successful orders
- send inquiry notification emails
- optionally send admin alerts for new orders

### Required env vars
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `EMAIL_FROM`

## 8. File structure to be used

Relevant files for implementation:
- `app/api/payfast/` for PayFast routes
- `app/api/inquiries/route.ts` for inquiry submissions
- `lib/data/googleSheetsAdapter.ts` for storage logic
- `lib/utils/payfast.ts` for PayFast signature and request helpers
- `lib/utils/email.ts` for email sending
- `app/admin/` for admin UI

## 9. Recommended implementation order

1. Add PayFast payment flow
2. Add order status persistence for paid / pending / failed
3. Add service inquiry API and storage
4. Add admin order management
5. Add real social stats integrations
6. Add email automation

## 10. Suggested milestone plan

### Milestone 1: working storefront
- products load from Google Sheets
- services tab works
- inquiry form submits

### Milestone 2: payments
- PayFast checkout works
- payment status updates orders

### Milestone 3: business operations
- admin dashboard for orders/inquiries
- automated notifications
- live social stats

## 11. Notes

The current app already has the right UI structure for this direction. The main missing work is backend automation and payment integration.
