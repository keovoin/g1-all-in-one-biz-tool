"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetConflictTimeLogHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const moment = require("moment");
const config_1 = require("@gauzy/config");
const database_helper_1 = require("./../../../../database/database.helper");
const get_conflict_time_log_command_1 = require("../get-conflict-time-log.command");
const context_1 = require("./../../../../core/context");
const type_orm_time_log_repository_1 = require("../../repository/type-orm-time-log.repository");
const mikro_orm_time_log_repository_1 = require("../../repository/mikro-orm-time-log.repository");
const utils_1 = require("./../../../../core/utils");
let GetConflictTimeLogHandler = class GetConflictTimeLogHandler {
    constructor(typeOrmTimeLogRepository, mikroOrmTimeLogRepository, configService) {
        this.typeOrmTimeLogRepository = typeOrmTimeLogRepository;
        this.mikroOrmTimeLogRepository = mikroOrmTimeLogRepository;
        this.configService = configService;
        this.ormType = (0, utils_1.getORMType)();
    }
    async execute(command) {
        const { input } = command;
        const tenantId = context_1.RequestContext.currentTenantId() || input.tenantId;
        const { employeeId, organizationId } = input;
        const startedAt = moment.utc(input.startDate).toISOString();
        const stoppedAt = moment.utc(input.endDate).toISOString();
        switch (this.ormType) {
            case utils_1.MultiORMEnum.MikroORM: {
                const knex = this.mikroOrmTimeLogRepository.getKnex();
                let subQuery = knex('time_log').withSchema(knex.userParams.schema).as('time_log').select('time_log.id');
                let overlapQuery = '';
                switch (this.configService.dbConnectionOptions.type) {
                    case config_1.DatabaseTypeEnum.sqlite:
                    case config_1.DatabaseTypeEnum.betterSqlite3:
                        overlapQuery = `'${startedAt}' >= "time_log"."startedAt" and '${startedAt}' <= "time_log"."stoppedAt"`;
                        break;
                    case config_1.DatabaseTypeEnum.postgres:
                        overlapQuery = `("time_log"."startedAt", "time_log"."stoppedAt") OVERLAPS (timestamptz '${startedAt}', timestamptz '${stoppedAt}')`;
                        break;
                    case config_1.DatabaseTypeEnum.mysql:
                        overlapQuery = (0, database_helper_1.prepareSQLQuery)(`"time_log"."startedAt" BETWEEN '${startedAt}' AND '${stoppedAt}' AND "time_log"."stoppedAt" BETWEEN '${startedAt}' AND '${stoppedAt}'`);
                        break;
                    default:
                        throw Error(`cannot get conflict time log due to unsupported database type: ${this.configService.dbConnectionOptions.type}`);
                }
                subQuery = subQuery
                    .where('time_log.employeeId', employeeId)
                    .where('time_log.tenantId', tenantId)
                    .where('time_log.organizationId', organizationId)
                    .whereRaw(overlapQuery);
                if (input.ignoreId) {
                    subQuery = subQuery.whereNotIn('time_log.id', input.ignoreId instanceof Array ? input.ignoreId : [input.ignoreId]);
                }
                const results = await subQuery;
                const ids = results.map((r) => r.id);
                if (ids.length === 0) {
                    return [];
                }
                const items = await this.mikroOrmTimeLogRepository.find({ id: { $in: ids } }, {
                    populate: [...new Set([...(input.relations || []), 'timeSlots'])]
                });
                return items.map((item) => (0, utils_1.wrapSerialize)(item));
            }
            case utils_1.MultiORMEnum.TypeORM:
            default: {
                let conflictQuery = this.typeOrmTimeLogRepository.createQueryBuilder();
                let query = ``;
                switch (this.configService.dbConnectionOptions.type) {
                    case config_1.DatabaseTypeEnum.sqlite:
                    case config_1.DatabaseTypeEnum.betterSqlite3:
                        query = `'${startedAt}' >= "${conflictQuery.alias}"."startedAt" and '${startedAt}' <= "${conflictQuery.alias}"."stoppedAt"`;
                        break;
                    case config_1.DatabaseTypeEnum.postgres:
                        query = `("${conflictQuery.alias}"."startedAt", "${conflictQuery.alias}"."stoppedAt") OVERLAPS (timestamptz '${startedAt}', timestamptz '${stoppedAt}')`;
                        break;
                    case config_1.DatabaseTypeEnum.mysql:
                        query = (0, database_helper_1.prepareSQLQuery)(`"${conflictQuery.alias}"."startedAt" BETWEEN '${startedAt}' AND '${stoppedAt}' AND "${conflictQuery.alias}"."stoppedAt" BETWEEN '${startedAt}' AND '${stoppedAt}'`);
                        break;
                    default:
                        throw Error(`cannot get conflict time log due to unsupported database type: ${this.configService.dbConnectionOptions.type}`);
                }
                conflictQuery = conflictQuery
                    .innerJoinAndSelect(`${conflictQuery.alias}.timeSlots`, 'timeSlots')
                    .where((0, database_helper_1.prepareSQLQuery)(`"${conflictQuery.alias}"."employeeId" = :employeeId`), { employeeId })
                    .andWhere((0, database_helper_1.prepareSQLQuery)(`"${conflictQuery.alias}"."tenantId" = :tenantId`), { tenantId })
                    .andWhere((0, database_helper_1.prepareSQLQuery)(`"${conflictQuery.alias}"."organizationId" = :organizationId`), { organizationId })
                    .andWhere(query);
                if (input.relations) {
                    input.relations.forEach((relation) => {
                        conflictQuery = conflictQuery.leftJoinAndSelect(`${conflictQuery.alias}.${relation}`, relation);
                    });
                }
                if (input.ignoreId) {
                    conflictQuery = conflictQuery.andWhere(`${conflictQuery.alias}.id NOT IN (:...id)`, {
                        id: input.ignoreId instanceof Array ? input.ignoreId : [input.ignoreId]
                    });
                }
                return await conflictQuery.getMany();
            }
        }
    }
};
exports.GetConflictTimeLogHandler = GetConflictTimeLogHandler;
exports.GetConflictTimeLogHandler = GetConflictTimeLogHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(get_conflict_time_log_command_1.IGetConflictTimeLogCommand),
    tslib_1.__metadata("design:paramtypes", [type_orm_time_log_repository_1.TypeOrmTimeLogRepository,
        mikro_orm_time_log_repository_1.MikroOrmTimeLogRepository,
        config_1.ConfigService])
], GetConflictTimeLogHandler);
//# sourceMappingURL=get-conflict-time-log.handler.js.map