"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdjustTimeLogStopDate1644491785525 = void 0;
const chalk = require("chalk");
const underscore_1 = require("underscore");
const moment = require("moment");
const config_1 = require("@gauzy/config");
const utils_1 = require("@gauzy/utils");
class AdjustTimeLogStopDate1644491785525 {
    constructor() {
        this.name = 'AdjustTimeLogStopDate1644491785525';
    }
    /**
     * Up Migration
     *
     * @param queryRunner
     */
    async up(queryRunner) {
        console.log(chalk.yellow(this.name + ' start running!'));
        switch (queryRunner.connection.options.type) {
            case config_1.DatabaseTypeEnum.sqlite:
            case config_1.DatabaseTypeEnum.betterSqlite3:
                await this.sqliteUpQueryRunner(queryRunner);
                break;
            case config_1.DatabaseTypeEnum.postgres:
                await this.postgresUpQueryRunner(queryRunner);
                break;
            case config_1.DatabaseTypeEnum.mysql:
                await this.mysqlUpQueryRunner(queryRunner);
                break;
            default:
                throw Error(`Unsupported database: ${queryRunner.connection.options.type}`);
        }
    }
    /**
     * Down Migration
     *
     * @param queryRunner
     */
    async down(queryRunner) {
        switch (queryRunner.connection.options.type) {
            case config_1.DatabaseTypeEnum.sqlite:
            case config_1.DatabaseTypeEnum.betterSqlite3:
                await this.sqliteDownQueryRunner(queryRunner);
                break;
            case config_1.DatabaseTypeEnum.postgres:
                await this.postgresDownQueryRunner(queryRunner);
                break;
            case config_1.DatabaseTypeEnum.mysql:
                await this.mysqlDownQueryRunner(queryRunner);
                break;
            default:
                throw Error(`Unsupported database: ${queryRunner.connection.options.type}`);
        }
    }
    async sqliteUpQueryRunner(queryRunner) {
        console.log(chalk.yellow(this.name + ' start running!'));
        const timeSlots = await queryRunner.connection.manager.query(`
            SELECT * FROM
                "time_slot"
            WHERE
                "time_slot"."overall" < ? OR
                "time_slot"."keyboard" < ? OR
                "time_slot"."mouse" < ? OR
                "time_slot"."duration" > ?;
        `, [0, 0, 0, 600]);
        for await (const timeSlot of timeSlots) {
            const duration = timeSlot.duration < 0 ? 0 : timeSlot.duration > 600 ? 600 : timeSlot.duration;
            const overall = timeSlot.overall < 0 ? 0 : timeSlot.overall > 600 ? 600 : timeSlot.overall;
            const keyboard = timeSlot.keyboard < 0 ? 0 : timeSlot.keyboard > 600 ? 600 : timeSlot.keyboard;
            const mouse = timeSlot.mouse < 0 ? 0 : timeSlot.mouse > 600 ? 600 : timeSlot.mouse;
            await queryRunner.connection.manager.query(`
                UPDATE "time_slot" SET
                    "duration" = ?,
                    "overall" = ?,
                    "keyboard" = ?,
                    "mouse" = ?
                WHERE
                    "id" IN(?)`, [duration, overall, keyboard, mouse, timeSlot.id]);
        }
        const timelogs = await queryRunner.connection.manager.query(`
            SELECT
                "time_log"."id" AS "time_log_id",
                "time_slot"."id" AS "time_slot_id"
            FROM "time_log"
            LEFT JOIN "time_slot_time_logs"
                ON "time_slot_time_logs"."timeLogId" = "time_log"."id"
            LEFT JOIN "time_slot"
                ON "time_slot"."id" = "time_slot_time_logs"."timeSlotId"
            WHERE
                "time_log"."stoppedAt" IS NULL
        `);
        const timeLogs = (0, underscore_1.chain)(timelogs)
            .groupBy((log) => log.time_log_id)
            .value();
        for await (const [timeLogId, timeSlots] of Object.entries(timeLogs)) {
            const timeSlotsIds = timeSlots.map((timeSlot) => timeSlot.time_slot_id).filter(Boolean);
            const [timeLog] = await queryRunner.connection.manager.query(`SELECT * FROM "time_log" WHERE "time_log"."id" = ? LIMIT 1`, [timeLogId]);
            const logDifference = moment().diff(moment.utc(timeLog.startedAt), 'minutes');
            if ((0, utils_1.isEmpty)(timeSlotsIds) && logDifference > 10) {
                await queryRunner.connection.manager.query(`UPDATE "time_log" SET
                        "stoppedAt" = ?
                    WHERE
                        "id" IN(?)`, [timeLog.startedAt, timeLog.id]);
            }
            else if ((0, utils_1.isNotEmpty)(timeSlotsIds)) {
                const timeSlots = await queryRunner.connection.manager.query(`
                    SELECT * FROM
                        "time_slot"
                    WHERE
                        "time_slot"."id" IN ('${timeSlotsIds.join("','")}')
                    ORDER BY
                        "time_slot"."startedAt" DESC
                `);
                let stoppedAt;
                let slotDifference;
                const [lastTimeSlot] = timeSlots;
                const duration = timeSlots.reduce((sum, current) => sum + current.duration, 0);
                /**
                 * Adjust stopped date as per database selection
                 */
                stoppedAt = moment
                    .utc(lastTimeSlot.startedAt)
                    .add(duration, 'seconds')
                    .format('YYYY-MM-DD HH:mm:ss.SSS');
                slotDifference = moment.utc(moment()).diff(stoppedAt, 'minutes');
                if (slotDifference > 10) {
                    await queryRunner.connection.manager.query(`
                        UPDATE "time_log" SET
                            "stoppedAt" = ?
                        WHERE
                            "id" IN(?)`, [stoppedAt, timeLog.id]);
                }
            }
        }
    }
    async sqliteDownQueryRunner(queryRunner) { }
    async postgresUpQueryRunner(queryRunner) {
        console.log(chalk.yellow(this.name + ' start running!'));
        const timeSlots = await queryRunner.connection.manager.query(`
            SELECT * FROM
                "time_slot"
            WHERE
                "time_slot"."overall" < $1 OR
                "time_slot"."keyboard" < $2 OR
                "time_slot"."mouse" < $3 OR
                "time_slot"."duration" > $4;
        `, [0, 0, 0, 600]);
        for await (const timeSlot of timeSlots) {
            const duration = timeSlot.duration < 0 ? 0 : timeSlot.duration > 600 ? 600 : timeSlot.duration;
            const overall = timeSlot.overall < 0 ? 0 : timeSlot.overall > 600 ? 600 : timeSlot.overall;
            const keyboard = timeSlot.keyboard < 0 ? 0 : timeSlot.keyboard > 600 ? 600 : timeSlot.keyboard;
            const mouse = timeSlot.mouse < 0 ? 0 : timeSlot.mouse > 600 ? 600 : timeSlot.mouse;
            await queryRunner.connection.manager.query(`
                UPDATE "time_slot" SET
                    "duration" = $1,
                    "overall" = $2,
                    "keyboard" = $3,
                    "mouse" = $4
                WHERE
                    "id" IN($5)`, [duration, overall, keyboard, mouse, timeSlot.id]);
        }
        const timelogs = await queryRunner.connection.manager.query(`
            SELECT
                "time_log"."id" AS "time_log_id",
                "time_slot"."id" AS "time_slot_id"
            FROM "time_log"
            LEFT JOIN "time_slot_time_logs"
                ON "time_slot_time_logs"."timeLogId" = "time_log"."id"
            LEFT JOIN "time_slot"
                ON "time_slot"."id" = "time_slot_time_logs"."timeSlotId"
            WHERE
                "time_log"."stoppedAt" IS NULL
        `);
        const timeLogs = (0, underscore_1.chain)(timelogs)
            .groupBy((log) => log.time_log_id)
            .value();
        for await (const [timeLogId, timeSlots] of Object.entries(timeLogs)) {
            const timeSlotsIds = timeSlots.map((timeSlot) => timeSlot.time_slot_id).filter(Boolean);
            const [timeLog] = await queryRunner.connection.manager.query(`SELECT * FROM "time_log" WHERE "time_log"."id" = $1 LIMIT 1`, [timeLogId]);
            const logDifference = moment().diff(moment.utc(timeLog.startedAt), 'minutes');
            if ((0, utils_1.isEmpty)(timeSlotsIds) && logDifference > 10) {
                await queryRunner.connection.manager.query(`
                    UPDATE "time_log" SET
                        "stoppedAt" = $1
                    WHERE
                        "id" IN($2)`, [timeLog.startedAt, timeLog.id]);
            }
            else if ((0, utils_1.isNotEmpty)(timeSlotsIds)) {
                const timeSlots = await queryRunner.connection.manager.query(`
                    SELECT * FROM
                        "time_slot"
                    WHERE
                        "time_slot"."id" IN ('${timeSlotsIds.join("','")}')
                    ORDER BY
                        "time_slot"."startedAt" DESC
                `);
                let stoppedAt;
                let slotDifference;
                const [lastTimeSlot] = timeSlots;
                const duration = timeSlots.reduce((sum, current) => sum + current.duration, 0);
                /**
                 * Adjust stopped date as per database selection
                 */
                stoppedAt = moment(lastTimeSlot.startedAt).add(duration, 'seconds').toDate();
                slotDifference = moment().diff(moment.utc(stoppedAt), 'minutes');
                if (slotDifference > 10) {
                    await queryRunner.connection.manager.query(`
                        UPDATE "time_log" SET
                            "stoppedAt" = $1
                        WHERE
                            "id" IN($2)`, [stoppedAt, timeLog.id]);
                }
            }
        }
    }
    async postgresDownQueryRunner(queryRunner) { }
    /**
     * MySQL Up Migration
     *
     * @param queryRunner
     */
    async mysqlUpQueryRunner(queryRunner) { }
    /**
     * MySQL Down Migration
     *
     * @param queryRunner
     */
    async mysqlDownQueryRunner(queryRunner) { }
}
exports.AdjustTimeLogStopDate1644491785525 = AdjustTimeLogStopDate1644491785525;
//# sourceMappingURL=1644491785525-AdjustTimeLogStopDate.js.map