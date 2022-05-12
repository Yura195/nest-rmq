import { ClientProviderOptions, Transport } from '@nestjs/microservices';

export const rabbitmqConfig: ClientProviderOptions = {
  name: 'TRANSACTIONS_SERVICE',
  transport: Transport.RMQ,
  options: {
    urls: [
      `amqps://xaagwlkp:eR722UqRPvHhBynAEyZfQnBwhJ7jieVd@sparrow.rmq.cloudamqp.com/xaagwlkp`,
    ],
    queue: 'transaction-queue',
  },
};
