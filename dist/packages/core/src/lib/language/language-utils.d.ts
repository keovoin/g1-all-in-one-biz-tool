import { QueryRunner } from 'typeorm';
import { ILanguage } from '@gauzy/contracts';
export declare class LanguageUtils {
    private static addLanguages;
    static get registeredLanguages(): ILanguage[];
    static migrateLanguages(queryRunner: QueryRunner): Promise<void>;
}
