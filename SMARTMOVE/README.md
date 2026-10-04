# SMARTMOVE – Smart Urban Mobility Platform

## What is included
This package contains the previous working SMARTMOVE features plus the new demo-ready upgrades:

### Existing core features
- User registration/login and Google authentication
- Dashboard with live city mobility data
- Live traffic, parking and public transport
- Route planning with traffic-aware routing
- Live GPS trip tracking and route recalculation
- Start/stop trip and trip history
- Secure live-trip sharing link
- Favorites, issue reporting and notifications
- Profile, settings, accessibility and emergency services
- Admin/authority data management

### New upgrades
1. **Mobility Analytics** – trips completed, total distance, travel time, average distance, transport mix and charts.
2. **Transport Comparison** – compare car, bus, train and walking ETA/distance for the same route.
3. **SOS safety flow** – during a live trip, prepare/share the current location and optionally call India emergency number 112. SMARTMOVE never calls automatically.
4. **Mobility Center on Dashboard** – direct actions for live trips, analytics and safety.
5. **Trip completion summary API** – completed trips return distance, duration and traffic summary data.
6. **Clean dependency packaging** – `node_modules` is intentionally not included. Install dependencies on the target computer to avoid platform-specific Rollup errors.

## Windows setup
Open two terminals.

### Terminal 1 – backend
```bat
cd backend
npm install
npm run dev
```

### Terminal 2 – frontend
```bat
cd frontend
npm install
npm run dev
```

Or install both from the project root:
```bat
npm run install:all
```

Then open the Vite URL shown in the terminal, normally `http://localhost:5173`.

## Environment files
Copy the example files to `.env` and add your own valid credentials:

- `backend/.env.example` → `backend/.env`
- `frontend/.env.example` → `frontend/.env`

MongoDB must be running and Google Maps/Routes APIs must be enabled for route features.

## Recommended demo flow for viva
1. Login
2. Dashboard → show Mobility Center
3. Plan Journey → calculate route
4. Compare transport modes
5. Start Trip → allow GPS
6. Show live location/ETA/traffic
7. Share Live Trip
8. Show SOS safety flow
9. Stop Trip
10. Open Mobility Analytics and show charts
11. Open Travel History

## Important security note
Do not publish `.env` files or API keys to GitHub. The `.env.example` files intentionally contain placeholders.
