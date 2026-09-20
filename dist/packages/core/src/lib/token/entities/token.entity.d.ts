import { IUser } from '@gauzy/contracts';
import { BaseEntity } from '../../core/entities/internal';
import { IToken, ITokenConfig, ITokenHealthReport, TokenStatus } from '../interfaces';
export declare class Token extends BaseEntity implements IToken {
    tokenHash: string;
    tokenType: string;
    status: TokenStatus;
    expiresAt: Date | null;
    lastUsedAt: Date | null;
    usageCount: number;
    rotatedFromTokenId: string | null;
    rotatedFromToken: IToken | null;
    rotatedToTokenId: string | null;
    rotatedToToken: IToken | null;
    revokedAt: Date | null;
    revokedReason: string | null;
    revokedById: IUser['id'] | null;
    revokedBy: IUser | null;
    metadata: Record<string, any> | null;
    version: number;
    userId: string;
    user: IUser;
    /**
     * Determines if the token is currently active based on its status.
     * @returns true if status is ACTIVE, false otherwise.
     */
    isActivated(): boolean;
    /**
     * Determines if the token is in a terminal state (REVOKED, EXPIRED, or ROTATED)
     * and therefore can never be used again.
     * @returns true if the token is in a terminal state.
     */
    isTerminal(): boolean;
    /**
     * Determines whether this token has been superseded by a newer one via rotation.
     * @returns true if status is ROTATED.
     */
    isRotated(): boolean;
    /**
     * Determines whether the token has been explicitly revoked.
     * @returns true if status is REVOKED.
     */
    isRevoked(): boolean;
    /**
     * Checks if the token has expired based on the expiresAt timestamp.
     * @returns true if the token is expired, false if not expired or no expiration set.
     */
    isExpired(): boolean;
    /**
     * Determines if the token has been inactive for longer than the specified threshold.
     * @param threshold Time in milliseconds to consider a token inactive.
     * @returns true if the token has been inactive longer than threshold, false otherwise.
     */
    isInactive(threshold: number): boolean;
    /**
     * Determines whether the token has reached or exceeded its maximum allowed usage count.
     * @param maxUsageCount Maximum number of times this token may be used.
     * @returns true if the usage limit has been reached.
     */
    isAtUsageLimit(maxUsageCount: number): boolean;
    /**
     * Returns true only when the token is active, not expired, and within its usage limit.
     * Use this as a single gate before trusting a presented token.
     * @param config Partial token configuration used for limit checks.
     * @returns true if the token is fully valid for use right now.
     */
    isUsable(config: Pick<ITokenConfig, 'maxUsageCount' | 'threshold'>): boolean;
    /**
     * Determines if this token can be rotated to a new token.
     * A token can be rotated only if it's active and not expired.
     * @returns true if token can be rotated, false otherwise.
     */
    canRotate(): boolean;
    /**
     * Determines if this token can be revoked.
     * A token can be revoked only if it's active, not expired, and not already revoked.
     * @returns true if token can be revoked, false otherwise.
     */
    canRevoke(): boolean;
    /**
     * Determines whether the token's expiry date can be extended.
     * Only active, non-terminal tokens with an existing expiry date can be extended.
     * @returns true if the expiry may be pushed forward.
     */
    canExtend(): boolean;
    /**
     * Returns true when this token was produced by rotating another token.
     * @returns true if the token has a parent in the rotation chain.
     */
    hasParent(): boolean;
    /**
     * Returns true when this token has already been rotated into a successor.
     * @returns true if the token has a child in the rotation chain.
     */
    hasSuccessor(): boolean;
    /**
     * Returns true when this token is the very first in its rotation lineage.
     * @returns true if this is a root token.
     */
    isRootToken(): boolean;
    /**
     * Calculates the remaining lifetime of the token in milliseconds.
     * @returns Milliseconds until expiry, 0 if already expired, or null if the token never expires.
     */
    getRemainingTime(): number | null;
    /**
     * Calculates how many milliseconds have elapsed since the token was last used.
     * @returns Elapsed milliseconds since last use, or null if the token has never been used.
     */
    getInactivityTime(): number | null;
    /**
     * Calculates how many milliseconds have elapsed since the token was created.
     * @returns Token age in milliseconds.
     */
    getAgeTime(): number;
    /**
     * Retrieves a typed value from the token's metadata by key.
     * @param key The metadata field name.
     * @returns The value cast to T, or undefined if the key is absent.
     */
    getMetadataValue<T = unknown>(key: string): T | undefined;
    /**
     * Returns true when the token carries a non-null, non-empty metadata object.
     * @returns true if metadata is present.
     */
    hasMetadata(): boolean;
    /**
     * Produces a human-readable summary of the token's current state suitable for
     * logging and debugging. Never includes the raw token hash.
     * @returns A plain-object snapshot of the token's observable state.
     */
    toDebugInfo(): Record<string, unknown>;
    /**
     * Runs a full health check against the given configuration and returns a
     * structured report of the token's validity and any issues detected.
     * @param config Token configuration used for limit and threshold checks.
     * @returns A structured health report.
     */
    getHealthReport(config: Pick<ITokenConfig, 'maxUsageCount' | 'threshold'>): ITokenHealthReport;
}
