-- ============================================================
-- PROPERTY DOST - Seed Data for Supabase PostgreSQL
-- Realistic sample records in Jhelum, Punjab, Pakistan
-- NOTE: IDs are intentionally NOT specified.
-- PostgreSQL generates genuine UUIDs automatically via gen_random_uuid().
-- ============================================================

INSERT INTO properties (
    title,
    property_type,
    purpose,
    location,
    city,
    area,
    area_unit,
    price,
    bedrooms,
    bathrooms,
    description,
    features,
    image_url,
    images,
    status,
    dealer_name,
    dealer_phone,
    dealer_whatsapp
)
VALUES
(
    '5 Marla Modern Luxury House in Citi Housing Jhelum',
    'House',
    'For Sale',
    'Block B, Citi Housing Scheme',
    'Jhelum',
    5,
    'Marla',
    13500000,
    3,
    3,
    'Newly constructed 5 Marla double-storey house located in prime Block B of Citi Housing Jhelum. Features high-end Spanish tiles, solid ash wood woodwork, imported sanitary fittings, modular kitchen, and an airy rooftop terrace with scenic surroundings.',
    ARRAY['Double Storey', 'Ash Wood Doors', 'Imported Tiles', 'Modular Kitchen', 'Car Porch', 'Sui Gas Available', 'Electricity Underground', '24/7 Gated Security'],
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    ARRAY[
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&w=1200&q=80'
    ],
    'Available',
    'Malik Tariq Mehmood',
    '+92 300 5412890',
    '+923005412890'
),
(
    '10 Marla Prime Residential Plot in Jhelum Cantt',
    'Plot',
    'For Sale',
    'Near River View Officers Colony, Cantt',
    'Jhelum',
    10,
    'Marla',
    16000000,
    0,
    0,
    'Exceptional 10 Marla corner residential plot situated in the tranquil, high-security environs of Jhelum Cantt. Ready for immediate construction with clear registry, underground utilities, and wide 50-ft carpeted road access.',
    ARRAY['Corner Plot', '50ft Carpeted Road', 'Underground Utilities', 'High Security Zone', 'Ready for Construction', 'Clear Title Registry'],
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
    ARRAY[
        'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1524813686514-a57563d77d66?auto=format&fit=crop&w=1200&q=80'
    ],
    'Available',
    'Chaudhry Nadeem Akhtar',
    '+92 301 8765432',
    '+923018765432'
),
(
    '2 Bedroom Executive Flat for Rent in Civil Lines Jhelum',
    'Flat',
    'For Rent',
    'Civil Lines, Near DC Office Road',
    'Jhelum',
    1200,
    'Square Feet',
    45000,
    2,
    2,
    'Spacious, well-ventilated 2-bedroom executive apartment situated on the 2nd floor of an exclusive residential complex in Civil Lines. Comes with dedicated lift access, standby backup generator, reserved parking, and round-the-clock maintenance staff.',
    ARRAY['Elevator Access', 'Standby Generator', 'Reserved Parking', 'Balcony View', 'American Style Kitchen', 'Dedicated Water Tank', 'CCTV Surveillance'],
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
    ARRAY[
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80'
    ],
    'Available',
    'Haji Muhammad Aslam',
    '+92 321 9543210',
    '+923219543210'
),
(
    'Commercial Shop on Main G.T. Road Jhelum',
    'Shop',
    'For Sale',
    'Main G.T. Road, Near Jhelum River Bridge',
    'Jhelum',
    450,
    'Square Feet',
    22000000,
    0,
    1,
    'High footfall commercial shop directly fronting main G.T. Road Jhelum. Ideal for bank branches, pharmacy, branded retail showroom, or telecom franchise. Guaranteed high rental yield and premium capital appreciation.',
    ARRAY['Main Highway Frontage', 'Glass Facade', 'High Ceiling', 'Heavy Foot Traffic', 'Separate Electricity Meter', 'Approved Commercial NOC'],
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
    ARRAY[
        'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1200&q=80'
    ],
    'Available',
    'Raja Waqas Afzal',
    '+92 333 5876543',
    '+923335876543'
),
(
    '1 Kanal Royal Designer House in Citi Housing Jhelum',
    'House',
    'For Sale',
    'Executive Block, Citi Housing Scheme',
    'Jhelum',
    1,
    'Kanal',
    38000000,
    5,
    6,
    'Bespoke 1 Kanal architectural masterpiece designed for prestigious living. Features 5 master bedrooms with attached Italian baths, double height lobby, bespoke chandeliers, automated smart lighting, servant quarter, lawn garden, and space for 4 SUVs in porch.',
    ARRAY['5 Master Bedrooms', 'Italian Bathrooms', 'Smart Home Automation', 'Lawn Garden', '4-Car Garage', 'Servant Quarters', 'Gated Community', 'Swimming Pool Ready'],
    'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80',
    ARRAY[
        'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80'
    ],
    'Available',
    'Malik Tariq Mehmood',
    '+92 300 5412890',
    '+923005412890'
),
(
    'Modern Family House near Jhelum Cantt',
    'House',
    'For Sale',
    'Officers Colony Extension, Cantt Border',
    'Jhelum',
    7,
    'Marla',
    18500000,
    4,
    4,
    'Beautifully maintained 7 Marla family home adjacent to Jhelum Cantt. High-ceiling lounge, drawing dining, separate laundry area, semi-furnished kitchen with cooking range, and rooftop pergola with panoramic views.',
    ARRAY['Semi-Furnished', 'Pergola Rooftop', 'Water Filtration Plant', 'Spacious Porch', 'Drawing Dining', 'Prime Cantt Vicinity'],
    'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
    ARRAY[
        'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'
    ],
    'Available',
    'Chaudhry Nadeem Akhtar',
    '+92 301 8765432',
    '+923018765432'
),
(
    'Corporate Commercial Office in Jhelum Business Center',
    'Office',
    'For Rent',
    'Opposite Tehsil Headquarter Hospital, Kazam Plaza',
    'Jhelum',
    1800,
    'Square Feet',
    85000,
    0,
    2,
    'Fully furnished corporate office floor fitted with 4 manager cabins, reception area, conference room with multimedia projector, conference seating, and dedicated high-speed optical fiber connectivity.',
    ARRAY['Furnished Cabins', 'Conference Room', 'Fiber Internet', 'Reception Lobby', 'Dedicated Kitchenette', 'Central Air Conditioning'],
    'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
    ARRAY[
        'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80'
    ],
    'Available',
    'Raja Waqas Afzal',
    '+92 333 5876543',
    '+923335876543'
),
(
    '16 Kanal Fertile Agricultural Land near Jhelum River',
    'Agricultural Land',
    'For Sale',
    'Kala Gujran Road, River Belt Area',
    'Jhelum',
    16,
    'Kanal',
    24000000,
    0,
    0,
    'Prime fertile agricultural land with perpetual tube-well water rights, connected to main metalloid access road. Highly suited for commercial dairy farming, modern farmhouse development, organic cultivation, or future suburban plotting.',
    ARRAY['Tube-well Water Supply', 'Road Access', 'Fertile Soil', 'Clear Land Revenue Records', 'Ideal for Farmhouse'],
    'https://images.unsplash.com/photo-1500076656116-558758c991c1?auto=format&fit=crop&w=1200&q=80',
    ARRAY[
        'https://images.unsplash.com/photo-1500076656116-558758c991c1?auto=format&fit=crop&w=1200&q=80'
    ],
    'Available',
    'Haji Muhammad Aslam',
    '+92 321 9543210',
    '+923219543210'
);
