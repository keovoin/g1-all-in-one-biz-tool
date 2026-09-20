"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentsRolePermissionsReload1790000003000 = void 0;
const config_1 = require("@gauzy/config");
const chalk = require("chalk");
const utils_1 = require("../../role-permission/utils");
class DocumentsRolePermissionsReload1790000003000 {
    constructor() {
        this.name = 'DocumentsRolePermissionsReload1790000003000';
    }
    /**
     * Up Migration
     *
     * Reloads default role permissions onto every existing tenant's roles so that the
     * Documents permissions added to the defaults (`DOCS_READ`, `DOCS_CREATE`,
     * `DOCS_UPDATE`, `DOCS_DELETE`, `DOCS_MANAGE`, `DOCS_REVIEW`, `DOCS_AI_IMPORT`)
     * are granted to existing roles per `DEFAULT_ROLE_PERMISSIONS`.
     * `migrateRolePermissions` only INSERTS missing role_permission rows (enabled per
     * the current defaults) — it never disables or removes an existing grant — so it is
     * safe to re-run. New tenants get the rows through the normal seeded path.
     *
     * MySQL is handled by the very same helper: every statement it issues goes through
     * `prepareSQLQuery` (double quotes → backticks) and `replacePlaceholders` ($n → ?),
     * and both `getInsertPayload` and `insertRolePermissions` carry an explicit MySQL
     * branch (the row id is generated in JS because MySQL has no UUID column default).
     * Skipping MySQL here would leave every role without the `DOCS_*` permissions, which
     * makes the whole feature inaccessible on a MySQL deployment.
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
     * Deliberate no-op: removing permission rows would destroy tenant customizations;
     * the `FEATURE_DOCUMENTS` feature flag is the rollback lever for the feature.
     *
     * @param queryRunner
     */
    async down(queryRunner) {
        console.log(chalk.yellow(this.name + ' reverting changes!'));
    }
}
exports.DocumentsRolePermissionsReload1790000003000 = DocumentsRolePermissionsReload1790000003000;
//# sourceMappingURL=1790000003000-DocumentsRolePermissionsReload.js.map