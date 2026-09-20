"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListMcpServersDto = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class ListMcpServersDto {
}
exports.ListMcpServersDto = ListMcpServersDto;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ActivePieces project ID',
        type: String,
        example: 'project-123'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Transform)(({ value }) => (typeof value === 'string' ? value.trim() : value)),
    tslib_1.__metadata("design:type", String)
], ListMcpServersDto.prototype, "projectId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Number of results to return',
        type: Number,
        minimum: 1,
        example: 10
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_transformer_1.Transform)(({ value }) => parseInt(value, 10)),
    tslib_1.__metadata("design:type", Number)
], ListMcpServersDto.prototype, "limit", void 0);
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
], ListMcpServersDto.prototype, "cursor", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by MCP server name',
        type: String,
        example: 'my-mcp-server'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Transform)(({ value }) => (typeof value === 'string' ? value.trim() : value)),
    tslib_1.__metadata("design:type", String)
], ListMcpServersDto.prototype, "name", void 0);
//# sourceMappingURL=list-mcp-servers.dto.js.map