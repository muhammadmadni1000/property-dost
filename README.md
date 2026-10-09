# PROPERTY DOST

> **Tagline:** Find the Right Property. Make the Right Move.  
> **Supporting:** Your Trusted Property Partner | Jhelum & Punjab

A world-class, professional Property Dealer Management & Property Visit Booking System designed specifically for Pakistani real-estate operations in **Jhelum, Punjab, Pakistan**.

---

## 🌟 Key Features

1. **Supabase-First Relational Architecture**
   - **PostgreSQL / Supabase** is the sole source of truth for all real estate data.
   - Strict database-generated UUIDs (`gen_random_uuid()`) with zero fake/hardcoded IDs.
   - Zero local mock or demo arrays in client runtime code.

2. **Physical Property Visit Booking Pipeline**
   - Direct physical tour reservation linked to verified properties.
   - Preserves identical property UUID from listing card → details view → booking route → `visits.property_id`.
   - **Database-Level Duplicate Slot Protection** via unique constraint on `(property_id, visit_date, visit_time)` preventing double bookings.
   - Legitimate booking reference issued directly from the inserted `visits.id`.

3. **Property Dost AI (Natural Language Assistant)**
   - Supports **English**, **Urdu**, and **Roman Urdu** (e.g. *"Mujhe Jhelum Citi Housing mein 5 marla ka ghar chahiye"*).
   - Extracts locality, property type, area size (Marla/Kanal), and budget ceiling (Lakh/Crore).
   - Queries authentic Supabase records with a **Zero Hallucination Guarantee**.

4. **Authorized Dealer & Admin Management Console**
   - Real-time KPI statistics: Total Properties, Available, Sold, Rented, Today's Visits, Pending Requests, Inquiries.
   - Property inventory management with CRUD actions, search, and instant status transitions.
   - Visit booking approval workflow (Requested → Confirmed → Visited → Cancelled).
   - Inquiries triage and resolution tracking.
   - Protected routes governed by official **Supabase Auth**.

5. **Security & Row Level Security (RLS)**
   - RLS strictly enabled across all tables (`properties`, `customers`, `visits`, `inquiries`).
   - Zero `service_role` keys or sensitive credentials exposed to the frontend browser.
   - Live Supabase connection health check that only grants "Live Supabase Connected" status upon a verified database query.

6. **Pakistani Real-Estate Context**
   - Real localities: Citi Housing Scheme, Jhelum Cantt, Civil Lines, G.T. Road, River View Officers Colony.
   - Pricing in PKR (formatted in Lakhs & Crores) and land measurements in Marla, Kanal, and Square Feet.
   - Click-to-chat WhatsApp integration with pre-filled property reference queries.

---

## 🛠️ Technology Stack

- **Frontend:** React 18, TypeScript, Tailwind CSS, Lucide React
- **Routing:** React Router v6
- **Backend & Database:** Supabase, PostgreSQL 15
- **Authentication:** Supabase Auth (Email / Password)
- **Tooling & Build:** Vite, PostCSS, Autoprefixer
- **Testing:** Vitest, Testing Library (`@testing-library/react`, `jsdom`)

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)
- A Supabase account and project

### 2. Installation
Clone the repository and install dependencies:
```bash
npm install
```

### 3. Environment Variables
Copy the example environment template:
```bash
cp .env.example .env
```
Populate `.env` with your Supabase credentials:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-actual-anon-key
```

### 4. Database Setup
Execute the migration and seed scripts in your Supabase SQL Editor:
1. `supabase/migrations/20261008000001_initial_schema.sql`
2. `supabase/seed.sql`

*(Refer to [SUPABASE_SETUP.md](file:///c:/Users/Admin1/Desktop/final%20project%20bano%20qabil/SUPABASE_SETUP.md) for full walkthrough).*

### 5. Running Locally
Start the development server:
```bash
npm run dev
```
Open your browser at `http://127.0.0.1:5173/`.

---

## 🧪 Testing

Run the automated test suite powered by Vitest:
```bash
npm test
```
The test suite validates:
- **Property ID Preservation Pipeline** (`properties.id` → `PropertyCard` → details URL → booking URL → `visits.property_id`)
- Duplicate slot booking conflict handling & database constraint responses
- Property search, filtering, and error handling without fallback mocks
- Supabase connection health check states

---

## 📦 Production Build

Compile TypeScript and build the production bundle:
```bash
npm run build
```
Preview the built bundle:
```bash
npm run preview
```

---

## 🌐 Deployment (Vercel)

This application is ready for seamless deployment to Vercel:
1. Push this project to GitHub.
2. Import the repository into your Vercel Dashboard.
3. Configure the Environment Variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
4. Deploy!

---

## 📄 License

Developed for enterprise property management in Jhelum, Punjab, Pakistan.
