import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';

const logger = new Logger('AppBootstrap');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('PORT');
  const hostname = configService.get('HOST');
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(port, hostname, () =>
    logger.log(`Server running at ${hostname}:${port}`),
  );
}
bootstrap();
