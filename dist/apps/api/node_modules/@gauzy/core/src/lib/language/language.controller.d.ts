import { ILanguage, IPagination } from '@gauzy/contracts';
import { LanguageService } from './language.service';
export declare class LanguageController {
    private readonly languageService;
    constructor(languageService: LanguageService);
    findAll(query: any): Promise<IPagination<ILanguage>>;
    findByName(name: string): Promise<ILanguage>;
}
