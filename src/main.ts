import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: '*',
    methods: 'GET, POST, PUT, DELETE, PATCH',
    allowedHeaders: 'Content-Type, Accept, Authorization',
    credentials: true,
  });

  app.useStaticAssets(join(__dirname, '..', 'public'), {
    prefix: '/public/', // préfixe optionnel pour l'URL
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
