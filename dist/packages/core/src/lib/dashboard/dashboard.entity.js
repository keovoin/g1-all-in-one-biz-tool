"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dashboard = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const core_1 = require("@mikro-orm/core");
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const config_1 = require("@gauzy/config");
const internal_1 = require("../core/entities/internal");
const entity_1 = require("../core/decorators/entity");
const validators_1 = require("../shared/validators");
const mikro_orm_dashboard_repository_1 = require("./repository/mikro-orm-dashboard.repository");
let Dashboard = class Dashboard extends internal_1.TenantOrganizationBaseEntity {
};
exports.Dashboard = Dashboard;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], Dashboard.prototype, "name", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], Dashboard.prototype, "identifier", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, entity_1.MultiORMColumn)({ type: 'text', nullable: true }),
    tslib_1.__metadata("design:type", String)
], Dashboard.prototype, "description", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Object }),
    (0, class_validator_1.IsOptional)(),
    (0, entity_1.MultiORMColumn)({ type: (0, config_1.isPostgres)() ? 'jsonb' : (0, config_1.isMySQL)() ? 'json' : 'text', nullable: true }),
    tslib_1.__metadata("design:type", Object)
], Dashboard.prototype, "contentHtml", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Boolean }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, entity_1.MultiORMColumn)({ default: false }),
    tslib_1.__metadata("design:type", Boolean)
], Dashboard.prototype, "isDefault", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => internal_1.Employee }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    (0, validators_1.IsEmployeeBelongsToOrganization)(),
    (0, entity_1.MultiORMManyToOne)(() => internal_1.Employee, {
        nullable: true, // Indicates if relation column value can be nullable or not.
        onDelete: 'CASCADE' // Database cascade action on delete.
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Object)
], Dashboard.prototype, "employee", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    (0, validators_1.IsEmployeeBelongsToOrganization)(),
    (0, typeorm_1.RelationId)((dashboard) => dashboard.employee),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true, relationId: true }),
    tslib_1.__metadata("design:type", String)
], Dashboard.prototype, "employeeId", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMOneToMany)(() => internal_1.DashboardWidget, (it) => it.dashboard),
    tslib_1.__metadata("design:type", Array)
], Dashboard.prototype, "widgets", void 0);
exports.Dashboard = Dashboard = tslib_1.__decorate([
    (0, entity_1.MultiORMEntity)('dashboard', { mikroOrmRepository: () => mikro_orm_dashboard_repository_1.MikroOrmDashboardRepository })
], Dashboard);
//# sourceMappingURL=dashboard.entity.js.map