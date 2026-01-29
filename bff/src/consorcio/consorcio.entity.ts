import { Field, ObjectType, Int } from '@nestjs/graphql';

@ObjectType()
export class Consorcio {
  @Field(() => Int)
  id: number;

  @Field()
  nome: string;

  @Field()
  descricao: string;

  @Field()
  dataCriacao: Date;

  @Field()
  dataAtualizacao: Date;
}