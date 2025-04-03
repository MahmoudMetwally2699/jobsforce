const axios = require('axios');

class LinkedinService {
  static async extractSkills(linkedinUrl) {
    try {
      if (!linkedinUrl.includes('linkedin.com/in/')) {
        throw new Error('Invalid LinkedIn profile URL');
      }

      const response = await axios.get('https://nubela.co/proxycurl/api/v2/linkedin', {
        params: {
          url: linkedinUrl
        },
        headers: {
          'Authorization': 'Bearer QtGZ2VY2DNStV207mPwb-g'
        }
      });

      if (!response.data) {
        throw new Error('No data received from LinkedIn API');
      }

      // Extract all possible skill-related information
      const profile = response.data;
      const skills = new Set([
        ...(profile.skills?.map(s => s.name) || []),
        ...(profile.experiences?.flatMap(e => e.skills || []) || []),
        ...(profile.education?.flatMap(e => e.fields_of_study || []) || []),
        ...(profile.certifications?.map(c => c.name) || []),
        ...(profile.accomplishments?.courses || [])
      ].filter(Boolean).map(skill => skill.trim()));

      if (skills.size === 0) {
        console.log('No skills found in profile:', profile);
        throw new Error('No skills found in the LinkedIn profile');
      }

      return Array.from(skills);

    } catch (error) {
      // Detailed error logging
      console.error('LinkedIn API Error Details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        url: linkedinUrl
      });

      if (error.response?.status === 429) {
        throw new Error('LinkedIn API rate limit exceeded. Please try again later.');
      }

      if (error.response?.status === 401) {
        throw new Error('LinkedIn API authentication failed. Please contact support.');
      }

      throw new Error(error.response?.data?.message || error.message || 'Failed to extract skills from LinkedIn profile');
    }
  }
}

module.exports = LinkedinService;
