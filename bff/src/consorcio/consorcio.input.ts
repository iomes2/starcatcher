import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class ConsorcioInput {
  @Field()
  nome: string;

  @Field({ nullable: true })
  descricao?: string;

  @Field()
  dataCriacao: string;

  @Field({ nullable: true })
  dataAtualizacao?: string;
}
