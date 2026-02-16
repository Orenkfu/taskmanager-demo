// src/middleware/request-logger.middleware.spec.ts

import { RequestLoggerMiddleware } from './request-logger.middleware';
import { Logger } from '@nestjs/common';

describe('RequestLoggerMiddleware', () => {
  it('logs request info on response finish', () => {
    const mw = new RequestLoggerMiddleware();

    const next = jest.fn();

    const req: any = {
      method: 'GET',
      originalUrl: '/tasks',
      ip: '1.2.3.4',
    };

    let finishHandler: (() => void) | undefined;

    const res: any = {
      statusCode: 200,
      on: jest.fn((event: string, cb: () => void) => {
        if (event === 'finish') finishHandler = cb;
      }),
    };

    const logSpy = jest
      .spyOn(Logger.prototype, 'log')
      .mockImplementation(() => undefined);

    const nowSpy = jest.spyOn(Date, 'now');
    nowSpy.mockReturnValueOnce(1000); // start
    nowSpy.mockReturnValueOnce(1120); // finish

    mw.use(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.on).toHaveBeenCalledWith('finish', expect.any(Function));
    expect(finishHandler).toBeDefined();

    finishHandler!();

    expect(logSpy).toHaveBeenCalledTimes(1);

    const payload = JSON.parse(String(logSpy.mock.calls[0][0]));
    expect(payload).toEqual({
      method: 'GET',
      path: '/tasks',
      statusCode: 200,
      durationMs: 120,
      ip: '1.2.3.4',
    });

    logSpy.mockRestore();
    nowSpy.mockRestore();
  });
});
