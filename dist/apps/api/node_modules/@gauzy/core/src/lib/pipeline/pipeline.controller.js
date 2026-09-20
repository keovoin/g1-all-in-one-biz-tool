"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PipelineController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const contracts_1 = require("@gauzy/contracts");
const crud_1 = require("./../core/crud");
const pipeline_service_1 = require("./pipeline.service");
const pipes_1 = require("./../shared/pipes");
const decorators_1 = require("./../shared/decorators");
const guards_1 = require("./../shared/guards");
const dto_1 = require("./dto");
let PipelineController = class PipelineController extends crud_1.CrudController {
    constructor(pipelineService) {
        super(pipelineService);
        this.pipelineService = pipelineService;
    }
    /**
     * Paginate sales pipelines with permissions, validation, and filtering options.
     *
     * @param filter - The filtering options for pagination.
     * @returns The paginated result of sales pipelines.
     */
    async pagination(filter) {
        return await this.pipelineService.pagination(filter);
    }
    /**
     * Find all sales pipelines with permissions, API documentation, and query parameter parsing.
     *
     * @param data - The query parameter data.
     * @returns A paginated result of sales pipelines.
     */
    async findAll(filter) {
        return await this.pipelineService.findAll(filter);
    }
    /**
     * Get deals associated with a specific pipeline
     *
     * @param pipelineId The ID of the pipeline
     * @param options Filter conditions for fetching the deals
     * @returns A promise of paginated deals
     */
    async getPipelineDeals(pipelineId, where, relations) {
        return await this.pipelineService.getPipelineDeals(pipelineId, where, relations);
    }
    /**
     * Find a Pipeline by ID
     *
     * @param id - The ID of the Pipeline to find
     * @returns The found Pipeline
     */
    async findById(id, options) {
        return await this.pipelineService.findById(id, options);
    }
    /**
     * Create a new record with permissions, API documentation, and HTTP status codes.
     *
     * @param entity - The data to create a new record.
     * @returns The created record.
     */
    async create(entity) {
        return await this.pipelineService.create(entity);
    }
    /**
     * Update an existing record with permissions, API documentation, and HTTP status codes.
     *
     * @param id - The identifier of the record to update.
     * @param entity - The data to update the existing record.
     * @param options - Additional options if needed.
     * @returns The updated record.
     */
    async update(id, entity) {
        return await this.pipelineService.update(id, entity);
    }
    /**
     * Delete a record with permissions, API documentation, and HTTP status codes.
     *
     * @param id - The identifier of the record to delete.
     * @param options - Additional options if needed.
     * @returns The result of the deletion operation.
     */
    async delete(id) {
        return await this.pipelineService.delete(id);
    }
};
exports.PipelineController = PipelineController;
tslib_1.__decorate([
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.VIEW_SALES_PIPELINES),
    (0, common_1.Get)('/pagination'),
    (0, pipes_1.UseValidationPipe)({ transform: true }),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [crud_1.BaseQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], PipelineController.prototype, "pagination", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'find all' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found records'
    }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.VIEW_SALES_PIPELINES),
    (0, common_1.Get)('/'),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [crud_1.BaseQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], PipelineController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get deals for a specific pipeline' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Success' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Not Found' }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.VIEW_SALES_PIPELINES),
    (0, common_1.Get)('/:pipelineId/deals'),
    tslib_1.__param(0, (0, common_1.Param)('pipelineId', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Query)('where')),
    tslib_1.__param(2, (0, common_1.Query)('relations')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object, Array]),
    tslib_1.__metadata("design:returntype", Promise)
], PipelineController.prototype, "getPipelineDeals", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Find a Pipeline by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'The found Pipeline' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Pipeline not found' }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.VIEW_SALES_PIPELINES),
    (0, common_1.Get)('/:id'),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, crud_1.FindOptionsQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], PipelineController.prototype, "findById", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create new record' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'The record has been successfully created.' /*, type: T*/
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input, The response body may contain clues as to what went wrong'
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.EDIT_SALES_PIPELINES),
    (0, common_1.Post)('/'),
    (0, pipes_1.UseValidationPipe)(),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.CreatePipelineDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], PipelineController.prototype, "create", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update an existing record' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'The record has been successfully edited.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input, The response body may contain clues as to what went wrong'
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.EDIT_SALES_PIPELINES),
    (0, common_1.Put)('/:id'),
    (0, pipes_1.UseValidationPipe)(),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, dto_1.UpdatePipelineDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], PipelineController.prototype, "update", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Delete record' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NO_CONTENT,
        description: 'The record has been successfully deleted'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.EDIT_SALES_PIPELINES),
    (0, common_1.Delete)('/:id'),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], PipelineController.prototype, "delete", null);
exports.PipelineController = PipelineController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('Pipeline'),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard, guards_1.PermissionGuard),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.EDIT_SALES_PIPELINES),
    (0, common_1.Controller)('/pipelines'),
    tslib_1.__metadata("design:paramtypes", [pipeline_service_1.PipelineService])
], PipelineController);
//# sourceMappingURL=pipeline.controller.js.map