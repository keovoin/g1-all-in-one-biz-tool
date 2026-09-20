import { IAccessToken, IAccessTokenSecretPair, IAccessTokenDto, IGetWorkDiaryDto, IGetContractsDto, IEngagement, IUpworkApiConfigStatus, IUpworkClientSecretPair, IUpworkSyncContractsDto, IUpworkSyncContractsRelatedDataDto, IPagination, IIntegrationMap } from '@gauzy/contracts';
import { UpworkTransactionService } from './upwork-transaction.service';
import { UpworkService } from './upwork.service';
export declare class UpworkController {
    private readonly _upworkTransactionService;
    private readonly _upworkService;
    constructor(_upworkTransactionService: UpworkTransactionService, _upworkService: UpworkService);
    /**
     * Handles the uploading of Upwork transactions.
     *
     * @param file - The uploaded file containing transaction data.
     * @param organizationDto - The DTO containing organization information.
     * @returns A promise that resolves with the result of handling the transactions.
     */
    create(file: Express.Multer.File, organizationDto: any): Promise<any>;
    /**
     * Starts the Upwork OAuth handshake, or names the integration that already completed it.
     *
     * @param config - The Upwork consumer key and secret typed into the authorize form.
     * @param organizationId - The ID of the organization.
     * @returns The authorization URL to send the operator to, or the existing integration id. Never
     *          a request-token secret or an access token (GHSA-3rqg-gpm9-gx84).
     */
    getAccessTokenSecretPair(config: IUpworkClientSecretPair, organizationId: string): Promise<IAccessTokenSecretPair>;
    /**
     * Completes the Upwork OAuth handshake for the specified organization.
     *
     * @param accessTokenDto - The request token and verifier Upwork's callback handed back.
     * @param organizationId - The ID of the organization.
     * @returns The id of the integration now holding the access token. The token itself stays on
     *          the server (GHSA-3rqg-gpm9-gx84).
     */
    getAccessToken(accessTokenDto: IAccessTokenDto, organizationId: string): Promise<IAccessToken>;
    /**
     * Retrieves the work diary for the specified integration and contract.
     *
     * @param data - The integration, organization, contract and date to read. It carries no
     *               credentials: the server resolves those from the integration id.
     * @returns A promise that resolves with the work diary data.
     */
    getWorkDiary(data: IGetWorkDiaryDto): Promise<any>;
    /**
     * Retrieves the freelancer contracts for the specified integration.
     *
     * @param data - The integration and organization to read the contracts for. It carries no
     *               credentials: the server resolves those from the integration id.
     * @returns A promise that resolves with the list of engagements.
     */
    getContracts(data: IGetContractsDto): Promise<IEngagement[]>;
    /**
     * Retrieves the non-secret configuration state of the specified Upwork integration.
     *
     * 🛑 This route must never answer with credential material. It reports whether the integration
     * is connected and usable; anything credential-derived that stays visible is masked
     * (GHSA-3rqg-gpm9-gx84).
     *
     * @param integrationId - The UUID of the integration.
     * @param data - The query parameters, parsed as JSON. Only `filter.organizationId` is read.
     * @returns A promise that resolves with the secret-free configuration state.
     */
    getConfig(integrationId: string, data: any): Promise<IUpworkApiConfigStatus>;
    /**
     * Syncs Upwork contracts into projects of the specified organization.
     *
     * @param syncContractsDto - The integration, organization and contracts to sync. A tenant in the
     *                           body is ignored: the server takes it from the request context.
     * @returns A promise that resolves with the result of the synchronization process.
     */
    syncContracts(syncContractsDto: IUpworkSyncContractsDto): Promise<IIntegrationMap[]>;
    /**
     * Syncs contracts related data with the provided data transfer object.
     *
     * @param dto - The integration, organization, contracts and entities to sync. It carries no
     *              credentials: the server resolves those from the integration id.
     * @returns A promise that resolves with the result of the synchronization process.
     */
    syncContractsRelatedData(dto: IUpworkSyncContractsRelatedDataDto): Promise<any>;
    /**
     * Retrieves income and expense reports for the specified Upwork integration.
     *
     * @param integrationId - The ID of the Upwork integration.
     * @param data - Optional query parameters for filtering and relations.
     * @returns A promise that resolves with the paginated list of income and expense reports.
     */
    getReports(integrationId: string, data: any): Promise<IPagination<any>>;
}
