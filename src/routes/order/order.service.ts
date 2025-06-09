import { Injectable } from '@nestjs/common';
import { CreateOrderBodyType, GetOrdersQueryType } from 'src/routes/order/order.model';
import { OrderProducer } from 'src/routes/order/order.producer';
import { OrderRepository } from 'src/routes/order/order.repo';
import { OrderType } from 'src/shared/models/shared-order.model';
import { UserType } from 'src/shared/models/shared-user.model';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly orderProducer: OrderProducer,
  ) {}

  list(queries: GetOrdersQueryType, userId: UserType['id']) {
    return this.orderRepository.list(queries, userId);
  }

  async create(body: CreateOrderBodyType, userId: UserType['id']) {
    const result = await this.orderRepository.create(body, userId);
    await this.orderProducer.addCancelPaymentJob(result.paymentId);

    return {
      data: result.orders,
    };
  }

  findById(userId: UserType['id'], orderId: OrderType['id']) {
    return this.orderRepository.findById(userId, orderId);
  }

  cancel(userId: UserType['id'], orderId: OrderType['id']) {
    return this.orderRepository.cancel(userId, orderId);
  }
}
