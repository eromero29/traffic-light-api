import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TrafficLight } from 'src/traffic-lights/traffic-light.entity';
import { TrafficLightsService } from 'src/traffic-lights/traffic-lights.service';
import { Repository } from 'typeorm';

describe('TrafficLightsService', () => {
  let service: TrafficLightsService;
  let trafficLightRepository: Repository<TrafficLight>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TrafficLightsService,
        {
          provide: getRepositoryToken(TrafficLight),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<TrafficLightsService>(TrafficLightsService);
    trafficLightRepository = module.get<Repository<TrafficLight>>(getRepositoryToken(TrafficLight));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a traffic light', async () => {
    const createTrafficLightDto = {
      latitude: 40.712776,
      longitude: -74.005974,
      type: 'vehicular',
      department: 'Lima',
      province: 'Miraflores',
      district: 'Centro',
    };

    jest.spyOn(trafficLightRepository, 'create').mockReturnValue(createTrafficLightDto as any);
    jest.spyOn(trafficLightRepository, 'save').mockResolvedValue(createTrafficLightDto as any);

    const result = await service.createTrafficLight(createTrafficLightDto);
    expect(result).toEqual(createTrafficLightDto);
  });

  it('should return nearby traffic lights', async () => {
    const mockTrafficLights = [
      {
        id: 1,
        latitude: 40.712776,
        longitude: -74.005974,
        type: 'vehicular',
        department: 'Lima',
        province: 'Miraflores',
        district: 'Centro',
        created_at: new Date(),
        updated_at: new Date(),
        reports: [], // Agrega esta propiedad para evitar el error
      },
    ];

    jest.spyOn(trafficLightRepository, 'find').mockResolvedValue(mockTrafficLights);

    const result = await service.getNearbyTrafficLights(40.712776, -74.005974, 5);
    expect(result).toEqual(mockTrafficLights);
  });
});
