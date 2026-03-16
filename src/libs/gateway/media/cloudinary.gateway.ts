import { v2 as cloudinary } from 'cloudinary';
import sharp from 'sharp';
import type { Config } from '@/libs/config/index.js';

export interface MediaGateway {
  upload(buffer: Buffer, mimetype: string): Promise<string>;
}

export const initCloudinaryGateway = (config: Config): MediaGateway => {
  cloudinary.config({
    cloud_name: config.cloudinary.cloudName,
    api_key: config.cloudinary.apiKey,
    api_secret: config.cloudinary.apiSecret,
  });

  const upload = async (buffer: Buffer, mimetype: string): Promise<string> => {
    const webpBuffer = await sharp(buffer)
      .resize({ width: 1200, withoutEnlargement: true })
      .webp({ quality: 85 })
      .toBuffer();

    const resourceType = mimetype.startsWith('image/') ? 'image' : 'raw';

    return new Promise<string>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ resource_type: resourceType, format: 'webp' }, (error, result) => {
          if (error || !result) {
            reject(error ?? new Error('Cloudinary upload returned no result'));
            return;
          }
          resolve(result.secure_url);
        })
        .end(webpBuffer);
    });
  };

  return { upload };
};
