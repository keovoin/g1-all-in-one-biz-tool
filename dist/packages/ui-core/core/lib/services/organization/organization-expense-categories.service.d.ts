import { HttpClient } from '@angular/common/http';
import { IOrganizationExpenseCategoryCreateInput, IOrganizationExpenseCategory, IOrganizationExpenseCategoryFindInput } from '@gauzy/contracts';
import * as i0 from "@angular/core";
export declare class OrganizationExpenseCategoriesService {
    private http;
    constructor(http: HttpClient);
    create(createInput: IOrganizationExpenseCategoryCreateInput): Promise<IOrganizationExpenseCategory>;
    getAll(findInput?: IOrganizationExpenseCategoryFindInput, relations?: string[]): Promise<{
        items: any[];
        total: number;
    }>;
    update(id: string, updateInput: any): Promise<any>;
    delete(id: string): Promise<any>;
    static ɵfac: i0.ɵɵFactoryDeclaration<OrganizationExpenseCategoriesService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<OrganizationExpenseCategoriesService>;
}
