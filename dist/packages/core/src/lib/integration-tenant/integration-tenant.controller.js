"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationTenantController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const swagger_1 = require("@nestjs/swagger");
const contracts_1 = require("@gauzy/contracts");
const crud_1 = require("../core/crud");
const dto_1 = require("../core/dto");
const pipes_1 = require("./../shared/pipes");
const decorators_1 = require("./../shared/decorators");
const guards_1 = require("./../shared/guards");
const dto_2 = require("./../shared/dto");
const integration_tenant_service_1 = require("./integration-tenant.service");
const dto_3 = require("./dto");
const commands_1 = require("./commands");
let IntegrationTenantController = class IntegrationTenantController extends crud_1.CrudController {
    constructor(_commandBus, _integrationTenantService) {
        super(_integrationTenantService);
        this._commandBus = _commandBus;
        this._integrationTenantService = _integrationTenantService;
    }
    /**
     * Retrieve an integration tenant by specified options.
     *
     * @param options - The input options for finding the integration tenant.
     * @returns The integration tenant if found, or `false` if not found or an error occurs.
     */
    async getIntegrationByOptions(options) {
        return await this._integrationTenantService.getIntegrationByOptions(options);
    }
    /**
     * Fetch a paginated list of IntegrationTenant entities.
     * @param params - Query parameters for pagination and filtering.
     * @returns A paginated list of IntegrationTenant entities.
     */
    async findAll(params) {
        // Delegate the logic to your service
        return await this._integrationTenantService.findAll(params);
    }
    /**
     * Fetches an IntegrationTenant entity by ID from the database.
     *
     * @param integrationId - The ID of the IntegrationTenant entity (validated by UUIDValidationPipe).
     * @param query - Optional query parameters, such as relations.
     * @returns {Promise<IIntegrationTenant>} The fetched IntegrationTenant entity.
     * @throws {InternalServerErrorException} If an error occurs during the fetching process.
     */
    async findById(integrationId, query) {
        try {
            const { relations } = query;
            // Attempt to find the IntegrationTenant entity in the database
            return await this._integrationTenantService.findOneByIdString(integrationId, { relations });
        }
        catch (error) {
            // Handle and log any errors that occur
            console.error(`Error while finding IntegrationTenant: ${error.message}`);
            // Throw an InternalServerErrorException with a generic error message
            throw new common_1.InternalServerErrorException('An error occurred while fetching the integration entity');
        }
    }
    /**
     * Update an integration tenant with the provided data.
     *
     * @param id - The identifier of the integration tenant to update.
     * @param input - The data to update the integration tenant with.
     * @returns A response, typically the updated integration tenant or an error response.
     */
    async update(id, input) {
        // Update the corresponding integration tenant with the new input data
        return await this._commandBus.execute(new commands_1.IntegrationTenantUpdateCommand(id, input));
    }
    /**
     * Delete a resource identified by the provided 'id'.
     *
     * @param {string} id - The identifier of the resource to be deleted.
     * @returns {Promise<DeleteResult>} A Promise that resolves with the DeleteResult indicating the result of the deletion.
     */
    async delete(id, query) {
        try {
            // Validate the input data (You can use class-validator for validation)
            if (!query || !query.organizationId) {
                throw new common_1.HttpException('Missing or invalid organizationId in the query parameters', common_1.HttpStatus.BAD_REQUEST);
            }
            // Execute a command to delete the resource using a command bus
            return await this._commandBus.execute(new commands_1.IntegrationTenantDeleteCommand(id, query));
        }
        catch (error) {
            // Handle errors and return an appropriate error response
            throw new common_1.HttpException(`Error while deleting integration: ${error.message}`, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
exports.IntegrationTenantController = IntegrationTenantController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Retrieve an integration tenant by specified options.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid request'
    }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.INTEGRATION_VIEW),
    (0, common_1.Get)('/integration'),
    (0, pipes_1.UseValidationPipe)(),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_3.IntegrationTenantQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], IntegrationTenantController.prototype, "getIntegrationByOptions", null);
tslib_1.__decorate([
    (0, common_1.Get)('/'),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.INTEGRATION_VIEW),
    (0, pipes_1.UseValidationPipe)(),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [crud_1.BaseQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], IntegrationTenantController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.INTEGRATION_VIEW),
    (0, common_1.Get)('/:id'),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, dto_2.RelationsQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], IntegrationTenantController.prototype, "findById", null);
tslib_1.__decorate([
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.INTEGRATION_EDIT),
    (0, common_1.Put)('/:id'),
    (0, pipes_1.UseValidationPipe)({ whitelist: true }),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, dto_3.UpdateIntegrationTenantDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], IntegrationTenantController.prototype, "update", null);
tslib_1.__decorate([
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.INTEGRATION_DELETE),
    (0, common_1.Delete)('/:id'),
    (0, pipes_1.UseValidationPipe)({ whitelist: true }),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, dto_1.TenantOrganizationBaseDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], IntegrationTenantController.prototype, "delete", null);
exports.IntegrationTenantController = IntegrationTenantController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('IntegrationTenant'),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard, guards_1.PermissionGuard),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.INTEGRATION_ADD, contracts_1.PermissionsEnum.INTEGRATION_EDIT),
    (0, common_1.Controller)('/integration-tenant'),
    tslib_1.__metadata("design:paramtypes", [cqrs_1.CommandBus,
        integration_tenant_service_1.IntegrationTenantService])
], IntegrationTenantController);
//# sourceMappingURL=integration-tenant.controller.js.map