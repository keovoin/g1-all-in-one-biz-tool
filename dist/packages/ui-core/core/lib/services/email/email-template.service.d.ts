import { HttpClient } from '@angular/common/http';
import { IEmailTemplate, IEmailTemplateFindInput, ICustomizeEmailTemplateFindInput, ICustomizableEmailTemplate, IEmailTemplateSaveInput, IPagination } from '@gauzy/contracts';
import * as i0 from "@angular/core";
export declare class EmailTemplateService {
    private http;
    constructor(http: HttpClient);
    getAll(where: IEmailTemplateFindInput): Promise<IPagination<IEmailTemplate>>;
    getTemplate(where?: ICustomizeEmailTemplateFindInput): Promise<ICustomizableEmailTemplate>;
    generateTemplatePreview(data: string): Promise<{
        html: string;
    }>;
    saveEmailTemplate(data: IEmailTemplateSaveInput): Promise<IEmailTemplate>;
    static ɵfac: i0.ɵɵFactoryDeclaration<EmailTemplateService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<EmailTemplateService>;
}
