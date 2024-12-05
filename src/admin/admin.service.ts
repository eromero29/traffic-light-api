import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual } from 'typeorm';  // Importamos MoreThanOrEqual
import { User } from '../users/user.entity';
import { Report } from '../reports/report.entity';
import { TrafficLight } from '../traffic-lights/traffic-light.entity';
import { AdminUser } from './admin-user.entity';  // Importamos AdminUser
import { LoginAdminDto } from './dto/login-admin.dto';
import * as bcrypt from 'bcrypt';  // Importamos bcrypt
import { JwtService } from '@nestjs/jwt';  // Importamos JwtService

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Report)
    private reportRepository: Repository<Report>,

    @InjectRepository(TrafficLight)
    private trafficLightRepository: Repository<TrafficLight>,

    @InjectRepository(AdminUser)
    private adminRepository: Repository<AdminUser>,

    private jwtService: JwtService,  // Inyectamos JwtService
  ) {}

  // Método de login para admin
  async login(loginAdminDto: LoginAdminDto) {
    const { email, password } = loginAdminDto;

    const adminUser = await this.adminRepository.findOne({ where: { email } });

    if (!adminUser) {
      throw new Error('Administrador no encontrado');
    }

    const isPasswordValid = await bcrypt.compare(password, adminUser.password);

    if (!isPasswordValid) {
      throw new Error('Contraseña incorrecta');
    }

    const payload = { email: adminUser.email, sub: adminUser.id };
    const accessToken = this.jwtService.sign(payload);

    return { access_token: accessToken };
  }

  // Obtener todos los usuarios
  async getAllUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  // Actualizar un usuario
  async updateUser(id: number, updateUserDto: any): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id }, relations: ['reports'] });
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    await this.userRepository.update(id, updateUserDto);
    return this.userRepository.findOne({ where: { id }, relations: ['reports'] });
  }

  // Eliminar un usuario
  async deleteUser(id: number): Promise<string> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    await this.userRepository.delete(id);
    return 'Usuario eliminado correctamente';
  }

  // Obtener todos los reportes
  async getAllReports(query: any): Promise<Report[]> {
    const { status, department, province, district, date_range } = query;
    const where: any = {};

    if (status) {
      where.status = status;
    }
    if (department) {
      where.trafficLight = { ...where.trafficLight, department };
    }
    if (province) {
      where.trafficLight = { ...where.trafficLight, province };
    }
    if (district) {
      where.trafficLight = { ...where.trafficLight, district };
    }
    if (date_range) {
      where.reported_at = MoreThanOrEqual(new Date(date_range));  // Usamos MoreThanOrEqual para comparar la fecha
    }

    return this.reportRepository.find({
      where,
      relations: ['trafficLight', 'user'],
    });
  }

  // Obtener detalles de un reporte
  async getReportDetails(id: number): Promise<Report> {
    return this.reportRepository.findOne({ where: { id }, relations: ['trafficLight', 'user'] });
  }

  // Marcar un reporte como resuelto
  async resolveReport(id: number, status: { status: string }): Promise<Report> {
    const report = await this.reportRepository.findOne({ where: { id } });
    if (!report) {
      throw new Error('Reporte no encontrado');
    }
    report.status = status.status;
    return this.reportRepository.save(report);
  }

  // Asignar un reporte a un semáforo específico
  async assignReport(id: number, assignDto: { traffic_light_id: number }): Promise<Report> {
    const report = await this.reportRepository.findOne({ where: { id } });
    if (!report) {
      throw new Error('Reporte no encontrado');
    }
    const trafficLight = await this.trafficLightRepository.findOne({ where: { id: assignDto.traffic_light_id } });
    if (!trafficLight) {
      throw new Error('Semáforo no encontrado');
    }
    report.trafficLight = trafficLight;
    return this.reportRepository.save(report);
  }

  // Eliminar un reporte específico
  async deleteReport(id: number): Promise<string> {
    const report = await this.reportRepository.findOne({ where: { id } });
    if (!report) {
      throw new Error('Reporte no encontrado');
    }
    await this.reportRepository.delete(id);
    return 'Reporte eliminado correctamente';
  }
}
