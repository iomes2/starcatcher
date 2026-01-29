import { ObjectType, Field, Int, Float } from '@nestjs/graphql';

@ObjectType('CotaOutput')
export class CotaOutput {
  @Field(() => Int)
  id!: number;

  @Field(() => Int)
  consorcioId!: number;

  @Field(() => Int)
  usuarioId!: number;

  @Field()
  numeroCota!: string;

  @Field(() => Float)
  valor!: number;

  @Field({ nullable: true })
  status?: string;

  // se backend retorna ISO string, use String; ou use GraphQLISODateTime se configurado
  @Field()
  dataCriacao!: string;

  @Field({ nullable: true })
  dataAtualizacao?: string;
}
