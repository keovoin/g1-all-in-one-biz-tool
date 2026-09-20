import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { PosthogService } from './posthog.service';
export declare class PosthogTraceMiddleware implements NestMiddleware {
    private readonly posthog;
    constructor(posthog: PosthogService);
    /**
     * Tracks request performance metrics and status codes
     * Attaches to response finish event to capture final timing
     * @param req - Incoming HTTP request
     * @param res - HTTP response
     * @param next - Next middleware function
     */
    use(req: Request, res: Response, next: NextFunction): void;
}
