"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDefaultReport = void 0;
exports.createRandomTenantOrganizationsReport = createRandomTenantOrganizationsReport;
const chalk = require("chalk");
const path = require("path");
const rimraf = require("rimraf");
const config_1 = require("@gauzy/config");
const internal_1 = require("./../core/entities/internal");
const organization_seed_1 = require("./../organization/organization.seed");
const report_category_entity_1 = require("./report-category.entity");
const report_organization_entity_1 = require("./report-organization.entity");
const report_entity_1 = require("./report.entity");
const core_1 = require("../core");
const utils_1 = require("../core/seeds/utils");
/**
 * Creates default reports and their categories for a tenant.
 *
 * This function initializes default report categories and their associated reports.
 * It cleans up existing reports and images, creates categories, and links them to
 * predefined reports, saving the entire structure in the database.
 *
 * @param {DataSource} dataSource - The database connection or ORM data source.
 * @param {Partial<ApplicationPluginConfig>} config - Configuration for handling assets.
 * @param {ITenant} tenant - The tenant for which reports are being created.
 * @returns {Promise<IReport[]>} - A promise resolving to the list of created reports.
 */
const createDefaultReport = async (dataSource, config, tenant) => {
    // Clean up existing reports and categories
    await cleanReport(dataSource, config);
    // Define default categories
    const defaultCategories = [
        new report_category_entity_1.ReportCategory({ name: 'Time Tracking', iconClass: 'fa-clock' }),
        new report_category_entity_1.ReportCategory({ name: 'Payments', iconClass: 'fa-credit-card' }),
        new report_category_entity_1.ReportCategory({ name: 'Time Off', iconClass: 'fa-stopwatch' }),
        new report_category_entity_1.ReportCategory({ name: 'Invoicing', iconClass: 'fa-file-invoice-dollar' })
    ];
    // Save categories in the database
    await dataSource.manager.save(defaultCategories);
    // Map categories by name for easier assignment
    const categoryByName = Object.fromEntries(defaultCategories.map((cat) => [cat.name, cat]));
    // Define default reports
    const reports = [
        new report_entity_1.Report({
            name: 'Time & Activity',
            slug: 'time-activity',
            image: (0, utils_1.copyAssets)('time-activity.png', config, 'reports'),
            category: categoryByName['Time Tracking'],
            showInMenu: true,
            iconClass: 'far fa-clock',
            description: "See team members' time worked, activity levels, and amounts earned per project or task"
        }),
        new report_entity_1.Report({
            name: 'Weekly',
            slug: 'weekly',
            image: (0, utils_1.copyAssets)('weekly.png', config, 'reports'),
            category: categoryByName['Time Tracking'],
            iconClass: 'fas fa-calendar-alt',
            showInMenu: true,
            description: "See team members' time worked, activity levels, and amount earned per week"
        }),
        new report_entity_1.Report({
            name: 'Apps & URLs',
            slug: 'apps-urls',
            image: (0, utils_1.copyAssets)('apps-urls.png', config, 'reports'),
            category: categoryByName['Time Tracking'],
            iconClass: 'far fa-window-maximize',
            description: "See team members' apps used and URLs visited while working"
        }),
        new report_entity_1.Report({
            name: 'Manual time edits',
            slug: 'manual-time-edits',
            image: (0, utils_1.copyAssets)('manual-time-edits.png', config, 'reports'),
            category: categoryByName['Time Tracking'],
            iconClass: 'far fa-window-maximize',
            description: "See team members' time worked, project, task, and reason for each manual time entry"
        }),
        new report_entity_1.Report({
            name: 'Expense',
            slug: 'expense',
            image: (0, utils_1.copyAssets)('expense.png', config, 'reports'),
            category: categoryByName['Time Tracking'],
            iconClass: 'far fa-credit-card',
            description: 'See how much has been spent on expenses by member and project.'
        }),
        new report_entity_1.Report({
            name: 'Amounts owed',
            slug: 'amounts-owed',
            image: (0, utils_1.copyAssets)('amounts-owed.png', config, 'reports'),
            category: categoryByName['Payments'],
            iconClass: 'far fa-credit-card',
            description: 'See how much team members are currently owed'
        }),
        new report_entity_1.Report({
            name: 'Payments',
            slug: 'payments',
            image: (0, utils_1.copyAssets)('payments.png', config, 'reports'),
            category: categoryByName['Payments'],
            iconClass: 'far fa-credit-card',
            description: 'See how much team members were paid over a given period'
        }),
        new report_entity_1.Report({
            name: 'Weekly limits',
            slug: 'weekly-limits',
            image: (0, utils_1.copyAssets)('blank.png', config, 'reports'),
            category: categoryByName['Time Off'],
            iconClass: 'far fa-clock',
            description: "See team members' weekly limits usage"
        }),
        new report_entity_1.Report({
            name: 'Daily limits',
            slug: 'daily-limits',
            image: (0, utils_1.copyAssets)('blank.png', config, 'reports'),
            category: categoryByName['Time Off'],
            iconClass: 'far fa-clock',
            description: "See team members' daily limits usage"
        }),
        new report_entity_1.Report({
            name: 'Project budgets',
            slug: 'project-budgets',
            image: (0, utils_1.copyAssets)('blank.png', config, 'reports'),
            category: categoryByName['Invoicing'],
            iconClass: 'far fa-credit-card',
            description: "See how much of your projects' budgets have been spent"
        }),
        new report_entity_1.Report({
            name: 'Client budgets',
            slug: 'client-budgets',
            image: (0, utils_1.copyAssets)('blank.png', config, 'reports'),
            category: categoryByName['Invoicing'],
            iconClass: 'far fa-credit-card',
            description: "See how much of your clients' budgets have been spent"
        })
    ];
    // Save reports in the database
    await dataSource.manager.save(reports);
    // Link reports to the tenant
    await createDefaultOrganizationsReport(dataSource, reports, tenant);
    return reports;
};
exports.createDefaultReport = createDefaultReport;
/**
 * Cleans up the `report` and `report_category` tables and deletes associated report images.
 *
 * This function performs a database cleanup for the report-related tables based on the database type
 * specified in the configuration. It also removes old report-related images from the designated directory.
 *
 * @param {DataSource} dataSource - The database connection or ORM data source.
 * @param {Partial<ApplicationPluginConfig>} config - Configuration for the application, including database options.
 * @returns {Promise<void>} - Resolves when the cleanup operation is complete.
 */
async function cleanReport(dataSource, config) {
    const report = dataSource.getRepository(report_entity_1.Report).metadata.tableName;
    const reportCategory = dataSource.getRepository(report_category_entity_1.ReportCategory).metadata.tableName;
    const dbType = config.dbConnectionOptions.type;
    switch (dbType) {
        case config_1.DatabaseTypeEnum.sqlite:
        case config_1.DatabaseTypeEnum.betterSqlite3:
            await dataSource.query(`DELETE FROM ${reportCategory}`);
            await dataSource.query(`DELETE FROM ${report}`);
            break;
        case config_1.DatabaseTypeEnum.postgres:
            await dataSource.query(`TRUNCATE TABLE ${report}, ${reportCategory} RESTART IDENTITY CASCADE`);
            break;
        case config_1.DatabaseTypeEnum.mysql:
            // -- disable foreign_key_checks to avoid query failing when there is a foreign key in the table
            await dataSource.query('SET foreign_key_checks = 0;');
            await dataSource.query(`DELETE FROM ${reportCategory}`);
            await dataSource.query(`DELETE FROM ${report}`);
            await dataSource.query('SET foreign_key_checks = 1;');
            break;
        default:
            throw Error(`cannot clean report, report_category tables due to unsupported database type: ${dbType}`);
    }
    console.log(chalk.green(`CLEANING UP REPORT IMAGES...`));
    await new Promise((resolve, reject) => {
        // Determine directories based on environment
        const isElectron = config_1.environment.isElectron;
        // Default public directory for assets
        const publicDir = (0, core_1.getApiPublicPath)();
        // Determine the base directory for assets
        const dir = isElectron
            ? path.resolve(config_1.environment.gauzyUserPath, 'public/reports')
            : path.resolve(config.assetOptions?.assetPublicPath || publicDir, 'reports'); // Custom public directory path from configuration.
        console.log('Report Cleaner -> assetPublicPath: ' + dir);
        // delete old generated report image
        rimraf(`${dir}/!(rimraf|.gitkeep)`, () => {
            console.log(chalk.green(`CLEANED UP REPORT IMAGES`));
            resolve(null);
        }, () => {
            reject(null);
        });
    });
}
/**
 * Creates default report-to-organization associations for a tenant.
 *
 * This function associates all default reports with all organizations belonging to a specific tenant.
 *
 * @param {DataSource} dataSource - The database connection or ORM data source.
 * @param {IReport[]} reports - The list of reports to associate with organizations.
 * @param {ITenant} tenant - The tenant for which associations are created.
 * @returns {Promise<IReportOrganization[]>} - A promise resolving to the list of saved report-to-organization associations.
 */
async function createDefaultOrganizationsReport(dataSource, reports, tenant) {
    const organizations = await (0, organization_seed_1.getDefaultOrganizations)(dataSource, tenant);
    const reportOrganizations = organizations.flatMap((organization) => reports.map((report) => new report_organization_entity_1.ReportOrganization({
        report,
        organization,
        tenant
    })));
    return await dataSource.manager.save(reportOrganizations);
}
/**
 * Creates random report-to-organization associations for multiple tenants.
 *
 * This function associates all existing reports with organizations belonging to multiple tenants.
 *
 * @param {DataSource} dataSource - The database connection or ORM data source.
 * @param {ITenant[]} tenants - A list of tenants for which associations are created.
 * @returns {Promise<void>} - Resolves when the associations are saved.
 */
async function createRandomTenantOrganizationsReport(dataSource, tenants) {
    try {
        // Fetch all existing reports
        const reports = await dataSource.manager.find(report_entity_1.Report);
        for (const tenant of tenants) {
            const organizations = await dataSource.getRepository(internal_1.Organization).find({
                where: { tenantId: tenant.id }
            });
            // Generate report-to-organization associations
            const reportOrganizations = organizations.flatMap((organization) => reports.map((report) => new report_organization_entity_1.ReportOrganization({
                report,
                organization,
                tenant
            })));
            // Save the associations
            await dataSource.manager.save(reportOrganizations);
        }
    }
    catch (error) {
        console.log(chalk.red(`Error seeding random reports:`, error));
    }
}
//# sourceMappingURL=report.seed.js.map