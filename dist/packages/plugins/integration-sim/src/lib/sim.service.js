"use strict";
var SimService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const contracts_1 = require("@gauzy/contracts");
const config_1 = require("@gauzy/config");
const core_1 = require("@gauzy/core");
const sim_client_factory_1 = require("./sim-client.factory");
const sim_repository_service_1 = require("./sim-repository.service");
const sim_config_1 = require("./sim.config");
const interfaces_1 = require("./interfaces");
const event_mapping_dto_1 = require("./dto/event-mapping.dto");
let SimService = SimService_1 = class SimService {
    constructor(configService, integrationService, integrationTenantService, simClientFactory, simRepositoryService) {
        this.configService = configService;
        this.integrationService = integrationService;
        this.integrationTenantService = integrationTenantService;
        this.simClientFactory = simClientFactory;
        this.simRepositoryService = simRepositoryService;
        this.logger = new common_1.Logger(SimService_1.name);
    }
    /**
     * Get API key for SIM API calls.
     * Looks for a tenant-specific API key in the database first, then falls back to global config.
     * @param integrationTenantId - The integration tenant ID (not the base integration ID)
     */
    async getApiKey(integrationTenantId) {
        try {
            // 1. Try tenant-specific API key from database
            if (integrationTenantId) {
                const tenantId = core_1.RequestContext.currentTenantId();
                if (!tenantId) {
                    throw new common_1.BadRequestException('Tenant ID not found in request context');
                }
                let integrationTenant = null;
                try {
                    integrationTenant = await this.integrationTenantService.findOneByOptions({
                        where: { id: integrationTenantId, tenantId },
                        relations: ['settings']
                    });
                }
                catch (error) {
                    if (!(error instanceof common_1.NotFoundException)) {
                        throw error;
                    }
                }
                const apiKeySetting = integrationTenant?.settings?.find((s) => s.settingsName === interfaces_1.SimSettingName.API_KEY);
                if (apiKeySetting?.settingsValue) {
                    return apiKeySetting.settingsValue;
                }
            }
            // 2. Fallback to global config (GAUZY_SIM_API_KEY environment variable)
            const globalApiKey = this.configService.get('sim')?.apiKey;
            if (globalApiKey) {
                return globalApiKey;
            }
            throw new common_1.InternalServerErrorException('SIM API key is not configured. Set GAUZY_SIM_API_KEY or run setupIntegration first.');
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            this.logger.error(`Failed to get SIM API key: ${error.message}`);
            throw new common_1.InternalServerErrorException('Failed to get SIM API key');
        }
    }
    /**
     * Configure SIM integration for the current tenant.
     */
    async configureIntegration(input) {
        try {
            const tenantId = core_1.RequestContext.currentTenantId();
            if (!tenantId) {
                throw new common_1.BadRequestException('Tenant ID not found in request context');
            }
            const { apiKey, organizationId } = input;
            // Find or create the base integration
            let integration = null;
            try {
                integration = await this.integrationService.findOneByOptions({
                    where: { provider: contracts_1.IntegrationEnum.SIM }
                });
            }
            catch (error) {
                if (!(error instanceof common_1.NotFoundException)) {
                    throw error;
                }
            }
            if (!integration) {
                integration = await this.integrationService.create({
                    provider: contracts_1.IntegrationEnum.SIM,
                    name: contracts_1.IntegrationEnum.SIM
                });
            }
            // Define the settings to save
            const settings = [
                {
                    settingsName: interfaces_1.SimSettingName.API_KEY,
                    settingsValue: apiKey,
                    tenantId,
                    organizationId
                },
                {
                    settingsName: interfaces_1.SimSettingName.IS_ENABLED,
                    settingsValue: JSON.stringify(true),
                    tenantId,
                    organizationId
                }
            ];
            // Look up an existing integration tenant for this tenant/org
            let existingTenant = null;
            try {
                existingTenant = await this.integrationTenantService.findOneByOptions({
                    where: {
                        tenantId,
                        integration: { provider: contracts_1.IntegrationEnum.SIM }
                    },
                    relations: ['settings']
                });
            }
            catch (error) {
                if (!(error instanceof common_1.NotFoundException)) {
                    throw error;
                }
            }
            let integrationTenantId;
            if (existingTenant?.id) {
                // Update existing tenant's settings by merging/replacing
                const existingSettings = existingTenant.settings ?? [];
                const settingsByName = new Map(settings.map((s) => [s.settingsName, s]));
                // Update existing rows in-place and track which were updated
                const updatedNames = new Set();
                const mergedSettings = existingSettings.map((existing) => {
                    const update = settingsByName.get(existing.settingsName);
                    if (update) {
                        updatedNames.add(existing.settingsName);
                        return { ...existing, settingsValue: update.settingsValue };
                    }
                    return existing;
                });
                // Append truly new settings that had no pre-existing row
                for (const [name, setting] of settingsByName) {
                    if (!updatedNames.has(name)) {
                        mergedSettings.push(setting);
                    }
                }
                await this.integrationTenantService.save({
                    ...existingTenant,
                    settings: mergedSettings
                });
                integrationTenantId = existingTenant.id;
                // Invalidate cached client to pick up new credentials
                this.simClientFactory.invalidateClient(integrationTenantId);
            }
            else {
                // Create a new integration tenant
                const integrationTenant = await this.integrationTenantService.create({
                    name: contracts_1.IntegrationEnum.SIM,
                    integration,
                    tenantId,
                    organizationId,
                    settings
                });
                if (!integrationTenant.id) {
                    throw new common_1.BadRequestException('Failed to create integration tenant: missing ID');
                }
                integrationTenantId = integrationTenant.id;
            }
            this.logger.log(`SIM integration configured for tenant ${tenantId}. ` +
                `Integration tenant ID: ${integrationTenantId}`);
            return { integrationTenantId };
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            this.logger.error('Failed to configure SIM integration:', error);
            throw new common_1.InternalServerErrorException('Failed to configure SIM integration');
        }
    }
    /**
     * Execute a SIM workflow for the current tenant.
     */
    async executeWorkflow(input) {
        const tenantId = core_1.RequestContext.currentTenantId();
        if (!tenantId) {
            throw new common_1.BadRequestException('Tenant ID is required');
        }
        // Find integration for current tenant
        let integrationTenant = null;
        try {
            integrationTenant = await this.integrationTenantService.findOneByOptions({
                where: { name: contracts_1.IntegrationEnum.SIM, tenantId },
                relations: ['settings']
            });
        }
        catch (error) {
            if (!(error instanceof common_1.NotFoundException)) {
                throw error;
            }
        }
        if (!integrationTenant?.id) {
            throw new common_1.NotFoundException('SIM integration not found for current tenant');
        }
        // Verify integration is enabled using the already-loaded settings
        const enabledSetting = integrationTenant.settings?.find((s) => s.settingsName === interfaces_1.SimSettingName.IS_ENABLED);
        if (!this.parseEnabledSetting(enabledSetting?.settingsValue)) {
            throw new common_1.BadRequestException('SIM integration is disabled for current tenant');
        }
        // Get tenant-scoped SIM client
        const client = await this.simClientFactory.getClient(integrationTenant.id);
        // Create execution log entry
        const execution = await this.simRepositoryService.create({
            workflowId: input.workflowId,
            status: 'processing',
            input: input.input,
            triggeredBy: input.triggeredBy || 'manual',
            integrationId: integrationTenant.id,
            tenantId,
            organizationId: integrationTenant.organizationId
        });
        try {
            // The simstudio-ts-sdk does not handle SSE streaming responses —
            // it always parses the response as JSON via response.json(), which fails
            // on the SSE "data: ..." text format. Reject streaming requests early.
            if (input.stream) {
                throw new common_1.BadRequestException('Streaming mode is not supported. The SIM SDK does not handle SSE responses. ' +
                    'Use runAsync: true for long-running workflows instead.');
            }
            this.logger.debug(`Executing workflow: POST ${sim_config_1.SIM_DEFAULT_BASE_URL}/api/workflows/${input.workflowId}/execute | ` +
                `async: ${input.runAsync || false}`);
            const result = await client.executeWithRetry(input.workflowId, input.input, {
                timeout: input.timeout || 30000,
                async: input.runAsync || false
            }, { maxRetries: 3, initialDelay: 1000, maxDelay: 30000, backoffMultiplier: 2 });
            this.logger.debug(`Workflow execution completed for workflow: ${input.workflowId}`);
            // Update execution log — handle both sync and async response shapes
            this.mapExecutionResult(execution, result);
            await this.simRepositoryService.save(execution);
            return result;
        }
        catch (error) {
            // Update execution log with failure
            execution.status = 'failed';
            execution.error = { message: error.message, ...(error.code ? { code: error.code } : {}) };
            await this.simRepositoryService.save(execution);
            this.logger.error(`Workflow execution failed: ${error.message}`, {
                workflowId: input.workflowId,
                tenantId,
                error: error.message
            });
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Workflow execution failed');
        }
    }
    /**
     * Get async job status.
     */
    async getJobStatus(taskId) {
        const tenantId = core_1.RequestContext.currentTenantId();
        if (!tenantId) {
            throw new common_1.BadRequestException('Tenant ID is required');
        }
        let integrationTenant = null;
        try {
            integrationTenant = await this.integrationTenantService.findOneByOptions({
                where: { name: contracts_1.IntegrationEnum.SIM, tenantId }
            });
        }
        catch (error) {
            if (!(error instanceof common_1.NotFoundException)) {
                throw error;
            }
        }
        if (!integrationTenant?.id) {
            throw new common_1.NotFoundException('SIM integration not found for current tenant');
        }
        const client = await this.simClientFactory.getClient(integrationTenant.id);
        return client.getJobStatus(taskId);
    }
    /**
     * Validate a workflow is deployed and ready.
     */
    async validateWorkflow(workflowId) {
        const tenantId = core_1.RequestContext.currentTenantId();
        if (!tenantId) {
            throw new common_1.BadRequestException('Tenant ID is required');
        }
        let integrationTenant = null;
        try {
            integrationTenant = await this.integrationTenantService.findOneByOptions({
                where: { name: contracts_1.IntegrationEnum.SIM, tenantId }
            });
        }
        catch (error) {
            if (!(error instanceof common_1.NotFoundException)) {
                throw error;
            }
        }
        if (!integrationTenant?.id) {
            throw new common_1.NotFoundException('SIM integration not found for current tenant');
        }
        const client = await this.simClientFactory.getClient(integrationTenant.id);
        return client.validateWorkflow(workflowId);
    }
    /**
     * Get integration settings (sanitized, no API key exposed).
     */
    async getIntegrationSettings() {
        const tenantId = core_1.RequestContext.currentTenantId();
        if (!tenantId) {
            throw new common_1.BadRequestException('Tenant ID not found in request context');
        }
        let integrationTenant = null;
        try {
            integrationTenant = await this.integrationTenantService.findOneByOptions({
                where: { name: contracts_1.IntegrationEnum.SIM, tenantId },
                relations: ['settings']
            });
        }
        catch (error) {
            if (!(error instanceof common_1.NotFoundException)) {
                throw error;
            }
        }
        if (!integrationTenant) {
            return { isEnabled: false, hasApiKey: false };
        }
        const enabledSetting = integrationTenant.settings?.find((s) => s.settingsName === interfaces_1.SimSettingName.IS_ENABLED);
        const apiKeySetting = integrationTenant.settings?.find((s) => s.settingsName === interfaces_1.SimSettingName.API_KEY);
        const isEnabled = this.parseEnabledSetting(enabledSetting?.settingsValue);
        return {
            isEnabled,
            hasApiKey: !!apiKeySetting?.settingsValue
        };
    }
    /**
     * Get execution history for the current tenant.
     */
    async getExecutionHistory(options) {
        const tenantId = core_1.RequestContext.currentTenantId();
        if (!tenantId) {
            throw new common_1.BadRequestException('Tenant ID is required');
        }
        const where = { tenantId };
        if (options?.workflowId)
            where.workflowId = options.workflowId;
        if (options?.status)
            where.status = options.status;
        const limit = Math.min(Math.max(options?.limit || 20, 1), 100);
        const offset = Math.max(options?.offset || 0, 0);
        const { items, total } = await this.simRepositoryService.findAll({
            where,
            order: { createdAt: 'DESC' },
            take: limit,
            skip: offset
        });
        return { data: items, total };
    }
    /**
     * Check if SIM integration is enabled for a given integration tenant.
     */
    async isIntegrationEnabled(integrationTenantId) {
        const tenantId = core_1.RequestContext.currentTenantId();
        if (!tenantId) {
            throw new common_1.BadRequestException('Tenant ID not found in request context');
        }
        let integrationTenant = null;
        try {
            integrationTenant = await this.integrationTenantService.findOneByOptions({
                where: { id: integrationTenantId, tenantId },
                relations: ['settings']
            });
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                return false;
            }
            throw error;
        }
        if (!integrationTenant) {
            return false;
        }
        const enabledSetting = integrationTenant.settings?.find((s) => s.settingsName === interfaces_1.SimSettingName.IS_ENABLED);
        return this.parseEnabledSetting(enabledSetting?.settingsValue);
    }
    /**
     * Set an event-to-workflow mapping for the current tenant.
     * When the specified Gauzy event fires, the mapped SIM workflow will be triggered automatically.
     */
    async setEventMapping(event, workflowId) {
        const tenantId = core_1.RequestContext.currentTenantId();
        if (!tenantId) {
            throw new common_1.BadRequestException('Tenant ID is required');
        }
        let integrationTenant = null;
        try {
            integrationTenant = await this.integrationTenantService.findOneByOptions({
                where: { name: contracts_1.IntegrationEnum.SIM, tenantId },
                relations: ['settings']
            });
        }
        catch (error) {
            if (!(error instanceof common_1.NotFoundException)) {
                throw error;
            }
        }
        if (!integrationTenant?.id) {
            throw new common_1.NotFoundException('SIM integration not found for current tenant');
        }
        const settingsName = `event_mapping_${event}`;
        const existingSettings = integrationTenant.settings ?? [];
        // Update or append
        const existingIndex = existingSettings.findIndex((s) => s.settingsName === settingsName);
        if (existingIndex >= 0) {
            existingSettings[existingIndex] = {
                ...existingSettings[existingIndex],
                settingsValue: workflowId
            };
        }
        else {
            existingSettings.push({
                settingsName,
                settingsValue: workflowId,
                tenantId,
                organizationId: integrationTenant.organizationId
            });
        }
        await this.integrationTenantService.save({
            ...integrationTenant,
            settings: existingSettings
        });
        this.logger.log(`Event mapping set: ${event} -> ${workflowId} for tenant ${tenantId}`);
    }
    /**
     * Remove an event-to-workflow mapping for the current tenant.
     */
    async removeEventMapping(event) {
        const tenantId = core_1.RequestContext.currentTenantId();
        if (!tenantId) {
            throw new common_1.BadRequestException('Tenant ID is required');
        }
        let integrationTenant = null;
        try {
            integrationTenant = await this.integrationTenantService.findOneByOptions({
                where: { name: contracts_1.IntegrationEnum.SIM, tenantId },
                relations: ['settings']
            });
        }
        catch (error) {
            if (!(error instanceof common_1.NotFoundException)) {
                throw error;
            }
        }
        if (!integrationTenant?.id) {
            throw new common_1.NotFoundException('SIM integration not found for current tenant');
        }
        const settingsName = `event_mapping_${event}`;
        const filteredSettings = (integrationTenant.settings ?? []).filter((s) => s.settingsName !== settingsName);
        await this.integrationTenantService.save({
            ...integrationTenant,
            settings: filteredSettings
        });
        this.logger.log(`Event mapping removed: ${event} for tenant ${tenantId}`);
    }
    /**
     * Get all event-to-workflow mappings for the current tenant.
     */
    async getEventMappings() {
        const tenantId = core_1.RequestContext.currentTenantId();
        if (!tenantId) {
            throw new common_1.BadRequestException('Tenant ID is required');
        }
        let integrationTenant = null;
        try {
            integrationTenant = await this.integrationTenantService.findOneByOptions({
                where: { name: contracts_1.IntegrationEnum.SIM, tenantId },
                relations: ['settings']
            });
        }
        catch (error) {
            if (!(error instanceof common_1.NotFoundException)) {
                throw error;
            }
        }
        if (!integrationTenant?.id) {
            return [];
        }
        const prefix = 'event_mapping_';
        return (integrationTenant.settings ?? [])
            .filter((s) => s.settingsName.startsWith(prefix) && !!s.settingsValue)
            .map((s) => ({
            event: s.settingsName.substring(prefix.length),
            workflowId: s.settingsValue
        }));
    }
    /**
     * Get the list of supported event types for workflow triggers.
     */
    getSupportedEvents() {
        return event_mapping_dto_1.SIM_SUPPORTED_EVENTS.map((event) => ({
            event,
            description: event_mapping_dto_1.SIM_EVENT_DESCRIPTIONS[event]
        }));
    }
    /**
     * Trigger a workflow from an internal Gauzy event.
     */
    async triggerEventWorkflow(params) {
        try {
            let integrationTenant = null;
            try {
                integrationTenant = await this.integrationTenantService.findOneByOptions({
                    where: { name: contracts_1.IntegrationEnum.SIM, tenantId: params.tenantId },
                    relations: ['settings']
                });
            }
            catch (error) {
                if (!(error instanceof common_1.NotFoundException)) {
                    throw error;
                }
            }
            if (!integrationTenant?.id)
                return; // SIM not configured for this tenant
            // Check if integration is enabled
            const isEnabled = integrationTenant.settings?.find((s) => s.settingsName === interfaces_1.SimSettingName.IS_ENABLED)?.settingsValue;
            const enabled = this.parseEnabledSetting(isEnabled);
            if (!enabled)
                return;
            // Find the workflow ID mapped to this event
            const eventMappingSetting = integrationTenant.settings?.find((s) => s.settingsName === `event_mapping_${params.event}`);
            if (!eventMappingSetting?.settingsValue)
                return;
            const workflowId = eventMappingSetting.settingsValue;
            const client = await this.simClientFactory.getClient(integrationTenant.id);
            // Create execution log entry
            const execution = await this.simRepositoryService.create({
                workflowId,
                status: 'queued',
                input: params.data,
                triggeredBy: 'event',
                integrationId: integrationTenant.id,
                tenantId: params.tenantId,
                organizationId: params.organizationId
            });
            try {
                // Execute asynchronously
                const result = await client.executeWithRetry(workflowId, params.data, { async: true }, { maxRetries: 3, initialDelay: 1000, maxDelay: 30000, backoffMultiplier: 2 });
                // Update execution log with result
                this.mapExecutionResult(execution, result);
                await this.simRepositoryService.save(execution);
            }
            catch (execError) {
                // Update execution log with failure
                execution.status = 'failed';
                execution.error = { message: execError.message, ...(execError.code ? { code: execError.code } : {}) };
                await this.simRepositoryService.save(execution);
                throw execError;
            }
            this.logger.log(`Event workflow triggered: ${params.event} -> ${workflowId}`);
        }
        catch (error) {
            this.logger.error(`Failed to trigger event workflow: ${error.message}`, {
                event: params.event,
                tenantId: params.tenantId
            });
        }
    }
    /**
     * Map a SIM API execution result onto a SimWorkflowExecution entity.
     * Handles both sync and async response shapes.
     */
    mapExecutionResult(execution, result) {
        const syncResult = result;
        const asyncResult = result;
        const resultAny = result;
        const taskId = asyncResult.taskId;
        if (taskId) {
            execution.status = 'queued';
        }
        else if (syncResult.success === true) {
            execution.status = 'completed';
        }
        else if (syncResult.success === false) {
            execution.status = 'failed';
        }
        else {
            execution.status = 'completed';
        }
        execution.output = syncResult.output ?? result;
        // Extract executionId — check metadata (SDK type), root level (API may return it there), or async taskId
        execution.executionId = syncResult.metadata?.executionId ?? resultAny['executionId'] ?? taskId;
        // Extract duration — check metadata (SDK type), totalDuration, or root level
        execution.duration = syncResult.metadata?.duration ?? syncResult.totalDuration ?? resultAny['duration'];
        execution.error = syncResult.error ? { message: syncResult.error } : undefined;
    }
    /**
     * Parse a setting value that may be stored as a boolean or a JSON-encoded string into a boolean.
     */
    parseEnabledSetting(value) {
        if (typeof value === 'boolean')
            return value;
        if (typeof value === 'string') {
            try {
                return !!JSON.parse(value);
            }
            catch {
                return false;
            }
        }
        return !!value;
    }
    /**
     * Get integration tenant information (with sensitive settings redacted).
     */
    async getIntegrationTenant(integrationTenantId) {
        try {
            const tenantId = core_1.RequestContext.currentTenantId();
            if (!tenantId) {
                throw new common_1.BadRequestException('Tenant ID not found in request context');
            }
            const integrationTenant = await this.integrationTenantService.findOneByOptions({
                where: {
                    id: integrationTenantId,
                    tenantId
                },
                relations: ['integration', 'settings']
            });
            // Redact sensitive settings before returning
            if (integrationTenant.settings) {
                integrationTenant.settings = integrationTenant.settings.map((setting) => {
                    if (setting.settingsName === interfaces_1.SimSettingName.API_KEY) {
                        return { ...setting, settingsValue: '••••••••' };
                    }
                    return setting;
                });
            }
            return integrationTenant;
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            this.logger.error('Failed to get SIM integration tenant:', error);
            throw new common_1.InternalServerErrorException('Failed to get SIM integration tenant');
        }
    }
};
exports.SimService = SimService;
exports.SimService = SimService = SimService_1 = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [config_1.ConfigService,
        core_1.IntegrationService,
        core_1.IntegrationTenantService,
        sim_client_factory_1.SimClientFactory,
        sim_repository_service_1.SimRepositoryService])
], SimService);
//# sourceMappingURL=sim.service.js.map