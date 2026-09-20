"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RenameSubscriptionToEntitySubscriptionEntityTable1740727466186 = void 0;
const chalk = require("chalk");
class RenameSubscriptionToEntitySubscriptionEntityTable1740727466186 {
    constructor() {
        this.name = 'RenameSubscriptionToEntitySubscriptionEntityTable1740727466186';
    }
    /**
     * Up Migration
     *
     * @param queryRunner
     */
    async up(queryRunner) {
        console.log(chalk.yellow(this.name + ' start running!'));
        await queryRunner.renameTable('subscription', 'entity_subscription');
    }
    /**
     * Down Migration
     *
     * @param queryRunner
     */
    async down(queryRunner) {
        await queryRunner.renameTable('entity_subscription', 'subscription');
    }
}
exports.RenameSubscriptionToEntitySubscriptionEntityTable1740727466186 = RenameSubscriptionToEntitySubscriptionEntityTable1740727466186;
//# sourceMappingURL=1740727466186-RenameSubscriptionToEntitySubscriptionEntityTable.js.map