"use strict";
var SimController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const contracts_1 = require("@gauzy/contracts");
const core_1 = require("@gauzy/core");
const sim_service_1 = require("./sim.service");
const dto_1 = require("./dto");
const event_mapping_dto_1 = require("./dto/event-mapping.dto");
let SimController = SimController_1 = class SimController {
    constructor(simService) {
        this.simService = simService;
        this.logger = new common_1.Logger(SimController_1.name);
    }
    /**
     * Configure SIM integration for the current tenant.
     */
    async setupIntegration(body, organizationId) {
        try {
            return await this.simService.configureIntegration({
                apiKey: body.apiKey,
                organizationId
            });
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            this.logger.error('Failed to configure SIM integration', { message: error?.message, stack: error?.stack });
            throw new common_1.HttpException('Failed to configure SIM integration', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    /**
     * Get SIM integration settings (sanitized).
     */
    async getSettings() {
        try {
            return await this.simService.getIntegrationSettings();
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            this.logger.error('Failed to get SIM settings', { message: error?.message, stack: error?.stack });
            throw new common_1.HttpException('Failed to get SIM integration settings', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    /**
     * Execute a SIM workflow.
     */
    async executeWorkflow(workflowId, body) {
        try {
            return await this.simService.executeWorkflow({
                workflowId,
                input: body.input,
                timeout: body.timeout,
                runAsync: body.runAsync,
                triggeredBy: 'manual'
            });
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            this.logger.error('Failed to execute SIM workflow', { message: error?.message, stack: error?.stack });
            throw new common_1.HttpException('Failed to execute SIM workflow', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    /**
     * Validate a workflow is deployed and ready.
     */
    async validateWorkflow(workflowId) {
        try {
            const isValid = await this.simService.validateWorkflow(workflowId);
            return { workflowId, isDeployed: isValid };
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            this.logger.error('Failed to validate SIM workflow', { message: error?.message, stack: error?.stack });
            throw new common_1.HttpException('Failed to validate SIM workflow', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    /**
     * Get async job status.
     */
    async getJobStatus(taskId) {
        try {
            return await this.simService.getJobStatus(taskId);
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            this.logger.error('Failed to get SIM job status', { message: error?.message, stack: error?.stack });
            throw new common_1.HttpException('Failed to get SIM job status', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    /**
     * Get execution history.
     */
    async getExecutionHistory(query) {
        try {
            return await this.simService.getExecutionHistory(query);
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            this.logger.error('Failed to get SIM execution history', { message: error?.message, stack: error?.stack });
            throw new common_1.HttpException('Failed to get SIM execution history', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    /**
     * Check if SIM integration is enabled.
     */
    async getIntegrationStatus(integrationTenantId) {
        try {
            const enabled = await this.simService.isIntegrationEnabled(integrationTenantId);
            return { enabled };
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            this.logger.error('Failed to get SIM integration status', { message: error?.message, stack: error?.stack });
            throw new common_1.HttpException('Failed to get SIM integration status', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    /**
     * Get integration tenant information (with sensitive settings redacted).
     */
    async getIntegrationTenant(integrationTenantId) {
        try {
            return await this.simService.getIntegrationTenant(integrationTenantId);
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            this.logger.error('Failed to get SIM integration tenant', { message: error?.message, stack: error?.stack });
            throw new common_1.HttpException('Failed to get SIM integration tenant', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    // ─── Event-to-Workflow Mapping Endpoints ──────────────────────────────
    /**
     * Get supported event types for workflow triggers.
     */
    getSupportedEvents() {
        return this.simService.getSupportedEvents();
    }
    /**
     * Get all event-to-workflow mappings for the current tenant.
     */
    async getEventMappings() {
        try {
            return await this.simService.getEventMappings();
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            this.logger.error('Failed to get SIM event mappings', { message: error?.message, stack: error?.stack });
            throw new common_1.HttpException('Failed to get SIM event mappings', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    /**
     * Set an event-to-workflow mapping.
     */
    async setEventMapping(body) {
        try {
            await this.simService.setEventMapping(body.event, body.workflowId);
            return { event: body.event, workflowId: body.workflowId };
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            this.logger.error('Failed to set SIM event mapping', { message: error?.message, stack: error?.stack });
            throw new common_1.HttpException('Failed to set SIM event mapping', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    /**
     * Remove an event-to-workflow mapping.
     */
    async removeEventMapping(event) {
        try {
            if (!event_mapping_dto_1.SIM_SUPPORTED_EVENTS.includes(event)) {
                throw new common_1.HttpException(`Invalid event type: ${event}`, common_1.HttpStatus.BAD_REQUEST);
            }
            await this.simService.removeEventMapping(event);
            return { removed: true, event };
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            this.logger.error('Failed to remove SIM event mapping', { message: error?.message, stack: error?.stack });
            throw new common_1.HttpException('Failed to remove SIM event mapping', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.SimController = SimController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Configure SIM integration with API key' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'SIM integration configured successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request' }),
    (0, swagger_1.ApiQuery)({ name: 'organizationId', required: false, description: 'Optional organization ID to scope the integration' }),
    (0, common_1.Post)('/setup'),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.INTEGRATION_ADD),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, transform: true })),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__param(1, (0, common_1.Query)('organizationId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.ConfigureSimIntegrationDto, String]),
    tslib_1.__metadata("design:returntype", Promise)
], SimController.prototype, "setupIntegration", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get SIM integration settings' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'SIM integration settings retrieved' }),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.INTEGRATION_VIEW),
    (0, common_1.Get)('/settings'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], SimController.prototype, "getSettings", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Execute a SIM workflow' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Workflow executed successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Integration or workflow not found' }),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.INTEGRATION_EDIT),
    (0, common_1.Post)('/workflows/:workflowId/execute'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, transform: true })),
    tslib_1.__param(0, (0, common_1.Param)('workflowId')),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, dto_1.ExecuteWorkflowDto]),
    tslib_1.__metadata("design:returntype", Promise)
], SimController.prototype, "executeWorkflow", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Validate a SIM workflow' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Workflow validation result' }),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.INTEGRATION_VIEW),
    (0, common_1.Get)('/workflows/:workflowId/validate'),
    tslib_1.__param(0, (0, common_1.Param)('workflowId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], SimController.prototype, "validateWorkflow", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get async job status' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Job status retrieved' }),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.INTEGRATION_VIEW),
    (0, common_1.Get)('/jobs/:taskId/status'),
    tslib_1.__param(0, (0, common_1.Param)('taskId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], SimController.prototype, "getJobStatus", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get workflow execution history' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Execution history retrieved' }),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.INTEGRATION_VIEW),
    (0, common_1.Get)('/executions'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, transform: true })),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.WorkflowExecutionQueryDto]),
    tslib_1.__metadata("design:returntype", Promise)
], SimController.prototype, "getExecutionHistory", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Check if SIM integration is enabled' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns integration status' }),
    (0, common_1.Get)('/status/:integrationTenantId'),
    (0, swagger_1.ApiParam)({ name: 'integrationTenantId', description: 'Integration Tenant UUID' }),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.INTEGRATION_VIEW),
    tslib_1.__param(0, (0, common_1.Param)('integrationTenantId', core_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], SimController.prototype, "getIntegrationStatus", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get SIM integration tenant information' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns integration tenant information' }),
    (0, common_1.Get)('/integration-tenant/:integrationTenantId'),
    (0, swagger_1.ApiParam)({ name: 'integrationTenantId', description: 'Integration Tenant UUID' }),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.INTEGRATION_VIEW),
    tslib_1.__param(0, (0, common_1.Param)('integrationTenantId', core_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], SimController.prototype, "getIntegrationTenant", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get supported event types for SIM workflow triggers' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns list of supported event types' }),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.INTEGRATION_VIEW),
    (0, common_1.Get)('/events/supported'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], SimController.prototype, "getSupportedEvents", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get all event-to-workflow mappings' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns list of event-to-workflow mappings' }),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.INTEGRATION_VIEW),
    (0, common_1.Get)('/events/mappings'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], SimController.prototype, "getEventMappings", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Set an event-to-workflow mapping for automatic workflow triggers' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Event mapping saved' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'SIM integration not found' }),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.INTEGRATION_EDIT),
    (0, common_1.Post)('/events/mappings'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, transform: true })),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.EventMappingDto]),
    tslib_1.__metadata("design:returntype", Promise)
], SimController.prototype, "setEventMapping", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Remove an event-to-workflow mapping' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Event mapping removed' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'SIM integration not found' }),
    (0, swagger_1.ApiParam)({ name: 'event', description: 'The event type to remove from mapping (e.g., timer.started)' }),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.INTEGRATION_EDIT),
    (0, common_1.Delete)('/events/mappings/:event'),
    tslib_1.__param(0, (0, common_1.Param)('event')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], SimController.prototype, "removeEventMapping", null);
exports.SimController = SimController = SimController_1 = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('SIM Integration'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(core_1.TenantPermissionGuard),
    (0, common_1.Controller)('/integration/sim'),
    tslib_1.__metadata("design:paramtypes", [sim_service_1.SimService])
], SimController);
//# sourceMappingURL=sim.controller.js.map