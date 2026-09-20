import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IMakeComIntegrationSettings, IMakeComOAuthTokenDTO, IMakeComOrganization, IMakeComTeam, IMakeComConnection, IMakeComScenario, IMakeComHook, IMakeComTemplate, IMakeComSetupStatus, MakeComZone } from '@gauzy/contracts';
import * as i0 from "@angular/core";
export declare class MakeComService {
    private readonly http;
    private readonly API_URL;
    private readonly API_BASE;
    constructor(http: HttpClient);
    getIntegrationSettings(): Observable<IMakeComIntegrationSettings>;
    updateIntegrationSettings(settings: {
        isEnabled: boolean;
        webhookUrl: string;
    }): Observable<IMakeComIntegrationSettings>;
    initializeIntegration(body: {
        organizationId: string;
    }): Observable<{
        authorizationUrl: string;
        integrationId: string;
    }>;
    handleOAuthCallback(code: string, state: string): Observable<IMakeComOAuthTokenDTO>;
    handleTokenRequest(body: {
        grant_type: string;
        code: string;
        state: string;
        client_id: string;
        client_secret: string;
        redirect_uri: string;
    }): Observable<IMakeComOAuthTokenDTO>;
    getSetupStatus(organizationId?: string): Observable<IMakeComSetupStatus>;
    getZone(organizationId?: string): Observable<MakeComZone | null>;
    setZone(zone: MakeComZone, organizationId?: string): Observable<{
        success: boolean;
        zone: MakeComZone;
    }>;
    setMakeOrganization(makeOrganizationId: number, organizationId?: string): Observable<{
        success: boolean;
        makeOrganizationId: number;
    }>;
    setMakeTeam(makeTeamId: number, organizationId?: string): Observable<{
        success: boolean;
        makeTeamId: number;
    }>;
    listOrganizations(organizationId?: string): Observable<IMakeComOrganization[]>;
    listTeams(makeOrgId?: number, organizationId?: string): Observable<IMakeComTeam[]>;
    listConnections(teamId?: number, organizationId?: string): Observable<IMakeComConnection[]>;
    deleteConnection(id: number, organizationId?: string): Observable<void>;
    testConnection(id: number, organizationId?: string): Observable<any>;
    listScenarios(teamId?: number, organizationId?: string): Observable<IMakeComScenario[]>;
    getScenario(id: number, organizationId?: string): Observable<IMakeComScenario>;
    startScenario(id: number, organizationId?: string): Observable<IMakeComScenario>;
    stopScenario(id: number, organizationId?: string): Observable<IMakeComScenario>;
    runScenario(id: number, organizationId?: string): Observable<any>;
    deleteScenario(id: number, organizationId?: string): Observable<void>;
    listHooks(teamId?: number, organizationId?: string): Observable<IMakeComHook[]>;
    enableHook(id: number, organizationId?: string): Observable<any>;
    disableHook(id: number, organizationId?: string): Observable<any>;
    pingHook(id: number, organizationId?: string): Observable<any>;
    deleteHook(id: number, organizationId?: string): Observable<void>;
    listTemplates(teamId?: number, organizationId?: string): Observable<IMakeComTemplate[]>;
    static ɵfac: i0.ɵɵFactoryDeclaration<MakeComService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<MakeComService>;
}
