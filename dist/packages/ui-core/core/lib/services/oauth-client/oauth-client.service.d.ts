import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import type { ID, IOAuthClient, IOAuthClientCreateInput, IOAuthClientUpdateInput, IOAuthClientWithSecret, IPagination } from '@gauzy/contracts';
import * as i0 from "@angular/core";
export declare class OAuthClientManagementService {
    private readonly http;
    private readonly baseUrl;
    constructor(http: HttpClient);
    /** Paginated list of OAuth clients visible to the current user. */
    list(params?: {
        skip?: number;
        take?: number;
    }): Observable<IPagination<IOAuthClient>>;
    /** Read a single client by internal uuid. */
    getById(id: ID): Observable<IOAuthClient>;
    /**
     * Register a new OAuth client.
     * Returns the plaintext client secret ONCE — surface it immediately.
     */
    create(input: IOAuthClientCreateInput): Observable<IOAuthClientWithSecret>;
    /** Update mutable fields (name, redirectUris, scopes, etc.). */
    update(id: ID, input: IOAuthClientUpdateInput): Observable<IOAuthClient>;
    /**
     * Rotate the client secret. Old access tokens keep working until they
     * expire; only NEW `/token` exchanges must use the rotated secret.
     * Returns the plaintext secret ONCE.
     */
    rotateSecret(id: ID): Observable<IOAuthClientWithSecret>;
    /** Soft-delete (revoke). After this, `findByClientId` refuses to resolve the row. */
    delete(id: ID): Observable<void>;
    static ɵfac: i0.ɵɵFactoryDeclaration<OAuthClientManagementService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<OAuthClientManagementService>;
}
