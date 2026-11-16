# Multi-category farm marketplace: product and order architecture

## Product direction

The application becomes one farm marketplace with three customer-facing departments:

- **Dairy** — the existing catalogue, subscriptions and delivery experience.
- **Poultry** — poultry products and category-specific product information.
- **Vegetables** — farm-grown vegetables and category-specific product information.

Customers keep one account, one saved-address book, one cart, one checkout and one payment. The active department is a browsing context, not a separate store account.

## Customer journey

1. The public landing page introduces all three farm departments and links into each department.
2. After login, a persistent department switcher exposes Dairy, Poultry and Vegetables. The current department is visually clear and can be changed without logging out.
3. The catalogue, search, category-specific content and product detail view follow the active department.
4. Add-to-cart always writes to the same customer cart. Cart rows retain the product's department; switching departments must never clear or hide cart contents from the cart/checkout.
5. Checkout shows one combined bill, grouped into Dairy, Poultry and Vegetables sections, with a single grand total and a single payment.
6. On successful payment, the system creates one fulfilment order per department that has items, all linked to the same parent bill/checkout. A customer may therefore see separate Dairy, Poultry and Vegetables fulfilment statuses while paying once.
7. Order history presents the parent bill first and its department orders underneath it.

## Domain model

### Product
Add a required logical category:
- `DAIRY`
- `POULTRY`
- `VEGETABLES`

Existing products are treated as `DAIRY` for backward compatibility. New products must explicitly use a category in the admin experience. Category is server-owned product data; do not infer it from product names or image URLs.

The first implementation commit adds the enum, product field, and category-filtered public catalogue endpoint. The field is initially nullable at the database column level so existing rows can be migrated safely; the entity getter treats a missing legacy value as Dairy. Before making the column non-null, ship a database migration that backfills existing products to `DAIRY`.

### Central cart
Keep one cart per customer. Each cart item references a product, so its category is derived from the product's category. Do not create separate carts or duplicate cart APIs for each department. Cart responses should expose the category explicitly for grouping in the client.

### One bill, multiple fulfilment orders
The current `Order` entity represents a fulfilment order and contains delivery status, delivery partner and order items. Preserve that role.

Introduce a parent purchase/bill aggregate (proposed name: `Purchase` or `Checkout`) that owns:
- customer, address, payment reference, payment status, grand total and timestamps;
- one-to-many child fulfilment orders.

Each child `Order` belongs to the parent purchase and contains items from exactly one category. The parent bill is the payment/receipt boundary; child orders are the operational fulfilment boundary. This preserves separate picking, packing, delivery assignment and status for each department without charging the customer three times.

Payment must be verified and recorded once against the parent purchase. Only after successful verification should the backend atomically create the category orders, reserve each product's stock, and clear the central cart. A failed transaction must not leave a partial set of category orders or clear the cart.

### Inventory and fulfilment
Inventory remains product-specific initially, which lets existing dairy inventory continue to work. Poultry and vegetables can use the same stock reservation interface, but category-specific units, expiry/perishability, storage and fulfilment rules need explicit modelling before production rollout. Delivery assignment may be separate per department order while sharing the same customer address and parent bill.

## API direction

- `GET /api/products?category=DAIRY|POULTRY|VEGETABLES` — category-aware public catalogue. Omitted category defaults to Dairy for compatibility.
- `GET /api/cart` — one combined cart; each row includes its product category.
- `POST /api/checkout` (proposed) — validates the combined cart and address, calculates the server-side grand total, and creates one payment intent for the bill.
- Payment verification finalizes one parent purchase and creates one child fulfilment order for each non-empty category.
- `GET /api/purchases` (proposed) — bill history with grouped child orders.
- Existing order endpoints should remain available during migration for older dairy-only orders.

Do not trust client-supplied prices, category totals or bill totals. Recalculate prices and totals from persisted product/size records on the server.

## Frontend direction

- Add a persistent, accessible department switcher in the authenticated customer shell. Keep the existing icon set; use text labels as the primary department identifiers.
- Persist the selected department for the next visit, but default new/legacy customers to Dairy.
- Category routes or query state should be deep-linkable so a shared Poultry/Vegetables link opens the intended department.
- The cart badge remains global across all departments.
- The cart and checkout group rows by department; category switching must not filter the bill.
- Order history shows one bill number/receipt with child department order IDs and independent fulfilment statuses.

## Delivery sequence

1. **Foundation:** category enum, product category API filter, category-aware admin product form/list, persisted customer department switcher, and landing page introduction.
2. **Department navigation:** persistent category context and authenticated department switcher are implemented. The separate landing-page department selector has been removed so customers use the centralized switcher after login.
3. **Catalog/admin:** category-aware browsing and admin product category assignment are implemented; category-specific search, product details, imagery and product metadata remain.
4. **Central cart:** category is included in cart responses and the customer cart/checkout summaries are grouped by department while retaining one combined total.
5. **Single bill checkout:** implemented a parent Purchase aggregate, one payment reference, transactional category-order creation, and a combined bill history response. Customer checkout now submits to the purchase endpoint.
6. **Operations:** each child Order stores its department and remains independently assignable/status-tracked. Admin and delivery partner order views display the department. Category-specific inventory rules and fulfilment policies remain.
7. **Migration and QA:** legacy products/orders fall back to Dairy; validate JPA schema update or apply production migrations, and add integration tests for mixed-category carts, payment mismatch/failure and idempotent checkout.

## Acceptance criteria

- A customer can switch departments without losing the cart.
- Dairy, Poultry and Vegetables catalogue results never mix.
- A mixed cart produces one bill and one payment.
- A mixed cart produces one fulfilment order per non-empty department, all linked to the same bill.
- Each department order can progress through its own operational status.
- Legacy dairy products and historical dairy orders continue to work.
- Server-side pricing, inventory reservation and order creation are transactional.


## Current implementation notes

- The authenticated customer shell owns department selection. The landing page introduces the farm generally and no longer duplicates the category picker.
- The central cart and checkout show Dairy, Poultry and Vegetables subtotals while keeping a single grand total.
- `POST /api/purchases` validates the customer's address, reads the central cart, recalculates prices server-side, reserves stock transactionally, creates one parent purchase and one child `Order` per non-empty department, then clears the cart.
- `GET /api/purchases` returns parent bills with child order IDs, departments, totals and independent statuses.
- Existing `/api/orders` remains available for older dairy orders and subscription workflows.
- Razorpay order creation now derives the amount from the authenticated customer's server-side cart. Payment persistence re-verifies the gateway signature and records the server-calculated cart total. Purchase finalization checks that the recorded payment amount matches the final cart total.
- The backend currently uses `spring.jpa.hibernate.ddl-auto=update` by default. Production deployments should apply and verify a controlled database migration for the new `purchases` table and `orders.purchase_id/category` columns before deploying with schema updates disabled.
