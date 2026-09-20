import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { PosthogService } from './posthog.service';
export declare class PosthogRequestMiddleware implements NestMiddleware {
    private readonly posthog;
    constructor(posthog: PosthogService);
    /**
     * Intercepts incoming requests to capture basic request information
     * Identifies the user/device and sets initial event properties
     * @param req - Incoming HTTP request
     * @param res - HTTP response
     * @param next - Next middleware function
     */
    use(req: Request, res: Response, next: NextFunction): void;
}
