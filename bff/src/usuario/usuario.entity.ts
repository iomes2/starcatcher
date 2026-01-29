import { Field, ObjectType, Int } from '@nestjs/graphql';

@ObjectType()
export class Usuario {
  @Field(() => Int)
  id: number;

  @Field()
  nome: string;

  @Field()
  email: string;

  @Field()
  senha: string;

  @Field()
  dataCriacao: Date;

  @Field()
  dataAtualizacao: Date;
}