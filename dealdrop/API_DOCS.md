# DealDrop API Documentation

This document outlines the core API endpoints that power the DealDrop Hyperlocal Platform's backend, handling Authentication, Customer Journeys, Retailer Journeys, and Tier-3 features like Squads.

---

## 1. Authentication & Routing

### Redirect Handler
`GET /api/auth/callback`
- **Description**: Intercepts the standard Supabase Auth callback (`?code=...`). It seamlessly exchanges the OAuth code for a session and verifies the database. 
- **Behavior**:
  - If a matched `retailers` record exists → Redirects to `/dashboard`.
  - If a matched `user_profiles` record exists → Redirects to `/deals`.
  - If neither exists → Redirects to `/onboarding` (or `/store-setup` if `?type=retailer` is present).

---

## 2. Customer Journey APIs

### Create Customer Profile
`POST /api/customer/profile`
- **Description**: Onboards a new user, saving their geographic location and deal preferences.
- **Auth Required**: Yes (Bearer Token / Cookie)
- **Body**:
  ```json
  {
    "full_name": "string",
    "preferred_radius_km": "number",
    "preferred_categories": ["string"],
    "lat": "number",
    "lng": "number"
  }
  ```
- **Returns**: `201 Created` with the newly inserted `user_profiles` row.

### Discover Local Deals
`GET /api/deals?lat={lat}&lng={lng}&radius_km={radius}&category={category}`
- **Description**: Harnesses PostGIS `ST_DWithin` to find active deals bounded by the user's immediate physical radius.
- **Auth Required**: Optional (Read mapping)
- **Returns**: `200 OK` with an array of `deals` joined with `retailers`.

### Claim a Deal
`POST /api/deals/[id]/claim`
- **Description**: Securely reserves a deal for the customer.
- **Auth Required**: Yes
- **Behavior**:
  - Generates a lock to prevent over-drafting `quantity_remaining <= 0`.
  - Enforces `UNIQUE(deal_id, user_id)` to gracefully reject double-claiming (`409 Conflict`).
  - Automatically runs the `increment_passport_stamps` RPC.
- **Returns**: `200 OK` + `{ success: true }`.

---

## 3. Retailer Journey APIs

### Store Setup
`POST /api/retailer/setup`
- **Description**: Registers a business profile for an authenticated merchant.
- **Auth Required**: Yes
- **Body**:
  ```json
  {
    "shop_name": "string",
    "description": "string",
    "address": "string",
    "category": "string",
    "lat": "number",
    "lng": "number"
  }
  ```
- **Returns**: `201 Created` with the generated `retailers` profile.

### Create a Deal
`POST /api/deals`
- **Description**: Provisions a new active deal linked to the physical location of the retailer.
- **Auth Required**: Yes
- **Body**:
  ```json
  {
    "product_name": "string",
    "description": "string",
    "category": "string",
    "original_price": "number",
    "current_price": "number",
    "discount_percent": "number",
    "quantity_total": "number",
    "expiry_hours": "number",
    "lat": "number",
    "lng": "number"
  }
  ```
- **Returns**: `201 Created` returning the generated `deal` row.

### Retailer Sales Analytics
`GET /api/retailer/sales`
- **Description**: Aggregates all deals strictly mapped to the querying retailer, flattening their active/pending `claims` data to compute total footprint and revenue potential.
- **Auth Required**: Yes
- **Returns**: `200 OK` + `{ stats: [...] }`.

### QR Code Redemption
`PATCH /api/claims/[id]`
- **Description**: Used by merchants physically in-store scanning a customer's reservation to validate their claim.
- **Auth Required**: Yes (Must be the owning Retailer due to Row Level Security)
- **Body**:
  ```json
  { "status": "redeemed" }
  ```
- **Returns**: `200 OK` verifying that the claim transitioned from `pending`.

---

## 4. Squad Mechanics (Tier 3)

### Create a Flash Mob Squad
`POST /api/squad`
- **Description**: Initializes a dynamic squad pool for a specific deal.
- **Auth Required**: Yes
- **Body**:
  ```json
  {
    "deal_id": "uuid",
    "target_count": "number",
    "expires_in_hours": "number"
  }
  ```
- **Returns**: `201 Created` including the `squad` ID and adding the creator as the first member.

### Join an Active Squad
`POST /api/squad/[id]/join`
- **Description**: Locks a user into the forming squad pool.
- **Auth Required**: Yes
- **Behavior**:
  - Drops a `409` if the user is already natively participating `UNIQUE(squad_id, user_id)`.
  - Auto-evaluates if `current_count >= target_count`. If true, automatically sets squad status to `complete`.
- **Returns**: `200 OK` + `{ success: true, current_count: number }`.
