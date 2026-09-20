"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const nestjs_1 = require("@mikro-orm/nestjs");
const report_category_entity_1 = require("./report-category.entity");
const report_entity_1 = require("./report.entity");
const report_controller_1 = require("./report.controller");
const report_service_1 = require("./report.service");
const report_category_controller_1 = require("./report-category.controller");
const report_category_service_1 = require("./report-category.service");
const report_organization_entity_1 = require("./report-organization.entity");
const handlers_1 = require("./commands/handlers");
const report_organization_service_1 = require("./report-organization.service");
const type_orm_report_organization_repository_1 = require("./repository/type-orm-report-organization.repository");
const mikro_orm_report_organization_repository_1 = require("./repository/mikro-orm-report-organization.repository");
const type_orm_report_repository_1 = require("./repository/type-orm-report.repository");
const mikro_orm_report_repository_1 = require("./repository/mikro-orm-report.repository");
const type_orm_report_category_repository_1 = require("./repository/type-orm-report-category.repository");
const mikro_orm_report_category_repository_1 = require("./repository/mikro-orm-report-category.repository");
let ReportModule = class ReportModule {
};
exports.ReportModule = ReportModule;
exports.ReportModule = ReportModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([report_entity_1.Report, report_category_entity_1.ReportCategory, report_organization_entity_1.ReportOrganization]),
            nestjs_1.MikroOrmModule.forFeature([report_entity_1.Report, report_category_entity_1.ReportCategory, report_organization_entity_1.ReportOrganization])
        ],
        controllers: [report_category_controller_1.ReportCategoryController, report_controller_1.ReportController],
        providers: [
            report_service_1.ReportService,
            report_category_service_1.ReportCategoryService,
            report_organization_service_1.ReportOrganizationService,
            type_orm_report_repository_1.TypeOrmReportRepository, mikro_orm_report_repository_1.MikroOrmReportRepository,
            type_orm_report_category_repository_1.TypeOrmReportCategoryRepository, mikro_orm_report_category_repository_1.MikroOrmReportCategoryRepository,
            type_orm_report_organization_repository_1.TypeOrmReportOrganizationRepository, mikro_orm_report_organization_repository_1.MikroOrmReportOrganizationRepository,
            ...handlers_1.CommandHandlers
        ]
    })
], ReportModule);
//# sourceMappingURL=report.module.js.map