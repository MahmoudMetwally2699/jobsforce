require('dotenv').config();
const axios = require('axios');
const cheerio = require('cheerio');
const mongoose = require('mongoose');
const Job = require('../models/Job');

const commonSkills = ['JavaScript', 'Python', 'Java', 'React', 'Node.js', 'AWS', 'Docker', 'MongoDB', 'SQL'];

async function scrapeWWR(retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await axios.get('https://weworkremotely.com/categories/remote-programming-jobs', {
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      const $ = cheerio.load(response.data);
      const jobs = [];

      $('.feature').each((i, elem) => {
        try {
          const title = $(elem).find('.title').text().trim();
          const company = $(elem).find('.company').text().trim();
          const description = $(elem).find('.description').text().trim();

          if (!title || !company || !description) return;

          const skillsPattern = new RegExp(commonSkills.join('|'), 'gi');
          const skills = [...description.matchAll(skillsPattern)]
            .map(match => match[0].toLowerCase())
            .filter((skill, index, self) => self.indexOf(skill) === index);

          jobs.push({ title, company, description, skills });
        } catch (err) {
          console.error('Error processing job:', err);
        }
      });

      if (jobs.length === 0) {
        throw new Error('No jobs found');
      }

      await mongoose.connect(process.env.MONGODB_URI);
      await Job.insertMany(jobs, { ordered: false });
      console.log(`Successfully scraped ${jobs.length} jobs`);
      process.exit(0);
    } catch (error) {
      console.error(`Attempt ${attempt} failed:`, error);
      if (attempt === retries) {
        console.error('All retry attempts failed');
        process.exit(1);
      }
      await new Promise(resolve => setTimeout(resolve, 5000 * attempt));
    }
  }
}

scrapeWWR();
