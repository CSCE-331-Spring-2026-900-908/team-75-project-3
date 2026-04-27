# Taro Root

A point-of-sale prototype for a fictional bubble tea shop. Live at <https://team-75-project-3.onrender.com/>.

## What's here

Five interfaces, served from one Next.js app, reachable through a single one-way portal:

- `/` portal, public entry with links out to the kiosk and employee login
- `/order` customer self-service kiosk
- `/login` Google sign-in for staff
- `/cashier` cashier terminal for taking orders behind the counter
- `/manager` manager dashboard for menu, inventory, and employee CRUD
- `/manager/stats` sales charts, ingredient-usage history, X and Z reports

The kiosk pulls current weather from Open-Meteo to recommend a drink, runs a Google Translate widget over the page, and exposes an OpenAI-backed chatbot for menu questions and ordering help.

## Stack

- Next.js 16.2 (App Router, Turbopack) with React 19 and TypeScript
- Tailwind CSS 4
- PostgreSQL on the TAMU CSCE 315 server, accessed through `pg`
- NextAuth v5, Google OAuth, role lookup against the `employees` table
- OpenAI SDK for the chatbot
- OpenWeatherMap API for weather, Google Translate widget for translation
- Hosted on Render

## Running locally

```bash
npm install
npm run dev
```

Then open <http://localhost:3000>.

`npm run build` produces the production build, `npm start` serves it, `npm run lint` runs ESLint.

## Environment

Put these in `.env.local`:

```dotenv
DB_HOST=
DB_PORT=
DB_NAME=
DB_USER=
DB_PASS=

AUTH_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

OPENAI_KEY=
OPENWEATHERMAP_API_KEY=
```

Translation doesn't need a key.

## Layout

```text
app/
  (portal)/page.tsx            landing
  (customer)/order/page.tsx    kiosk, chatbot, weather, translate
  (cashier)/cashier/page.tsx   cashier terminal
  (manager)/manager/page.tsx   dashboard
  (manager)/manager/stats      analytics, X and Z reports
  login/page.tsx               Google sign-in
  api/
    auth/[...nextauth]         NextAuth handlers
    menu, orders               core POS
    inventory, employees       manager CRUD
    manager/stats, reports     analytics
    ai                         chatbot proxy
    weather                    OpenWeatherMap proxy
components/                    shared UI for cashier, manager, stats, translate
lib/
  db.ts                        Postgres pool
  auth.ts                      NextAuth config
  queries/                     SQL grouped by domain
  types.ts                     shared types
```
