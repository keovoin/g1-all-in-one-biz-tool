import { ICommand } from '@nestjs/cqrs';
export declare class CleanupInactiveTokensCommand implements ICommand {
    readonly tokenType: string;
    readonly threshold: number;
    constructor(tokenType: string, threshold: number);
}
