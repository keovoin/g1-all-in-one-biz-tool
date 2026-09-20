"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const config_service_1 = require("./config.service");
const config_2 = require("./config");
let ConfigModule = class ConfigModule {
};
exports.ConfigModule = ConfigModule;
exports.ConfigModule = ConfigModule = tslib_1.__decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            /**
             * The NestConfigModule.forRoot method is used to configure the root module for handling configuration settings.
             * The 'load' option is used to load configuration modules for different providers.
             */
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                cache: true,
                load: [...config_2.default]
            })
        ],
        providers: [config_service_1.ConfigService],
        exports: [config_service_1.ConfigService]
    })
], ConfigModule);
//# sourceMappingURL=config.module.js.map