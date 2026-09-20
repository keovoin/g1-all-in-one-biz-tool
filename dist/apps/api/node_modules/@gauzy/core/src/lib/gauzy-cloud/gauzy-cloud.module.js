"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GauzyCloudModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const axios_1 = require("@nestjs/axios");
const config_1 = require("@gauzy/config");
const role_module_1 = require("./../role/role.module");
const role_permission_module_1 = require("./../role-permission/role-permission.module");
const gauzy_cloud_controller_1 = require("./gauzy-cloud.controller");
const gauzy_cloud_service_1 = require("./gauzy-cloud.service");
const handlers_1 = require("./commands/handlers");
let GauzyCloudModule = class GauzyCloudModule {
};
exports.GauzyCloudModule = GauzyCloudModule;
exports.GauzyCloudModule = GauzyCloudModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            axios_1.HttpModule.registerAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => ({
                    baseURL: configService.get('gauzyCloudEndpoint'),
                    timeout: 60 * 5 * 1000,
                    maxRedirects: 5,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }),
                inject: [config_1.ConfigService]
            }),
            cqrs_1.CqrsModule,
            role_module_1.RoleModule,
            role_permission_module_1.RolePermissionModule
        ],
        controllers: [gauzy_cloud_controller_1.GauzyCloudController],
        providers: [gauzy_cloud_service_1.GauzyCloudService, ...handlers_1.CommandHandlers]
    })
], GauzyCloudModule);
//# sourceMappingURL=gauzy-cloud.module.js.map