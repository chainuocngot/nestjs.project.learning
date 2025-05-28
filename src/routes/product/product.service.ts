import { Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { GetProductsQueryType, ProductType } from 'src/routes/product/product.model';
import { ProductRepository } from 'src/routes/product/product.repo';
import { NotFoundRecordException } from 'src/shared/error';

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  list(queries: GetProductsQueryType) {
    return this.productRepository.list({
      queries,
      languageId: I18nContext.current()?.lang as string,
      isPublic: true,
    });
  }

  async getDetail(productId: ProductType['id']) {
    const product = await this.productRepository.getDetail({
      languageId: I18nContext.current()?.lang as string,
      productId,
      isPublic: true,
    });

    if (!product) {
      throw NotFoundRecordException;
    }

    return product;
  }
}
