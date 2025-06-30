const { Worker } = require('bullmq');
const mongoose = require('mongoose');
const { redis, mongoURI } = require('../config');
const Job = require('../models/Job');
const ImportLog = require('../models/ImportLog');

mongoose.connect(mongoURI).then(() => console.log('✅ MongoDB Connected to Worker'));

const worker = new Worker('job-import', async job => {
  const { data, fileName } = job.data;

  console.log(`🛠️ Job Received with ${data.length} entries from ${fileName}`);

  let newCount = 0, updatedCount = 0, failed = [];

  for (const j of data) {
    try {
      const res = await Job.updateOne({ jobId: j.jobId }, j, { upsert: true });
      if (res.upsertedCount > 0) newCount++;
      else updatedCount++;
    } catch (err) {
      const id = typeof j.jobId === 'object' ? j.jobId._ : j.jobId;
      failed.push(id);
    }
  }

  await ImportLog.create({
    fileName,
    timestamp: new Date(),
    totalFetched: data.length,
    totalImported: newCount + updatedCount,
    newJobs: newCount,
    updatedJobs: updatedCount,
    failedJobs: failed
  });

  console.log(`✅ Job processed: ${newCount} new, ${updatedCount} updated, ${failed.length} failed`);

}, {
  connection: redis
});

// Log errors if any
worker.on('error', err => {
  console.error('❌ Worker error:', err);
});

worker.on('failed', (job, err) => {
  console.error(`❌ Job failed [${job.id}]:`, err.message);
});
