"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImportHistory = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const contracts_1 = require("@gauzy/contracts");
const internal_1 = require("../../core/entities/internal");
const entity_1 = require("../../core/decorators/entity");
const mikro_orm_import_history_repository_1 = require("./repository/mikro-orm-import-history.repository");
let ImportHistory = class ImportHistory extends internal_1.TenantBaseEntity {
};
exports.ImportHistory = ImportHistory;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], ImportHistory.prototype, "file", void 0);
tslib_1.__decorate([
    (0, class_transformer_1.Exclude)({ toPlainOnly: true }),
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], ImportHistory.prototype, "path", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Number }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Number)
], ImportHistory.prototype, "size", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, enum: contracts_1.ImportStatusEnum }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(contracts_1.ImportStatusEnum),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], ImportHistory.prototype, "status", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Date }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    (0, entity_1.MultiORMColumn)({ default: () => 'CURRENT_TIMESTAMP' }),
    tslib_1.__metadata("design:type", Date)
], ImportHistory.prototype, "importDate", void 0);
tslib_1.__decorate([
    (0, entity_1.VirtualMultiOrmColumn)(),
    tslib_1.__metadata("design:type", String)
], ImportHistory.prototype, "fullUrl", void 0);
exports.ImportHistory = ImportHistory = tslib_1.__decorate([
    (0, entity_1.MultiORMEntity)('import-history', { mikroOrmRepository: () => mikro_orm_import_history_repository_1.MikroOrmImportHistoryRepository })
], ImportHistory);
//# sourceMappingURL=import-history.entity.js.map