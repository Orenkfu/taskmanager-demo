import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import type { Request, Response, NextFunction } from 'express';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();

    res.on('finish', () => {
      const ms = Date.now() - start;
      this.logger.log(
        JSON.stringify({
          method: req.method,
          path: req.originalUrl,
          statusCode: res.statusCode,
          durationMs: ms,
          // Note: req.ip reflects the client ip only when the app is not behind a proxy / LB.
          // If deployed with LB/Gateway etc enable `app.set('trust proxy', true)` and rely on X-Forwarded-For.
          ip: req.ip
        }),
      );
    });

    next();
  }
}
