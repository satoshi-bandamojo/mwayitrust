# 🎯 Paychangu Integration - Quick Reference

## Your Credentials
```
Public Key:    pub-test-sJIin0K5j0Upqw8gIG3DnzsZte2yGSVT
Secret Key:    sec-test-nga8ehPdx9Oc8I6YC0O3W6kcOB3M7A8W
Checkout URL:  https://checkout.paychangu.com/pay/
```

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
- `generateCheckoutUrl(params)` - Create Paychangu checkout link
- `extractPaymentCallbackParams()` - Parse callback query params
- `isPaymentSuccessful(status)` - Check if payment succeeded
- `formatCurrency(amount, currency)` - Format money display

### `src/services/donations.ts`
- `createDonation(payload)` - Save donation to Supabase
- `updateDonationStatus(reference, status, metadata)` - Update after payment
- `getDonationByReference(reference)` - Fetch donation record

## Payment States

| State | Status | Action |
|-------|--------|--------|
| Pending | User fills form | Save to DB, redirect to Paychangu |
| Processing | User completes payment | Verify callback, update status |
| Success | Payment confirmed | Update to `completed`, show success page |
| Failed | Payment declined | Update to `failed`, show error page |
| Cancelled | User cancelled | Update to `cancelled`, show cancel page |

## Environment Variables

```env
# Already configured in .env:
VITE_PAYCHANGU_PUBLIC_KEY=pub-test-...
VITE_PAYCHANGU_SECRET_KEY=sec-test-...
VITE_PAYCHANGU_CHECKOUT_URL=https://checkout.paychangu.com/pay/
```

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

✅ **Already Done:**
- Generated API credentials (in .env)

⚠️ **Still Need To Do:**
- [ ] Add IP address restrictions (optional) - go to API & Webhook > IP Restrictions
- [ ] Set up webhook (optional for future) - API & Webhook > Setup Webhook
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
