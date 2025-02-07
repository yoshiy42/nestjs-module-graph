import { DynamicModule, Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { MainService } from './main.service';
import { DiscoveryModule } from '@nestjs/core';
import { MainController } from './main.controller';

export interface Config {
  ignoreModulePatterns?: (string | RegExp)[];
  serveRoute?: string;
}

@Module({})
export class NestjsModuleGraphModule {
  static register(config: Config): DynamicModule {
    return {
      module: NestjsModuleGraphModule,
      imports: [
        DiscoveryModule,
        ServeStaticModule.forRoot({
          rootPath: join(
            __dirname,
            '..',
            '..',
            '..',
            'apps',
            'frontend',
            'dist',
          ),
          serveStaticOptions: {
            fallthrough: false,
          },
          serveRoot: config.serveRoute ?? '',
        }),
      ],
      providers: [
        {
          provide: 'NESTJS_MODULE_GRAPH_CONFIG',
          useValue: config,
        },
        MainService,
      ],
      controllers: [MainController],
      exports: [],
    };
  }
}
