import { QueryRunner } from 'typeorm';
import { EmailTemplateEnum } from '@gauzy/contracts';
import { DatabaseTypeEnum } from '@gauzy/config';
/**
 * Email templates utils functions.
 */
export declare class EmailTemplateUtils {
    private static readonly supportedDatabaseTypes;
    static globalPath: string[];
    /**
     * Migrate email templates for a specific folder
     *
     * @param queryRunner QueryRunner instance to run database queries.
     * @param folder Folder enum indicating the email template category.
     */
    static migrateEmailTemplates(queryRunner: QueryRunner, folder: EmailTemplateEnum): Promise<void>;
    /**
     * Recursively reads files from a directory and adds them to the files array.
     *
     * @param directory The directory to read from.
     * @param files The array that will hold file paths.
     */
    static readdirSync(directory: string, files?: string[]): void;
    /**
     * Checks whether a file path exists.
     *
     * @param filePath The path to check.
     * @returns true if the file or directory exists, false otherwise.
     */
    static fileExists(filePath: string): boolean;
    /**
     * Converts a file path to an email template object.
     *
     * @param path The file path to convert.
     * @returns The template object or undefined if the conversion fails.
     */
    static pathToTemplate(filePath: string): Record<string, any> | undefined;
    /**
     * Convert multiple file paths to email templates.
     *
     * @param files Array of file paths.
     * @returns Array of template objects.
     */
    static filesToTemplates(files?: string[]): Array<Record<string, any>>;
    /**
     * Create or update email templates in the database.
     *
     * @param queryRunner - The QueryRunner instance to execute database queries.
     * @param templates - Array of template objects containing template details.
     */
    static createOrUpdateTemplates(queryRunner: QueryRunner, templates?: Array<Record<string, any>>): Promise<void>;
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
    static upsertEmailTemplate(queryRunner: QueryRunner, selectQuery: string, updateQuery: string, insertQuery: string, name: string, languageCode: string, hbs: string, mjml: string, payload: any): Promise<void>;
    /**
     * Generates the appropriate INSERT query based on the database type.
     * @param type - The type of the database.
     * @returns The INSERT SQL query string.
     */
    static generateInsertQuery(type: DatabaseTypeEnum): string;
    /**
     * Generates the appropriate SELECT query based on the database type.
     *
     * @param type - The type of the database.
     * @returns The SELECT SQL query string.
     */
    private static getSelectQuery;
    /**
     * Generates the appropriate UPDATE query based on the database type.
     *
     * @param type - The type of the database.
     * @returns The UPDATE SQL query string.
     */
    private static getUpdateQuery;
    /**
     * Validates the database type.
     *
     * @param type
     */
    private static validateDatabaseType;
}
