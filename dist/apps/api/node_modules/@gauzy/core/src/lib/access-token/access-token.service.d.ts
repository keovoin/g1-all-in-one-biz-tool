import { ScopedTokenService } from '../token/scoped-token.service';
import { IAccessTokenMetadata } from './type.token';
export declare class AccessTokenService {
    private readonly tokenService;
    constructor(tokenService: ScopedTokenService);
    generate(userId: string, metadata?: IAccessTokenMetadata): Promise<string>;
    verify(rawToken: string): Promise<IAccessTokenMetadata>;
    revoke(rawToken: string, reason?: string, revokedById?: string): Promise<void>;
}
