import { Get, Controller, Render } from '@nestjs/common';
import { Public } from './auth/decorators/public.decorator';

@Controller()
export class AppController {
  @Get()
  @Public()
  @Render('index')
  root() {
    return {};
  }
}
