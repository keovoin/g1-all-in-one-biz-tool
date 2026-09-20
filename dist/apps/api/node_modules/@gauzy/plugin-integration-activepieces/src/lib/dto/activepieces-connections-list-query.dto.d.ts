import { ActivepiecesConnectionScope, ActivepiecesConnectionStatus } from '@gauzy/contracts';
export declare class ActivepiecesConnectionsListQueryDto {
    readonly projectId: string;
    readonly cursor?: string;
    readonly scope?: ActivepiecesConnectionScope;
    readonly pieceName?: string;
    readonly displayName?: string;
    readonly status?: ActivepiecesConnectionStatus;
    readonly limit: number;
}
