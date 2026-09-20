"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolePermissionsReload1783682223985 = void 0;
const config_1 = require("@gauzy/config");
const chalk = require("chalk");
const utils_1 = require("../../role-permission/utils");
class RolePermissionsReload1783682223985 {
    constructor() {
        this.name = 'RolePermissionsReload1783682223985';
    }
    /**
     * Up Migration
     *
     * Reloads default role permissions onto every existing tenant's roles so that
     * permissions added to the defaults AFTER a tenant was created (e.g. the AI Chat
     * `AI_CHAT_ACCESS` / `AI_CHAT_SETTINGS` and OAuth client `OAUTH_CLIENT_VIEW` /
     * `OAUTH_CLIENT_EDIT` permissions) are granted to existing ADMIN / SUPER_ADMIN
     * (and EMPLOYEE, per defaults) roles. `migrateRolePermissions` only INSERTS
     * missing role_permission rows (enabled per the current defaults) — it never
     * disables or removes an existing grant — so it is safe to re-run.
     *
     * @param queryRunner
     */
    async up(queryRunner) {
        console.log(chalk.yellow(this.name + ' start running!'));
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
    async down(queryRunner) {
        console.log(chalk.yellow(this.name + ' reverting changes!'));
    }
}
exports.RolePermissionsReload1783682223985 = RolePermissionsReload1783682223985;
//# sourceMappingURL=1783682223985-RolePermissionsReload.js.map