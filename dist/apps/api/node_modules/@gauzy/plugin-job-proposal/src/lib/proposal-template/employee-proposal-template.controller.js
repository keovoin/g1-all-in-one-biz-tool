"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeProposalTemplateController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const contracts_1 = require("@gauzy/contracts");
const core_1 = require("@gauzy/core");
const employee_proposal_template_entity_1 = require("./employee-proposal-template.entity");
const employee_proposal_template_service_1 = require("./employee-proposal-template.service");
const dto_1 = require("./dto");
const proposal_template_dto_1 = require("./dto/proposal-template.dto");
let EmployeeProposalTemplateController = class EmployeeProposalTemplateController extends core_1.CrudController {
    constructor(employeeProposalTemplateService) {
        super(employeeProposalTemplateService);
        this.employeeProposalTemplateService = employeeProposalTemplateService;
    }
    /**
     * GET employee proposal template via pagination.
     *
     * Retrieves a paginated list of employee proposal templates from the database.
     *
     * @param params Pagination parameters (e.g., `skip`, `take`, filters).
     * @returns A paginated result containing an array of `IEmployeeProposalTemplate`.
     */
    async pagination(params) {
        return await this.employeeProposalTemplateService.paginate(params);
    }
    /**
     * CREATE make default template by ID.
     *
     * Marks an existing proposal template as the default template by its ID.
     *
     * @param id The UUID of the proposal template to set as default.
     * @param input The DTO containing extra data needed for the operation (if any).
     * @returns The updated `IEmployeeProposalTemplate`.
     */
    async makeDefault(id, input) {
        return await this.employeeProposalTemplateService.makeDefault(id, input);
    }
    /**
     * GET all employee proposal templates.
     *
     * Retrieves all employee proposal templates from the database.
     * Optionally supports pagination parameters or query filters.
     *
     * @param params Optional pagination parameters or query filters.
     * @returns A paginated result containing an array of `IEmployeeProposalTemplate`.
     */
    async findAll(params) {
        return await this.employeeProposalTemplateService.findAll(params);
    }
    /**
     * CREATE employee proposal template
     *
     * Creates a new `EmployeeProposalTemplate` entity in the database.
     *
     * @param {CreateProposalTemplateDTO} entity - The DTO containing creation data.
     * @returns {Promise<IEmployeeProposalTemplate>} The newly created proposal template.
     */
    async create(entity) {
        return await this.employeeProposalTemplateService.create(entity);
    }
    /**
     * UPDATE employee proposal template
     *
     * Updates an existing `EmployeeProposalTemplate` in the database.
     *
     * @param {ID} id - The unique identifier of the proposal template.
     * @param {UpdateProposalTemplateDTO} entity - The DTO containing updated data.
     * @returns {Promise<IEmployeeProposalTemplate | UpdateResult>} The updated proposal template or a TypeORM UpdateResult.
     */
    async update(id, entity) {
        return await this.employeeProposalTemplateService.update(id, entity);
    }
};
exports.EmployeeProposalTemplateController = EmployeeProposalTemplateController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Get paginated employee proposal templates',
        description: 'Retrieves a paginated list of employee proposal templates.'
    }),
    (0, swagger_1.ApiQuery)({
        name: 'skip',
        type: Number,
        required: false,
        description: 'Number of records to skip.'
    }),
    (0, swagger_1.ApiQuery)({
        name: 'take',
        type: Number,
        required: false,
        description: 'Number of records to retrieve.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Successful retrieval of paginated results.',
        type: employee_proposal_template_entity_1.EmployeeProposalTemplate,
        isArray: true
    }),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.ORG_PROPOSAL_TEMPLATES_VIEW),
    (0, common_1.Get)('/pagination'),
    (0, core_1.UseValidationPipe)({ transform: true }),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [core_1.BaseQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], EmployeeProposalTemplateController.prototype, "pagination", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Make Default' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Record updated successfully.'
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        type: 'string',
        description: 'The UUID of the proposal template to be marked default.'
    }),
    (0, swagger_1.ApiBody)({
        type: proposal_template_dto_1.ProposalTemplateDTO,
        required: false,
        description: 'Optional data to process while making the template default.'
    }),
    (0, common_1.Patch)('/:id/make-default'),
    tslib_1.__param(0, (0, common_1.Param)('id', core_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, proposal_template_dto_1.ProposalTemplateDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], EmployeeProposalTemplateController.prototype, "makeDefault", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Find all employee proposal templates',
        description: 'Retrieves all existing employee proposal templates, optionally paginated.'
    }),
    (0, swagger_1.ApiQuery)({
        name: 'skip',
        type: Number,
        required: false,
        description: 'Number of records to skip.'
    }),
    (0, swagger_1.ApiQuery)({
        name: 'take',
        type: Number,
        required: false,
        description: 'Number of records to retrieve.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found records successfully.',
        type: employee_proposal_template_entity_1.EmployeeProposalTemplate,
        isArray: true
    }),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.ORG_PROPOSAL_TEMPLATES_VIEW),
    (0, common_1.Get)('/'),
    (0, core_1.UseValidationPipe)(),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [core_1.BaseQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], EmployeeProposalTemplateController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Create employee proposal template',
        description: 'Creates a new employee proposal template in the database.'
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'The proposal template has been successfully created.',
        type: () => dto_1.CreateProposalTemplateDTO
    }),
    (0, swagger_1.ApiBody)({
        type: dto_1.CreateProposalTemplateDTO,
        required: true,
        description: 'Payload to create a new proposal template.'
    }),
    (0, common_1.Post)('/'),
    (0, core_1.UseValidationPipe)({ whitelist: true, transform: true }),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.CreateProposalTemplateDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], EmployeeProposalTemplateController.prototype, "create", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Update employee proposal template',
        description: 'Updates an existing employee proposal template by ID.'
    }),
    (0, swagger_1.ApiBody)({
        type: dto_1.UpdateProposalTemplateDTO,
        required: true,
        description: 'Payload to update a proposal template.'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'The proposal template has been successfully updated.',
        type: () => dto_1.UpdateProposalTemplateDTO
    }),
    (0, common_1.Put)('/:id'),
    (0, core_1.UseValidationPipe)({ whitelist: true, transform: true }),
    tslib_1.__param(0, (0, common_1.Param)('id', core_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, dto_1.UpdateProposalTemplateDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], EmployeeProposalTemplateController.prototype, "update", null);
exports.EmployeeProposalTemplateController = EmployeeProposalTemplateController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('EmployeeProposalTemplate'),
    (0, common_1.UseGuards)(core_1.TenantPermissionGuard, core_1.PermissionGuard),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.ORG_PROPOSAL_TEMPLATES_EDIT),
    (0, common_1.Controller)('/employee-proposal-template'),
    tslib_1.__metadata("design:paramtypes", [employee_proposal_template_service_1.EmployeeProposalTemplateService])
], EmployeeProposalTemplateController);
//# sourceMappingURL=employee-proposal-template.controller.js.map