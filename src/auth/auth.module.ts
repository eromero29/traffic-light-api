import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { OTPService } from './otp.service';
import { OTP } from './otp.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlacklistService } from './blacklist.service';
import { UsersModule } from '../users/users.module';  // Ajusta la ruta relativa correctamente


@Module({
  imports: [
    TypeOrmModule.forFeature([OTP]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secretKey',
      signOptions: { expiresIn: '60m' },
    }),
    forwardRef(() => UsersModule),  // Usamos forwardRef() para evitar la dependencia circular
  ],
  providers: [AuthService, OTPService, BlacklistService],
  controllers: [AuthController],
  exports: [AuthService, OTPService],  // Exportamos AuthService y OTPService para que estén disponibles en otros módulos
})
export class AuthModule {}
