import { Inject, Injectable } from '@nestjs/common';
import { PERSISTENCE_HEALTH, type PersistenceHealth } from '../persistence/persistence.health';

@Injectable()
export class HealthService {
  constructor(
    @Inject(PERSISTENCE_HEALTH) private readonly persistence: PersistenceHealth,
  ) { }

  async readiness() {
    const checks: Record<string, any> = {};

    try {
      await this.persistence.ping();
      checks.persistence = { ok: true };
    } catch (e: any) {
      checks.persistence = { ok: false, error: e?.message ?? String(e) };
    }

    const ok = Object.values(checks).every((c: any) => c.ok === true);
    return { ok, checks };
  }
}
