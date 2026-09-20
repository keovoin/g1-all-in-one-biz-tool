import { CommandBus } from '@nestjs/cqrs';
import { HttpService } from '@nestjs/axios';
import { DataSource } from 'typeorm';
import { IGithubAppInstallInput, IIntegrationTenant, IOAuthAppInstallInput } from '@gauzy/contracts';
import { IntegrationService } from '@gauzy/core';
export declare class GithubService {
    private readonly _http;
    private readonly _commandBus;
    private readonly _integrationService;
    private readonly _dataSource;
    private readonly logger;
    constructor(_http: HttpService, _commandBus: CommandBus, _integrationService: IntegrationService, _dataSource: DataSource);
    /**
     * Rejects binding a GitHub App `installation_id` that is already linked to a DIFFERENT tenant.
     *
     * The install endpoint stores the caller-supplied `installation_id` against the caller's own
     * tenant without proving the caller initiated that installation, so a user could otherwise bind a
     * victim's `installation_id` to their own tenant and read the victim's repositories (CWE-639,
     * GHSA-4rwq-65wh-45h4). Enforcing first-claimant-wins uniqueness across tenants removes the
     * simultaneous multi-tenant-binding window. This query is intentionally NOT tenant-scoped because
     * it must detect bindings owned by other tenants.
     *
     * @param installationId - The GitHub App installation id being bound.
     * @param tenantId - The caller's tenant id.
     * @throws BadRequestException if the installation is already linked to another tenant.
     */
    private assertInstallationNotClaimedByAnotherTenant;
    /**
     * Adds a GitHub App installation by validating input data, fetching an access token, and creating integration tenant settings.
     *
     * @param input - The input data for adding a GitHub App installation.
     * @returns A promise that resolves to the access token data.
     * @throws Error if any step of the process fails.
     */
    addGithubAppInstallation(input: IGithubAppInstallInput): Promise<IIntegrationTenant>;
    /**
     * Authorizes a GitHub App installation by validating input data, fetching an access token, and creating integration tenant settings.
     *
     * @param input - The input data required for OAuth authorization.
     * @returns A promise that resolves with the integration tenant data.
     * @throws {HttpException} If input data is invalid or if any step of the process fails.
     */
    oAuthEndpointAuthorization(input: IOAuthAppInstallInput): Promise<IIntegrationTenant>;
}
