import { Observable } from 'rxjs';
import { ID, IEngagement, IOrganization, IUpworkApiConfigStatus, IUpworkDateRange } from '@gauzy/contracts';
import { UpworkService } from './upwork.service';
import { Store } from '../store/store.service';
import * as i0 from "@angular/core";
export declare class UpworkStoreService {
    private readonly _upworkService;
    private readonly _storeService;
    /**
     * The integration's connected/usable state. This replaces the cached `IUpworkApiConfig`: the
     * store used to hold live Upwork credentials in browser memory and post them back to the API
     * on every call (GHSA-3rqg-gpm9-gx84).
     */
    private _configStatus$;
    configStatus$: Observable<IUpworkApiConfigStatus>;
    /** The `integrationId:organizationId` pair the cached configuration state belongs to. */
    private _configStatusScope;
    private _contracts$;
    contracts$: Observable<IEngagement[]>;
    /** The `integrationId:organizationId` pair the cached contracts belong to. */
    private _contractsScope;
    private _selectedIntegrationId$;
    private _contractsSettings$;
    contractsSettings$: Observable<any>;
    private employeeId;
    private _dateRangeActivity$;
    dateRangeActivity$: Observable<IUpworkDateRange>;
    private _reports$;
    reports$: Observable<any>;
    constructor(_upworkService: UpworkService, _storeService: Store);
    /**
     * Retrieves contracts from Upwork service.
     *
     * Sends the selected integration id and organization instead of the Upwork credentials: the API
     * resolves those server-side, so they never reach a request URL (GHSA-3rqg-gpm9-gx84).
     *
     * @returns An observable stream of IEngagement[] representing contracts.
     */
    getContracts(): Observable<IEngagement[]>;
    /**
     * Get upwork income/expense reports
     */
    loadReports(organization: IOrganization): Observable<any>;
    /**
     * Sets the selected integration ID.
     * @param integrationId The ID of the integration to set.
     */
    setSelectedIntegrationId(integrationId: ID): void;
    /**
     * Syncs contracts with Upwork.
     *
     * The tenant is not sent: the API takes it from the authenticated request context.
     *
     * @param contracts The contracts to sync.
     * @returns An observable that completes after syncing contracts.
     */
    syncContracts(contracts: IEngagement[]): Observable<import("@gauzy/contracts").IIntegrationMap[]>;
    /**
     * Syncs data related to contracts with Upwork.
     *
     * Posts the selected integration id instead of the Upwork credentials: the API resolves those
     * server-side (GHSA-3rqg-gpm9-gx84).
     *
     * @param contracts The contracts to sync data for.
     * @returns An observable that completes after syncing data related to contracts.
     */
    syncDataWithContractRelated(contracts: IEngagement[]): Observable<any>;
    /**
     * Sets the selected employee ID.
     * @param employeeId The ID of the employee to set.
     */
    setSelectedEmployeeId(employeeId: ID): void;
    /**
     * Sets the filter date range for Upwork activities.
     * @param dateRange The date range to set.
     */
    setFilterDateRange(dateRange: IUpworkDateRange): void;
    /**
     * Gets the non-secret configuration state of the Upwork integration.
     *
     * What comes back says whether the integration is connected and usable — it no longer carries
     * the Upwork credentials, and nothing here caches them (GHSA-3rqg-gpm9-gx84).
     *
     * @param input The integration and organization to look the configuration up for.
     * @returns An observable of the Upwork integration's configuration state.
     */
    getConfig(input: any): Observable<IUpworkApiConfigStatus>;
    /**
     * Builds the key a cached value is tied to.
     *
     * @param integrationId The Upwork integration.
     * @param organizationId The organization.
     * @returns The `integrationId:organizationId` key.
     */
    private static _scopeKey;
    getSelectedOrganization(): IOrganization;
    static ɵfac: i0.ɵɵFactoryDeclaration<UpworkStoreService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<UpworkStoreService>;
}
