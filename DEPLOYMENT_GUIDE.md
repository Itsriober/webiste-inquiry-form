# Deployment & Configuration Guide

## 🎯 Final Deployment Steps

### Step 1: Configure Vercel Environment Variables
1. Go to: **Vercel Dashboard → Your Project → Settings → Environment Variables**
2. Add these variables:

```
Name: DASHBOARD_PIN_SECRET
Value: [Use the same PIN as your VITE_DASHBOARD_PIN]
Environments: Production, Preview, Development
```

**Example**: If `VITE_DASHBOARD_PIN=1234`, then `DASHBOARD_PIN_SECRET=1234`

⚠️ **Important**: Keep this PIN secret! It controls access to all submitted forms on the dashboard.

### Step 2: Deploy to Production
```bash
# From project directory
vercel --prod
```

You should see:
```
✓ Production deployment ready
```

### Step 3: Verify Deployment
1. **Visit your deployed app**: `https://your-domain.vercel.app`
2. **Test form submission**:
   - Go to `/brief`
   - Fill out the entire form
   - Submit
   - Should see "Thank you" page
   - Check browser console: `✓ Brief submitted successfully: [uuid]`

3. **Test Dashboard**:
   - Go to `/dashboard`
   - Enter your PIN (same as VITE_DASHBOARD_PIN)
   - Should see your submitted brief immediately

4. **Cross-device test** (critical):
   - Use a different device/browser
   - Go to `/dashboard` 
   - Enter the PIN
   - **Should see all previous submissions** ✓

---

## 🔐 Security Checklist

- [ ] `DASHBOARD_PIN_SECRET` is configured in Vercel
- [ ] PIN matches `VITE_DASHBOARD_PIN` exactly
- [ ] No sensitive data in `env.example`
- [ ] `BLOB_READ_WRITE_TOKEN` auto-provisioned by Vercel (don't edit)
- [ ] API endpoints require PIN for `/get-briefs`, `/delete-brief`

---

## 🐛 Troubleshooting

### Dashboard shows "Unauthorized: Invalid PIN"
**Problem**: PIN doesn't match between client and server
**Solution**: 
1. Get your PIN from `VITE_DASHBOARD_PIN` in your `.env` file
2. Set `DASHBOARD_PIN_SECRET` in Vercel to the same value
3. Redeploy: `vercel --prod`

### Form submission fails with 500 error
**Check logs**:
```bash
vercel logs --prod --tail
```

**Common causes**:
- Form data fails Zod validation (check browser console for details)
- Blob Storage token not configured (shouldn't happen - Vercel auto-provisions)
- Network error (retry submission)

### Dashboard shows "Failed to fetch briefs"
**Check**:
1. PIN is correct
2. Network tab shows `/api/get-briefs?pin=XXXX` request
3. Response status (if 401 = wrong PIN, if 500 = check server logs)

### API endpoints return 404
**Problem**: Serverless functions not deployed
**Solution**:
1. Verify `vercel.json` has API rewrites:
   ```json
   { "source": "/api/(.*)", "destination": "/api/$1" }
   ```
2. Verify API files exist: `ls -la api/`
3. Redeploy: `vercel --prod`

---

## 📊 Verifying Data Flow

### What happens when you submit a form:

1. **Browser** → Validates with Zod schema
2. **Browser** → `POST /api/submit-brief` with form data
3. **Serverless Function** → Validates again with Zod
4. **Vercel Blob** → Stores as `briefs/{uuid}.json`
5. **Vercel Blob** → Updates `stats.json` (increments submitted count)
6. **Browser** → Sends email via EmailJS
7. **Browser** → Redirects to thank you page

### What happens when dashboard loads:

1. **Browser** → User enters PIN
2. **Browser** → `GET /api/get-briefs?pin={PIN}`
3. **Serverless Function** → Validates PIN against `DASHBOARD_PIN_SECRET`
4. **Vercel Blob** → Lists all `briefs/*.json` files
5. **Vercel Blob** → Reads each brief file and parses JSON
6. **Browser** → Displays all briefs sorted by date

---

## 📈 Monitoring & Maintenance

### Check storage usage:
Vercel Dashboard → Storage → Blob Storage

### Monitor function invocations:
```bash
vercel analytics --prod
```

### Export/Backup data:
Consider implementing a monthly export endpoint for data safety (future enhancement).

---

## 🚀 What's Working Now

✅ Form submissions persist to cloud (not just local browser)
✅ Dashboard fetches data cross-device/browser
✅ Email notifications still sent via EmailJS
✅ PIN authentication for dashboard access
✅ Stats tracking (started, submitted, abandoned)
✅ Delete functionality from dashboard
✅ Auto-scaling with Vercel serverless
✅ No database cost (Blob Storage included in plan)

---

## 📝 Summary

**Before**: Data saved only to user's browser (localStorage)
- ❌ Agency couldn't see submissions from different browser
- ❌ Data lost if browser cleared

**After**: Data saved to Vercel Blob (cloud)
- ✅ Agency sees all submissions on any device
- ✅ Data persists indefinitely in cloud storage
- ✅ Email notifications still work
- ✅ Cross-device synchronization

---

## Support

For issues or questions:
1. Check `IMPLEMENTATION.md` for technical details
2. Check Vercel logs: `vercel logs --prod --tail`
3. Verify environment variables are set correctly
4. Ensure PIN matches between client and server
