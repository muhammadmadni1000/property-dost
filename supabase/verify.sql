-- ============================================================
-- PROPERTY DOST - Database Verification Queries
-- Run these queries in Supabase SQL Editor to verify schema & data integrity.
-- ============================================================

-- 1. Verify Properties Count & Sample Records
SELECT 
    COUNT(*) AS total_properties,
    COUNT(CASE WHEN status = 'Available' THEN 1 END) AS available_properties,
    COUNT(CASE WHEN status = 'Sold' THEN 1 END) AS sold_properties,
    COUNT(CASE WHEN status = 'Rented' THEN 1 END) AS rented_properties
FROM properties;

-- 2. Inspect Properties with Genuine PostgreSQL UUIDs
SELECT 
    id, 
    title, 
    property_type, 
    purpose, 
    city, 
    area || ' ' || area_unit AS property_size,
    price, 
    status, 
    dealer_name
FROM properties
ORDER BY created_at DESC
LIMIT 10;

-- 3. Verify Customers Records
SELECT 
    id, 
    name, 
    phone, 
    email, 
    created_at
FROM customers
ORDER BY created_at DESC;

-- 4. Verify Visits with Joined Property & Customer Details
SELECT 
    v.id AS visit_id,
    v.property_id,
    p.title AS property_title,
    p.location AS property_location,
    v.customer_id,
    c.name AS customer_name,
    c.phone AS customer_phone,
    v.visit_date,
    v.visit_time,
    v.status AS visit_status,
    v.created_at
FROM visits v
JOIN properties p ON v.property_id = p.id
JOIN customers c ON v.customer_id = c.id
ORDER BY v.created_at DESC;

-- 5. CRITICAL VERIFICATION:
-- Verify that EVERY visit references a legitimate, existing property (visits.property_id = properties.id)
-- Orphaned count must be exactly 0.
SELECT 
    v.id AS orphaned_visit_id,
    v.property_id AS unlinked_property_id
FROM visits v
LEFT JOIN properties p ON v.property_id = p.id
WHERE p.id IS NULL;

-- 6. Verify Inquiries with Customer & Property Context
SELECT 
    i.id AS inquiry_id,
    i.customer_id,
    c.name AS customer_name,
    c.phone AS customer_phone,
    i.property_id,
    p.title AS property_title,
    i.message,
    i.status AS inquiry_status,
    i.created_at
FROM inquiries i
LEFT JOIN customers c ON i.customer_id = c.id
LEFT JOIN properties p ON i.property_id = p.id
ORDER BY i.created_at DESC;

-- 7. Verify Unique Constraint on Visit Slots (property_id, visit_date, visit_time)
SELECT 
    conname AS constraint_name, 
    contype AS constraint_type
FROM pg_constraint
WHERE conrelid = 'visits'::regclass
  AND conname = 'unique_property_visit_slot';

-- 8. Verify Row Level Security (RLS) is ENABLED on all 4 tables
SELECT 
    tablename, 
    rowsecurity AS rls_enabled
FROM pg_tables
WHERE schemaname = 'public' 
  AND tablename IN ('properties', 'customers', 'visits', 'inquiries');
