# EcoSense Deployment Guide

Complete step-by-step instructions for deploying EcoSense to Render (Backend) and Vercel (Frontend).

> Note on Free Tiers: Free tiers and platform policies change over time. Always check the current Render and Vercel dashboards for updated resource limits, sleep intervals, and bandwidth allowances.

---

## 1. Deploy the Backend on Render

Render hosts the FastAPI service on its free web tier.

### Option A: Using Blueprint (Recommended)
1. Log in to [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** in the top navigation bar and select **Blueprint**.
3. Connect your GitHub account and select the repository: `https://github.com/Sangramjeet18/Panchtatva.git`.
4. Render will detect the `render.yaml` file at the repository root automatically.
5. Provide a service name (e.g. `ecosense-backend`).
6. Click **Apply**. Render will build and deploy the Python backend.

### Option B: Manual Web Service Setup
1. Log in to [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** and select **Web Service**.
3. Choose **Build and deploy from a Git repository** and click **Next**.
4. Select `Panchtatva` from your repository list.
5. Fill in the service configuration:
   - **Name**: `ecosense-backend`
   - **Region**: Choose the region closest to your users (e.g., Singapore or Frankfurt).
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Instance Type**: `Free`
6. Scroll down to **Environment Variables** and add the following keys:
   - `PYTHON_VERSION`: `3.11.9`
   - `FRONTEND_ORIGINS`: `http://localhost:3000` (You will update this with your Vercel URL in Step 3).
7. Under **Advanced Settings**, set **Health Check Path** to `/health`.
8. Click **Create Web Service**.

### Reading Logs & Copying Service URL
1. Once deployment begins, click the **Logs** tab on your Render service page.
2. Watch for: `Application startup complete` and `Uvicorn running on http://0.0.0.0:10000`.
3. In the top left corner under your service name, copy the public URL (e.g., `https://ecosense-backend.onrender.com`).
4. Test the health endpoint in your browser: `https://ecosense-backend.onrender.com/health`. It must return `{"status":"ok","version":"1.0.0"}`.

---

## 2. Deploy the Frontend on Vercel

Vercel hosts the Next.js App Router frontend with global CDN edge delivery.

1. Log in to [Vercel Dashboard](https://vercel.com/).
2. Click **Add New...** and select **Project**.
3. Under **Import Git Repository**, select `Panchtatva`.
4. In the **Configure Project** screen:
   - **Project Name**: `ecosense`
   - **Framework Preset**: `Next.js`
   - **Root Directory**: Click **Edit** and select `frontend`. Click **Continue**.
5. Expand the **Environment Variables** section and add:
   - **Name**: `NEXT_PUBLIC_API_URL`
   - **Value**: Your Render backend URL from Step 1 (e.g., `https://ecosense-backend.onrender.com`, without any trailing slash).
   - **Name**: `NEXT_PUBLIC_SITE_URL` (optional)
   - **Value**: `https://ecosense.vercel.app` (or your chosen Vercel domain).
6. Click **Deploy**.
7. Wait 60 to 90 seconds for the build to finish. Once complete, click **Go to Dashboard** and copy your production domain (e.g., `https://ecosense.vercel.app` or `https://panchtatva.vercel.app`).

---

## 3. Connect CORS on Render

Now that your frontend has a live production URL, allow it in Render's CORS configuration.

1. Open your Render dashboard and click on `ecosense-backend`.
2. Go to the **Environment** tab on the left menu.
3. Find the `FRONTEND_ORIGINS` variable (or click **Add Environment Variable** if it does not exist).
4. Update its value to include your Vercel URL and local development URL separated by a comma:
   ```text
   http://localhost:3000,https://ecosense.vercel.app
   ```
   (Replace `https://ecosense.vercel.app` with your actual Vercel project URL; do not include a trailing slash).
5. Click **Save Changes**.
6. Render will automatically trigger a zero-downtime redeploy with the new CORS origin setting.

---

## 4. Post-Deployment Verification Checklist

Verify each of the following in your live browser:

1. **Backend Health Check**:
   Visit `https://your-backend.onrender.com/health`.
   Expected: `{"status":"ok","version":"1.0.0"}`.
2. **National Forest Endpoint**:
   Visit `https://your-backend.onrender.com/forest/national`.
   Expected: JSON payload with historical series and 10-year projection.
3. **State and District Coverage**:
   Visit `https://your-backend.onrender.com/forest/states`.
   Expected: Array of 36 Indian states and union territories.
4. **Waterlogging Index**:
   Visit `https://your-backend.onrender.com/waterlogging/index`.
   Expected: 8 Kolkata monitoring areas with screening indices.
5. **Frontend Navigation**:
   Open your Vercel URL in desktop and mobile viewports.
   Confirm Home, Deforestation, Reforestation, Carbon, and Waterlogging pages load without console errors.
6. **Carbon Calculator**:
   Adjust electricity and transit sliders. Verify total annual emissions update cleanly.
7. **Cold Start Behavior**:
   When the backend sleeps after 15 minutes of inactivity, open a data page. Verify the skeleton loader displays:
   `Waking the server, this can take up to 30 seconds`.

---

## 5. How to Redeploy After a Git Push

- **Automatic Deployments**: By default, both Render and Vercel watch the `main` branch. Every push to `main` triggers a fresh build and deploy on both platforms.
- **Manual Redeploy on Render**: Go to your web service, click **Manual Deploy** in the top right, and choose **Clear build cache & deploy**.
- **Manual Redeploy on Vercel**: Go to your project, click the **Deployments** tab, select the latest deployment, click the three-dots icon, and choose **Redeploy**.

---

## 6. Common Errors and Troubleshooting

### 1. CORS Error in Browser Console (`Access-Control-Allow-Origin`)
- **Cause**: The frontend domain calling the API is not listed in `FRONTEND_ORIGINS` on Render.
- **Fix**: Open Render Dashboard -> Environment -> edit `FRONTEND_ORIGINS` -> paste your exact Vercel URL (e.g. `https://ecosense.vercel.app`, no trailing slash). Save and allow redeployment.

### 2. 502 Bad Gateway or Timeout on First Load
- **Cause**: Render's free tier spins down web services after 15 minutes of inactivity. Cold boot takes 25 to 40 seconds.
- **Fix**: EcoSense includes an automatic 20-second retry in `lib/api.ts` with a user-facing waking notice. Wait 30 seconds and refresh the page; subsequent requests will be instantaneous.

### 3. Missing Environment Variable Error
- **Cause**: `NEXT_PUBLIC_API_URL` was not configured during Vercel project import.
- **Fix**: In Vercel, go to Settings -> Environment Variables -> Add `NEXT_PUBLIC_API_URL` with your Render backend URL. Then go to Deployments and trigger a Redeploy.

### 4. Build Failing on Vercel (`Cannot find module` or TypeScript errors)
- **Cause**: Root Directory was not set to `frontend`, or cached chunks got desynchronized.
- **Fix**: In Vercel, go to Settings -> General -> Root Directory -> set to `frontend`. Save and redeploy.

### 5. Render Port Error (`Port must be specified`)
- **Cause**: Start command had a hardcoded port instead of `$PORT`.
- **Fix**: Ensure your start command on Render is exactly:
  `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
