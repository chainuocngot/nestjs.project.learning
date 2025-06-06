import { Injectable } from '@nestjs/common';
import { CreateOrderBodyType, GetOrdersQueryType } from 'src/routes/order/order.model';
import { OrderRepository } from 'src/routes/order/order.repo';
import { UserType } from 'src/shared/models/shared-user.model';

@Injectable()
export class OrderService {
  constructor(private readonly orderRepository: OrderRepository) {}

  list(queries: GetOrdersQueryType, userId: UserType['id']) {
    return this.orderRepository.list(queries, userId);
  }

  create(body: CreateOrderBodyType, userId: UserType['id']) {
    return this.orderRepository.create(body, userId);
  }
}
