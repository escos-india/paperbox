const cloudinary = require('cloudinary').v2;
const { getConfig } = require('../config/env.config');

// Configure Cloudinary
cloudinary.config({
  cloud_name: getConfig('CLOUDINARY_CLOUD_NAME'),
  api_key: getConfig('CLOUDINARY_API_KEY'),
  api_secret: getConfig('CLOUDINARY_API_SECRET')
});

class CloudinaryService {
  constructor() {
    this.cloudinary = cloudinary;
  }

  // Upload single image
  async uploadImage(filePath, options = {}) {
    try {
      const defaultOptions = {
        folder: 'paperbox',
        resource_type: 'image',
        transformation: [
          { width: 1000, height: 1000, crop: 'limit' },
          { quality: 'auto' },
          { fetch_format: 'auto' }
        ]
      };

      const result = await this.cloudinary.uploader.upload(filePath, {
        ...defaultOptions,
        ...options
      });

      return {
        success: true,
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format
      };
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Upload from buffer (for multer)
  async uploadFromBuffer(buffer, options = {}) {
    return new Promise((resolve, reject) => {
      const defaultOptions = {
        folder: 'paperbox',
        resource_type: 'image',
        transformation: [
          { width: 1000, height: 1000, crop: 'limit' },
          { quality: 'auto' },
          { fetch_format: 'auto' }
        ]
      };

      const uploadStream = this.cloudinary.uploader.upload_stream(
        { ...defaultOptions, ...options },
        (error, result) => {
          if (error) {
            console.error('Cloudinary buffer upload error detailed:', JSON.stringify(error, null, 2));
            reject(error);
          } else {
            resolve({
              success: true,
              url: result.secure_url,
              publicId: result.public_id,
              width: result.width,
              height: result.height,
              format: result.format
            });
          }
        }
      );

      uploadStream.end(buffer);
    });
  }

  // Upload multiple images
  async uploadMultipleImages(files, folder = 'paperbox/products') {
    const uploadPromises = files.map(file => 
      this.uploadFromBuffer(file.buffer, { folder })
    );

    const results = await Promise.allSettled(uploadPromises);
    
    return results.map((result, index) => {
      if (result.status === 'fulfilled') {
        return result.value;
      } else {
        return {
          success: false,
          error: result.reason.message,
          filename: files[index].originalname
        };
      }
    });
  }

  // Delete image
  async deleteImage(publicId) {
    try {
      const result = await this.cloudinary.uploader.destroy(publicId);
      return {
        success: result.result === 'ok',
        result: result.result
      };
    } catch (error) {
      console.error('Cloudinary delete error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Delete multiple images
  async deleteMultipleImages(publicIds) {
    try {
      const result = await this.cloudinary.api.delete_resources(publicIds);
      return {
        success: true,
        deleted: result.deleted
      };
    } catch (error) {
      console.error('Cloudinary bulk delete error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get optimized URL
  getOptimizedUrl(publicId, options = {}) {
    const defaultOptions = {
      fetch_format: 'auto',
      quality: 'auto'
    };

    return this.cloudinary.url(publicId, { ...defaultOptions, ...options });
  }

  // Get thumbnail URL
  getThumbnailUrl(publicId, width = 200, height = 200) {
    return this.cloudinary.url(publicId, {
      width,
      height,
      crop: 'fill',
      fetch_format: 'auto',
      quality: 'auto'
    });
  }
}

module.exports = new CloudinaryService();
