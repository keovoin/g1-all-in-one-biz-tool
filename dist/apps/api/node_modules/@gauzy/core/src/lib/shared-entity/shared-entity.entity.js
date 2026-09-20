"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SharedEntity = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const core_1 = require("@mikro-orm/core");
const class_validator_1 = require("class-validator");
const config_1 = require("@gauzy/config");
const internal_1 = require("../core/entities/internal");
const entity_1 = require("../core/decorators/entity");
const mikro_orm_shared_entity_repository_1 = require("./repository/mikro-orm-shared-entity.repository");
const export_redact_decorator_1 = require("../export-import/export-redact.decorator");
let SharedEntity = class SharedEntity extends internal_1.BasePerEntityType {
};
exports.SharedEntity = SharedEntity;
tslib_1.__decorate([
    (0, export_redact_decorator_1.ExportRedacted)(),
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, entity_1.ColumnIndex)({ unique: true }),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], SharedEntity.prototype, "token", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Object }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsObject)(),
    (0, entity_1.MultiORMColumn)({
        type: (0, config_1.isPostgres)() ? 'jsonb' : (0, config_1.isMySQL)() ? 'json' : 'text'
    }),
    tslib_1.__metadata("design:type", Object)
], SharedEntity.prototype, "shareRules", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Object }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    (0, entity_1.MultiORMColumn)({
        type: (0, config_1.isPostgres)() ? 'jsonb' : (0, config_1.isMySQL)() ? 'json' : 'text',
        nullable: true
    }),
    tslib_1.__metadata("design:type", Object)
], SharedEntity.prototype, "sharedOptions", void 0);
exports.SharedEntity = SharedEntity = tslib_1.__decorate([
    (0, entity_1.MultiORMEntity)('shared_entity', { mikroOrmRepository: () => mikro_orm_shared_entity_repository_1.MikroOrmSharedEntityRepository })
], SharedEntity);
//# sourceMappingURL=shared-entity.entity.js.map