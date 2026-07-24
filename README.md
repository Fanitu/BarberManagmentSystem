# Barber Management System — Worker + Admin (merged)

One React + Vite app, one repo, role-based rendering. Replaces the
separate `worker-frontend` and `admin-frontend` apps.

## Setup

```bash
cp .env.example .env    # point VITE_API_BASE_URL at your backend
npm install
npm run dev
```

## How the merge works

- **One login form.** `POST /api/auth/login` takes `{ name, password,
  barberCode }` with no role field — the backend checks Admin accounts
  first, then Worker accounts (auto-creating a worker on first login
  with a valid code, same as before), and returns `user.role` as
  `"worker"` or `"admin"`.
- **`AuthContext`** stores that role alongside the token/user/barberShop
  and exposes it as `role`.
- **`Header`** shows "Admin Panel" when `role === "admin"`, otherwise
  "Barber Management System".
- **`NavBar`** renders the Worker tabs (Service / Debt / Today's Total
  Revenue) or the Admin tabs (Revenue / Payable Barbers / Running-cost +
  burger) based on `role`. The burger/sidebar only exist for admins.
- **`App.jsx`** picks the default landing tab per role
  (`service` for workers, `revenue` for admins) and switches which set
  of view components can render based on `role` — a worker's session
  never even mounts the admin components, and vice versa.

This is client-side role gating for UI convenience, **not** the security
boundary — the backend still checks `req.user.role` on every admin route
(`requireRole("admin")`), so a worker's token can't call admin endpoints
no matter what the frontend shows.

## Backend change that made this possible

Added `POST /api/auth/login` (unified) to `authController.js` /
`authRoutes.js` in the Phase 1 backend, alongside the original
`/auth/worker/login` and `/auth/admin/login` (kept for backward
compatibility, unused by this app).

## Structure

```
src/
  api/          barbers, services (catalog + logs), debts, running-costs,
                monthly-expenses, revenue, payouts, auth
  context/      AuthContext (single session, includes role)
  components/
    Header, LoginModal, NavBar, Sidebar        — shared shell
    ServiceForm, DebtForm, TodayRevenue         — worker views
    RevenueView, PayableBarbers, RunningCostForm,
    MonthlyExpenseSection, ServiceSection,
    BarbersListSection                          — admin views
```

## Not yet built

- Super Admin UI stays its own separate app (intentionally — see the
  Phase 3 notes: it's a platform-operator tool, different audience,
  and you mentioned adding a monitoring dashboard to it later).
