"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportOrganizationService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const context_1 = require("../core/context");
const crud_1 = require("../core/crud");
const utils_1 = require("../core/utils");
const report_organization_entity_1 = require("./report-organization.entity");
const mikro_orm_report_organization_repository_1 = require("./repository/mikro-orm-report-organization.repository");
const mikro_orm_report_repository_1 = require("./repository/mikro-orm-report.repository");
const type_orm_report_organization_repository_1 = require("./repository/type-orm-report-organization.repository");
const type_orm_report_repository_1 = require("./repository/type-orm-report.repository");
let ReportOrganizationService = class ReportOrganizationService extends crud_1.TenantAwareCrudService {
    constructor(typeOrmReportRepository, mikroOrmReportRepository, typeOrmReportOrganizationRepository, mikroOrmReportOrganizationRepository) {
        super(typeOrmReportOrganizationRepository, mikroOrmReportOrganizationRepository);
        this.typeOrmReportRepository = typeOrmReportRepository;
        this.mikroOrmReportRepository = mikroOrmReportRepository;
        this.typeOrmReportOrganizationRepository = typeOrmReportOrganizationRepository;
        this.mikroOrmReportOrganizationRepository = mikroOrmReportOrganizationRepository;
    }
    /**
     * Updates an existing report menu entry if it exists, otherwise creates a new one.
     * @param input The input containing data for updating or creating the report menu entry.
     * @returns The updated or newly created report menu entry.
     */
    async updateReportMenu(input) {
        const { reportId, organizationId } = input;
        // The body is not DTO-validated: both keys must be present, or the lookup below (an empty
        // key used to be dropped from the where) would pick an arbitrary row of the tenant to mutate.
        // Checked outside the try: its catch deliberately falls back to "create".
        if (!reportId || !organizationId) {
            throw new common_1.BadRequestException('reportId and organizationId are required');
        }
        try {
            const tenantId = context_1.RequestContext.currentTenantId() || input.tenantId;
            let reportOrganization = await this.findOneByWhereOptions({
                reportId,
                organizationId,
                tenantId
            });
            // If the report organization exists, update it with the input data
            reportOrganization = new report_organization_entity_1.ReportOrganization(Object.assign(reportOrganization, input));
            return await super.save(reportOrganization);
        }
        catch (error) {
            // If the report organization doesn't exist, create a new one with the input data
            return await super.create(new report_organization_entity_1.ReportOrganization(input));
        }
    }
    /**
     * Bulk create organization default reports menu.
     *
     * @param input - The organization input data.
     * @returns A promise that resolves to an array of created ReportOrganization instances.
     */
    async bulkCreateOrganizationReport(input) {
        try {
            const { id: organizationId, tenantId } = input;
            // Fetch reports from the database
            let reports;
            switch (this.ormType) {
                case utils_1.MultiORMEnum.MikroORM:
                    reports = await this.mikroOrmReportRepository.findAll();
                    break;
                case utils_1.MultiORMEnum.TypeORM:
                default:
                    reports = await this.typeOrmReportRepository.find();
                    break;
            }
            // Create ReportOrganization instances based on fetched reports
            const reportOrganizations = reports.map((report) => new report_organization_entity_1.ReportOrganization({
                report: { id: report.id },
                isEnabled: true,
                organizationId,
                tenantId
            }));
            // Save the created ReportOrganization instances to the database
            switch (this.ormType) {
                case utils_1.MultiORMEnum.MikroORM: {
                    const em = this.mikroOrmReportOrganizationRepository.getEntityManager();
                    reportOrganizations.forEach((ro) => em.persist(ro));
                    await em.flush();
                    return reportOrganizations;
                }
                case utils_1.MultiORMEnum.TypeORM:
                default:
                    return await this.typeOrmReportOrganizationRepository.save(reportOrganizations);
            }
        }
        catch (error) {
            console.log(`Error occurred while attempting bulk creation of organization reports: ${error?.message}`);
            // Throw InternalServerErrorException if an error occurs
            throw new common_1.BadRequestException(error);
        }
    }
};
exports.ReportOrganizationService = ReportOrganizationService;
exports.ReportOrganizationService = ReportOrganizationService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_report_repository_1.TypeOrmReportRepository,
        mikro_orm_report_repository_1.MikroOrmReportRepository,
        type_orm_report_organization_repository_1.TypeOrmReportOrganizationRepository,
        mikro_orm_report_organization_repository_1.MikroOrmReportOrganizationRepository])
], ReportOrganizationService);
//# sourceMappingURL=report-organization.service.js.map