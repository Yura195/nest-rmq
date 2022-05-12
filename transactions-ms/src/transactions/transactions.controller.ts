import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionsService } from './transactions.service';

@Controller()
export class TransactionsController {
  private readonly _logger = new Logger(TransactionsController.name);
  constructor(private readonly _transactionsService: TransactionsService) {}

  @MessagePattern({ cmd: 'create-transaction' })
  async createTransaction(@Payload() payload: CreateTransactionDto) {
    this._logger.debug('create transaction message');
    this._logger.debug({ payload });
    return this._transactionsService.create(payload);
  }
}
