const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const SkillExtractor = require('./skillExtractor');

class ResumeProcessor {
  static async extractText(file) {
    let text = '';

    if (file.mimetype === 'application/pdf') {
      const pdfData = await pdfParse(file.buffer);
      text = pdfData.text;
    } else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const result = await mammoth.extractRawText({ buffer: file.buffer });
      text = result.value;
    }

    return text;
  }

  static async processResume(file) {
    let text = '';

    if (file.mimetype === 'application/pdf') {
      const pdfData = await pdfParse(file.buffer);
      text = pdfData.text;
    } else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const result = await mammoth.extractRawText({ buffer: file.buffer });
      text = result.value;
    }

    const skills = await SkillExtractor.extractSkills(text);
    return skills;
  }
}

module.exports = ResumeProcessor;
