# DealDrop ⚡: Hyperlocal Flash Sale Platform

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge)](https://savara-hackathon-2026-4jhw.vercel.app/)

Connecting local retailers with nearby customers through real-time, location-based flash deals.

---

## 📌 Problem Statement

Local retailers often face significant challenges in clearing overstocked or near-expiry inventory. This is primarily due to a limited digital presence and low visibility among potential customers in their immediate vicinity. At the same time, nearby customers remain unaware of these time-sensitive deals, missing out on potential savings and high-quality products.

**The Disconnect:**
- **Lost Revenue**: Retailers lose money on unsold inventory that must be discarded.
- **Wasted Resources**: High-quality perishable products go to waste instead of being consumed.
- **Discovery Gap**: The absence of a real-time, location-based system widens the gap between supply and demand at the neighborhood level.

## 💡 The Proposed Solution: DealDrop

DealDrop bridges this gap by providing a real-time, location-based discovery platform. Our solution connects local businesses with nearby consumers in a timely and efficient manner, turning "waste" into "win-win" opportunities.

By leveraging **geospatial intelligence** and **social commerce**, DealDrop creates a sense of urgency and community, ensuring that great local deals find the right customers before they expire.

---

## 🏗️ Technical Architecture

The platform is designed for high performance and low-latency location-based interactions.

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | **Next.js 15 (App Router)** | Modern, fast, and SEO-optimized UI. |
| **Backend** | **Supabase (PostgreSQL)** | Robust database with built-in Auth and Real-time sync. |
| **Geospatial**| **PostGIS** | Precision distance calculations (`ST_DWithin`) for hyperlocal feeds. |
| **Mapping** | **Leaflet.js** | Interactive live radar and Pulse Map visualization. |
| **Styling** | **Tailwind CSS 4** | Ultra-responsive, modern design system. |
| **Deployment**| **Vercel** | Rapid deployment and global scalability. |

---

## 🚀 Key Features Built

### 📍 1. Pulse Map Discovery
A live-updating radar experience powered by **Leaflet.js**. It scans your current coordinates and visualizes active deals within a 2.5km radius using optimized **PostGIS** queries.

### 👫 2. Flash Mob Squads (Group Buying)
A social commerce feature where multiple customers can join a "Squad" for a specific deal. Once the squad reaches its target size (e.g., 5-10 hunters), an exclusive deeper discount is unlocked for all members.

### 📈 3. Merchant Command Center
A comprehensive dashboard for retailers to monitor **Revenue Potential**, **Claim Redemptions**, and **Customer Footprint** in real-time. Retailers can launch a new flash deal in under 30 seconds.

### 🏆 4. Deal Passport & Gamification
Customers earn "Loyalty Stamps" for supporting local shops. The "Passport" system tracks ranks from **Bronze** to **Gold**, unlocking exclusive rewards and early access to "Ghost Pulses."

### 🔥 5. Real-time Pulse Feed
A scrolling live activity feed showing global claims and neighborhood engagement, creating social proof and neighborhood excitement.

---

## 🔑 Demo Credentials

Test the platform with the following verified accounts:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Customer** | `deepu@gmail.com` | `12345678` |
| **Retailer** | `deepu123@gmail.com` | `12345678` |

---

## ⚙️ Setup & Installation Instructions

### 1. Prerequisites
- **Node.js** (v18.17+ or v20+)
- **NPM** or **PNPM**
- **Supabase Account** with a new project

### 2. Database Initialization (Supabase)
Navigate to the **SQL Editor** in your Supabase dashboard and run the migrations located in:
`./supabase/migrations/`

This will:
- Enable the `postgis` extension.
- Create core tables (`user_profiles`, `retailers`, `deals`, `claims`, `squads`).
- Set up **Row Level Security (RLS)** policies for data privacy.
- Initialize the `get_nearby_deals` PostGIS RPC function.

### 3. Environment Configuration
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Installation
```bash
git clone <your-repo-url>
cd dealdrop
npm install --legacy-peer-deps
```

### 5. Running Regionally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the portal.

### 6. Deployment
The project is optimized for **Vercel**. Connect your repository, add the environment variables, and trigger a build.

---

Developed for **Savara Hackathon 2026**
