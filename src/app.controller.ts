import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  // getHello() {
  //   return this.appService.getHello();
  // }
  @Render('index')
  root() {
    return { message: 'Hello world!' };
  }

  @Get('onboard')
  @Render('onboard')
  registerPage() {
    
  }

  @Get('signin')
  @Render('login')
  loginPage() {
    
  }
}