import { Field, InputType } from '@nestjs/graphql';
import { IsBoolean, IsString } from 'class-validator';

@InputType({ description: 'Input for close wallet function' })
export class CloseWalletInput {
  @Field(() => String, { description: 'Unique ID of wallet' })
  @IsString()
  id: string;

  @Field(() => Boolean, { description: 'Flag for check wallet' })
  @IsBoolean()
  flag: boolean;
}
