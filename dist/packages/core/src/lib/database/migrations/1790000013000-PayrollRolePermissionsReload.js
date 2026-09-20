"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayrollRolePermissionsReload1790000013000 = void 0;
const config_1 = require("@gauzy/config");
const chalk = require("chalk");
const utils_1 = require("../../role-permission/utils");
/**
 * Reloads default role permissions onto every existing tenant's roles so the payroll permissions
 * added to the defaults (`ORG_PAYROLL_VIEW`, `ORG_PAYROLL_EDIT`, `ORG_PAYROLL_APPROVE`) are
 * granted per `DEFAULT_ROLE_PERMISSIONS` (issue #2453).
 *
 * `migrateRolePermissions` only INSERTS missing `role_permission` rows and never disables or
 * removes an existing grant, so it is safe to re-run. New tenants get the rows through the normal
 * seeded path. Only SUPER_ADMIN and ADMIN carry these by default — payroll is who-gets-paid-what.
 *
 * MySQL goes through the same helper: every statement it issues passes through `prepareSQLQuery`
 * (double quotes to backticks) and `replacePlaceholders` ($n to ?), and both `getInsertPayload`
 * and `insertRolePermissions` carry an explicit MySQL branch. Skipping MySQL would leave every
 * role without the payroll permissions, making the whole module inaccessible there.
 */
class PayrollRolePermissionsReload1790000013000 {
    constructor() {
        this.name = 'PayrollRolePermissionsReload1790000013000';
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
     * Deliberate no-op: removing permission rows would destroy tenant customizations, and the
     * payroll endpoints are inaccessible without the grants anyway.
     *
     * @param queryRunner
     */
    async down(queryRunner) {
        console.log(chalk.yellow(this.name + ' reverting changes!'));
    }
}
exports.PayrollRolePermissionsReload1790000013000 = PayrollRolePermissionsReload1790000013000;
//# sourceMappingURL=1790000013000-PayrollRolePermissionsReload.js.map