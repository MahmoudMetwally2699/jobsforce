const natural = require('natural');
const tokenizer = new natural.WordTokenizer();

const commonSkills = [
  // Programming Languages
  'javascript', 'python', 'java', 'typescript', 'c++', 'ruby', 'php', 'swift', 'kotlin', 'go',
  // Frontend
  'react', 'vue', 'angular', 'html', 'css', 'sass', 'webpack', 'redux', 'jquery',
  // Backend
  'nodejs', 'express', 'django', 'spring', 'flask', 'laravel', 'graphql', 'rest',
  // Cloud & DevOps
  'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins', 'terraform', 'ci/cd',
  // Databases
  'mongodb', 'postgresql', 'mysql', 'redis', 'elasticsearch', 'sql', 'nosql',
  // AI/ML
  'machine learning', 'tensorflow', 'pytorch', 'nlp', 'computer vision', 'data science',
  // Tools & Others
  'git', 'jira', 'agile', 'scrum', 'microservices', 'testing', 'junit', 'jest'
];

class SkillExtractor {
  static stringSimilarity(str1, str2) {
    return natural.JaroWinklerDistance(str1, str2, { ignoreCase: true });
  }

  static async extractSkills(text) {
    const tokens = tokenizer.tokenize(text.toLowerCase());
    const skills = new Set();
    const threshold = 0.85;

    tokens.forEach(token => {
      commonSkills.forEach(skill => {
        if (this.stringSimilarity(token, skill) > threshold) {
          skills.add(skill);
        }
      });
    });

    return Array.from(skills);
  }

  static calculateSkillMatch(userSkills, jobSkills) {
    if (!userSkills.length || !jobSkills.length) return 0;

    const matchingSkills = userSkills.filter(skill =>
      jobSkills.some(jobSkill => this.stringSimilarity(skill, jobSkill) > 0.85)
    );

    return matchingSkills.length / Math.max(userSkills.length, jobSkills.length);
  }

  static calculateContentSimilarity(text1, text2) {
    const tfidf = new natural.TfIdf();
    tfidf.addDocument(text1.toLowerCase());
    tfidf.addDocument(text2.toLowerCase());

    let similarity = 0;
    const terms = new Set([...text1.toLowerCase().split(' '), ...text2.toLowerCase().split(' ')]);

    terms.forEach(term => {
      const score1 = tfidf.tfidf(term, 0);
      const score2 = tfidf.tfidf(term, 1);
      similarity += score1 * score2;
    });

    return similarity;
  }

  static calculateOverallMatch(userSkills, jobSkills, userResume, jobDescription) {
    const skillScore = this.calculateSkillMatch(userSkills, jobSkills);
    const contentScore = this.calculateContentSimilarity(userResume || '', jobDescription);
    return (skillScore * 0.7) + (contentScore * 0.3);
  }
}

module.exports = SkillExtractor;
