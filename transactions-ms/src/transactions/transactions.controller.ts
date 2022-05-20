import { State } from './../../../users-wallets-ms/src/wallets/enums/state.enum';
import { Controller, Logger } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionsService } from './transactions.service';

@Controller()
export class TransactionsController {
  private readonly _logger = new Logger(TransactionsController.name);
  constructor(private readonly _transactionsService: TransactionsService) {}

  @EventPattern({ cmd: 'create-transaction' })
  async createTransaction(
    @Payload() payload: CreateTransactionDto,
    @Ctx() context: RmqContext,
  ) {
    this._logger.debug('create transaction message');
    this._logger.debug({ payload });

    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);
    return this._transactionsService.create(payload);
  }

  @MessagePattern({ cmd: 'show-transactions' })
  async showTransactions(
    @Payload() walletId: string,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);
    this._logger.debug(walletId);
    return this._transactionsService.transactions(walletId);
  }

  @EventPattern({ cmd: 'response-to-transaction' })
  async changeStatus(
    @Payload() data: { state: State },
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const orginalMessage = context.getMessage();

    channel.ack(orginalMessage);

    return await this._transactionsService.changeState(data.state);
  }
}
