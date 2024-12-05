import { IsString, IsOptional, IsArray, IsNumber, IsDate } from 'class-validator';

export class CreateReportDto {
  @IsString()
  status: string;  // Estado del semáforo

  @IsNumber()
  latitude: number;  // Latitud

  @IsNumber()
  longitude: number;  // Longitud

  @IsString()
  @IsOptional()
  comments?: string;  // Comentarios

  @IsArray()
  @IsOptional()
  evidences?: string[];  // Evidencias (array de URLs)

  @IsNumber()
  trafficLightId: number;  // ID del semáforo al que pertenece el reporte

  @IsDate()
  @IsOptional()
  reported_at?: Date;  // Fecha del reporte
}
