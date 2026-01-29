import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class AuthInput {
  @Field()
  nome: string;

  @Field()
  senha: string;
}
