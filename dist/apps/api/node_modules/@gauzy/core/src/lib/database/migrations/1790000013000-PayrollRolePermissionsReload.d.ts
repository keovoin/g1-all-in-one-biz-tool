import { MigrationInterface, QueryRunner } from 'typeorm';
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
export declare class PayrollRolePermissionsReload1790000013000 implements MigrationInterface {
    name: string;
    /**
     * Up Migration
     *
     * @param queryRunner
     */
    up(queryRunner: QueryRunner): Promise<void>;
    /**
     * Down Migration
     *
     * Deliberate no-op: removing permission rows would destroy tenant customizations, and the
     * payroll endpoints are inaccessible without the grants anyway.
     *
     * @param queryRunner
     */
    down(queryRunner: QueryRunner): Promise<void>;
}
