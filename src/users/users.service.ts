import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { OTPService } from '../auth/otp.service';
import * as bcrypt from 'bcrypt'; // Para encriptar contraseñas
import { CreateUserDto } from './dto/create-user.dto'; // DTO para la creación de usuarios
import { UpdateUserDto } from './dto/update-user.dto'; // DTO para la actualización de usuarios

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>, // Usamos readonly para prevenir modificaciones no deseadas
    private readonly otpService: OTPService,  // Inyección de OTPService
  ) {}

  // Registro de Usuario y Envío de OTP
  async register(createUserDto: CreateUserDto): Promise<string> {
    const { email, password, nickname } = createUserDto;

    // Verificar si el correo ya está registrado
    const existingUser = await this.findByEmail(email);
    if (existingUser) {
      throw new Error('El correo electrónico ya está registrado.');
    }

    // Verificar si el nickname ya está registrado
    const existingNickname = await this.userRepository.findOne({ where: { nickname } });
    if (existingNickname) {
      throw new Error('El nickname ya está registrado.');
    }

    // Encriptar la contraseña antes de guardar al usuario
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el nuevo usuario
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,  // Aseguramos que la contraseña en la base de datos esté encriptada
    });

    // Guardamos al usuario en la base de datos
    await this.userRepository.save(user);

    // Generar y enviar el OTP al usuario
    const otp = await this.otpService.generateOTP(user);  // OTPService genera el OTP
    console.log(`OTP generado: ${otp.otp_code}`);

    return 'Usuario registrado. Por favor, valida tu correo con el OTP enviado.';
  }

  // Método para buscar un usuario por su correo electrónico
  async findByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { email } });
  }

  // Método para buscar un usuario por su ID
  async findById(id: number): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { id } });
  }

  // Método para actualizar la información de un usuario
  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    // Verificamos si el usuario existe
    const user = await this.findById(id);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    // Actualizamos los datos del usuario en la base de datos
    await this.userRepository.update(id, updateUserDto);

    // Retornamos el usuario actualizado
    return this.userRepository.findOne({ where: { id } });
  }

  // Método para eliminar un usuario
  async deleteUser(id: number): Promise<string> {
    // Verificamos si el usuario existe
    const user = await this.findById(id);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    // Eliminamos al usuario de la base de datos
    await this.userRepository.delete(id);

    return 'Usuario eliminado correctamente';
  }

  // Otros métodos adicionales según lo necesites
}
