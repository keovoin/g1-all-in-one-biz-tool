"use strict";
var ActivepiecesMcpController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivepiecesMcpController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const dto_1 = require("./dto");
const swagger_1 = require("@nestjs/swagger");
const contracts_1 = require("@gauzy/contracts");
const core_1 = require("@gauzy/core");
const common_2 = require("@nestjs/common");
const activepieces_mcp_service_1 = require("./activepieces-mcp.service");
let ActivepiecesMcpController = ActivepiecesMcpController_1 = class ActivepiecesMcpController {
    constructor(activepiecesMcpService) {
        this.activepiecesMcpService = activepiecesMcpService;
        this.logger = new common_1.Logger(ActivepiecesMcpController_1.name);
    }
    /**
     * Remove sensitive token field from MCP server object
     */
    sanitizeMcpServer(server) {
        const { token, ...publicServer } = server;
        return publicServer;
    }
    /**
     * Validate and trim ID parameter
     */
    validateAndTrimId(paramName, value) {
        const trimmed = value?.trim();
        if (!trimmed) {
            throw new common_1.HttpException(`${paramName} is required`, common_1.HttpStatus.BAD_REQUEST);
        }
        return trimmed;
    }
    /**
     * Handle errors consistently across all controller methods
     */
    handleError(publicMessage, error, fallbackStatus = common_1.HttpStatus.INTERNAL_SERVER_ERROR) {
        if (error instanceof common_1.HttpException)
            throw error;
        const status = error?.status || fallbackStatus;
        this.logger.error(`${publicMessage}: ${error?.message}`, error?.stack);
        throw new common_1.HttpException(publicMessage, status);
    }
    /**
     * List MCP servers for a project
     */
    async listMcpServers(query) {
        try {
            const result = await this.activepiecesMcpService.listMcpServers(query);
            // Remove sensitive token field from each server
            return {
                data: result.data.map((server) => this.sanitizeMcpServer(server)),
                next: result.next,
                previous: result.previous
            };
        }
        catch (error) {
            this.handleError('Failed to list ActivePieces MCP servers', error);
        }
    }
    /**
     * Get MCP servers for current tenant
     */
    async getTenantMcpServers({ projectId }) {
        try {
            const servers = await this.activepiecesMcpService.getTenantMcpServers(projectId);
            return servers.map((server) => this.sanitizeMcpServer(server));
        }
        catch (error) {
            this.handleError('Failed to get tenant ActivePieces MCP servers', error);
        }
    }
    /**
     * Get MCP server by ID
     */
    async getMcpServer(serverId) {
        try {
            const id = this.validateAndTrimId('Server ID', serverId);
            const server = await this.activepiecesMcpService.getMcpServer(id);
            return this.sanitizeMcpServer(server);
        }
        catch (error) {
            this.handleError('Failed to get ActivePieces MCP server', error);
        }
    }
    /**
     * Update MCP server
     */
    async updateMcpServer(serverId, updateData) {
        try {
            const id = this.validateAndTrimId('Server ID', serverId);
            const server = await this.activepiecesMcpService.updateMcpServer(id, updateData);
            return this.sanitizeMcpServer(server);
        }
        catch (error) {
            this.handleError('Failed to update ActivePieces MCP server', error);
        }
    }
    /**
     * Rotate MCP server token
     */
    async rotateMcpServerToken(serverId) {
        try {
            const id = this.validateAndTrimId('Server ID', serverId);
            const server = await this.activepiecesMcpService.rotateMcpServerToken(id);
            return this.sanitizeMcpServer(server);
        }
        catch (error) {
            this.handleError('Failed to rotate ActivePieces MCP server token', error);
        }
    }
};
exports.ActivepiecesMcpController = ActivepiecesMcpController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'List ActivePieces MCP servers for a project' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns list of MCP servers',
        schema: {
            type: 'object',
            properties: {
                data: {
                    type: 'array',
                    items: { type: 'object' }
                },
                next: { type: 'string', nullable: true },
                previous: { type: 'string', nullable: true }
            }
        }
    }),
    (0, common_1.Get)(),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.INTEGRATION_VIEW),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.ListMcpServersDto]),
    tslib_1.__metadata("design:returntype", Promise)
], ActivepiecesMcpController.prototype, "listMcpServers", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get ActivePieces MCP servers for current tenant' }),
    (0, swagger_1.ApiQuery)({ name: 'projectId', required: true, type: String, description: 'ActivePieces project ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns tenant MCP servers',
        schema: {
            type: 'array',
            items: { type: 'object' }
        }
    }),
    (0, common_1.Get)('/tenant'),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.INTEGRATION_VIEW),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.ListMcpServersDto]),
    tslib_1.__metadata("design:returntype", Promise)
], ActivepiecesMcpController.prototype, "getTenantMcpServers", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get ActivePieces MCP server by ID' }),
    (0, swagger_1.ApiParam)({ name: 'serverId', required: true, type: String, description: 'MCP server ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns MCP server details',
        schema: { type: 'object' }
    }),
    (0, common_1.Get)('/:serverId'),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.INTEGRATION_VIEW),
    tslib_1.__param(0, (0, common_1.Param)('serverId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], ActivepiecesMcpController.prototype, "getMcpServer", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update ActivePieces MCP server' }),
    (0, swagger_1.ApiParam)({ name: 'serverId', required: true, type: String, description: 'MCP server ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns updated MCP server',
        schema: { type: 'object' }
    }),
    (0, common_1.Patch)('/:serverId'),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.INTEGRATION_EDIT),
    tslib_1.__param(0, (0, common_1.Param)('serverId')),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, dto_1.ActivepiecesMcpUpdateDto]),
    tslib_1.__metadata("design:returntype", Promise)
], ActivepiecesMcpController.prototype, "updateMcpServer", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Rotate ActivePieces MCP server token' }),
    (0, swagger_1.ApiParam)({ name: 'serverId', required: true, type: String, description: 'MCP server ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns MCP server (token is not returned)',
        schema: { type: 'object' }
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Post)('/:serverId/rotate'),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.INTEGRATION_EDIT),
    tslib_1.__param(0, (0, common_1.Param)('serverId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], ActivepiecesMcpController.prototype, "rotateMcpServerToken", null);
exports.ActivepiecesMcpController = ActivepiecesMcpController = ActivepiecesMcpController_1 = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('ActivePieces MCP Server Integration'),
    (0, common_2.UseGuards)(core_1.TenantPermissionGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, transform: true })),
    (0, common_1.Controller)('/integration/activepieces/mcp'),
    tslib_1.__metadata("design:paramtypes", [activepieces_mcp_service_1.ActivepiecesMcpService])
], ActivepiecesMcpController);
//# sourceMappingURL=activepieces-mcp.controller.js.map