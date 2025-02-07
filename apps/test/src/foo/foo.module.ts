import { Module } from '@nestjs/common';
import { FooService } from './foo.service';
import { FooController } from './foo.controller';
import { BazModule } from '../baz/baz.module';

@Module({
  imports: [BazModule],
  controllers: [FooController],
  providers: [FooService],
})
export class FooModule {}
