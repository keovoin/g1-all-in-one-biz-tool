import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { TenantApiKeyService } from '../../tenant-api-key/tenant-api-key.service';
export declare class ApiKeyAuthGuard implements CanActivate {
    private readonly _tenantApiKeyService;
    constructor(_tenantApiKeyService: TenantApiKeyService);
    /**
     * Validates API Key and Secret from the request headers to determine if the request can proceed.
     *
     * @param context - The execution context of the request, which can be HTTP or GraphQL.
     * @returns A promise resolving to `true` if authentication is successful, otherwise throws an `UnauthorizedException`.
     * @throws `UnauthorizedException` if API Key or Secret is missing or invalid.
     */
    canActivate(context: ExecutionContext): Promise<boolean>;
    /**
     * Retrieves the request object from the execution context, supporting both HTTP and GraphQL requests.
     *
     * @param context - The execution context of the request.
     * @returns The `Request` object extracted from the context.
     */
    getRequest(context: ExecutionContext): Request;
}
