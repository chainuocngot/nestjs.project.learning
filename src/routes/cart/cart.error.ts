import { BadRequestException, NotFoundException } from '@nestjs/common';

export const SKUNotFoundException = new NotFoundException('Error.SKUNotFound');

export const SKUOutOfStockException = new BadRequestException('Error.SKUOutOfStock');

export const ProductNotFoundException = new NotFoundException('Error.ProductNotFound');
