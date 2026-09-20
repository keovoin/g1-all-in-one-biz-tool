"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolePermissionsReload1644312012849 = void 0;
const chalk = require("chalk");
const config_1 = require("@gauzy/config");
const utils_1 = require("../../role-permission/utils");
class RolePermissionsReload1644312012849 {
    constructor() {
        this.name = 'RolePermissionsReload1644312012849';
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
                try {
                    await utils_1.RolePermissionUtils.migrateRolePermissions(queryRunner);
                }
                catch (error) {
                    console.log(chalk.red(`Error while migrating missing role permissions: ${error}`));
                }
                break;
            case config_1.DatabaseTypeEnum.mysql:
                console.log('role permission migration is not supported for mysql yet');
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
exports.RolePermissionsReload1644312012849 = RolePermissionsReload1644312012849;
//# sourceMappingURL=1644312012849-RolePermissionsReload.js.map