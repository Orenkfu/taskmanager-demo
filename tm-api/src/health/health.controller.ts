import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { HealthService } from './health.service';

@Controller('health')
export class HealthController {
  constructor(private readonly health: HealthService) { }

  @Get()
  async getReadiness() {
    const result = await this.health.readiness();
    if (!result.ok) {
      throw new ServiceUnavailableException(result);
    }
    return { status: 'ok', ...result };
  }
}
