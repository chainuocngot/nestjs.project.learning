import { z } from 'zod';

export const UploadFileResSchema = z.object({
  data: z.array(
    z.object({
      url: z.string(),
    }),
  ),
});

export const UploadPresignedFileBodySchema = z
  .object({
    filename: z.string(),
    filesize: z
      .number()
      .int()
      .positive()
      .max(5 * 1024 * 1024), //5MB
  })
  .strict();

export const UploadPresignedFileResSchema = z.object({
  presignedUrl: z.string(),
  url: z.string(),
});

export type UploadFileResType = z.infer<typeof UploadFileResSchema>;
export type UploadPresignedFileBodyType = z.infer<typeof UploadPresignedFileBodySchema>;
export type UploadPresignedFileResType = z.infer<typeof UploadPresignedFileResSchema>;
