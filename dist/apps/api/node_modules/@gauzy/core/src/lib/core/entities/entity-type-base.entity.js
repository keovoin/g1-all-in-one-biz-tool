"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasePerEntityType = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const contracts_1 = require("@gauzy/contracts");
const internal_1 = require("../entities/internal");
const decorators_1 = require("../decorators");
const column_index_decorator_1 = require("../decorators/entity/column-index.decorator");
class BasePerEntityType extends internal_1.TenantOrganizationBaseEntity {
}
exports.BasePerEntityType = BasePerEntityType;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, enum: contracts_1.BaseEntityEnum }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(contracts_1.BaseEntityEnum),
    (0, column_index_decorator_1.ColumnIndex)(),
    (0, decorators_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], BasePerEntityType.prototype, "entity", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsUUID)(),
    (0, column_index_decorator_1.ColumnIndex)(),
    (0, decorators_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], BasePerEntityType.prototype, "entityId", void 0);
//# sourceMappingURL=entity-type-base.entity.js.map