Barber Management System — Frontend

A role-based React application for managing barber-shop operations, including services, debts, revenue, barber payouts, running costs, and monthly expenses.

The application uses a single frontend for both Workers and Administrators. After authentication, the interface and available features are determined by the user's role.

Live Application

Live Demo:
https://barber-managment-system.vercel.app/

«Demo access may be restricted because this application is connected to a production backend and business data.»

---

Overview

The Barber Management System was built to replace manual barber-shop record keeping with a centralized digital workflow.

The frontend provides separate workspaces for:

- Workers / Barbers
- Shop Administrators

A single login system identifies the user's role and loads the appropriate interface.

The frontend communicates with a separate REST API backend.

---

Key Features

Role-Based Application

The application uses one React application for both Worker and Admin users.

Worker interface

- Record completed services
- Record customer debts
- View today's revenue
- Access worker-specific operational functions

Admin interface

- View revenue
- Manage payable barbers
- Manage running costs
- Manage monthly expenses
- Manage services
- Manage barber information
- Access administrative tools

The frontend uses role-based rendering for the user interface, while authorization is enforced by the backend API.

---

Authentication & Authorization

The application uses a unified login flow.

The login request sends:

{
  "name": "username",
  "password": "password",
  "barberCode": "SHOP_CODE"
}

The backend determines whether the authenticated account is a Worker or Administrator and returns the user's role.

The frontend stores the authenticated session and uses the role to determine which interface should be displayed.

Security Boundary

Frontend role checks are used for UI control only.

The backend remains the actual authorization boundary and verifies the authenticated user's role before allowing access to protected administrative endpoints.

This prevents a Worker from gaining administrative access simply by manipulating the frontend.

---

Application Architecture

src/
├── api/
│   ├── auth
│   ├── barbers
│   ├── services
│   ├── debts
│   ├── running-costs
│   ├── monthly-expenses
│   ├── revenue
│   └── payouts
│
├── context/
│   └── AuthContext
│
├── components/
│   ├── Header
│   ├── LoginModal
│   ├── NavBar
│   ├── Sidebar
│   │
│   ├── Worker Views
│   │   ├── ServiceForm
│   │   ├── DebtForm
│   │   └── TodayRevenue
│   │
│   └── Admin Views
│       ├── RevenueView
│       ├── PayableBarbers
│       ├── RunningCostForm
│       ├── MonthlyExpenseSection
│       ├── ServiceSection
│       └── BarbersListSection
│
├── App.jsx
└── main.jsx

---

Worker Workflow

Workers have a simplified interface focused on daily operations.

Service Entry

Workers can record completed services through the service workflow.

Service information is submitted to the backend and becomes part of the shop's revenue and barber-payment calculations.

Debt Management

Workers can record customer debts and view today's debt information.

Today's Revenue

Workers can view the current day's revenue information without receiving access to administrative functionality.

---

Admin Workflow

Administrators receive a broader management interface.

Revenue

Administrators can access revenue information and financial summaries.

Payable Barbers

The application provides a dedicated interface for viewing barber payouts.

Administrators can review payable amounts and process barber payments.

Running Costs

Administrators can record and manage operational running costs.

Monthly Expenses

Monthly business expenses can be recorded and managed separately from daily running costs.

Services

Administrators can manage the shop's service information used by the application.

Barbers

Administrators can access barber-management functionality from the administrative interface.

---

Role-Based Rendering

The application determines the user's role after authentication.

                    Login
                      │
                      ▼
                Authentication
                      │
             ┌────────┴────────┐
             │                 │
          Worker             Admin
             │                 │
             ▼                 ▼
       Worker Interface   Admin Interface

A Worker session does not mount the administrative components.

An Admin session receives the administrative navigation and views.

---

Backend Integration

The frontend communicates with the Barber Management System backend through REST API endpoints.

Backend responsibilities include:

- Authentication
- Authorization
- Multi-tenant data isolation
- Service records
- Debt records
- Revenue calculations
- Barber payouts
- Running costs
- Monthly expenses
- Super Admin operations

Backend Repository:
https://github.com/Fanitu/BarberManagmentSystemBackend

---

Technology Stack

Frontend

- React 18
- Vite
- JavaScript
- REST API integration
- Context API
- jsPDF
- jsPDF AutoTable

The project is configured as a Vite React application and uses jsPDF and jsPDF AutoTable for PDF-related functionality.

Deployment

- Vercel

---

Local Development

1. Clone the repository

git clone https://github.com/Fanitu/BarberManagmentSystem.git

cd BarberManagmentSystem

2. Install dependencies

npm install

3. Configure environment variables

Create a local ".env" file containing the backend API URL.

Example:

VITE_API_BASE_URL=http://localhost:5000

Do not commit your real ".env" file.

4. Start the development server

npm run dev

5. Production build

npm run build

---

Engineering Highlights

- Single React application serving multiple user roles
- Role-based UI rendering
- Centralized authentication state
- REST API integration
- Separate Worker and Admin workflows
- PDF generation support
- Production deployment with Vercel
- Backend-enforced authorization rather than relying only on frontend role checks

---

Project Structure

This repository contains the frontend application only.

The backend is maintained separately to keep the client and server responsibilities clearly separated.

Frontend
   │
   │ REST API
   ▼
Backend
   │
   ▼
MongoDB

---

Related Repository

Barber Management System Backend

https://github.com/Fanitu/BarberManagmentSystemBackend

---

Author

Fanuel Bahta

Full-Stack Web Developer

Portfolio:
https://fanu-portofoilio.vercel.app/