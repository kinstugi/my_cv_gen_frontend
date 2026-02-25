# My CV Gen Frontend

React app for the My CV Gen API: register, log in, manage resumes, tailor to job descriptions (AI), and download PDFs.

## Setup

1. Copy `.env.example` to `.env` and set the API base URL:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and set e.g. `VITE_API_BASE_URL=https://my-cv-gen-api.onrender.com` (or `http://localhost:8080` for local API).

2. Install and run:
   ```bash
   npm install
   npm run dev
   ```

## Deploy to Firebase Hosting

1. **Install Firebase CLI** (once per machine):
   ```bash
   npm install -g firebase-tools
   ```

2. **Log in and create/link a project**:
   ```bash
   firebase login
   firebase init hosting
   ```
   - When prompted “What do you want to use as your public directory?”, enter **`dist`**.
   - Choose “Single-page app (rewrite all urls to /index.html)” → **Yes** (or ensure `firebase.json` has the rewrites below).
   - Pick an existing Firebase project or create a new one.

3. **Build and deploy**:
   ```bash
   npm run build
   firebase deploy
   ```
   Your site will be at `https://<project-id>.web.app` (and `https://<project-id>.firebaseapp.com`).

4. **After first deploy** — Add your Firebase Hosting URL to the **backend** CORS allowed origins (e.g. `https://<project-id>.web.app`) so the API accepts requests from the deployed frontend.

## Pages

- **Home** — Landing; links to Log in / Register or My resumes / Profile when authenticated.
- **Login / Register** — Auth (POST `/api/auth/login`, `/api/auth/register`).
- **Profile** — View and update current user (GET/PUT `/api/users/me`).
- **Resumes** — List (GET `/api/resumes`), create (POST `/api/resumes`), edit (PUT `/api/resumes/:id`), delete (DELETE `/api/resumes/:id`), download PDF (GET `/api/resumes/:id/download`), tailor (POST `/api/resumes/:id/tailor`).

---

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
