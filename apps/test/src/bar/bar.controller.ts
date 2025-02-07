import { Controller } from '@nestjs/common';
import { BarService } from './bar.service';

@Controller('bar')
export class BarController {
  constructor(private readonly barService: BarService) {}
}
