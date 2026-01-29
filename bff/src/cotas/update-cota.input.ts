import { InputType, Field, Int, Float } from '@nestjs/graphql';

@InputType('UpdateCotaInput')
export class UpdateCotaInput {
  @Field(() => Int, { nullable: true })
  consorcioId?: number;

  @Field(() => Int, { nullable: true })
  usuarioId?: number;

  @Field({ nullable: true })
  numeroCota?: string;

  @Field(() => Float, { nullable: true })
  valor?: number;

  @Field({ nullable: true })
  status?: string;

  @Field({ nullable: true })
  dataCriacao?: Date;

  @Field({ nullable: true })
  dataAtualizacao?: Date;
}
