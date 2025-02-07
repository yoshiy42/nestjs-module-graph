import { Inject, Injectable } from '@nestjs/common';
import { Module as NestModule } from '@nestjs/core/injector/module';
import { DiscoveryService } from '@nestjs/core';
import { Config } from './main.module';
import { InternalCoreModule } from '@nestjs/core/injector/internal-core-module';
import { SpelunkedTree } from 'nestjs-spelunker';
import { ExplorationModule } from 'nestjs-spelunker/dist/exploration.module';
import { GraphingModule } from 'nestjs-spelunker/dist/graphing.module';

@Injectable()
// nestjs spelunker wrapper
export class MainService {
  private readonly ignoreModulePatterns: (string | RegExp)[];

  constructor(
    @Inject('NESTJS_MODULE_GRAPH_CONFIG') config: Config,
    private readonly discoveryService: DiscoveryService
  ) {
    // by default, ignore this module
    this.ignoreModulePatterns = config.ignoreModulePatterns || [];
    this.ignoreModulePatterns?.push(/^NestjsModuleGraph/);
  }

  getEdges() {
    const tree = this.getTree();
    const root = GraphingModule.graph(tree);
    return GraphingModule.getEdges(root);
  }

  getTree() {
    const modules = this.getTargetModule();
    const tree: SpelunkedTree[] = [];
    modules.forEach((module) => {
      tree.push({
        name: module.metatype.name,
        imports: this.getImports(module),
        providers: ExplorationModule['getProviders'](module),
        controllers: ExplorationModule['getControllers'](module),
        exports: ExplorationModule['getExports'](module),
      });
    });

    return tree;
  }

  private shouldIncludeModule(module: NestModule): boolean {
    return this.ignoreModulePatterns.some((ignorePattern) => {
      if (module.metatype === InternalCoreModule) {
        return false;
      }
      if (typeof ignorePattern === 'string') {
        return ignorePattern !== module.name;
      }
      return !ignorePattern.test(module.name);
    });
  }

  private getTargetModule() {
    const modules = this.discoveryService['getModules']();
    return modules.filter((module) => {
      return this.shouldIncludeModule(module);
    });
  }

  private getImports(module: NestModule): string[] {
    const importsNames: string[] = [];
    for (const importedModule of module.imports.values()) {
      if (this.shouldIncludeModule(importedModule)) {
        importsNames.push(importedModule.metatype.name);
      }
    }
    return importsNames;
  }
}
