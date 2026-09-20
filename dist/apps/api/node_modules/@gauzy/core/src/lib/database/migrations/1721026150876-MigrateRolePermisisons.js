"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MigrateRolePermisisons1721026150876 = void 0;
const chalk = require("chalk");
const config_1 = require("@gauzy/config");
const utils_1 = require("../../role-permission/utils");
class MigrateRolePermisisons1721026150876 {
    constructor() {
        this.name = 'MigrateRolePermisisons1721026150876';
    }
    /**
     * Up Migration
     *
     * @param queryRunner
     */
    async up(queryRunner) {
        console.log(chalk.yellow(`${this.constructor.name} start running!`));
        switch (queryRunner.connection.options.type) {
            case config_1.DatabaseTypeEnum.sqlite:
            case config_1.DatabaseTypeEnum.betterSqlite3:
            case config_1.DatabaseTypeEnum.postgres:
            case config_1.DatabaseTypeEnum.mysql:
                try {
                    await utils_1.RolePermissionUtils.migrateRolePermissions(queryRunner);
                }
                catch (error) {
                    console.log(chalk.red(`Error while migrating missing role permissions: ${error}`));
                }
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
    async down(queryRunner) { }
}
exports.MigrateRolePermisisons1721026150876 = MigrateRolePermisisons1721026150876;
//# sourceMappingURL=1721026150876-MigrateRolePermisisons.js.map