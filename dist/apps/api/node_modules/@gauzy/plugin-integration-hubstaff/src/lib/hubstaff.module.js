"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HubstaffModule = void 0;
const tslib_1 = require("tslib");
const axios_1 = require("@nestjs/axios");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const config_1 = require("@gauzy/config");
const core_1 = require("@gauzy/core");
const hubstaff_config_1 = require("./hubstaff.config");
const hubstaff_service_1 = require("./hubstaff.service");
const hubstaff_controller_1 = require("./hubstaff.controller");
const hubstaff_authorization_controller_1 = require("./hubstaff-authorization.controller");
let HubstaffModule = class HubstaffModule {
};
exports.HubstaffModule = HubstaffModule;
exports.HubstaffModule = HubstaffModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            axios_1.HttpModule.register({ baseURL: hubstaff_config_1.HUBSTAFF_API_URL }),
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
            core_1.ScreenshotModule,
            core_1.UserModule
        ],
        controllers: [hubstaff_authorization_controller_1.HubstaffAuthorizationController, hubstaff_controller_1.HubstaffController],
        providers: [hubstaff_service_1.HubstaffService]
    })
], HubstaffModule);
//# sourceMappingURL=hubstaff.module.js.map