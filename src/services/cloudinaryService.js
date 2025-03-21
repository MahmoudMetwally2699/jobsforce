const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

class CloudinaryService {
  static async uploadFile(file) {
    const buffer = file.buffer.toString('base64');
    const result = await cloudinary.uploader.upload(
      `data:${file.mimetype};base64,${buffer}`,
      {
        resource_type: 'auto',
        folder: 'resumes'
      }
    );
    return result.secure_url;
  }
}

module.exports = CloudinaryService;
