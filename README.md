ClickPick — Guitar Accessories E-commerce (Pick Customization)

Overview
- Frontend: HTML/CSS/vanilla JS in `client/`
- Backend: Node.js + Express + PostgreSQL (`pg`) in `server/`
- Auth: JWT bearer tokens
- Swagger docs: `/docs` (JSON at `/api-docs.json`)
- Delivery fee: 14 THB; Discount: 0 THB; Currency: THB.

Quick Start
1) Configure env
- Copy `.env.example` to `.env` and set `DATABASE_URL`, `JWT_SECRET`.

2) Install deps (root has an unrelated legacy app; use the server folder):
- `cd server`
- `npm install` (requires network)

3) Initialize DB
- `npm run migrate`
- `npm run seed`

4) Run server
- `npm start`
- Server: `http://localhost:3000` (API base `/api`), docs at `/docs`.

5) Open client pages
- Serve `client/` via a static server (or open the files directly). For CORS, set `FRONTEND_ORIGIN` in env if serving from a different origin.

Data Model (PostgreSQL)
- See `server/src/db/migrations/001_init.sql` for exact SQL. Tables:
  - `users`, `products`, `orders`, `order_items`, `customization`
- Constraints:
  - Enum-like checks for roles, order status, product category, customization shape and color.
  - Trigger `trg_customization_rule` ensures a customization is only attached to `custompick` products.

Seed Data
- Admin: `admin@clickpick.dev` / `Admin123!`
- Customer: `demo@clickpick.dev` / `Demo123!`
- Products: 3 preset, 2 gadgets, 2 custompick bases.

Supabase Storage Mapping
- Product images are stored by path string in `products.image` like `public/products/<file>.jpg`.
- These paths are relative to your Supabase Storage public bucket. If your project’s public bucket is `public`, the full URL is:
  - `${SUPABASE_PROJECT_URL}/storage/v1/object/public/${SUPABASE_PUBLIC_BUCKET}/${image}`
- For this minimal app/UI, we display the raw `image` path. In production, you would transform it to a full Supabase URL or use a proxy.

API Summary
- Auth: `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`
- Products: `GET /api/products`, `GET /api/products/:id`, admin: `POST/PUT/DELETE /api/products`
- Cart/Draft order: `GET /api/cart`, `POST /api/cart/items`, `PUT/DELETE /api/cart/items/:itemId`, `POST /api/cart/recalculate`
- Checkout: `POST /api/checkout` (stores BillingDetail, sets `pending`)
- Payment: `POST /api/payment` (mock, always success but checks stock; sets `paid` and decrements stock)
- Orders: `GET /api/orders`, `GET /api/orders/:id`, admin: `POST /api/orders/:id/ship`, `POST /api/orders/:id/deliver`

Billing Detail JSON
Must match exactly and store optional fields as "-":
{
  "email": "string",
  "firstname": "string",
  "lastname": "string",
  "company": "string",           // optional; saved as "-" if blank
  "address": "string",
  "city": "string",
  "country": "string",           // defaults to "Thailand"
  "postal_code": "string",
  "phone": "string",
  "order_notes": "string"        // optional; saved as "-"
}

Testing (light)
- With dependencies installed, you can write Node-based integration tests using fetch or supertest. Suggested cases:
  - Auth register/login
  - Add non-custom item (no customization allowed → 400 if provided)
  - Add custompick item (customization required → 400 if missing)
  - Checkout → Payment → Stock decremented
  - Admin update product; role guard works

Notes
- Server always recomputes totals server-side; client totals are not trusted.
- JWT payload includes `{ sub, role, email }` and expires in 7 days.
- Rate limiting and Prisma: the implementation uses `pg` and SQL migrations to avoid extra tooling. If you prefer Prisma ORM, we can add Prisma schema and client with migration scripts on request.

