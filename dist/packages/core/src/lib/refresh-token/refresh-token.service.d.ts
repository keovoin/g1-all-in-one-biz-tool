import { IValidatedToken } from '../token/interfaces';
import { ScopedTokenService } from '../token/scoped-token.service';
import { ICurrentUserProvider } from './current-user.provider';
import { IRefreshTokenMetadata } from './type.token';
export declare class RefreshTokenService {
    private readonly tokenService;
    private readonly currentUserProvider;
    constructor(tokenService: ScopedTokenService, currentUserProvider: ICurrentUserProvider);
    verify(rawToken: string): Promise<IValidatedToken>;
    generate(userId: string, metadata?: IRefreshTokenMetadata): Promise<string>;
    rotate(rawOldToken: string, metadata?: IRefreshTokenMetadata): Promise<string>;
    revoke(rawToken: string, reason?: string, revokedById?: string): Promise<void>;
    getUserId(): string;
}
