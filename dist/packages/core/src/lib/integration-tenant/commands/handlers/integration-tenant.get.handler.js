"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationTenantGetHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const integration_tenant_get_command_1 = require("../../../integration-tenant/commands/integration-tenant.get.command");
const integration_tenant_service_1 = require("../../../integration-tenant/integration-tenant.service");
let IntegrationTenantGetHandler = class IntegrationTenantGetHandler {
    constructor(_integrationTenantService) {
        this._integrationTenantService = _integrationTenantService;
    }
    async execute(command) {
        try {
            const { input } = command;
            return await this._integrationTenantService.findOneByOptions(input);
        }
        catch (error) {
            // Handle errors and return an appropriate error response
            throw new common_1.HttpException(`Failed to get integration tenant: ${error.message}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.IntegrationTenantGetHandler = IntegrationTenantGetHandler;
exports.IntegrationTenantGetHandler = IntegrationTenantGetHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(integration_tenant_get_command_1.IntegrationTenantGetCommand),
    tslib_1.__metadata("design:paramtypes", [integration_tenant_service_1.IntegrationTenantService])
], IntegrationTenantGetHandler);
//# sourceMappingURL=integration-tenant.get.handler.js.map