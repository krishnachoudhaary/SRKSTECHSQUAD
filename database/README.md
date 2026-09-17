# EventHub
"Plan Smart. Spend Smart. Celebrate Better."

EventHub is an all-in-one event planning, vendor discovery, comparison, and booking platform engineered specifically for Tier-2 and Tier-3 cities in India (Patna, Gaya, Muzaffarpur, Bhagalpur, Begusarai, Nalanda, Sheikhpura).

## The Core Idea & Differentiator
Traditional event directories merely list vendor contact numbers and leave users to guess prices, handle fragmentation, and blindly juggle budgets.

"EventHub doesn't just help users FIND vendors — it helps them PLAN their entire event within their budget."

## EventHub Database Guide

This directory contains the SQL scripts to initialize and seed the **EventHub** relational database.

## Files

- `schema.sql`: Contains the complete relational schema with 10 tables (`users`, `vendors`, `venues`, `vendor_services`, `events`, `event_vendors`, `bookings`, `payments`, `refunds`, and `reviews`).
- `seed.sql`: Realistic seed dataset featuring 16+ Tier-2 and Tier-3 vendors across Bihar (Patna, Gaya, Muzaffarpur, Bhagalpur, Begusarai, Nalanda, Sheikhpura) and demo accounts.

## Quick Setup (MySQL CLI)

```bash
mysql -u root -p < database/schema.sql
mysql -u root -p < database/seed.sql
```

## Demo Accounts (seed data)

| Email               | Role     | Password     |
|---------------------|----------|--------------|
| demo@eventhub.com   | CUSTOMER | Password123! |
| vendor@eventhub.com | VENDOR   | Password123! |
| admin@eventhub.com  | ADMIN    | Password123! |

## Business Rules (from `.env.example`)

- `COMMISSION_RATE` = 0.10 (platform commission per booking)
- `ADVANCE_PAYMENT_RATE` = 0.20 (20% advance at booking)
- `PLATFORM_CANCELLATION_FEE` = 2000.00 (deducted on cancellation)
