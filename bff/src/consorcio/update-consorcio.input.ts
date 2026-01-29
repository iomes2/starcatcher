import { InputType, Field } from '@nestjs/graphql';

@InputType('UpdateConsorcioInput')
export class UpdateConsorcioInput {
  @Field({ nullable: true })
  nome?: string;

  @Field({ nullable: true })
  descricao?: string;

  @Field({ nullable: true })
  dataCriacao?: string;

  @Field({ nullable: true })
  dataAtualizacao?: string;
}
