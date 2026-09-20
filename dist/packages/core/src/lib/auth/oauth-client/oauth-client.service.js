"use strict";
var OAuthClientService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OAuthClientService = void 0;
const tslib_1 = require("tslib");
/**
 * `OAuthClientService` — CRUD + secret lifecycle for the multi-app OAuth
 * client registry.
 *
 * What changed from the single-app version:
 * Previously the only OAuth credentials lived in env vars and were read
 * by `SocialAuthService.getOAuthAppConfig()`. Every consumer (Activepieces)
 * shared them. This service replaces that with per-row credentials so
 * each third party (Activepieces, n8n, Make.com, …) is isolated.
 *
 * Secret handling:
 * - The plaintext `clientSecret` is generated server-side, returned to the
 *   caller exactly ONCE in the response DTO, then immediately discarded.
 * - Only the scrypt hash is persisted (`clientSecretHash` column, marked
 *   `select: false` on the entity).
 * - `validateClientSecret` is the only path that reads the hash and is
 *   used by the auth pipeline (Section 3) during the `/token` exchange.
 * - The per-client `codeSecret` is also generated server-side and kept
 *   server-side; it never leaves the row except to sign authorization
 *   codes inside `AuthService.createOAuthAppAuthorizationCode`.
 */
const common_1 = require("@nestjs/common");
const node_crypto_1 = require("node:crypto");
const typeorm_1 = require("typeorm");
const utils_1 = require("@gauzy/utils");
const contracts_1 = require("@gauzy/contracts");
const tenant_aware_crud_service_1 = require("../../core/crud/tenant-aware-crud.service");
const request_context_1 = require("../../core/context/request-context");
const type_orm_oauth_client_repository_1 = require("./repository/type-orm-oauth-client.repository");
const mikro_orm_oauth_client_repository_1 = require("./repository/mikro-orm-oauth-client.repository");
const oauth_client_response_dto_1 = require("./dto/oauth-client.response.dto");
let OAuthClientService = OAuthClientService_1 = class OAuthClientService extends tenant_aware_crud_service_1.TenantAwareCrudService {
    constructor(typeOrmOAuthClientRepository, mikroOrmOAuthClientRepository) {
        super(typeOrmOAuthClientRepository, mikroOrmOAuthClientRepository);
        this.typeOrmOAuthClientRepository = typeOrmOAuthClientRepository;
        this.mikroOrmOAuthClientRepository = mikroOrmOAuthClientRepository;
        this.logger = new common_1.Logger(OAuthClientService_1.name);
    }
    // ---------------------------------------------------------------------------
    // Identifier / secret generation
    // ---------------------------------------------------------------------------
    /**
     * Generates a public client identifier in the form `gauzy_<base64url>`.
     * 32 bytes of entropy → ~43 base64url characters → fits comfortably in
     * the `varchar(64)` column with room for the prefix.
     */
    generateClientId() {
        return `gauzy_${(0, node_crypto_1.randomBytes)(32).toString('base64url')}`;
    }
    /**
     * Generates a 48-byte high-entropy secret encoded as base64url.
     * Used for both the plaintext `clientSecret` (which is then hashed)
     * and the per-client `codeSecret` (which is kept as-is server-side
     * to sign authorization codes).
     */
    generateSecret() {
        return (0, node_crypto_1.randomBytes)(48).toString('base64url');
    }
    // ---------------------------------------------------------------------------
    // Create
    // ---------------------------------------------------------------------------
    /**
     * Register a new OAuth client. Generates `clientId`, `clientSecret`
     * (returned plaintext exactly once), and `codeSecret` (server-side only).
     *
     * Whether the client is tenant-scoped or global depends on whether the
     * caller is a SUPER_ADMIN AND explicitly omits `tenantId`. Today every
     * authenticated request has a tenant context via JWT, so by default the
     * row is owned by the caller's tenant. The legacy seed (Section 3) is
     * the only path that creates a `tenantId = NULL` cross-tenant client.
     */
    async createClient(dto, options) {
        const clientType = dto.clientType ?? contracts_1.OAuthClientType.CONFIDENTIAL;
        // Public clients require end-to-end PKCE support in the `/token`
        // flow, which is deferred to a later phase. Registering them now
        // would produce a row with a null `clientSecretHash` that the token
        // exchange rejects as unauthorized — i.e. an unusable client.
        // Block registration until PKCE enforcement lands.
        if (clientType !== contracts_1.OAuthClientType.CONFIDENTIAL) {
            throw new common_1.BadRequestException('Only confidential OAuth clients can be registered at this time. Public (PKCE) client support is pending.');
        }
        const plaintextSecret = this.generateSecret();
        const clientSecretHash = await (0, utils_1.hashPassword)(plaintextSecret);
        const codeSecret = this.generateSecret();
        const clientId = this.generateClientId();
        const isSuperAdmin = request_context_1.RequestContext.hasRoles([contracts_1.RolesEnum.SUPER_ADMIN]);
        const currentTenantId = request_context_1.RequestContext.currentTenantId() ?? null;
        if (options?.tenantId === null && !isSuperAdmin) {
            throw new common_1.BadRequestException('Only super admins can create global OAuth clients.');
        }
        const tenantId = options?.tenantId === null
            ? null
            : (options?.tenantId ?? currentTenantId);
        if (tenantId === null && !isSuperAdmin) {
            throw new common_1.BadRequestException('Tenant context is required to create an OAuth client.');
        }
        // For global clients (tenantId=null), we must bypass TenantAwareCrudService's automatic
        // tenant enrichment which would overwrite tenantId with the current tenant context.
        const entityData = {
            clientId,
            clientSecretHash,
            codeSecret,
            name: dto.name,
            description: dto.description ?? null,
            clientType,
            redirectUris: dto.redirectUris,
            allowedScopes: dto.allowedScopes ?? [],
            allowedGrantTypes: dto.allowedGrantTypes ?? [contracts_1.OAuthGrantType.AUTHORIZATION_CODE],
            pkceRequired: dto.pkceRequired ?? false,
            accessTokenTtl: dto.accessTokenTtl ?? 86400,
            refreshTokenTtl: dto.refreshTokenTtl ?? 2592000,
            // Preserve an explicit `null` so saveWithoutEnrichment persists a
            // global (cross-tenant) client; only `undefined` lets
            // TenantAwareCrudService inject the current tenant.
            tenantId: tenantId,
            isActive: true
        };
        // Use saveWithoutEnrichment for global clients to avoid tenant enrichment
        const entity = tenantId === null
            ? await this.saveWithoutEnrichment(entityData)
            : await super.create(entityData);
        this.logger.log(`OAuth client created: id=${entity.id}, clientId=${clientId}, name="${dto.name}", tenantId=${tenantId ?? 'GLOBAL'}, type=${clientType}`);
        return oauth_client_response_dto_1.OAuthClientWithSecretResponseDTO.fromEntityWithSecret(entity, plaintextSecret);
    }
    // ---------------------------------------------------------------------------
    // Read
    // ---------------------------------------------------------------------------
    /**
     * Public lookup used by the auth pipeline during `/authorize` and
     * `/token`. Includes both tenant-scoped clients AND global (`tenantId = NULL`)
     * clients, and reads the `clientSecretHash` + `codeSecret` columns explicitly
     * because they are marked `select: false` on the entity.
     *
     * NOTE: This method intentionally has NO tenant constraint — the auth pipeline
     * needs to resolve clients by `clientId` alone. Security is enforced via:
     * - `isActive` / `isArchived` checks (inactive clients can't auth)
     * - `clientSecret` validation during `/token` exchange
     * - PKCE for public clients (when enabled)
     *
     * Throws `NotFoundException` when the client doesn't exist or is
     * inactive — the controller maps this to `400 invalid_client`.
     */
    async findByClientId(clientId) {
        if (!clientId) {
            throw new common_1.BadRequestException('clientId is required');
        }
        const repo = this.typeOrmRepository;
        const client = await repo
            .createQueryBuilder('oauth_client')
            .addSelect('oauth_client.clientSecretHash')
            .addSelect('oauth_client.codeSecret')
            .where('oauth_client.clientId = :clientId', { clientId })
            .andWhere('oauth_client.isActive = :isActive', { isActive: true })
            .andWhere('oauth_client.isArchived = :isArchived', { isArchived: false })
            .getOne();
        if (!client) {
            // Do not echo clientId — public OAuth flows must not distinguish invalid ids
            throw new common_1.NotFoundException('OAuth client not found or inactive');
        }
        return client;
    }
    /**
     * Admin read — paginated list of clients visible to the caller.
     * SUPER_ADMINs see every row in their tenant + every global row;
     * regular ADMINs see only their tenant's rows.
     */
    async listForCurrentTenant(options) {
        const tenantId = request_context_1.RequestContext.currentTenantId();
        const isSuperAdmin = request_context_1.RequestContext.hasRoles([contracts_1.RolesEnum.SUPER_ADMIN]);
        const baseWhere = options?.where ?? {};
        // SQL `IN (...)` does not match NULL, so to express
        // `tenantId = :tenantId OR tenantId IS NULL` we must use the
        // array-of-conditions form (TypeORM ORs them together).
        let where;
        if (isSuperAdmin) {
            where = tenantId
                ? [
                    { ...baseWhere, tenantId },
                    { ...baseWhere, tenantId: (0, typeorm_1.IsNull)() }
                ]
                : { ...baseWhere, tenantId: (0, typeorm_1.IsNull)() };
        }
        else {
            // A non-super-admin without a tenant context has nothing to list (a null tenantId used to be
            // dropped from the where and listed EVERY tenant's clients).
            if (!tenantId) {
                return { items: [], total: 0 };
            }
            where = { ...baseWhere, tenantId };
        }
        const [items, total] = await this.typeOrmRepository.findAndCount({
            ...options,
            where
        });
        return {
            items: items.map((it) => oauth_client_response_dto_1.OAuthClientResponseDTO.fromEntity(it)),
            total
        };
    }
    /**
     * Lookup by primary key with the correct tenant boundary for admin
     * mutation flows:
     *   - Regular ADMINs: own-tenant only (delegates to `findOneByIdString`).
     *   - SUPER_ADMINs:   own-tenant OR global (`tenantId IS NULL`).
     *
     * A SUPER_ADMIN of tenant A must NOT be able to reach another tenant's
     * row by UUID, so we cannot query by `id` alone.
     */
    async findScopedById(id) {
        const isSuperAdmin = request_context_1.RequestContext.hasRoles([contracts_1.RolesEnum.SUPER_ADMIN]);
        if (!isSuperAdmin) {
            return this.findOneByIdString(id);
        }
        const tenantId = request_context_1.RequestContext.currentTenantId();
        const where = tenantId
            ? [
                { id, tenantId },
                { id, tenantId: (0, typeorm_1.IsNull)() }
            ]
            : { id, tenantId: (0, typeorm_1.IsNull)() };
        return this.typeOrmRepository.findOne({ where });
    }
    async findOneSafe(id) {
        const entity = await this.findScopedById(id);
        if (!entity) {
            throw new common_1.NotFoundException(`OAuth client not found: ${id}`);
        }
        return oauth_client_response_dto_1.OAuthClientResponseDTO.fromEntity(entity);
    }
    // ---------------------------------------------------------------------------
    // Update
    // ---------------------------------------------------------------------------
    async updateClient(id, dto) {
        const existing = await this.findScopedById(id);
        if (!existing) {
            throw new common_1.NotFoundException(`OAuth client not found: ${id}`);
        }
        // Global (tenantId=null) rows cannot be updated via `super.update`
        // because the tenant-aware base service adds a `tenantId` filter;
        // fall back to a direct repository update for those.
        if (existing.tenantId === null) {
            await this.typeOrmRepository.update(id, dto);
        }
        else {
            await super.update(id, dto);
        }
        const updated = await this.findScopedById(id);
        if (!updated) {
            throw new common_1.NotFoundException(`OAuth client not found after update: ${id}`);
        }
        return oauth_client_response_dto_1.OAuthClientResponseDTO.fromEntity(updated);
    }
    // ---------------------------------------------------------------------------
    // Secret rotation
    // ---------------------------------------------------------------------------
    /**
     * Generates a fresh secret, hashes it, persists the new hash, and
     * returns the plaintext exactly once. Useful when an operator suspects
     * a leak — every previously issued token remains valid (different
     * concern), but no new `/token` exchange will succeed with the old
     * secret. Does NOT rotate `codeSecret`: any in-flight authorization
     * code stays signed by the old per-client HMAC secret.
     */
    async rotateSecret(id) {
        const existing = await this.findScopedById(id);
        if (!existing) {
            throw new common_1.NotFoundException(`OAuth client not found: ${id}`);
        }
        // Public clients intentionally have no secret — they authenticate via
        // PKCE. Rotating would overwrite their NULL hash with a real one and
        // break the public-client security model.
        if (existing.clientType !== contracts_1.OAuthClientType.CONFIDENTIAL) {
            throw new common_1.BadRequestException('Secret rotation is only supported for confidential clients; public clients use PKCE.');
        }
        const plaintextSecret = this.generateSecret();
        const clientSecretHash = await (0, utils_1.hashPassword)(plaintextSecret);
        if (existing.tenantId === null) {
            await this.typeOrmRepository.update(id, { clientSecretHash });
        }
        else {
            await super.update(id, { clientSecretHash });
        }
        this.logger.warn(`OAuth client secret rotated: id=${id}, clientId=${existing.clientId}`);
        const refreshed = await this.findScopedById(id);
        if (!refreshed) {
            throw new common_1.NotFoundException(`OAuth client not found after secret rotation: ${id}`);
        }
        return oauth_client_response_dto_1.OAuthClientWithSecretResponseDTO.fromEntityWithSecret(refreshed, plaintextSecret);
    }
    // ---------------------------------------------------------------------------
    // Delete
    // ---------------------------------------------------------------------------
    /**
     * Soft-delete via the inherited `softRemove` semantics. The row stays
     * but `deletedAt` is set, so `findByClientId` (which filters on
     * `isActive = true`) will refuse to resolve it. Equivalent in effect
     * to revoking the third-party app.
     */
    async softDeleteClient(id) {
        const existing = await this.findScopedById(id);
        if (!existing) {
            throw new common_1.NotFoundException(`OAuth client not found: ${id}`);
        }
        if (existing.tenantId === null) {
            // `softRemove` applies tenant filtering; for global clients
            // (visible to SUPER_ADMINs) fall back to a direct soft-delete.
            await this.typeOrmRepository.softDelete(id);
        }
        else {
            await this.softRemove(id);
        }
        this.logger.warn(`OAuth client soft-deleted: id=${id}, clientId=${existing.clientId}`);
    }
    // ---------------------------------------------------------------------------
    // Auth-pipeline helpers (consumed by Section 3 — `AuthService`)
    // ---------------------------------------------------------------------------
    /**
     * Constant-time comparison of a presented client secret against the
     * stored scrypt hash. Used by `AuthService.exchangeOAuthAppAuthorizationCode`
     * during `/token` to authenticate confidential clients.
     *
     * Public clients (`clientType === 'public'`) have a NULL hash and are
     * authenticated via PKCE instead — PKCE enforcement is deferred to a
     * later phase, so for now this method returns `false` for public clients
     * to fail safe.
     *
     * @param clientOrHash - Either an OAuthClient entity or just the clientSecretHash string
     * @param plainSecret - The plaintext secret to validate
     */
    async validateClientSecret(clientOrHash, plainSecret) {
        const clientSecretHash = typeof clientOrHash === 'string' ? clientOrHash : clientOrHash?.clientSecretHash;
        if (!clientSecretHash || !plainSecret) {
            return false;
        }
        return (0, utils_1.verifyPassword)(plainSecret, clientSecretHash);
    }
};
exports.OAuthClientService = OAuthClientService;
exports.OAuthClientService = OAuthClientService = OAuthClientService_1 = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_oauth_client_repository_1.TypeOrmOAuthClientRepository,
        mikro_orm_oauth_client_repository_1.MikroOrmOAuthClientRepository])
], OAuthClientService);
//# sourceMappingURL=oauth-client.service.js.map