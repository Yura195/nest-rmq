import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  ClientProvider,
  ClientsProviderAsyncOptions,
  Transport,
} from '@nestjs/microservices';

export const rabbitmqConfig: ClientsProviderAsyncOptions = {
  imports: [ConfigModule],
  useFactory: (configService: ConfigService): ClientProvider => {
    const user = configService.get('RABBITMQ_USER');
    const password = configService.get('RABBITMQ_PASSWORD');
    const host = configService.get('RABBITMQ_HOST');
    return {
      transport: Transport.RMQ,
      options: {
        urls: [`amqps://${user}:${password}@${host}`],
        queue: configService.get('RABBITMQ_QUEUE_NAME_INPUT'),
      },
    };
  },
  name: 'USERS_WALLETS_SERVICE',
  inject: [ConfigService],
};
