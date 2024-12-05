import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';  // Para encriptar contraseñas
import { HttpException } from '@nestjs/common';

describe('UsersService', () => {
  let usersService: UsersService;
  let usersRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    usersRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  it('should register a user successfully', async () => {
    const createUserDto = { email: 'test@example.com', password: 'password123', nickname: 'testuser', name: 'John', last_name: 'Doe' };
    
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      password: await bcrypt.hash('password123', 10),
      name: 'John',
      last_name: 'Doe',
      nickname: 'testuser',
      status: 'pending_validation',
      created_at: new Date(),
      updated_at: new Date(),
      otps: [],  // Añadido campo 'otps' simulado
      reports: [],  // Añadido campo 'reports' simulado
    };

    jest.spyOn(usersRepository, 'findOne').mockResolvedValue(undefined);  // No existe un usuario con ese email
    jest.spyOn(usersRepository, 'create').mockReturnValue(mockUser);
    jest.spyOn(usersRepository, 'save').mockResolvedValue(mockUser);

    const result = await usersService.register(createUserDto);
    
    expect(result).toBe('Usuario registrado exitosamente');
  });

  it('should throw error if user already exists when registering', async () => {
    const createUserDto = { email: 'test@example.com', password: 'password123', nickname: 'testuser', name: 'John', last_name: 'Doe' };
    
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      password: await bcrypt.hash('password123', 10),
      name: 'John',
      last_name: 'Doe',
      nickname: 'testuser',
      status: 'pending_validation',
      created_at: new Date(),
      updated_at: new Date(),
      otps: [],  // Añadido campo 'otps' simulado
      reports: [],  // Añadido campo 'reports' simulado
    };

    jest.spyOn(usersRepository, 'findOne').mockResolvedValue(mockUser);  // Usuario ya existe

    await expect(usersService.register(createUserDto)).rejects.toThrow(HttpException);
  });

  it('should find a user by email', async () => {
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      password: 'password123',
      name: 'John',
      last_name: 'Doe',
      nickname: 'testuser',
      status: 'pending_validation',
      created_at: new Date(),
      updated_at: new Date(),
      otps: [],  // Añadido campo 'otps' simulado
      reports: [],  // Añadido campo 'reports' simulado
    };

    jest.spyOn(usersRepository, 'findOne').mockResolvedValue(mockUser);

    const user = await usersService.findByEmail('test@example.com');
    expect(user).toEqual(mockUser);
  });

  it('should update a user', async () => {
    const updateUserDto = { name: 'John Updated' };
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      password: 'password123',
      name: 'John',
      last_name: 'Doe',
      nickname: 'testuser',
      status: 'pending_validation',
      created_at: new Date(),
      updated_at: new Date(),
      otps: [],  // Añadido campo 'otps' simulado
      reports: [],  // Añadido campo 'reports' simulado
    };

    // Simulando un UpdateResult con las propiedades correctas
    const mockUpdateResult = {
      affected: 1,
      raw: [],  // Puedes dejar esto vacío si no necesitas datos adicionales
      generatedMaps: [],
    };

    jest.spyOn(usersRepository, 'findOne').mockResolvedValue(mockUser);
    jest.spyOn(usersRepository, 'update').mockResolvedValue(mockUpdateResult);

    const result = await usersService.updateUser(1, updateUserDto);
    expect(result.name).toBe('John Updated');
  });

  it('should throw error if user not found during update', async () => {
    const updateUserDto = { name: 'John Updated' };

    jest.spyOn(usersRepository, 'findOne').mockResolvedValue(null);  // Usuario no encontrado

    await expect(usersService.updateUser(1, updateUserDto)).rejects.toThrow(HttpException);
  });
});
