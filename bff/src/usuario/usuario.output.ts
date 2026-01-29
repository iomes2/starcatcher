import { ObjectType, Field, Int } from '@nestjs/graphql';
import { CotaOutput } from '../cotas/cota.output';

@ObjectType()
export class UsuarioOutput {
  @Field(() => Int, { nullable: true })
  id?: number;

  @Field({ nullable: true })
  nome?: string;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  dataCriacao?: string;

  @Field({ nullable: true })
  dataAtualizacao?: string;

  @Field(() => [CotaOutput], { nullable: 'itemsAndList' })
  cotas?: CotaOutput[];
}
