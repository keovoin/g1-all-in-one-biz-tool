"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessTokenModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const token_module_1 = require("../token/token.module");
const access_token_service_1 = require("./access-token.service");
const type_token_1 = require("./type.token");
let AccessTokenModule = class AccessTokenModule {
};
exports.AccessTokenModule = AccessTokenModule;
exports.AccessTokenModule = AccessTokenModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            token_module_1.TokenModule.forFeatureAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                jwtSecret: (configService) => configService.getOrThrow('JWT_SECRET'),
                useFactory: (configService) => ({
                    tokenType: type_token_1.ACCESS_TOKEN_TYPE,
                    expiration: Number(configService.get('JWT_TOKEN_EXPIRATION_TIME')) * 1000 || 1 * 24 * 60 * 60 * 1000, // 1 day
                    threshold: 7 * 24 * 60 * 60 * 1000, // 7 days
                    allowRotation: false,
                    allowMultipleSessions: true
                }),
                serviceToken: type_token_1.ACCESS_TOKEN,
                jwtServiceToken: type_token_1.JWT_ACCESS_TOKEN
            })
        ],
        providers: [access_token_service_1.AccessTokenService],
        exports: [access_token_service_1.AccessTokenService]
    })
], AccessTokenModule);
//# sourceMappingURL=access-token.module.js.map