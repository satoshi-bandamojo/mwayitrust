# 🔧 Paychangu Integration Fix - Session 2

## The Problem
The integration was failing with a **422 Unprocessable Content** error and showing "Payment Session Expired" message.

### Root Cause
The original approach was trying to pass query parameters directly to the checkout page:
```
https://checkout.paychangu.com/pay/?amount=100&currency=MWK&reference=...
```

This doesn't work because Paychangu requires:
1. A **server-side API call** to `/payment` endpoint
2. Authorization with the **secret key**
3. A unique checkout session to be created first

## The Solution
Implemented Paychangu's **Standard Checkout** API flow:

### Before (❌ Broken)
```
Donate Form → Generate URL with query params → Redirect to checkout page → 422 Error
```

### After (✅ Fixed)
```
Donate Form → POST to /payment API → Receive checkout_url → Redirect → Success
```

## What Changed

### 1. `src/services/paychangu.ts` (Rewritten)
- **OLD**: `generateCheckoutUrl()` - Just built a URL with query params
- **NEW**: `initiatePaychanguPayment()` - Makes proper API call to Paychangu

```typescript
// NEW API Call
const response = await fetch('https://api.paychangu.com/payment', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${secretKey}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    amount, currency, email, tx_ref, 
    callback_url, return_url, ...
  }),
})

// Returns checkout_url from response
return { checkoutUrl: data.data.checkout_url, txRef: data.data.data.tx_ref }
```

### 2. `src/pages/Donate.tsx` (Updated)
```typescript
// OLD
const checkoutUrl = generateCheckoutUrl({ ... })
window.location.href = checkoutUrl

// NEW
const { checkoutUrl } = await initiatePaychanguPayment({
  amount, currency, email,
  tx_ref: reference,  // ← Renamed from 'reference'
  callback_url: `...donation-callback`,
  return_url: `...donate`,
})
window.location.href = checkoutUrl
```

### 3. `src/pages/DonationCallback.tsx` (Updated)
```typescript
// OLD
const params = extractPaymentCallbackParams()
if (!params.reference) { ... }

// NEW
const params = extractPaymentCallbackParams()
if (!params.tx_ref) { ... }  // ← Changed param name

// Update metadata
paychangu_status: params.status,
paychangu_tx_ref: params.tx_ref,        // ← New
paychangu_transaction_id: params.transaction_id  // ← New
```

## API Parameters

### What Paychangu Returns
```json
{
  "status": "success",
  "data": {
    "checkout_url": "https://checkout.paychangu.com/923677185321",
    "data": {
      "tx_ref": "ae041eae-6abd-4602-a949-56fbd65c29fe"
    }
  }
}
```

### Callback Parameters (After Payment)
```
/donation-callback?tx_ref=ae041eae-6abd-4602-a949-56fbd65c29fe&status=success&transaction_id=TXN123456
```

## Testing Now

1. ✅ Donation form → Submit
2. ✅ API call to Paychangu → Checkout URL received
3. ✅ Redirect to checkout page → Should load successfully (no 422)
4. ✅ Complete/cancel payment → Redirect to callback
5. ✅ Callback verifies and updates Supabase

## Files Modified
- `src/services/paychangu.ts` - Rewritten
- `src/pages/Donate.tsx` - Updated API call
- `src/pages/DonationCallback.tsx` - Updated param names
- `PAYCHANGU_SETUP.md` - Updated documentation
- `.env` - No changes needed (secret key already there)

## Status
✅ **All TypeScript errors cleared**
✅ **Integration should now work properly**
✅ **No 422 errors expected**

---

**Ready to test!** The integration should now properly redirect to Paychangu's checkout page.
