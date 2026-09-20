import { MigrationInterface, QueryRunner } from 'typeorm';
export declare class RolePermissionsReload1783682223985 implements MigrationInterface {
    name: string;
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
    up(queryRunner: QueryRunner): Promise<void>;
    /**
     * Down Migration
     *
     * @param queryRunner
     */
    down(queryRunner: QueryRunner): Promise<void>;
}
