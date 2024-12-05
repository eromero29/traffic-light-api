import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';  // Asegúrate de que esta sea la respuesta correcta
  }
}
