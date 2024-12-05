import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateTrafficLightDto {
  @IsNumber()
  latitude: number;  // Latitud del semáforo

  @IsNumber()
  longitude: number;  // Longitud del semáforo

  @IsString()
  type: string;  // Tipo del semáforo (vehicular, peatonal, mixto)

  @IsString()
  department: string;  // Departamento donde se encuentra el semáforo

  @IsString()
  province: string;  // Provincia donde se encuentra el semáforo

  @IsString()
  district: string;  // Distrito donde se encuentra el semáforo
}
