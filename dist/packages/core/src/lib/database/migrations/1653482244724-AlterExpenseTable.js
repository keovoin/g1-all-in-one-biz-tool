"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlterExpenseTable1653482244724 = void 0;
const chalk = require("chalk");
const config_1 = require("@gauzy/config");
class AlterExpenseTable1653482244724 {
    constructor() {
        this.name = 'AlterExpenseTable1653482244724';
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
    /**
    * PostgresDB Up Migration
    *
    * @param queryRunner
    */
    async postgresUpQueryRunner(queryRunner) {
        await queryRunner.query(`ALTER TABLE "expense" DROP CONSTRAINT "FK_eacb116ab0521ad9b96f2bb53ba"`);
        await queryRunner.query(`ALTER TABLE "expense" DROP CONSTRAINT "FK_42eea5debc63f4d1bf89881c10a"`);
        await queryRunner.query(`ALTER TABLE "expense" DROP COLUMN "status"`);
        await queryRunner.query(`CREATE TYPE "public"."expense_status_enum" AS ENUM('INVOICED', 'UNINVOICED', 'PAID', 'NOT_BILLABLE')`);
        await queryRunner.query(`ALTER TABLE "expense" ADD "status" "public"."expense_status_enum"`);
        await queryRunner.query(`ALTER TABLE "expense" ALTER COLUMN "vendorId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "expense" ALTER COLUMN "categoryId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "organization_project" ALTER COLUMN "membersCount" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "expense" ADD CONSTRAINT "FK_eacb116ab0521ad9b96f2bb53ba" FOREIGN KEY ("vendorId") REFERENCES "organization_vendor"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "expense" ADD CONSTRAINT "FK_42eea5debc63f4d1bf89881c10a" FOREIGN KEY ("categoryId") REFERENCES "expense_category"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }
    /**
    * PostgresDB Down Migration
    *
    * @param queryRunner
    */
    async postgresDownQueryRunner(queryRunner) {
        await queryRunner.query(`ALTER TABLE "expense" DROP CONSTRAINT "FK_42eea5debc63f4d1bf89881c10a"`);
        await queryRunner.query(`ALTER TABLE "expense" DROP CONSTRAINT "FK_eacb116ab0521ad9b96f2bb53ba"`);
        await queryRunner.query(`ALTER TABLE "organization_project" ALTER COLUMN "membersCount" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "expense" ALTER COLUMN "categoryId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "expense" ALTER COLUMN "vendorId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "expense" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."expense_status_enum"`);
        await queryRunner.query(`ALTER TABLE "expense" ADD "status" character varying`);
        await queryRunner.query(`ALTER TABLE "expense" ADD CONSTRAINT "FK_42eea5debc63f4d1bf89881c10a" FOREIGN KEY ("categoryId") REFERENCES "expense_category"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "expense" ADD CONSTRAINT "FK_eacb116ab0521ad9b96f2bb53ba" FOREIGN KEY ("vendorId") REFERENCES "organization_vendor"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }
    /**
     * SqliteDB Up Migration
     *
     * @param queryRunner
     */
    async sqliteUpQueryRunner(queryRunner) { }
    /**
     * SqliteDB Down Migration
     *
     * @param queryRunner
     */
    async sqliteDownQueryRunner(queryRunner) { }
    /**
     * MySQL Up Migration
     *
     * @param queryRunner
     */
    async mysqlUpQueryRunner(queryRunner) {
    }
    /**
     * MySQL Down Migration
     *
     * @param queryRunner
     */
    async mysqlDownQueryRunner(queryRunner) {
    }
}
exports.AlterExpenseTable1653482244724 = AlterExpenseTable1653482244724;
//# sourceMappingURL=1653482244724-AlterExpenseTable.js.map