"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetConflictAvailabilitySlotsHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const moment = require("moment");
const config_1 = require("@gauzy/config");
const get_conflict_availability_slots_command_1 = require("../get-conflict-availability-slots.command");
const context_1 = require("./../../../core/context");
const config_2 = require("@gauzy/config");
const database_helper_1 = require("./../../../database/database.helper");
const type_orm_availability_slot_repository_1 = require("../../repository/type-orm-availability-slot.repository");
const mikro_orm_availability_slot_repository_1 = require("../../repository/mikro-orm-availability-slot.repository");
let GetConflictAvailabilitySlotsHandler = class GetConflictAvailabilitySlotsHandler {
    constructor(typeOrmAvailabilitySlotRepository, mikroOrmAvailabilitySlotRepository, configService) {
        this.typeOrmAvailabilitySlotRepository = typeOrmAvailabilitySlotRepository;
        this.mikroOrmAvailabilitySlotRepository = mikroOrmAvailabilitySlotRepository;
        this.configService = configService;
    }
    async execute(command) {
        const { input } = command;
        const { startTime, endTime, employeeId, organizationId } = input;
        const tenantId = context_1.RequestContext.currentTenantId() || input.tenantId;
        const startedAt = moment(startTime).toISOString();
        const stoppedAt = moment(endTime).toISOString();
        const query = this.typeOrmAvailabilitySlotRepository.createQueryBuilder();
        query.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."tenantId" = :tenantId`), {
            tenantId
        });
        query.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."employeeId" = :employeeId`), {
            employeeId
        });
        switch (this.configService.dbConnectionOptions.type) {
            case config_2.DatabaseTypeEnum.sqlite:
            case config_2.DatabaseTypeEnum.betterSqlite3:
                query.andWhere(`'${startedAt}' >= "${query.alias}"."startTime" AND '${startedAt}' <= "${query.alias}"."endTime"`);
                break;
            case config_2.DatabaseTypeEnum.postgres:
                query.andWhere(`(
						"${query.alias}"."startTime", "${query.alias}"."endTime") OVERLAPS (timestamptz '${startedAt}', timestamptz '${stoppedAt}'
					)`);
                break;
            case config_2.DatabaseTypeEnum.mysql:
                query.andWhere((0, database_helper_1.prepareSQLQuery)(`(
						("${query.alias}"."startTime" BETWEEN CAST('${startedAt}' AS DATETIME) AND CAST('${stoppedAt}' AS DATETIME))
						OR
						("${query.alias}"."endTime" BETWEEN CAST('${startedAt}' AS DATETIME) AND CAST('${stoppedAt}' AS DATETIME))
						OR
						("${query.alias}"."startTime" <= CAST('${startedAt}' AS DATETIME) AND "${query.alias}"."endTime" >= CAST('${stoppedAt}' AS DATETIME))
					)`));
                break;
            default:
                throw Error(`cannot compare startTime/endTime due to unsupported database type: ${this.configService.dbConnectionOptions.type}`);
        }
        // organization and tenant for availability slots conflicts
        if (organizationId) {
            query.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."organizationId" = :organizationId`), {
                organizationId
            });
        }
        if (input.type) {
            query.andWhere(`${query.alias}.type = :type`, {
                type: input.type
            });
        }
        if (input.relations) {
            input.relations.forEach((relation) => {
                query.leftJoinAndSelect(`${query.alias}.${relation}`, relation);
            });
        }
        if (input.ignoreId) {
            query.andWhere(`${query.alias}.id NOT IN (:...id)`, {
                id: input.ignoreId instanceof Array ? input.ignoreId : [input.ignoreId]
            });
        }
        return await query.getMany();
    }
};
exports.GetConflictAvailabilitySlotsHandler = GetConflictAvailabilitySlotsHandler;
exports.GetConflictAvailabilitySlotsHandler = GetConflictAvailabilitySlotsHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(get_conflict_availability_slots_command_1.GetConflictAvailabilitySlotsCommand),
    tslib_1.__metadata("design:paramtypes", [type_orm_availability_slot_repository_1.TypeOrmAvailabilitySlotRepository,
        mikro_orm_availability_slot_repository_1.MikroOrmAvailabilitySlotRepository,
        config_1.ConfigService])
], GetConflictAvailabilitySlotsHandler);
//# sourceMappingURL=get-conflict-availability-slots.handler.js.map