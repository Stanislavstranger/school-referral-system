import { Test, TestingModule } from '@nestjs/testing';
import { MetricsService } from './metrics.service';
import { Counter } from 'prom-client';

describe('MetricsService', () => {
  let metricsService: MetricsService;
  let counter: Counter<string>;

  beforeEach(async () => {
    const mockCounter = {
      inc: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MetricsService,
        {
          provide: 'PROM_METRIC_HTTP_REQUESTS_TOTAL',
          useValue: mockCounter,
        },
      ],
    }).compile();

    metricsService = module.get<MetricsService>(MetricsService);
    counter = module.get<Counter<string>>('PROM_METRIC_HTTP_REQUESTS_TOTAL');
  });

  it('should increment the http_requests_total counter', () => {
    metricsService.logHttpRequest();

    expect(counter.inc).toHaveBeenCalled();
  });
});
