import { NestMiddleware } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { Request, Response, NextFunction } from 'express';
export declare class RequestContextMiddleware implements NestMiddleware {
    private readonly clsService;
    private readonly logger;
    private readonly loggingEnabled;
    constructor(clsService: ClsService);
    /**
     * Middleware to manage request context and log request lifecycle.
     *
     * This middleware generates a `RequestContext` for each incoming request,
     * logs the start and end of the request if logging is enabled, and ensures that
     * the context is preserved during the request lifecycle using `nestjs-cls`.
     *
     * @param req The incoming HTTP request.
     * @param res The outgoing HTTP response.
     * @param next The next middleware function in the request-response cycle.
     */
    use(req: Request, res: Response, next: NextFunction): void;
}
