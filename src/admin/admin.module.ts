// admin.module.ts
import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { JwtModule } from '@nestjs/jwt';  // Importamos el JwtModule
import { User } from '../users/user.entity';
import { AdminUser } from './admin-user.entity';
import { Report } from '../reports/report.entity';
import { TrafficLight } from '../traffic-lights/traffic-light.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, AdminUser, Report, TrafficLight]),  // Asegúrate de importar tus entidades
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secretKey',  // Asegúrate de tener una clave secreta en el .env
      signOptions: { expiresIn: '60m' },  // Configura el tiempo de expiración de los tokens
    }),
  ],
  providers: [AdminService],
  controllers: [AdminController],
})
export class AdminModule {}
