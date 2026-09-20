"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginOwnerGuard = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@gauzy/core");
const common_1 = require("@nestjs/common");
const plugin_service_1 = require("../../domain/services/plugin.service");
let PluginOwnerGuard = class PluginOwnerGuard {
    constructor(pluginService) {
        this.pluginService = pluginService;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const pluginId = this.getPluginIdFromRequest(request);
        const userId = core_1.RequestContext.currentUserId();
        if (!pluginId) {
            throw new common_1.ForbiddenException('Plugin ID is required.');
        }
        if (!userId) {
            throw new common_1.ForbiddenException('User ID is required.');
        }
        const isOwner = await this.pluginService.validatePluginOwnership(pluginId, userId);
        if (!isOwner) {
            throw new common_1.ForbiddenException('You do not have permission to access this plugin.');
        }
        return true;
    }
    getPluginIdFromRequest(request) {
        return request.params?.id || request.body?.id || request.params?.pluginId || request.body?.pluginId;
    }
};
exports.PluginOwnerGuard = PluginOwnerGuard;
exports.PluginOwnerGuard = PluginOwnerGuard = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [plugin_service_1.PluginService])
], PluginOwnerGuard);
//# sourceMappingURL=plugin-owner.guard.js.map