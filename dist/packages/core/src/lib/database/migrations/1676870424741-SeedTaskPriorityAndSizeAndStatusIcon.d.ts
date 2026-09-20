import { MigrationInterface, QueryRunner } from "typeorm";
export declare class SeedTaskPriorityAndSizeAndStatusIcon1676870424741 implements MigrationInterface {
    config: Readonly<import("dist/packages/common/src").ApplicationPluginConfig>;
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
     * @param queryRunner
     */
    down(queryRunner: QueryRunner): Promise<void>;
    /**
     * Seeds task status icons and colors in an SQLite database.
     *
     * This function updates the `task_status` table with predefined global statuses (`DEFAULT_GLOBAL_STATUSES`),
     * setting `icon` and `color` fields where the `name` and `value` match, and both `tenantId` and `organizationId` are `NULL`.
     * It also copies the respective icon files to the specified public directory.
     *
     * @param {QueryRunner} queryRunner - The QueryRunner instance for executing database queries.
     * @returns {Promise<void>} - Resolves when the seeding operation is complete.
     */
    sqliteSeedTaskStatusIcon(queryRunner: QueryRunner): Promise<void>;
    /**
     * Seeds task priority icons and colors in an SQLite database.
     *
     * This function updates the `task_priority` table with predefined global priorities (`DEFAULT_GLOBAL_PRIORITIES`),
     * setting `icon` and `color` fields where the `name` and `value` match, and both `tenantId` and `organizationId` are `NULL`.
     * It also copies the respective icon files to the specified public directory.
     *
     * @param {QueryRunner} queryRunner - The QueryRunner instance for executing database queries.
     * @returns {Promise<void>} - Resolves when the seeding operation is complete.
     */
    sqliteSeedTaskPriorityIcon(queryRunner: QueryRunner): Promise<void>;
    /**
     * Seeds task size icons and colors in an SQLite database.
     *
     * This function updates the `task_size` table with predefined global sizes (`DEFAULT_GLOBAL_SIZES`),
     * setting the `icon` and `color` fields for records where the `name` and `value` match and
     * both `tenantId` and `organizationId` are `NULL`. It also copies the respective icon files
     * to the specified public directory.
     *
     * @param {QueryRunner} queryRunner - The QueryRunner instance for executing database queries.
     * @returns {Promise<void>} - Resolves when the seeding operation is complete.
     */
    sqliteSeedTaskSizeIcon(queryRunner: QueryRunner): Promise<void>;
    /**
     * Seeds task status icons and colors in a PostgreSQL database.
     *
     * This function updates the `task_status` table with predefined global statuses (`DEFAULT_GLOBAL_STATUSES`),
     * setting `icon` and `color` fields for records where the `name` and `value` match, and both `tenantId`
     * and `organizationId` are `NULL`. It also copies the respective icon files to the specified public directory.
     *
     * @param {QueryRunner} queryRunner - The QueryRunner instance for executing database queries.
     * @returns {Promise<void>} - Resolves when the seeding operation is complete.
     */
    postgresSeedTaskStatusIcon(queryRunner: QueryRunner): Promise<void>;
    /**
     * Seeds task priority icons and colors in a PostgreSQL database.
     *
     * This function updates the `task_priority` table with predefined global priorities (`DEFAULT_GLOBAL_PRIORITIES`),
     * setting `icon` and `color` fields for records where the `name` and `value` match and both `tenantId` and `organizationId` are `NULL`.
     * Additionally, it copies the corresponding icon files to the specified public directory.
     *
     * @param {QueryRunner} queryRunner - The QueryRunner instance used to execute queries within a transaction.
     * @returns {Promise<void>} - Resolves when the seeding operation is complete.
     */
    postgresSeedTaskPriorityIcon(queryRunner: QueryRunner): Promise<void>;
    /**
     * Seeds task size icons and colors in a PostgreSQL database.
     *
     * This function updates the `task_size` table with predefined global sizes (`DEFAULT_GLOBAL_SIZES`),
     * setting the `icon` and `color` fields for records where the `name` and `value` match,
     * and both `tenantId` and `organizationId` are `NULL`. Additionally, it copies the respective
     * icon files to the specified public directory.
     *
     * @param {QueryRunner} queryRunner - The QueryRunner instance used to execute queries within a transaction.
     * @returns {Promise<void>} - Resolves when the seeding process is complete.
     */
    postgresSeedTaskSizeIcon(queryRunner: QueryRunner): Promise<void>;
    /**
     *
     * @param queryRunner
     */
    mysqlSeedTaskStatusIcon(queryRunner: QueryRunner): Promise<void>;
    /**
     *
     * @param queryRunner
     */
    mysqlSeedTaskPriorityIcon(queryRunner: QueryRunner): Promise<void>;
    /**
     *
     * @param queryRunner
     */
    mysqlSeedTaskSizeIcon(queryRunner: QueryRunner): Promise<void>;
}
