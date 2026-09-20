import { FindManyOptions } from 'typeorm';
import { ID, IPagination } from '@gauzy/contracts';
import { TenantAwareCrudService } from '../../core/crud/tenant-aware-crud.service';
import { OAuthClient } from './oauth-client.entity';
import { TypeOrmOAuthClientRepository } from './repository/type-orm-oauth-client.repository';
import { MikroOrmOAuthClientRepository } from './repository/mikro-orm-oauth-client.repository';
import { CreateOAuthClientDTO } from './dto/create-oauth-client.dto';
import { UpdateOAuthClientDTO } from './dto/update-oauth-client.dto';
import { OAuthClientResponseDTO, OAuthClientWithSecretResponseDTO } from './dto/oauth-client.response.dto';
export declare class OAuthClientService extends TenantAwareCrudService<OAuthClient> {
    readonly typeOrmOAuthClientRepository: TypeOrmOAuthClientRepository;
    readonly mikroOrmOAuthClientRepository: MikroOrmOAuthClientRepository;
    private readonly logger;
    constructor(typeOrmOAuthClientRepository: TypeOrmOAuthClientRepository, mikroOrmOAuthClientRepository: MikroOrmOAuthClientRepository);
    /**
     * Generates a public client identifier in the form `gauzy_<base64url>`.
     * 32 bytes of entropy → ~43 base64url characters → fits comfortably in
     * the `varchar(64)` column with room for the prefix.
     */
    private generateClientId;
    /**
     * Generates a 48-byte high-entropy secret encoded as base64url.
     * Used for both the plaintext `clientSecret` (which is then hashed)
     * and the per-client `codeSecret` (which is kept as-is server-side
     * to sign authorization codes).
     */
    private generateSecret;
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
    createClient(dto: CreateOAuthClientDTO, options?: {
        tenantId?: ID | null;
    }): Promise<OAuthClientWithSecretResponseDTO>;
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
    findByClientId(clientId: string): Promise<OAuthClient>;
    /**
     * Admin read — paginated list of clients visible to the caller.
     * SUPER_ADMINs see every row in their tenant + every global row;
     * regular ADMINs see only their tenant's rows.
     */
    listForCurrentTenant(options?: FindManyOptions<OAuthClient>): Promise<IPagination<OAuthClientResponseDTO>>;
    /**
     * Lookup by primary key with the correct tenant boundary for admin
     * mutation flows:
     *   - Regular ADMINs: own-tenant only (delegates to `findOneByIdString`).
     *   - SUPER_ADMINs:   own-tenant OR global (`tenantId IS NULL`).
     *
     * A SUPER_ADMIN of tenant A must NOT be able to reach another tenant's
     * row by UUID, so we cannot query by `id` alone.
     */
    private findScopedById;
    findOneSafe(id: ID): Promise<OAuthClientResponseDTO>;
    updateClient(id: ID, dto: UpdateOAuthClientDTO): Promise<OAuthClientResponseDTO>;
    /**
     * Generates a fresh secret, hashes it, persists the new hash, and
     * returns the plaintext exactly once. Useful when an operator suspects
     * a leak — every previously issued token remains valid (different
     * concern), but no new `/token` exchange will succeed with the old
     * secret. Does NOT rotate `codeSecret`: any in-flight authorization
     * code stays signed by the old per-client HMAC secret.
     */
    rotateSecret(id: ID): Promise<OAuthClientWithSecretResponseDTO>;
    /**
     * Soft-delete via the inherited `softRemove` semantics. The row stays
     * but `deletedAt` is set, so `findByClientId` (which filters on
     * `isActive = true`) will refuse to resolve it. Equivalent in effect
     * to revoking the third-party app.
     */
    softDeleteClient(id: ID): Promise<void>;
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
    validateClientSecret(clientOrHash: OAuthClient | string | null, plainSecret: string): Promise<boolean>;
}
