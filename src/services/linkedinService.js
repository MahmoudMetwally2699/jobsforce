const axios = require('axios');
const SkillExtractor = require('./skillExtractor');

class LinkedinService {
  static async extractSkills(linkedinUrl) {
    try {
      if (!linkedinUrl.includes('linkedin.com/in/')) {
        throw new Error('Invalid LinkedIn profile URL');
      }

      console.log('Fetching LinkedIn profile:', linkedinUrl);

      const response = await axios.get('https://nubela.co/proxycurl/api/v2/linkedin', {
        params: {
          url: linkedinUrl,
          skills: 'include'
        },
        headers: {
          'Authorization': 'Bearer QtGZ2VY2DNStV207mPwb-g'
        }
      });

      // Log raw API response for debugging
      console.log('LinkedIn API Response:', JSON.stringify(response.data, null, 2));

      if (!response.data) {
        throw new Error('No data received from LinkedIn API');
      }

      // Extract skills from all possible sources in the profile
      const profile = response.data;
      const allSkills = new Set();

      // Add skills directly from LinkedIn's skills section
      if (Array.isArray(profile.skills)) {
        profile.skills.forEach(skill => {
          if (typeof skill === 'string') {
            allSkills.add(skill.trim());
          } else if (skill.name) {
            allSkills.add(skill.name.trim());
          }
        });
      }

      // Process experience descriptions with SkillExtractor
      if (Array.isArray(profile.experiences)) {
        for (const exp of profile.experiences) {
          if (exp.description) {
            const extractedSkills = await SkillExtractor.extractSkills(exp.description);
            extractedSkills.forEach(skill => allSkills.add(skill));
          }
          if (exp.title) {
            const titleSkills = await SkillExtractor.extractSkills(exp.title);
            titleSkills.forEach(skill => allSkills.add(skill));
          }
        }
      }

      // Add certifications as skills
      if (Array.isArray(profile.certifications)) {
        for (const cert of profile.certifications) {
          if (cert.name) {
            const certSkills = await SkillExtractor.extractSkills(cert.name);
            certSkills.forEach(skill => allSkills.add(skill));
          }
        }
      }

      // Add education fields as skills
      if (Array.isArray(profile.education)) {
        profile.education.forEach(edu => {
          if (edu.field_of_study) {
            allSkills.add(edu.field_of_study.trim());
          }
          if (edu.degree_name) {
            allSkills.add(edu.degree_name.trim());
          }
        });
      }

      const skillsArray = Array.from(allSkills).filter(Boolean);

      if (skillsArray.length === 0) {
        console.log('No skills found in profile:', profile);
        throw new Error('No skills found in the LinkedIn profile');
      }

      console.log('Extracted skills:', skillsArray);
      return skillsArray;

    } catch (error) {
      console.error('LinkedIn API Error:', {
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

      throw new Error(
        error.response?.data?.message ||
        error.message ||
        'Failed to extract skills from LinkedIn profile'
      );
    }
  }
}

module.exports = LinkedinService;
