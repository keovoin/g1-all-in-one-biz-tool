"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduleTimeSlotEntriesHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const typeorm_1 = require("typeorm");
const utils_1 = require("@gauzy/utils");
const schedule_time_slot_entries_command_1 = require("../schedule-time-slot-entries.command");
const database_helper_1 = require("./../../../../database/database.helper");
const utils_2 = require("./../../../../core/utils");
const type_orm_time_slot_repository_1 = require("../../repository/type-orm-time-slot.repository");
const mikro_orm_time_slot_repository_1 = require("../../repository/mikro-orm-time-slot.repository");
let ScheduleTimeSlotEntriesHandler = class ScheduleTimeSlotEntriesHandler {
    constructor(typeOrmTimeSlotRepository, mikroOrmTimeSlotRepository) {
        this.typeOrmTimeSlotRepository = typeOrmTimeSlotRepository;
        this.mikroOrmTimeSlotRepository = mikroOrmTimeSlotRepository;
        this.ormType = (0, utils_2.getORMType)();
    }
    /**
     * Executes the correction of invalid time slot entries.
     * Filters time slots with values outside the permitted range [0, 600]
     * for duration, overall, keyboard, and mouse activity, and clamps them.
     *
     * @param command - The command to trigger adjustment.
     * @returns A promise that resolves when the adjustment is complete.
     */
    async execute(command) {
        const { organizationId, tenantId } = command;
        switch (this.ormType) {
            case utils_2.MultiORMEnum.MikroORM: {
                const knex = this.mikroOrmTimeSlotRepository.getKnex();
                const timeSlots = await knex('time_slot')
                    .withSchema(knex.userParams.schema)
                    .select('id', 'duration', 'overall', 'keyboard', 'mouse')
                    .where({ tenantId, organizationId })
                    .andWhere(function () {
                    this.where('overall', '<', 0)
                        .orWhere('overall', '>', 600)
                        .orWhere('keyboard', '<', 0)
                        .orWhere('keyboard', '>', 600)
                        .orWhere('mouse', '<', 0)
                        .orWhere('mouse', '>', 600)
                        .orWhere('duration', '<', 0)
                        .orWhere('duration', '>', 600);
                });
                if ((0, utils_1.isNotEmpty)(timeSlots)) {
                    for (const slot of timeSlots) {
                        await knex('time_slot')
                            .withSchema(knex.userParams.schema)
                            .where({ id: slot.id })
                            .update({
                            duration: Math.min(600, Math.max(0, slot.duration)),
                            overall: Math.min(600, Math.max(0, slot.overall)),
                            keyboard: Math.min(600, Math.max(0, slot.keyboard)),
                            mouse: Math.min(600, Math.max(0, slot.mouse))
                        });
                    }
                }
                break;
            }
            case utils_2.MultiORMEnum.TypeORM:
            default: {
                const query = this.typeOrmTimeSlotRepository.createQueryBuilder('time_slot');
                // Optimization: Only select the required fields to reduce memory usage and avoid unnecessary data retrieval
                query.select([
                    `${query.alias}.id`,
                    `${query.alias}.duration`,
                    `${query.alias}.overall`,
                    `${query.alias}.keyboard`,
                    `${query.alias}.mouse`
                ]);
                // Scope to the current tenant and organization first
                query.where((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."tenantId" = :tenantId`), { tenantId });
                query.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."organizationId" = :organizationId`), { organizationId });
                // Then find slots with invalid values (outside the [0, 600] range)
                query.andWhere(new typeorm_1.Brackets((web) => {
                    const params = { min: 0, max: 600 };
                    web.orWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."overall" < :min`), params);
                    web.orWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."overall" > :max`), params);
                    web.orWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."keyboard" < :min`), params);
                    web.orWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."keyboard" > :max`), params);
                    web.orWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."mouse" < :min`), params);
                    web.orWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."mouse" > :max`), params);
                    web.orWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."duration" < :min`), params);
                    web.orWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."duration" > :max`), params);
                }));
                const timeSlots = await query.getMany();
                if ((0, utils_1.isNotEmpty)(timeSlots)) {
                    const corrected = timeSlots.map((timeSlot) => ({
                        id: timeSlot.id,
                        duration: Math.min(600, Math.max(0, timeSlot.duration)),
                        overall: Math.min(600, Math.max(0, timeSlot.overall)),
                        keyboard: Math.min(600, Math.max(0, timeSlot.keyboard)),
                        mouse: Math.min(600, Math.max(0, timeSlot.mouse))
                    }));
                    // Use the repository's save method for bulk update
                    await this.typeOrmTimeSlotRepository.save(corrected);
                }
                break;
            }
        }
    }
};
exports.ScheduleTimeSlotEntriesHandler = ScheduleTimeSlotEntriesHandler;
exports.ScheduleTimeSlotEntriesHandler = ScheduleTimeSlotEntriesHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(schedule_time_slot_entries_command_1.ScheduleTimeSlotEntriesCommand),
    tslib_1.__metadata("design:paramtypes", [type_orm_time_slot_repository_1.TypeOrmTimeSlotRepository,
        mikro_orm_time_slot_repository_1.MikroOrmTimeSlotRepository])
], ScheduleTimeSlotEntriesHandler);
//# sourceMappingURL=schedule-time-slot-entries.handler.js.map