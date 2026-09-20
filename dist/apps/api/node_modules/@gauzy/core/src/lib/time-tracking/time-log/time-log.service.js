"use strict";
var TimeLogService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeLogService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const typeorm_1 = require("typeorm");
const underscore_1 = require("underscore");
const contracts_1 = require("@gauzy/contracts");
const utils_1 = require("@gauzy/utils");
const crud_1 = require("./../../core/crud");
const commands_1 = require("./commands");
const utils_2 = require("./../../core/utils");
const context_1 = require("../../core/context");
const moment_extend_1 = require("./../../core/moment-extend");
const time_log_utils_1 = require("./time-log.utils");
const database_helper_1 = require("./../../database/database.helper");
const type_orm_time_log_repository_1 = require("./repository/type-orm-time-log.repository");
const mikro_orm_time_log_repository_1 = require("./repository/mikro-orm-time-log.repository");
const type_orm_employee_repository_1 = require("../../employee/repository/type-orm-employee.repository");
const type_orm_organization_project_repository_1 = require("../../organization-project/repository/type-orm-organization-project.repository");
const type_orm_organization_contact_repository_1 = require("../../organization-contact/repository/type-orm-organization-contact.repository");
const managed_employee_service_1 = require("../../employee/managed-employee.service");
let TimeLogService = TimeLogService_1 = class TimeLogService extends crud_1.TenantAwareCrudService {
    constructor(typeOrmTimeLogRepository, mikroOrmTimeLogRepository, typeOrmEmployeeRepository, typeOrmOrganizationProjectRepository, typeOrmOrganizationContactRepository, commandBus, _managedEmployeeService) {
        super(typeOrmTimeLogRepository, mikroOrmTimeLogRepository);
        this.typeOrmTimeLogRepository = typeOrmTimeLogRepository;
        this.mikroOrmTimeLogRepository = mikroOrmTimeLogRepository;
        this.typeOrmEmployeeRepository = typeOrmEmployeeRepository;
        this.typeOrmOrganizationProjectRepository = typeOrmOrganizationProjectRepository;
        this.typeOrmOrganizationContactRepository = typeOrmOrganizationContactRepository;
        this.commandBus = commandBus;
        this._managedEmployeeService = _managedEmployeeService;
    }
    /**
     * Retrieves time logs based on the provided input.
     * @param request The input parameters for fetching time logs.
     * @returns A Promise that resolves to an array of time logs.
     */
    async getTimeLogs(request) {
        // Builds its own query, so the check in the CRUD read methods never runs: assert the
        // sensitive-relation table on the client-supplied relations before anything is loaded.
        this.assertRelationsPermitted(request);
        switch (this.ormType) {
            case utils_2.MultiORMEnum.MikroORM: {
                const where = await this.buildMikroOrmTimeLogWhere(request);
                const items = await this.mikroOrmRepository.find(where, {
                    populate: [
                        'employee',
                        'employee.user',
                        'timeSlots',
                        'project',
                        'task',
                        'organizationContact',
                        ...(request.relations || [])
                    ],
                    orderBy: { startedAt: 'ASC' }
                });
                return items.map((e) => this.serialize(e));
            }
            case utils_2.MultiORMEnum.TypeORM:
            default: {
                // Create a query builder for the TimeLog entity
                const query = this.typeOrmRepository.createQueryBuilder(this.tableName);
                // Inner join with related entities (employee, timeSlots)
                query.innerJoin(`${query.alias}.employee`, 'employee');
                query.innerJoin(`${query.alias}.timeSlots`, 'timeSlots');
                // Set up the find options for the query
                query.setFindOptions({
                    select: {
                        project: {
                            id: true,
                            name: true,
                            imageUrl: true,
                            membersCount: true
                        },
                        task: TimeLogService_1.TASK_SELECT_FIELDS,
                        organizationContact: {
                            id: true,
                            name: true,
                            imageUrl: true
                        },
                        employee: {
                            id: true,
                            isAway: true,
                            isOnline: true,
                            user: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                imageUrl: true
                            }
                        }
                    },
                    relations: (0, utils_2.parseFindOptionsRelations)([...(request.relations ? request.relations : [])]),
                    order: {
                        // Order results by the 'startedAt' field in ascending order
                        startedAt: 'ASC'
                    }
                });
                // Apply filters to the query
                await this.getFilterTimeLogQuery(query, request);
                const timeLogs = await query.getMany();
                // Set up the where clause using the provided filter function
                return timeLogs;
            }
        }
    }
    /**
     * Fetches time logs for a weekly report based on the provided input.
     * @param request The input parameters for fetching time logs.
     * @returns A Promise that resolves to an array of weekly report data.
     */
    async getWeeklyReport(request) {
        let logs;
        switch (this.ormType) {
            case utils_2.MultiORMEnum.MikroORM: {
                const where = await this.buildMikroOrmTimeLogWhere(request);
                const items = await this.mikroOrmRepository.find(where, {
                    populate: ['employee', 'employee.user', 'timeSlots'],
                    orderBy: { startedAt: 'ASC' }
                });
                logs = items.map((e) => this.serialize(e));
                break;
            }
            case utils_2.MultiORMEnum.TypeORM:
            default: {
                // Create a query builder for the TimeLog entity
                const query = this.typeOrmRepository.createQueryBuilder('time_log');
                // Inner join with related entities (employee, timeSlots)
                query.innerJoin(`${query.alias}.employee`, 'employee');
                query.innerJoin(`${query.alias}.timeSlots`, 'timeSlots');
                // Set find options for the query
                query.setFindOptions({
                    select: {
                        // Selected fields for the result
                        id: true,
                        employeeId: true,
                        startedAt: true,
                        stoppedAt: true,
                        employee: {
                            id: true,
                            userId: true,
                            isAway: true,
                            isOnline: true,
                            user: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                imageUrl: true
                            }
                        },
                        timeSlots: {
                            id: true,
                            overall: true,
                            duration: true
                        }
                    },
                    relations: {
                        // Related entities to be included in the result
                        timeSlots: true,
                        employee: {
                            user: true
                        }
                    },
                    order: {
                        // Order results by the 'startedAt' field in ascending order
                        startedAt: 'ASC'
                    }
                });
                // Apply additional conditions to the query based on request filters
                await this.getFilterTimeLogQuery(query, request);
                // Execute the query and retrieve time logs
                logs = await query.getMany();
                break;
            }
        }
        // Gets an array of days between the given start date, end date and timezone.
        const { startDate, endDate, timeZone } = request;
        const days = (0, utils_2.getDaysBetweenDates)(startDate, endDate, timeZone);
        // Process weekly logs using lodash and Moment.js
        const weeklyLogs = (0, underscore_1.chain)(logs)
            .groupBy('employeeId')
            .map((logs) => {
            // Calculate average duration for specific employee.
            const weeklyDuration = (0, time_log_utils_1.calculateAverage)((0, underscore_1.pluck)(logs, 'duration'));
            // Calculate average weekly activity for specific employee.
            const weeklyActivity = (0, time_log_utils_1.calculateAverageActivity)((0, underscore_1.chain)(logs).pluck('timeSlots').flatten(true).value());
            const byDate = (0, underscore_1.chain)(logs)
                .groupBy((log) => moment_extend_1.moment.utc(log.startedAt).tz(timeZone).format('YYYY-MM-DD'))
                .mapObject((logs) => {
                // Calculate average duration of the employee for specific date range.
                const sum = (0, time_log_utils_1.calculateAverage)((0, underscore_1.pluck)(logs, 'duration'));
                return { sum, logs };
            })
                .value();
            // Retrieve employee details
            const employee = logs.length > 0 ? logs[0].employee : null;
            const dates = {};
            days.forEach((date) => {
                dates[date] = byDate[date] || 0;
            });
            // Return the processed weekly logs data
            return {
                employee,
                dates,
                sum: weeklyDuration || null,
                activity: parseFloat(parseFloat(weeklyActivity + '').toFixed(2))
            };
        })
            .value();
        return weeklyLogs;
    }
    /**
     * Fetches daily time logs for chart reports based on the provided input.
     * @param request The input parameters for fetching daily time logs.
     * @returns An array of daily time log chart reports.
     */
    async getDailyReportCharts(request) {
        let logs;
        switch (this.ormType) {
            case utils_2.MultiORMEnum.MikroORM: {
                const where = await this.buildMikroOrmTimeLogWhere(request);
                const items = await this.mikroOrmRepository.find(where, {
                    populate: ['employee', 'timeSlots'],
                    orderBy: { startedAt: 'ASC' }
                });
                logs = items.map((e) => this.serialize(e));
                break;
            }
            case utils_2.MultiORMEnum.TypeORM:
            default: {
                // Create a query builder for the TimeLog entity
                const query = this.typeOrmRepository.createQueryBuilder('time_log');
                // Inner join with related entities (employee, timeSlots)
                query.innerJoin(`${query.alias}.employee`, 'employee');
                query.innerJoin(`${query.alias}.timeSlots`, 'timeSlots');
                // Set find options for the query
                query.setFindOptions({
                    order: {
                        // Order results by the 'startedAt' field in ascending order
                        startedAt: 'ASC'
                    }
                });
                // Apply additional conditions to the query based on request filters
                await this.getFilterTimeLogQuery(query, request);
                // Execute the query and retrieve time logs
                logs = await query.getMany();
                break;
            }
        }
        // Gets an array of days between the given start date, end date and timezone.
        const { startDate, endDate, timeZone } = request;
        const days = (0, utils_2.getDaysBetweenDates)(startDate, endDate, timeZone);
        // Group time logs by date and calculate tracked, manual, idle, and resumed durations
        const byDate = (0, underscore_1.chain)(logs)
            .groupBy((log) => moment_extend_1.moment.utc(log.startedAt).tz(timeZone).format('YYYY-MM-DD'))
            .mapObject((logs, date) => {
            const tracked = (0, time_log_utils_1.calculateDuration)(logs, contracts_1.TimeLogType.TRACKED); //
            const manual = (0, time_log_utils_1.calculateDuration)(logs, contracts_1.TimeLogType.MANUAL); //
            const ideal = (0, time_log_utils_1.calculateDuration)(logs, contracts_1.TimeLogType.IDLE); //
            const resumed = (0, time_log_utils_1.calculateDuration)(logs, contracts_1.TimeLogType.RESUMED); //
            return {
                date,
                value: {
                    [contracts_1.TimeLogType.TRACKED]: parseFloat((tracked / 3600).toFixed(1)),
                    [contracts_1.TimeLogType.MANUAL]: parseFloat((manual / 3600).toFixed(1)),
                    [contracts_1.TimeLogType.IDLE]: parseFloat((ideal / 3600).toFixed(1)),
                    [contracts_1.TimeLogType.RESUMED]: parseFloat((resumed / 3600).toFixed(1))
                }
            };
        })
            .value();
        // Map the calculated values to each date, ensuring no missing dates
        const dates = days.map((date) => {
            return (byDate[date] || {
                date,
                value: {
                    [contracts_1.TimeLogType.TRACKED]: 0,
                    [contracts_1.TimeLogType.MANUAL]: 0,
                    [contracts_1.TimeLogType.IDLE]: 0,
                    [contracts_1.TimeLogType.RESUMED]: 0
                }
            });
        });
        // Return the array of daily time log chart reports
        return dates;
    }
    /**
     * Retrieves a daily time logs report based on the provided input parameters.
     * @param request - Input parameters for querying the daily time logs report.
     * @returns A report containing time logs grouped by specified filters.
     */
    async getDailyReport(request) {
        // Extract timezone from the request
        const { timeZone } = request;
        let logs;
        switch (this.ormType) {
            case utils_2.MultiORMEnum.MikroORM: {
                const where = await this.buildMikroOrmTimeLogWhere(request);
                const items = await this.mikroOrmRepository.find(where, {
                    populate: [
                        'employee',
                        'employee.user',
                        'timeSlots',
                        'project',
                        'project.organizationContact',
                        'task',
                        'task.taskStatus',
                        'organizationContact'
                    ],
                    orderBy: { startedAt: 'ASC' }
                });
                logs = items.map((e) => this.serialize(e));
                break;
            }
            case utils_2.MultiORMEnum.TypeORM:
            default: {
                // Create a query builder for the TimeLog entity
                const query = this.typeOrmRepository.createQueryBuilder('time_log');
                // Inner join with related entities (employee, timeSlots)
                query.innerJoin(`${query.alias}.employee`, 'employee');
                query.innerJoin(`${query.alias}.timeSlots`, 'timeSlots');
                // Set find options for the query
                query.setFindOptions({
                    select: {
                        // Selected fields for the result
                        id: true,
                        employeeId: true,
                        startedAt: true,
                        stoppedAt: true,
                        description: true,
                        projectId: true,
                        taskId: true,
                        organizationContactId: true,
                        project: {
                            id: true,
                            name: true,
                            imageUrl: true,
                            membersCount: true,
                            organizationContact: {
                                id: true,
                                name: true,
                                imageUrl: true
                            }
                        },
                        task: TimeLogService_1.TASK_SELECT_FIELDS,
                        timeSlots: {
                            id: true,
                            overall: true,
                            duration: true
                        },
                        organizationContact: {
                            id: true,
                            name: true,
                            imageUrl: true
                        },
                        employee: {
                            id: true,
                            userId: true,
                            isAway: true,
                            isOnline: true,
                            user: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                imageUrl: true
                            }
                        }
                    },
                    relations: {
                        // Related entities to be included in the result
                        project: { organizationContact: true },
                        task: { taskStatus: true },
                        timeSlots: true,
                        organizationContact: true,
                        employee: { user: true }
                    },
                    order: {
                        // Order results by the 'startedAt' field in ascending order
                        startedAt: 'ASC'
                    }
                });
                // Apply additional conditions to the query based on request filters
                await this.getFilterTimeLogQuery(query, request);
                // Execute the query and retrieve time logs
                logs = await query.getMany();
                break;
            }
        }
        // Group time logs based on the specified 'groupBy' filter
        let dailyLogs;
        switch (request.groupBy) {
            case contracts_1.ReportGroupFilterEnum.employee:
                dailyLogs = await this.commandBus.execute(new commands_1.GetTimeLogGroupByEmployeeCommand(logs, timeZone));
                break;
            case contracts_1.ReportGroupFilterEnum.project:
                dailyLogs = await this.commandBus.execute(new commands_1.GetTimeLogGroupByProjectCommand(logs, timeZone));
                break;
            case contracts_1.ReportGroupFilterEnum.client:
                dailyLogs = await this.commandBus.execute(new commands_1.GetTimeLogGroupByClientCommand(logs, timeZone));
                break;
            default:
                dailyLogs = await this.commandBus.execute(new commands_1.GetTimeLogGroupByDateCommand(logs, timeZone));
                break;
        }
        // Return the generated daily time logs report
        return dailyLogs;
    }
    /**
     * Fetches an owed amount report based on the provided input.
     * @param request The input parameters for fetching the owed amount report.
     * @returns A Promise that resolves to an array of owed amount report data.
     */
    async getOwedAmountReport(request) {
        // Extract timezone from the request
        const { timeZone } = request;
        let timeLogs;
        switch (this.ormType) {
            case utils_2.MultiORMEnum.MikroORM: {
                const where = await this.buildMikroOrmTimeLogWhere(request);
                const items = await this.mikroOrmRepository.find(where, {
                    populate: ['employee', 'employee.user'],
                    orderBy: { startedAt: 'ASC' }
                });
                timeLogs = items.map((e) => this.serialize(e));
                break;
            }
            case utils_2.MultiORMEnum.TypeORM:
            default: {
                // Create a query builder for the TimeLog entity
                const query = this.typeOrmRepository.createQueryBuilder('time_log');
                // Inner join with related entities (employee, timeSlots)
                query.innerJoin(`${query.alias}.employee`, 'employee');
                query.innerJoin(`${query.alias}.timeSlots`, 'timeSlots');
                // Set up the find options for the query
                query.setFindOptions({
                    select: {
                        employee: {
                            id: true,
                            userId: true,
                            isAway: true,
                            isOnline: true,
                            billRateValue: true,
                            user: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                imageUrl: true
                            }
                        }
                    },
                    relations: {
                        // Related entities to be included in the result
                        employee: {
                            user: true
                        }
                    },
                    order: {
                        // Order results by the 'startedAt' field in ascending order
                        startedAt: 'ASC'
                    }
                });
                // Apply additional conditions to the query based on request filters
                await this.getFilterTimeLogQuery(query, request);
                // Execute the query and retrieve time logs
                timeLogs = await query.getMany();
                break;
            }
        }
        const dailyLogs = (0, underscore_1.chain)(timeLogs)
            .groupBy((log) => moment_extend_1.moment.utc(log.startedAt).tz(timeZone).format('YYYY-MM-DD'))
            .map((byDateLogs, date) => {
            const byEmployee = (0, underscore_1.chain)(byDateLogs)
                .groupBy('employeeId')
                .map((byEmployeeLogs) => {
                // Calculate average duration for specific employee.
                const durationSum = (0, time_log_utils_1.calculateAverage)((0, underscore_1.pluck)(byEmployeeLogs, 'duration'));
                // Retrieve employee details
                const employee = byEmployeeLogs.length > 0 ? byEmployeeLogs[0].employee : null;
                const amount = employee?.billRateValue * (durationSum / 3600);
                return {
                    employee,
                    amount: parseFloat(amount.toFixed(1)),
                    duration: durationSum
                };
            })
                .value();
            return {
                date,
                employees: byEmployee
            };
        })
            .value();
        return dailyLogs;
    }
    /**
     * Fetches owed amount report data for charts based on the provided input.
     * @param request The input parameters for fetching owed amount report charts.
     * @returns An array of owed amount report chart data.
     */
    async getOwedAmountReportCharts(request) {
        let timeLogs;
        switch (this.ormType) {
            case utils_2.MultiORMEnum.MikroORM: {
                const where = await this.buildMikroOrmTimeLogWhere(request);
                const items = await this.mikroOrmRepository.find(where, {
                    populate: ['employee', 'employee.user'],
                    orderBy: { startedAt: 'ASC' }
                });
                timeLogs = items.map((e) => this.serialize(e));
                break;
            }
            case utils_2.MultiORMEnum.TypeORM:
            default: {
                // Step 1: Create a query builder for the TimeLog entity
                const query = this.typeOrmRepository.createQueryBuilder('time_log');
                // Inner join with related entities (employee, timeSlots)
                query.innerJoin(`${query.alias}.employee`, 'employee');
                query.innerJoin(`${query.alias}.timeSlots`, 'timeSlots');
                // Set find options for the query
                query.setFindOptions({
                    select: {
                        // Selected fields for the result
                        employee: {
                            id: true,
                            billRateValue: true,
                            userId: true,
                            isAway: true,
                            isOnline: true,
                            user: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                imageUrl: true
                            }
                        }
                    },
                    relations: {
                        employee: {
                            user: true
                        }
                    },
                    order: {
                        // Order results by the 'startedAt' field in ascending order
                        startedAt: 'ASC'
                    }
                });
                // Apply additional conditions to the query based on request filters
                await this.getFilterTimeLogQuery(query, request);
                // Execute the query and retrieve time logs
                timeLogs = await query.getMany();
                break;
            }
        }
        // Gets an array of days between the given start date, end date and timezone.
        const { startDate, endDate, timeZone } = request;
        const days = (0, utils_2.getDaysBetweenDates)(startDate, endDate, timeZone);
        const byDate = (0, underscore_1.chain)(timeLogs)
            .groupBy((log) => moment_extend_1.moment.utc(log.startedAt).tz(timeZone).format('YYYY-MM-DD'))
            .mapObject((byDateLogs, date) => {
            const byEmployee = (0, underscore_1.chain)(byDateLogs)
                .groupBy('employeeId')
                .map((byEmployeeLogs) => {
                // Calculate average duration for specific employee.
                const durationSum = (0, time_log_utils_1.calculateAverage)((0, underscore_1.pluck)(byEmployeeLogs, 'duration'));
                // Retrieve employee details
                const employee = byEmployeeLogs.length > 0 ? byEmployeeLogs[0].employee : null;
                // Calculate the owed amount based on the employee's bill rate and duration
                const amount = employee?.billRateValue * (durationSum / 3600);
                return {
                    employee,
                    amount: parseFloat(amount.toFixed(1)),
                    duration: durationSum
                };
            })
                .value();
            // Calculate the total owed amount for all employees on a specific date
            const value = byEmployee.reduce((iteratee, item) => {
                return iteratee + item.amount;
            }, 0);
            return { date, value };
        })
            .value();
        // Map the result to an array of owed amount report chart data
        const dates = days.map((date) => ({
            date,
            value: byDate[date]?.value || 0
        }));
        // Return the array of owed amount report chart data
        return dates;
    }
    /**
     * It retrieves time log data, processes it, and calculates time limits for each employee based on the specified duration (day, month, etc.).
     * @param request - An object containing input parameters for the time limit report.
     * @returns An array of ITimeLimitReport containing information about time limits and durations for each date and employee.
     */
    async getTimeLimit(request) {
        // Set a default duration ('day') if not provided in the request.
        if (!request.duration) {
            request.duration = 'day';
        }
        let timeLogs;
        switch (this.ormType) {
            case utils_2.MultiORMEnum.MikroORM: {
                const where = await this.buildMikroOrmTimeLogWhere(request);
                const items = await this.mikroOrmRepository.find(where, {
                    populate: ['employee', 'employee.user'],
                    orderBy: { startedAt: 'ASC' }
                });
                timeLogs = items.map((e) => this.serialize(e));
                break;
            }
            case utils_2.MultiORMEnum.TypeORM:
            default: {
                // Create a query builder for the TimeLog entity
                const query = this.typeOrmRepository.createQueryBuilder(this.tableName);
                // Inner join with related entities (employee, timeSlots)
                query.innerJoin(`${query.alias}.employee`, 'employee');
                query.innerJoin(`${query.alias}.timeSlots`, 'timeSlots');
                // Set find options for the query
                query.setFindOptions({
                    select: {
                        // Specify the fields to be selected in the query result.
                        employee: {
                            id: true,
                            reWeeklyLimit: true,
                            userId: true,
                            isOnline: true,
                            isAway: true,
                            user: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                imageUrl: true
                            }
                        }
                    },
                    relations: {
                        employee: {
                            user: true
                        }
                    },
                    order: {
                        // Order results by the 'startedAt' field in ascending order
                        startedAt: 'ASC'
                    }
                });
                // Apply additional conditions to the query based on request filters
                await this.getFilterTimeLogQuery(query, request);
                // Execute the query and retrieve time logs
                timeLogs = await query.getMany();
                break;
            }
        }
        // Gets an array of days between the given start date, end date and timezone.
        const { startDate, endDate, timeZone } = request;
        const days = (0, utils_2.getDaysBetweenDates)(startDate, endDate, timeZone);
        // Process time log data and calculate time limits for each employee and date
        const byDate = (0, underscore_1.chain)(timeLogs)
            .groupBy((log) => moment_extend_1.moment.utc(log.startedAt).tz(timeZone).startOf(request.duration).format('YYYY-MM-DD'))
            .mapObject((byDateLogs, date) => {
            const byEmployee = (0, underscore_1.chain)(byDateLogs)
                .groupBy('employeeId')
                .map((byEmployeeLogs) => {
                // Calculate average duration for specific employee.
                const durationSum = (0, time_log_utils_1.calculateAverage)((0, underscore_1.pluck)(byEmployeeLogs, 'duration'));
                // Retrieve employee details
                const employee = byEmployeeLogs.length > 0 ? byEmployeeLogs[0].employee : null;
                let limit = employee ? employee.reWeeklyLimit * 60 * 60 : 0;
                // Define a mapping object for duration multipliers
                const multipliers = {
                    day: 1 / 5,
                    month: 4
                };
                // Check if the requested duration is in the mapping object
                if (request.duration in multipliers) {
                    const durationMultiplier = multipliers[request.duration];
                    // Update the limit using the corresponding multiplier
                    limit *= durationMultiplier;
                }
                // Calculate duration percentage, handling the case where limit is 0
                const durationPercentage = limit !== 0 ? (durationSum * 100) / limit : 0;
                return {
                    employee,
                    duration: durationSum,
                    durationPercentage: Number.isFinite(durationPercentage) ? durationPercentage.toFixed(2) : 0,
                    limit
                };
            })
                .value();
            return { date, employees: byEmployee };
        })
            .value();
        // Create an array of ITimeLimitReport for each date.
        const dates = days.map((date) => (byDate[date] ? byDate[date] : { date, employees: [] }));
        // Return the final result as an array of ITimeLimitReport.
        return dates;
    }
    /**
     * Fetches project budget limit report data based on the provided input.
     * @param request The input parameters for fetching project budget limit report data.
     * @returns An array of project budget limit report data.
     */
    async getProjectBudgetLimit(request) {
        const { organizationId, employeeIds = [], projectIds = [], startDate, endDate } = request;
        const tenantId = context_1.RequestContext.currentTenantId() || request.tenantId;
        let organizationProjects;
        switch (this.ormType) {
            case utils_2.MultiORMEnum.MikroORM: {
                const knex = this.mikroOrmTimeLogRepository.getKnex();
                const { start, end } = (0, utils_2.getDateRangeFormat)(moment_extend_1.moment.utc(startDate), moment_extend_1.moment.utc(endDate));
                // Step 1: Get distinct project IDs that match the filters
                let projectQuery = knex('organization_project')
                    .innerJoin('time_log', 'organization_project.id', 'time_log.projectId')
                    .innerJoin('employee', 'time_log.employeeId', 'employee.id')
                    .select('organization_project.id as id')
                    .where('organization_project.tenantId', tenantId)
                    .andWhere('organization_project.organizationId', organizationId)
                    .andWhere('employee.tenantId', tenantId)
                    .andWhere('employee.organizationId', organizationId)
                    .andWhere('time_log.tenantId', tenantId)
                    .andWhere('time_log.organizationId', organizationId)
                    .andWhere('time_log.startedAt', '>=', start)
                    .andWhere('time_log.startedAt', '<', end)
                    .groupBy('organization_project.id');
                if ((0, utils_1.isNotEmpty)(employeeIds)) {
                    projectQuery = projectQuery.whereIn('employee.id', employeeIds);
                    projectQuery = projectQuery.whereIn('time_log.employeeId', employeeIds);
                }
                if ((0, utils_1.isNotEmpty)(projectIds)) {
                    projectQuery = projectQuery.whereIn('time_log.projectId', projectIds);
                }
                const matchedProjects = await projectQuery;
                const matchedProjectIds = matchedProjects.map((r) => r.id);
                if (matchedProjectIds.length === 0) {
                    organizationProjects = [];
                    break;
                }
                // Step 2: Get project details
                const projectRows = await knex('organization_project')
                    .select('id', 'name', 'budget', 'budgetType', 'imageUrl', 'membersCount')
                    .whereIn('id', matchedProjectIds);
                // Step 3: Get timeLogs with employee data for these projects
                let timeLogQuery = knex('time_log')
                    .innerJoin('employee', 'time_log.employeeId', 'employee.id')
                    .select('time_log.id as id', 'time_log.duration as duration', 'time_log.projectId as projectId', 'time_log.employeeId as employeeId', 'employee.billRateValue as employee_billRateValue')
                    .where('time_log.tenantId', tenantId)
                    .andWhere('time_log.organizationId', organizationId)
                    .andWhere('time_log.startedAt', '>=', start)
                    .andWhere('time_log.startedAt', '<', end)
                    .whereIn('time_log.projectId', matchedProjectIds);
                if ((0, utils_1.isNotEmpty)(employeeIds)) {
                    timeLogQuery = timeLogQuery.whereIn('time_log.employeeId', employeeIds);
                }
                const timeLogRows = await timeLogQuery;
                // Step 4: Group timeLogs by projectId and attach to projects
                const timeLogsByProject = {};
                for (const row of timeLogRows) {
                    const pid = row.projectId;
                    if (!timeLogsByProject[pid])
                        timeLogsByProject[pid] = [];
                    timeLogsByProject[pid].push({
                        id: row.id,
                        duration: row.duration,
                        employee: { billRateValue: row.employee_billRateValue }
                    });
                }
                organizationProjects = projectRows.map((proj) => ({
                    ...proj,
                    timeLogs: timeLogsByProject[proj.id] || []
                }));
                break;
            }
            case utils_2.MultiORMEnum.TypeORM:
            default: {
                // Step 1: Create a query builder for the OrganizationProject entity
                const query = this.typeOrmOrganizationProjectRepository.createQueryBuilder('organization_project');
                // Inner join with related entities (employee, timeLogs)
                query.innerJoin(`${query.alias}.timeLogs`, 'timeLogs');
                query.innerJoin(`timeLogs.employee`, 'employee');
                // Set find options for the query
                query.setFindOptions({
                    select: {
                        id: true,
                        name: true,
                        budget: true,
                        budgetType: true,
                        imageUrl: true,
                        membersCount: true
                    },
                    relations: {
                        timeLogs: {
                            employee: true
                        }
                    }
                });
                query.andWhere(new typeorm_1.Brackets((qb) => {
                    qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."organizationId" =:organizationId`), {
                        organizationId
                    });
                    qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."tenantId" =:tenantId`), {
                        tenantId
                    });
                }));
                query.andWhere(new typeorm_1.Brackets((qb) => {
                    qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"employee"."organizationId" =:organizationId`), {
                        organizationId
                    });
                    qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"employee"."tenantId" =:tenantId`), {
                        tenantId
                    });
                    if ((0, utils_1.isNotEmpty)(employeeIds)) {
                        qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"employee"."id" IN (:...employeeIds)`), {
                            employeeIds
                        });
                    }
                }));
                query.andWhere(new typeorm_1.Brackets((qb) => {
                    qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"timeLogs"."organizationId" =:organizationId`), {
                        organizationId
                    });
                    qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"timeLogs"."tenantId" =:tenantId`), { tenantId });
                    // Date range condition
                    const { start, end } = (0, utils_2.getDateRangeFormat)(moment_extend_1.moment.utc(startDate), moment_extend_1.moment.utc(endDate));
                    qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"timeLogs"."startedAt" >= :startDate AND "timeLogs"."startedAt" < :endDate`), {
                        startDate: start,
                        endDate: end
                    });
                    if ((0, utils_1.isNotEmpty)(employeeIds)) {
                        qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"timeLogs"."employeeId" IN (:...employeeIds)`), {
                            employeeIds
                        });
                    }
                    if ((0, utils_1.isNotEmpty)(projectIds)) {
                        qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"timeLogs"."projectId" IN (:...projectIds)`), {
                            projectIds
                        });
                    }
                }));
                // Execute the query and retrieve organization projects
                organizationProjects = await query.getMany();
                break;
            }
        }
        const projects = organizationProjects.map((organizationProject) => {
            const { budgetType, timeLogs = [] } = organizationProject;
            const budget = organizationProject.budget || 0;
            let spent = 0;
            let spentPercentage = 0;
            let remainingBudget = 0;
            if (budgetType == contracts_1.OrganizationProjectBudgetTypeEnum.HOURS) {
                spent = timeLogs.reduce((totalDuration, log) => totalDuration + log.duration / 3600, 0);
            }
            else {
                spent = timeLogs.reduce((totalAmount, log) => {
                    const logAmount = log.employee ? (log.duration / 3600) * log.employee.billRateValue : 0;
                    return totalAmount + logAmount;
                }, 0);
            }
            spentPercentage = (spent * 100) / budget;
            remainingBudget = Math.max(budget - spent, 0);
            // Remove timeLogs property from the organizationProject object
            const { timeLogs: _, ...projectWithoutTimeLogs } = organizationProject;
            return {
                project: projectWithoutTimeLogs,
                budgetType,
                budget,
                spent: parseFloat(spent.toFixed(2)),
                remainingBudget: Number.isFinite(remainingBudget) ? parseFloat(remainingBudget.toFixed(2)) : 0,
                spentPercentage: Number.isFinite(spentPercentage) ? parseFloat(spentPercentage.toFixed(2)) : 0
            };
        });
        return projects;
    }
    /**
     * Calculate client budget limit report for a given organization contact.
     * @param organizationContact The organization contact for which to calculate the budget limit report.
     * @returns The client budget limit report.
     */
    async getClientBudgetLimit(request) {
        const { organizationId, employeeIds = [], projectIds = [], startDate, endDate } = request;
        const tenantId = context_1.RequestContext.currentTenantId();
        let organizationContacts;
        switch (this.ormType) {
            case utils_2.MultiORMEnum.MikroORM: {
                const knex = this.mikroOrmTimeLogRepository.getKnex();
                const { start, end } = (0, utils_2.getDateRangeFormat)(moment_extend_1.moment.utc(startDate), moment_extend_1.moment.utc(endDate));
                // Step 1: Get distinct contact IDs that match the filters
                let contactQuery = knex('organization_contact')
                    .innerJoin('time_log', 'organization_contact.id', 'time_log.organizationContactId')
                    .innerJoin('employee', 'time_log.employeeId', 'employee.id')
                    .select('organization_contact.id as id')
                    .where('organization_contact.tenantId', tenantId)
                    .andWhere('organization_contact.organizationId', organizationId)
                    .andWhere('employee.tenantId', tenantId)
                    .andWhere('employee.organizationId', organizationId)
                    .andWhere('time_log.tenantId', tenantId)
                    .andWhere('time_log.organizationId', organizationId)
                    .andWhere('time_log.startedAt', '>=', start)
                    .andWhere('time_log.startedAt', '<', end)
                    .groupBy('organization_contact.id');
                if ((0, utils_1.isNotEmpty)(employeeIds)) {
                    contactQuery = contactQuery.whereIn('employee.id', employeeIds);
                    contactQuery = contactQuery.whereIn('time_log.employeeId', employeeIds);
                }
                if ((0, utils_1.isNotEmpty)(projectIds)) {
                    contactQuery = contactQuery.whereIn('time_log.projectId', projectIds);
                }
                const matchedContacts = await contactQuery;
                const matchedContactIds = matchedContacts.map((r) => r.id);
                if (matchedContactIds.length === 0) {
                    organizationContacts = [];
                    break;
                }
                // Step 2: Get contact details
                const contactRows = await knex('organization_contact')
                    .select('id', 'name', 'budget', 'budgetType')
                    .whereIn('id', matchedContactIds);
                // Step 3: Get timeLogs with employee data for these contacts
                let timeLogQuery = knex('time_log')
                    .innerJoin('employee', 'time_log.employeeId', 'employee.id')
                    .select('time_log.id as id', 'time_log.duration as duration', 'time_log.organizationContactId as organizationContactId', 'time_log.employeeId as employeeId', 'employee.billRateValue as employee_billRateValue')
                    .where('time_log.tenantId', tenantId)
                    .andWhere('time_log.organizationId', organizationId)
                    .andWhere('time_log.startedAt', '>=', start)
                    .andWhere('time_log.startedAt', '<', end)
                    .whereIn('time_log.organizationContactId', matchedContactIds);
                if ((0, utils_1.isNotEmpty)(employeeIds)) {
                    timeLogQuery = timeLogQuery.whereIn('time_log.employeeId', employeeIds);
                }
                if ((0, utils_1.isNotEmpty)(projectIds)) {
                    timeLogQuery = timeLogQuery.whereIn('time_log.projectId', projectIds);
                }
                const timeLogRows = await timeLogQuery;
                // Step 4: Group timeLogs by contactId and attach to contacts
                const timeLogsByContact = {};
                for (const row of timeLogRows) {
                    const cid = row.organizationContactId;
                    if (!timeLogsByContact[cid])
                        timeLogsByContact[cid] = [];
                    timeLogsByContact[cid].push({
                        id: row.id,
                        duration: row.duration,
                        employee: { billRateValue: row.employee_billRateValue }
                    });
                }
                organizationContacts = contactRows.map((contact) => ({
                    ...contact,
                    timeLogs: timeLogsByContact[contact.id] || []
                }));
                break;
            }
            case utils_2.MultiORMEnum.TypeORM:
            default: {
                // Step 1: Create a query builder for the OrganizationClient entity
                const query = this.typeOrmOrganizationContactRepository.createQueryBuilder('organization_contact');
                // Inner join with related entities (employee, timeLogs)
                query.innerJoin(`${query.alias}.timeLogs`, 'timeLogs');
                query.innerJoin(`timeLogs.employee`, 'employee');
                // Set find options for the query
                query.setFindOptions({
                    select: {
                        id: true,
                        name: true,
                        budget: true,
                        budgetType: true
                    },
                    relations: {
                        timeLogs: {
                            employee: true
                        }
                    }
                });
                query.andWhere(new typeorm_1.Brackets((qb) => {
                    qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."organizationId" =:organizationId`), { organizationId });
                    qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."tenantId" =:tenantId`), { tenantId });
                }));
                query.andWhere(new typeorm_1.Brackets((qb) => {
                    qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"employee"."organizationId" =:organizationId`), { organizationId });
                    qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"employee"."tenantId" =:tenantId`), { tenantId });
                    if ((0, utils_1.isNotEmpty)(employeeIds)) {
                        qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"employee"."id" IN (:...employeeIds)`), { employeeIds });
                    }
                }));
                query.andWhere(new typeorm_1.Brackets((qb) => {
                    qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"timeLogs"."organizationId" =:organizationId`), { organizationId });
                    qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"timeLogs"."tenantId" =:tenantId`), { tenantId });
                    const { start, end } = (0, utils_2.getDateRangeFormat)(moment_extend_1.moment.utc(startDate), moment_extend_1.moment.utc(endDate));
                    qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"timeLogs"."startedAt" >= :startDate AND "timeLogs"."startedAt" < :endDate`), {
                        startDate: start,
                        endDate: end
                    });
                    if ((0, utils_1.isNotEmpty)(employeeIds)) {
                        qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"timeLogs"."employeeId" IN (:...employeeIds)`), {
                            employeeIds
                        });
                    }
                    if ((0, utils_1.isNotEmpty)(projectIds)) {
                        qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"timeLogs"."projectId" IN (:...projectIds)`), {
                            projectIds
                        });
                    }
                }));
                // Execute the query and retrieve organization contacts
                organizationContacts = await query.getMany();
                break;
            }
        }
        const clients = organizationContacts.map((organizationContact) => {
            const { budgetType, timeLogs = [], ...contactWithoutTimeLogs } = organizationContact;
            const budget = organizationContact.budget || 0;
            const spent = timeLogs.reduce((total, log) => {
                const amount = budgetType === contracts_1.OrganizationContactBudgetTypeEnum.HOURS
                    ? total + log.duration / 3600
                    : total + (log.duration / 3600) * (log.employee?.billRateValue || 0);
                return amount;
            }, 0);
            const spentPercentage = (spent * 100) / budget;
            const remainingBudget = Math.max(budget - spent, 0);
            return {
                organizationContact: { ...contactWithoutTimeLogs },
                budgetType,
                budget,
                spent: parseFloat(spent.toFixed(2)),
                remainingBudget: Number.isFinite(remainingBudget) ? parseFloat(remainingBudget.toFixed(2)) : 0,
                spentPercentage: Number.isFinite(spentPercentage) ? parseFloat(spentPercentage.toFixed(2)) : 0
            };
        });
        return clients;
    }
    /**
     * Modifies the provided query to filter TimeLogs based on the given criteria.
     * @param query - The query to be modified.
     * @param request - The criteria for filtering TimeLogs.
     * @returns The modified query.
     */
    async getFilterTimeLogQuery(query, request) {
        const { organizationId, projectIds = [], teamIds = [], taskIds = [] } = request;
        let { employeeIds = [] } = request;
        const tenantId = context_1.RequestContext.currentTenantId();
        const user = context_1.RequestContext.currentUser();
        // Check if the current user has the permission to change the selected employee
        const hasChangeSelectedEmployeePermission = context_1.RequestContext.hasPermission(contracts_1.PermissionsEnum.CHANGE_SELECTED_EMPLOYEE);
        // Determine if the request specifies to retrieve data for the current user only
        const isOnlyMeSelected = request.onlyMe;
        // Set employeeIds based on permissions and request
        if (user.employeeId && isOnlyMeSelected) {
            // Case 1: User explicitly requests "Only Me"
            employeeIds = [user.employeeId];
        }
        else if (!hasChangeSelectedEmployeePermission && user.employeeId) {
            // Case 2: User doesn't have global permission → Check if manager of requested employees
            if ((0, utils_1.isNotEmpty)(employeeIds)) {
                // Verify if user can manage ALL requested employees in the specified teams
                const canManageAll = await this._managedEmployeeService.canManageEmployees(employeeIds, teamIds);
                if (!canManageAll) {
                    // User is NOT manager of all requested employees → Override with currentEmployeeId
                    employeeIds = [user.employeeId];
                }
                // Otherwise → Keep the requested employeeIds (no override)
            }
            else {
                // No specific employeeIds requested → Override with currentEmployeeId
                employeeIds = [user.employeeId];
            }
        }
        // Filters records based on the timesheetId.
        if ((0, utils_1.isNotEmpty)(request.timesheetId)) {
            const { timesheetId } = request;
            query.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."timesheetId" = :timesheetId`), { timesheetId });
        }
        // Filters records based on the date range.
        if ((0, utils_1.isNotEmpty)(request.startDate) && (0, utils_1.isNotEmpty)(request.endDate)) {
            const { start: startDate, end: endDate } = (0, utils_2.getDateRangeFormat)(moment_extend_1.moment.utc(request.startDate || (0, moment_extend_1.moment)().startOf('day')), moment_extend_1.moment.utc(request.endDate || (0, moment_extend_1.moment)().endOf('day')));
            query.andWhere(new typeorm_1.Brackets((qb) => {
                qb.where((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."startedAt" >= :startDate`), { startDate });
                qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."startedAt" < :endDate`), { endDate });
            }));
        }
        // Filter by organization employee IDs if used in the request
        if ((0, utils_1.isNotEmpty)(employeeIds)) {
            query.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."employeeId" IN (:...employeeIds)`), { employeeIds });
        }
        // Filter by organization task IDs if used in the request
        if ((0, utils_1.isNotEmpty)(taskIds)) {
            query.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."taskId" IN (:...taskIds)`), { taskIds });
        }
        // Filter by organization project IDs if used in the request
        if ((0, utils_1.isNotEmpty)(projectIds)) {
            query.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."projectId" IN (:...projectIds)`), { projectIds });
        }
        // Filter by organization team IDs if used in the request
        if ((0, utils_1.isNotEmpty)(teamIds)) {
            query.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."organizationTeamId" IN (:...teamIds)`), { teamIds });
        }
        // Filters records based on the overall column, representing the activity level.
        if ((0, utils_1.isNotEmpty)(request.activityLevel)) {
            /**
             * Activity Level should be 0-100%
             * Convert it into a 10-minute time slot by multiplying by 6
             */
            const { activityLevel } = request;
            query.andWhere((0, database_helper_1.prepareSQLQuery)(`"timeSlots"."overall" BETWEEN :start AND :end`), {
                start: activityLevel.start * 6,
                end: activityLevel.end * 6
            });
        }
        // Filters records based on the source column.
        if ((0, utils_1.isNotEmpty)(request.source)) {
            const { source } = request;
            const condition = source instanceof Array
                ? (0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."source" IN (:...source)`)
                : (0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."source" = :source`);
            query.andWhere(condition, { source });
        }
        // Filters records based on the logType column.
        if ((0, utils_1.isNotEmpty)(request.logType)) {
            const { logType } = request;
            const condition = logType instanceof Array
                ? (0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."logType" IN (:...logType)`)
                : (0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."logType" = :logType`);
            query.andWhere(condition, { logType });
        }
        /**
         * Apply a condition to the TypeORM query based on the 'isEdited' property in the request.
         * If 'isEdited' is true, filter rows where the 'editedAt' column is not null.
         * If 'isEdited' is false, filter rows where the 'editedAt' column is null.
         */
        if ('isEdited' in request) {
            if (request.isEdited) {
                query.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."editedAt" IS NOT NULL`));
            }
            else {
                query.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."editedAt" IS NULL`));
            }
        }
        query.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."tenantId" = :tenantId`), { tenantId });
        query.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."organizationId" = :organizationId`), { organizationId });
        query.andWhere((0, database_helper_1.prepareSQLQuery)(`"timeSlots"."tenantId" = :tenantId`), { tenantId });
        query.andWhere((0, database_helper_1.prepareSQLQuery)(`"timeSlots"."organizationId" = :organizationId`), { organizationId });
        return query;
    }
    /**
     * Builds a MikroORM-compatible where object for filtering TimeLogs.
     * This mirrors the getFilterTimeLogQuery logic for MikroORM.
     *
     * @param request - The criteria for filtering TimeLogs.
     * @returns A MikroORM-compatible where object.
     */
    async buildMikroOrmTimeLogWhere(request) {
        const { organizationId, projectIds = [], teamIds = [], taskIds = [] } = request;
        let { employeeIds = [] } = request;
        const tenantId = context_1.RequestContext.currentTenantId();
        const user = context_1.RequestContext.currentUser();
        const hasChangeSelectedEmployeePermission = context_1.RequestContext.hasPermission(contracts_1.PermissionsEnum.CHANGE_SELECTED_EMPLOYEE);
        const isOnlyMeSelected = request.onlyMe;
        if (user.employeeId && isOnlyMeSelected) {
            employeeIds = [user.employeeId];
        }
        else if (!hasChangeSelectedEmployeePermission && user.employeeId) {
            if ((0, utils_1.isNotEmpty)(employeeIds)) {
                const canManageAll = await this._managedEmployeeService.canManageEmployees(employeeIds, teamIds);
                if (!canManageAll) {
                    employeeIds = [user.employeeId];
                }
            }
            else {
                employeeIds = [user.employeeId];
            }
        }
        const where = { tenantId, organizationId };
        if ((0, utils_1.isNotEmpty)(request.timesheetId)) {
            where.timesheetId = request.timesheetId;
        }
        if ((0, utils_1.isNotEmpty)(request.startDate) && (0, utils_1.isNotEmpty)(request.endDate)) {
            const { start, end } = (0, utils_2.getDateRangeFormat)(moment_extend_1.moment.utc(request.startDate || (0, moment_extend_1.moment)().startOf('day')), moment_extend_1.moment.utc(request.endDate || (0, moment_extend_1.moment)().endOf('day')));
            where.startedAt = { $gte: start, $lt: end };
        }
        if ((0, utils_1.isNotEmpty)(employeeIds))
            where.employeeId = { $in: employeeIds };
        if ((0, utils_1.isNotEmpty)(taskIds))
            where.taskId = { $in: taskIds };
        if ((0, utils_1.isNotEmpty)(projectIds))
            where.projectId = { $in: projectIds };
        if ((0, utils_1.isNotEmpty)(teamIds))
            where.organizationTeamId = { $in: teamIds };
        if ((0, utils_1.isNotEmpty)(request.source)) {
            where.source = request.source instanceof Array ? { $in: request.source } : request.source;
        }
        if ((0, utils_1.isNotEmpty)(request.logType)) {
            where.logType = request.logType instanceof Array ? { $in: request.logType } : request.logType;
        }
        if ('isEdited' in request) {
            where.editedAt = request.isEdited ? { $ne: null } : null;
        }
        if ((0, utils_1.isNotEmpty)(request.activityLevel)) {
            const { activityLevel } = request;
            where.timeSlots = {
                ...(where.timeSlots || {}),
                overall: { $gte: activityLevel.start * 6, $lte: activityLevel.end * 6 }
            };
        }
        return where;
    }
    /**
     * Returns the time logs of an employee that overlap a date range, for a REQUEST-BORNE input.
     *
     * `GET /timesheet/time-log/conflict` used to hand the caller's query straight to
     * `IGetConflictTimeLogCommand`, which uses `employeeId` and `organizationId` verbatim. The route
     * only requires the TIME_TRACKER permission — which the default EMPLOYEE role holds — so any
     * employee could name a colleague's employee id and read that colleague's time logs (start/stop
     * times, description, source, plus any joined relation) over any date range they liked.
     *
     * This wrapper puts the same authorization the report and delete paths already use in front of
     * it, and is the ONLY entry point the controller should use. `addManualTime`, `updateManualTime`
     * and the timer service keep executing the command directly: their `employeeId` has already been
     * forced to the caller's own by `TimeLogBodyTransformPipe`.
     *
     * @param input The validated conflict query.
     * @returns The conflicting time logs the caller is allowed to see.
     */
    async getConflictTimeLogs(input) {
        // Fail closed. The tenant is never taken from the caller's query here: the command falls
        // back to `input.tenantId` when the context has none, which on a request would be a
        // caller-chosen tenant.
        const tenantId = context_1.RequestContext.currentTenantId();
        if (!tenantId) {
            throw new common_1.ForbiddenException('A tenant context is required to read conflicting time logs');
        }
        const { employeeId } = input;
        if (!employeeId) {
            throw new common_1.ForbiddenException('An employee is required to read conflicting time logs');
        }
        if (!context_1.RequestContext.hasPermission(contracts_1.PermissionsEnum.CHANGE_SELECTED_EMPLOYEE)) {
            // `currentEmployeeId()` returns null for CHANGE_SELECTED_EMPLOYEE holders by design, so
            // it is only meaningful in this branch; fall back to the user's own employee id.
            const currentEmployeeId = context_1.RequestContext.currentEmployeeId() ?? context_1.RequestContext.currentUser()?.employeeId;
            // Own logs are always readable. Otherwise the caller has to actually manage that
            // employee — the same check `getFilterTimeLogQuery` and `deleteTimeLogs` apply. A caller
            // with no employee identity at all matches neither and is refused.
            const isOwnEmployee = !!currentEmployeeId && String(currentEmployeeId) === String(employeeId);
            if (!isOwnEmployee && !(await this._managedEmployeeService.canManageEmployees([employeeId], []))) {
                throw new common_1.ForbiddenException('You do not have permission to read time logs for this employee');
            }
        }
        return await this.commandBus.execute(new commands_1.IGetConflictTimeLogCommand({ ...input, tenantId }));
    }
    /**
     * Adds a manual time log entry.
     *
     * @param request The input data for the manual time log.
     * @returns The created time log entry.
     */
    async addManualTime(request) {
        try {
            const tenantId = context_1.RequestContext.currentTenantId() ?? request.tenantId;
            const { employeeId, startedAt, stoppedAt, organizationId } = request;
            // Validate input
            if (!startedAt || !stoppedAt) {
                throw new common_1.BadRequestException('Please select valid Date, start time and end time');
            }
            // Retrieve employee information
            const employee = await this.typeOrmEmployeeRepository.findOne({
                where: { id: employeeId },
                relations: { organization: true }
            });
            // Check if future dates are allowed for the organization
            const futureDateAllowed = employee.organization.futureDateAllowed;
            // Check if the selected date and time range is allowed for the organization
            const isDateAllow = this.allowDate(startedAt, stoppedAt, futureDateAllowed);
            if (!isDateAllow) {
                throw new common_1.BadRequestException('Please select valid Date, start time and end time');
            }
            // Check for conflicts with existing time logs
            const conflicts = await this.commandBus.execute(new commands_1.IGetConflictTimeLogCommand({
                startDate: startedAt,
                endDate: stoppedAt,
                employeeId,
                organizationId,
                tenantId,
                ...(request.id && { ignoreId: request.id }) // Simplified ternary check
            }));
            // Resolve conflicts by deleting conflicting time slots
            if (conflicts?.length) {
                const times = {
                    start: new Date(startedAt),
                    end: new Date(stoppedAt)
                };
                // Loop through each conflicting time log
                for await (const timeLog of conflicts) {
                    const { timeSlots = [] } = timeLog;
                    // Delete conflicting time slots
                    for await (const timeSlot of timeSlots) {
                        await this.commandBus.execute(new commands_1.DeleteTimeSpanCommand(times, timeLog, timeSlot));
                    }
                }
            }
            // Create the new time log entry
            return await this.commandBus.execute(new commands_1.TimeLogCreateCommand(request));
        }
        catch (error) {
            // Never swallow the reason: a blanket message here hid a real database failure indefinitely.
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.BadRequestException(`Failed to add manual time log: ${error?.message ?? error}`);
        }
    }
    /**
     * Updates a manual time log entry.
     *
     * @param id The ID of the time log entry to be updated.
     * @param request The updated data for the manual time log.
     * @returns The updated time log entry.
     */
    async updateManualTime(id, request) {
        try {
            const tenantId = context_1.RequestContext.currentTenantId() ?? request.tenantId;
            const { startedAt, stoppedAt, employeeId, organizationId } = request;
            // Validate input
            if (!startedAt || !stoppedAt) {
                throw new common_1.BadRequestException('Please select valid Date start and end time');
            }
            // Retrieve employee information
            const employee = await this.typeOrmEmployeeRepository.findOne({
                where: { id: employeeId },
                relations: { organization: true }
            });
            // Check if future dates are allowed for the organization
            const futureDateAllowed = employee.organization.futureDateAllowed;
            // Check if the selected date and time range is allowed for the organization
            const isDateAllow = this.allowDate(startedAt, stoppedAt, futureDateAllowed);
            if (!isDateAllow) {
                throw new common_1.BadRequestException('Please select valid Date, start time and end time');
            }
            // Check for conflicts with existing time logs
            const timeLog = await this.findOneByIdString(id);
            // Check for conflicts with existing time logs
            const conflicts = await this.commandBus.execute(new commands_1.IGetConflictTimeLogCommand({
                startDate: startedAt,
                endDate: stoppedAt,
                employeeId,
                organizationId,
                tenantId,
                ...(id && { ignoreId: id }) // Simplified check for id
            }));
            // Resolve conflicts by deleting conflicting time slots
            if (conflicts?.length) {
                const times = { start: new Date(startedAt), end: new Date(stoppedAt) };
                // Loop through each conflicting time log
                for await (const conflict of conflicts) {
                    const { timeSlots = [] } = conflict;
                    // Delete conflicting time slots
                    for await (const timeSlot of timeSlots) {
                        await this.commandBus.execute(new commands_1.DeleteTimeSpanCommand(times, conflict, timeSlot));
                    }
                }
            }
            // Update the last edited date for the manual time log
            request.editedAt = new Date();
            // Execute the command to update the time log
            await this.commandBus.execute(new commands_1.TimeLogUpdateCommand(request, timeLog));
            // Retrieve the updated time log entry
            return await this.findOneByIdString(id);
        }
        catch (error) {
            // Never swallow the reason (same blanket catch as `addManualTime`).
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.BadRequestException(`Failed to update manual time log: ${error?.message ?? error}`);
        }
    }
    /**
     * Deletes time logs based on the provided parameters.
     *
     * @param params - The parameters for deleting the time logs, including `logIds`, `organizationId`, and `forceDelete`.
     * @returns A promise that resolves to the result of the delete or soft delete operation.
     * @throws NotAcceptableException if no log IDs are provided.
     */
    async deleteTimeLogs(params) {
        // Early return if no logIds are provided
        if ((0, utils_1.isEmpty)(params.logIds)) {
            throw new common_1.NotAcceptableException('You cannot delete time logs without IDs');
        }
        // Ensure logIds is an array
        const logIds = Array.isArray(params.logIds) ? params.logIds : [params.logIds];
        // Get the tenant ID from the request context or the provided tenant ID
        const tenantId = context_1.RequestContext.currentTenantId() ?? params.tenantId;
        const { organizationId, forceDelete } = params;
        // Create a query builder for the TimeLog entity
        let timeLogs;
        switch (this.ormType) {
            case utils_2.MultiORMEnum.MikroORM: {
                const items = await this.mikroOrmRepository.find({ id: { $in: logIds }, tenantId, organizationId }, { populate: ['timeSlots'] });
                timeLogs = items.map((e) => this.serialize(e));
                break;
            }
            case utils_2.MultiORMEnum.TypeORM:
            default: {
                const query = this.typeOrmRepository.createQueryBuilder();
                // Set find options for the query
                query.setFindOptions({
                    relations: { timeSlots: true }
                });
                // Add where clauses to the query
                query.where((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."id" IN (:...logIds)`), { logIds });
                query.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."tenantId" = :tenantId`), { tenantId });
                query.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."organizationId" = :organizationId`), { organizationId });
                // Get the time logs from the database
                timeLogs = await query.getMany();
                break;
            }
        }
        if ((0, utils_1.isEmpty)(timeLogs)) {
            throw new common_1.NotAcceptableException('No time logs found with the provided IDs');
        }
        // If user doesn't have permission to change selected employee, check manager access
        if (!context_1.RequestContext.hasPermission(contracts_1.PermissionsEnum.CHANGE_SELECTED_EMPLOYEE)) {
            // Extract unique employeeIds and teamIds from the fetched time logs
            const uniqueEmployeeIds = [...new Set(timeLogs.map((log) => log.employeeId))];
            const uniqueTeamIds = [...new Set(timeLogs.map((log) => log.organizationTeamId).filter(Boolean))];
            // Check if user can manage all employees in the time logs
            const canManageAll = await this._managedEmployeeService.canManageEmployees(uniqueEmployeeIds, uniqueTeamIds);
            if (!canManageAll) {
                throw new common_1.NotAcceptableException('You do not have permission to delete time logs for these employees');
            }
        }
        // Invoke the command bus to delete the time logs
        return await this.commandBus.execute(new commands_1.TimeLogDeleteCommand(timeLogs, forceDelete));
    }
    /**
     * Check if the provided date range is allowed.
     *
     * @param start - Start date
     * @param end - End date
     * @param organization - Organization object
     * @returns {boolean} - Returns true if the date range is allowed, otherwise false.
     */
    allowDate(start, end, futureDateAllowed) {
        // Check if the start date is before the end date
        if (!moment_extend_1.moment.utc(start).isBefore(moment_extend_1.moment.utc(end))) {
            return false;
        }
        // Check if future dates are allowed for the organization
        if (futureDateAllowed) {
            return true;
        }
        // Check if the end date is on or before the current date
        return (0, moment_extend_1.moment)(end).isSameOrBefore((0, moment_extend_1.moment)());
    }
};
exports.TimeLogService = TimeLogService;
TimeLogService.TASK_SELECT_FIELDS = {
    id: true,
    isActive: true,
    isArchived: true,
    tenantId: true,
    organizationId: true,
    number: true,
    prefix: true,
    title: true,
    description: true,
    status: true,
    priority: true,
    size: true,
    issueType: true,
    estimate: true,
    dueDate: true,
    startDate: true,
    resolvedAt: true,
    version: true,
    taskStatus: {
        name: true,
        value: true,
        description: true,
        icon: true,
        color: true,
        order: true,
        isCollapsed: true,
        isDefault: true
    }
};
exports.TimeLogService = TimeLogService = TimeLogService_1 = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_time_log_repository_1.TypeOrmTimeLogRepository,
        mikro_orm_time_log_repository_1.MikroOrmTimeLogRepository,
        type_orm_employee_repository_1.TypeOrmEmployeeRepository,
        type_orm_organization_project_repository_1.TypeOrmOrganizationProjectRepository,
        type_orm_organization_contact_repository_1.TypeOrmOrganizationContactRepository,
        cqrs_1.CommandBus,
        managed_employee_service_1.ManagedEmployeeService])
], TimeLogService);
//# sourceMappingURL=time-log.service.js.map