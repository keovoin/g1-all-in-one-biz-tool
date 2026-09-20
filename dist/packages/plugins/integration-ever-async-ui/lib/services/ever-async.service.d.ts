import { HttpClient } from '@angular/common/http';
import { ID } from '@gauzy/contracts';
import { Observable } from 'rxjs';
import * as i0 from "@angular/core";
export interface IEverAsyncUserMapping {
    channel: 'slack' | 'discord';
    workspace: string;
    chatUserId: string;
    employeeId: ID;
}
export interface IEverAsyncSetupRequest {
    serverUrl: string;
    userMappings: IEverAsyncUserMapping[];
    projectIds: ID[];
}
export interface IEverAsyncSetupResponse {
    integrationTenantId: ID;
    tenantId: ID;
    organizationId: ID;
    apiKey: string;
    apiSecret: string;
}
export interface IEverAsyncSettingsResponse extends IEverAsyncSetupRequest {
    integrationTenantId: ID;
    tenantId: ID;
    organizationId: ID;
    isEnabled: boolean;
    hasApiKey: boolean;
}
export interface IEverAsyncStatusResponse {
    isEnabled: boolean;
    integrationTenantId: ID | null;
}
export interface IEverAsyncUpdateResponse {
    integrationTenantId: ID;
    updated: boolean;
}
export interface IEverAsyncVerifyResponse {
    ok: boolean;
    serverUrl: string;
}
export interface IEverAsyncOptions {
    employees: {
        id: ID;
        name: string;
    }[];
    projects: {
        id: ID;
        name: string;
    }[];
}
export declare class EverAsyncService {
    private readonly http;
    private readonly apiUrl;
    constructor(http: HttpClient);
    private options;
    setup(dto: IEverAsyncSetupRequest, organizationId: ID): Observable<IEverAsyncSetupResponse>;
    getSettings(organizationId: ID): Observable<IEverAsyncSettingsResponse>;
    getOptions(organizationId: ID): Observable<IEverAsyncOptions>;
    updateSettings(dto: Partial<IEverAsyncSetupRequest> & {
        isEnabled?: boolean;
    }, organizationId: ID): Observable<IEverAsyncUpdateResponse>;
    rotateCredentials(organizationId: ID): Observable<IEverAsyncSetupResponse>;
    verify(serverUrl: string): Observable<IEverAsyncVerifyResponse>;
    getStatus(organizationId: ID): Observable<IEverAsyncStatusResponse>;
    remove(integrationTenantId: ID, organizationId: ID): Observable<{
        success: boolean;
    }>;
    static ɵfac: i0.ɵɵFactoryDeclaration<EverAsyncService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<EverAsyncService>;
}
