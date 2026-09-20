"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LanguageUtils = void 0;
const faker_1 = require("@faker-js/faker");
const uuid_1 = require("uuid");
const config_1 = require("@gauzy/config");
const contracts_1 = require("@gauzy/contracts");
const all_languages_1 = require("./all-languages");
const language_entity_1 = require("./language.entity");
class LanguageUtils {
    static async addLanguages(queryRunner, languages) {
        for await (const language of languages) {
            const { name, code, is_system, description, color } = language;
            let insertOrUpdateQuery = '';
            let payload;
            switch (queryRunner.dataSource.options.type) {
                case config_1.DatabaseTypeEnum.sqlite:
                case config_1.DatabaseTypeEnum.betterSqlite3:
                    payload = [name, code, is_system ? 1 : 0, description, color];
                    payload.push((0, uuid_1.v4)());
                    console.log('Inserting languages: ', JSON.stringify(payload));
                    insertOrUpdateQuery = `
						INSERT INTO language (name, code, is_system, description, color, id)
						VALUES (?, ?, ?, ?, ?, ?)
						ON CONFLICT (code)
						DO UPDATE SET
							name = EXCLUDED.name,
							is_system = EXCLUDED.is_system,
							description = EXCLUDED.description,
							color = EXCLUDED.color;
					`;
                    break;
                case config_1.DatabaseTypeEnum.postgres:
                    payload = [name, code, is_system, description, color];
                    insertOrUpdateQuery = `
						INSERT INTO language (name, code, is_system, description, color)
						VALUES ($1, $2, $3, $4, $5)
						ON CONFLICT (code)
						DO UPDATE SET
							name = EXCLUDED.name,
							is_system = EXCLUDED.is_system,
							description = EXCLUDED.description,
							color = EXCLUDED.color;
					`;
                    break;
                case config_1.DatabaseTypeEnum.mysql:
                    payload = [name, code, is_system, description, color];
                    insertOrUpdateQuery = `
						INSERT INTO language (name, code, is_system, description, color)
						VALUES (?, ?, ?, ?, ?)
						ON DUPLICATE KEY UPDATE
						name = VALUES(name),
						is_system = VALUES(is_system),
						description = VALUES(description),
						color = VALUES(color);
					`;
                    break;
                default:
                    throw Error(`
						cannot create query to add languages due to unsupported database type: ${queryRunner.dataSource.options.type}
					`);
            }
            await queryRunner.dataSource.manager.query(insertOrUpdateQuery, payload);
        }
    }
    static get registeredLanguages() {
        const systemLanguages = Object.values(contracts_1.LanguagesEnum);
        const languages = [];
        for (const key in all_languages_1.default) {
            if (Object.prototype.hasOwnProperty.call(all_languages_1.default, key)) {
                const { name, nativeName } = all_languages_1.default[key];
                const language = new language_entity_1.Language();
                language.name = name;
                language.code = key;
                language.is_system = systemLanguages.indexOf(key) >= 0;
                language.description = nativeName;
                language.color = faker_1.faker.color.rgb();
                languages.push(language);
            }
        }
        return languages;
    }
    static async migrateLanguages(queryRunner) {
        await this.addLanguages(queryRunner, this.registeredLanguages);
    }
}
exports.LanguageUtils = LanguageUtils;
//# sourceMappingURL=language-utils.js.map