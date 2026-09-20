import { MakeComApiService } from './make-com-api.service';
import { IMakeComScenarioScheduling } from './interfaces/make-com-api.model';
import { SetZoneDTO } from './dto';
export declare class MakeComApiController {
    private readonly makeComApiService;
    constructor(makeComApiService: MakeComApiService);
    private extractPagination;
    getSetupStatus(organizationId?: string): Promise<{
        hasAccessToken: boolean;
        zone: import("./interfaces/make-com-api.model").MakeComZone | null;
        makeOrganizationId: number | null;
        makeTeamId: number | null;
        isComplete: boolean;
    }>;
    getAvailableZones(): {
        zones: import("./interfaces/make-com-api.model").MakeComZone[];
    };
    getZone(organizationId?: string): Promise<{
        zone: string;
    }>;
    setZone(body: SetZoneDTO): Promise<{
        success: boolean;
        zone: import("./interfaces/make-com-api.model").MakeComZone;
    }>;
    setMakeOrganization(body: {
        makeOrganizationId: number;
        organizationId?: string;
    }): Promise<{
        success: boolean;
        makeOrganizationId: number;
    }>;
    setMakeTeam(body: {
        makeTeamId: number;
        organizationId?: string;
    }): Promise<{
        success: boolean;
        makeTeamId: number;
    }>;
    listOrganizations(organizationId?: string): Promise<{
        organizations: import("./interfaces/make-com-api.model").IMakeComOrganization[];
    }>;
    getOrganization(id: number, organizationId?: string): Promise<{
        organization: import("./interfaces/make-com-api.model").IMakeComOrganization;
    }>;
    listTeams(makeOrgId?: string, organizationId?: string, query?: Record<string, any>): Promise<{
        teams: import("./interfaces/make-com-api.model").IMakeComTeam[];
    }>;
    getTeam(id: number, organizationId?: string): Promise<{
        team: import("./interfaces/make-com-api.model").IMakeComTeam;
    }>;
    listConnections(teamId?: string, organizationId?: string, query?: Record<string, any>): Promise<{
        connections: import("./interfaces/make-com-api.model").IMakeComConnection[];
    }>;
    getConnection(id: number, organizationId?: string): Promise<{
        connection: import("./interfaces/make-com-api.model").IMakeComConnection;
    }>;
    deleteConnection(id: number, organizationId?: string): Promise<void>;
    testConnection(id: number, organizationId?: string): Promise<any>;
    listScenarios(teamId?: string, organizationId?: string, query?: Record<string, any>): Promise<{
        scenarios: import("./interfaces/make-com-api.model").IMakeComScenario[];
    }>;
    getScenario(id: number, organizationId?: string): Promise<{
        scenario: import("./interfaces/make-com-api.model").IMakeComScenario;
    }>;
    createScenario(body: {
        teamId: number;
        name: string;
        blueprint: string;
        scheduling: IMakeComScenarioScheduling;
        folderId?: number;
    }, organizationId?: string): Promise<{
        scenario: import("./interfaces/make-com-api.model").IMakeComScenario;
    }>;
    updateScenario(id: number, body: {
        name?: string;
        blueprint?: string;
        scheduling?: IMakeComScenarioScheduling;
    }, organizationId?: string): Promise<{
        scenario: import("./interfaces/make-com-api.model").IMakeComScenario;
    }>;
    deleteScenario(id: number, organizationId?: string): Promise<void>;
    startScenario(id: number, organizationId?: string): Promise<{
        scenario: import("./interfaces/make-com-api.model").IMakeComScenario;
    }>;
    stopScenario(id: number, organizationId?: string): Promise<{
        scenario: import("./interfaces/make-com-api.model").IMakeComScenario;
    }>;
    runScenario(id: number, body?: {
        responsive?: boolean;
        data?: any;
    }, organizationId?: string): Promise<any>;
    listHooks(teamId?: string, organizationId?: string, query?: Record<string, any>): Promise<{
        hooks: import("./interfaces/make-com-api.model").IMakeComHook[];
    }>;
    getHook(id: number, organizationId?: string): Promise<{
        hook: import("./interfaces/make-com-api.model").IMakeComHook;
    }>;
    createHook(body: {
        teamId: number;
        name: string;
        typeName: string;
        [key: string]: unknown;
    }, organizationId?: string): Promise<{
        hook: import("./interfaces/make-com-api.model").IMakeComHook;
    }>;
    updateHook(id: number, body: {
        name: string;
    }, organizationId?: string): Promise<{
        hook: import("./interfaces/make-com-api.model").IMakeComHook;
    }>;
    deleteHook(id: number, organizationId?: string): Promise<void>;
    pingHook(id: number, organizationId?: string): Promise<any>;
    enableHook(id: number, organizationId?: string): Promise<{
        success: boolean;
    }>;
    disableHook(id: number, organizationId?: string): Promise<{
        success: boolean;
    }>;
    listTemplates(teamId?: string, organizationId?: string, query?: Record<string, any>): Promise<{
        templates: import("./interfaces/make-com-api.model").IMakeComTemplate[];
    }>;
    getTemplate(id: number, organizationId?: string): Promise<{
        template: import("./interfaces/make-com-api.model").IMakeComTemplate;
    }>;
    getTemplateBlueprint(id: number, organizationId?: string): Promise<any>;
}
