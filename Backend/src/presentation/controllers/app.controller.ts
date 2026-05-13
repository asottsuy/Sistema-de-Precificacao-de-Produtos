import { Controller, Get } from '@nestjs/common';

@Controller() // Deixe vazio para responder na rota raiz '/'
export class AppController {
  @Get()
  getWelcome() {
    return {
      message: 'Bem-vindo ao Precifica API',
      status: 'online',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    };
  }
}
