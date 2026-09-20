"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportOrganization = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const internal_1 = require("../core/entities/internal");
const entity_1 = require("./../core/decorators/entity");
const mikro_orm_report_organization_repository_1 = require("./repository/mikro-orm-report-organization.repository");
let ReportOrganization = class ReportOrganization extends internal_1.TenantOrganizationBaseEntity {
};
exports.ReportOrganization = ReportOrganization;
tslib_1.__decorate([
    (0, entity_1.MultiORMColumn)({ default: true }),
    tslib_1.__metadata("design:type", Boolean)
], ReportOrganization.prototype, "isEnabled", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMManyToOne)(() => internal_1.Report, (it) => it.reportOrganizations, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Object)
], ReportOrganization.prototype, "report", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, typeorm_1.RelationId)((it) => it.report),
    (0, entity_1.MultiORMColumn)({ relationId: true }),
    tslib_1.__metadata("design:type", Object)
], ReportOrganization.prototype, "reportId", void 0);
exports.ReportOrganization = ReportOrganization = tslib_1.__decorate([
    (0, entity_1.MultiORMEntity)('report_organization', { mikroOrmRepository: () => mikro_orm_report_organization_repository_1.MikroOrmReportOrganizationRepository })
], ReportOrganization);
//# sourceMappingURL=report-organization.entity.js.map