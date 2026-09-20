"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimesheetFirstOrCreateHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const typeorm_1 = require("typeorm");
const moment = require("moment");
const context_1 = require("./../../../../core/context");
const utils_1 = require("./../../../../core/utils");
const database_helper_1 = require("./../../../../database/database.helper");
const timesheet_first_or_create_command_1 = require("./../timesheet-first-or-create.command");
const timesheet_create_command_1 = require("./../timesheet-create.command");
const type_orm_timesheet_repository_1 = require("../../repository/type-orm-timesheet.repository");
const mikro_orm_timesheet_repository_1 = require("../../repository/mikro-orm-timesheet.repository");
const type_orm_employee_repository_1 = require("../../../../employee/repository/type-orm-employee.repository");
let TimesheetFirstOrCreateHandler = class TimesheetFirstOrCreateHandler {
    constructor(timeSheetRepository, mikroOrmTimesheetRepository, employeeRepository, commandBus) {
        this.timeSheetRepository = timeSheetRepository;
        this.mikroOrmTimesheetRepository = mikroOrmTimesheetRepository;
        this.employeeRepository = employeeRepository;
        this.commandBus = commandBus;
        this.ormType = (0, utils_1.getORMType)();
    }
    async execute(command) {
        const { date, employeeId } = command;
        let { organizationId } = command;
        const tenantId = context_1.RequestContext.currentTenantId();
        const startedAt = moment.utc(date).startOf('week');
        const stoppedAt = moment.utc(date).endOf('week');
        /**
         * If organization not found,use employee organization
         */
        if (!organizationId) {
            const employee = await this.employeeRepository.findOneBy({
                id: employeeId,
                tenantId
            });
            organizationId = employee.organizationId;
        }
        try {
            switch (this.ormType) {
                case utils_1.MultiORMEnum.MikroORM: {
                    const knex = this.mikroOrmTimesheetRepository.getKnex();
                    const record = await knex('timesheet')
                        .withSchema(knex.userParams.schema)
                        .where(function () {
                        this.where(function () {
                            this.where('startedAt', '>=', startedAt.toDate())
                                .andWhere('startedAt', '<=', stoppedAt.toDate());
                        }).orWhere(function () {
                            this.where('stoppedAt', '>=', startedAt.toDate())
                                .andWhere('stoppedAt', '<=', stoppedAt.toDate());
                        });
                    })
                        .andWhere({ tenantId, organizationId, employeeId })
                        .first();
                    if (!record) {
                        throw new Error('No timesheet found');
                    }
                    return record;
                }
                case utils_1.MultiORMEnum.TypeORM:
                default: {
                    /**
                     * Find employee current week working timesheet
                     */
                    const query = this.timeSheetRepository.createQueryBuilder('timesheet');
                    query.where((query) => {
                        query.andWhere(new typeorm_1.Brackets((qb) => {
                            qb.where([
                                {
                                    startedAt: (0, typeorm_1.Between)(startedAt.toDate(), stoppedAt.toDate())
                                },
                                {
                                    stoppedAt: (0, typeorm_1.Between)(startedAt.toDate(), stoppedAt.toDate())
                                }
                            ]);
                        }));
                        query.andWhere(new typeorm_1.Brackets((qb) => {
                            qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."tenantId" = :tenantId`), { tenantId });
                            qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."organizationId" = :organizationId`), { organizationId });
                            qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."employeeId" = :employeeId`), { employeeId });
                        }));
                    });
                    return await query.getOneOrFail();
                }
            }
        }
        catch (error) {
            /**
             * Create employee current week working timesheet
             */
            return await this.commandBus.execute(new timesheet_create_command_1.TimesheetCreateCommand({
                startedAt: moment(startedAt).toDate(),
                stoppedAt: moment(stoppedAt).toDate(),
                employeeId,
                organizationId,
                mouse: 0,
                keyboard: 0,
                duration: 0
            }));
        }
    }
};
exports.TimesheetFirstOrCreateHandler = TimesheetFirstOrCreateHandler;
exports.TimesheetFirstOrCreateHandler = TimesheetFirstOrCreateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(timesheet_first_or_create_command_1.TimesheetFirstOrCreateCommand),
    tslib_1.__metadata("design:paramtypes", [type_orm_timesheet_repository_1.TypeOrmTimesheetRepository,
        mikro_orm_timesheet_repository_1.MikroOrmTimesheetRepository,
        type_orm_employee_repository_1.TypeOrmEmployeeRepository,
        cqrs_1.CommandBus])
], TimesheetFirstOrCreateHandler);
//# sourceMappingURL=timesheet-first-or-create.handler.js.map