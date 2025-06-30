const { Queue } = require('bullmq');
const { redis } = require('../config');

const jobQueue = new Queue('job-import', {
  connection: redis
});

module.exports = jobQueue;
