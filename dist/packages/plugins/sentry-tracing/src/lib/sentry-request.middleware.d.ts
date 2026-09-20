import { NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
export declare class SentryRequestMiddleware implements NestMiddleware {
    constructor();
    /**
     * Handles the request.
     * V9 Migration: Handlers.requestHandler was removed, manual context setting
     * Reference: https://docs.sentry.io/platforms/javascript/migration/v8-to-v9/#behavior-changes
     *
     * @param {Request} req - The Express request object.
     * @param {Response} res - The Express response object.
     * @param {NextFunction} next - The Express next function.
     */
    use(req: Request, res: Response, next: NextFunction): void;
}
