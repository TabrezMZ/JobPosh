
# 🧰 Artha Job Board – MERN Stack Project

This project is a full-stack job importer and logging system built using:

- **Frontend**: Next.js (React)
- **Backend**: Node.js + Express
- **Database**: MongoDB
- **Queue**: Redis + BullMQ
- **Feed Source**: XML job feeds from jobicy.com

It fetches job feeds, processes and stores them in MongoDB, and logs every import with a UI to monitor results.

---

## 📁 Folder Structure

artha-job-board/
├── client/ # Next.js frontend (UI)
├── server/ # Node.js backend
│ ├── models/ # Mongoose models (Job, ImportLog)
│ ├── jobs/ # BullMQ worker + queue
│ ├── services/ # Job importer logic
│ ├── routes/ # Express API routes
│ ├── config.js # Configuration
│ ├── server.js # Entry point with cron
│ └── run-import.js # Manual import runner
├── .env # Environment variables
├── /docs/ # Architecture documentation
└── README.md

---

## 🚀 Features

- Auto-fetch jobs from XML feeds
- Parses, de-duplicates, stores in MongoDB
- Background job processing via Redis & BullMQ
- Import logs: total/new/updated/failed
- Admin dashboard UI to monitor imports

---

## 🧪 Prerequisites

Install the following locally:

- **Node.js** (v18+ recommended)
- **MongoDB** (v5+)
- **Redis** (v5+ — v6.2+ recommended)
- **npm** or **yarn**
- [MongoDB Compass](https://www.mongodb.com/try/download/compass) (optional GUI)

---

## 🧱 Local Setup

### 🔹 1. Clone & Install

```bash
git clone https://github.com/TabrezMZ/JobPosh.git 
cd artha-job-board
🔹 2. Setup Backend


cd server
npm install
Create .env in server/:


PORT=5000
MONGO_URI=mongodb://localhost:27017/artha-job-board
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
Start server:

node server.js
Start background worker:


node jobs/worker.js
🔹 3. Setup Frontend

cd ../client
npm install
npm run dev
Visit:
👉 http://localhost:3000

⚙️ Manual Import (Instead of Waiting for Cron)

cd server
node run-import.js
This immediately fetches and queues jobs for processing.

✅ Testing the System
Make sure MongoDB and Redis are running.

Run:
node server.js
node jobs/worker.js
node run-import.js
Visit MongoDB Compass → artha-job-board > importlogs
View imported log entries.

Go to browser:
👉 http://localhost:3000
You’ll see Import History with:

| File | New | Updated | Failed | Time |
