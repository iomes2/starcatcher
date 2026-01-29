import { Module } from '@nestjs/common';
import { CotasResolver } from './cotas.resolver';
//remover qnd producao:
//um module p casa resolver
//um module é um agrupamento de funcionalidades relacionadas, como resolvers, services, etc.
//aqui é onde o resolver é importado e declarado
//o module é responsável por organizar o código e permitir que o NestJS entenda como as partes do aplicativo se relacionam entre si.
@Module({
    providers: [CotasResolver],
})
export class CotasModule {
    
}