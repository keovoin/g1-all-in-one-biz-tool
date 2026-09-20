"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailTemplateUtils = void 0;
const fs = require("fs");
const path = require("path");
const mjml2html = require("mjml");
const uuid_1 = require("uuid");
const chalk = require("chalk");
const moment = require("moment");
const utils_1 = require("@gauzy/utils");
const config_1 = require("@gauzy/config");
const utils_2 = require("../core/utils");
const database_helper_1 = require("../database/database.helper");
/**
 * Email templates utils functions.
 */
class EmailTemplateUtils {
    /**
     * Migrate email templates for a specific folder
     *
     * @param queryRunner QueryRunner instance to run database queries.
     * @param folder Folder enum indicating the email template category.
     */
    static async migrateEmailTemplates(queryRunner, folder) {
        // Return early if folder is empty
        if ((0, utils_1.isEmpty)(folder))
            return;
        // Define the template path
        const templatePath = path.join(__dirname, '../', ...EmailTemplateUtils.globalPath);
        // Check if the template path exists
        if (!EmailTemplateUtils.fileExists(templatePath))
            return;
        // Define folder path and prepare file list
        const folderPath = path.join(templatePath, folder);
        const files = [];
        // Read directory to collect files
        EmailTemplateUtils.readdirSync(folderPath, files);
        // Proceed only if there are files to migrate
        if (files.length > 0) {
            // Convert files to template objects
            const templates = EmailTemplateUtils.filesToTemplates(files);
            // Create or update the templates in the database
            await EmailTemplateUtils.createOrUpdateTemplates(queryRunner, templates);
            // Log the migration completion
            console.log(chalk.magenta(`${moment().format('DD.MM.YYYY HH:mm:ss')} Migrated email templates for ${folderPath}`));
        }
    }
    /**
     * Recursively reads files from a directory and adds them to the files array.
     *
     * @param directory The directory to read from.
     * @param files The array that will hold file paths.
     */
    static readdirSync(directory, files = []) {
        // Check if the directory exists
        if (!EmailTemplateUtils.fileExists(directory)) {
            return;
        }
        const items = fs.readdirSync(directory);
        for (const item of items) {
            const filePath = path.join(directory, item);
            // Proceed only if the file path exists
            if (EmailTemplateUtils.fileExists(filePath)) {
                const fileStat = fs.lstatSync(filePath);
                // Recursively read the directory
                if (fileStat.isDirectory()) {
                    EmailTemplateUtils.readdirSync(filePath, files);
                }
                else {
                    files.push(filePath);
                }
            }
        }
    }
    /**
     * Checks whether a file path exists.
     *
     * @param filePath The path to check.
     * @returns true if the file or directory exists, false otherwise.
     */
    static fileExists(filePath) {
        try {
            return fs.existsSync(filePath);
        }
        catch (error) {
            console.error(`Error checking file existence for path: ${filePath}`, error);
            return false;
        }
    }
    /**
     * Converts a file path to an email template object.
     *
     * @param path The file path to convert.
     * @returns The template object or undefined if the conversion fails.
     */
    static pathToTemplate(filePath) {
        try {
            const template = {};
            const normalizedPath = filePath.replace(/\\/g, '/');
            const pathSegments = normalizedPath.split('/');
            // Extract filename and extension from the last segment
            const [filename, extension] = pathSegments.pop()?.split('.', 2) || [];
            if (!filename || !extension) {
                console.warn(`Invalid file structure: ${filePath}`);
                return;
            }
            // Extract language code and template name
            template['languageCode'] = pathSegments.pop();
            template['name'] = `${pathSegments.pop()}/${filename}`;
            // Read the file content
            const fileContent = fs.readFileSync(filePath, 'utf8');
            // Handle the file based on its extension
            switch (extension) {
                case 'mjml':
                    template['mjml'] = fileContent;
                    template['hbs'] = mjml2html(fileContent).html;
                    break;
                case 'hbs':
                    template['hbs'] = fileContent;
                    break;
                default:
                    console.warn(`Unsupported file extension: ${filePath}. Only .hbs and .mjml are supported!`);
                    return;
            }
            // Ensure the template has compiled 'hbs' content
            if (!template['hbs']) {
                console.warn(`Missing 'hbs' content for template: ${filePath}`);
                return;
            }
            return template;
        }
        catch (error) {
            console.error(`Error converting file path to template: ${filePath}`, error);
            return;
        }
    }
    /**
     * Convert multiple file paths to email templates.
     *
     * @param files Array of file paths.
     * @returns Array of template objects.
     */
    static filesToTemplates(files = []) {
        const templates = [];
        for (const file of files) {
            const template = EmailTemplateUtils.pathToTemplate(file);
            // Only add the template if it was successfully created
            if (template) {
                templates.push(template);
            }
        }
        return templates;
    }
    /**
     * Create or update email templates in the database.
     *
     * @param queryRunner - The QueryRunner instance to execute database queries.
     * @param templates - Array of template objects containing template details.
     */
    static async createOrUpdateTemplates(queryRunner, templates = []) {
        // Get the database type
        const type = queryRunner.dataSource.options.type;
        // Validate the database type
        EmailTemplateUtils.validateDatabaseType(queryRunner.dataSource.options.type);
        // Determine select query based on the database type
        const selectQuery = this.getSelectQuery(type);
        // Determine update query based on the database type
        const updateQuery = this.getUpdateQuery(type);
        // Determine insert query based on the database type
        const insertQuery = this.generateInsertQuery(type);
        // Define a set of database types that require the 'id' column in the INSERT query
        const sqlTypesWithId = new Set([
            config_1.DatabaseTypeEnum.sqlite,
            config_1.DatabaseTypeEnum.betterSqlite3,
            config_1.DatabaseTypeEnum.mysql
        ]);
        // Loop through the templates
        for (const template of templates) {
            const payload = sqlTypesWithId.has(type)
                ? [template.name, template.languageCode, template.hbs, template.mjml, (0, uuid_1.v4)()]
                : [template.name, template.languageCode, template.hbs, template.mjml];
            await this.upsertEmailTemplate(queryRunner, selectQuery, updateQuery, insertQuery, template.name, template.languageCode, template.hbs, template.mjml, payload);
        }
    }
    /**
     * Upsert an email template based on its existence in the database.
     *
     * @param queryRunner - The QueryRunner instance for executing queries.
     * @param type - The type of the database (e.g., sqlite, mysql).
     * @param selectQuery - The SQL query to check if the template exists.
     * @param updateQuery - The SQL query to update the template.
     * @param insertQuery - The SQL query to insert a new template.
     * @param name - The name of the email template.
     * @param languageCode - The language code of the email template.
     * @param hbs - The Handlebars (hbs) content of the template.
     * @param mjml - The MJML content of the template.
     * @param payload - The payload for the insert query, including necessary fields.
     */
    static async upsertEmailTemplate(queryRunner, selectQuery, updateQuery, insertQuery, name, languageCode, hbs, mjml, payload) {
        // Get the database manager
        const manager = queryRunner.dataSource.manager;
        try {
            // Execute the SELECT query to check if the template exists
            const [template] = await manager.query(selectQuery, [name, languageCode]);
            // Safely parse the count value
            const templateCount = Number(template.count);
            if (templateCount > 0) {
                // Execute the UPDATE query if the template exists
                await manager.query(updateQuery, [hbs, mjml, name, languageCode]);
                console.log(`✅ Updated email template: ${name}`);
            }
            else {
                // Execute the INSERT query if the template does not exist
                await manager.query(insertQuery, payload);
                console.log(`✅ Inserted email template: ${name}`);
            }
        }
        catch (error) {
            console.error(`❌ Error upsert email template "${name}":`, error);
        }
    }
    /**
     * Generates the appropriate INSERT query based on the database type.
     * @param type - The type of the database.
     * @returns The INSERT SQL query string.
     */
    static generateInsertQuery(type) {
        // Define a set of database types that require the 'id' column in the INSERT query
        const sqlTypesWithId = new Set([
            config_1.DatabaseTypeEnum.sqlite,
            config_1.DatabaseTypeEnum.betterSqlite3,
            config_1.DatabaseTypeEnum.mysql
        ]);
        const baseColumns = ['name', 'languageCode', 'hbs', 'mjml'];
        const requiresId = sqlTypesWithId.has(type);
        const columns = requiresId ? [...baseColumns, 'id'] : baseColumns;
        const placeholders = requiresId
            ? columns.map(() => '?').join(', ')
            : columns.map((_, index) => `$${index + 1}`).join(', ');
        const columnsString = columns.map((col) => `"${col}"`).join(', ');
        const query = `INSERT INTO "email_template" (${columnsString}) VALUES(${placeholders})`;
        return (0, utils_2.replacePlaceholders)((0, database_helper_1.prepareSQLQuery)(query), type);
    }
    /**
     * Generates the appropriate SELECT query based on the database type.
     *
     * @param type - The type of the database.
     * @returns The SELECT SQL query string.
     */
    static getSelectQuery(type) {
        // Prepare the select query
        const query = `SELECT COUNT(*) as count FROM "email_template" WHERE "name" = $1 AND "languageCode" = $2 AND "tenantId" IS NULL AND "organizationId" IS NULL`;
        // Replace $ placeholders with ? for mysql, sqlite & better-sqlite3
        return (0, utils_2.replacePlaceholders)((0, database_helper_1.prepareSQLQuery)(query), type);
    }
    /**
     * Generates the appropriate UPDATE query based on the database type.
     *
     * @param type - The type of the database.
     * @returns The UPDATE SQL query string.
     */
    static getUpdateQuery(type) {
        // Prepare the select query
        const query = `UPDATE "email_template" SET "hbs" = $1, "mjml" = $2 WHERE "name" = $3 AND "languageCode" = $4 AND "tenantId" IS NULL AND "organizationId" IS NULL`;
        // Replace $ placeholders with ? for mysql, sqlite & better-sqlite3
        return (0, utils_2.replacePlaceholders)((0, database_helper_1.prepareSQLQuery)(query), type);
    }
    /**
     * Validates the database type.
     *
     * @param type
     */
    static validateDatabaseType(type) {
        if (!EmailTemplateUtils.supportedDatabaseTypes.has(type)) {
            throw new Error(`Unsupported database: ${type}`);
        }
    }
}
exports.EmailTemplateUtils = EmailTemplateUtils;
EmailTemplateUtils.supportedDatabaseTypes = new Set([
    config_1.DatabaseTypeEnum.sqlite,
    config_1.DatabaseTypeEnum.betterSqlite3,
    config_1.DatabaseTypeEnum.postgres,
    config_1.DatabaseTypeEnum.mysql
]);
EmailTemplateUtils.globalPath = ['core', 'seeds', 'data', 'default-email-templates'];
//# sourceMappingURL=utils.js.map