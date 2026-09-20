import { HttpClient } from '@angular/common/http';
import { IEmployeeSetting, IEmployeeSettingFindInput } from '@gauzy/contracts';
import * as i0 from "@angular/core";
export declare class EmployeeSettingService {
    private http;
    constructor(http: HttpClient);
    create(createInput: IEmployeeSetting): Promise<any>;
    getAll(relations?: string[], findInput?: IEmployeeSettingFindInput): Promise<{
        items: IEmployeeSetting[];
        total: number;
    }>;
    delete(id: string): Promise<any>;
    update(id: string, updateInput: IEmployeeSetting): Promise<any>;
    static ɵfac: i0.ɵɵFactoryDeclaration<EmployeeSettingService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<EmployeeSettingService>;
}
