-- ============================================================
-- PROPERTY DOST - Database Schema & Row Level Security (RLS)
-- Target: Supabase PostgreSQL
-- ============================================================

-- Enable pgcrypto if not enabled (provides gen_random_uuid)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Helper function for updating updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- 2. PROPERTIES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    property_type TEXT NOT NULL CHECK (
        property_type IN ('House', 'Plot', 'Flat', 'Shop', 'Office', 'Agricultural Land', 'Commercial Property')
    ),
    purpose TEXT NOT NULL CHECK (
        purpose IN ('For Sale', 'For Rent')
    ),
    location TEXT NOT NULL,
    city TEXT NOT NULL,
    area NUMERIC,
    area_unit TEXT DEFAULT 'Marla',
    price NUMERIC,
    bedrooms INTEGER DEFAULT 0,
    bathrooms INTEGER DEFAULT 0,
    description TEXT,
    features TEXT[] DEFAULT '{}',
    image_url TEXT,
    images TEXT[] DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'Available' CHECK (
        status IN ('Available', 'Sold', 'Rented')
    ),
    dealer_name TEXT,
    dealer_phone TEXT,
    dealer_whatsapp TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger for properties.updated_at
DROP TRIGGER IF EXISTS trg_properties_updated_at ON properties;
CREATE TRIGGER trg_properties_updated_at
    BEFORE UPDATE ON properties
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- 3. CUSTOMERS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index on phone for fast lookup & customer matching
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);

-- ============================================================
-- 4. VISITS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS visits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    visit_date DATE NOT NULL,
    visit_time TIME NOT NULL,
    status TEXT NOT NULL DEFAULT 'Requested' CHECK (
        status IN ('Requested', 'Confirmed', 'Visited', 'Cancelled')
    ),
    message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    -- Database-level duplicate booking prevention
    CONSTRAINT unique_property_visit_slot UNIQUE (property_id, visit_date, visit_time)
);

-- Trigger for visits.updated_at
DROP TRIGGER IF EXISTS trg_visits_updated_at ON visits;
CREATE TRIGGER trg_visits_updated_at
    BEFORE UPDATE ON visits
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_visits_property_id ON visits(property_id);
CREATE INDEX IF NOT EXISTS idx_visits_customer_id ON visits(customer_id);
CREATE INDEX IF NOT EXISTS idx_visits_date ON visits(visit_date);

-- ============================================================
-- 5. INQUIRIES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'New' CHECK (
        status IN ('New', 'Contacted', 'Resolved')
    ),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_inquiries_customer_id ON inquiries(customer_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_property_id ON inquiries(property_id);

-- ============================================================
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------
-- PROPERTIES POLICIES
-- ------------------------------------------------------------
-- Public visitors can read properties
CREATE POLICY "Public can view properties"
    ON properties FOR SELECT
    USING (true);

-- Authenticated admins can manage properties (INSERT, UPDATE, DELETE)
CREATE POLICY "Admins can manage properties"
    ON properties FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- ------------------------------------------------------------
-- CUSTOMERS POLICIES
-- ------------------------------------------------------------
-- Public can create new customer records when booking or inquiring
CREATE POLICY "Public can insert customers"
    ON customers FOR INSERT
    WITH CHECK (true);

-- Authenticated admins can view, update, delete customers
CREATE POLICY "Admins can manage customers"
    ON customers FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- ------------------------------------------------------------
-- VISITS POLICIES
-- ------------------------------------------------------------
-- Public can submit a visit request
CREATE POLICY "Public can insert visits"
    ON visits FOR INSERT
    WITH CHECK (true);

-- Public can view visits (e.g. to confirm booking receipt by ID or verify slot availability)
CREATE POLICY "Public can view visits"
    ON visits FOR SELECT
    USING (true);

-- Authenticated admins can manage all visits
CREATE POLICY "Admins can manage visits"
    ON visits FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- ------------------------------------------------------------
-- INQUIRIES POLICIES
-- ------------------------------------------------------------
-- Public can submit inquiries
CREATE POLICY "Public can insert inquiries"
    ON inquiries FOR INSERT
    WITH CHECK (true);

-- Authenticated admins can manage inquiries
CREATE POLICY "Admins can manage inquiries"
    ON inquiries FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);
