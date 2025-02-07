import { Controller, Get  } from '@nestjs/common';
import { MainService } from './main.service';
import { SpelunkedEdge } from 'nestjs-spelunker';

@Controller('module-graph')
export class MainController {
  constructor(
    private readonly service: MainService,
  ) {}

  @Get()
  getHello(): SpelunkedEdge[] {
    return this.service.getEdges();
  }
}
