# Backstone Lender Router — Setup Guide

This service receives applications from your website, routes them to the right lender, and creates a Gmail draft so you can review and hit Send.

---

## How it works

```
apply.backstonecapital.net  →  POST /api/apply  →  Router  →  Gmail Draft
        (your existing site, unchanged)                 ↑
                                              config/lenders.json
```

---

## Step 1 — Add your lender requirements

Open `config/lenders.json` and fill in your actual lenders:

```json
{
  "id": "lender_a",
  "name": "Rapid Finance",
  "contact_email": "broker@rapidfinance.com",
  "contact_name": "Broker Relations",
  "criteria": {
    "monthly_revenue_min": 15000,
    "time_in_business_months_min": 12,
    "credit_score_min": 500,
    "loan_amount_min": 10000,
    "loan_amount_max": 500000,
    "industries_blocked": ["gambling"],
    "states_blocked": []
  }
}
```

**Criteria fields** (all optional — omit or set `null` to skip that check):
| Field | Description |
|-------|-------------|
| `monthly_revenue_min/max` | Monthly gross revenue in dollars |
| `time_in_business_months_min` | Minimum months in business |
| `credit_score_min/max` | Owner FICO score |
| `loan_amount_min/max` | Requested funding amount |
| `industries_allowed` | Whitelist — only route these industries (empty = allow all) |
| `industries_blocked` | Blacklist — never route these industries |
| `states_allowed` | Whitelist states (empty = allow all) |
| `states_blocked` | Blacklist states |

Lenders are tried **in order** — first match wins. Put your best/preferred lender first.

---

## Step 2 — Set up Gmail

1. Go to [https://console.cloud.google.com/](https://console.cloud.google.com/)
2. Create a project → Enable **Gmail API**
3. Credentials → Create OAuth 2.0 Client ID → **Desktop app**
4. Download the JSON → save as `config/gmail-credentials.json`
5. Run: `npm run setup-gmail`
6. Follow the browser prompt, paste the code back

This saves `config/gmail-token.json` — the server uses it forever (auto-refreshes).

---

## Step 3 — Configure environment

```bash
cp .env.example .env
# Edit .env — set WEBHOOK_SECRET to a random string
```

---

## Step 4 — Install & start

```bash
npm install
npm start
```

The server listens on `http://localhost:3000`.

For production, deploy to **Railway**, **Render**, or **Fly.io** (all free tiers available).

---

## Step 5 — Point your website at the webhook

### If your form tool is Typeform, Jotform, Fillout, or similar:
1. Go to form settings → Integrations → Webhooks
2. Add webhook URL: `https://your-server.railway.app/api/apply`
3. Add header: `X-Webhook-Secret: <your WEBHOOK_SECRET>`

### If your site uses a custom form (HTML/JS):
Add this to your form submission handler:
```javascript
fetch('https://your-server.railway.app/api/apply', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Webhook-Secret': 'your-secret'
  },
  body: JSON.stringify({
    business_name: formData.get('business_name'),
    owner_name: formData.get('owner_name'),
    owner_email: formData.get('owner_email'),
    owner_phone: formData.get('owner_phone'),
    monthly_revenue: formData.get('monthly_revenue'),
    time_in_business_months: formData.get('time_in_business_months'),
    credit_score: formData.get('credit_score'),
    loan_amount_requested: formData.get('loan_amount_requested'),
    industry: formData.get('industry'),
    state: formData.get('state'),
    use_of_funds: formData.get('use_of_funds'),
  })
});
```

---

## Application fields the webhook accepts

| Field | Required | Description |
|-------|----------|-------------|
| `business_name` | Yes | Business legal name |
| `owner_name` | Yes | Applicant full name |
| `owner_email` | Yes | Applicant email |
| `owner_phone` | No | Applicant phone |
| `monthly_revenue` | Yes | Monthly gross revenue ($) |
| `time_in_business_months` | Yes | Months in business (e.g. 24) |
| `credit_score` | No | Owner FICO score |
| `loan_amount_requested` | Yes | Requested amount ($) |
| `industry` | No | Business industry/type |
| `state` | No | State abbreviation (e.g. NY) |
| `use_of_funds` | No | What the money is for |
| `additional_notes` | No | Any extra context |

---

## What you see in Gmail

Every application creates a **draft** in your Gmail inbox:
- **To:** the matched lender's email
- **Subject:** `MCA Application – [Business Name] – $[Amount]`
- **Body:** fully formatted with all application details

You just open Gmail, find the draft, review it, and hit **Send**.

---

## No lender matched?

If an application doesn't match any lender's criteria, the server logs a warning and returns `status: "no_match"`. Check your `lenders.json` — the criteria might be too strict, or you may need to add a catch-all fallback lender with loose criteria at the bottom of the list.
