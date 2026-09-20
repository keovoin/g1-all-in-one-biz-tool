import { NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
export declare class SentryTraceMiddleware implements NestMiddleware {
    /**
     * Handles the request.
     * V9 Migration: Handlers.tracingHandler was removed, but automatic tracing is handled by httpIntegration
     * Reference: https://docs.sentry.io/platforms/javascript/migration/v8-to-v9/#new-tracing-apis
     *
     * @param {Request} req - The Express request object.
     * @param {Response} res - The Express response object.
     * @param {NextFunction} next - The Express next function.
     */
    use(req: Request, res: Response, next: NextFunction): void;
}
