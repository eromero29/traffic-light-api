import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { TrafficLightsService } from './traffic-lights.service';
import { CreateReportDto } from '../reports/dto/create-report.dto';  // DTO para reportar semáforo

@Controller('api/traffic-lights')
export class TrafficLightsController {
  constructor(private readonly trafficLightsService: TrafficLightsService) {}

  // Reportar el estado de un semáforo
  @Post('report')
  async createReport(@Body() createReportDto: CreateReportDto, @Query('userId') userId: number) {
    return this.trafficLightsService.createReport(createReportDto, userId);
  }

  // Obtener los reportes realizados por un usuario
  @Get('user/reports')
  async getUserReports(@Query('userId') userId: number) {
    return this.trafficLightsService.getUserReports(userId);
  }

  // Filtrar semáforos por departamento, provincia y distrito
  @Get('filter')
  async filterTrafficLights(@Query() query: any) {
    return this.trafficLightsService.filterTrafficLights(query.department, query.province, query.district);
  }

  // Obtener semáforos cercanos según ubicación GPS
  @Get('nearby')
  async getNearbyTrafficLights(@Query() query: any) {
    return this.trafficLightsService.getNearbyTrafficLights(query.latitude, query.longitude, query.radius);
  }

  // Crear un nuevo semáforo (solo para administradores)
  @Post('create')
  async createTrafficLight(@Body() createTrafficLightDto: any) {
    return this.trafficLightsService.createTrafficLight(createTrafficLightDto);
  }
}
