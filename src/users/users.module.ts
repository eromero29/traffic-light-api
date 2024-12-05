import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './user.entity';
import { AuthModule } from '../auth/auth.module';  // Importa AuthModule aquí
import { ExternalUserDataModule } from './external-user-data/external-user-data.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    AuthModule,  // Importa AuthModule para poder usar AuthService
    ExternalUserDataModule, 
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
