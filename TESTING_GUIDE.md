# Testing & Verification Guide

## Local Testing (Before Deployment)

### Prerequisites
- Node.js v18+
- npm packages installed: `npm install`
- Vercel CLI: `npm install -g vercel`

### Step 1: Start Local Development Server
```bash
vercel dev
```

Watch for output:
```
> Ready! Available at http://localhost:3000
> Ready! Available at http://localhost:3001  
```

### Step 2: Test Form Submission

**URL**: `http://localhost:3000/brief`

1. Fill form completely:
   - Step 1: Business Info (select business type, existing site)
   - Step 2: Purpose (select at least one purpose)
   - Step 3: Pages (select pages needed)
   - Step 4: Features (select features)
   - Step 5: Design (select brand status and style)
   - Step 6: Timeline & Budget (select timeline and budget)
   - Step 7: Details (fill name, email, phone)

2. Click "Submit Brief"

3. **Expected Result**:
   - See "Thank you" page
   - Browser console shows: `✓ Brief submitted successfully: [uuid]`
   - Email **may not send** locally (EmailJS requires production credentials)

### Step 3: Test Dashboard Data Retrieval

**URL**: `http://localhost:3000/dashboard`

1. Enter PIN: `1234` (default from VITE_DASHBOARD_PIN)

2. **Expected Result**:
   - Dashboard authenticates
   - Shows submitted brief in list
   - Stats show: Started=1, Submitted=1, Abandoned=0
   - Click brief to see full details

### Step 4: Verify Data Persistence

1. In another browser tab, open: `http://localhost:3000/dashboard`
2. Enter same PIN
3. **Expected Result**: Same brief appears (data persists across sessions)

### Step 5: Delete Brief

1. On Dashboard, click trash icon on brief
2. Confirm deletion dialog
3. **Expected Result**: Brief removed from list, stats updated

---

## Production Deployment Testing

### Prerequisites
- Vercel account with project linked
- `DASHBOARD_PIN_SECRET` environment variable set to your PIN

### Step 1: Deploy to Production
```bash
vercel --prod
```

Wait for deployment to complete.

### Step 2: Cross-Device Test (Critical!)

**Device A (Phone/Tablet)**:
1. Open: `https://your-domain.vercel.app/brief`
2. Fill and submit form completely
3. Verify success page
4. Close browser

**Device B (Desktop or Different Browser)**:
1. Open: `https://your-domain.vercel.app/dashboard`
2. Enter PIN
3. **MUST SEE** the brief submitted from Device A ✅

*This proves cross-device persistence is working!*

### Step 3: Verify Email Notifications

1. Submit another form with valid email
2. Check inbox within 30 seconds
3. **Expected**: Email from "Brief Inquiries" with submission details

### Step 4: Test Dashboard Features

- [ ] PIN authentication works
- [ ] Brief list displays sorted by date (newest first)
- [ ] Search by client name/company works
- [ ] Click brief shows full details
- [ ] Delete removes brief and updates list
- [ ] Stats display correctly

---

## Troubleshooting Test Failures

### Issue: Form submission shows 400 error
**Cause**: Zod validation failed
**Debug**: 
- Check browser console for validation error details
- Ensure all required fields are filled
- Verify data types (dates, numbers, etc.)

**Solution**: Fill all form fields, matching expected types

### Issue: Dashboard shows "Unauthorized: Invalid PIN"
**Cause**: PIN mismatch between client and server
**Debug**:
- Client PIN: Check `src/.env` for `VITE_DASHBOARD_PIN`
- Server PIN: Check Vercel dashboard for `DASHBOARD_PIN_SECRET`
- Must be identical!

**Solution**: Set both PINs to same value

### Issue: Dashboard shows no briefs after form submission
**Cause**: Data not persisting to Blob Storage
**Debug**:
- Check Vercel logs: `vercel logs --prod --tail`
- Look for "Brief saved" or "Brief submitted" messages
- Check if blob storage token is configured

**Solution**: Verify `DASHBOARD_PIN_SECRET` is set in Vercel

### Issue: Email not received
**Cause**: EmailJS credentials missing or wrong
**Debug**:
- Check browser console: "EmailJS environment variables are missing"
- Verify `VITE_EMAILJS_*` vars are set
- Check EmailJS dashboard for service/template IDs

**Solution**: Set EmailJS environment variables

### Issue: API returns 404
**Cause**: Vercel didn't recognize serverless functions
**Debug**:
- Verify `vercel.json` has `/api` rewrite
- Check `api/` directory exists with .ts files
- Use `vercel logs` to see what routes exist

**Solution**: Redeploy with correct `vercel.json`

---

## Automated Test Scenarios

### Scenario 1: Happy Path (User Success)
```
1. Form submission succeeds ✓
2. Email sent ✓
3. Dashboard shows data ✓
4. Cross-device visibility works ✓
5. Delete removes brief ✓
Expected: All operations succeed
```

### Scenario 2: PIN Security
```
1. Test wrong PIN → "Unauthorized" ✓
2. Test correct PIN → data loads ✓
3. Test PIN from different device → works ✓
Expected: PIN authentication prevents unauthorized access
```

### Scenario 3: Data Integrity
```
1. Submit form with specific data
2. Wait 5 seconds
3. Clear browser cache
4. Reload dashboard
5. Verify same data appears
Expected: Data survives cache clears
```

### Scenario 4: Stats Tracking
```
1. Visit form page → stats.started should increment
2. Submit form → stats.submitted should increment
3. Don't submit → stats.abandoned should show started - submitted
Expected: Stats accurately reflect form state
```

### Scenario 5: API Error Handling
```
1. Submit incomplete form → 400 error with details
2. Use wrong PIN → 401 error
3. Delete non-existent brief → handles gracefully
Expected: Proper error messages for all failures
```

---

## Browser Console Checklist

When testing, look for these messages:

**Good signs** ✅:
```
✓ Brief submitted successfully: [uuid]
✓ Email notification sent
Form start recorded
Dashboard data loaded
Brief deleted successfully
```

**Warning signs** ⚠️:
```
Error loading dashboard data
Failed to delete brief
Unauthorized
Invalid PIN
```

**Don't worry about**:
```
⚠ Email failed but brief was saved (acceptable - brief still persisted)
```

---

## Vercel Logs

Check production logs for errors:
```bash
vercel logs --prod --tail
```

Look for:
- API request counts
- Error stack traces
- Performance metrics

---

## Performance Expectations

- Form submission: < 2 seconds
- Dashboard load: < 2 seconds  
- Brief list display: < 500ms (local rendering)
- Delete operation: < 1 second
- Email send: 5-30 seconds (external service)

---

## Data Validation Testing

### Form Data Validation (Client + Server)
- [ ] Empty fields rejected on client
- [ ] Invalid emails caught by server
- [ ] Required fields enforced
- [ ] Schema mismatch causes 400 error

### Stats Calculation
- [ ] started count increments on each form visit
- [ ] submitted count increments on successful submission
- [ ] abandoned = started - submitted (calculated)
- [ ] Stats persist across sessions

---

## Security Testing

- [ ] PIN required for dashboard access
- [ ] PIN required for delete operations
- [ ] Wrong PIN rejected with 401
- [ ] No SQL injection possible (JSON storage)
- [ ] Briefs not visible without PIN
- [ ] Stats not accessible without PIN

---

## Final Sign-Off Checklist

Before declaring implementation complete:

- [ ] Form submission succeeds
- [ ] Email notification sent
- [ ] Dashboard shows submitted brief
- [ ] Cross-device visibility works
- [ ] Delete functionality works
- [ ] Stats update correctly
- [ ] PIN authentication works
- [ ] Error handling works
- [ ] Build passes without errors
- [ ] No TypeScript errors
- [ ] Vercel logs show healthy function invocations
- [ ] Data persists across sessions
- [ ] Performance is acceptable

---

## Support

If tests fail:
1. Check `DEPLOYMENT_GUIDE.md` troubleshooting section
2. Review Vercel logs: `vercel logs --prod --tail`
3. Check browser console for specific error messages
4. Verify all environment variables are set
5. Ensure PIN matches between client and server
