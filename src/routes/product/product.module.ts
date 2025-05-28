import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ProductRepository } from 'src/routes/product/product.repo';
import { ManageProductController } from 'src/routes/product/manage-product.controller';
import { ManageProductService } from 'src/routes/product/manage-product.service';

@Module({
  providers: [ProductService, ManageProductService, ProductRepository],
  controllers: [ProductController, ManageProductController],
})
export class ProductModule {}
