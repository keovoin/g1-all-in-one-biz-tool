"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MakeComApiController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const core_1 = require("@gauzy/core");
const contracts_1 = require("@gauzy/contracts");
const make_com_api_service_1 = require("./make-com-api.service");
const make_com_api_model_1 = require("./interfaces/make-com-api.model");
const dto_1 = require("./dto");
let MakeComApiController = class MakeComApiController {
    constructor(makeComApiService) {
        this.makeComApiService = makeComApiService;
    }
    // ─── Helpers ────────────────────────────────────────────────────────────
    extractPagination(query) {
        const pagination = {};
        if (query.offset != null) {
            const offset = Number.parseInt(query.offset, 10);
            if (!Number.isNaN(offset))
                pagination['pg[offset]'] = offset;
        }
        if (query.limit != null) {
            const limit = Number.parseInt(query.limit, 10);
            if (!Number.isNaN(limit))
                pagination['pg[limit]'] = limit;
        }
        if (query.sortBy)
            pagination['pg[sortBy]'] = query.sortBy;
        if (query.sortDir)
            pagination['pg[sortDir]'] = query.sortDir;
        return pagination;
    }
    // ─── Setup Status ───────────────────────────────────────────────────────
    async getSetupStatus(organizationId) {
        return this.makeComApiService.getSetupStatus(organizationId);
    }
    // ─── Zone Configuration ─────────────────────────────────────────────────
    getAvailableZones() {
        return { zones: make_com_api_model_1.MAKE_COM_ZONES };
    }
    async getZone(organizationId) {
        const zone = await this.makeComApiService.getZone(organizationId);
        return { zone };
    }
    async setZone(body) {
        await this.makeComApiService.setZone(body.zone, body.organizationId);
        return { success: true, zone: body.zone };
    }
    // ─── Context (Make.com org/team selection) ──────────────────────────────
    async setMakeOrganization(body) {
        if (!body.makeOrganizationId || Number.isNaN(Number(body.makeOrganizationId))) {
            throw new common_1.BadRequestException('A valid makeOrganizationId is required');
        }
        await this.makeComApiService.setMakeOrganizationId(body.makeOrganizationId, body.organizationId);
        return { success: true, makeOrganizationId: body.makeOrganizationId };
    }
    async setMakeTeam(body) {
        if (!body.makeTeamId || Number.isNaN(Number(body.makeTeamId))) {
            throw new common_1.BadRequestException('A valid makeTeamId is required');
        }
        await this.makeComApiService.setMakeTeamId(body.makeTeamId, body.organizationId);
        return { success: true, makeTeamId: body.makeTeamId };
    }
    // ─── Organizations ──────────────────────────────────────────────────────
    async listOrganizations(organizationId) {
        const organizations = await this.makeComApiService.listOrganizations(organizationId);
        return { organizations };
    }
    async getOrganization(id, organizationId) {
        const organization = await this.makeComApiService.getOrganization(id, organizationId);
        return { organization };
    }
    // ─── Teams ──────────────────────────────────────────────────────────────
    async listTeams(makeOrgId, organizationId, query) {
        const parsedOrgId = makeOrgId ? Number.parseInt(makeOrgId, 10) : undefined;
        const validOrgId = parsedOrgId !== undefined && !Number.isNaN(parsedOrgId) ? parsedOrgId : undefined;
        const teams = await this.makeComApiService.listTeams(validOrgId, organizationId, this.extractPagination(query));
        return { teams };
    }
    async getTeam(id, organizationId) {
        const team = await this.makeComApiService.getTeam(id, organizationId);
        return { team };
    }
    // ─── Connections ────────────────────────────────────────────────────────
    async listConnections(teamId, organizationId, query) {
        const connections = await this.makeComApiService.listConnections(teamId ? Number.parseInt(teamId, 10) : undefined, organizationId, this.extractPagination(query));
        return { connections };
    }
    async getConnection(id, organizationId) {
        const connection = await this.makeComApiService.getConnection(id, organizationId);
        return { connection };
    }
    async deleteConnection(id, organizationId) {
        await this.makeComApiService.deleteConnection(id, organizationId);
    }
    async testConnection(id, organizationId) {
        return this.makeComApiService.testConnection(id, organizationId);
    }
    // ─── Scenarios ──────────────────────────────────────────────────────────
    async listScenarios(teamId, organizationId, query) {
        const scenarios = await this.makeComApiService.listScenarios(teamId ? Number.parseInt(teamId, 10) : undefined, organizationId, this.extractPagination(query));
        return { scenarios };
    }
    async getScenario(id, organizationId) {
        const scenario = await this.makeComApiService.getScenario(id, organizationId);
        return { scenario };
    }
    async createScenario(body, organizationId) {
        const scenario = await this.makeComApiService.createScenario(body, organizationId);
        return { scenario };
    }
    async updateScenario(id, body, organizationId) {
        const scenario = await this.makeComApiService.updateScenario(id, body, organizationId);
        return { scenario };
    }
    async deleteScenario(id, organizationId) {
        await this.makeComApiService.deleteScenario(id, organizationId);
    }
    async startScenario(id, organizationId) {
        const scenario = await this.makeComApiService.startScenario(id, organizationId);
        return { scenario };
    }
    async stopScenario(id, organizationId) {
        const scenario = await this.makeComApiService.stopScenario(id, organizationId);
        return { scenario };
    }
    async runScenario(id, body, organizationId) {
        return this.makeComApiService.runScenario(id, organizationId, body);
    }
    // ─── Hooks (Webhooks) ───────────────────────────────────────────────────
    async listHooks(teamId, organizationId, query) {
        const hooks = await this.makeComApiService.listHooks(teamId ? Number.parseInt(teamId, 10) : undefined, organizationId, this.extractPagination(query));
        return { hooks };
    }
    async getHook(id, organizationId) {
        const hook = await this.makeComApiService.getHook(id, organizationId);
        return { hook };
    }
    async createHook(body, organizationId) {
        const hook = await this.makeComApiService.createHook(body, organizationId);
        return { hook };
    }
    async updateHook(id, body, organizationId) {
        const hook = await this.makeComApiService.updateHook(id, body.name, organizationId);
        return { hook };
    }
    async deleteHook(id, organizationId) {
        await this.makeComApiService.deleteHook(id, organizationId);
    }
    async pingHook(id, organizationId) {
        return this.makeComApiService.pingHook(id, organizationId);
    }
    async enableHook(id, organizationId) {
        await this.makeComApiService.enableHook(id, organizationId);
        return { success: true };
    }
    async disableHook(id, organizationId) {
        await this.makeComApiService.disableHook(id, organizationId);
        return { success: true };
    }
    // ─── Templates ──────────────────────────────────────────────────────────
    async listTemplates(teamId, organizationId, query) {
        const templates = await this.makeComApiService.listTemplates(teamId ? Number.parseInt(teamId, 10) : undefined, organizationId, this.extractPagination(query));
        return { templates };
    }
    async getTemplate(id, organizationId) {
        const template = await this.makeComApiService.getTemplate(id, organizationId);
        return { template };
    }
    async getTemplateBlueprint(id, organizationId) {
        return this.makeComApiService.getTemplateBlueprint(id, organizationId);
    }
};
exports.MakeComApiController = MakeComApiController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get Make.com setup status (zone, org, team, token)' }),
    (0, common_1.Get)('/setup-status'),
    tslib_1.__param(0, (0, common_1.Query)('organizationId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], MakeComApiController.prototype, "getSetupStatus", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get available Make.com zones' }),
    (0, common_1.Get)('/zones'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], MakeComApiController.prototype, "getAvailableZones", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get the configured zone for this tenant' }),
    (0, common_1.Get)('/zone'),
    tslib_1.__param(0, (0, common_1.Query)('organizationId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], MakeComApiController.prototype, "getZone", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Set the Make.com zone for this tenant' }),
    (0, common_1.Post)('/zone'),
    (0, core_1.UseValidationPipe)({ whitelist: true }),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.SetZoneDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], MakeComApiController.prototype, "setZone", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Set the Make.com organization ID for this tenant' }),
    (0, common_1.Post)('/context/organization'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], MakeComApiController.prototype, "setMakeOrganization", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Set the Make.com team ID for this tenant' }),
    (0, common_1.Post)('/context/team'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], MakeComApiController.prototype, "setMakeTeam", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'List Make.com organizations for the authenticated user' }),
    (0, common_1.Get)('/organizations'),
    tslib_1.__param(0, (0, common_1.Query)('organizationId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], MakeComApiController.prototype, "listOrganizations", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get a Make.com organization by ID' }),
    (0, common_1.Get)('/organizations/:id'),
    tslib_1.__param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    tslib_1.__param(1, (0, common_1.Query)('organizationId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, String]),
    tslib_1.__metadata("design:returntype", Promise)
], MakeComApiController.prototype, "getOrganization", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'List Make.com teams' }),
    (0, swagger_1.ApiQuery)({ name: 'makeOrgId', required: false, type: Number }),
    (0, common_1.Get)('/teams'),
    tslib_1.__param(0, (0, common_1.Query)('makeOrgId')),
    tslib_1.__param(1, (0, common_1.Query)('organizationId')),
    tslib_1.__param(2, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], MakeComApiController.prototype, "listTeams", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get a Make.com team by ID' }),
    (0, common_1.Get)('/teams/:id'),
    tslib_1.__param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    tslib_1.__param(1, (0, common_1.Query)('organizationId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, String]),
    tslib_1.__metadata("design:returntype", Promise)
], MakeComApiController.prototype, "getTeam", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'List Make.com connections' }),
    (0, swagger_1.ApiQuery)({ name: 'teamId', required: false, type: Number }),
    (0, common_1.Get)('/connections'),
    tslib_1.__param(0, (0, common_1.Query)('teamId')),
    tslib_1.__param(1, (0, common_1.Query)('organizationId')),
    tslib_1.__param(2, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], MakeComApiController.prototype, "listConnections", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get a Make.com connection by ID' }),
    (0, common_1.Get)('/connections/:id'),
    tslib_1.__param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    tslib_1.__param(1, (0, common_1.Query)('organizationId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, String]),
    tslib_1.__metadata("design:returntype", Promise)
], MakeComApiController.prototype, "getConnection", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Delete a Make.com connection' }),
    (0, common_1.Delete)('/connections/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    tslib_1.__param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    tslib_1.__param(1, (0, common_1.Query)('organizationId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, String]),
    tslib_1.__metadata("design:returntype", Promise)
], MakeComApiController.prototype, "deleteConnection", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Test a Make.com connection' }),
    (0, common_1.Post)('/connections/:id/test'),
    tslib_1.__param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    tslib_1.__param(1, (0, common_1.Query)('organizationId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, String]),
    tslib_1.__metadata("design:returntype", Promise)
], MakeComApiController.prototype, "testConnection", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'List Make.com scenarios' }),
    (0, swagger_1.ApiQuery)({ name: 'teamId', required: false, type: Number }),
    (0, common_1.Get)('/scenarios'),
    tslib_1.__param(0, (0, common_1.Query)('teamId')),
    tslib_1.__param(1, (0, common_1.Query)('organizationId')),
    tslib_1.__param(2, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], MakeComApiController.prototype, "listScenarios", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get a Make.com scenario by ID' }),
    (0, common_1.Get)('/scenarios/:id'),
    tslib_1.__param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    tslib_1.__param(1, (0, common_1.Query)('organizationId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, String]),
    tslib_1.__metadata("design:returntype", Promise)
], MakeComApiController.prototype, "getScenario", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create a Make.com scenario' }),
    (0, common_1.Post)('/scenarios'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__param(1, (0, common_1.Query)('organizationId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, String]),
    tslib_1.__metadata("design:returntype", Promise)
], MakeComApiController.prototype, "createScenario", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update a Make.com scenario' }),
    (0, common_1.Patch)('/scenarios/:id'),
    tslib_1.__param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__param(2, (0, common_1.Query)('organizationId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, Object, String]),
    tslib_1.__metadata("design:returntype", Promise)
], MakeComApiController.prototype, "updateScenario", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Delete a Make.com scenario' }),
    (0, common_1.Delete)('/scenarios/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    tslib_1.__param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    tslib_1.__param(1, (0, common_1.Query)('organizationId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, String]),
    tslib_1.__metadata("design:returntype", Promise)
], MakeComApiController.prototype, "deleteScenario", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Activate a Make.com scenario' }),
    (0, common_1.Post)('/scenarios/:id/start'),
    tslib_1.__param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    tslib_1.__param(1, (0, common_1.Query)('organizationId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, String]),
    tslib_1.__metadata("design:returntype", Promise)
], MakeComApiController.prototype, "startScenario", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Deactivate a Make.com scenario' }),
    (0, common_1.Post)('/scenarios/:id/stop'),
    tslib_1.__param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    tslib_1.__param(1, (0, common_1.Query)('organizationId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, String]),
    tslib_1.__metadata("design:returntype", Promise)
], MakeComApiController.prototype, "stopScenario", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Run a Make.com scenario on demand' }),
    (0, common_1.Post)('/scenarios/:id/run'),
    tslib_1.__param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__param(2, (0, common_1.Query)('organizationId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, Object, String]),
    tslib_1.__metadata("design:returntype", Promise)
], MakeComApiController.prototype, "runScenario", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'List Make.com hooks (webhooks)' }),
    (0, swagger_1.ApiQuery)({ name: 'teamId', required: false, type: Number }),
    (0, common_1.Get)('/hooks'),
    tslib_1.__param(0, (0, common_1.Query)('teamId')),
    tslib_1.__param(1, (0, common_1.Query)('organizationId')),
    tslib_1.__param(2, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], MakeComApiController.prototype, "listHooks", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get a Make.com hook by ID' }),
    (0, common_1.Get)('/hooks/:id'),
    tslib_1.__param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    tslib_1.__param(1, (0, common_1.Query)('organizationId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, String]),
    tslib_1.__metadata("design:returntype", Promise)
], MakeComApiController.prototype, "getHook", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create a Make.com hook (webhook)' }),
    (0, common_1.Post)('/hooks'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__param(1, (0, common_1.Query)('organizationId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, String]),
    tslib_1.__metadata("design:returntype", Promise)
], MakeComApiController.prototype, "createHook", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update a Make.com hook name' }),
    (0, common_1.Patch)('/hooks/:id'),
    tslib_1.__param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__param(2, (0, common_1.Query)('organizationId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, Object, String]),
    tslib_1.__metadata("design:returntype", Promise)
], MakeComApiController.prototype, "updateHook", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Delete a Make.com hook' }),
    (0, common_1.Delete)('/hooks/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    tslib_1.__param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    tslib_1.__param(1, (0, common_1.Query)('organizationId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, String]),
    tslib_1.__metadata("design:returntype", Promise)
], MakeComApiController.prototype, "deleteHook", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Ping a Make.com hook' }),
    (0, common_1.Get)('/hooks/:id/ping'),
    tslib_1.__param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    tslib_1.__param(1, (0, common_1.Query)('organizationId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, String]),
    tslib_1.__metadata("design:returntype", Promise)
], MakeComApiController.prototype, "pingHook", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Enable a Make.com hook' }),
    (0, common_1.Post)('/hooks/:id/enable'),
    tslib_1.__param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    tslib_1.__param(1, (0, common_1.Query)('organizationId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, String]),
    tslib_1.__metadata("design:returntype", Promise)
], MakeComApiController.prototype, "enableHook", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Disable a Make.com hook' }),
    (0, common_1.Post)('/hooks/:id/disable'),
    tslib_1.__param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    tslib_1.__param(1, (0, common_1.Query)('organizationId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, String]),
    tslib_1.__metadata("design:returntype", Promise)
], MakeComApiController.prototype, "disableHook", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'List Make.com templates' }),
    (0, swagger_1.ApiQuery)({ name: 'teamId', required: false, type: Number }),
    (0, common_1.Get)('/templates'),
    tslib_1.__param(0, (0, common_1.Query)('teamId')),
    tslib_1.__param(1, (0, common_1.Query)('organizationId')),
    tslib_1.__param(2, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], MakeComApiController.prototype, "listTemplates", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get a Make.com template by ID' }),
    (0, common_1.Get)('/templates/:id'),
    tslib_1.__param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    tslib_1.__param(1, (0, common_1.Query)('organizationId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, String]),
    tslib_1.__metadata("design:returntype", Promise)
], MakeComApiController.prototype, "getTemplate", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get the blueprint of a Make.com template' }),
    (0, common_1.Get)('/templates/:id/blueprint'),
    tslib_1.__param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    tslib_1.__param(1, (0, common_1.Query)('organizationId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, String]),
    tslib_1.__metadata("design:returntype", Promise)
], MakeComApiController.prototype, "getTemplateBlueprint", null);
exports.MakeComApiController = MakeComApiController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('Make.com API'),
    (0, common_1.UseGuards)(core_1.TenantPermissionGuard, core_1.PermissionGuard),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.INTEGRATION_ADD, contracts_1.PermissionsEnum.INTEGRATION_EDIT),
    (0, common_1.Controller)('/integration/make-com/api'),
    tslib_1.__metadata("design:paramtypes", [make_com_api_service_1.MakeComApiService])
], MakeComApiController);
//# sourceMappingURL=make-com-api.controller.js.map