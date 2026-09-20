import { HttpClient } from '@angular/common/http';
import { IAccountingTemplateFindInput, IAccountingTemplate } from '@gauzy/contracts';
import * as i0 from "@angular/core";
export declare class AccountingTemplateService {
    private http;
    constructor(http: HttpClient);
    getAll(relations?: string[], where?: IAccountingTemplateFindInput): Promise<{
        items: IAccountingTemplate[];
    }>;
    getById(id: string): Promise<IAccountingTemplate>;
    getTemplate(request?: IAccountingTemplateFindInput): Promise<IAccountingTemplate>;
    generateTemplatePreview(request?: any): Promise<any>;
    saveTemplate(data: any): Promise<any>;
    updateTemplate(id: string, data: any): Promise<any>;
    static ɵfac: i0.ɵɵFactoryDeclaration<AccountingTemplateService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<AccountingTemplateService>;
}
