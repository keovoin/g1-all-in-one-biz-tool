"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantBaseEntity = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const internal_1 = require("../entities/internal");
const relations_1 = require("../decorators/entity/relations");
const decorators_1 = require("../decorators");
const column_index_decorator_1 = require("../decorators/entity/column-index.decorator");
class TenantBaseEntity extends internal_1.BaseEntity {
}
exports.TenantBaseEntity = TenantBaseEntity;
tslib_1.__decorate([
    (0, relations_1.MultiORMManyToOne)(() => internal_1.Tenant, {
        /** Indicates if relation column value can be nullable or not. */
        nullable: true,
        /** Database cascade action on delete. */
        onDelete: 'CASCADE'
    }),
    tslib_1.__metadata("design:type", Object)
], TenantBaseEntity.prototype, "tenant", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    (0, typeorm_1.RelationId)((t) => t.tenant),
    (0, column_index_decorator_1.ColumnIndex)(),
    (0, decorators_1.MultiORMColumn)({ nullable: true, relationId: true }),
    tslib_1.__metadata("design:type", String)
], TenantBaseEntity.prototype, "tenantId", void 0);
//# sourceMappingURL=tenant-base.entity.js.map