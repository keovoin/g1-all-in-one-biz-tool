"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Token = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const typeorm_1 = require("typeorm");
const entity_1 = require("../../core/decorators/entity");
const internal_1 = require("../../core/entities/internal");
const export_redact_decorator_1 = require("../../export-import/export-redact.decorator");
const interfaces_1 = require("../interfaces");
let Token = class Token extends internal_1.BaseEntity {
    // ---------------------------------------------------------------------------
    // Status predicates
    // ---------------------------------------------------------------------------
    /**
     * Determines if the token is currently active based on its status.
     * @returns true if status is ACTIVE, false otherwise.
     */
    isActivated() {
        return this.status === interfaces_1.TokenStatus.ACTIVE;
    }
    /**
     * Determines if the token is in a terminal state (REVOKED, EXPIRED, or ROTATED)
     * and therefore can never be used again.
     * @returns true if the token is in a terminal state.
     */
    isTerminal() {
        return (this.status === interfaces_1.TokenStatus.REVOKED ||
            this.status === interfaces_1.TokenStatus.EXPIRED ||
            this.status === interfaces_1.TokenStatus.ROTATED);
    }
    /**
     * Determines whether this token has been superseded by a newer one via rotation.
     * @returns true if status is ROTATED.
     */
    isRotated() {
        return this.status === interfaces_1.TokenStatus.ROTATED;
    }
    /**
     * Determines whether the token has been explicitly revoked.
     * @returns true if status is REVOKED.
     */
    isRevoked() {
        return this.status === interfaces_1.TokenStatus.REVOKED;
    }
    /**
     * Checks if the token has expired based on the expiresAt timestamp.
     * @returns true if the token is expired, false if not expired or no expiration set.
     */
    isExpired() {
        if (!this.expiresAt)
            return false;
        return new Date() > this.expiresAt;
    }
    /**
     * Determines if the token has been inactive for longer than the specified threshold.
     * @param threshold Time in milliseconds to consider a token inactive.
     * @returns true if the token has been inactive longer than threshold, false otherwise.
     */
    isInactive(threshold) {
        if (!this.lastUsedAt)
            return false;
        return Date.now() - this.lastUsedAt.getTime() > threshold;
    }
    /**
     * Determines whether the token has reached or exceeded its maximum allowed usage count.
     * @param maxUsageCount Maximum number of times this token may be used.
     * @returns true if the usage limit has been reached.
     */
    isAtUsageLimit(maxUsageCount) {
        return this.usageCount >= maxUsageCount;
    }
    /**
     * Returns true only when the token is active, not expired, and within its usage limit.
     * Use this as a single gate before trusting a presented token.
     * @param config Partial token configuration used for limit checks.
     * @returns true if the token is fully valid for use right now.
     */
    isUsable(config) {
        if (!this.isActivated())
            return false;
        if (this.isExpired())
            return false;
        if (config.maxUsageCount != null && this.isAtUsageLimit(config.maxUsageCount))
            return false;
        if (config.threshold != null && this.isInactive(config.threshold))
            return false;
        return true;
    }
    // ---------------------------------------------------------------------------
    // Lifecycle transitions
    // ---------------------------------------------------------------------------
    /**
     * Determines if this token can be rotated to a new token.
     * A token can be rotated only if it's active and not expired.
     * @returns true if token can be rotated, false otherwise.
     */
    canRotate() {
        return this.isActivated() && !this.isExpired();
    }
    /**
     * Determines if this token can be revoked.
     * A token can be revoked only if it's active, not expired, and not already revoked.
     * @returns true if token can be revoked, false otherwise.
     */
    canRevoke() {
        return this.canRotate() && this.revokedAt === null;
    }
    /**
     * Determines whether the token's expiry date can be extended.
     * Only active, non-terminal tokens with an existing expiry date can be extended.
     * @returns true if the expiry may be pushed forward.
     */
    canExtend() {
        return this.isActivated() && !this.isTerminal() && this.expiresAt !== null;
    }
    // ---------------------------------------------------------------------------
    // Lineage & traceability
    // ---------------------------------------------------------------------------
    /**
     * Returns true when this token was produced by rotating another token.
     * @returns true if the token has a parent in the rotation chain.
     */
    hasParent() {
        return this.rotatedFromTokenId !== null;
    }
    /**
     * Returns true when this token has already been rotated into a successor.
     * @returns true if the token has a child in the rotation chain.
     */
    hasSuccessor() {
        return this.rotatedToTokenId !== null;
    }
    /**
     * Returns true when this token is the very first in its rotation lineage.
     * @returns true if this is a root token.
     */
    isRootToken() {
        return this.rotatedFromTokenId === null;
    }
    // ---------------------------------------------------------------------------
    // Temporal helpers
    // ---------------------------------------------------------------------------
    /**
     * Calculates the remaining lifetime of the token in milliseconds.
     * @returns Milliseconds until expiry, 0 if already expired, or null if the token never expires.
     */
    getRemainingTime() {
        if (!this.expiresAt)
            return null;
        return Math.max(0, this.expiresAt.getTime() - Date.now());
    }
    /**
     * Calculates how many milliseconds have elapsed since the token was last used.
     * @returns Elapsed milliseconds since last use, or null if the token has never been used.
     */
    getInactivityTime() {
        if (!this.lastUsedAt)
            return null;
        return Date.now() - this.lastUsedAt.getTime();
    }
    /**
     * Calculates how many milliseconds have elapsed since the token was created.
     * @returns Token age in milliseconds.
     */
    getAgeTime() {
        return Date.now() - this.createdAt.getTime();
    }
    // ---------------------------------------------------------------------------
    // Metadata helpers
    // ---------------------------------------------------------------------------
    /**
     * Retrieves a typed value from the token's metadata by key.
     * @param key The metadata field name.
     * @returns The value cast to T, or undefined if the key is absent.
     */
    getMetadataValue(key) {
        if (!this.metadata)
            return undefined;
        return (key in this.metadata ? this.metadata[key] : undefined);
    }
    /**
     * Returns true when the token carries a non-null, non-empty metadata object.
     * @returns true if metadata is present.
     */
    hasMetadata() {
        return this.metadata !== null && Object.keys(this.metadata).length > 0;
    }
    // ---------------------------------------------------------------------------
    // Diagnostics
    // ---------------------------------------------------------------------------
    /**
     * Produces a human-readable summary of the token's current state suitable for
     * logging and debugging. Never includes the raw token hash.
     * @returns A plain-object snapshot of the token's observable state.
     */
    toDebugInfo() {
        return {
            tokenId: this.id,
            tokenType: this.tokenType,
            userId: this.userId,
            status: this.status,
            usageCount: this.usageCount,
            expiresAt: this.expiresAt?.toISOString() ?? null,
            lastUsedAt: this.lastUsedAt?.toISOString() ?? null,
            revokedAt: this.revokedAt?.toISOString() ?? null,
            revokedReason: this.revokedReason,
            rotatedFromTokenId: this.rotatedFromTokenId,
            rotatedToTokenId: this.rotatedToTokenId,
            isRootToken: this.isRootToken(),
            remainingMs: this.getRemainingTime(),
            ageMs: this.getAgeTime(),
            version: this.version,
            createdAt: this.createdAt?.toISOString() ?? null,
            updatedAt: this.updatedAt?.toISOString() ?? null
        };
    }
    /**
     * Runs a full health check against the given configuration and returns a
     * structured report of the token's validity and any issues detected.
     * @param config Token configuration used for limit and threshold checks.
     * @returns A structured health report.
     */
    getHealthReport(config) {
        const expired = this.isExpired();
        const inactive = config.threshold != null ? this.isInactive(config.threshold) : false;
        const atLimit = config.maxUsageCount != null ? this.isAtUsageLimit(config.maxUsageCount) : false;
        const issues = [];
        if (!this.isActivated()) {
            issues.push(`Token is not active (status: ${this.status})`);
        }
        if (expired) {
            issues.push(`Token expired at ${this.expiresAt.toISOString()}`);
        }
        if (inactive) {
            issues.push(`Token has been inactive for ${this.getInactivityTime()} ms (threshold: ${config.threshold} ms)`);
        }
        if (atLimit) {
            issues.push(`Token has reached usage limit of ${config.maxUsageCount} (current: ${this.usageCount})`);
        }
        return {
            tokenId: this.id,
            isActive: this.isActivated(),
            isExpired: expired,
            isInactive: inactive,
            canRotate: this.canRotate(),
            canRevoke: this.canRevoke(),
            isAtUsageLimit: atLimit,
            issues
        };
    }
};
exports.Token = Token;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        maxLength: 255,
        description: 'Hashed token value for secure storage and lookup',
        example: 'a3f8b9c2d1e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0'
    }),
    (0, export_redact_decorator_1.ExportRedacted)({ blank: true }),
    (0, class_validator_1.IsString)(),
    (0, entity_1.MultiORMColumn)({ type: 'varchar', length: 255, nullable: false }),
    tslib_1.__metadata("design:type", String)
], Token.prototype, "tokenHash", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        maxLength: 50,
        description: 'Type of token (e.g., access, refresh, reset_password, email_verification)',
        example: 'access_token',
        enum: ['access_token', 'refresh_token', 'reset_password', 'email_verification', 'api_key']
    }),
    (0, class_validator_1.IsString)(),
    (0, entity_1.MultiORMColumn)({ type: 'varchar', length: 50, nullable: false }),
    tslib_1.__metadata("design:type", String)
], Token.prototype, "tokenType", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        enum: interfaces_1.TokenStatus,
        enumName: 'TokenStatus',
        description: 'Current status of the token',
        example: interfaces_1.TokenStatus.ACTIVE,
        default: interfaces_1.TokenStatus.ACTIVE
    }),
    (0, class_validator_1.IsEnum)(interfaces_1.TokenStatus),
    (0, entity_1.MultiORMColumn)({ type: 'simple-enum', enum: interfaces_1.TokenStatus, default: interfaces_1.TokenStatus.ACTIVE }),
    tslib_1.__metadata("design:type", String)
], Token.prototype, "status", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: Date,
        description: 'Timestamp when the token expires. Null means no expiration.',
        example: '2025-02-16T23:59:59.999Z',
        nullable: true
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Date)
], Token.prototype, "expiresAt", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: Date,
        description: 'Timestamp of the last time this token was used for authentication or authorization',
        example: '2025-02-16T14:30:00.000Z',
        nullable: true
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Date)
], Token.prototype, "lastUsedAt", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        description: 'Number of times this token has been used',
        example: 42,
        default: 0,
        minimum: 0
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, entity_1.MultiORMColumn)({ type: 'int', default: 0 }),
    tslib_1.__metadata("design:type", Number)
], Token.prototype, "usageCount", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: String,
        format: 'uuid',
        description: 'UUID of the token that was rotated to create this token (for token rotation tracking)',
        example: '550e8400-e29b-41d4-a716-446655440000',
        nullable: true
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)('4', { message: 'rotatedFromTokenId must be a valid UUID v4' }),
    (0, typeorm_1.RelationId)((token) => token.rotatedFromToken),
    (0, entity_1.ColumnIndex)({ unique: true }),
    (0, entity_1.MultiORMColumn)({ nullable: true, relationId: true }),
    tslib_1.__metadata("design:type", String)
], Token.prototype, "rotatedFromTokenId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: () => Token,
        description: 'Reference to the previous token in the rotation chain',
        nullable: true
    }),
    (0, entity_1.MultiORMManyToOne)(() => Token, {
        nullable: true,
        onDelete: 'SET NULL'
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Object)
], Token.prototype, "rotatedFromToken", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: String,
        format: 'uuid',
        description: 'UUID of the token that replaced this token (for token rotation tracking)',
        example: '660e8400-e29b-41d4-a716-446655440001',
        nullable: true
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)('4', { message: 'rotatedToTokenId must be a valid UUID v4' }),
    (0, typeorm_1.RelationId)((token) => token.rotatedToToken),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true, relationId: true }),
    tslib_1.__metadata("design:type", String)
], Token.prototype, "rotatedToTokenId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: () => Token,
        description: 'Reference to the next token in the rotation chain',
        nullable: true
    }),
    (0, entity_1.MultiORMManyToOne)(() => Token, {
        nullable: true,
        onDelete: 'SET NULL'
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Object)
], Token.prototype, "rotatedToToken", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: Date,
        description: 'Timestamp when the token was revoked. Null if token is not revoked.',
        example: '2025-02-16T10:15:30.000Z',
        nullable: true
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Date)
], Token.prototype, "revokedAt", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: String,
        maxLength: 255,
        description: 'Reason for token revocation (e.g., "User logout", "Security breach", "Token rotation")',
        example: 'User requested password reset',
        nullable: true
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, entity_1.MultiORMColumn)({ type: 'varchar', length: 255, nullable: true }),
    tslib_1.__metadata("design:type", String)
], Token.prototype, "revokedReason", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: String,
        format: 'uuid',
        description: 'UUID of the user who revoked this token',
        example: '770e8400-e29b-41d4-a716-446655440002',
        nullable: true
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)('4', { message: 'revokedById must be a valid UUID v4' }),
    (0, typeorm_1.RelationId)((token) => token.revokedBy),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true, relationId: true }),
    tslib_1.__metadata("design:type", Object)
], Token.prototype, "revokedById", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: () => internal_1.User,
        description: 'User who revoked this token',
        nullable: true
    }),
    (0, entity_1.MultiORMManyToOne)(() => internal_1.User, {
        nullable: true,
        onDelete: 'SET NULL'
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Object)
], Token.prototype, "revokedBy", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: Object,
        description: 'Additional metadata stored as JSON (e.g., device info, IP address, user agent, mac)',
        example: {
            clientId: 'abc123',
            deviceType: 'mobile',
            userAgent: 'Mozilla/5.0...',
            location: 'New York, US'
        },
        nullable: true
    }),
    (0, class_validator_1.IsOptional)(),
    (0, entity_1.JsonColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Object)
], Token.prototype, "metadata", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        description: 'Version number for optimistic locking (automatically incremented on updates)',
        example: 1,
        readOnly: true
    }),
    (0, typeorm_1.VersionColumn)(),
    tslib_1.__metadata("design:type", Number)
], Token.prototype, "version", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        format: 'uuid',
        description: 'UUID of the user who owns this token',
        example: '880e8400-e29b-41d4-a716-446655440003'
    }),
    (0, class_validator_1.IsUUID)('4', { message: 'userId must be a valid UUID v4' }),
    (0, typeorm_1.RelationId)((token) => token.user),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: false, relationId: true }),
    tslib_1.__metadata("design:type", String)
], Token.prototype, "userId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        type: () => internal_1.User,
        description: 'User who owns this token'
    }),
    (0, entity_1.MultiORMManyToOne)(() => internal_1.User, {
        nullable: false,
        onDelete: 'CASCADE'
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Object)
], Token.prototype, "user", void 0);
exports.Token = Token = tslib_1.__decorate([
    (0, typeorm_1.Index)(['tokenHash'], { unique: true }),
    (0, typeorm_1.Index)(['tokenHash', 'status']),
    (0, typeorm_1.Index)(['userId', 'tokenType', 'status']),
    (0, typeorm_1.Index)(['expiresAt']),
    (0, entity_1.MultiORMEntity)('tokens')
], Token);
//# sourceMappingURL=token.entity.js.map