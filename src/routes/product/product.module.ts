import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ProductRepository } from 'src/routes/product/product.repo';

@Module({
  providers: [ProductService, ProductRepository],
  controllers: [ProductController],
})
export class ProductModule {}
