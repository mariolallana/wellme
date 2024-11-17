// WellnessBackend/src/services/imageUpload.service.ts
import mongoose from 'mongoose';
import { GridFSBucket } from 'mongodb';
import { Readable } from 'stream';

export class ImageUploadService {
  private bucket: GridFSBucket;

  constructor() {
    this.bucket = new GridFSBucket(mongoose.connection.db, {
      bucketName: 'foodImages'
    });
  }

  async uploadImage(imageBuffer: Buffer, filename: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const readableStream = Readable.from(imageBuffer);
      const uploadStream = this.bucket.openUploadStream(filename);
      
      readableStream
        .pipe(uploadStream)
        .on('error', reject)
        .on('finish', () => resolve(uploadStream.id.toString()));
    });
  }

  async getImage(imageId: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      const downloadStream = this.bucket.openDownloadStream(new mongoose.Types.ObjectId(imageId));
      
      downloadStream
        .on('data', chunk => chunks.push(chunk))
        .on('error', reject)
        .on('end', () => resolve(Buffer.concat(chunks)));
    });
  }
}