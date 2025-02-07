import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NestjsModuleGraphModule } from 'nestjs-module-graph';
import { FooModule } from '../foo/foo.module';
import { BarModule } from '../bar/bar.module';

@Module({
  imports: [
    NestjsModuleGraphModule.register({
      ignoreModulePatterns: [
        /^Log*/,
      ],
      serveRoute: '/module-graph',
    }),
    FooModule,
    BarModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
