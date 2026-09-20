import { IHelpCenter, IHelpCenterFind } from '@gauzy/contracts';
import { HttpClient } from '@angular/common/http';
import * as i0 from "@angular/core";
export declare class HelpCenterService {
    private http;
    constructor(http: HttpClient);
    create(createInput: IHelpCenter): Promise<IHelpCenter>;
    getAll(relations?: string[], findInput?: IHelpCenterFind): Promise<{
        items: any[];
        total: number;
    }>;
    updateBulk(oldChildren: IHelpCenter[], newChildren: IHelpCenter[]): Promise<IHelpCenter[]>;
    update(id: string, updateInput: any): Promise<any>;
    delete(id: string): Promise<any>;
    findByBaseId(parentId: string): Promise<IHelpCenter[]>;
    deleteBulkByBaseId(parentId: string): Promise<any>;
    static ɵfac: i0.ɵɵFactoryDeclaration<HelpCenterService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<HelpCenterService>;
}
