# Payments Platform Frontend — MVP Requirements Document

## Project Goal

Build a merchant dashboard frontend for the payments platform backend.

The dashboard should allow merchants to:

* authenticate
* manage payments
* monitor payment statuses
* configure webhooks
* manage refunds
* view wallet balance
* inspect ledger history

This frontend is intended to behave similarly to a simplified Stripe Dashboard.

---

# Tech Stack Requirements

## Framework

* Next.js (App Router)
* TypeScript

---

## Styling

* TailwindCSS

---

## State/Data Fetching

* React Query (TanStack Query)

---

## HTTP Client

* Axios

---

## Authentication

* JWT-based auth
* JWT stored securely in browser storage

---

# Application Layout Requirements

---

# Global Layout

Dashboard layout with:

## Sidebar Navigation

Required menu items:

* Dashboard
* Payments
* Wallet
* Ledger
* Refunds
* Webhooks
* API Keys
* Logout

---

## Top Navbar

Display:

* merchant business name
* logout button

---

# Authentication Requirements

---

# 1. Login Page

## Route

```text id="a1b2c3"
/login
```

---

## Fields

| field    |
| -------- |
| email    |
| password |

---

## Behavior

On success:

* save JWT
* redirect to dashboard

---

## Validation

* required fields
* invalid credentials handling

---

# 2. Protected Routes

All dashboard routes require authentication.

Unauthenticated users should redirect to:

```text id="d4e5f6"
/login
```

---

# Dashboard Requirements

---

# 3. Dashboard Overview Page

## Route

```text id="g7h8i9"
/dashboard
```

---

## Display Cards

### Wallet Summary

* available balance
* pending balance

---

### Payment Metrics

* total payments
* successful payments
* failed payments
* processing payments

---

### Refund Metrics

* total refunds
* successful refunds

---

## Charts (Optional MVP)

Simple:

* payment volume over time
* payment status distribution

---

# Payments Module

---

# 4. Payments Listing Page

## Route

```text id="j0k1l2"
/payments
```

---

## Table Columns

| column     |
| ---------- |
| payment id |
| order id   |
| amount     |
| currency   |
| status     |
| created_at |

---

## Features

### Pagination

Required.

---

### Filtering

Support:

* status
* currency

---

### Search

Support:

* payment id
* order id

---

## Row Click

Opens payment detail page.

---

# 5. Payment Details Page

## Route

```text id="m3n4o5"
/payments/[id]
```

---

## Sections

### Payment Information

Display:

* payment id
* order id
* amount
* currency
* status
* created_at

---

### Webhook History

Display webhook delivery attempts.

---

### Refund History

Display refunds related to payment.

---

### Ledger Impact

Display ledger entries associated with payment.

---

## Actions

### Confirm Payment

Only if payment status is:

```text id="p6q7r8"
CREATED
```

---

### Create Refund

Only if payment status is:

```text id="s9t0u1"
SUCCESS
```

---

# Payment Creation Requirements

---

# 6. Create Payment Page

## Route

```text id="v2w3x4"
/payments/create
```

---

## Form Fields

| field    |
| -------- |
| amount   |
| currency |
| order_id |

---

## Behavior

On submit:

* create payment intent
* show created payment id
* redirect to payment details

---

# Wallet Module

---

# 7. Wallet Page

## Route

```text id="y5z6a7"
/wallet
```

---

## Display

### Available Balance

---

### Pending Balance

---

### Currency

---

## Recent Transactions

Display recent ledger entries.

---

# Ledger Module

---

# 8. Ledger Page

## Route

```text id="b8c9d0"
/ledger
```

---

## Table Columns

| column      |
| ----------- |
| entry id    |
| type        |
| amount      |
| currency    |
| description |
| created_at  |

---

## Filters

Support:

* entry type
* date range

---

# Refund Module

---

# 9. Refunds Listing Page

## Route

```text id="e1f2g3"
/refunds
```

---

## Table Columns

| column     |
| ---------- |
| refund id  |
| payment id |
| amount     |
| status     |
| reason     |
| created_at |

---

## Filters

Support:

* status
* payment id

---

# 10. Refund Creation Modal/Page

## Fields

| field         |
| ------------- |
| payment id    |
| refund amount |
| reason        |

---

## Validation

* amount > 0
* amount <= refundable amount

---

# Webhook Module

---

# 11. Webhook Configuration Page

## Route

```text id="h4i5j6"
/webhooks
```

---

## Display

| field          |
| -------------- |
| webhook url    |
| webhook secret |

---

## Features

### Update Webhook URL

---

### Copy Webhook Secret

---

# API Key Module

---

# 12. API Keys Page

## Route

```text id="k7l8m9"
/api-keys
```

---

## Display

* current API key

---

## Actions

### Regenerate API Key

(Optional MVP)

---

# UX Requirements

---

# 13. Loading States

Every async action should have:

* loading spinner
* disabled buttons

---

# 14. Error Handling

Show proper:

* API errors
* network errors
* validation errors

---

# 15. Toast Notifications

Required for:

* payment creation
* refund creation
* login success/failure
* webhook updates

---

# 16. Status Badges

Use colored badges:

| status     | badge  |
| ---------- | ------ |
| SUCCESS    | green  |
| FAILED     | red    |
| PROCESSING | yellow |
| CREATED    | blue   |

---

# API Integration Requirements

---

# 17. Centralized API Client

Create reusable Axios client.

Features:

* JWT injection
* error handling
* base URL config

---

# 18. Environment Variables

Support:

```text id="n0o1p2"
NEXT_PUBLIC_API_BASE_URL
```

---

# Security Requirements

---

# 19. JWT Handling

Attach JWT automatically to protected API requests.

---

# 20. Logout

Logout should:

* clear auth state
* remove token
* redirect login

---

# Design Requirements

---

# 21. UI Style

Target style:

```text id="q3r4s5"
modern fintech dashboard
```

Minimal and clean.

---

# 22. Responsive Design

Must work on:

* desktop
* tablet

Mobile optional for MVP.

---

# Suggested Folder Structure

```text id="t6u7v8"
src/
 ├── app/
 ├── components/
 ├── services/
 ├── hooks/
 ├── types/
 ├── lib/
 ├── providers/
 └── styles/
```

---

# Non-Goals (Not Required For MVP)

Do NOT implement yet:

* customer checkout UI
* settlement dashboard
* fraud systems
* role-based access
* multi-user merchants
* realtime websocket updates
* advanced analytics

---

# MVP Success Criteria

Frontend MVP is complete when merchant can:

✅ login/logout
✅ create/view payments
✅ confirm payments
✅ issue refunds
✅ view wallet balances
✅ inspect ledger history
✅ configure webhooks
✅ navigate entire dashboard cleanly
✅ interact with backend successfully
