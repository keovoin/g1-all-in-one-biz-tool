"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeedChangeLogFeature1654675304373 = void 0;
const chalk = require("chalk");
const uuid_1 = require("uuid");
const config_1 = require("@gauzy/config");
class SeedChangeLogFeature1654675304373 {
    constructor() {
        this.name = 'SeedChangeLogFeature1654675304373';
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
    async sqliteUpQueryRunner(queryRunner) {
        console.log(chalk.yellow(this.name + ' start running!'));
        const date = Date.now();
        const features = [
            {
                icon: 'cube-outline',
                title: 'New CRM',
                date,
                isFeature: 1,
                content: 'Now you can read latest features changelog directly in Gauzy',
                learnMoreUrl: '',
                imageUrl: 'assets/images/features/macbook-2.png'
            },
            {
                icon: 'globe-outline',
                title: 'Most popular in 20 countries',
                date,
                isFeature: 1,
                content: 'Europe, Americas and Asia get choice',
                learnMoreUrl: '',
                imageUrl: 'assets/images/features/macbook-1.png'
            },
            {
                icon: 'flash-outline',
                title: 'Visit our website',
                date,
                isFeature: 1,
                content: 'You are welcome to check more information about the platform at our official website.',
                learnMoreUrl: '',
                imageUrl: ''
            }
        ];
        try {
            for await (const feature of features) {
                const payload = Object.values(feature);
                payload.push((0, uuid_1.v4)());
                await queryRunner.connection.manager.query(`
					INSERT INTO "changelog" ("icon", "title", "date", "isFeature", "content", "learnMoreUrl", "imageUrl", "id") VALUES(?, ?, ?, ?, ?, ?, ?, ?)`, payload);
            }
        }
        catch (error) {
            // since we have errors let's rollback changes we made
            console.log('Error while insert changelog changes in production server', error);
        }
    }
    async sqliteDownQueryRunner(queryRunner) { }
    async postgresUpQueryRunner(queryRunner) {
        console.log(chalk.yellow(this.name + ' start running!'));
        const date = new Date();
        const features = [
            {
                icon: 'cube-outline',
                title: 'New CRM',
                date,
                isFeature: true,
                content: 'Now you can read latest features changelog directly in Gauzy',
                learnMoreUrl: '',
                imageUrl: 'assets/images/features/macbook-2.png'
            },
            {
                icon: 'globe-outline',
                title: 'Most popular in 20 countries',
                date,
                isFeature: true,
                content: 'Europe, Americas and Asia get choice',
                learnMoreUrl: '',
                imageUrl: 'assets/images/features/macbook-1.png'
            },
            {
                icon: 'flash-outline',
                title: 'Visit our website',
                date,
                isFeature: true,
                content: 'You are welcome to check more information about the platform at our official website.',
                learnMoreUrl: '',
                imageUrl: ''
            }
        ];
        try {
            for await (const feature of features) {
                const payload = Object.values(feature);
                await queryRunner.connection.manager.query(`
					INSERT INTO "changelog" ("icon", "title", "date", "isFeature", "content", "learnMoreUrl", "imageUrl") VALUES($1, $2, $3, $4, $5, $6, $7)`, payload);
            }
        }
        catch (error) {
            // since we have errors let's rollback changes we made
            console.log('Error while insert changelog changes in production server', error);
        }
    }
    async postgresDownQueryRunner(queryRunner) { }
    /**
     * MySQL Up Migration
     *
     * @param queryRunner
     */
    async mysqlUpQueryRunner(queryRunner) { }
    /**
     * MySQL Down Migration
     *
     * @param queryRunner
     */
    async mysqlDownQueryRunner(queryRunner) { }
}
exports.SeedChangeLogFeature1654675304373 = SeedChangeLogFeature1654675304373;
//# sourceMappingURL=1654675304373-SeedChangeLogFeature.js.map