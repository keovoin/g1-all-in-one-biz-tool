"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivepiecesModule = void 0;
const tslib_1 = require("tslib");
const axios_1 = require("@nestjs/axios");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const config_1 = require("@gauzy/config");
const core_1 = require("@gauzy/core");
const activepieces_config_1 = require("./activepieces.config");
const activepieces_service_1 = require("./activepieces.service");
const activepieces_controller_1 = require("./activepieces.controller");
const activepieces_mcp_service_1 = require("./activepieces-mcp.service");
const activepieces_mcp_controller_1 = require("./activepieces-mcp.controller");
let ActivepiecesModule = class ActivepiecesModule {
};
exports.ActivepiecesModule = ActivepiecesModule;
exports.ActivepiecesModule = ActivepiecesModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            axios_1.HttpModule.register({ baseURL: activepieces_config_1.ACTIVEPIECES_API_URL }),
            cqrs_1.CqrsModule,
            config_1.ConfigModule,
            core_1.IntegrationEntitySettingModule,
            core_1.IntegrationEntitySettingTiedModule,
            core_1.IntegrationMapModule,
            core_1.IntegrationModule,
            core_1.IntegrationSettingModule,
            core_1.IntegrationTenantModule,
            core_1.OrganizationModule,
            core_1.OrganizationProjectModule,
            core_1.RoleModule,
            core_1.RolePermissionModule,
            core_1.UserModule
        ],
        controllers: [
            activepieces_controller_1.ActivepiecesController,
            activepieces_mcp_controller_1.ActivepiecesMcpController
        ],
        providers: [
            activepieces_service_1.ActivepiecesService,
            activepieces_mcp_service_1.ActivepiecesMcpService
        ],
        exports: [activepieces_service_1.ActivepiecesService, activepieces_mcp_service_1.ActivepiecesMcpService]
    })
], ActivepiecesModule);
//# sourceMappingURL=activepieces.module.js.map