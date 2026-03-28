# DealDrop ⚡

DealDrop is a hyperlocal flash sale platform connecting local retailers with nearby customers via real-time, location-based deals. Retailers can clear inventory using AI-driven pricing and voice-to-deal parsing, while customers discover hot discounts in their immediate vicinity.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS + shadcn/ui
- **Database:** Supabase (PostgreSQL + PostGIS)
- **Auth:** Supabase Auth
- **Realtime:** Supabase Realtime (SSE/Websockets)
- **Maps:** Leaflet.js
- **AI:** Anthropic Claude API (Sonnet 3.5)
- **State:** Zustand
- **Analytics:** Recharts

## Features

- **Hyperlocal Feed:** Discover deals within walking distance (PostGIS enabled).
- **AI Voice-to-Deal:** Retailers can post deals by speaking.
- **Dynamic Pricing:** AI suggests discounts based on expiry and stock levels.
- **Flash Mob Squads:** Group buying mechanic for extra discounts.
- **Deal Passport:** Gamified hunter ranks and loyalty stamps.
- **Live Deal Pulse:** Real-time activity feed of nearby claims.

## Setup Instructions

1. **Clone & Install**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Copy `.env.local.example` to `.env.local` and fill in:
   - Supabase URL & Keys
   - Anthropic API Key
   - VAPID keys for Push Notifications

3. **Supabase Setup**
   Run the SQL provided in the "DATABASE SCHEMA" section of the prompt in your Supabase SQL Editor to initialize tables, RLS policies, and PostGIS RPC functions.

4. **Run Development Server**
   ```bash
   npm run dev
   ```

5. **Deploy**
   Best deployed on Vercel with a Supabase project.

## Project Structure

- `/app`: App router pages and layouts
- `/api`: Server-side API endpoints (Edge & Serverless)
- `/components`: UI and logic-specific components
- `/lib`: Shared utilities, AI SDK, and Supabase client
- `/hooks`: Custom React hooks for location, deals, and realtime
- `/store`: Global state management with Zustand
