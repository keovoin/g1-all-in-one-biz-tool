"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpworkController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const contracts_1 = require("@gauzy/contracts");
const core_1 = require("@gauzy/core");
const upwork_transaction_service_1 = require("./upwork-transaction.service");
const upwork_service_1 = require("./upwork.service");
let UpworkController = class UpworkController {
    constructor(_upworkTransactionService, _upworkService) {
        this._upworkTransactionService = _upworkTransactionService;
        this._upworkService = _upworkService;
    }
    /**
     * Handles the uploading of Upwork transactions.
     *
     * @param file - The uploaded file containing transaction data.
     * @param organizationDto - The DTO containing organization information.
     * @returns A promise that resolves with the result of handling the transactions.
     */
    async create(file, organizationDto) {
        // The incomes and expenses land in the organization named by the body, so it must be one the caller may act on.
        await this._upworkService.assertOrganizationAccess(organizationDto?.organizationId);
        return await this._upworkTransactionService.handleTransactions(file, organizationDto);
    }
    /**
     * Starts the Upwork OAuth handshake, or names the integration that already completed it.
     *
     * @param config - The Upwork consumer key and secret typed into the authorize form.
     * @param organizationId - The ID of the organization.
     * @returns The authorization URL to send the operator to, or the existing integration id. Never
     *          a request-token secret or an access token (GHSA-3rqg-gpm9-gx84).
     */
    async getAccessTokenSecretPair(config, organizationId) {
        return await this._upworkService.getAccessTokenSecretPair(config, organizationId);
    }
    /**
     * Completes the Upwork OAuth handshake for the specified organization.
     *
     * @param accessTokenDto - The request token and verifier Upwork's callback handed back.
     * @param organizationId - The ID of the organization.
     * @returns The id of the integration now holding the access token. The token itself stays on
     *          the server (GHSA-3rqg-gpm9-gx84).
     */
    async getAccessToken(accessTokenDto, organizationId) {
        return await this._upworkService.getAccessToken(accessTokenDto, organizationId);
    }
    /**
     * Retrieves the work diary for the specified integration and contract.
     *
     * @param data - The integration, organization, contract and date to read. It carries no
     *               credentials: the server resolves those from the integration id.
     * @returns A promise that resolves with the work diary data.
     */
    async getWorkDiary(data) {
        return await this._upworkService.getWorkDiary(data);
    }
    /**
     * Retrieves the freelancer contracts for the specified integration.
     *
     * @param data - The integration and organization to read the contracts for. It carries no
     *               credentials: the server resolves those from the integration id.
     * @returns A promise that resolves with the list of engagements.
     */
    async getContracts(data) {
        return await this._upworkService.getContractsForFreelancer(data);
    }
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
    async getConfig(integrationId, data) {
        const { filter } = data ?? {};
        return await this._upworkService.getConfig(integrationId, filter?.organizationId);
    }
    /**
     * Syncs Upwork contracts into projects of the specified organization.
     *
     * @param syncContractsDto - The integration, organization and contracts to sync. A tenant in the
     *                           body is ignored: the server takes it from the request context.
     * @returns A promise that resolves with the result of the synchronization process.
     */
    async syncContracts(syncContractsDto) {
        return await this._upworkService.syncContracts(syncContractsDto);
    }
    /**
     * Syncs contracts related data with the provided data transfer object.
     *
     * @param dto - The integration, organization, contracts and entities to sync. It carries no
     *              credentials: the server resolves those from the integration id.
     * @returns A promise that resolves with the result of the synchronization process.
     */
    async syncContractsRelatedData(dto) {
        return await this._upworkService.syncContractsRelatedData(dto);
    }
    /**
     * Retrieves income and expense reports for the specified Upwork integration.
     *
     * @param integrationId - The ID of the Upwork integration.
     * @param data - Optional query parameters for filtering and relations.
     * @returns A promise that resolves with the paginated list of income and expense reports.
     */
    async getReports(integrationId, data) {
        const { relations, filter } = data;
        return await this._upworkService.getReportListByIntegration(integrationId, filter, relations);
    }
};
exports.UpworkController = UpworkController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Upload Upwork transaction' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'The transaction has been successfully uploaded.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'The specified record was not found.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'The request was invalid or the freelancer was not found.'
    }),
    (0, common_1.Post)('/transactions'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    tslib_1.__param(0, (0, common_1.UploadedFile)()),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UpworkController.prototype, "create", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Authorize Upwork' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'The Upwork account has been successfully authorized.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'The specified record was not found.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Authorization failed due to invalid request.'
    }),
    (0, common_1.Post)('/token-secret-pair/:organizationId'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__param(1, (0, common_1.Param)('organizationId', core_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, String]),
    tslib_1.__metadata("design:returntype", Promise)
], UpworkController.prototype, "getAccessTokenSecretPair", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get Access Token' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'The access token has been successfully retrieved.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'The specified record was not found.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid request.'
    }),
    (0, common_1.Post)('/access-token/:organizationId'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__param(1, (0, common_1.Param)('organizationId', core_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, String]),
    tslib_1.__metadata("design:returntype", Promise)
], UpworkController.prototype, "getAccessToken", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get Work Diary' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Work Diary retrieved successfully.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'The specified record was not found.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid request.'
    }),
    (0, common_1.Get)('/work-diary'),
    tslib_1.__param(0, (0, common_1.Query)('data', core_1.ParseJsonPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UpworkController.prototype, "getWorkDiary", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get Contracts' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Contracts retrieved successfully.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'The specified record was not found.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid request.'
    }),
    (0, common_1.Get)('/freelancer-contracts'),
    tslib_1.__param(0, (0, common_1.Query)('data', core_1.ParseJsonPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UpworkController.prototype, "getContracts", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get Config' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Configuration retrieved successfully.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'The specified record was not found.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid request.'
    }),
    (0, common_1.Get)('/config/:integrationId'),
    tslib_1.__param(0, (0, common_1.Param)('integrationId', core_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Query)('data', core_1.ParseJsonPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UpworkController.prototype, "getConfig", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Sync Contracts' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Contracts have been successfully synced.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'The specified record was not found.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'The request is invalid.'
    }),
    (0, common_1.Post)('/sync-contracts'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UpworkController.prototype, "syncContracts", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Sync Contracts Related Data' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Contracts related data have been successfully synced.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'The specified record was not found.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'The request is invalid.'
    }),
    (0, common_1.Post)('/sync-contracts-related-data'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UpworkController.prototype, "syncContractsRelatedData", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Find all expenses and incomes for logged Upwork user.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Successfully retrieved income and expense data.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'The specified record was not found.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'The request is invalid.'
    }),
    (0, common_1.Get)('/report/:integrationId'),
    tslib_1.__param(0, (0, common_1.Param)('integrationId', core_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Query)('data', core_1.ParseJsonPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UpworkController.prototype, "getReports", null);
exports.UpworkController = UpworkController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('Upwork Integrations'),
    (0, common_1.UseGuards)(core_1.TenantPermissionGuard, core_1.PermissionGuard),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.INTEGRATION_ADD, contracts_1.PermissionsEnum.INTEGRATION_EDIT),
    (0, common_1.Controller)('/integrations/upwork'),
    tslib_1.__metadata("design:paramtypes", [upwork_transaction_service_1.UpworkTransactionService,
        upwork_service_1.UpworkService])
], UpworkController);
//# sourceMappingURL=upwork.controller.js.map