const axios = require('axios');
const xml2js = require('xml2js');
const fs = require('fs');
const jobQueue = require('../jobs/jobQueue');

// Job feed URLs
const urls = [
  "https://jobicy.com/?feed=job_feed",
  "https://jobicy.com/?feed=job_feed&job_categories=data-science",
  "https://jobicy.com/?feed=job_feed&job_categories=design-multimedia",
  "https://jobicy.com/?feed=job_feed&job_categories=copywriting"
];

const parser = new xml2js.Parser({ explicitArray: false });

async function fetchAndQueueJobs() {
  for (const url of urls) {
    try {
      console.log(`🌐 Fetching feed: ${url}`);
      const res = await axios.get(url);

      // Parse XML to JSON
      const json = await parser.parseStringPromise(res.data);

      // Safety check
      if (!json.rss || !json.rss.channel || !json.rss.channel.item) {
        console.warn('⚠️ Skipping feed — Invalid XML structure:', url);

        // Optional: Save XML to file for debugging
        fs.writeFileSync(`./logs/broken-feed-${Date.now()}.xml`, res.data);

        continue;
      }

      const rawItems = json.rss.channel.item;
      const items = Array.isArray(rawItems) ? rawItems : [rawItems];

      const jobs = items.map(item => ({
        jobId: typeof item.guid === 'object' ? item.guid._ : item.guid,
        title: item.title,
        description: item.description,
        company: item['job:company'] || '',
        location: item['job:location'] || '',
        link: item.link
      }));

      console.log(`✅ Parsed ${jobs.length} jobs from: ${url}`);

      await jobQueue.add('import-job', {
        data: jobs,
        fileName: url
      });

    } catch (err) {
      console.error(`❌ Error importing: ${url}`, err.message);

      // Optional: Save broken XML for investigation
      try {
        fs.writeFileSync(`./logs/error-feed-${Date.now()}.xml`, res?.data || '');
      } catch (_) {
        // Ignore if writing fails
      }
    }
  }

  console.log("📤 Jobs Queued ✅");
}

module.exports = fetchAndQueueJobs;
