import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TrafficLight } from '../traffic-lights/traffic-light.entity';
import { Report } from '../reports/report.entity';
import { CreateReportDto } from '../reports/dto/create-report.dto';
import { User } from '../users/user.entity';
import { CreateTrafficLightDto } from './dto/create-traffic-light.dto';  // Importar DTO para crear semáforo

@Injectable()
export class TrafficLightsService {
  constructor(
    @InjectRepository(TrafficLight)
    private trafficLightRepository: Repository<TrafficLight>,

    @InjectRepository(Report)
    private reportRepository: Repository<Report>,

    @InjectRepository(User)
    private userRepository: Repository<User>,  // Inyectamos el repositorio de User
  ) {}
  async createTrafficLight(createTrafficLightDto: CreateTrafficLightDto): Promise<TrafficLight> {
    const trafficLight = this.trafficLightRepository.create(createTrafficLightDto);
    return this.trafficLightRepository.save(trafficLight);
  }
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
      where: { user: { id: userId } },  // Accedemos a la relación 'user' para filtrar por su ID
      relations: ['user', 'trafficLight'],  // Cargamos las relaciones 'user' y 'trafficLight'
    });
  }

  // Filtrar semáforos por departamento, provincia y distrito
  async filterTrafficLights(department?: string, province?: string, district?: string): Promise<TrafficLight[]> {
    return this.trafficLightRepository.find({
      where: { department, province, district },
    });
  }

  // Obtener semáforos cercanos (usando la fórmula de Haversine para calcular la distancia)
  async getNearbyTrafficLights(latitude: number, longitude: number, radius: number = 5): Promise<TrafficLight[]> {
    const trafficLights = await this.trafficLightRepository.find();

    return trafficLights.filter((trafficLight) => {
      const distance = this.calculateDistance(latitude, longitude, trafficLight.latitude, trafficLight.longitude);
      return distance <= radius;
    });
  }

  // Calcular distancia entre dos puntos usando la fórmula de Haversine
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radio de la Tierra en km
    const toRad = (deg: number) => deg * (Math.PI / 180); // Convertir grados a radianes

    const dLat = toRad(lat2 - lat1); // Diferencia de latitudes
    const dLon = toRad(lon2 - lon1); // Diferencia de longitudes

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distancia en km
  }
}
