import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionEntity } from './entities/transaction.entity';
import { State } from './enums/state.enum';

@Injectable()
export class TransactionsService {
  private readonly _logger = new Logger(TransactionsService.name);
  private _stateTransaction = State.WORKING;

  constructor(
    @InjectRepository(TransactionEntity)
    private readonly _transactionRepository: Repository<TransactionEntity>,
    @Inject('TRANSACTIONS_SERVICE') private readonly _client: ClientProxy,
    private readonly _connection: Connection,
  ) {}

  async transactions(walletId: string): Promise<TransactionEntity[]> {
    this._logger.debug('show all transactions method');
    this._logger.debug(walletId);
    return await this._transactionRepository.find({
      where: [{ to: walletId }, { from: walletId }],
    });
  }

  async transaction(id: string): Promise<TransactionEntity> {
    this._logger.debug('show one transaction method');
    this._logger.debug(id);
    const transaction = await this._transactionRepository.findOne(id);
    if (!transaction) {
      throw new HttpException('This wallet is not found', HttpStatus.NOT_FOUND);
    }

    this._logger.debug({ transaction });
    return transaction;
  }

  async create(dto: CreateTransactionDto): Promise<TransactionEntity> {
    this._logger.debug('create one transaction method');
    this._logger.debug({ dto });
    const queryRunner = await this._connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('SERIALIZABLE');
    try {
      const transaction = await this._transactionRepository.create(dto);
      this._client.emit('response-to-wallet-user', {
        statе: State.PREPARED,
      });
      this._logger.debug({ transaction });

      if (this._stateTransaction === State.PREPARED) {
        await queryRunner.commitTransaction();
        return await this._transactionRepository.save(transaction);
      } else {
        throw new Error('Error for create transactions');
      }
    } catch (e) {
      this._logger.error(e, 'deposit method error');
      await queryRunner.rollbackTransaction();
      this._client.emit('response-to-wallet-user', {
        statе: State.ABORTED,
      });
    } finally {
      this._stateTransaction = State.WORKING;
      await queryRunner.release();
    }
  }

  async changeState(state: State): Promise<void> {
    this._stateTransaction = state;
  }
}
