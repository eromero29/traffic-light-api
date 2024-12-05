import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OTP } from './otp.entity';
import { User } from '../users/user.entity';
import * as crypto from 'crypto';  // Para generar el OTP

@Injectable()
export class OTPService {
  constructor(
    @InjectRepository(OTP)
    private otpRepository: Repository<OTP>,  // Inyectamos el repositorio de OTP
  ) {}

  // Generar un código OTP
  async generateOTP(user: User): Promise<OTP> {
    const otpCode = crypto.randomInt(100000, 999999).toString(); // Genera un código de 6 dígitos
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // Expira en 5 minutos

    const otp = this.otpRepository.create({
      user,  // Relacionamos el usuario con el OTP
      otp_code: otpCode,
      expires_at: expiresAt,
    });

    // Guardamos el OTP en la base de datos
    return this.otpRepository.save(otp);  // Guardamos el OTP con la relación al usuario
  }

  // Validar OTP
  async validateOTP(email: string, otpCode: string): Promise<boolean> {
    const otp = await this.otpRepository.findOne({
      where: { otp_code: otpCode, user: { email } },
      relations: ['user'],  // Asegúrate de cargar la relación con el usuario
    });

    if (!otp || otp.expires_at < new Date()) {
      return false;  // OTP inválido o expirado
    }

    // Eliminar el OTP después de validarlo
    await this.otpRepository.delete(otp.id);
    return true;
  }
}
