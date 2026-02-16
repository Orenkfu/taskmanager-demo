// src/health/health.service.spec.ts

import { Test } from '@nestjs/testing';
import { HealthService } from './health.service';
import {
    PERSISTENCE_HEALTH,
    type PersistenceHealth,
} from '../persistence/persistence.health';

describe('HealthService', () => {
    let service: HealthService;
    let persistence: jest.Mocked<PersistenceHealth>;

    beforeEach(async () => {
        persistence = {
            ping: jest.fn(),
        };

        const moduleRef = await Test.createTestingModule({
            providers: [
                HealthService,
                { provide: PERSISTENCE_HEALTH, useValue: persistence },
            ],
        }).compile();

        service = moduleRef.get(HealthService);
    });

    it('returns ok=true when persistence ping succeeds', async () => {
        persistence.ping.mockResolvedValue(undefined);

        await expect(service.readiness()).resolves.toEqual({
            ok: true,
            checks: {
                persistence: { ok: true },
            },
        });
    });

    it('returns ok=false and includes error when persistence ping fails', async () => {
        persistence.ping.mockRejectedValue(new Error('db down'));

        const res = await service.readiness();

        expect(res.ok).toBe(false);
        expect(res.checks.persistence.ok).toBe(false);
        expect(res.checks.persistence.error).toContain('db down');
    });

    it('uses String(e) when thrown value is not an Error', async () => {

        const mockVal = 'x'
        persistence.ping.mockRejectedValue(mockVal);

        const res = await service.readiness();

        expect(res.ok).toBe(false);
        expect(res.checks.persistence.ok).toBe(false);
        expect(res.checks.persistence.error).toContain(mockVal);
    });
});
