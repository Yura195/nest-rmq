import { Field, Float, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TransactionType {
  @Field(() => String)
  id: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  @Field(() => Float)
  amount: number;

  @Field(() => String)
  description: string;

  @Field(() => String)
  to: string;

  @Field(() => String, { nullable: true })
  from: string;
}
