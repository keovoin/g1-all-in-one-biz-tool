"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivepiecesConnectionsListQueryDto = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const contracts_1 = require("@gauzy/contracts");
class ActivepiecesConnectionsListQueryDto {
    constructor() {
        this.limit = 10;
    }
}
exports.ActivepiecesConnectionsListQueryDto = ActivepiecesConnectionsListQueryDto;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Activepieces project ID',
        type: String,
        example: 'project-123'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Transform)(({ value }) => (typeof value === 'string' ? value.trim() : value)),
    (0, class_validator_1.IsNotEmpty)(),
    tslib_1.__metadata("design:type", String)
], ActivepiecesConnectionsListQueryDto.prototype, "projectId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Pagination cursor',
        type: String,
        example: 'cursor-abc123'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Transform)(({ value }) => (typeof value === 'string' ? value.trim() : value)),
    tslib_1.__metadata("design:type", String)
], ActivepiecesConnectionsListQueryDto.prototype, "cursor", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Connection scope',
        enum: contracts_1.ActivepiecesConnectionScope,
        example: contracts_1.ActivepiecesConnectionScope.PROJECT
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(contracts_1.ActivepiecesConnectionScope),
    tslib_1.__metadata("design:type", String)
], ActivepiecesConnectionsListQueryDto.prototype, "scope", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by piece name',
        type: String,
        example: 'slack'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Transform)(({ value }) => (typeof value === 'string' ? value.trim() : value)),
    tslib_1.__metadata("design:type", String)
], ActivepiecesConnectionsListQueryDto.prototype, "pieceName", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by display name',
        type: String,
        example: 'My Slack Connection'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Transform)(({ value }) => (typeof value === 'string' ? value.trim() : value)),
    tslib_1.__metadata("design:type", String)
], ActivepiecesConnectionsListQueryDto.prototype, "displayName", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by connection status',
        enum: contracts_1.ActivepiecesConnectionStatus,
        example: contracts_1.ActivepiecesConnectionStatus.ACTIVE
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(contracts_1.ActivepiecesConnectionStatus),
    tslib_1.__metadata("design:type", String)
], ActivepiecesConnectionsListQueryDto.prototype, "status", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Number of results to return',
        type: Number,
        minimum: 1,
        example: 10,
        default: 10,
        maximum: 100
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    (0, class_transformer_1.Type)(() => Number),
    tslib_1.__metadata("design:type", Number)
], ActivepiecesConnectionsListQueryDto.prototype, "limit", void 0);
//# sourceMappingURL=activepieces-connections-list-query.dto.js.map