import { IHelpCenterArticle, IHelpCenterArticleUpdate } from '@gauzy/contracts';
import { HttpClient } from '@angular/common/http';
import * as i0 from "@angular/core";
export declare class HelpCenterArticleService {
    private http;
    constructor(http: HttpClient);
    create(createInput: IHelpCenterArticle): Promise<IHelpCenterArticle>;
    findByCategoryId(categoryId: string): Promise<IHelpCenterArticle[]>;
    update(id: string, updateInput: IHelpCenterArticleUpdate): Promise<any>;
    delete(id: string): Promise<any>;
    deleteBulkByCategoryId(categoryId: string): Promise<any>;
    static ɵfac: i0.ɵɵFactoryDeclaration<HelpCenterArticleService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<HelpCenterArticleService>;
}
