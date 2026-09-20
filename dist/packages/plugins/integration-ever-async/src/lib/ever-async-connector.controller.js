"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EverAsyncConnectorController = exports.EverAsyncConnectorGuard = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const common_2 = require("@gauzy/common");
const ever_async_rate_limit_guard_1 = require("./ever-async-rate-limit.guard");
const ever_async_integration_service_1 = require("./ever-async-integration.service");
let EverAsyncConnectorGuard = class EverAsyncConnectorGuard {
    constructor(service) {
        this.service = service;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        request.everAsyncScope = await this.service.authenticateConnector(request.get('X-INTEGRATION-ID') ?? '', request.get('X-APP-ID') ?? '', request.get('X-API-KEY') ?? '');
        return true;
    }
};
exports.EverAsyncConnectorGuard = EverAsyncConnectorGuard;
exports.EverAsyncConnectorGuard = EverAsyncConnectorGuard = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [ever_async_integration_service_1.EverAsyncIntegrationService])
], EverAsyncConnectorGuard);
/** Public bypasses the user JWT guard only; the dedicated credential guard is mandatory. */
let EverAsyncConnectorController = class EverAsyncConnectorController {
    constructor(service) {
        this.service = service;
    }
    status(request) {
        const { integrationTenantId, tenantId, organizationId } = request.everAsyncScope;
        return { integrationTenantId, tenantId, organizationId, isEnabled: true };
    }
    tasks(request, chatUserId, taskId, channel, workspace) {
        return this.service.getConnectorTasks(request.everAsyncScope, { chatUserId, taskId, channel, workspace });
    }
};
exports.EverAsyncConnectorController = EverAsyncConnectorController;
tslib_1.__decorate([
    (0, common_1.Get)('/status'),
    (0, common_1.Header)('Cache-Control', 'no-store'),
    tslib_1.__param(0, (0, common_1.Req)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], EverAsyncConnectorController.prototype, "status", null);
tslib_1.__decorate([
    (0, common_1.Get)('/tasks'),
    (0, common_1.Header)('Cache-Control', 'no-store'),
    tslib_1.__param(0, (0, common_1.Req)()),
    tslib_1.__param(1, (0, common_1.Query)('chatUserId')),
    tslib_1.__param(2, (0, common_1.Query)('taskId')),
    tslib_1.__param(3, (0, common_1.Query)('channel')),
    tslib_1.__param(4, (0, common_1.Query)('workspace')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, String, String, String, String]),
    tslib_1.__metadata("design:returntype", void 0)
], EverAsyncConnectorController.prototype, "tasks", null);
exports.EverAsyncConnectorController = EverAsyncConnectorController = tslib_1.__decorate([
    (0, common_2.Public)(),
    (0, common_1.UseGuards)(ever_async_rate_limit_guard_1.EverAsyncRateLimitGuard, EverAsyncConnectorGuard),
    (0, swagger_1.ApiTags)('Ever Async Connector'),
    (0, swagger_1.ApiHeader)({ name: 'X-INTEGRATION-ID', required: true }),
    (0, swagger_1.ApiHeader)({ name: 'X-APP-ID', required: true }),
    (0, swagger_1.ApiHeader)({ name: 'X-API-KEY', required: true }),
    (0, common_1.Controller)('/integration/ever-async/connector'),
    tslib_1.__metadata("design:paramtypes", [ever_async_integration_service_1.EverAsyncIntegrationService])
], EverAsyncConnectorController);
//# sourceMappingURL=ever-async-connector.controller.js.map