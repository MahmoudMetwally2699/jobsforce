const axios = require('axios');

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
      const skills = new Set();

      // Add skills from the dedicated skills section
      if (Array.isArray(profile.skills)) {
        profile.skills.forEach(skill => {
          if (typeof skill === 'string') {
            skills.add(skill.trim());
          } else if (skill.name) {
            skills.add(skill.name.trim());
          }
        });
      }

      // Add skills from experiences
      if (Array.isArray(profile.experiences)) {
        profile.experiences.forEach(exp => {
          if (exp.description) {
            const extractedSkills = SkillExtractor.extractSkills(exp.description);
            extractedSkills.forEach(skill => skills.add(skill.trim()));
          }
        });
      }

      // Add skills from certifications
      if (Array.isArray(profile.certifications)) {
        profile.certifications.forEach(cert => {
          if (cert.name) {
            skills.add(cert.name.trim());
          }
        });
      }

      // Add education fields as skills
      if (Array.isArray(profile.education)) {
        profile.education.forEach(edu => {
          if (edu.field_of_study) {
            skills.add(edu.field_of_study.trim());
          }
          if (edu.degree_name) {
            skills.add(edu.degree_name.trim());
          }
        });
      }

      const skillsArray = Array.from(skills).filter(Boolean);

      if (skillsArray.length === 0) {
        console.log('Warning: No skills found in profile data');
        throw new Error('No skills found in the LinkedIn profile');
      }

      console.log('Extracted skills:', skillsArray);
      return skillsArray;

    } catch (error) {
      console.error('LinkedIn API Error:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
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
