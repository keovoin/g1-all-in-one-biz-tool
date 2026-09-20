"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImportRecord = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const entity_1 = require("./../../core/decorators/entity");
const internal_1 = require("../../core/entities/internal");
const mikro_orm_import_record_repository_1 = require("./repository/mikro-orm-import-record.repository");
let ImportRecord = class ImportRecord extends internal_1.TenantBaseEntity {
};
exports.ImportRecord = ImportRecord;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, entity_1.MultiORMColumn)({ nullable: false }),
    tslib_1.__metadata("design:type", String)
], ImportRecord.prototype, "entityType", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, entity_1.MultiORMColumn)({ nullable: false, type: 'uuid' }),
    tslib_1.__metadata("design:type", String)
], ImportRecord.prototype, "sourceId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, entity_1.MultiORMColumn)({ nullable: false, type: 'uuid' }),
    tslib_1.__metadata("design:type", String)
], ImportRecord.prototype, "destinationId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Date }),
    (0, class_validator_1.IsDate)(),
    (0, entity_1.MultiORMColumn)({ nullable: false, default: () => 'CURRENT_TIMESTAMP' }),
    tslib_1.__metadata("design:type", Date)
], ImportRecord.prototype, "importDate", void 0);
tslib_1.__decorate([
    (0, entity_1.VirtualMultiOrmColumn)(),
    tslib_1.__metadata("design:type", Boolean)
], ImportRecord.prototype, "wasCreated", void 0);
exports.ImportRecord = ImportRecord = tslib_1.__decorate([
    (0, entity_1.MultiORMEntity)('import-record', { mikroOrmRepository: () => mikro_orm_import_record_repository_1.MikroOrmImportRecordRepository })
], ImportRecord);
//# sourceMappingURL=import-record.entity.js.map