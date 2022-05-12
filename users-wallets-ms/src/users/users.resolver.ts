import { Logger } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateUserInput } from './graphql/inputs/create-user.input';
import { UserType } from './graphql/types/user.type';
import { UsersService } from './users.service';

@Resolver(() => UserType)
export class UsersResolver {
  private readonly _logger = new Logger(UsersResolver.name);

  constructor(private readonly _usersService: UsersService) {}

  @Query(() => UserType)
  async user(
    @Args('id', { type: () => String }) id: string,
  ): Promise<UserType> {
    this._logger.debug('show one user resolver');
    this._logger.debug(id);
    return await this._usersService.user(id);
  }

  @Query(() => UserType)
  async users(): Promise<UserType[]> {
    this._logger.debug('show all users resolver');
    return await this._usersService.users();
  }

  @Mutation(() => UserType, { name: 'createUser' })
  async createUser(@Args('input') input: CreateUserInput): Promise<UserType> {
    this._logger.debug('create one user resolver');
    this._logger.debug({ input });
    return await this._usersService.createUser(input);
  }

  @Mutation(() => UserType, { name: 'deleteUser' })
  async deleteUser(@Args('id') id: string): Promise<UserType> {
    this._logger.debug('delete one user resolver');
    this._logger.debug(id);
    return await this._usersService.deleteUser(id);
  }

  @Mutation(() => UserType, { name: 'recoverUser' })
  async recoverUser(@Args('id') id: string): Promise<UserType> {
    this._logger.debug('recover one user resolver');
    this._logger.debug(id);
    return await this._usersService.recoverUser(id);
  }
}
