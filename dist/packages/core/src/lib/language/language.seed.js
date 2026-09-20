"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLanguages = void 0;
const contracts_1 = require("@gauzy/contracts");
const faker_1 = require("@faker-js/faker");
const language_entity_1 = require("./language.entity");
const all_languages_1 = require("./all-languages");
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
const createLanguages = async (dataSource) => {
    const systemLanguages = Object.values(contracts_1.LanguagesEnum);
    const languages = [];
    for (const key in all_languages_1.default) {
        if (Object.prototype.hasOwnProperty.call(all_languages_1.default, key)) {
            const { name } = all_languages_1.default[key];
            const language = new language_entity_1.Language();
            language.name = name;
            language.code = key;
            language.is_system = systemLanguages.includes(key);
            language.description = '';
            language.color = faker_1.faker.color.rgb();
            languages.push(language);
        }
    }
    try {
        await dataSource.getRepository(language_entity_1.Language).save(languages);
    }
    catch (error) {
        console.error('Error while saving languages', error);
    }
    return languages;
};
exports.createLanguages = createLanguages;
//# sourceMappingURL=language.seed.js.map