# DealDrop ⚡ - Hyperlocal Flash Sale Platform

Welcome to **DealDrop**, a robust, real-time platform designed specifically for hackathons. DealDrop seamlessly bridges the gap between local retailers looking to clear time-sensitive inventory and nearby customers hunting for the best local deals.

---

## 🌩️ Problem Statement

Local retailers, particularly grocery stores, bakeries, and boutique shops, frequently face a critical challenge: **clearing overstocked or near-expiring inventory in a severely limited timeframe.**
Currently, there is no efficient, highly-localized method for businesses to immediately notify surrounding customers of steep, time-sensitive discounts. Traditional marketing takes too long, and food delivery apps are either too expensive or lack real-time localized push mechanics for flash sales.

This disconnect results in two major issues:
1. **Massive financial waste for retailers** left with unsold expiring goods.
2. **Lost savings opportunities for customers** who are physically right around the corner but completely unaware of the deal happening inside the store.

## 💡 The Solution

**DealDrop** solves this by acting as a highly-localized, urgent "flash mob" deal discovery network. 

When a retailer realizes they have products that must be sold by the end of the day, they can instantly drop a "Flash Deal" onto the map. Using our **Dynamic Pulse Engine** and geolocation, customers within walking distance are immediately alerted. 

**How it specifically solves the problem:**
- **Real-time Discovery:** Customers open an interactive map to see ticking-time-bomb deals physically near them.
- **Urgency & Scarcity:** Deals feature live countdowns and remaining stock indicators, creating intense FOMO and driving immediate foot traffic.
- **Community Engagement:** Users can join "Flash Squads" to unlock deeper tier discounts if enough people claim the deal, turning inventory clearance into a viral, group-buying event.
- **Persistent Community Feed:** Customers can share their 'pulses' (reviews, shouts, deal finds) in a living, localized Supabase-backed social feed.

---

## 🛠️ Tech Stack

- **Frontend & Framework:** Next.js 14 (App Router), React, Tailwind CSS
- **Database Backend:** Supabase (PostgreSQL)
- **State Management:** React Hooks (`useState`, `useEffect`) & Context
- **Hosting / Deployment:** Vercel

---

## 🚀 Key Features

* **Interactive Deal Dashboard:** A location-aware deal explorer displaying active merchant offers based on proximity and time remaining.
* **Persistent Community Feed:** A real-time, database-backed social feed where local shoppers broadcast their latest savings, leave tips, and 'like' community posts safely.
* **Squad Flash Mobs:** Group-buying capability where customers can 'team up' to fulfill a retailer's target quota, unlocking a secondary, deeper discount tier for the entire squad.
* **Optimistic UI Data Handling:** Form submissions like creating a community post instantly mirror locally for a snappy UI while synchronizing with Supabase in the background.

---

## ⚙️ Setup Instructions

Follow these instructions to run the project locally for judging and testing purposes.

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd dealdrop
```

### 2. Install Dependencies
Due to peer-dependency mismatches between React 19 and certain map wrappers, you must append the legacy peer-deps flag when installing locally.
```bash
npm install --legacy-peer-deps
```
*(Note: If deploying on Vercel, this repository contains a `.npmrc` file that handles this bypass automatically).*

### 3. Setup Supabase
You will need a Supabase project to handle the backend Community database. 
1. Create a project on [Supabase.com](https://supabase.com/).
2. Navigate to your **SQL Editor** in the Supabase Dashboard.
3. Paste and run the following required schema to initialize the community database:

```sql
CREATE TABLE IF NOT EXISTS public.community_posts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_name text NOT NULL,
  avatar text,
  time_display text NOT NULL DEFAULT 'Just now',
  location text,
  content text NOT NULL,
  image text,
  likes integer DEFAULT 0,
  comments integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON public.community_posts FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON public.community_posts FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for likes" ON public.community_posts FOR UPDATE USING (true);
```

### 4. Configure Environment Variables
Create a file named `.env.local` in the root of the dealdrop folder and add your specific Supabase credentials found in your Project Settings > API:

```env
NEXT_PUBLIC_SUPABASE_URL="https://[YOUR-PROJECT-REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[YOUR-ANON-KEY]"
```

### 5. Run the Application
Boot up the Next.js development server:
```bash
npm run dev
```
Open **http://localhost:3000** in your browser.

---

## 📁 Project Structure

- `app/(customer)`: The mobile-first, consumer-facing application where locals hunt for expiring flash deals and participate in squad buys. Contains the Community Feed.
- `app/(retailer)`: The merchant-facing dashboard for quickly dropping new deals onto the network.
- `lib/supabase`: Database schemas, type definitions, and standard SSR client initializers.
- `components/`: UI assets, buttons, and visual deal-card metrics timers.
