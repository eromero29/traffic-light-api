import { Controller, Get, Query, Headers, HttpException, HttpStatus } from '@nestjs/common';
import { ExternalUserDataService } from './external-user-data.service';  // Importamos el servicio

@Controller('api/external-user-data')
export class ExternalUserDataController {
  constructor(private readonly externalUserDataService: ExternalUserDataService) {}

  // Endpoint para obtener datos del usuario a través del DNI
  @Get()
  async getUserDataByDNI(
    @Query('dni') dni: string,           // Obtener el DNI desde la query
    @Headers('Authorization') token: string,  // Obtener el token del encabezado Authorization
  ) {
    // Verificación de parámetros
    if (!dni) {
      throw new HttpException('El DNI es requerido', HttpStatus.BAD_REQUEST);
    }

    if (!token) {
      throw new HttpException('El token de autenticación es requerido', HttpStatus.UNAUTHORIZED);
    }

    // Llamamos al servicio para obtener los datos, pasando el DNI y el token
    return this.externalUserDataService.getUserDataByDNI(dni, token.split(' ')[1]); // "Bearer <token>" -> Extraemos el token
  }
}
