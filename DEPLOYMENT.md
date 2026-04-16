# Deployment Guide — Railway (Backend) + Vercel (Frontend)

This guide walks you through deploying the Flipkart Clone step-by-step.  
**Backend → Railway** | **Frontend → Vercel**

---

## Prerequisites

- [ ] Code pushed to a **public GitHub repository**
- [ ] [Railway account](https://railway.app) (free tier works)
- [ ] [Vercel account](https://vercel.com) (free tier works)

---

## STEP 1 — Push Code to GitHub

```bash
# In the project root (scaler/)
git init
git add .
git commit -m "Initial commit — Flipkart Clone"

# Create a new public repo on github.com, then:
git remote add origin https://github.com/YOUR_USERNAME/flipkart-clone.git
git branch -M main
git push -u origin main
```

> **Important:** Make sure `.gitignore` excludes `.env`, `*.db`, `.venv/`, `node_modules/`.  
> These are already excluded in the provided `.gitignore`.

---

## STEP 2 — Deploy Backend on Railway

### 2.1 — Create a new Railway project

1. Go to [railway.app](https://railway.app) → **New Project**
2. Click **"Deploy from GitHub repo"**
3. Select your `flipkart-clone` repository
4. Railway will detect Python automatically

### 2.2 — Add a PostgreSQL database

1. Inside your Railway project, click **"+ New"** → **"Database"** → **"Add PostgreSQL"**
2. Wait for the database to provision (takes ~30 seconds)
3. Click on the PostgreSQL service → **"Variables"** tab
4. Copy the value of **`DATABASE_URL`** — you'll need it in the next step

### 2.3 — Configure backend environment variables

1. Click on your **backend service** in Railway → **"Variables"** tab
2. Add these variables one by one:

| Variable | Value |
|---|---|
| `DATABASE_URL` | Paste the PostgreSQL URL from step 2.3 |
| `SECRET_KEY` | Any long random string (e.g. `a8f5f167f44f4964e6c998dee827110c`) |
| `ALGORITHM` | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `10080` |
| `FRONTEND_URL` | Leave blank for now — you'll fill this after Vercel deploy |
| `MAIL_API_KEY` | Leave blank (emails will log to Railway console) |

### 2.4 — Set the start command

1. In your Railway service → **"Settings"** tab → **"Deploy"** section
2. Set **Start Command** to:
   ```
   uvicorn main:app --host 0.0.0.0 --port $PORT
   ```
3. Set **Root Directory** to `backend`

### 2.5 — Seed the production database

After the first successful deploy:

1. In Railway, click your backend service → **"Shell"** tab (or use Railway CLI)
2. Run:
   ```bash
   python seed_db.py
   ```
   This creates all tables and inserts the 37 sample products.

### 2.6 — Get your Railway backend URL

1. Go to your backend service → **"Settings"** → **"Networking"**
2. Click **"Generate Domain"**
3. Copy the URL — it looks like `https://flipkart-clone-backend.up.railway.app`
4. **Save this URL** — you need it for Vercel and for the CORS setting

---

## STEP 3 — Deploy Frontend on Vercel

### 3.1 — Create a new Vercel project

1. Go to [vercel.com](https://vercel.com) → **"Add New Project"**
2. Click **"Import Git Repository"** → select your `flipkart-clone` repo
3. Set **Root Directory** to `frontend`
4. Framework Preset: **Vite** (auto-detected)

### 3.2 — Add environment variables in Vercel

Before clicking Deploy, add this environment variable:

| Variable | Value |
|---|---|
| `VITE_API_URL` | `https://your-backend.up.railway.app` (your Railway URL from step 2.6) |

### 3.3 — Deploy

Click **"Deploy"**. Vercel builds and deploys in ~2 minutes.

Once done, copy your Vercel URL — it looks like `https://flipkart-clone.vercel.app`

---

## STEP 4 — Connect Frontend ↔ Backend (CORS Fix)

Now that you have both URLs, update Railway environment variables:

1. Go to Railway → your backend service → **"Variables"**
2. Update `FRONTEND_URL` to your Vercel URL:
   ```
   FRONTEND_URL=https://flipkart-clone.vercel.app
   ```
3. Railway will automatically redeploy the backend

---

## STEP 5 — Verify Everything Works

Open your Vercel URL and test:

- [ ] Home page loads with 37 products
- [ ] Category filter works
- [ ] Search bar filters products
- [ ] Login works (email: `user@flipkart.com`, password: `password`)
- [ ] Add to Cart works
- [ ] Wishlist toggle works (heart turns red/grey)
- [ ] Checkout flow completes (Delivery → Summary → Order placed)
- [ ] Orders page shows order history
- [ ] Back button works on all pages

Also test the API directly at: `https://your-backend.up.railway.app/docs`

---

## STEP 6 — (Optional) Custom Domain

### On Vercel:
1. Go to your Vercel project → **"Domains"**
2. Add your custom domain and follow the DNS instructions

### On Railway:
1. Go to your service → **"Settings"** → **"Networking"**
2. Add a custom domain

---

## Troubleshooting

### ❌ "CORS error" in browser console
- Make sure `FRONTEND_URL` in Railway exactly matches your Vercel URL (no trailing slash)
- Redeploy the backend after changing the variable

### ❌ Products not showing
- Make sure you ran `python seed_db.py` via the Railway shell after first deploy
- Check Railway logs for database connection errors

### ❌ Login fails in production
- Verify `SECRET_KEY` is set in Railway
- Check that `DATABASE_URL` is the Railway PostgreSQL URL (not the SQLite path)

### ❌ Images not loading
- Primary product images use Unsplash URLs — these are public and should load anywhere
- Secondary thumbnail images use placehold.co — also always available

### ❌ Vercel build fails
- Make sure `VITE_API_URL` is set before building
- Check the build logs in Vercel dashboard for specific errors

---

## Summary of URLs After Deployment

| Service | URL |
|---|---|
| Frontend | `https://your-app.vercel.app` |
| Backend API | `https://your-backend.up.railway.app` |
| API Docs | `https://your-backend.up.railway.app/docs` |
| PostgreSQL | Managed internally by Railway |
