"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpenseService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const moment = require("moment");
const underscore_1 = require("underscore");
const contracts_1 = require("@gauzy/contracts");
const utils_1 = require("@gauzy/utils");
const crud_1 = require("./../core/crud");
const context_1 = require("../core/context");
const utils_2 = require("./../core/utils");
const database_helper_1 = require("./../database/database.helper");
const type_orm_expense_repository_1 = require("./repository/type-orm-expense.repository");
const mikro_orm_expense_repository_1 = require("./repository/mikro-orm-expense.repository");
let ExpenseService = class ExpenseService extends crud_1.TenantAwareCrudService {
    constructor(typeOrmExpenseRepository, mikroOrmExpenseRepository) {
        super(typeOrmExpenseRepository, mikroOrmExpenseRepository);
    }
    /**
     *
     * @param filter
     * @param filterDate
     * @returns
     */
    async findAllExpenses(filter, filterDate) {
        if (filterDate) {
            const startOfMonth = moment(moment(filterDate).startOf('month').format('YYYY-MM-DD hh:mm:ss')).toDate();
            const endOfMonth = moment(moment(filterDate).endOf('month').format('YYYY-MM-DD hh:mm:ss')).toDate();
            return filter
                ? await this.findAll({
                    where: {
                        valueDate: (0, typeorm_1.Between)(startOfMonth, endOfMonth),
                        ...filter.where
                    },
                    relations: filter.relations
                })
                : await this.findAll({
                    where: {
                        valueDate: (0, typeorm_1.Between)(startOfMonth, endOfMonth)
                    }
                });
        }
        return await this.findAll(filter || {});
    }
    /**
     *
     * @param data
     * @returns
     */
    countStatistic(data) {
        return data.filter(Number).reduce((a, b) => a + b, 0) !== 0
            ? data.filter(Number).reduce((a, b) => a + b, 0) / data.filter(Number).length
            : 0;
    }
    /**
     *
     * @param request
     * @returns
     */
    async getExpense(request) {
        switch (this.ormType) {
            case utils_2.MultiORMEnum.MikroORM: {
                const { organizationId, startDate, endDate, categoryId, projectIds = [] } = request;
                let { employeeIds = [] } = request;
                const tenantId = context_1.RequestContext.currentTenantId() || request.tenantId;
                const user = context_1.RequestContext.currentUser();
                const { start, end } = (0, utils_2.getDateRangeFormat)(moment.utc(startDate || moment().startOf('week')), moment.utc(endDate || moment().endOf('week')));
                const hasChangeSelectedEmployeePermission = context_1.RequestContext.hasPermission(contracts_1.PermissionsEnum.CHANGE_SELECTED_EMPLOYEE);
                const isOnlyMeSelected = request.onlyMe;
                if ((user.employeeId && isOnlyMeSelected) ||
                    (!hasChangeSelectedEmployeePermission && user.employeeId)) {
                    employeeIds = [user.employeeId];
                }
                const where = {
                    tenantId,
                    organizationId,
                    valueDate: { $gte: start, $lte: end }
                };
                if ((0, utils_1.isNotEmpty)(employeeIds))
                    where.employeeId = { $in: employeeIds };
                if ((0, utils_1.isNotEmpty)(projectIds))
                    where.projectId = { $in: projectIds };
                if (categoryId)
                    where.categoryId = categoryId;
                const populate = ['category', 'project'];
                if (hasChangeSelectedEmployeePermission) {
                    populate.push('employee', 'employee.user');
                }
                const items = await this.mikroOrmRepository.find(where, {
                    populate,
                    orderBy: { valueDate: 'ASC' },
                    ...(request.limit > 0 ? { limit: request.limit, offset: (request.page || 0) * request.limit } : {})
                });
                return items.map((e) => this.serialize(e));
            }
            case utils_2.MultiORMEnum.TypeORM:
            default: {
                const query = this.filterQuery(request);
                query.orderBy((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."valueDate"`), 'ASC');
                if (context_1.RequestContext.hasPermission(contracts_1.PermissionsEnum.CHANGE_SELECTED_EMPLOYEE)) {
                    query.leftJoinAndSelect(`${query.alias}.employee`, 'activityEmployee');
                    query.leftJoinAndSelect(`activityEmployee.user`, 'activityUser', (0, database_helper_1.prepareSQLQuery)('"employee"."userId" = activityUser.id'));
                }
                query.leftJoinAndSelect(`${query.alias}.category`, 'category');
                query.leftJoinAndSelect(`${query.alias}.project`, 'project');
                return await query.getMany();
            }
        }
    }
    /**
     *
     * @param request
     * @returns
     */
    async getDailyReportChartData(request) {
        const { startDate, endDate, organizationId, categoryId, projectIds = [] } = request;
        let { employeeIds = [] } = request;
        const tenantId = context_1.RequestContext.currentTenantId() || request.tenantId;
        const user = context_1.RequestContext.currentUser();
        const days = (0, utils_2.getDaysBetweenDates)(startDate, endDate);
        const { start, end } = (0, utils_2.getDateRangeFormat)(moment.utc(startDate || moment().startOf('week')), moment.utc(endDate || moment().endOf('week')));
        const hasChangeSelectedEmployeePermission = context_1.RequestContext.hasPermission(contracts_1.PermissionsEnum.CHANGE_SELECTED_EMPLOYEE);
        const isOnlyMeSelected = request.onlyMe;
        if ((user.employeeId && isOnlyMeSelected) || (!hasChangeSelectedEmployeePermission && user.employeeId)) {
            employeeIds = [user.employeeId];
        }
        let expenses;
        switch (this.ormType) {
            case utils_2.MultiORMEnum.MikroORM: {
                const where = {
                    tenantId,
                    organizationId,
                    valueDate: { $gte: start, $lte: end }
                };
                if ((0, utils_1.isNotEmpty)(employeeIds))
                    where.employeeId = { $in: employeeIds };
                if ((0, utils_1.isNotEmpty)(projectIds))
                    where.projectId = { $in: projectIds };
                if (categoryId)
                    where.categoryId = categoryId;
                const items = await this.mikroOrmRepository.find(where, {
                    orderBy: { valueDate: 'ASC' }
                });
                expenses = items.map((e) => this.serialize(e));
                break;
            }
            case utils_2.MultiORMEnum.TypeORM:
            default: {
                const query = this.filterQuery(request);
                query.orderBy((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."valueDate"`), 'ASC');
                expenses = await query.getMany();
                break;
            }
        }
        const byDate = (0, underscore_1.chain)(expenses)
            .groupBy((expense) => moment(expense.valueDate).format('YYYY-MM-DD'))
            .mapObject((expenses, date) => {
            const sum = expenses.reduce((iteratee, expense) => {
                return iteratee + parseFloat(expense.amount);
            }, 0);
            return {
                date,
                value: {
                    expense: sum.toFixed(1)
                }
            };
        })
            .value();
        const dates = days.map((date) => {
            if (byDate[date]) {
                return byDate[date];
            }
            else {
                return {
                    date: date,
                    value: {
                        expense: 0
                    }
                };
            }
        });
        return dates;
    }
    /**
     *
     * @param request
     * @returns
     */
    filterQuery(request) {
        const { organizationId, startDate, endDate, categoryId, projectIds = [] } = request;
        let { employeeIds = [] } = request;
        const tenantId = context_1.RequestContext.currentTenantId() || request.tenantId;
        const user = context_1.RequestContext.currentUser();
        // Calculate start and end dates using a utility function
        const { start, end } = (0, utils_2.getDateRangeFormat)(moment.utc(startDate || moment().startOf('week')), moment.utc(endDate || moment().endOf('week')));
        // Check if the current user has the permission to change the selected employee
        const hasChangeSelectedEmployeePermission = context_1.RequestContext.hasPermission(contracts_1.PermissionsEnum.CHANGE_SELECTED_EMPLOYEE);
        // Determine if the request specifies to retrieve data for the current user only
        const isOnlyMeSelected = request.onlyMe;
        // Set employeeIds based on permissions and request
        if ((user.employeeId && isOnlyMeSelected) || (!hasChangeSelectedEmployeePermission && user.employeeId)) {
            employeeIds = [user.employeeId];
        }
        const query = this.typeOrmRepository.createQueryBuilder();
        if (request.limit > 0) {
            query.take(request.limit);
            query.skip((request.page || 0) * request.limit);
        }
        query.leftJoin(`${query.alias}.employee`, 'employee');
        query.andWhere(new typeorm_1.Brackets((qb) => {
            qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."tenantId" = :tenantId`), { tenantId });
            qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."organizationId" = :organizationId`), { organizationId });
        }));
        query.andWhere(new typeorm_1.Brackets((qb) => {
            qb.where({
                valueDate: (0, typeorm_1.Between)(start, end)
            });
        }));
        query.andWhere(new typeorm_1.Brackets((qb) => {
            if ((0, utils_1.isNotEmpty)(employeeIds)) {
                qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."employeeId" IN (:...employeeIds)`), {
                    employeeIds
                });
            }
            if ((0, utils_1.isNotEmpty)(projectIds)) {
                qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."projectId" IN (:...projectIds)`), {
                    projectIds
                });
            }
            if (categoryId) {
                qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."categoryId" = :categoryId`), {
                    categoryId
                });
            }
        }));
        return query;
    }
    /**
     *
     * @param filter
     * @returns
     */
    pagination(filter) {
        if ('where' in filter) {
            const { where } = filter;
            if ('notes' in where) {
                filter['where']['notes'] = (0, typeorm_1.ILike)(`%${where.notes}%`);
            }
            if ('purpose' in where) {
                filter['where']['purpose'] = (0, typeorm_1.ILike)(`%${where.purpose}%`);
            }
            if ('valueDate' in where) {
                const { valueDate } = where;
                const { startDate, endDate } = valueDate;
                if (startDate && endDate) {
                    filter['where']['valueDate'] = (0, typeorm_1.Between)(moment.utc(startDate).format('YYYY-MM-DD HH:mm:ss'), moment.utc(endDate).format('YYYY-MM-DD HH:mm:ss'));
                }
                else {
                    filter['where']['valueDate'] = (0, typeorm_1.Between)(moment().startOf('month').utc().format('YYYY-MM-DD HH:mm:ss'), moment().endOf('month').utc().format('YYYY-MM-DD HH:mm:ss'));
                }
            }
            if ('tags' in where) {
                filter['where']['tags'] = {
                    id: (0, typeorm_1.In)(where.tags)
                };
            }
        }
        return super.paginate(filter);
    }
};
exports.ExpenseService = ExpenseService;
exports.ExpenseService = ExpenseService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_expense_repository_1.TypeOrmExpenseRepository,
        mikro_orm_expense_repository_1.MikroOrmExpenseRepository])
], ExpenseService);
//# sourceMappingURL=expense.service.js.map