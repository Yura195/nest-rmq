import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';

const logger = new Logger('AppBootstrap');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('PORT');
  const hostname = configService.get('HOST');
  const user = configService.get('RABBITMQ_USER');
  const password = configService.get('RABBITMQ_PASSWORD');
  const host = configService.get('RABBITMQ_HOST');
  const queuName = configService.get('RABBITMQ_QUEUE_NAME');

  app.useGlobalPipes(new ValidationPipe());

  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [`amqps://${user}:${password}@${host}`],
      queue: queuName,
    },
  });

  await app.startAllMicroservices();
  await app.listen(port, hostname, () =>
    logger.log(`Server running at ${hostname}:${port}`),
  );
}
bootstrap();
