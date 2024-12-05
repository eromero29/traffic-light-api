import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';  // Necesitamos importar HttpModule para hacer solicitudes externas
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user.entity';
import { ExternalUserDataService } from './external-user-data.service';  // Asegúrate de importar el servicio
import { ExternalUserDataController } from './external-user-data.controller';  // Asegúrate de importar el controlador

@Module({
  imports: [
    HttpModule,  // Necesario para hacer peticiones HTTP
    TypeOrmModule.forFeature([User]),  // Importamos el repositorio de usuarios
  ],
  providers: [ExternalUserDataService],  // Proveemos el servicio
  controllers: [ExternalUserDataController],  // Registramos el controlador
  exports: [ExternalUserDataService],  // Exponemos el servicio si se va a usar en otros módulos
})
export class ExternalUserDataModule {}
