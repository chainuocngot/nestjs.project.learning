import { faker } from '@faker-js/faker';

import { HashingService } from 'src/shared/services/hashing.service';
import { PrismaService } from 'src/shared/services/prisma.service';

const prisma = new PrismaService();
const hashingService = new HashingService();

const FAKE_USERS = [
  {
    email: 'seller1@gmail.com',
    name: 'Seller 1',
    phoneNumber: 'None',
    roleId: 3,
  },
  {
    email: 'seller2@gmail.com',
    name: 'Seller 2',
    phoneNumber: 'None',
    roleId: 3,
  },
  {
    email: 'client@gmail.com',
    name: 'Client',
    phoneNumber: 'None',
    roleId: 2,
  },
];

const fake = async () => {
  //Create 2 sellers, 1 client user
  const hashedPassword = await hashingService.hash('123456');

  await Promise.all(
    FAKE_USERS.map((payload) =>
      prisma.user.create({
        data: {
          ...payload,
          password: hashedPassword,
        },
      }),
    ),
  );

  //Create 3 categories
  const categories = await Promise.all(
    Array.from({ length: 3 }).map(() =>
      prisma.category.create({
        data: {
          name: faker.commerce.department(),
          logo: faker.image.url(),
          parentCategoryId: null,
        },
      }),
    ),
  );
  console.log('Created 3 categories:', categories);

  //Create 3 brands
  const brands = await Promise.all(
    Array.from({ length: 3 }).map(() =>
      prisma.brand.create({
        data: {
          name: faker.commerce.department(),
          logo: faker.image.url(),
        },
      }),
    ),
  );
  console.log('Created 3 brands:', brands);

  //Create 20 Products and SKUs
  await Promise.all(
    Array.from({ length: 20 }).map(async () => {
      const random = Math.random();
      let publishedAt: string | null = null;
      if (random < 0.1) {
        publishedAt = null; // 1/3 xác suất là null
      } else if (random < 0.8) {
        publishedAt = faker.date.past({ years: 2 }).toISOString(); // 1/3 xác suất là ngày trong quá khứ (2 năm trở lại)
      } else {
        publishedAt = faker.date.future({ years: 2 }).toISOString(); // 1/3 xác suất là ngày trong tương lai (2 năm tới)
      }

      const category = categories[Math.floor(Math.random() * categories.length)];
      const product = await prisma.product.create({
        data: {
          name: faker.commerce.productName(),
          basePrice: parseFloat(faker.commerce.price({ min: 10, max: 1000 })),
          virtualPrice: parseFloat(faker.commerce.price({ min: 10, max: 1000 })),
          brandId: faker.number.int({ min: 1, max: 3 }),
          images: [faker.image.url(), faker.image.url()],
          variants: [
            {
              value: 'Màu sắc',
              options: Array.from({ length: faker.number.int({ min: 2, max: 4 }) }, () => faker.color.human()),
            },
            {
              value: 'Kích thước',
              options: ['S', 'M', 'L', 'XL'].slice(0, faker.number.int({ min: 2, max: 4 })),
            },
          ],
          categories: {
            connect: { id: category.id },
          },
          createdById: faker.number.int({ min: 1, max: 3 }),
          publishedAt,
        },
      });

      // Tạo 1-3 SKU cho mỗi sản phẩm
      const skuCount = Math.floor(Math.random() * 3) + 1;
      for (let i = 0; i < skuCount; i++) {
        await prisma.sKU.create({
          data: {
            value: `${faker.color.human()} ${faker.commerce.productMaterial()}`,
            price: parseFloat(faker.commerce.price({ min: 10, max: 1000 })),
            stock: faker.number.int({ min: 0, max: 100 }),
            image: faker.image.url(),
            productId: product.id,
            createdById: product.createdById,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });
      }

      return product;
    }),
  );

  console.log('Created 20 products!');
};

fake();
