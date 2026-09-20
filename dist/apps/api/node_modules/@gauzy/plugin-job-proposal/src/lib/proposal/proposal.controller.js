"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProposalController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const cqrs_1 = require("@nestjs/cqrs");
const contracts_1 = require("@gauzy/contracts");
const core_1 = require("@gauzy/core");
const commands_1 = require("./commands");
const proposal_service_1 = require("./proposal.service");
const proposal_entity_1 = require("./proposal.entity");
const dto_1 = require("./dto");
let ProposalController = class ProposalController extends (0, core_1.CrudFactory)(core_1.BaseQueryDTO, dto_1.CreateProposalDTO, dto_1.UpdateProposalDTO, core_1.CountQueryDTO) {
    constructor(_proposalService, _commandBus) {
        super(_proposalService);
        this._proposalService = _proposalService;
        this._commandBus = _commandBus;
    }
    /**
     * Get the count of proposals in the same tenant based on the provided query options.
     *
     * @param options Query options to filter proposal counts.
     * @returns The count of proposals meeting the criteria.
     */
    async getCount(options) {
        return await this._proposalService.countBy(options);
    }
    /**
     * Get proposals by pagination.
     *
     * @param params Pagination parameters including page number and limit.
     * @returns Paginated list of proposals.
     */
    async pagination(params) {
        return await this._proposalService.pagination(params);
    }
    /**
     * Find all proposals based on the provided options.
     *
     * @param data The options for finding proposals.
     * @returns The found proposals.
     */
    async findAll(options) {
        return await this._proposalService.findAll(options);
    }
    /**
     * Find a single proposal by its ID.
     *
     * @param id The ID of the proposal to find.
     * @param options Additional options for the query.
     * @returns The found proposal.
     */
    async findById(id, options) {
        return await this._proposalService.findOneByIdString(id, { relations: options.relations || [] });
    }
    /**
     * Create a new proposal record.
     *
     * @param entity The data to create the proposal.
     * @returns The newly created proposal.
     */
    async create(entity) {
        return await this._commandBus.execute(new commands_1.ProposalCreateCommand(entity));
    }
    /**
     * Update a single proposal by its ID.
     *
     * @param id The ID of the proposal to update.
     * @param entity The updated proposal data.
     * @returns The updated proposal.
     */
    async update(id, entity) {
        return await this._commandBus.execute(new commands_1.ProposalUpdateCommand(id, entity));
    }
};
exports.ProposalController = ProposalController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get proposal count in the same tenant' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Successfully retrieved the proposal count.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid query parameters. Please check your input.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
        description: 'An error occurred while retrieving the proposal count.'
    }),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.ORG_PROPOSALS_VIEW),
    (0, common_1.Get)('count'),
    (0, core_1.UseValidationPipe)(),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [core_1.CountQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], ProposalController.prototype, "getCount", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get proposals by pagination' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Proposals retrieved successfully',
        type: proposal_entity_1.Proposal
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid pagination parameters provided'
    }),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.ORG_PROPOSALS_VIEW),
    (0, common_1.Get)('pagination'),
    (0, core_1.UseValidationPipe)({ transform: true }),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [core_1.BaseQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], ProposalController.prototype, "pagination", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Find all proposals' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Proposals found',
        type: proposal_entity_1.Proposal
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'No proposals found'
    }),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.ORG_PROPOSALS_VIEW),
    (0, common_1.Get)(),
    (0, core_1.UseValidationPipe)(),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [core_1.BaseQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], ProposalController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Find a single proposal by ID' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Proposal found',
        type: proposal_entity_1.Proposal
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Proposal not found'
    }),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.ORG_PROPOSALS_VIEW),
    (0, common_1.Get)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id', core_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, core_1.FindOptionsQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], ProposalController.prototype, "findById", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create a new proposal record' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Proposal created successfully',
        type: proposal_entity_1.Proposal
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input. The response body may contain clues as to what went wrong'
    }),
    (0, common_1.Post)(),
    (0, core_1.UseValidationPipe)({ transform: true, whitelist: true }),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.CreateProposalDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], ProposalController.prototype, "create", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update a single proposal by ID' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Proposal updated successfully',
        type: proposal_entity_1.Proposal
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Proposal not found'
    }),
    (0, common_1.Put)(':id'),
    (0, core_1.UseValidationPipe)({ transform: true, whitelist: true }),
    tslib_1.__param(0, (0, common_1.Param)('id', core_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, dto_1.UpdateProposalDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], ProposalController.prototype, "update", null);
exports.ProposalController = ProposalController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('Proposal'),
    (0, common_1.UseGuards)(core_1.TenantPermissionGuard, core_1.PermissionGuard),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.ORG_PROPOSALS_EDIT),
    (0, common_1.Controller)('/proposal'),
    tslib_1.__metadata("design:paramtypes", [proposal_service_1.ProposalService, cqrs_1.CommandBus])
], ProposalController);
//# sourceMappingURL=proposal.controller.js.map