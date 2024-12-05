import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthService } from '../auth/auth.service';
import { CreateUserDto } from './dto/create-user.dto';  // DTO para la creación de usuarios
import { LoginUserDto } from './dto/login-user.dto';  // DTO para el login de usuarios

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,  
  ) {}

  // Método para registrar un nuevo usuario
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto): Promise<string> {
    try {
      // Llamamos al servicio para registrar al usuario
      return await this.usersService.register(createUserDto);
    } catch (error) {
      // Si ocurre un error, devolvemos una excepción HTTP
      throw new HttpException(
        error.message || 'Error al registrar el usuario',
        HttpStatus.BAD_REQUEST,  // Código HTTP 400 (Bad Request)
      );
    }
  }

  // Método para validar el correo electrónico mediante OTP
  @Post('validate-email')
  async validateEmail(
    @Body('email') email: string,
    @Body('otp_code') otp_code: string,
  ): Promise<string> {
    try {
      // Llamamos al servicio de autenticación para validar el OTP
      return await this.authService.validateEmail(email, otp_code);
    } catch (error) {
      // Si ocurre un error, devolvemos una excepción HTTP
      throw new HttpException(
        error.message || 'Error al validar el correo electrónico',
        HttpStatus.BAD_REQUEST,  // Código HTTP 400 (Bad Request)
      );
    }
  }

  // Método para reenviar el OTP al correo electrónico
  @Post('resend-otp')
  async resendOtp(@Body('email') email: string): Promise<string> {
    try {
      // Llamamos al servicio de autenticación para reenviar el OTP
      return await this.authService.resendOtp(email);
    } catch (error) {
      // Si ocurre un error, devolvemos una excepción HTTP
      throw new HttpException(
        error.message || 'Error al reenviar el OTP',
        HttpStatus.BAD_REQUEST,  // Código HTTP 400 (Bad Request)
      );
    }
  }

  // Método para login de usuario (autenticación con JWT)
  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto): Promise<any> {
    try {
      // Llamamos al servicio de autenticación para obtener el JWT
      return await this.authService.login(loginUserDto);
    } catch (error) {
      // Si ocurre un error, devolvemos una excepción HTTP
      throw new HttpException(
        error.message || 'Error al iniciar sesión',
        HttpStatus.UNAUTHORIZED,  // Código HTTP 401 (Unauthorized)
      );
    }
  }

  // Método para cerrar sesión del usuario
  @Post('logout')
  async logout(@Body() { token }: { token: string }): Promise<string> {
    try {
      // Llamamos al servicio de autenticación para cerrar sesión (invalidar token)
      return await this.authService.logout(token);
    } catch (error) {
      // Si ocurre un error, devolvemos una excepción HTTP
      throw new HttpException(
        error.message || 'Error al cerrar sesión',
        HttpStatus.BAD_REQUEST,  // Código HTTP 400 (Bad Request)
      );
    }
  }
}
