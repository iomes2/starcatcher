import { InputType, Field, Int } from '@nestjs/graphql';
import { CotaInput } from 'src/cotas/cota.input';

@InputType()
export class UsuarioInput {
  @Field()
  nome: string;

  @Field()
  email: string;

  @Field()
  senha: string;

  @Field()
  dataCriacao: string;

  @Field({ nullable: true })
  dataAtualizacao?: string;
}
