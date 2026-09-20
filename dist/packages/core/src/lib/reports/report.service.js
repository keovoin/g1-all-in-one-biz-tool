"use strict";
var ReportService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const crud_1 = require("../core/crud");
const utils_1 = require("../core/utils");
const context_1 = require("./../core/context");
const mikro_orm_report_repository_1 = require("./repository/mikro-orm-report.repository");
const type_orm_report_repository_1 = require("./repository/type-orm-report.repository");
let ReportService = ReportService_1 = class ReportService extends crud_1.CrudService {
    constructor(typeOrmReportRepository, mikroOrmReportRepository) {
        super(typeOrmReportRepository, mikroOrmReportRepository);
        this.typeOrmReportRepository = typeOrmReportRepository;
        this.mikroOrmReportRepository = mikroOrmReportRepository;
        this.logger = new common_1.Logger(ReportService_1.name);
    }
    /**
     * Retrieves all reports for the specified organization and tenant, including whether they should be shown in the menu.
     *
     * @param filter The filter containing organization ID and tenant ID for retrieving reports.
     * @returns A promise that resolves to an object containing paginated report items and total count.
     */
    async findAllReports(filter) {
        // Builds its own query, so the check in the CRUD read methods never runs: assert the
        // sensitive-relation table on the client-supplied relations before anything is loaded.
        this.assertRelationsPermitted(filter);
        console.time(`ReportService.findAll took seconds`);
        // Extract organizationId and tenantId from filter
        const { organizationId } = filter;
        const tenantId = context_1.RequestContext.currentTenantId() || filter.tenantId;
        switch (this.ormType) {
            case utils_1.MultiORMEnum.MikroORM: {
                const [items, total] = await this.mikroOrmRepository.findAndCount({}, {
                    populate: [...(filter.relations ? filter.relations : []), 'reportOrganizations']
                });
                const reports = items.map((item) => {
                    const s = this.serialize(item);
                    const orgs = (s.reportOrganizations || []).filter((ro) => ro.organizationId === organizationId &&
                        ro.tenantId === tenantId &&
                        ro.isEnabled &&
                        ro.isActive &&
                        !ro.isArchived);
                    s.showInMenu = !!orgs.length;
                    delete s.reportOrganizations;
                    return s;
                });
                console.timeEnd(`ReportService.findAll took seconds`);
                return { items: reports, total };
            }
            case utils_1.MultiORMEnum.TypeORM:
            default: {
                // Fetch all reports and their associated organizations in a single query
                const qb = this.typeOrmRepository.createQueryBuilder('report');
                qb.setFindOptions({
                    ...(filter.relations ? { relations: (0, utils_1.parseFindOptionsRelations)(filter.relations) } : {})
                });
                qb.leftJoinAndSelect('report.reportOrganizations', 'ro', 'ro.organizationId = :organizationId AND ro.tenantId = :tenantId AND ro.isEnabled = :isEnabled AND ro.isActive = :isActive AND ro.isArchived = :isArchived', {
                    organizationId,
                    tenantId,
                    isEnabled: true,
                    isActive: true,
                    isArchived: false
                });
                // Execute the query
                const [items, total] = await qb.getManyAndCount();
                // Map over items and set 'showInMenu' property based on menu item existence
                const reports = items.map((item) => {
                    item.showInMenu = !!item.reportOrganizations.length;
                    delete item.reportOrganizations;
                    return item;
                });
                console.timeEnd(`ReportService.findAll took seconds`);
                return { items: reports, total: total };
            }
        }
    }
    /**
     * Retrieves report menu items based on the provided options.
     *
     * @param input The input containing the organization ID and tenant ID for filtering report menu items.
     * @returns A promise that resolves to an array of report menu items.
     */
    async getMenuItems(input) {
        const { organizationId } = input;
        const tenantId = context_1.RequestContext.currentTenantId() || input.tenantId;
        switch (this.ormType) {
            case utils_1.MultiORMEnum.MikroORM: {
                const items = await this.mikroOrmRepository.find({
                    reportOrganizations: {
                        organizationId,
                        tenantId,
                        isEnabled: true,
                        isActive: true,
                        isArchived: false
                    }
                });
                return items.map((e) => this.serialize(e));
            }
            case utils_1.MultiORMEnum.TypeORM:
            default: {
                const qb = this.typeOrmRepository.createQueryBuilder('report');
                qb.innerJoin('report.reportOrganizations', 'ro', 'ro.isEnabled = :isEnabled AND ro.isActive = :isActive AND ro.isArchived = :isArchived', {
                    isEnabled: true,
                    isActive: true,
                    isArchived: false
                });
                qb.andWhere('ro.organizationId = :organizationId', { organizationId });
                qb.andWhere('ro.tenantId = :tenantId', { tenantId });
                return await qb.getMany();
            }
        }
    }
};
exports.ReportService = ReportService;
exports.ReportService = ReportService = ReportService_1 = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_report_repository_1.TypeOrmReportRepository,
        mikro_orm_report_repository_1.MikroOrmReportRepository])
], ReportService);
//# sourceMappingURL=report.service.js.map