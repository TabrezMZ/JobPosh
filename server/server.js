const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cron = require('node-cron');
const fetchAndQueueJobs = require('./services/jobImporter');
const { mongoURI, port } = require('./config');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB
mongoose.connect(mongoURI).then(() => console.log('MongoDB Connected'));

// Routes
app.use('/api/import-logs', require('./routes/logs'));

// Cron Job: Every hour
cron.schedule('0 * * * *', () => {
  console.log('⏳ Running cron job...');
  fetchAndQueueJobs();
});

app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
