"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationTenantCreateHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const integration_tenant_create_command_1 = require("../../commands/integration-tenant.create.command");
const integration_tenant_service_1 = require("../../integration-tenant.service");
let IntegrationTenantCreateHandler = class IntegrationTenantCreateHandler {
    constructor(_integrationTenantService) {
        this._integrationTenantService = _integrationTenantService;
    }
    async execute(command) {
        try {
            const { input } = command;
            return await this._integrationTenantService.create(input);
        }
        catch (error) {
            // Handle errors and return an appropriate error response
            console.log(`Failed to create integration tenant: %s`, error.message);
            throw new common_1.HttpException(`Failed to create integration tenant: ${error.message}`, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
exports.IntegrationTenantCreateHandler = IntegrationTenantCreateHandler;
exports.IntegrationTenantCreateHandler = IntegrationTenantCreateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(integration_tenant_create_command_1.IntegrationTenantCreateCommand),
    tslib_1.__metadata("design:paramtypes", [integration_tenant_service_1.IntegrationTenantService])
], IntegrationTenantCreateHandler);
//# sourceMappingURL=integration-tenant.create.handler.js.map