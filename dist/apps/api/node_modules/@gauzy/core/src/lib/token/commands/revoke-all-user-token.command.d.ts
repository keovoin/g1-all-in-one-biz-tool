import { ICommand } from '@nestjs/cqrs';
export declare class RevokeAllUserTokensCommand implements ICommand {
    readonly userId: string;
    readonly tokenType: string;
    readonly revokedById?: string;
    readonly reason?: string;
    constructor(userId: string, tokenType: string, revokedById?: string, reason?: string);
}
