"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivepiecesMcpUpdateDto = exports.ActivepiecesMcpToolDto = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class ActivepiecesMcpToolDto {
}
exports.ActivepiecesMcpToolDto = ActivepiecesMcpToolDto;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Tool ID',
        type: String,
        required: false
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => (typeof value === 'string' ? value.trim() : value)),
    tslib_1.__metadata("design:type", String)
], ActivepiecesMcpToolDto.prototype, "id", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Tool type',
        type: String,
        required: false
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => (typeof value === 'string' ? value.trim() : value)),
    tslib_1.__metadata("design:type", String)
], ActivepiecesMcpToolDto.prototype, "type", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Tool metadata',
        type: Object,
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    tslib_1.__metadata("design:type", Object)
], ActivepiecesMcpToolDto.prototype, "pieceMetadata", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Flow ID associated with tool',
        type: String,
        required: false
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => (typeof value === 'string' ? value.trim() : value)),
    tslib_1.__metadata("design:type", String)
], ActivepiecesMcpToolDto.prototype, "flowId", void 0);
class ActivepiecesMcpUpdateDto {
}
exports.ActivepiecesMcpUpdateDto = ActivepiecesMcpUpdateDto;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'MCP server name',
        type: String,
        required: false
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Transform)(({ value }) => (typeof value === 'string' ? value.trim() : value)),
    tslib_1.__metadata("design:type", String)
], ActivepiecesMcpUpdateDto.prototype, "name", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Array of tools for the MCP server',
        type: [ActivepiecesMcpToolDto],
        required: false
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayNotEmpty)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => ActivepiecesMcpToolDto),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", Array)
], ActivepiecesMcpUpdateDto.prototype, "tools", void 0);
//# sourceMappingURL=activepieces-mcp-update.dto.js.map