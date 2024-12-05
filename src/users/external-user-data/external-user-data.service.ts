import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';  // Usamos HttpService de NestJS
import { firstValueFrom } from 'rxjs';  // Para convertir la respuesta en promesa

@Injectable()
export class ExternalUserDataService {
  constructor(private readonly httpService: HttpService) {}

  // Método para obtener los datos del usuario basado en el DNI
  async getUserDataByDNI(dni: string, token: string): Promise<any> {
    try {
      // Realizamos la petición GET al servicio externo, incluyendo el JWT en los headers
      const response = await firstValueFrom(
        this.httpService.get(`https://consulta-dni.apis-peru.com/api/dni/${dni}`, {
          headers: {
            Authorization: `Bearer ${token}`,  // Incluimos el token en los headers
            'Content-Type': 'application/json',
          }
        })
      );

      // Retornamos los datos obtenidos desde el servicio externo
      return response.data;
    } catch (error) {
      throw new Error('Error al obtener datos del servicio externo: ' + error.message);
    }
  }
}
