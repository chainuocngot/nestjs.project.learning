import { createZodDto } from 'nestjs-zod';
import { GetProfileResSchema, UpdateProfileResSchema } from 'src/shared/models/shared-user.model';

export class GetProfileResDTO extends createZodDto(GetProfileResSchema) {}

export class UpdateProfileResDTO extends createZodDto(UpdateProfileResSchema) {}
