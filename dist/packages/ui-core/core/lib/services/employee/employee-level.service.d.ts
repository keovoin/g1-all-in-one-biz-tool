import { HttpClient } from '@angular/common/http';
import { IEmployeeLevelInput, IEmployeeLevel, IEmployeeLevelFindInput, IPagination } from '@gauzy/contracts';
import * as i0 from "@angular/core";
export declare class EmployeeLevelService {
    private http;
    constructor(http: HttpClient);
    getAll(relations?: string[], findInput?: IEmployeeLevelFindInput): Promise<IPagination<IEmployeeLevel>>;
    create(employeeLevel: IEmployeeLevelInput): Promise<Object>;
    delete(id: string): Promise<Object>;
    update(id: string, employeeLevel: IEmployeeLevelInput): Promise<Object>;
    static ɵfac: i0.ɵɵFactoryDeclaration<EmployeeLevelService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<EmployeeLevelService>;
}
