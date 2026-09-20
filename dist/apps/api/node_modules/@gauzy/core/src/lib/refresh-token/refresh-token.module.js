"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshTokenModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const token_module_1 = require("../token/token.module");
const current_user_provider_1 = require("./current-user.provider");
const refresh_token_service_1 = require("./refresh-token.service");
const type_token_1 = require("./type.token");
let RefreshTokenModule = class RefreshTokenModule {
};
exports.RefreshTokenModule = RefreshTokenModule;
exports.RefreshTokenModule = RefreshTokenModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            token_module_1.TokenModule.forFeatureAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                jwtSecret: (configService) => configService.getOrThrow('JWT_REFRESH_TOKEN_SECRET'),
                useFactory: (configService) => ({
                    tokenType: type_token_1.REFRESH_TOKEN_TYPE,
                    expiration: Number(configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME')) * 1000 ||
                        30 * 24 * 60 * 60 * 1000, // 30 days
                    threshold: 7 * 24 * 60 * 60 * 1000, // 7 days
                    allowRotation: true,
                    allowMultipleSessions: true
                }),
                jwtServiceToken: type_token_1.JWT_REFRESH_TOKEN,
                serviceToken: type_token_1.REFRESH_TOKEN
            })
        ],
        providers: [
            refresh_token_service_1.RefreshTokenService,
            current_user_provider_1.RequestContextCurrentUserProvider,
            {
                provide: current_user_provider_1.CURRENT_USER_PROVIDER,
                useExisting: current_user_provider_1.RequestContextCurrentUserProvider
            }
        ],
        exports: [refresh_token_service_1.RefreshTokenService]
    })
], RefreshTokenModule);
//# sourceMappingURL=refresh-token.module.js.map