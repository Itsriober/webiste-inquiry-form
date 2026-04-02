# Deployment Checklist Plan: Local to Vercel

This guide outlines the steps needed to deploy the Illustriober Creatives Client Intake Form & Dashboard from a local development environment to production on Vercel. 

---

## 1. Local Preparation & Build Check

Before deploying, ensure everything runs without errors locally:

- [ ] **Run type checks & build locally:**
  Ensure the project compiles successfully without any TypeScript or Vite errors.
  ```bash
  npm run build
  ```
- [ ] **Verify `vercel.json` exists:**
  Make sure this configuration file is at the root of your project:
  ```json
  {
    "rewrites": [{ "source": "/(.*)", "destination": "/" }]
  }
  ```
  *This is required for React Router to work correctly on a Single Page Application (SPA).*
- [ ] **Commit changes:**
  Make sure all your latest code is committed.
  ```bash
  git add .
  git commit -m "Prepare for Vercel deployment"
  ```
- [ ] **Push to GitHub / GitLab / Bitbucket:**
  ```bash
  git push origin main
  ```

---

## 2. Vercel Project Setup

- [ ] **Log in to Vercel:** Go to [vercel.com](https://vercel.com/) and log in.
- [ ] **Add New Project:** Click "Add New..." -> "Project".
- [ ] **Import Repository:** Select the Git repository where your code is pushed.
- [ ] **Configure Project:**
  - **Framework Preset:** Vercel should automatically detect **Vite**. If not, select Vite from the dropdown.
  - **Build Command:** `npm run build` or `vite build`
  - **Output Directory:** `dist`

---

## 3. Configure Environment Variables

Before you click Deploy, expand the **Environment Variables** section and add the following keys. These are critical for EmailJS and the local Dashboard access.

- [ ] `VITE_EMAILJS_SERVICE_ID`: Your EmailJS Service ID
- [ ] `VITE_EMAILJS_TEMPLATE_ID`: Your EmailJS Template ID
- [ ] `VITE_EMAILJS_PUBLIC_KEY`: Your EmailJS Public Key
- [ ] `VITE_DASHBOARD_PIN`: Choose a secure 4–6 digit PIN for accessing the `/dashboard` route.

*Note: You do NOT need the `VITE_SHEETS_*` variables as Google Sheets integration was replaced by the local dashboard in v2.*

---

## 4. Deploy & Verify

- [ ] **Deploy:** Click the **Deploy** button. Vercel will clone your repository, inject the environment variables, run the build command, and publish your project.
- [ ] **Visit the Live Site:** Once deployed, click the generated URL.
- [ ] **Test the Public Form:**
  - Traverse through the 7 steps.
  - Select "Other" in any of the expanded chip groups and test input functionality.
  - Submit the form successfully.
- [ ] **Verify EmailJS Delivery:** 
  - Check your configuring email inbox to verify the brief summary was delivered correctly.
- [ ] **Test Dashboard Access:**
  - Navigate directly to `https://<your-deployment-url>/dashboard`.
  - Enter the PIN you configured in `VITE_DASHBOARD_PIN`.
  - Verify the stats overview and that your test submission appears in the feed.

---

## 5. Post-Deployment Maintenance

- [ ] **Custom Domain (Optional):** In the Vercel project Settings under "Domains," you can add a custom domain if preferred.
- [ ] **Future Updates:** Any new commits pushed to the `main` branch on your Git repository will automatically trigger a new deployment on Vercel.
