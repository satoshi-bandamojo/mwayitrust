# 🎯 Paychangu Integration - Quick Reference

## Supabase Edge Function Secrets
Configure `PAYCHANGU_SECRET_KEY`, `PAYCHANGU_WEB_SECRET`, and `APP_URL` in Supabase. Do not put PayChangu secrets in the frontend environment or commit them to this repository.

## File Structure
```
src/
├── services/
│   ├── paychangu.ts          ← Payment verification & checkout
│   └── donations.ts          ← Supabase donation service (updated)
├── pages/
│   ├── Donate.tsx            ← Donation form (updated)
│   └── DonationCallback.tsx   ← Payment result handler (NEW)
├── router.tsx                ← Routes (updated with /donation-callback)
└── index.css                 ← Styles (added callback page styling)

.env                          ← Paychangu credentials (updated)
PAYCHANGU_SETUP.md           ← Full setup documentation (NEW)
```

## Key Functions

### `src/services/paychangu.ts`
- `extractPaymentCallbackParams()` - Parse callback query params for display only

### `src/services/donations.ts`
- `createDonation(payload)` - Save donation to Supabase
- `getDonationByReference(reference)` - Fetch donation record

## Payment States

| State | Status | Action |
|-------|--------|--------|
| Pending | User fills form | Save to DB, redirect to Paychangu |
| Processing | User completes payment | Wait for signed webhook update |
| Success | Webhook confirms payment | Show success page |
| Failed | Webhook reports failure | Show error page |
| Cancelled | Webhook reports cancellation | Show cancel page |

## Testing Checklist

- [ ] Start dev server: `npm run dev`
- [ ] Navigate to `/donate`
- [ ] Fill donation form
- [ ] Submit donation
- [ ] Redirects to Paychangu checkout
- [ ] Complete/cancel payment
- [ ] Redirects to `/donation-callback`
- [ ] Check donation status in Supabase
- [ ] Verify success/error page displays correctly

## Paychangu Admin Tasks

⚠️ **Still Need To Do:**
- [ ] Add IP address restrictions (optional) - go to API & Webhook > IP Restrictions
- [ ] Set up webhook at `https://ghbjhzkalqtdnizwoeyt.supabase.co/functions/v1/paychangu-webhook`
- [ ] Create "Connect" app if using advanced features

## Common Tasks

### Check Donation Status
1. Go to Supabase dashboard
2. Open `donations` table
3. Look for `payment_reference` like `MT-1723900000000-ABC1`
4. Check `status` column: `pending`, `completed`, `failed`, or `cancelled`

### View Payment Metadata
In Supabase, check `payment_metadata` column (JSONB):
```json
{
  "paychangu_status": "success",
  "paychangu_reference": "TX12345",
  "verified_at": "2024-08-17T10:30:00.000Z"
}
```

### Debug Callback Issues
1. Check browser console for errors
2. Check Network tab for callback URL with params
3. Verify donation exists in Supabase with correct reference
4. Check Supabase logs for update errors

## Next Steps

1. **Test locally** - Complete a test donation end-to-end
2. **Monitor** - Watch Supabase for donations and payment updates
3. **Production** - Update credentials when Paychangu switches to live
4. **Email** - Optional: Add confirmation emails using a service like Resend

---

📖 Full documentation: See `PAYCHANGU_SETUP.md`
