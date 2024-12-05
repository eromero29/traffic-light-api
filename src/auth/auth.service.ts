import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { OTPService } from './otp.service';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { BlacklistService } from './blacklist.service'; // Importar el servicio de lista negra

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly otpService: OTPService,
    private readonly jwtService: JwtService,
    private readonly blacklistService: BlacklistService, // Inyectar el servicio de blacklist
  ) {}

  // Validar el correo con OTP
  async validateEmail(email: string, otp_code: string): Promise<string> {
    const isValid = await this.otpService.validateOTP(email, otp_code);
    if (!isValid) {
      throw new Error('OTP inválido o expirado');
    }
    return 'Correo validado correctamente';
  }

  // Reenviar OTP
  async resendOtp(email: string): Promise<string> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    // Generar y enviar un nuevo OTP
    const otp = await this.otpService.generateOTP(user);
    console.log(`Nuevo OTP generado: ${otp.otp_code}`);
    return 'Nuevo OTP enviado al correo electrónico';
  }

  // Login de Usuario (Generar JWT)
  async login(loginUserDto: { email: string; password: string }): Promise<{ access_token: string }> {
    const { email, password } = loginUserDto;

    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Contraseña incorrecta');
    }

    const payload = { email: user.email, sub: user.id };
    const accessToken = this.jwtService.sign(payload);

    return { access_token: accessToken };
  }

  // Logout de Usuario (Eliminar sesión o invalidar token)
  async logout(token: string): Promise<string> {
    // Añadir el token a la lista negra
    this.blacklistService.addToBlacklist(token);
    return 'Sesión cerrada correctamente';
  }
}
