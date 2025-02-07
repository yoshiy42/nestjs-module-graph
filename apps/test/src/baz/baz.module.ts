import { Module } from '@nestjs/common';
import { BazService } from './baz.service';

@Module({
  providers: [BazService],
})
export class BazModule {}
