import { Test, TestingModule } from '@nestjs/testing';
import { MetricsController } from './metrics.controller';
import { MetricsService } from './metrics.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRole } from 'src/user/interfaces/user.interface';
import { ValidationPipe } from '@nestjs/common';

describe('MetricsController', () => {
  let metricsController: MetricsController;
  let metricsService: jest.Mocked<MetricsService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MetricsController],
      providers: [
        {
          provide: MetricsService,
          useValue: {
            logHttpRequest: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    metricsController = module.get<MetricsController>(MetricsController);
    metricsService = module.get(MetricsService);
  });

  describe('handleRequest', () => {
    it('should log the HTTP request and return "Request logged"', async () => {
      const result = await metricsController.handleRequest();

      expect(result).toEqual('Request logged');
      expect(metricsService.logHttpRequest).toHaveBeenCalled();
    });

    it('should be protected by JwtAuthGuard and RolesGuard', async () => {
      const guards = Reflect.getMetadata(
        '__guards__',
        MetricsController.prototype.handleRequest,
      );

      expect(guards).toBeDefined();
      expect(guards[0]).toBe(JwtAuthGuard);
      expect(guards[1]).toBe(RolesGuard);
    });

    it('should only be accessible to admins', async () => {
      const roles = Reflect.getMetadata(
        'roles',
        MetricsController.prototype.handleRequest,
      );

      expect(roles).toEqual([UserRole.Admin]);
    });

    it('should use the ValidationPipe', async () => {
      const pipes = Reflect.getMetadata(
        '__pipes__',
        MetricsController.prototype.handleRequest,
      );

      expect(pipes).toBeDefined();
      expect(pipes[0]).toBeInstanceOf(ValidationPipe);
    });
  });
});
