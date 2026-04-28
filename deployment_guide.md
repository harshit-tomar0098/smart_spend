# SmartSpend Deployment Guide

This guide covers how to deploy the SmartSpend platform to production environments.

## 1. Database Deployment (PostgreSQL)
We recommend using **Supabase**, **Render**, or **AWS RDS** for managed PostgreSQL hosting.
1. Create a new PostgreSQL instance.
2. Obtain the connection string (URI).
3. Set the `DATABASE_URL` in your backend `.env` file to this URI.
4. Run `npx prisma migrate deploy` in the `backend` directory to apply the schema.

## 2. Backend Deployment (Node.js/Express)
We recommend deploying the backend on **Render**, **Railway**, or **Heroku**.
1. Set the root directory to `backend/`.
2. Add environment variables (`DATABASE_URL`, `JWT_SECRET`, `PORT`).
3. Build command: `npm install && npx prisma generate`
4. Start command: `node index.js`

## 3. AI Microservice Deployment (Python/FastAPI)
We recommend deploying the FastAPI service on **Render** or **Railway**.
1. Set the root directory to `ai-service/`.
2. Ensure `requirements.txt` is present (run `pip freeze > requirements.txt` locally if not).
3. Start command: `uvicorn main:app --host 0.0.0.0 --port 8000`

## 4. Frontend Deployment (React/Vite)
We recommend deploying the frontend on **Vercel** or **Netlify**.
1. Set the root directory to `frontend/`.
2. Add environment variables if needed (e.g., `VITE_API_URL` pointing to your deployed backend URL).
3. Build command: `npm run build`
4. Publish directory: `dist/`

## 5. Connecting the Services
- Ensure the **Frontend** makes API calls to the **Backend** URL.
- Ensure the **Backend** makes HTTP requests to the **AI Microservice** URL for predictions and anomalies.
- Set up a custom domain and SSL certificates (handled automatically by Vercel/Render).
