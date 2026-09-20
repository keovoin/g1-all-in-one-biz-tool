"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResourceLink = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const core_1 = require("@mikro-orm/core");
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const config_1 = require("@gauzy/config");
const internal_1 = require("../core/entities/internal");
const entity_1 = require("../core/decorators/entity");
const mikro_orm_resource_link_repository_1 = require("./repository/mikro-orm-resource-link.repository");
let ResourceLink = class ResourceLink extends internal_1.BasePerEntityType {
};
exports.ResourceLink = ResourceLink;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], ResourceLink.prototype, "title", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsUrl)(),
    (0, entity_1.MultiORMColumn)({ type: 'text' }),
    tslib_1.__metadata("design:type", String)
], ResourceLink.prototype, "url", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => ((0, config_1.isSqlite)() || (0, config_1.isBetterSqlite3)() ? String : Object) }),
    (0, class_validator_1.IsOptional)(),
    (0, entity_1.MultiORMColumn)({ nullable: true, type: (0, config_1.isSqlite)() || (0, config_1.isBetterSqlite3)() ? 'text' : 'json' }),
    tslib_1.__metadata("design:type", Object)
], ResourceLink.prototype, "metaData", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMManyToOne)(() => internal_1.Employee, {
        /** Indicates if relation column value can be nullable or not. */
        nullable: true,
        /** Database cascade action on delete. */
        onDelete: 'CASCADE'
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Object)
], ResourceLink.prototype, "employee", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    (0, typeorm_1.RelationId)((it) => it.employee),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true, relationId: true }),
    tslib_1.__metadata("design:type", String)
], ResourceLink.prototype, "employeeId", void 0);
exports.ResourceLink = ResourceLink = tslib_1.__decorate([
    (0, entity_1.MultiORMEntity)('resource_link', { mikroOrmRepository: () => mikro_orm_resource_link_repository_1.MikroOrmResourceLinkRepository })
], ResourceLink);
//# sourceMappingURL=resource-link.entity.js.map