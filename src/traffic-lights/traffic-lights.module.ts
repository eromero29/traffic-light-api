// traffic-lights.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrafficLight } from './traffic-light.entity';
import { TrafficLightsService } from './traffic-lights.service';
import { TrafficLightsController } from './traffic-lights.controller';
import { UsersModule } from '../users/users.module';  // Importa UsersModule
import { Report } from '../reports/report.entity';
import { User } from '../users/user.entity';  // Asegúrate de importar User

@Module({
  imports: [
    TypeOrmModule.forFeature([TrafficLight, Report, User]),  // Asegúrate de incluir User aquí también
    UsersModule,  // Importa UsersModule aquí
  ],
  providers: [TrafficLightsService],
  controllers: [TrafficLightsController],
})
export class TrafficLightsModule {}
