"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeSheetService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const moment = require("moment");
const contracts_1 = require("@gauzy/contracts");
const context_1 = require("./../../core/context");
const crud_1 = require("./../../core/crud");
const utils_1 = require("./../../core/utils");
const database_helper_1 = require("./../../database/database.helper");
const type_orm_timesheet_repository_1 = require("./repository/type-orm-timesheet.repository");
const mikro_orm_timesheet_repository_1 = require("./repository/mikro-orm-timesheet.repository");
let TimeSheetService = class TimeSheetService extends crud_1.TenantAwareCrudService {
    constructor(typeOrmTimesheetRepository, mikroOrmTimesheetRepository) {
        super(typeOrmTimesheetRepository, mikroOrmTimesheetRepository);
    }
    /**
     * GET timesheets count in date range for the same tenant
     *
     * @param request
     * @returns number - Count of timesheets
     */
    async getTimeSheetCount(request) {
        switch (this.ormType) {
            case utils_1.MultiORMEnum.MikroORM: {
                let { organizationId, startDate, endDate, employeeIds = [], status = [], onlyMe: isOnlyMeSelected } = request;
                const tenantId = context_1.RequestContext.currentTenantId() ?? request.tenantId;
                const user = context_1.RequestContext.currentUser();
                const hasChangeSelectedEmployeePermission = context_1.RequestContext.hasPermission(contracts_1.PermissionsEnum.CHANGE_SELECTED_EMPLOYEE);
                if (user.employeeId && (isOnlyMeSelected || !hasChangeSelectedEmployeePermission)) {
                    employeeIds = [user.employeeId];
                }
                const { start, end } = (0, utils_1.getDateRangeFormat)(moment.utc(startDate || moment().startOf('month')), moment.utc(endDate || moment().endOf('month')));
                const where = {
                    tenantId,
                    organizationId,
                    startedAt: { $gte: start, $lte: end }
                };
                if (employeeIds.length > 0)
                    where.employeeId = { $in: employeeIds };
                if (status.length > 0)
                    where.status = { $in: status.filter((s) => Object.values(contracts_1.TimesheetStatus).includes(s)) };
                return await this.mikroOrmRepository.count(where);
            }
            case utils_1.MultiORMEnum.TypeORM:
            default: {
                const query = this.typeOrmRepository.createQueryBuilder('timesheet');
                query.innerJoin(`${query.alias}.employee`, 'employee');
                // Apply filters to the query
                await this.getFilterTimesheetQuery(query, request);
                // Return the total count of timesheets
                return query.getCount();
            }
        }
    }
    /**
     * GET timesheets in date range for the same tenant
     *
     * @param request
     * @returns Promise<ITimesheet[]> - List of timesheets
     */
    async getTimeSheets(request) {
        // Builds its own query, so the check in the CRUD read methods never runs: assert the
        // sensitive-relation table on the client-supplied relations before anything is loaded.
        this.assertRelationsPermitted(request);
        switch (this.ormType) {
            case utils_1.MultiORMEnum.MikroORM: {
                let { organizationId, startDate, endDate, employeeIds = [], status = [], onlyMe: isOnlyMeSelected } = request;
                const tenantId = context_1.RequestContext.currentTenantId() ?? request.tenantId;
                const user = context_1.RequestContext.currentUser();
                const hasChangeSelectedEmployeePermission = context_1.RequestContext.hasPermission(contracts_1.PermissionsEnum.CHANGE_SELECTED_EMPLOYEE);
                if (user.employeeId && (isOnlyMeSelected || !hasChangeSelectedEmployeePermission)) {
                    employeeIds = [user.employeeId];
                }
                const { start, end } = (0, utils_1.getDateRangeFormat)(moment.utc(startDate || moment().startOf('month')), moment.utc(endDate || moment().endOf('month')));
                const where = {
                    tenantId,
                    organizationId,
                    startedAt: { $gte: start, $lte: end }
                };
                if (employeeIds.length > 0)
                    where.employeeId = { $in: employeeIds };
                if (status.length > 0)
                    where.status = { $in: status.filter((s) => Object.values(contracts_1.TimesheetStatus).includes(s)) };
                const items = await this.mikroOrmRepository.find(where, {
                    populate: (request?.relations || [])
                });
                return items.map((e) => this.serialize(e));
            }
            case utils_1.MultiORMEnum.TypeORM:
            default: {
                const query = this.typeOrmRepository.createQueryBuilder('timesheet');
                query.innerJoin(`${query.alias}.employee`, 'employee');
                // Set select options and optional relations
                query.setFindOptions({
                    select: {
                        employee: {
                            id: true,
                            user: {
                                firstName: true,
                                lastName: true,
                                email: true
                            }
                        },
                        organization: {
                            name: true,
                            brandColor: true
                        }
                    },
                    ...(request.relations ? { relations: (0, utils_1.parseFindOptionsRelations)(request.relations) } : {})
                });
                // Apply filters to the query
                await this.getFilterTimesheetQuery(query, request);
                // Return the list of timesheets
                return await query.getMany();
            }
        }
    }
    /**
     * GET timesheet QueryBuilder
     *
     * @param qb
     * @param request
     * @returns
     */
    async getFilterTimesheetQuery(qb, request) {
        let { organizationId, startDate, endDate, onlyMe: isOnlyMeSelected, employeeIds = [], status = [] } = request;
        const tenantId = context_1.RequestContext.currentTenantId() ?? request.tenantId; // Retrieve the tenant ID from the request
        const user = context_1.RequestContext.currentUser(); // Retrieve the current user
        // Check if the current user has the permission to change the selected employee
        const hasChangeSelectedEmployeePermission = context_1.RequestContext.hasPermission(contracts_1.PermissionsEnum.CHANGE_SELECTED_EMPLOYEE);
        if (user.employeeId && (isOnlyMeSelected || !hasChangeSelectedEmployeePermission)) {
            employeeIds = [user.employeeId];
        }
        // Calculate start and end dates using a utility function
        const { start, end } = (0, utils_1.getDateRangeFormat)(moment.utc(startDate || moment().startOf('month')), // use current start of the month if startDate not found
        moment.utc(endDate || moment().endOf('month')) // use current end of the month if endDate not found
        );
        qb.andWhere(new typeorm_1.Brackets((qb) => {
            qb.where({
                startedAt: (0, typeorm_1.Between)(start, end),
                ...(status.length > 0
                    ? {
                        status: (0, typeorm_1.In)(status.filter((s) => Object.values(contracts_1.TimesheetStatus).includes(s)))
                    }
                    : {}),
                ...(employeeIds.length > 0 ? { employeeId: (0, typeorm_1.In)(employeeIds) } : {})
            });
        }));
        // Additional conditions for filtering by tenantId and organizationId
        qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${qb.alias}"."tenantId" = :tenantId`), { tenantId });
        qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${qb.alias}"."organizationId" = :organizationId`), { organizationId });
        return qb;
    }
};
exports.TimeSheetService = TimeSheetService;
exports.TimeSheetService = TimeSheetService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_timesheet_repository_1.TypeOrmTimesheetRepository,
        mikro_orm_timesheet_repository_1.MikroOrmTimesheetRepository])
], TimeSheetService);
//# sourceMappingURL=timesheet.service.js.map