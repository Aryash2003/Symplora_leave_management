# Leave Management API (Flask + SQLAlchemy)

A simple leave-management backend built with **Flask**, **Flask-SQLAlchemy**, and **SQLite**, plus a tiny HTML page for manual API testing.

---

## ✨ Features
- User management (create & list users)
- Apply for leave, list all leave requests
- Check leave balance
- Admin: approve/reject requests and adjust balances
- Admin: cancel all leave requests for a user
- Minimal HTML tester page to exercise the API without Postman

---

## 🧱 Tech Stack
- **Backend:** Python, Flask, Flask-SQLAlchemy, Flask-CORS
- **Database:** SQLite (file-based; swap to Postgres for production)
- **Tester UI:** Plain HTML + Fetch API
- **WSGI/Proxy (prod):** Gunicorn + Nginx/Caddy (or Render/Heroku)

---

## 📁 Project Structure
config.py # App & database configuration (Flask, SQLAlchemy, CORS)
main.py # Route definitions (REST API)
models.py # SQLAlchemy models & serializers
mydatabase.db # SQLite database file (auto-created on first run)
index.html # Minimal API tester UI

yaml
Copy
Edit

---

## ⚙️ Local Setup

### 1) Create venv & install deps
```bash
python -m venv .venv
# Windows: .venv\Scripts\activate
# macOS/Linux:
source .venv/bin/activate

pip install -U pip
pip install -r requirements.txt
2) Run the API (SQLite)
bash
Copy
Edit
python main.py
# Server: http://127.0.0.1:5000
Tables are auto-created on first run.

3) Optional: Run with Postgres (docker-compose)
bash
Copy
Edit
cp .env.example .env
# Edit .env if needed, then:
docker compose up --build
# API: http://127.0.0.1:5000
# Adminer: http://127.0.0.1:8080 (System: PostgreSQL, Server: db, User/Pass: in .env, DB: in .env)
4) Try the HTML tester
Open index.html and set:

js
Copy
Edit
const API = "http://127.0.0.1:5000";
Then click the buttons to hit endpoints.

🚏 REST API (quick reference)
Base URL (local): http://127.0.0.1:5000

List users
GET /users → {"users": [...]}

Create user
POST /create_users (form-data): username, email, department, joining_date, [role], [leave_balance]

Validates date formats YYYY-MM-DD or DD-MM-YYYY, unique username/email, and non-negative balance.

Apply leave
POST /apply_leave (form-data): username, start_date, end_date, reason

Validates user exists, date order, overlap, joining date, and balance (balance actually deducted on approval).

List leave requests
GET /show_leaves → {"leaves": [...]}

Get leave balance
GET /get_leave_bal?username={username}

Approve/Reject leave (Admin)
POST /update_leave_balance (form-data): leave_id, status

If status == "approved": check balance then deduct; else mark rejected.

Cancel all leaves for a user (Admin)
POST /cancel_all_leave (form-data): username

🛡️ Validation & Security TODO
Add request schemas (Marshmallow or Pydantic) + stricter email checks

Add AuthZ/AuthN (JWT), protect admin routes

Add global error handler for consistent JSON

Rate limiting (Flask-Limiter), request size limits

📈 Scalability & Improvements
DB: Migrate to PostgreSQL + Alembic migrations

Runtime: Gunicorn workers behind Nginx/Caddy; connection pooling

Caching: Redis for hot reads

Background jobs: Celery/RQ for notifications/reports

Observability: Structured logs, Prometheus/Grafana, Sentry

Docs: OpenAPI (flasgger or Flask-Smorest)

🚀 Deploy (Render/Heroku)
Procfile: web: gunicorn main:app

requirements.txt included

Set DATABASE_URL env var if using Postgres; app reads it in config.py.

✅ License
MIT (add a LICENSE file).

yaml
Copy
Edit

---

## `requirements.txt`
```txt
Flask>=2.3
Flask-SQLAlchemy>=3.1
Flask-Cors>=4.0
gunicorn>=22.0
python-dotenv>=1.0
psycopg2-binary>=2.9
Procfile
procfile
Copy
Edit
web: gunicorn main:app
.env.example
env
Copy
Edit
# Flask
FLASK_ENV=production
SECRET_KEY=change-this-in-production

# Database
# For SQLite leave this empty or comment it out to use default sqlite:///mydatabase.db
# For Postgres via docker-compose:
DATABASE_URL=postgresql+psycopg2://postgres:postgres@db:5432/leaves

# CORS (comma-separated origins; * for dev)
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:5500,*
Dockerfile
dockerfile
Copy
Edit
FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# System deps for psycopg2
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc libpq-dev && \
    rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Default to gunicorn; override in compose if needed
CMD ["gunicorn", "main:app", "--bind", "0.0.0.0:5000", "--workers", "3", "--timeout", "120"]
docker-compose.yml
yaml
Copy
Edit
version: "3.9"

services:
  api:
    build: .
    container_name: leave_api
    ports:
      - "5000:5000"
    env_file:
      - .env
    environment:
      # Fallback to SQLite if DATABASE_URL is not set
      - DATABASE_URL=${DATABASE_URL:-}
      - FLASK_ENV=${FLASK_ENV:-development}
      - SECRET_KEY=${SECRET_KEY:-dev-secret}
      - CORS_ORIGINS=${CORS_ORIGINS:-*}
    depends_on:
      - db
    volumes:
      - .:/app

  db:
    image: postgres:16
    container_name: leave_db
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: leaves
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

  adminer:
    image: adminer:latest
    container_name: leave_adminer
    ports:
      - "8080:8080"
    depends_on:
      - db

volumes:
  pgdata:
gunicorn.conf.py (optional)
python
Copy
Edit
bind = "0.0.0.0:5000"
workers = 3
timeout = 120
graceful_timeout = 30
keepalive = 5
render.yaml (optional, for Render.com)
yaml
Copy
Edit
services:
  - type: web
    name: leave-management-api
    env: python
    region: oregon
    buildCommand: "pip install -r requirements.txt"
    startCommand: "gunicorn main:app"
    autoDeploy: true
    healthCheckPath: "/users"
    envVars:
      - key: DATABASE_URL
        # Set to your managed Postgres on Render; fallback is SQLite in config.py
        value: ""
Notes about config.py (how it should read envs)
Make sure your config.py reads DATABASE_URL, SECRET_KEY, and CORS_ORIGINS from env (e.g., with python-dotenv). If you want, I can paste an improved config.py that:

prefers DATABASE_URL if present, else falls back to sqlite:///mydatabase.db,

parses CORS_ORIGINS,

sets sane SQLAlchemy flags.
