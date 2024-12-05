import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

// Módulos importados
import { UsersModule } from './users/users.module';  // Importamos UsersModule
import { AuthModule } from './auth/auth.module';  // Importamos AuthModule


// Entidades importadas
import { User } from './users/user.entity';
import { OTP } from './auth/otp.entity';
import { TrafficLight } from './traffic-lights/traffic-light.entity';
import { Report } from './reports/report.entity';
import { AdminUser } from './admin/admin-user.entity';

// Controlador y Servicio de la aplicación
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TrafficLightsModule } from './traffic-lights/traffic-lights.module';
import { ReportsModule } from './reports/reports.module';
import { AdminModule } from './admin/admin.module';
import { ExternalUserDataModule } from './users/external-user-data/external-user-data.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [User, OTP, TrafficLight, Report, AdminUser],  // Agregamos las entidades utilizadas
      synchronize: true, 
    }),
    UsersModule,  // Importamos UsersModule
    AuthModule,   // Importamos AuthModule
    TrafficLightsModule,  // Importamos TrafficLightsModule
    ReportsModule,  // Importamos ReportsModule
    AdminModule,  // Importamos AdminModule
    ExternalUserDataModule
  ],
  controllers: [AppController],  // Asegúrate de que AppController esté registrado aquí
  providers: [AppService],
})
export class AppModule {}
