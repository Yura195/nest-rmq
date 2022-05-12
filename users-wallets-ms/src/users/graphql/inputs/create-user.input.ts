import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsString } from 'class-validator';

@InputType({ description: 'Input for create user' })
export class CreateUserInput {
  @Field(() => String, { description: 'Name of user' })
  @IsString()
  name: string;

  @Field(() => String, { description: 'Unique email of user' })
  @IsEmail({}, { message: 'This email is incorrect' })
  email: string;
}
