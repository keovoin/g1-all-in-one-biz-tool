import { NestMiddleware } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { Request, Response, NextFunction } from 'express';
import { IntegrationTenantService } from '@gauzy/core';
import { RequestConfigProvider } from './request-config.provider';
export declare class IntegrationAIMiddleware implements NestMiddleware {
    private cacheManager;
    private readonly _integrationTenantService;
    private readonly _requestConfigProvider;
    private logging;
    constructor(cacheManager: Cache, _integrationTenantService: IntegrationTenantService, _requestConfigProvider: RequestConfigProvider);
    /**
     * Middleware to handle setting up AI integration configuration headers based on request headers and body.
     *
     * @param request - The incoming HTTP request object.
     * @param _response - The outgoing HTTP response object (not used directly).
     * @param next - The callback function to invoke to pass control to the next middleware or route handler.
     */
    use(request: Request, _response: Response, next: NextFunction): Promise<void>;
}
