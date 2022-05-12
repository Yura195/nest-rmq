import { TransactionsController } from './transactions.controller';
import { TransactionsResolver } from './transactions.resolver';
import { TransactionsService } from './transactions.service';
import { TransactionEntity } from './entities/transaction.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([TransactionEntity])],
  providers: [TransactionsService, TransactionsResolver],
  controllers: [TransactionsController],
})
export class TransactionsModule {}
