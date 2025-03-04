import { createZodDto } from 'nestjs-zod';
import { RegisterBodySchema, RegisterResSchema, SendOTPBodySchema } from 'src/routes/auth/auth.model';

export class RegsiterBodyDTO extends createZodDto(RegisterBodySchema) {}

export class RegisterResDTO extends createZodDto(RegisterResSchema) {}

export class SendOTPBodyDTO extends createZodDto(SendOTPBodySchema) {}
