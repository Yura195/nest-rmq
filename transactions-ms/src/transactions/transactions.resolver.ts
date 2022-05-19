import { Logger } from '@nestjs/common';
import { Args, Query, Resolver, Mutation } from '@nestjs/graphql';
import { CreateTransactionInput } from './graphql/inputs/create-transaction.input';
import { TransactionType } from './graphql/types/transaction.type';
import { TransactionsService } from './transactions.service';

@Resolver(() => TransactionType)
export class TransactionsResolver {
  private readonly _logger = new Logger(TransactionsResolver.name);

  constructor(private readonly _transactionsService: TransactionsService) {}

  @Query(() => TransactionType)
  async transaction(
    @Args('id', { type: () => String }) id: string,
  ): Promise<TransactionType> {
    this._logger.debug('show one transaction resolver');
    this._logger.debug(id);
    return await this._transactionsService.transaction(id);
  }

  @Query(() => [TransactionType])
  async transactions(
    @Args('wallet_id', { type: () => String }) wallet_id: string,
  ): Promise<TransactionType[]> {
    this._logger.debug('show all transactions resolver');
    this._logger.debug(wallet_id);
    return await this._transactionsService.transactions(wallet_id);
  }

  // @Mutation(() => TransactionType, { description: 'Create transaction' })
  // async createTransaction(
  //   @Args('createTransactionInput')
  //   createTransactionInput: CreateTransactionInput,
  // ): Promise<TransactionType> {
  //   return await this._transactionsService.create(createTransactionInput);
  // }
}
