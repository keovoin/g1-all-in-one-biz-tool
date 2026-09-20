import { NestMiddleware } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { Request, Response, NextFunction } from 'express';
import { IntegrationTenantService } from '@gauzy/core';
export declare class MakeComMiddleware implements NestMiddleware {
    private cacheManager;
    private readonly _integrationTenantService;
    private readonly logger;
    constructor(cacheManager: Cache, _integrationTenantService: IntegrationTenantService);
    /**
     * Middleware to handle Make.com integration requests
     * @param request - Express request object
     * @param _response - Express response object
     * @param next - Express next function
     */
    use(request: Request, _response: Response, next: NextFunction): Promise<void>;
}
