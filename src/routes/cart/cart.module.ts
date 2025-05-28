import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { CartRepository } from 'src/routes/cart/cart.repo';

@Module({
  providers: [CartService, CartRepository],
  controllers: [CartController],
})
export class CartModule {}
