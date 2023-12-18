import {
  Controller,
  Get,
  HttpCode,
  VERSION_NEUTRAL,
  Version,
} from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from '#api/auth/guards/auth.guard';

@Controller()
@Public()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @HttpCode(204)
  @Version(VERSION_NEUTRAL)
  healthCheck(): void {}

  @Get('versions')
  @Version(VERSION_NEUTRAL)
  listVersions() {
    return this.appService.listVersions();
  }
}
