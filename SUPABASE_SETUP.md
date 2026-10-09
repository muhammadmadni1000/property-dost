# Supabase Database Setup & Verification Guide

This guide details how to configure the real PostgreSQL database for **PROPERTY DOST**.

---

## 1. Create Supabase Project

1. Log into your account at [supabase.com](https://supabase.com).
2. Click **New project**.
3. Set a project name (e.g. `property-dost-jhelum`).
4. Choose a secure database password.
5. Select a region close to your primary audience (e.g. `ap-south-1` South Asia / Singapore / Frankfurt).
6. Wait for project provisioning to complete.

---

## 2. Apply Database Migrations

Open the **SQL Editor** tab in your Supabase Dashboard and run the contents of:

📁 `supabase/migrations/20261008000001_initial_schema.sql`

This script creates:
- **`properties`** table with check constraints and auto-generated UUIDs.
- **`customers`** table for buyer/inquirer contact profiles.
- **`visits`** table with foreign keys and the **critical duplicate booking constraint**:
  ```sql
  CONSTRAINT unique_property_visit_slot UNIQUE (property_id, visit_date, visit_time)
  ```
- **`inquiries`** table for customer inquiries.
- **`update_updated_at_column()`** trigger functions.
- **Row Level Security (RLS)** enabled across all 4 tables with granular policies for public visitors and authenticated admins.

---

## 3. Populate Seed Listings (Jhelum Properties)

In the Supabase SQL Editor, run the seed file:

📁 `supabase/seed.sql`

> **CRITICAL NOTE:**  
> The seed records **intentionally omit** the `id` column. PostgreSQL automatically executes `gen_random_uuid()` to assign genuine UUIDs.

Sample properties included:
- *5 Marla Modern Luxury House in Citi Housing Jhelum*
- *10 Marla Prime Residential Plot in Jhelum Cantt*
- *2 Bedroom Executive Flat for Rent in Civil Lines Jhelum*
- *Commercial Shop on Main G.T. Road Jhelum*
- *1 Kanal Royal Designer House in Citi Housing Jhelum*
- *Modern Family House near Jhelum Cantt*
- *Corporate Commercial Office in Jhelum Business Center*
- *16 Kanal Fertile Agricultural Land near Jhelum River*

---

## 4. Create an Administrator Account

1. Navigate to **Authentication → Users** in the Supabase Dashboard.
2. Click **Add User → Create User**.
3. Enter an admin email (e.g. `admin@propertydost.pk`) and a secure password.
4. Confirm user creation.
5. You can now use these credentials on the public portal at `/login`.

---

## 5. Configure Frontend Environment Variables

In your project root, create a file named `.env`:

```env
VITE_SUPABASE_URL=https://<your-project-ref>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<your-anon-public-key>
```

> **SECURITY CHECK:**  
> Never paste the `service_role` key into `.env` or frontend files. Only the public anon key (`VITE_SUPABASE_PUBLISHABLE_KEY`) is permitted.

---

## 6. Verify Database Health & Integrity

Open the Supabase SQL Editor and execute:

📁 `supabase/verify.sql`

Verify that:
1. `SELECT COUNT(*) FROM properties;` returns at least 8 rows.
2. `unique_property_visit_slot` constraint exists on `visits`.
3. Row Level Security is `true` on all tables.
4. Orphaned visits query returns `0` records:
   ```sql
   SELECT v.id FROM visits v
   LEFT JOIN properties p ON v.property_id = p.id
   WHERE p.id IS NULL;
   ```
