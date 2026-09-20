import { HttpClient } from '@angular/common/http';
import { IOrganizationLanguageCreateInput, IOrganizationLanguage, IOrganizationLanguageFindInput } from '@gauzy/contracts';
import * as i0 from "@angular/core";
export declare class OrganizationLanguagesService {
    private http;
    constructor(http: HttpClient);
    create(createInput: IOrganizationLanguageCreateInput): Promise<IOrganizationLanguage>;
    getAll(findInput?: IOrganizationLanguageFindInput, relations?: string[]): Promise<{
        items: IOrganizationLanguage[];
        total: number;
    }>;
    update(id: string, updateInput: any): Promise<any>;
    delete(id: string): Promise<any>;
    static ɵfac: i0.ɵɵFactoryDeclaration<OrganizationLanguagesService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<OrganizationLanguagesService>;
}
