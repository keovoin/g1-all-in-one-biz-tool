import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Cache } from 'cache-manager';
import { TenantSettingService } from './tenant-setting.service';
export declare class TenantSettingsMiddleware implements NestMiddleware {
    private cacheManager;
    private readonly tenantSettingService;
    private logging;
    constructor(cacheManager: Cache, tenantSettingService: TenantSettingService);
    /**
     * Middleware to retrieve and cache tenant settings based on the JWT token in the request headers.
     *
     * @param {Request} _request - The incoming HTTP request object.
     * @param {Response} _response - The outgoing HTTP response object.
     * @param {NextFunction} next - The next middleware function to call.
     *
     * @returns {Promise<void>} - Proceeds to the next middleware after attaching tenant settings to the request.
     *
     * @throws {Error} - Logs errors if tenant settings retrieval fails.
     */
    use(_request: Request, _response: Response, next: NextFunction): Promise<void>;
    /**
     * Loads resolved settings with cascade: Global DB (tenantId=NULL) → Tenant DB.
     */
    private loadResolvedSettings;
}
