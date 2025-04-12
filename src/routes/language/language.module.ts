import { Module } from '@nestjs/common';
import { LanguageService } from './language.service';
import { LanguageController } from './language.controller';
import { LanguageRepository } from 'src/routes/language/language.repo';

@Module({
  providers: [LanguageService, LanguageRepository],
  controllers: [LanguageController],
})
export class LanguageModule {}
