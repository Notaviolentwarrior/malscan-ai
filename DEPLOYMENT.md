# Cloud Deployment

This repo is prepared for a simple cloud split:

- `frontend` -> Vercel
- `backend` -> Render web service
- `analyzer` -> Render private service
- MongoDB -> MongoDB Atlas

## Why this split

- Vercel is a good fit for the React/Vite frontend.
- Render can run the existing Dockerized Spring Boot and FastAPI services.
- MongoDB Atlas provides the hosted MongoDB connection string the backend already supports.
- The backend now sends uploaded file bytes directly to the analyzer, so the cloud deployment no longer depends on a shared local volume.

## 1. Deploy MongoDB Atlas

Create an Atlas cluster and copy its SRV connection string, which looks like:

`mongodb+srv://<user>:<password>@<cluster-host>/?retryWrites=true&w=majority`

Use that value for `SPRING_DATA_MONGODB_URI` on Render.

## 2. Deploy Backend and Analyzer on Render

Use the root-level `render.yaml` Blueprint.

Services created:

- `malscan-analyzer` as a private service
- `malscan-backend` as a public web service

Render environment variables to set manually:

- `SPRING_DATA_MONGODB_URI`
  Use the Atlas connection string.
- `APP_CORS_ALLOWED_ORIGINS`
  Set this to your Vercel frontend origin, for example:
  `https://malscan-ai.vercel.app`

Render sets `APP_ANALYZER_BASE_URL` automatically from the analyzer private service.

After deploy, note the public backend URL, for example:

`https://malscan-backend.onrender.com`

## 3. Deploy Frontend on Vercel

Create a Vercel project with:

- Root Directory: `frontend`
- Framework: Vite

Set this environment variable in Vercel:

- `VITE_API_BASE_URL`
  Example:
  `https://malscan-backend.onrender.com/api`

The `frontend/vercel.json` file adds SPA route fallback so `/dashboard`, `/upload`, and `/scans/:id` work on refresh.

## 4. Post-Deploy Check

Verify these URLs:

- Frontend root: `https://<your-vercel-domain>`
- Backend health: `https://<your-render-backend>/api/health`
- Analyzer health is private and should be checked from Render service logs/health

Then test an upload from the frontend UI with a `.exe` or `.dll` file.
