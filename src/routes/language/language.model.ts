import { LanguageSchema } from 'src/shared/models/shared-language.model';
import { z } from 'zod';

export const GetLanguagesResSchema = z.object({
  data: z.array(LanguageSchema),
  totalItems: z.number(),
});

export const GetLanguageParamsSchema = z
  .object({
    languageId: z.string().max(10),
  })
  .strict();

export const GetLanguageDetailResSchema = LanguageSchema;

export const CreateLanguageBodySchema = LanguageSchema.pick({
  id: true,
  name: true,
}).strict();

export const CreateLanguageResSchema = LanguageSchema;

export const UpdateLanguageBodySchema = LanguageSchema.pick({
  name: true,
}).strict();

export const UpdateLanguageResSchema = LanguageSchema;

export type GetLanguagesResType = z.infer<typeof GetLanguagesResSchema>;
export type GetLanguageParamsType = z.infer<typeof GetLanguageParamsSchema>;
export type GetLanguageDetailResType = z.infer<typeof GetLanguageDetailResSchema>;
export type CreateLanguageBodyType = z.infer<typeof CreateLanguageBodySchema>;
export type CreateLanguageResType = z.infer<typeof CreateLanguageResSchema>;
export type UpdateLanguageBodyType = z.infer<typeof UpdateLanguageBodySchema>;
export type UpdateLanguageResType = z.infer<typeof UpdateLanguageResSchema>;
