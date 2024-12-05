import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ReportsService } from 'src/reports/reports.service';
import { TrafficLight } from 'src/traffic-lights/traffic-light.entity';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { Report } from 'src/reports/report.entity';
import { CreateReportDto } from 'src/reports/dto/create-report.dto';

describe('ReportsService', () => {
  let service: ReportsService;
  let reportRepository: Repository<Report>;
  let userRepository: Repository<User>;
  let trafficLightRepository: Repository<TrafficLight>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportsService,
        {
          provide: getRepositoryToken(Report),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(TrafficLight),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<ReportsService>(ReportsService);
    reportRepository = module.get<Repository<Report>>(getRepositoryToken(Report));
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    trafficLightRepository = module.get<Repository<TrafficLight>>(getRepositoryToken(TrafficLight));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a report successfully', async () => {
    const createReportDto: CreateReportDto = {
      status: 'dañado',
      latitude: 40.712776,
      longitude: -74.005974,
      comments: 'Semáforo en mal estado',
      evidences: ['http://example.com/image1.jpg'],
      trafficLightId: 1,
    };

    // Mock del semáforo con las propiedades completas
    const mockTrafficLight = new TrafficLight();
    mockTrafficLight.id = 1;
    mockTrafficLight.latitude = 40.712776;
    mockTrafficLight.longitude = -74.005974;
    mockTrafficLight.type = 'vehicular';
    mockTrafficLight.department = 'Lima';
    mockTrafficLight.province = 'Miraflores';
    mockTrafficLight.district = 'Centro';
    mockTrafficLight.created_at = new Date();
    mockTrafficLight.updated_at = new Date();
    mockTrafficLight.reports = [];

    // Mock del usuario con las propiedades completas
    const mockUser = new User();
    mockUser.id = 1;
    mockUser.email = 'test@example.com';
    mockUser.password = 'hashed_password';
    mockUser.name = 'John';
    mockUser.last_name = 'Doe';
    mockUser.nickname = 'testuser';
    mockUser.status = 'pending_validation';
    mockUser.created_at = new Date();
    mockUser.updated_at = new Date();
    mockUser.otps = [];
    mockUser.reports = [];

    // Simulamos los métodos de repositorio
    jest.spyOn(trafficLightRepository, 'findOne').mockResolvedValue(mockTrafficLight);
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
    jest.spyOn(reportRepository, 'create').mockReturnValue(createReportDto as any);
    jest.spyOn(reportRepository, 'save').mockResolvedValue(createReportDto as any);

    const result = await service.createReport(createReportDto, 1);
    expect(result).toEqual(createReportDto);
  });

  it('should throw error if traffic light not found', async () => {
    const createReportDto: CreateReportDto = {
      status: 'dañado',
      latitude: 40.712776,
      longitude: -74.005974,
      comments: 'Semáforo en mal estado',
      evidences: ['http://example.com/image1.jpg'],
      trafficLightId: 999, // ID incorrecto
    };

    jest.spyOn(trafficLightRepository, 'findOne').mockResolvedValue(null);

    await expect(service.createReport(createReportDto, 1)).rejects.toThrowError('Semáforo no encontrado');
  });

  it('should throw error if user not found', async () => {
    const createReportDto: CreateReportDto = {
      status: 'dañado',
      latitude: 40.712776,
      longitude: -74.005974,
      comments: 'Semáforo en mal estado',
      evidences: ['http://example.com/image1.jpg'],
      trafficLightId: 1,
    };

    const mockTrafficLight = new TrafficLight();
    mockTrafficLight.id = 1;

    jest.spyOn(trafficLightRepository, 'findOne').mockResolvedValue(mockTrafficLight);
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

    await expect(service.createReport(createReportDto, 1)).rejects.toThrowError('Usuario no encontrado');
  });

  it('should return all reports for a user', async () => {
    const mockReports = [
      {
        id: 1,
        status: 'dañado',
        latitude: 40.712776,
        longitude: -74.005974,
        comments: 'Semáforo en mal estado',
        evidences: ['http://example.com/image1.jpg'],
        trafficLight: {
          id: 1,
          latitude: 40.712776,
          longitude: -74.005974,
          type: 'vehicular',
          department: 'Lima',
          province: 'Miraflores',
          district: 'Centro',
          created_at: new Date(),
          updated_at: new Date(),
          reports: [],
        },
        user: {
          id: 1,
          email: 'test@example.com',
          password: 'hashed_password',
          name: 'John',
          last_name: 'Doe',
          nickname: 'testuser',
          status: 'pending_validation',
          created_at: new Date(),
          updated_at: new Date(),
          otps: [],
          reports: [],
        },
        reported_at: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
        body: 'El semáforo tiene fallos en su funcionamiento',
        type: 'vehicular',
        url: 'http://example.com/traffic-light-url',
      },
    ];

    jest.spyOn(reportRepository, 'find').mockResolvedValue(mockReports);

    const result = await service.getUserReports(1);
    expect(result).toEqual(mockReports);
  });
});
