import { Controller, Post, Get, Body, Query } from '@nestjs/common';
import { ReportsService } from './reports.service'; 
import { CreateReportDto } from './dto/create-report.dto';  // Asegúrate de importar el DTO correctamente

@Controller('api/traffic-lights/report')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  // Método para crear un reporte de semáforo
  @Post()
  async createReport(
    @Body() createReportDto: CreateReportDto,  // El DTO que contiene los datos del reporte
    @Query('userId') userId: number,  // Obtenemos el userId desde la query (o podrías pasarlo desde el token en los headers)
  ) {
    return this.reportsService.createReport(createReportDto, userId);  // Pasamos ambos parámetros al servicio
  }

  // Método para obtener todos los reportes de un usuario
  @Get('user/reports')
  async getUserReports(@Query('userId') userId: number) {
    return this.reportsService.getUserReports(userId);  // Obtenemos los reportes del usuario
  }
}
