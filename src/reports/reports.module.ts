import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Report } from './report.entity';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { TrafficLight } from '../traffic-lights/traffic-light.entity';
import { User } from '../users/user.entity'; // Importamos User

@Module({
  imports: [
    TypeOrmModule.forFeature([Report, TrafficLight, User]),  // Asegúrate de importar el UserRepository
  ],
  providers: [ReportsService],
  controllers: [ReportsController],
  exports: [ReportsService],
})
export class ReportsModule {}
