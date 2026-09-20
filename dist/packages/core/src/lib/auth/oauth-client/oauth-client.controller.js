"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OAuthClientController = void 0;
const tslib_1 = require("tslib");
/**
 * `OAuthClientController` — admin CRUD for the multi-app OAuth client
 * registry.
 *
 * What changed from the single-app version:
 * Previously there was no admin surface — the one OAuth client was an
 * env var. This controller is the new admin entry point a tenant
 * SUPER_ADMIN / ADMIN uses to register Activepieces, n8n, etc., rotate
 * secrets, and revoke clients.
 *
 * Mounting / guards:
 * - Mounted at `/oauth/clients` (under the global API prefix).
 * - Guarded with `TenantPermissionGuard` + `PermissionGuard`, the same
 *   pair every other tenant-scoped admin controller uses.
 * - Read endpoints require `OAUTH_CLIENT_VIEW`.
 * - Mutating endpoints require `OAUTH_CLIENT_EDIT`.
 * - Both permissions are scoped to SUPER_ADMIN and ADMIN via the
 *   `ADMINISTRATION` permission group in `role-permission.model.ts`.
 *
 * Note: This is the ADMIN registry surface. The third-party-facing
 * authorization endpoints (`/integration/ever-gauzy/oauth/authorize`
 * and `/token`) are unchanged and still live in
 * `packages/auth/src/lib/oauth-app/oauth-app.controller.ts` — they will
 * be rewired to use this service in Section 3.
 */
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const contracts_1 = require("@gauzy/contracts");
const decorators_1 = require("../../shared/decorators");
const guards_1 = require("../../shared/guards");
const pipes_1 = require("../../shared/pipes");
const oauth_client_service_1 = require("./oauth-client.service");
const dto_1 = require("./dto");
let OAuthClientController = class OAuthClientController {
    constructor(oauthClientService) {
        this.oauthClientService = oauthClientService;
    }
    /**
     * Register a new OAuth client. Returns the plaintext client secret
     * EXACTLY ONCE — there is no way to retrieve it later.
     */
    async create(dto) {
        return this.oauthClientService.createClient(dto);
    }
    /**
     * Paginated list of OAuth clients visible to the caller.
     */
    async findAll(skip, take) {
        // Lightweight pagination — we deliberately avoid `BaseQueryDTO`
        // here because that DTO chain (via `FindWhereQueryDTO`) marks
        // `where` as `@IsNotEmpty()`, which would 400 every list call
        // from the admin UI for no benefit. The registry is small and
        // always scoped via `listForCurrentTenant`.
        // Validate pagination params to prevent NaN propagation
        const parsedSkip = skip !== undefined ? Number.parseInt(skip, 10) : undefined;
        const parsedTake = take !== undefined ? Number.parseInt(take, 10) : undefined;
        if (parsedSkip !== undefined && (!Number.isFinite(parsedSkip) || parsedSkip < 0)) {
            throw new common_1.BadRequestException('Invalid skip parameter: must be a non-negative integer');
        }
        if (parsedTake !== undefined && (!Number.isFinite(parsedTake) || parsedTake < 1)) {
            throw new common_1.BadRequestException('Invalid take parameter: must be a positive integer');
        }
        return this.oauthClientService.listForCurrentTenant({
            skip: parsedSkip,
            take: parsedTake
        });
    }
    /**
     * Read a single OAuth client by internal id (UUID).
     */
    async findOne(id) {
        return this.oauthClientService.findOneSafe(id);
    }
    /**
     * Update mutable fields. Cannot change `clientId` / `clientSecretHash`
     * / `codeSecret` directly — those have dedicated paths.
     */
    async update(id, dto) {
        return this.oauthClientService.updateClient(id, dto);
    }
    /**
     * Generate a new client secret. Returns the plaintext value exactly
     * once. Existing access tokens previously issued under the old secret
     * stay valid until they expire — only NEW `/token` exchanges are
     * affected.
     */
    async rotateSecret(id) {
        return this.oauthClientService.rotateSecret(id);
    }
    /**
     * Soft-delete (revoke) an OAuth client. After this, `findByClientId`
     * refuses to resolve it and the third-party app can no longer obtain
     * new authorization codes or access tokens.
     */
    async remove(id) {
        await this.oauthClientService.softDeleteClient(id);
    }
};
exports.OAuthClientController = OAuthClientController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Register a new OAuth client (third-party app)' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Client created. The response includes the plaintext clientSecret exactly once — store it immediately.'
    }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.BAD_REQUEST, description: 'Invalid input' }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.OAUTH_CLIENT_EDIT),
    (0, common_1.Post)('/'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, common_1.Header)('Cache-Control', 'no-store'),
    (0, common_1.Header)('Pragma', 'no-cache'),
    (0, pipes_1.UseValidationPipe)({ whitelist: true, transform: true }),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.CreateOAuthClientDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], OAuthClientController.prototype, "create", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'List OAuth clients for the current tenant' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.OAUTH_CLIENT_VIEW),
    (0, common_1.Get)('/'),
    tslib_1.__param(0, (0, common_1.Query)('skip')),
    tslib_1.__param(1, (0, common_1.Query)('take')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], OAuthClientController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get an OAuth client by id' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.NOT_FOUND }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.OAUTH_CLIENT_VIEW),
    (0, common_1.Get)('/:id'),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], OAuthClientController.prototype, "findOne", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update an OAuth client' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.OAUTH_CLIENT_EDIT),
    (0, common_1.Patch)('/:id'),
    (0, pipes_1.UseValidationPipe)({ whitelist: true, transform: true }),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, dto_1.UpdateOAuthClientDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], OAuthClientController.prototype, "update", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Rotate the client secret (returns plaintext once)' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.OAUTH_CLIENT_EDIT),
    (0, common_1.Post)('/:id/rotate-secret'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Header)('Cache-Control', 'no-store'),
    (0, common_1.Header)('Pragma', 'no-cache'),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], OAuthClientController.prototype, "rotateSecret", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Revoke (soft-delete) an OAuth client' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.NO_CONTENT }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.OAUTH_CLIENT_EDIT),
    (0, common_1.Delete)('/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], OAuthClientController.prototype, "remove", null);
exports.OAuthClientController = OAuthClientController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('OAuthClient'),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard, guards_1.PermissionGuard),
    (0, common_1.Controller)('/oauth/clients'),
    tslib_1.__metadata("design:paramtypes", [oauth_client_service_1.OAuthClientService])
], OAuthClientController);
//# sourceMappingURL=oauth-client.controller.js.map