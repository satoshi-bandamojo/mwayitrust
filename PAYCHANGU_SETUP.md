# Paychangu Integration Setup Guide

## ✅ Completed Setup (Fixed)

You now have a complete Paychangu donation checkout flow using the **Standard Checkout API**. Here's what's been set up:

### What Was Fixed
The original integration was trying to pass query parameters directly to the checkout page, which caused the 422 error. The corrected flow now:
1. **POSTs to Paychangu API** (`/payment` endpoint) with proper authorization
2. **Receives a checkout URL** in the response
3. **Redirects user to that URL** for secure payment processing

### 1. **Supabase Edge Function Secrets**
```
PAYCHANGU_SECRET_KEY=your-paychangu-secret-key
PAYCHANGU_WEB_SECRET=your-paychangu-webhook-secret
APP_URL=https://your-production-domain.example
```

Configure these values as Supabase Edge Function secrets. Do not use a `VITE_` prefix or place them in the frontend `.env` file.

### 2. **New Files Created**

#### `src/services/paychangu.ts`
- Parses the PayChangu return parameters for display only

#### `src/pages/DonationCallback.tsx`
- Handles the post-payment redirect from PayChangu
- Reads the status written by the signed webhook
- Never updates payment status from browser parameters

### 3. **Updated Files**

#### `src/router.tsx`
- Added new route: `/donation-callback`
- Lazy-loaded `DonationCallback` component

#### `src/pages/Donate.tsx`
- Calls Paychangu API to initiate payment
- Redirects to returned checkout URL
- Proper error handling

#### `src/index.css`
- Added comprehensive callback page styling
- Animations for loading, success, and error states
- Responsive design for mobile

## 🔄 How It Works (Fixed Flow)

### Donation Flow

1. **User Initiates Donation** (`/donate`)
   - User selects donation tier or enters custom amount
   - Provides name, email, phone (optional)
   - Clicks "Donate"

2. **Donation Saved to Supabase**
   - Transaction created with status: `pending`
   - Transaction reference: `MT-{timestamp}-{random}`
   - Data stored: name, email, phone, amount, donation type

3. **API Call to Paychangu**
   - Frontend calls `/payment` endpoint with:
     - `secret_key` in Authorization header
     - Amount, currency, email, tx_ref, callback_url, return_url
   - Response includes `checkout_url`

4. **Redirect to Paychangu Checkout**
   - User redirected to unique checkout URL
   - User completes payment on Paychangu

5. **Payment Callback**
   - Paychangu redirects to `/donation-callback?tx_ref=...&status=success`
   - Callback page retrieves donation using `tx_ref`
   - The signed webhook verifies and updates the donation
   - The callback shows success only when the stored status is `completed`

6. **Confirmation**
   - Success: Shows donation amount, reference, email confirmation
   - Error: Shows error message, option to retry or contact support

## 📋 Database Schema Required

Ensure your Supabase `donations` table has these columns:

```sql
CREATE TABLE donations (
  id UUID PRIMARY KEY,
  donor_name TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  amount NUMERIC NOT NULL,
  currency TEXT DEFAULT 'MWK',
  payment_reference TEXT UNIQUE NOT NULL,
  purpose TEXT,
  donation_type TEXT,
  status TEXT DEFAULT 'pending', -- pending, completed, failed, cancelled
  payment_metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## 🧪 Testing the Integration

### Test Mode
Use PayChangu test credentials only as Supabase Edge Function secrets. Do not commit credentials to this repository.

### Local Testing Steps

1. **Start development server**
   ```bash
   npm run dev
   ```

2. **Go to donation page**
   ```
   http://localhost:5173/donate
   ```

3. **Fill form and submit**
   - Choose a donation tier
   - Enter test email (e.g., test@example.com)
   - For mobile money, use a test phone number
   - Click "Donate"

4. **Complete Paychangu flow**
   - You should be redirected to the Paychangu checkout page
   - The page should load successfully (no 422 error)
   - Use test payment methods provided by Paychangu
   - Complete or cancel the transaction

5. **Verify callback**
   - Should redirect to `/donation-callback?tx_ref=...&status=success/failed`
   - Database should update with payment status
   - Success page should display donation details

## ✅ What Changed From Previous Setup

| Issue | Old Approach | New Approach |
|-------|--------------|--------------|
| Payment Link | Query params to checkout page | API POST to `/payment` endpoint |
| Authorization | None (public key) | Bearer token (secret key) |
| Response | Direct URL | `checkout_url` from API response |
| Error | 422 Unprocessable Content | Proper checkout page loads |
| Callback Params | `reference` | `tx_ref`, `status`, `transaction_id` |

## 🚀 Going to Production

### Supabase CLI Deployment

Authenticate the CLI before linking or deploying:

```powershell
supabase login
supabase link --project-ref ghbjhzkalqtdnizwoeyt
```

When prompted by `supabase login`, use a Supabase personal access token from the Supabase dashboard. Enter it directly in the terminal and do not commit it or share it in chat.

Configure the server-only secrets:

```powershell
supabase secrets set PAYCHANGU_SECRET_KEY="your-paychangu-secret-key" PAYCHANGU_WEB_SECRET="your-paychangu-webhook-secret" APP_URL="https://mwayitrust.netlify.app"
```

Deploy both functions:

```powershell
supabase functions deploy create-donation
supabase functions deploy paychangu-webhook --no-verify-jwt
```

The webhook uses `--no-verify-jwt` because PayChangu authenticates the request with its webhook signature, not a Supabase user JWT. Configure PayChangu to send webhooks to:

```text
https://ghbjhzkalqtdnizwoeyt.supabase.co/functions/v1/paychangu-webhook
```

When ready for production:

1. **Update Supabase Edge Function secrets**
   ```env
   PAYCHANGU_SECRET_KEY=your-production-secret-key
   PAYCHANGU_WEB_SECRET=your-production-webhook-secret
   APP_URL=https://your-production-domain.example
   ```

2. **Test in Production**
   - Use Paychangu's production test mode first
   - Then live transactions with real payment methods

## 📊 Monitoring Payments

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
  "paychangu_tx_ref": "ae041eae-6abd-4602-a949-56fbd65c29fe",
  "paychangu_transaction_id": "TXN123456",
  "verified_at": "2024-08-17T10:30:00.000Z"
}
```

## 🛠️ Troubleshooting

### Issue: Still getting 422 error
- **Solution**: Clear browser cache and retry
- **Check**: Ensure `PAYCHANGU_SECRET_KEY` is configured in Supabase Edge Functions
- **Check**: Network tab shows POST to `https://api.paychangu.com/payment`

### Issue: Checkout page doesn't load after redirect
- **Check**: Is the checkout URL being returned from API?
- **Check**: Browser console for any redirect errors
- **Solution**: Verify response in Network tab shows `checkout_url`

### Issue: Callback page shows "Donation record not found"
- **Check**: Is `tx_ref` being passed in callback URL?
- **Check**: Does donation exist in Supabase with matching `payment_reference`?
- **Solution**: Check Network tab in browser dev tools for callback URL parameters

### Issue: Payment status not updating in Supabase
- **Check**: Are Supabase credentials valid?
- **Check**: Is the signed webhook reaching `paychangu-webhook`?
- **Solution**: Check Supabase function logs and confirm `PAYCHANGU_WEB_SECRET` matches PayChangu

## 📞 Support

- Paychangu Docs: https://developer.paychangu.com/docs
- Paychangu Support: support@paychangu.com
- Supabase Docs: https://supabase.com/docs

---

**Next Steps:**
1. Test the integration locally (should now work properly)
2. Monitor Supabase for donations
3. Configure production credentials when ready
