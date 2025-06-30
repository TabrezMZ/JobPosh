
---

# 🧠 `/docs/architecture.md`

```markdown
# 🏗️ Artha Job Board – Architecture Overview

This document explains the design choices and flow of the Artha Job Board system.

---

## 🔧 Technology Stack

| Layer        | Technology         |
|--------------|--------------------|
| Frontend     | Next.js + Axios    |
| Backend API  | Node.js + Express  |
| Database     | MongoDB (Mongoose) |
| Queue Engine | Redis + BullMQ     |
| Feed Source  | XML job feeds      |

---

## 📦 System Components

### 1. **Frontend UI (Next.js)**

- Displays import logs using Axios (GET from `/api/import-logs`)
- Tailwind CSS for styling
- Deployed locally or via Vercel

### 2. **Backend Server (Express.js)**

- API Endpoint `/api/import-logs` returns all import logs
- Contains a scheduled `node-cron` job to fetch every hour

### 3. **Job Importer (`services/jobImporter.js`)**

- Fetches XML feeds from Jobicy.com
- Parses XML to JSON using `xml2js`
- Transforms job data into standard format
- Pushes job batch into Redis queue (`import-job`)

### 4. **Queue System (BullMQ + Redis)**

- Jobs are queued to `job-import`
- A separate **Worker** processes jobs asynchronously
- Handles upserts into `jobs` collection
- Logs import summary into `importlogs`

### 5. **Worker Processor (`jobs/worker.js`)**

- Consumes job batches
- Inserts or updates jobs via `jobId`
- Handles error tracking
- Creates a log entry for each import

---

## 🧠 Design Decisions

| Area               | Choice & Reason                                                                 |
|--------------------|---------------------------------------------------------------------------------|
| **Queue (BullMQ)** | Async job processing decouples heavy tasks from HTTP requests                  |
| **MongoDB**        | Flexible schema for job feeds (varied formats)                                 |
| **Redis**          | In-memory job queue with retry, fail tracking                                  |
| **XML Feeds**      | Parsed via `xml2js` due to reliable support and ease of transformation         |
| **Modular Code**   | Separated logic into services, models, and routes for maintainability          |
| **Validation**     | Handled in Mongoose schemas; invalid entries logged as failures                |

---

## 🛠 Error Handling

- Feeds with invalid format are skipped and logged in console
- Jobs with duplicate `jobId` are updated, not duplicated
- Worker logs failed job insertions and stores failed IDs in `importlogs`

---

## 🔁 Scalability Notes

- Can scale to thousands of jobs/hour
- Add rate-limiting or retry policies in BullMQ
- Add email or Slack alert on job failure
- Can move Redis & MongoDB to cloud (RedisCloud, MongoDB Atlas)

---

## 📊 Future Enhancements

- Add authentication for admin UI
- Add search/filter in frontend
- Export logs to CSV
- Retry failed imports automatically
- Visual dashboard with charts (e.g., chart.js or Recharts)

---

## 🎯 Goal

This architecture demonstrates a **decoupled, fault-tolerant**, and scalable design for importing external job feeds and logging activity with visibility via a simple UI.

---
