import { Module } from '@nestjs/common';
import { ConsorcioResolver } from './consorcio.resolver';

@Module({
  providers: [ConsorcioResolver],
})
export class ConsorcioModule {}