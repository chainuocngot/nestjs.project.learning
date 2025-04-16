import { Module } from '@nestjs/common';
import { BrandTranslationService } from './brand-translation.service';
import { BrandTranslationController } from './brand-translation.controller';
import { BrandTranslationRepository } from 'src/routes/brand/brand-translation/brand-translation.repo';

@Module({
  providers: [BrandTranslationService, BrandTranslationRepository],
  controllers: [BrandTranslationController],
})
export class BrandTranslationModule {}
