"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiKeyAuthGuard = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const graphql_1 = require("@nestjs/graphql");
const tenant_api_key_service_1 = require("../../tenant-api-key/tenant-api-key.service");
let ApiKeyAuthGuard = class ApiKeyAuthGuard {
    constructor(_tenantApiKeyService) {
        this._tenantApiKeyService = _tenantApiKeyService;
    }
    /**
     * Validates API Key and Secret from the request headers to determine if the request can proceed.
     *
     * @param context - The execution context of the request, which can be HTTP or GraphQL.
     * @returns A promise resolving to `true` if authentication is successful, otherwise throws an `UnauthorizedException`.
     * @throws `UnauthorizedException` if API Key or Secret is missing or invalid.
     */
    async canActivate(context) {
        // Retrieve the API Key and Secret from the request headers
        const request = this.getRequest(context);
        const apiKey = request.header('X-APP-ID');
        const apiSecret = request.header('X-API-KEY');
        if (!apiKey || !apiSecret) {
            throw new common_1.UnauthorizedException('Missing API credentials. Please provide a valid X-APP-ID and X-API-KEY in the request headers to proceed.');
        }
        // Proceed with API Key authentication if both are present
        const tenantApiKey = await this._tenantApiKeyService.validateApiKeyAndSecret(apiKey, apiSecret);
        if (!tenantApiKey) {
            throw new common_1.UnauthorizedException('Access Denied: The provided X-APP-ID or X-API-KEY is invalid or does not have the required permissions.');
        }
        // Set the tenant ID in the request context (via user object)
        // This ensures that TenantAwareCrudService methods correctly filter queries by tenant
        request['user'] = {
            ...request['user'],
            tenantId: tenantApiKey.tenantId
        };
        return true;
    }
    /**
     * Retrieves the request object from the execution context, supporting both HTTP and GraphQL requests.
     *
     * @param context - The execution context of the request.
     * @returns The `Request` object extracted from the context.
     */
    getRequest(context) {
        // Check if the execution context is of type 'graphql'
        if (context.getType() === 'graphql') {
            // Extract the request object from the GraphQL context
            return graphql_1.GqlExecutionContext.create(context).getContext().req;
        }
        // If the context is HTTP-based, extract the request object from the HTTP context
        return context.switchToHttp().getRequest();
    }
};
exports.ApiKeyAuthGuard = ApiKeyAuthGuard;
exports.ApiKeyAuthGuard = ApiKeyAuthGuard = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [tenant_api_key_service_1.TenantApiKeyService])
], ApiKeyAuthGuard);
//# sourceMappingURL=api-key-auth.guard.js.map