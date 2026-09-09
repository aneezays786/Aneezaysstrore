# Aneezay's — Real Store Starter

## What is included
- `customer/` — public shopping website with product details, sizes, cart quantities, checkout and order confirmation.
- `admin/` — separate owner dashboard protected by Supabase email/password login.
- `supabase/schema.sql` — products + orders + order items + secure server-side order total calculation.
- `shared/supabase.js` — public Supabase URL + anon/publishable key only.
- `assets/product-150k.jpg` — featured product image.

## Important: what is real already
- Cart works in the browser.
- Customer checkout can create a real order in Supabase.
- Product prices are recalculated in the database function, so the browser cannot simply change the final total.
- Owner can sign in and see orders, customer details, items, total and update order status.
- Cash on Delivery and Bank Transfer are order methods.

## Setup (one time)
1. Create a Supabase project.
2. Supabase Dashboard → SQL Editor → paste and run `supabase/schema.sql`.
3. Supabase Dashboard → Authentication → Users → create your owner email/password.
4. Put your Project URL and anon/publishable key into `shared/supabase.js`.
5. Upload the whole folder to a web host (GitHub Pages, Netlify or Vercel). Do not open ES-module files with `file://`.
6. Customer URL is `/customer/`; owner URL is `/admin/`.

## Before accepting real public orders
- Keep the Supabase service_role key out of all browser files.
- Add your real business contact, shipping/return policy and privacy policy.
- Replace demo product data/images with your real catalog.
- For card/wallet payments, connect a Pakistan-supported payment gateway through a secure server/Edge Function. Do not collect card numbers in HTML/JavaScript.
- Consider adding CAPTCHA/rate limiting to the public order function before launch.

## Payment note
This package does NOT pretend that card payments are live. COD and bank-transfer order capture are implemented. A real online gateway needs your merchant account credentials and provider-specific backend/webhook setup.
