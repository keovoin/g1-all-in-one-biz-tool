import { ID, IPagination } from '@gauzy/contracts';
import { OAuthClientService } from './oauth-client.service';
import { CreateOAuthClientDTO, OAuthClientResponseDTO, OAuthClientWithSecretResponseDTO, UpdateOAuthClientDTO } from './dto';
export declare class OAuthClientController {
    private readonly oauthClientService;
    constructor(oauthClientService: OAuthClientService);
    /**
     * Register a new OAuth client. Returns the plaintext client secret
     * EXACTLY ONCE — there is no way to retrieve it later.
     */
    create(dto: CreateOAuthClientDTO): Promise<OAuthClientWithSecretResponseDTO>;
    /**
     * Paginated list of OAuth clients visible to the caller.
     */
    findAll(skip?: string, take?: string): Promise<IPagination<OAuthClientResponseDTO>>;
    /**
     * Read a single OAuth client by internal id (UUID).
     */
    findOne(id: ID): Promise<OAuthClientResponseDTO>;
    /**
     * Update mutable fields. Cannot change `clientId` / `clientSecretHash`
     * / `codeSecret` directly — those have dedicated paths.
     */
    update(id: ID, dto: UpdateOAuthClientDTO): Promise<OAuthClientResponseDTO>;
    /**
     * Generate a new client secret. Returns the plaintext value exactly
     * once. Existing access tokens previously issued under the old secret
     * stay valid until they expire — only NEW `/token` exchanges are
     * affected.
     */
    rotateSecret(id: ID): Promise<OAuthClientWithSecretResponseDTO>;
    /**
     * Soft-delete (revoke) an OAuth client. After this, `findByClientId`
     * refuses to resolve it and the third-party app can no longer obtain
     * new authorization codes or access tokens.
     */
    remove(id: ID): Promise<void>;
}
