# Leave Management API (Flask + SQLAlchemy)

A simple leave-management backend built with **Flask**, **Flask-SQLAlchemy**, and **SQLite**, plus a minimal HTML page for manual API testing.

---

## ✨ Features
- User management (create & list users)
- Apply for leave, list all leave requests
- Check leave balance
- Admin: approve/reject requests and adjust balances
- Admin: cancel all leave requests for a user
- Minimal HTML tester page to exercise the API without Postman

---

## Tech Stack
- **Backend:** Python, Flask, Flask-SQLAlchemy, Flask-CORS
- **Database:** SQLite (file-based; can swap to PostgreSQL for production)
- **Tester UI:** Plain HTML + Fetch API
- **WSGI/Proxy (prod):** Gunicorn + Nginx/Caddy (or Render/Heroku)

---

## 📁 Project Structure
```
config.py        # App & database configuration (Flask, SQLAlchemy, CORS)
main.py          # Route definitions (REST API)
models.py        # SQLAlchemy models & serializers
mydatabase.db    # SQLite database file (auto-created on first run)
index.html       # Minimal API tester UI
```

---

## ⚙️ Local Setup

### 1) Create venv & install dependencies
```bash
python -m venv .venv
# Windows: .venv\Scripts\activate
# macOS/Linux:
source .venv/bin/activate

pip install -U pip
pip install -r requirements.txt
```

### 2) Run the API (SQLite)
```bash
python main.py
# Server: http://127.0.0.1:5000
```

Tables are auto-created on first run.

### 3) Optional: Run with Postgres (docker-compose)
```bash
cp .env.example .env
# Edit .env if needed, then:
docker compose up --build
```
- API: `http://127.0.0.1:5000`
- Adminer: `http://127.0.0.1:8080` (PostgreSQL, server `db`, user/pass in `.env`)

### 4) Try the HTML tester
Open `index.html` and set:
```js
const API = "http://127.0.0.1:5000";
```
Then click the buttons to hit endpoints.

---

## 🚏 REST API (quick reference)

**Base URL (local):** `http://127.0.0.1:5000`

- **List users:** `GET /users`
- **Create user:** `POST /create_users` (form-data: `username, email, department, joining_date, [role], [leave_balance]`)
- **Apply leave:** `POST /apply_leave` (form-data: `username, start_date, end_date, reason`)
- **List leave requests:** `GET /show_leaves`
- **Get leave balance:** `GET /get_leave_bal?username={username}`
- **Approve/Reject leave (Admin):** `POST /update_leave_balance` (form-data: `leave_id, status`)
- **Cancel all leaves for a user (Admin):** `POST /cancel_all_leave` (form-data: `username`)

---

## 🛡️ Validation & Security
- Validates joining date, overlapping leaves, leave balance, and user existence.
- Plan to add:
  - Marshmallow or Pydantic schemas
  - AuthN/AuthZ (JWT)
  - Global error handling
  - Rate limiting and request size limits

---

## 📊 Scaling & Improvements
- DB: Migrate to PostgreSQL + Alembic migrations
- Runtime: Gunicorn workers behind Nginx/Caddy; connection pooling
- Caching: Redis
- Background jobs: Celery/RQ for notifications/reports
- Observability: Logging, Prometheus/Grafana, Sentry
- Documentation: OpenAPI (flasgger or Flask-Smorest)

---

## 🚀 Deploy (Render/Heroku)
- `Procfile`: `web: gunicorn main:app`
- Set `DATABASE_URL` env var if using PostgreSQL; fallback is SQLite.

---

## ✅ License
MIT (add LICENSE file)

---

## 📑 Files Included

### `requirements.txt`
```
Flask>=2.3
Flask-SQLAlchemy>=3.1
Flask-Cors>=4.0
gunicorn>=22.0
python-dotenv>=1.0
psycopg2-binary>=2.9
```


```

