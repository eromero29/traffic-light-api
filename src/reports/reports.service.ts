import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from './report.entity';
import { CreateReportDto } from './dto/create-report.dto';  // Importa el DTO
import { User } from '../users/user.entity'; // Importa la entidad de Usuario
import { TrafficLight } from '../traffic-lights/traffic-light.entity'; // Importa la entidad de Semáforo

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)
    private reportRepository: Repository<Report>, // Inyectamos el repositorio de Report

    @InjectRepository(User)
    private userRepository: Repository<User>, // Inyectamos el repositorio de User

    @InjectRepository(TrafficLight)
    private trafficLightRepository: Repository<TrafficLight>, // Inyectamos el repositorio de TrafficLight
  ) {}

  // Crear un nuevo reporte de semáforo
  async createReport(createReportDto: CreateReportDto, userId: number): Promise<Report> {
    const { status, latitude, longitude, comments, evidences, trafficLightId, reported_at } = createReportDto;

    // Buscar el semáforo al que pertenece el reporte
    const trafficLight = await this.trafficLightRepository.findOne({ where: { id: trafficLightId } });
    if (!trafficLight) {
      throw new Error('Semáforo no encontrado');
    }

    // Buscar el usuario que está haciendo el reporte
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    // Crear el reporte
    const report = this.reportRepository.create({
      status,
      latitude,
      longitude,
      comments,
      evidences,
      trafficLight,  // Relacionamos el semáforo con el reporte
      user,  // Relacionamos el usuario con el reporte
      reported_at: reported_at || new Date(),  // Si no se especifica la fecha, tomamos la actual
    });

    // Guardar el reporte en la base de datos
    return this.reportRepository.save(report);
  }

  // Obtener los reportes realizados por un usuario
  async getUserReports(userId: number): Promise<Report[]> {
    return this.reportRepository.find({
      where: { user: { id: userId } },  // Relacionamos con el campo 'user'
      relations: ['user', 'trafficLight'],  // Aseguramos que las relaciones 'user' y 'trafficLight' se carguen
    });
  }
}
