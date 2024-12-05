import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { OTPService } from './otp.service';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly otpService: OTPService,
    private readonly usersService: UsersService,
  ) {}

  // Enviar OTP al correo electrónico
  @Post('send-otp')
  async sendOTP(@Body('email') email: string): Promise<string> {
    try {
      const user = await this.usersService.findByEmail(email);
      if (!user) {
        throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
      }

      const otp = await this.otpService.generateOTP(user);
      console.log(`Código OTP enviado: ${otp.otp_code}`);

      // Aquí normalmente enviarías el OTP al correo del usuario, pero solo lo mostramos en consola
      return 'OTP enviado al correo electrónico';
    } catch (error) {
      throw new HttpException(
        error.message || 'Error al enviar el OTP',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Validar OTP enviado al correo
  @Post('validate-otp')
  async validateOTP(
    @Body('email') email: string,
    @Body('otp_code') otpCode: string,
  ): Promise<string> {
    try {
      // Validar si el OTP es correcto
      const isValid = await this.otpService.validateOTP(email, otpCode);
      if (!isValid) {
        throw new HttpException('OTP inválido o expirado', HttpStatus.BAD_REQUEST);
      }

      return 'OTP validado correctamente';
    } catch (error) {
      throw new HttpException(
        error.message || 'Error al validar el OTP',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
