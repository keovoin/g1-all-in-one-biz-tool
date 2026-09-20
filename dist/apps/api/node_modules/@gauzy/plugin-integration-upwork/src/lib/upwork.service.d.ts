import { CommandBus } from '@nestjs/cqrs';
import { IAccessTokenSecretPair, IAccessToken, IAccessTokenDto, ID, IGetContractsDto, IGetWorkDiaryDto, IEngagement, IUpworkApiConfig, IUpworkApiConfigStatus, IUpworkSyncContractsRelatedDataDto, IIntegrationMap, IUpworkDateRange, IUpworkClientSecretPair, IUpworkSyncContractsDto, IPagination, ITimeLog } from '@gauzy/contracts';
import { ExpenseService, IncomeService, IntegrationMapService, OrganizationService, RoleService, TimeSlotService, UserService } from '@gauzy/core';
import { UpworkReportService } from './upwork-report.service';
import { UpworkJobService } from './upwork-job.service';
import { UpworkOffersService } from './upwork-offers.service';
export declare class UpworkService {
    private readonly _expenseService;
    private readonly _incomeService;
    private readonly _integrationMapService;
    private readonly _userService;
    private readonly _roleService;
    private readonly _organizationService;
    private readonly _timeSlotService;
    private readonly _upworkReportService;
    private readonly _upworkJobService;
    private readonly _upworkOfferService;
    private readonly _commandBus;
    constructor(_expenseService: ExpenseService, _incomeService: IncomeService, _integrationMapService: IntegrationMapService, _userService: UserService, _roleService: RoleService, _organizationService: OrganizationService, _timeSlotService: TimeSlotService, _upworkReportService: UpworkReportService, _upworkJobService: UpworkJobService, _upworkOfferService: UpworkOffersService, _commandBus: CommandBus);
    /**
     * Checks whether the Upwork app identified by `config.consumerKey` has already completed the
     * OAuth handshake for this organization.
     *
     * Returns the integration id only. It used to spread the whole settings map — consumer secret,
     * access token and access token secret included — into its result, so a caller one refactor away
     * from returning it would have leaked live credentials (GHSA-3rqg-gpm9-gx84). Callers only ever
     * needed "is it already authorized, and which integration is it".
     *
     * @param config - The Upwork client key/secret pair being authorized.
     * @param organizationId - The organization the integration belongs to.
     * @returns The owning integration id when an access token pair is already stored, otherwise `false`.
     */
    private _consumerHasAccessToken;
    /**
     * Starts the Upwork OAuth 1.0a handshake for an organization, or reports the integration that
     * already completed it.
     *
     * The consumer key / secret pair is the one credential that legitimately arrives over HTTP: an
     * operator types it into the authorize form once. Nothing credential-shaped goes back: the
     * request-token secret is stored and withheld, and an already-authorized app answers with its
     * integration id only (GHSA-3rqg-gpm9-gx84).
     *
     * The Upwork client is built per call. It used to live on this singleton service, so two
     * handshakes running at the same time — possibly for different tenants — shared one client and
     * the later one's consumer key signed the earlier one's token exchange.
     *
     * @param config - The Upwork consumer key and secret being authorized.
     * @param organizationId - The organization the integration belongs to.
     * @returns The existing integration id, or the Upwork authorization URL to send the operator to.
     * @throws BadRequestException when the consumer key or secret is missing.
     * @throws ForbiddenException when the caller has no access to the organization.
     */
    getAccessTokenSecretPair(config: IUpworkClientSecretPair, organizationId: ID): Promise<IAccessTokenSecretPair>;
    /**
     * Completes the Upwork OAuth 1.0a handshake and stores the minted access token pair.
     *
     * The freshly minted `accessToken` / `accessTokenSecret` are persisted as integration settings
     * and are no longer echoed back to the caller: the browser only ever used `integrationId` to
     * navigate, while the credentials it received sat in the Angular app's memory
     * (GHSA-3rqg-gpm9-gx84).
     *
     * Every lookup is awaited before the Upwork callback is wrapped, so a failed lookup rejects the
     * request instead of throwing inside a promise executor and leaving it pending. The Upwork client
     * is rebuilt from the consumer pair stored by {@link getAccessTokenSecretPair}, not taken from
     * whichever handshake this singleton service happened to start last.
     *
     * @param accessTokenDto - The OAuth request token and verifier returned by Upwork.
     * @param organizationId - The organization the integration belongs to.
     * @returns The id of the integration that now holds the access token.
     * @throws BadRequestException when the token or verifier is missing, or the handshake is incomplete.
     * @throws ForbiddenException when the caller has no access to the organization.
     * @throws NotFoundException when no pending handshake of the organization matches the request token.
     */
    getAccessToken(accessTokenDto: IAccessTokenDto, organizationId: ID): Promise<IAccessToken>;
    /**
     * Builds the scope an integration is resolved within for the current request, and checks the
     * caller may act on that organization.
     *
     * The tenant always comes from the request context, never from the request payload, so a caller
     * cannot name somebody else's tenant. The organization comes from the request, so it is
     * mandatory — an absent organization would widen the lookup to the whole tenant — and it is
     * authorized: the controller's guards only prove an integration permission somewhere in the
     * tenant, which on its own would let a member of one organization drive another organization's
     * stored Upwork credentials.
     *
     * @param organizationId - The organization named by the request.
     * @returns The resolved `{ organizationId, tenantId }` scope.
     * @throws BadRequestException when either half of the scope is missing.
     * @throws ForbiddenException when the caller has no access to the organization.
     */
    private _resolveScope;
    /**
     * Refuses the request unless the caller may act on `organizationId` in the current tenant.
     *
     * For routes that take an organization from the request but do not resolve an integration.
     *
     * @param organizationId - The organization named by the request.
     * @throws BadRequestException when the organization or the tenant is missing.
     * @throws ForbiddenException when the caller has no access to the organization.
     */
    assertOrganizationAccess(organizationId: ID): Promise<void>;
    /**
     * Whether the current user may act on `organizationId` inside `tenantId`.
     *
     * A holder of `ALL_ORG_EDIT` manages every organization of the tenant. Anybody else needs an
     * active, non-archived membership of the organization. Any lookup failure answers `false`: a
     * check that cannot reach a verdict must not grant access.
     *
     * @param organizationId - The organization named by the request.
     * @param tenantId - The caller's tenant, from the request context.
     * @returns True when the caller may act on the organization.
     */
    private _canAccessOrganization;
    /**
     * Loads an integration's settings as a `settingsName -> settingsValue` map, scoped to the caller.
     *
     * The map holds cleartext credentials and must never leave the server as-is.
     *
     * @param integrationId - The Upwork integration to read.
     * @param scope - The organization and tenant the integration must belong to.
     * @returns The integration's settings keyed by setting name.
     * @throws BadRequestException when the integration id is missing.
     * @throws NotFoundException when no such integration exists inside the caller's scope.
     */
    private _findIntegrationSettings;
    /**
     * Loads an Upwork integration, scoped to the caller's tenant and organization.
     *
     * @param integrationId - The Upwork integration to load.
     * @param scope - The organization and tenant the integration must belong to.
     * @returns The integration.
     * @throws BadRequestException when the integration id is missing.
     * @throws NotFoundException when no such integration exists inside the caller's scope.
     */
    private _findIntegration;
    /**
     * Resolves the credentials the Upwork SDK needs, server-side, from an integration id.
     *
     * This is the single place Upwork credentials are assembled. Every route that talks to the
     * Upwork API goes through it, so no endpoint has to accept an {@link IUpworkApiConfig} from a
     * client and none has to hand one back (GHSA-3rqg-gpm9-gx84).
     *
     * @param integrationId - The Upwork integration to resolve credentials for.
     * @param scope - The organization and tenant the integration must belong to.
     * @returns The credential quadruple for the Upwork SDK.
     * @throws NotFoundException when the integration is outside the caller's tenant or organization.
     * @throws BadRequestException when the integration exists but is not fully authorized.
     */
    private resolveApiConfig;
    /**
     * Returns the non-secret view of an Upwork integration's configuration.
     *
     * 🛑 This route used to answer with the cleartext `accessToken`, `consumerKey`, `consumerSecret`
     * and `accessSecret` to anybody holding an integration permission in the tenant, because it
     * read `settingsValue` into a plain object and so never went through the `IntegrationSetting`
     * masking subscriber. It now answers with the connected/usable state only: presence flags, and
     * no credential-derived value, not even a masked fragment (GHSA-3rqg-gpm9-gx84).
     *
     * @param integrationId - The Upwork integration to describe.
     * @param organizationId - The organization the integration belongs to.
     * @returns A secret-free description of the integration's configuration.
     */
    getConfig(integrationId: ID, organizationId: ID): Promise<IUpworkApiConfigStatus>;
    /**
     * Lists the freelancer's Upwork engagements (a contract here is a project in Gauzy).
     *
     * @param getEngagementsDto - The integration and organization to read the engagements for.
     * @returns The engagements reported by Upwork.
     */
    getContractsForFreelancer(getEngagementsDto: IGetContractsDto): Promise<IEngagement[]>;
    /**
     * Calls the Upwork engagements API with already-resolved credentials.
     *
     * @param config - Server-resolved Upwork API credentials.
     * @returns The engagements reported by Upwork.
     */
    private _getContractsForFreelancer;
    private _getContractByContractId;
    /**
     * Syncs Upwork contracts into Gauzy projects of an organization.
     *
     * The organization is authorized for the caller and the integration must belong to it: both
     * used to be taken on trust from the request body, so any integration permission in the tenant
     * could create projects in another organization and map them to another organization's
     * integration. A client-supplied tenant is not read; the tenant comes from the request context.
     *
     * @param dto - The integration, organization and contracts to sync.
     * @returns One integration map per synced contract.
     * @throws BadRequestException when the scope is incomplete or `contracts` is not an array.
     * @throws ForbiddenException when the caller has no access to the organization.
     * @throws NotFoundException when the integration is outside the caller's tenant or organization.
     */
    syncContracts(dto: IUpworkSyncContractsDto): Promise<IIntegrationMap[]>;
    /**
     * Creates or updates one Gauzy project per Upwork contract, for an already authorized scope.
     *
     * @param dto - The integration, organization and contracts to sync.
     * @returns One integration map per synced contract.
     */
    private _syncContracts;
    /**
     * Reads an Upwork work diary — the source of the time slots and time logs Gauzy syncs.
     *
     * @param getWorkDiaryDto - The integration, organization, contract and date to read.
     * @returns The work diary payload reported by Upwork.
     */
    getWorkDiary(getWorkDiaryDto: IGetWorkDiaryDto): Promise<any>;
    /**
     * Calls the Upwork work diary API with already-resolved credentials.
     *
     * @param config - Server-resolved Upwork API credentials.
     * @param contractId - The Upwork contract whose diary is read.
     * @param forDate - The day to read the diary for.
     * @returns The work diary payload reported by Upwork.
     */
    private _getWorkDiary;
    syncTimeLog(timeLog: any): Promise<ITimeLog>;
    syncTimeSlots({ timeSlots, employeeId, integrationId, sourceId, organizationId }: {
        timeSlots: any;
        employeeId: any;
        integrationId: any;
        sourceId: any;
        organizationId: any;
    }): Promise<any[]>;
    syncWorkDiaries(organizationId: string, integrationId: string, syncedContracts: any, config: IUpworkApiConfig, employeeId: string, forDate: any): Promise<any[]>;
    formatLogsFromSlots(slots: any): any[];
    /**
     * Syncs everything hanging off a set of Upwork contracts: work diaries, reports and proposals.
     *
     * The Upwork credentials used for the sync are resolved server-side from `integrationId`; the
     * request body used to carry them, which meant the Angular app held live credentials in memory
     * and posted them back on every sync (GHSA-3rqg-gpm9-gx84).
     *
     * @param integrationId - The Upwork integration to resolve credentials from.
     * @param organizationId - The organization the integration belongs to.
     * @param contracts - The Upwork contracts to sync.
     * @param employeeId - The Gauzy employee the synced data belongs to, when already known.
     * @param entitiesToSync - The entity kinds to sync (work diary, report, proposal).
     * @param providerReferenceId - The Upwork provider reference used to resolve the employee.
     * @param providerId - The Upwork provider id used by the report sync.
     * @returns One result per synced entity kind.
     */
    syncContractsRelatedData({ integrationId, organizationId, contracts, employeeId, entitiesToSync, providerReferenceId, providerId }: IUpworkSyncContractsRelatedDataDto): Promise<(any[] | {
        syncedIncome: any[];
        syncedExpense: any[];
    } | {
        syncedOffers: any[];
        syncedProposals: any[];
    })[]>;
    syncTimeSlotsActivity({ employeeId, organizationId, timeSlot, timeSlotActivity }: {
        employeeId: any;
        organizationId: any;
        timeSlot: any;
        timeSlotActivity: any;
    }): Promise<any[]>;
    getTimeSlotActivitiesByContractId({ contractId, employeeId, organizationId, config, timeSlots }: {
        contractId: any;
        employeeId: any;
        organizationId: any;
        config: any;
        timeSlots: any;
    }): Promise<any[]>;
    /**
     * Get snapshots for given contractId and Unix time
     */
    getSnapshotByContractId(config: IUpworkApiConfig, contractId: any, timeSlot: any): Promise<any>;
    syncSnapshots(timeSlotsData: any): Promise<any[]>;
    private _getUpworkAuthenticatedUser;
    private _getUpworkUserInfo;
    private _handleEmployee;
    private _getUpworkGauzyEmployee;
    syncEmployee({ integrationId, user, organizationId }: {
        integrationId: any;
        user: any;
        organizationId: any;
    }): Promise<any>;
    /**
     * Sync contract client
     */
    syncClient(integrationId: string, organizationId: string, client: any): Promise<IIntegrationMap>;
    syncReports(organizationId: string, integrationId: string, config: IUpworkApiConfig, employeeId: string, providerReferenceId: string, providerId: string, dateRange: IUpworkDateRange): Promise<{
        syncedIncome: any[];
        syncedExpense: any[];
    }>;
    private _syncExpense;
    private _syncIncome;
    /**
     * Lists the incomes and expenses an Upwork integration synced into an organization.
     *
     * @param integrationId - The Upwork integration whose synced records are listed.
     * @param filter - The organization and date range. A tenant in it is ignored.
     * @param relations - The relations to load on incomes and expenses.
     * @returns The synced incomes and expenses, newest first.
     * @throws BadRequestException when the organization or the tenant is missing.
     * @throws ForbiddenException when the caller has no access to the organization.
     */
    getReportListByIntegration(integrationId: string, filter: any, relations: any): Promise<IPagination<any>>;
    syncProposalsOffers(organizationId: string, integrationId: string, config: IUpworkApiConfig, employeeId: string): Promise<{
        syncedOffers: any[];
        syncedProposals: any[];
    }>;
    private _getProposals;
    private _getOffers;
    private _syncOffers;
    private _syncProposals;
}
