"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateEmployeeTotalWorkedHoursHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const config_1 = require("@gauzy/config");
const database_helper_1 = require("./../../../../database/database.helper");
const context_1 = require("./../../../../core/context");
const utils_1 = require("./../../../../core/utils");
const employee_service_1 = require("../../../../employee/employee.service");
const update_employee_total_worked_hours_command_1 = require("../update-employee-total-worked-hours.command");
const type_orm_time_log_repository_1 = require("../../repository/type-orm-time-log.repository");
const mikro_orm_time_log_repository_1 = require("../../repository/mikro-orm-time-log.repository");
let UpdateEmployeeTotalWorkedHoursHandler = class UpdateEmployeeTotalWorkedHoursHandler {
    constructor(typeOrmTimeLogRepository, mikroOrmTimeLogRepository, _employeeService, _configService) {
        this.typeOrmTimeLogRepository = typeOrmTimeLogRepository;
        this.mikroOrmTimeLogRepository = mikroOrmTimeLogRepository;
        this._employeeService = _employeeService;
        this._configService = _configService;
        this.ormType = (0, utils_1.getORMType)();
    }
    /**
     * Updates the total worked hours for an employee.
     *
     * @param command The command containing employee ID and worked hours.
     */
    async execute(command) {
        const { employeeId, hours } = command;
        const tenantId = context_1.RequestContext.currentTenantId();
        // Determine total work hours, falling back to the provided value only when it could not be calculated.
        // A calculated total of 0 is a legitimate result (an employee with no time logs yet); `||` discarded it
        // and fell through to the optional `hours`, which no caller passes. `Math.floor(undefined)` is NaN, and
        // TypeORM writes NaN into the statement as a bare SQL literal that drivers reject
        // ("no such column: NaN" on SQLite), failing the whole enclosing request — creating a
        // manual time log, among others.
        const calculated = await this.calculateTotalWorkHours(employeeId, tenantId);
        const totalWorkHours = Number.isFinite(calculated) ? calculated : hours;
        // Nothing meaningful to store
        if (!Number.isFinite(totalWorkHours)) {
            return;
        }
        console.log('Updated Employee Total Worked Hours: %s', Math.floor(totalWorkHours));
        // Update employee's total worked hours
        await this._employeeService.update(employeeId, {
            totalWorkHours: Math.floor(totalWorkHours) // Use Math.floor for integer conversion
        });
    }
    /**
     * Calculates the total work hours for an employee.
     * @param employeeId The ID of the employee.
     * @param tenantId The tenant ID.
     * @returns The total work hours.
     */
    async calculateTotalWorkHours(employeeId, tenantId) {
        let result;
        switch (this.ormType) {
            case utils_1.MultiORMEnum.MikroORM: {
                const knex = this.mikroOrmTimeLogRepository.getKnex();
                const sumQuery = this.getSumQuery('time_log');
                result = await knex('time_log')
                    .withSchema(knex.userParams.schema)
                    .innerJoin('time_slot_time_logs', 'time_slot_time_logs.timeLogId', 'time_log.id')
                    .innerJoin('time_slot', 'time_slot.id', 'time_slot_time_logs.timeSlotId')
                    .select(knex.raw(`${sumQuery} as duration`))
                    .where({ 'time_log.employeeId': employeeId, 'time_log.tenantId': tenantId })
                    .first();
                break;
            }
            case utils_1.MultiORMEnum.TypeORM:
            default: {
                // Create a query builder for the TimeLog entity
                const query = this.typeOrmTimeLogRepository.createQueryBuilder();
                query.innerJoin(`${query.alias}.timeSlots`, 'time_slot');
                // Get the sum of durations between startedAt and stoppedAt
                const sumQuery = this.getSumQuery(query.alias);
                console.log('sum of durations between startedAt and stoppedAt', sumQuery);
                // Execute the query and get the duration
                result = await query
                    .select(sumQuery, 'duration')
                    .where({
                    employeeId,
                    tenantId
                })
                    .getRawOne();
                break;
            }
        }
        console.log(`get sum duration for specific employee: ${employeeId}`, +result.duration);
        // Convert duration from seconds to hours
        return Number(+result.duration || 0) / 3600;
    }
    /**
     * Get the database-specific sum query for calculating time duration between "startedAt" and "stoppedAt".
     * @param logQueryAlias The alias for the table in the query.
     * @returns The database-specific sum query that returns a Number.
     */
    getSumQuery(logQueryAlias) {
        let sumQuery;
        const { dbConnectionOptions } = this._configService;
        switch (dbConnectionOptions.type) {
            case config_1.DatabaseTypeEnum.sqlite:
            case config_1.DatabaseTypeEnum.betterSqlite3:
                sumQuery = `
					CAST(
						SUM(
							CASE
								WHEN (julianday("${logQueryAlias}"."stoppedAt") - julianday("${logQueryAlias}"."startedAt")) * 86400 >= 0
								THEN (julianday("${logQueryAlias}"."stoppedAt") - julianday("${logQueryAlias}"."startedAt")) * 86400
								ELSE 0
							END
						) AS REAL
					)
				`;
                break;
            case config_1.DatabaseTypeEnum.postgres:
                sumQuery = `
					CAST(
						SUM(
							CASE
								WHEN extract(epoch from ("${logQueryAlias}"."stoppedAt" - "${logQueryAlias}"."startedAt")) >= 0
								THEN extract(epoch from ("${logQueryAlias}"."stoppedAt" - "${logQueryAlias}"."startedAt"))
								ELSE 0
							END
						) AS DOUBLE PRECISION
					)
				`;
                break;
            case config_1.DatabaseTypeEnum.mysql:
                sumQuery = (0, database_helper_1.prepareSQLQuery)(`
					CAST(
						SUM(
							CASE
								WHEN TIMESTAMPDIFF(SECOND, \`${logQueryAlias}\`.\`startedAt\`, \`${logQueryAlias}\`.\`stoppedAt\`) >= 0
								THEN TIMESTAMPDIFF(SECOND, \`${logQueryAlias}\`.\`startedAt\`, \`${logQueryAlias}\`.\`stoppedAt\`)
								ELSE 0
							END
						) AS DECIMAL(10, 6)
					)
				`);
                break;
            default:
                throw new Error(`Unsupported database type: ${dbConnectionOptions.type}`);
        }
        return sumQuery;
    }
};
exports.UpdateEmployeeTotalWorkedHoursHandler = UpdateEmployeeTotalWorkedHoursHandler;
exports.UpdateEmployeeTotalWorkedHoursHandler = UpdateEmployeeTotalWorkedHoursHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(update_employee_total_worked_hours_command_1.UpdateEmployeeTotalWorkedHoursCommand),
    tslib_1.__metadata("design:paramtypes", [type_orm_time_log_repository_1.TypeOrmTimeLogRepository,
        mikro_orm_time_log_repository_1.MikroOrmTimeLogRepository,
        employee_service_1.EmployeeService,
        config_1.ConfigService])
], UpdateEmployeeTotalWorkedHoursHandler);
//# sourceMappingURL=update-employee-total-worked-hours.handler.js.map