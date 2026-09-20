import { HttpClient } from '@angular/common/http';
import { IApprovalPolicy, IApprovalPolicyFindInput, IApprovalPolicyCreateInput, IPagination } from '@gauzy/contracts';
import * as i0 from "@angular/core";
export declare class ApprovalPolicyService {
    private http;
    APPROVAL_POLICY_URL: string;
    constructor(http: HttpClient);
    getAll(relations?: string[], where?: IApprovalPolicyFindInput): Promise<IPagination<IApprovalPolicy>>;
    getForRequestApproval(relations?: string[], findInput?: IApprovalPolicyFindInput): Promise<IPagination<IApprovalPolicy>>;
    delete(id: string): Promise<any>;
    save(approvalPolicy: IApprovalPolicyCreateInput): Promise<IApprovalPolicy>;
    static ɵfac: i0.ɵɵFactoryDeclaration<ApprovalPolicyService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ApprovalPolicyService>;
}
