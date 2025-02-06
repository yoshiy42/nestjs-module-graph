import { Module } from '@nestjs/common';

@Module({
  controllers: [],
  providers: [],
  exports: [],
})
export class NestjsModuleGraphMainModule {}

export function sayHello() {
  console.log('hello!!!!!');
}