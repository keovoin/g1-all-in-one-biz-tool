import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IRole, IPagination, IRoleCreateInput, IRoleFindInput } from '@gauzy/contracts';
import * as i0 from "@angular/core";
export declare class RoleService {
    private http;
    constructor(http: HttpClient);
    getRoleByOptions(options: IRoleFindInput): Observable<IRole>;
    getAll(): Promise<IPagination<IRole>>;
    create(role: IRoleCreateInput): Observable<IRole>;
    delete(role: IRole): Observable<IRole>;
    getRoleById(roleId: string): Promise<IRole>;
    static ɵfac: i0.ɵɵFactoryDeclaration<RoleService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<RoleService>;
}
