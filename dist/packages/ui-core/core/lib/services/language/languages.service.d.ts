import { HttpClient } from '@angular/common/http';
import { ID, ILanguage } from '@gauzy/contracts';
import * as i0 from "@angular/core";
export declare class LanguagesService {
    private http;
    constructor(http: HttpClient);
    insertLanguage(createLanguage: ILanguage): Promise<ILanguage>;
    getAllLanguages(): Promise<{
        items: ILanguage[];
    }>;
    getSystemLanguages(): Promise<{
        items: ILanguage[];
    }>;
    delete(id: ID): Promise<any>;
    update(id: ID, updateInput: ILanguage): Promise<Object>;
    findByName(name: string): Promise<{
        item: ILanguage;
    }>;
    static ɵfac: i0.ɵɵFactoryDeclaration<LanguagesService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<LanguagesService>;
}
