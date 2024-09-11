import { Test, TestingModule } from '@nestjs/testing';
import { StatisticsController } from './statistics.controller';
import { UserService } from 'src/user/user.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CacheInterceptor, CACHE_MANAGER } from '@nestjs/cache-manager';
import { UserRole } from 'src/user/interfaces/user.interface';

describe('StatisticsController', () => {
  let statisticsController: StatisticsController;
  let userService: jest.Mocked<UserService>;

  const mockReferralStatistics = {
    totalInvited: 5,
    referrers: {
      ref123: 3,
      ref456: 2,
    },
  };

  const mockCacheManager = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StatisticsController],
      providers: [
        {
          provide: UserService,
          useValue: {
            getReferralStatistics: jest.fn(),
          },
        },
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
        {
          provide: CacheInterceptor,
          useClass: CacheInterceptor,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    statisticsController =
      module.get<StatisticsController>(StatisticsController);
    userService = module.get(UserService);
  });

  describe('getReferralStatistics', () => {
    it('should return referral statistics', async () => {
      userService.getReferralStatistics.mockResolvedValue(
        mockReferralStatistics,
      );

      const result = await statisticsController.getReferralStatistics();

      expect(result).toEqual(mockReferralStatistics);
      expect(userService.getReferralStatistics).toHaveBeenCalled();
    });

    it('should be protected by JwtAuthGuard and RolesGuard', async () => {
      const guards = Reflect.getMetadata(
        '__guards__',
        StatisticsController.prototype.getReferralStatistics,
      );

      expect(guards).toBeDefined();
      expect(guards[0]).toBe(JwtAuthGuard);
      expect(guards[1]).toBe(RolesGuard);
    });

    it('should use CacheInterceptor', async () => {
      const interceptor = Reflect.getMetadata(
        '__interceptors__',
        StatisticsController.prototype.getReferralStatistics,
      );

      expect(interceptor).toBeDefined();
      expect(interceptor[0]).toBe(CacheInterceptor);
    });

    it('should check that only admins can access', async () => {
      const roles = Reflect.getMetadata(
        'roles',
        StatisticsController.prototype.getReferralStatistics,
      );

      expect(roles).toEqual([UserRole.Admin]);
    });
  });
});
