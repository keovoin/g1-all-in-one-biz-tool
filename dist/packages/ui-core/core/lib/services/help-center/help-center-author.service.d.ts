import { IHelpCenterAuthor, IHelpCenterAuthorCreate, IHelpCenterAuthorFind } from '@gauzy/contracts';
import { HttpClient } from '@angular/common/http';
import * as i0 from "@angular/core";
export declare class HelpCenterAuthorService {
    private http;
    constructor(http: HttpClient);
    createBulk(input: IHelpCenterAuthorCreate): Promise<IHelpCenterAuthor[]>;
    findByArticleId(articleId: string): Promise<IHelpCenterAuthor[]>;
    deleteBulkByArticleId(articleId: string): Promise<any>;
    getAll(relations?: string[], findInput?: IHelpCenterAuthorFind): Promise<{
        items: any[];
        total: number;
    }>;
    static ɵfac: i0.ɵɵFactoryDeclaration<HelpCenterAuthorService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<HelpCenterAuthorService>;
}
