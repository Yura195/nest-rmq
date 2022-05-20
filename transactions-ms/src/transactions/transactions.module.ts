import { ClientsModule } from '@nestjs/microservices';
import { TransactionsController } from './transactions.controller';
import { TransactionsResolver } from './transactions.resolver';
import { TransactionsService } from './transactions.service';
import { TransactionEntity } from './entities/transaction.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { rabbitmqConfig } from 'src/config/rabbitmq.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([TransactionEntity]),
    ClientsModule.registerAsync([rabbitmqConfig]),
  ],
  providers: [TransactionsService, TransactionsResolver],
  controllers: [TransactionsController],
})
export class TransactionsModule {}
