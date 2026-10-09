# PROPERTY DOST — Comprehensive Project Documentation

## 1. Executive Summary & Purpose

**PROPERTY DOST** (*"Find the Right Property. Make the Right Move."*) is an enterprise property dealer management and physical visit scheduling web application architected specifically for the Pakistani real-estate market, with primary localization for **Jhelum, Punjab, Pakistan**.

The platform solves systemic pain points in traditional Pakistani real-estate websites:
- **Deceptive Fake Listings & Phantom Inventory:** Completely eradicated by using Supabase PostgreSQL as the single source of truth without any local mock array fallbacks (`INITIAL_PROPERTIES`).
- **Unverified Visit Scheduling & Conflicting Timeslots:** Solved through a database-level unique constraint preventing double booking on `(property_id, visit_date, visit_time)`.
- **Language Barriers for Buyers:** Addressed by **Property Dost AI**, a natural language query processor supporting Roman Urdu, Urdu, and English.
- **Security Vulnerabilities:** Guaranteed via PostgreSQL Row Level Security (RLS) and zero exposure of `service_role` keys or hardcoded passwords.

---

## 2. System Architecture

```text
                     +---------------------------------------+
                     |         Supabase PostgreSQL           |
                     |  - properties                         |
                     |  - customers                          |
                     |  - visits (UNIQUE slot constraint)    |
                     |  - inquiries                          |
                     |  - Row Level Security (RLS)           |
                     +-------------------+-------------------+
                                         |
                                         v
                     +---------------------------------------+
                     |         Supabase Client Layer         |
                     |  (src/lib/supabase.ts)                |
                     |  - Health check verification query    |
                     |  - Environment variable detection     |
                     +-------------------+-------------------+
                                         |
                                         v
                     +---------------------------------------+
                     |             Service Layer             |
                     |  - propertyService.ts                 |
                     |  - visitService.ts                    |
                     |  - customerService.ts                 |
                     |  - inquiryService.ts                  |
                     |  - authService.ts                     |
                     +-------------------+-------------------+
                                         |
                                         v
                     +---------------------------------------+
                     |         React View & State Layer      |
                     |  - Public Routes (Home, Properties,   |
                     |    Details, Book Visit, AI, Contact)  |
                     |  - Admin Console (Dashboard, CRUD,    |
                     |    Visits, Inquiries)                 |
                     +---------------------------------------+
```

---

## 3. Database Schema & Relational Integrity

### 3.1 `properties`
- `id` (UUID, Primary Key, default: `gen_random_uuid()`): PostgreSQL-generated unique identifier.
- `title` (TEXT, Not Null): Listing heading.
- `property_type` (TEXT, Not Null, CHECK constraint: `House`, `Plot`, `Flat`, `Shop`, `Office`, `Agricultural Land`, `Commercial Property`).
- `purpose` (TEXT, Not Null, CHECK constraint: `For Sale`, `For Rent`).
- `location` (TEXT, Not Null): Locality within Jhelum (e.g. Citi Housing, Cantt).
- `city` (TEXT, Not Null): Municipality.
- `area` (NUMERIC): Numerical size.
- `area_unit` (TEXT): `Marla`, `Kanal`, or `Square Feet`.
- `price` (NUMERIC): Price in PKR.
- `bedrooms` (INTEGER): Bedroom count.
- `bathrooms` (INTEGER): Bathroom count.
- `description` (TEXT): Full architectural & legal synopsis.
- `features` (TEXT[]): Array of amenities.
- `image_url` (TEXT): Primary cover image.
- `images` (TEXT[]): Gallery photos.
- `status` (TEXT, Not Null, CHECK constraint: `Available`, `Sold`, `Rented`).
- `dealer_name`, `dealer_phone`, `dealer_whatsapp` (TEXT): Authorized agent details.
- `created_at`, `updated_at` (TIMESTAMPTZ).

### 3.2 `customers`
- `id` (UUID, Primary Key, default: `gen_random_uuid()`).
- `name` (TEXT, Not Null).
- `phone` (TEXT, Not Null).
- `email` (TEXT, Optional).
- `created_at` (TIMESTAMPTZ).

### 3.3 `visits`
- `id` (UUID, Primary Key, default: `gen_random_uuid()`).
- `property_id` (UUID, References `properties.id` ON DELETE CASCADE).
- `customer_id` (UUID, References `customers.id` ON DELETE CASCADE).
- `visit_date` (DATE, Not Null).
- `visit_time` (TIME, Not Null).
- `status` (TEXT, Not Null, CHECK constraint: `Requested`, `Confirmed`, `Visited`, `Cancelled`).
- `message` (TEXT).
- `created_at`, `updated_at` (TIMESTAMPTZ).
- **Duplicate Booking Constraint:** `CONSTRAINT unique_property_visit_slot UNIQUE (property_id, visit_date, visit_time)`.

### 3.4 `inquiries`
- `id` (UUID, Primary Key, default: `gen_random_uuid()`).
- `customer_id` (UUID, References `customers.id` ON DELETE SET NULL).
- `property_id` (UUID, References `properties.id` ON DELETE SET NULL).
- `message` (TEXT, Not Null).
- `status` (TEXT, Not Null, CHECK constraint: `New`, `Contacted`, `Resolved`).
- `created_at` (TIMESTAMPTZ).

---

## 4. Property ID Preservation Pipeline

The platform enforces strict preservation of the PostgreSQL UUID across the entire visitor journey:

```text
Supabase Database: properties.id = "e9b4...-real-uuid"
        ↓
Listing Card: <PropertyCard property={property}> links to /properties/e9b4...
        ↓
Property Details: /properties/:id extracts "e9b4...", queries Supabase .eq('id', id)
        ↓
Booking CTA: /book-visit/e9b4... passes the identical UUID
        ↓
Booking Form: Verifies property existence in Supabase
        ↓
Database Insert: visits.property_id = "e9b4..."
        ↓
Booking Success: Confirmed visit with visits.id issued as real booking reference
```

**Automated Guarantee:**  
Verified by Vitest suite `src/__tests__/propertyIdPreservation.test.tsx` which tests the entire lifecycle and asserts that 0 placeholder UUIDs (such as `a5555555...`) can be injected.

---

## 5. Duplicate Booking Protection

Double bookings are prevented on two synchronized layers:
1. **Frontend Pre-flight Check:** `visitService.ts` queries existing active visits for the requested `(property_id, visit_date, visit_time)` prior to booking.
2. **Database Constraint:** If two requests race concurrently, PostgreSQL enforces `CONSTRAINT unique_property_visit_slot UNIQUE (property_id, visit_date, visit_time)` (error code `23505`), which the service layer catches and maps to a clean, user-friendly notification:
   > *"This property visit slot is already booked. Please choose another time or date."*

---

## 6. Property Dost AI Engine

- Natural language parser capable of interpreting:
  - English: *"Show me 10 Marla plots for sale in Cantt"*
  - Roman Urdu: *"Mujhe Jhelum Citi Housing mein 5 marla ka ghar chahiye, budget 1.5 crore ke around"*
  - Urdu: *"مجھے جہلم میں 5 مرلہ مکان چاہیے"*
- Extracts intent entities: Location scheme, purpose (buy/rent), property type, budget in Lakhs/Crores, bedrooms.
- Grounded strictly in Supabase database listings.
- **Zero Hallucination Policy:** If no property matches, it clearly replies:
  > *"I couldn't find an exact match in the current Property Dost listings."*

---

## 7. 5-Member Team Responsibilities

| Team Member | Domain Responsibility | Key Deliverables |
|---|---|---|
| **Member 1** | UI/UX & Frontend | Deep Navy & Warm Gold design system, Tailwind tokens, Navbar, Footer, PropertyCard, and responsive layouts. |
| **Member 2** | Property & Visit Management | Visit scheduling pipeline, timeslot picker, duplicate booking validation, and property detail view. |
| **Member 3** | Database & Backend | PostgreSQL schema migrations, RLS policies, unique constraints, and seed data without manual IDs. |
| **Member 4** | AI Property Assistant | Property Dost AI NLP query parser (Urdu, Roman Urdu, English) grounded in Supabase data. |
| **Member 5** | Admin Dashboard & QA | Admin management console, Vitest test suites, build validation, security auditing, and deployment. |

---

## 8. Verification Results

- **Automated Tests:** 4 test files, 12 tests passed with 100% success (`npm test`).
- **Production Build:** 0 TypeScript errors, 0 Vite errors (`npm run build`).
- **Security Audit:**
  - `service_role` in `src/`: 0 occurrences.
  - `a5555555` placeholder UUIDs in `src/`: 0 occurrences (only exists in test negative assertion).
  - Hardcoded passwords in `src/`: 0 occurrences.
  - "F03" public mentions: 0 occurrences.
  - Local mock datasets (`INITIAL_PROPERTIES`, `MOCK_PROPERTIES`): 0 occurrences.
- **Live Local Server:** Verified running and responding with HTTP 200 on `http://127.0.0.1:5173/`.
