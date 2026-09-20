"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResourceLinkController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const cqrs_1 = require("@nestjs/cqrs");
const pipes_1 = require("./../shared/pipes");
const guards_1 = require("../shared/guards");
const crud_1 = require("./../core/crud");
const resource_link_entity_1 = require("./resource-link.entity");
const resource_link_service_1 = require("./resource-link.service");
const commands_1 = require("./commands");
const dto_1 = require("./dto");
let ResourceLinkController = class ResourceLinkController extends crud_1.CrudController {
    constructor(resourceLinkService, commandBus) {
        super(resourceLinkService);
        this.resourceLinkService = resourceLinkService;
        this.commandBus = commandBus;
    }
    /**
     * @description Retrieves all resource links, optionally filtered by type.
     * This endpoint supports pagination and returns a list of resource links.
     *
     * @param {BaseQueryDTO<ResourceLink>} params - The pagination and filter parameters.
     * @returns {Promise<IPagination<IResourceLink>>} - A promise that resolves to a paginated list of resource links.
     * @memberof ResourceLinkController
     */
    async findAll(params) {
        // Call the service to retrieve the paginated list of resource links
        return await this.resourceLinkService.findAll(params);
    }
    /**
     * @description Retrieves a single resource link by its ID.
     * This endpoint returns a resource link by its unique identifier, optionally filtered by query parameters.
     *
     * @param {ID} id - The unique identifier of the resource link to retrieve.
     * @param {FindOptionsQueryDTO<ResourceLink>} params - The optional query parameters for filtering or additional options.
     * @returns {Promise<ResourceLink>} - A promise that resolves to the found resource link.
     * @memberof ResourceLinkController
     */
    async findById(id, params // Retrieve optional query parameters
    ) {
        // Call the service to find the resource link by ID, applying optional filters if present
        return this.resourceLinkService.findOneByIdString(id, params);
    }
    /**
     * @description Creates a new resource link.
     * This endpoint receives the data for a resource link, validates it, and creates a new record.
     *
     * @param {CreateResourceLinkDTO} entity - The data to create a new resource link.
     * @returns {Promise<IResourceLink>} - A promise that resolves to the created resource link.
     * @memberof ResourceLinkController
     */
    async create(entity) {
        // Execute the command to create the resource link
        return await this.commandBus.execute(new commands_1.ResourceLinkCreateCommand(entity));
    }
    /**
     * @description Updates an existing resource link by its ID.
     * This endpoint receives the updated data for a resource link and updates the record in the database.
     *
     * @param {ID} id - The unique identifier of the resource link to update.
     * @param {UpdateResourceLinkDTO} entity - The data to update the resource link.
     * @returns {Promise<IResourceLinkUpdateInput>} - A promise that resolves to the updated resource link.
     * @memberof ResourceLinkController
     */
    async update(id, entity) {
        return await this.commandBus.execute(new commands_1.ResourceLinkUpdateCommand(id, entity));
    }
    /**
     * @description Deletes a resource link by its ID.
     * This endpoint deletes an existing resource link record from the database.
     *
     * @param {ID} id - The unique identifier of the resource link to delete.
     * @returns {Promise<DeleteResult>} - A promise that resolves to the result of the delete operation.
     * @memberof ResourceLinkController
     */
    async delete(id) {
        // Execute the delete operation and return the result
        return await this.resourceLinkService.delete(id);
    }
};
exports.ResourceLinkController = ResourceLinkController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Find all resource links filtered by type.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found resource links',
        type: resource_link_entity_1.ResourceLink
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, common_1.Get)(),
    (0, pipes_1.UseValidationPipe)(),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [crud_1.BaseQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], ResourceLinkController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Find resource link by ID' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found one resource link'
        // type: ResourceLink // Uncomment and specify the type if needed for API documentation
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Resource link not found'
    }),
    (0, common_1.Get)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, crud_1.FindOptionsQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], ResourceLinkController.prototype, "findById", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create a new resource link' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'The resource link has been successfully created.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input. The response body may contain details on what went wrong.'
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    (0, common_1.Post)(),
    (0, pipes_1.UseValidationPipe)({ whitelist: true }),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.CreateResourceLinkDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], ResourceLinkController.prototype, "create", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update an existing resource link' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'The resource link has been successfully updated.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'The resource link was not found.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input. The response body may contain details about what went wrong.'
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    (0, common_1.Put)(':id'),
    (0, pipes_1.UseValidationPipe)({ whitelist: true }),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, dto_1.UpdateResourceLinkDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], ResourceLinkController.prototype, "update", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Delete a resource link' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NO_CONTENT,
        description: 'The resource link has been successfully deleted.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'The resource link was not found.'
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    (0, common_1.Delete)('/:id'),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], ResourceLinkController.prototype, "delete", null);
exports.ResourceLinkController = ResourceLinkController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('Resource Links'),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard, guards_1.PermissionGuard),
    (0, common_1.Controller)('/resource-link'),
    tslib_1.__metadata("design:paramtypes", [resource_link_service_1.ResourceLinkService, cqrs_1.CommandBus])
], ResourceLinkController);
//# sourceMappingURL=resource-link.controller.js.map