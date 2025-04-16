import { createZodDto } from 'nestjs-zod';
import {
  UploadFileResSchema,
  UploadPresignedFileBodySchema,
  UploadPresignedFileResSchema,
} from 'src/routes/media/media.model';

export class UploadFileResDTO extends createZodDto(UploadFileResSchema) {}

export class UploadPresignedFileBodyDTO extends createZodDto(UploadPresignedFileBodySchema) {}

export class UploadPresignedFileResDTO extends createZodDto(UploadPresignedFileResSchema) {}
