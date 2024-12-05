import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ReportsService } from 'src/reports/reports.service';
import { TrafficLight } from 'src/traffic-lights/traffic-light.entity';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { Report } from 'src/reports/report.entity';  // Importa la entidad de Report

describe('ReportService', () => {
  let service: ReportsService;
  let reportRepository: Repository<Report>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportsService,
        {
          provide: getRepositoryToken(Report),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(TrafficLight),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<ReportsService>(ReportsService);
    reportRepository = module.get<Repository<Report>>(getRepositoryToken(Report));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a report', async () => {
    const createReportDto = {
      status: 'dañado',
      latitude: 40.712776,
      longitude: -74.005974,
      comments: 'Semáforo en mal estado',
      evidences: ['http://example.com/image1.jpg'],
      trafficLightId: 1,  // Relacionamos el reporte con el semáforo
    };
  
    // Simulamos la relación con el semáforo
    const mockTrafficLight = new TrafficLight();
    mockTrafficLight.id = 1;
  
    // Simulamos la relación con el usuario
    const mockUser = new User();
    mockUser.id = 1;
  
    // Simulamos el repositorio y su método de creación
    jest.spyOn(reportRepository, 'create').mockReturnValue(createReportDto as any);
    jest.spyOn(reportRepository, 'save').mockResolvedValue(createReportDto as any);
  
    // Ahora pasamos correctamente ambos parámetros al servicio
    const result = await service.createReport(createReportDto, 1);  // Pasamos DTO y userId
  
    // Verificamos que el resultado coincida con lo esperado
    expect(result).toEqual(createReportDto);
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
          reports: [],  // Propiedad 'reports' simulada
        },
        user: { 
          id: 1,
          name: 'John',
          last_name: 'Doe',
          email: 'john.doe@example.com',
          password: 'hashed_password',
          nickname: 'johndoe',
          status: 'validated',
          created_at: new Date(),
          updated_at: new Date(),
          otps: [],  // Propiedad 'otps' simulada
          reports: [],  // Propiedad 'reports' simulada
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
