import { Injectable } from '@nestjs/common';
import { unlink } from 'fs/promises';
import {
  UploadFileResType,
  UploadPresignedFileBodyType,
  UploadPresignedFileResType,
} from 'src/routes/media/media.model';
import { generateRandomFilename } from 'src/shared/helpers';
import { S3Service } from 'src/shared/services/s3.service';

@Injectable()
export class MediaService {
  constructor(private readonly s3Service: S3Service) {}

  async uploadFile(files: Array<Express.Multer.File>): Promise<UploadFileResType> {
    const result = await Promise.all(
      files.map((file) => {
        return this.s3Service
          .uploadFile({
            filename: `images/${file.filename}`,
            filepath: file.path,
            contentType: file.mimetype,
          })
          .then((res) => ({
            url: res.Location as string,
          }));
      }),
    );

    await Promise.all(files.map((file) => unlink(file.path)));

    return {
      data: result,
    };
  }

  async getPresignedUrl(body: UploadPresignedFileBodyType): Promise<UploadPresignedFileResType> {
    const randomFilename = generateRandomFilename(body.filename);
    const presignedUrl = await this.s3Service.createPresignedUrlWithClient(randomFilename);
    const url = presignedUrl.split('?')[0];

    return {
      presignedUrl,
      url,
    };
  }
}
