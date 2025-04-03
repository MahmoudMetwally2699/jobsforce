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

      const profile = response.data;

      // Extract skills from the API response
      const skills = [
        ...(profile.skills || []),
        ...(profile.accomplishments?.courses || []),
        ...(profile.certifications?.map(cert => cert.name) || [])
      ].filter(Boolean);

      return Array.from(new Set(skills)); // Remove duplicates

    } catch (error) {
      console.error('LinkedIn API Error:', error.response?.data || error.message);
      throw new Error('Failed to extract skills from LinkedIn profile');
    }
  }
}

module.exports = LinkedinService;
