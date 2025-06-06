import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ZodSerializerDto } from 'nestjs-zod';
import { CreateOrderBodyDTO, CreateOrderResDTO, GetOrdersQueryDTO, GetOrdersResDTO } from 'src/routes/order/order.dto';
import { OrderService } from 'src/routes/order/order.service';
import { ActiveUser } from 'src/shared/decorators/active-user.decorator';
import { UserType } from 'src/shared/models/shared-user.model';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  @ZodSerializerDto(GetOrdersResDTO)
  list(@Query() queries: GetOrdersQueryDTO, @ActiveUser('userId') userId: UserType['id']) {
    return this.orderService.list(queries, userId);
  }

  @Post()
  @ZodSerializerDto(CreateOrderResDTO)
  create(@Body() body: CreateOrderBodyDTO, @ActiveUser('userId') userId: UserType['id']) {
    return this.orderService.create(body, userId);
  }
}
