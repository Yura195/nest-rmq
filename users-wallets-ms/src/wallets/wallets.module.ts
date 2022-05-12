import { UsersModule } from './../users/users.module';
import { rabbitmqConfig } from './../config/rabbitmq.config';
import { WalletsResolver } from './wallets.resolver';
import { WalletsService } from './wallets.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletEntity } from 'src/wallets/entities/wallet.entity';
import { ClientsModule } from '@nestjs/microservices';

@Module({
  imports: [
    TypeOrmModule.forFeature([WalletEntity]),
    ClientsModule.register([rabbitmqConfig]),
    UsersModule,
  ],
  providers: [WalletsService, WalletsResolver],
})
export class WalletsModule {}
