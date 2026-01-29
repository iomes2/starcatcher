import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CotasModule } from './cotas/cotas.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { UsuarioModule } from './usuario/usuario.module';
import { ConsorcioModule } from './consorcio/consorcio.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

//configurar apollo é aqui
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ConsorcioModule,
    UsuarioModule,
    CotasModule,
    AuthModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
