import { DataSource } from 'typeorm';
import { ILanguage } from '@gauzy/contracts';
/**
 * Seeds the database with a list of supported languages.
 *
 * Iterates over all defined languages and populates each with:
 * - name
 * - ISO code
 * - system flag (if part of `LanguagesEnum`)
 * - default empty description
 * - randomly generated color
 *
 * Saves the language records to the provided TypeORM `DataSource` and returns them.
 *
 * @param dataSource - The TypeORM DataSource to access the database.
 * @returns A Promise resolving to an array of saved `ILanguage` entities.
 */
export declare const createLanguages: (dataSource: DataSource) => Promise<ILanguage[]>;
