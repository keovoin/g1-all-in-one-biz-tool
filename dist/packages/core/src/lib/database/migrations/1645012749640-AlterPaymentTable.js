"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlterPaymentTable1645012749640 = void 0;
const chalk = require("chalk");
const config_1 = require("@gauzy/config");
class AlterPaymentTable1645012749640 {
    constructor() {
        this.name = 'AlterPaymentTable1645012749640';
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
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "paymentMethod"`);
        await queryRunner.query(`CREATE TYPE "public"."payment_paymentmethod_enum" AS ENUM('BANK_TRANSFER', 'CASH', 'CHEQUE', 'CREDIT_CARD', 'DEBIT', 'ONLINE')`);
        await queryRunner.query(`ALTER TABLE "payment" ADD "paymentMethod" "public"."payment_paymentmethod_enum"`);
    }
    /**
    * PostgresDB Down Migration
    *
    * @param queryRunner
    */
    async postgresDownQueryRunner(queryRunner) {
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "paymentMethod"`);
        await queryRunner.query(`DROP TYPE "public"."payment_paymentmethod_enum"`);
        await queryRunner.query(`ALTER TABLE "payment" ADD "paymentMethod" character varying`);
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
exports.AlterPaymentTable1645012749640 = AlterPaymentTable1645012749640;
//# sourceMappingURL=1645012749640-AlterPaymentTable.js.map