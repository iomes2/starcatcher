import { Field, Int, ObjectType, Float } from '@nestjs/graphql';
import { IsInt, IsNotEmpty, IsNumber, IsString } from 'class-validator';

//atribui @ObjectType para que a classe seja reconhecida pelo GraphQL
@ObjectType()
export class Cota {
  @Field(() => Int)
  //sao metodos do validation do class-validator
  @IsInt()
  @IsNotEmpty()
  id: number;

  //atribui @Field para que os campos sejam expostos no GraphQL
  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  consorcioId: number;

  @Field()
  @IsString()
  @IsNotEmpty()
  numeroCota: string;

  @Field(() => Float)
  @IsNumber()
  @IsNotEmpty()
  valor: number;

  @Field()
  @IsString()
  @IsNotEmpty()
  status: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  dataCriacao: String;

  @Field(() => String, { nullable: true })
  @IsString()
  dataAtualizacao: String;
}
