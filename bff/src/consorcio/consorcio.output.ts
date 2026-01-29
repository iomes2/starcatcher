import { Field, ObjectType, Int } from '@nestjs/graphql';
import { CotaOutput } from 'src/cotas/cota.output';

@ObjectType()
export class ConsorcioOutput {
  @Field(() => Int)
  id: number;

  @Field()
  nome: string;

  @Field({nullable: true})
  descricao: string;

  @Field()
  dataCriacao: string;

  @Field({nullable: true})
  dataAtualizacao?: string;

  @Field(() => [CotaOutput], { nullable: 'itemsAndList' })
  cotas?: CotaOutput[];
}