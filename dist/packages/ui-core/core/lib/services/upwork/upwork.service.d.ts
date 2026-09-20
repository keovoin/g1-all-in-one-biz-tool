import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IAccessTokenSecretPair, IAccessTokenDto, IAccessToken, IEngagement, IGetContractsDto, IUpworkApiConfigStatus, IUpworkSyncContractsDto, IUpworkSyncContractsRelatedDataDto, IIntegrationMap, IUpworkClientSecretPair } from '@gauzy/contracts';
import * as i0 from "@angular/core";
export declare class UpworkService {
    private http;
    constructor(http: HttpClient);
    uploadTransaction(formData: FormData): Observable<any>;
    getAccessTokenSecretPair(config: IUpworkClientSecretPair, organizationId: string): Observable<IAccessTokenSecretPair>;
    getAccessToken(accessTokenDto: IAccessTokenDto, organizationId: string): Observable<IAccessToken>;
    /**
     * Lists the freelancer contracts of an Upwork integration.
     *
     * Only the integration and organization travel: the API resolves the Upwork credentials itself,
     * so they no longer sit in a request URL or in this app's memory (GHSA-3rqg-gpm9-gx84).
     *
     * @param dto - The integration and organization to read the contracts for.
     * @returns The freelancer's Upwork engagements.
     */
    getContracts({ integrationId, organizationId }: IGetContractsDto): Observable<IEngagement[]>;
    /**
     * Reads the non-secret configuration state of an Upwork integration.
     *
     * @param dto - The integration id and the serialized query filter.
     * @returns Whether the integration is connected and usable. Never credential material.
     */
    getConfig(dto: any): Observable<IUpworkApiConfigStatus>;
    /**
     * Syncs Upwork contracts into projects of an organization.
     *
     * @param dto - The integration, organization and contracts to sync.
     * @returns The integration maps produced by the sync.
     */
    syncContracts({ integrationId, organizationId, contracts }: IUpworkSyncContractsDto): Observable<IIntegrationMap[]>;
    /**
     * Syncs the data hanging off a set of Upwork contracts.
     *
     * @param dto - The integration, organization, contracts and entities to sync. Carries no
     *              credentials (GHSA-3rqg-gpm9-gx84).
     * @returns The integration maps produced by the sync.
     */
    syncContractsRelatedData({ integrationId, organizationId, contracts, entitiesToSync, employeeId, providerId, providerReferenceId }: IUpworkSyncContractsRelatedDataDto): Observable<IIntegrationMap[]>;
    getAllReports(dto: any): Observable<any>;
    static ɵfac: i0.ɵɵFactoryDeclaration<UpworkService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<UpworkService>;
}
