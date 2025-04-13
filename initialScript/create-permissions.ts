import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';
import { HTTPMethod } from 'src/shared/constants/auth.constant';
import { PrismaService } from 'src/shared/services/prisma.service';

const prisma = new PrismaService();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3001);
  const server = app.getHttpAdapter().getInstance();
  const router = server.router;

  const permissionsInDb = await prisma.permission.findMany({
    where: {
      deletedAt: null,
    },
  });

  const availableRoutes: {
    path: string;
    method: (typeof HTTPMethod)[keyof typeof HTTPMethod];
    name: string;
  }[] = router.stack
    .map((layer) => {
      if (layer.route) {
        const path = layer.route?.path;
        const method = String(layer.route?.stack[0].method).toUpperCase();

        return {
          path,
          method,
          name: `${method} ${path}`,
        };
      }
    })
    .filter((item) => item !== undefined);

  const permissionsInDbMap: Record<string, (typeof permissionsInDb)[0]> = permissionsInDb.reduce((acc, item) => {
    acc[`${item.method}-${item.path}`] = item;

    return acc;
  }, {});

  const availableRoutesMap: Record<string, (typeof availableRoutes)[0]> = availableRoutes.reduce((acc, item) => {
    acc[`${item.method}-${item.path}`] = item;

    return acc;
  }, {});

  const permissionsToDelete = permissionsInDb.filter((item) => {
    return !availableRoutesMap[`${item.method}-${item.path}`];
  });

  if (permissionsToDelete.length > 0) {
    const deleteResult = await prisma.permission.deleteMany({
      where: {
        id: {
          in: permissionsToDelete.map((item) => item.id),
        },
      },
    });
    console.log('Deleted permissions:', deleteResult.count);
  } else {
    console.log('No permissions to delete');
  }

  const routesToAdd = availableRoutes.filter((item) => {
    return !permissionsInDbMap[`${item.method}-${item.path}`];
  });

  if (routesToAdd.length > 0) {
    const permissionsToAdd = await prisma.permission.createMany({
      data: routesToAdd,
      skipDuplicates: true,
    });
    console.log('Added permissions:', permissionsToAdd.count);
  } else {
    console.log('No permissions to add');
  }

  process.exit(0);
}

bootstrap();
