import { Field, ObjectType } from '@nestjs/graphql';
import { WalletType } from 'src/wallets/graphql/types/wallet.type';

@ObjectType()
export class UserType {
  @Field(() => String)
  id: string;

  @Field(() => String)
  name: string;

  @Field(() => String)
  email: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  @Field(() => Date)
  deletedAt: Date;

  @Field(() => [WalletType], { nullable: true })
  wallets: WalletType[];
}
