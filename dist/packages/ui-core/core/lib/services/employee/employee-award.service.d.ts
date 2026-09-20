import { HttpClient } from '@angular/common/http';
import { IEmployeeAward, IEmployeeAwardFindInput, IEmployeeAwardCreateInput, IPagination } from '@gauzy/contracts';
import { Observable } from 'rxjs';
import * as i0 from "@angular/core";
export declare class EmployeeAwardService {
    private readonly http;
    constructor(http: HttpClient);
    create(createInput: IEmployeeAwardCreateInput): Observable<IEmployeeAward>;
    getAll(where?: IEmployeeAwardFindInput, relations?: string[]): Observable<IPagination<IEmployeeAward>>;
    update(id: string, updateInput: any): Observable<any>;
    delete(id: string): Observable<any>;
    static ɵfac: i0.ɵɵFactoryDeclaration<EmployeeAwardService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<EmployeeAwardService>;
}
