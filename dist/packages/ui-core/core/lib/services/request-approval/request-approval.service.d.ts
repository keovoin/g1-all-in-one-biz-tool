import { HttpClient } from '@angular/common/http';
import { IRequestApproval, IRequestApprovalCreateInput, IRequestApprovalFindInput } from '@gauzy/contracts';
import * as i0 from "@angular/core";
export declare class RequestApprovalService {
    private http;
    REQUESTS_APPROVAL_URL: string;
    constructor(http: HttpClient);
    getAll(relations?: string[], findInput?: IRequestApprovalFindInput): Promise<{
        items: IRequestApproval[];
    }>;
    getByEmployeeId(id: string, relations?: string[], findInput?: IRequestApprovalFindInput): Promise<{
        items: IRequestApproval[];
    }>;
    delete(id: string): Promise<any>;
    save(requestApproval: IRequestApprovalCreateInput): Promise<IRequestApproval>;
    approvalRequestByAdmin(id: string): Promise<IRequestApproval>;
    refuseRequestByAdmin(id: string): Promise<IRequestApproval>;
    static ɵfac: i0.ɵɵFactoryDeclaration<RequestApprovalService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<RequestApprovalService>;
}
