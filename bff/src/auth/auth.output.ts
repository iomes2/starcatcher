import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class AuthOutput {
  @Field()
  token: string;
}
