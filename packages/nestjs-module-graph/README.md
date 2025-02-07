# NestjsModuleGraph

This library provides a graph view of the NestJS module dependencies, and wraps [nestjs-spelunker](https://github.com/jmcdo29/nestjs-spelunker) for ease of use.

It can be used in the normal way of using nestjs modules.

## Installation

```bash
$ npm install nestjs-module-graph
```

## Usage

```typescript
import { Module } from '@nestjs/common';
import { NestjsModuleGraphModule } from 'nestjs-module-graph';

@Module({
  imports: [
    NestjsModuleGraphModule.register({
      ignoreModulePatterns: [
        /^Log*/,
      ],
      serveRoute: '/module-graph',
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
```

