import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, body, query, params } = req;
    const startTime = Date.now();

    console.log(`[${new Date().toISOString()}] Request:`, {
      method,
      url: originalUrl,
      body,
      query,
      params,
    });

    // Capture response
    const originalSend = res.send;
    res.send = function (body) {
      const responseTime = Date.now() - startTime;
      console.log(`[${new Date().toISOString()}] Response:`, {
        statusCode: res.statusCode,
        responseTime: `${responseTime}ms`,
        url: originalUrl,
        method,
      });
      return originalSend.call(this, body);
    };

    next();
  }
} 