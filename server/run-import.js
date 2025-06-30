const mongoose = require('mongoose');
const { mongoURI } = require('./config');
const fetchAndQueueJobs = require('./services/jobImporter');

mongoose.connect(mongoURI).then(async () => {
  console.log('MongoDB Connected');
  await fetchAndQueueJobs();
  console.log('Jobs Queued ✅');
  process.exit();
});
