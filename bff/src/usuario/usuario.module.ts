import { Module } from '@nestjs/common';
import { UsuarioResolver } from './usuario.resolver';

@Module({
  providers: [UsuarioResolver],
})
export class UsuarioModule {}