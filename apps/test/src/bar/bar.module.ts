import { Module } from '@nestjs/common';
import { BarService } from './bar.service';
import { BarController } from './bar.controller';
import { BazModule } from '../baz/baz.module';

@Module({
  imports: [BazModule],
  controllers: [BarController],
  providers: [BarService],
})
export class BarModule {}
