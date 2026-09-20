"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationMapController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const contracts_1 = require("@gauzy/contracts");
const decorators_1 = require("./../shared/decorators");
const guards_1 = require("./../shared/guards");
let IntegrationMapController = class IntegrationMapController {
};
exports.IntegrationMapController = IntegrationMapController;
exports.IntegrationMapController = IntegrationMapController = tslib_1.__decorate([
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard, guards_1.PermissionGuard),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.INTEGRATION_ADD, contracts_1.PermissionsEnum.INTEGRATION_EDIT),
    (0, common_1.Controller)('/integration-map')
], IntegrationMapController);
//# sourceMappingURL=integration-map.controller.js.map