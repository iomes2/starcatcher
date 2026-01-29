import { Field, InputType, Int, Float } from '@nestjs/graphql';

@InputType()
export class CotaInput {
  @Field(() => Int)
  consorcioId: number;

  @Field(() => Int)
  usuarioId: number;

  @Field()
  numeroCota: string;

  @Field(() => Float)
  valor: number;

  @Field()
  status: string;

  @Field(() => String, { nullable: true })
  dataCriacao?: string;

  @Field(() => String, { nullable: true })
  dataAtualizacao?: string;
}
