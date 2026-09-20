export declare class ActivepiecesMcpToolDto {
    readonly id?: string;
    readonly type?: string;
    readonly pieceMetadata?: Record<string, unknown>;
    readonly flowId?: string;
}
export declare class ActivepiecesMcpUpdateDto {
    readonly name?: string;
    readonly tools?: ActivepiecesMcpToolDto[];
}
