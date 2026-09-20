"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CopyPluginPlanCommand = void 0;
class CopyPluginPlanCommand {
    constructor(copyDto, tenantId, organizationId, userId) {
        this.copyDto = copyDto;
        this.tenantId = tenantId;
        this.organizationId = organizationId;
        this.userId = userId;
    }
}
exports.CopyPluginPlanCommand = CopyPluginPlanCommand;
CopyPluginPlanCommand.type = '[Plugin Subscription Plan] Copy';
//# sourceMappingURL=copy-plugin-plan.command.js.map