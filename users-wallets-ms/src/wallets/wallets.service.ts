import { CreateTransferDto } from './dto/create-transfer.dto';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { lastValueFrom, timeout } from 'rxjs';
import { UsersService } from 'src/users/users.service';
import { Connection, Repository } from 'typeorm';
import { CloseWalletDto } from './dto/close-wallet.dto';
import { OperationWithOneWalletDto } from './dto/operation-with-one-wallet.dto';
import { WalletEntity } from './entities/wallet.entity';
import { TransactionType } from './graphql/types/transaction.type';

@Injectable()
export class WalletsService {
  private readonly _logger = new Logger(WalletsService.name);
  constructor(
    @InjectRepository(WalletEntity)
    private readonly _walletRepository: Repository<WalletEntity>,
    @Inject('TRANSACTIONS_SERVICE') private readonly _client: ClientProxy,
    private readonly _connection: Connection,
    private readonly _userService: UsersService,
  ) {}

  async createWallet(userId: string): Promise<WalletEntity> {
    this._logger.debug('create wallet method');
    this._logger.debug(userId);
    const user = await this._userService.user(userId);
    this._logger.debug({ user });
    const wallet = await this._walletRepository.create({ user });
    this._logger.debug({ wallet });

    return await this._walletRepository.save(wallet);
  }

  async wallet(id: string): Promise<WalletEntity> {
    this._logger.debug('show one wallet method');
    this._logger.debug(id);
    const wallet = await this._walletRepository.findOne(id);
    if (!wallet) {
      throw new HttpException('This wallet is not found', HttpStatus.NOT_FOUND);
    }
    this._logger.debug({ wallet });
    return wallet;
  }

  async wallets(): Promise<WalletEntity[]> {
    this._logger.debug('show all wallets method');
    return await this._walletRepository.find();
  }

  async closeWallet(dto: CloseWalletDto): Promise<WalletEntity> {
    this._logger.debug('close wallet method');
    this._logger.debug({ dto });
    const { id, flag } = dto;
    const wallet = await this.wallet(id);
    this._logger.debug({ wallet });
    wallet.accountClosed = flag;
    this._logger.debug({ wallet });
    return await this._walletRepository.save(wallet);
  }

  async deposit(dto: OperationWithOneWalletDto): Promise<string> {
    this._logger.debug('deposit transaction method');
    this._logger.debug({ dto });
    const { amount, description, to } = dto;
    const queryRunner = await this._connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('SERIALIZABLE');
    try {
      const wallet = await this.wallet(to);
      this._logger.debug({ wallet });
      if (wallet.accountClosed === true) {
        throw new HttpException(
          'This wallet is closed',
          HttpStatus.METHOD_NOT_ALLOWED,
        );
      }

      if (wallet.accountLocked === true) {
        throw new HttpException(
          'This wallet is locked',
          HttpStatus.METHOD_NOT_ALLOWED,
        );
      }

      this._logger.debug({ wallet });
      wallet.incoming += amount;

      const response = this._client
        .send({ cmd: 'create-transaction' }, { amount, description, to })
        .pipe(timeout(3000));

      const transaction = await lastValueFrom(response);

      this._logger.debug({ transaction });
      this._walletRepository.save(wallet);
      await queryRunner.commitTransaction();
      return transaction.id;
    } catch (e) {
      this._logger.error(e, 'deposit method error');
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async withdraw(dto: OperationWithOneWalletDto): Promise<string> {
    this._logger.debug('withdraw transaction method');
    this._logger.debug({ dto });
    const { amount, description, to } = dto;
    const queryRunner = await this._connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('SERIALIZABLE');

    try {
      const wallet = await this.wallet(to);
      this._logger.debug({ wallet });
      if (wallet.accountClosed === true) {
        throw new HttpException(
          'This wallet is closed',
          HttpStatus.METHOD_NOT_ALLOWED,
        );
      }

      if (wallet.accountLocked === true) {
        throw new HttpException(
          'This wallet is locked',
          HttpStatus.METHOD_NOT_ALLOWED,
        );
      }

      const negativeAmount = wallet.incoming < amount;

      if (negativeAmount) {
        throw new Error('Not enough money');
      }

      wallet.outgoing += amount;
      wallet.incoming -= amount;

      const response = this._client
        .send({ cmd: 'create-transaction' }, { amount, description, to })
        .pipe(timeout(3000));

      const transaction = await lastValueFrom(response);

      this._logger.debug({ transaction });
      this._walletRepository.save(wallet);
      await queryRunner.commitTransaction();
      return transaction.id;
    } catch (e) {
      this._logger.error(e, 'withdraw method error');
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async transfer(dto: CreateTransferDto): Promise<string> {
    this._logger.debug('transfer transaction method');
    this._logger.debug({ dto });
    const { amount, description, to, from } = dto;
    const queryRunner = await this._connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('SERIALIZABLE');
    try {
      const wallet = await this.wallet(to);
      this._logger.debug({ wallet });
      const senderWallet = await this.wallet(from);
      this._logger.debug({ senderWallet });

      if (wallet.accountClosed === true) {
        throw new HttpException(
          'This wallet is closed',
          HttpStatus.METHOD_NOT_ALLOWED,
        );
      }

      if (wallet.accountLocked === true) {
        throw new HttpException(
          'This wallet is locked',
          HttpStatus.METHOD_NOT_ALLOWED,
        );
      }

      if (senderWallet.accountClosed === true) {
        throw new HttpException(
          'This wallet is closed',
          HttpStatus.METHOD_NOT_ALLOWED,
        );
      }

      if (senderWallet.accountLocked === true) {
        throw new HttpException(
          'This wallet is locked',
          HttpStatus.METHOD_NOT_ALLOWED,
        );
      }

      senderWallet.outgoing += amount;
      senderWallet.incoming -= amount;

      if (senderWallet.incoming > amount) {
        throw new Error('Not enough money');
      }

      wallet.incoming += amount;

      const response = this._client
        .send({ cmd: 'create-transaction' }, { amount, description, to, from })
        .pipe(timeout(3000));

      const transaction = await lastValueFrom(response);

      this._logger.debug({ transaction });
      this._walletRepository.save(wallet);
      this._walletRepository.save(senderWallet);
      await queryRunner.commitTransaction();
      return transaction.id;
    } catch (e) {
      this._logger.error(e, 'transfer method error');
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async showTransactions(walletId: string): Promise<TransactionType[]> {
    this._logger.debug(walletId);
    const response = this._client
      .send({ cmd: 'show-transactions' }, { walletId })
      .pipe(timeout(3000));

    const transactions = await lastValueFrom(response);
    this._logger.debug({ transactions });
    return transactions;
  }
}
