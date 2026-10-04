# SMARTMOVE - Features Added

## 1. Smart Route Comparison
- Google Routes API now requests alternative routes for driving/two-wheeler journeys.
- Routes are labelled Fastest, Shortest and Eco based on returned route metrics.
- Each route displays distance, ETA, estimated cost and estimated CO2.
- Clicking a route selects it and updates the map and Start Trip action to use that route.
- Cost and CO2 are estimates using simple per-km factors and should be presented as estimates.

## 2. QR Live Trip Sharing
- Active trips now have a QR Code button.
- The QR opens the existing public `/share-trip/:token` live map.
- Copy Link and Share Link actions remain available.
- QR image generation uses the QRServer image endpoint, so an internet connection is required when opening the QR modal.

## Validation
- Backend routes controller passes `node --check`.
- PlanJourney.jsx parses successfully with Babel JSX parser.
- Full Vite build could not be completed in this Linux environment because the supplied frontend node_modules is missing Rollup's platform optional dependency; this is an environment/dependency issue, not a source syntax error.


## Admin Citizen Issue Resolution Workflow
- Admin dashboard now loads all citizen reports.
- Admin can change status: REPORTED, IN_PROGRESS, RESOLVED, REJECTED.
- Admin can change priority and add an admin/resolution note.
- Saving a changed status or note creates a user notification.
- RESOLVED sends a clear completion notification to the reporting user.
- User's My Reports page displays the latest admin/resolution note.
