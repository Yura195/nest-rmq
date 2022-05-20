import { UsersModule } from './../users/users.module';
import { WalletsResolver } from './wallets.resolver';
import { WalletsService } from './wallets.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletEntity } from 'src/wallets/entities/wallet.entity';
import { ClientsModule } from '@nestjs/microservices';
import { rabbitmqConfig } from 'src/config/rabbitmq.config';
import { WalletsController } from './wallets.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([WalletEntity]),
    ClientsModule.registerAsync([rabbitmqConfig]),
    UsersModule,
  ],
  providers: [WalletsService, WalletsResolver],
  controllers: [WalletsController],
})
export class WalletsModule {}
