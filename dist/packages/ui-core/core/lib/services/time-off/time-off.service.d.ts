import { HttpClient } from '@angular/common/http';
import { ITimeOffPolicy, ITimeOffPolicyCreateInput, ITimeOffPolicyFindInput, ITimeOffPolicyUpdateInput, ITimeOffCreateInput, ITimeOff, ITimeOffFindInput, IPagination } from '@gauzy/contracts';
import { Observable } from 'rxjs';
import * as i0 from "@angular/core";
export declare class TimeOffService {
    private http;
    constructor(http: HttpClient);
    createPolicy(createInput: ITimeOffPolicyCreateInput): Observable<ITimeOffPolicy>;
    getAllPolicies(relations?: string[], findInput?: ITimeOffPolicyFindInput): Observable<IPagination<ITimeOffPolicy>>;
    updatePolicy(id: string, updateInput: ITimeOffPolicyUpdateInput): Observable<ITimeOffPolicy>;
    deletePolicy(id: string): Observable<any>;
    createRequest(timeOffRequest: ITimeOffCreateInput): Observable<ITimeOff>;
    updateRequest(id: string, timeOffRequest: ITimeOff): Observable<ITimeOff>;
    getAllTimeOffRecords(relations?: string[], findInput?: ITimeOffFindInput): Observable<IPagination<ITimeOff>>;
    updateRequestStatus(id: string, action: string): Observable<ITimeOff>;
    deleteDaysOffRequest(id: string): Observable<any>;
    static ɵfac: i0.ɵɵFactoryDeclaration<TimeOffService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<TimeOffService>;
}
