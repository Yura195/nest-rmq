import { IsNumber, IsPositive, IsString } from 'class-validator';
import { Field, Float, InputType } from '@nestjs/graphql';

@InputType({ description: 'Input for transfer function between two wallets' })
export class CreateTransferInput {
  @Field(() => Float, { description: 'Transferred money' })
  @IsNumber()
  @IsPositive({ message: 'please,enter a positive number' })
  amount: number;

  @Field(() => String, { description: 'Descriptions for transactions' })
  @IsString()
  description: string;

  @Field(() => String, {
    description: 'Id of the wallet to which you want to transfer money',
  })
  @IsString()
  to: string;

  @Field(() => String, {
    description: 'Id of the sender wallet',
  })
  @IsString()
  from: string;
}
