import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  useFactory: (configService: ConfigService): TypeOrmModuleOptions => {
    const database = configService.get<string>('PSQL_DATABASE');

    if (database === undefined) {
      throw new Error(
        "Environment variable 'PSQL_DATABASE' cannot be undefined",
      );
    }

    return {
      type: 'postgres',
      entities: [`${__dirname}/../**/*.entity{.ts,.js}`],
      database,
      host: configService.get('PSQL_HOST'),
      port: configService.get('PSQL_PORT'),
      username: configService.get('PSQL_USERNAME'),
      password: configService.get('PSQL_PASSWORD'),
      synchronize: false,
    };
  },
  inject: [ConfigService],
};
