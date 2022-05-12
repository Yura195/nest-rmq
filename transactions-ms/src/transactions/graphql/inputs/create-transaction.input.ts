import { Field, Float, InputType } from '@nestjs/graphql';
import { IsInt, IsOptional, IsPositive, IsString } from 'class-validator';

@InputType({
  description:
    'Input for create transactions for one wallet or transactions between two wallets',
})
export class CreateTransactionInput {
  @Field(() => Float, { description: 'Money for transactions' })
  @IsInt()
  @IsPositive({ message: 'Please, enter a positive number' })
  amount: number;

  @Field(() => String, { description: 'Descriptions for transactions' })
  @IsString()
  description: string;

  @Field(() => String, {
    description: 'id of the wallet to which you want to transfer money',
  })
  @IsString()
  to: string;

  @Field(() => String, {
    description: 'id of the sender wallet',
  })
  @IsString()
  @IsOptional()
  from?: string;
}
