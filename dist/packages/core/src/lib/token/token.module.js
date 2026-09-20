"use strict";
var TokenModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const cqrs_1 = require("@nestjs/cqrs");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
// Entities
const token_entity_1 = require("./entities/token.entity");
// Repositories
const token_repository_1 = require("./repositories/token.repository");
// Services
const scoped_jwt_service_1 = require("./services/scoped-jwt.service");
const token_hasher_service_1 = require("./services/token-hasher.service");
const token_service_1 = require("./services/token.service");
const token_config_module_1 = require("./token-config.module");
const token_config_registry_1 = require("./token-config.registry");
// Command Handlers
const commands_1 = require("./commands");
// Query Handlers
const queries_1 = require("./queries");
const scheduler_1 = require("@gauzy/scheduler");
const nestjs_1 = require("@mikro-orm/nestjs");
const repositories_1 = require("./repositories");
const scoped_config_registry_1 = require("./scoped-config.registry");
const scoped_token_service_1 = require("./scoped-token.service");
const shared_1 = require("./shared");
const token_hasher_1 = require("./shared/token-hasher");
const token_cleanup_scheduler_1 = require("./token-cleanup.scheduler");
const token_cleanup_worker_1 = require("./token-cleanup.worker");
const token_constant_1 = require("./token-constant");
const CommandHandlers = [
    commands_1.CreateTokenHandler,
    commands_1.RotateTokenHandler,
    commands_1.RevokeTokenHandler,
    commands_1.RevokeAllUserTokensHandler,
    commands_1.CleanupExpiredTokensHandler,
    commands_1.CleanupInactiveTokensHandler
];
const QueryHandlers = [
    queries_1.ValidateTokenHandler,
    queries_1.GetTokenByIdHandler,
    queries_1.GetActiveTokensHandler,
    queries_1.GetTokensHandler,
    queries_1.GetTokenAuditTrailHandler
];
const BaseExports = [
    token_service_1.TokenService,
    shared_1.TokenRepositoryToken,
    shared_1.TokenReadRepositoryToken,
    shared_1.TokenWriteRepositoryToken,
    shared_1.TokenMaintenanceRepositoryToken,
    shared_1.JwtServiceToken,
    token_hasher_service_1.TokenHasherService
];
let TokenModule = TokenModule_1 = class TokenModule {
    static buildBaseProviders() {
        return [
            token_service_1.TokenService,
            token_repository_1.TokenRepository,
            repositories_1.TypeOrmTokenRepository,
            repositories_1.MikroOrmTokenRepository,
            {
                provide: shared_1.TokenRepositoryToken,
                useExisting: token_repository_1.TokenRepository
            },
            {
                provide: shared_1.TokenReadRepositoryToken,
                useExisting: token_repository_1.TokenRepository
            },
            {
                provide: shared_1.TokenWriteRepositoryToken,
                useExisting: token_repository_1.TokenRepository
            },
            {
                provide: shared_1.TokenMaintenanceRepositoryToken,
                useExisting: token_repository_1.TokenRepository
            },
            jwt_1.JwtService,
            {
                provide: shared_1.JwtServiceToken,
                useExisting: jwt_1.JwtService
            },
            token_hasher_service_1.TokenHasherService,
            {
                provide: token_hasher_1.TokenHasher,
                useExisting: token_hasher_service_1.TokenHasherService
            }
        ];
    }
    static buildFeatureImports(additionalImports = []) {
        return [
            cqrs_1.CqrsModule,
            token_config_module_1.TokenConfigModule,
            typeorm_1.TypeOrmModule.forFeature([token_entity_1.Token]),
            nestjs_1.MikroOrmModule.forFeature([token_entity_1.Token]),
            ...(additionalImports ?? [])
        ];
    }
    static buildScopedConfigProvider(configToken, configFactory, inject = []) {
        return {
            provide: configToken,
            useFactory: async (registry, ...args) => {
                const config = await configFactory(...args);
                registry.register(config);
                return new scoped_config_registry_1.ScopedTokenConfig(config);
            },
            inject: [token_config_registry_1.TokenConfigRegistry, ...inject]
        };
    }
    static buildScopedJwtProviders(configToken, jwtServiceToken, jwtSecret, inject = []) {
        if (!jwtSecret) {
            return [
                {
                    provide: jwtServiceToken,
                    useExisting: jwt_1.JwtService
                }
            ];
        }
        if (typeof jwtSecret === 'string') {
            return [
                {
                    provide: jwtServiceToken,
                    useFactory: (scopedConfig, jwtService) => {
                        return new scoped_jwt_service_1.ScopedJwtService(jwtSecret, scopedConfig.tokenType, jwtService);
                    },
                    inject: [configToken, jwt_1.JwtService]
                }
            ];
        }
        const jwtSecretToken = Symbol('TOKEN_MODULE_JWT_SECRET');
        return [
            {
                provide: jwtSecretToken,
                useFactory: (...args) => jwtSecret(...args),
                inject
            },
            {
                provide: jwtServiceToken,
                useFactory: async (scopedConfig, secret, jwtService) => {
                    return new scoped_jwt_service_1.ScopedJwtService(secret, scopedConfig.tokenType, jwtService);
                },
                inject: [configToken, jwtSecretToken, jwt_1.JwtService]
            }
        ];
    }
    static buildJwtRegistrationProvider(configToken, jwtServiceToken) {
        return {
            provide: Symbol('TOKEN_MODULE_JWT_REGISTRATION'),
            useFactory: (registry, scopedConfig, scopedJwtService) => {
                registry.registerJwtService(scopedConfig.tokenType, scopedJwtService);
                return true;
            },
            inject: [token_config_registry_1.TokenConfigRegistry, configToken, jwtServiceToken]
        };
    }
    static buildScopedProviders(configToken, serviceToken, jwtServiceToken, configProvider, jwtProviders) {
        return [
            configProvider,
            {
                provide: scoped_config_registry_1.ScopedTokenConfig,
                useExisting: configToken
            },
            ...jwtProviders,
            {
                provide: serviceToken,
                useClass: scoped_token_service_1.ScopedTokenService
            },
            this.buildJwtRegistrationProvider(configToken, jwtServiceToken)
        ];
    }
    static importScheduler() {
        return [
            scheduler_1.SchedulerModule.forFeature({
                queues: [token_constant_1.TOKEN_QUEUE_NAME],
                jobProviders: [token_cleanup_scheduler_1.TokenCleanupScheduler, token_cleanup_worker_1.TokenCleanupWorker],
                imports: [cqrs_1.CqrsModule]
            })
        ];
    }
    /**
     * Register token module with options
     */
    static forRoot(options = {}) {
        const { enableScheduler = true } = options;
        const providers = [...this.buildBaseProviders()];
        providers.push(...CommandHandlers, ...QueryHandlers);
        return {
            module: TokenModule_1,
            imports: [
                config_1.ConfigModule,
                ...this.buildFeatureImports(),
                ...(enableScheduler ? [...this.importScheduler()] : [])
            ],
            providers,
            exports: BaseExports
        };
    }
    /**
     * Register token module for feature modules with factory-based configuration
     *
     * @example Basic usage without configuration (old style)
     * ```typescript
     * @Module({
     *   imports: [TokenModule.forFeature()],
     * })
     * export class MyModule {}
     * ```
     *
     * @example With scoped configuration (new style - RECOMMENDED)
     * ```typescript
     * @Module({
     *   imports: [
     *     TokenModule.forFeature({
     *       config: {
     *         tokenType: 'REFRESH_TOKEN',
     *         expirationMs: 30 * 24 * 60 * 60 * 1000,
     *         allowRotation: true,
     *         allowMultipleSessions: false,
     *       },
     *       jwtSecret: process.env.REFRESH_TOKEN_SECRET, // Custom JWT secret
     *       serviceToken: 'REFRESH_TOKEN_SERVICE',
     *       configToken: 'REFRESH_TOKEN_CONFIG',
     *     }),
     *   ],
     * })
     * export class RefreshTokenModule {}
     * ```
     */
    static forFeature(options) {
        const providers = [...this.buildBaseProviders()];
        const moduleExports = [...BaseExports];
        // If options provided, create scoped service with factory
        if (options?.config) {
            const { config, jwtSecret, serviceToken = `${config.tokenType}_SERVICE`, configToken = `${config.tokenType}_CONFIG`, jwtServiceToken = `${config.tokenType}_JWT_SERVICE` } = options;
            const configProvider = this.buildScopedConfigProvider(configToken, () => config);
            const jwtProviders = this.buildScopedJwtProviders(configToken, jwtServiceToken, jwtSecret);
            providers.push(...this.buildScopedProviders(configToken, serviceToken, jwtServiceToken, configProvider, jwtProviders));
            // Export scoped tokens
            moduleExports.push(serviceToken, configToken, jwtServiceToken);
        }
        return {
            module: TokenModule_1,
            imports: this.buildFeatureImports(),
            providers,
            exports: moduleExports
        };
    }
    /**
     * Register token module for feature modules with async configuration
     *
     * @example Async configuration with ConfigService
     * ```typescript
     * @Module({
     *   imports: [
     *     TokenModule.forFeatureAsync({
     *       imports: [ConfigModule],
     *       inject: [ConfigService],
     *       useFactory: (configService: ConfigService) => ({
     *         tokenType: 'REFRESH_TOKEN',
     *         expirationMs: 30 * 24 * 60 * 60 * 1000,
     *         allowRotation: true,
     *         allowMultipleSessions: false,
     *       }),
     *       jwtSecret: (configService: ConfigService) =>
     *         configService.get('REFRESH_TOKEN_SECRET'),
     *       serviceToken: 'REFRESH_TOKEN_SERVICE',
     *     }),
     *   ],
     * })
     * export class RefreshTokenModule {}
     * ```
     */
    static forFeatureAsync(options) {
        const providers = [...this.buildBaseProviders()];
        const moduleExports = [...BaseExports];
        const inject = options.inject ?? [];
        const configToken = options.configToken || `${options.useFactory.name.toUpperCase()}_CONFIG`;
        const serviceToken = options.serviceToken || `${options.useFactory.name.toUpperCase()}_SERVICE`;
        const jwtServiceToken = options.jwtServiceToken || `${options.useFactory.name.toUpperCase()}_JWT_SERVICE`;
        const configProvider = this.buildScopedConfigProvider(configToken, options.useFactory, inject);
        const jwtProviders = this.buildScopedJwtProviders(configToken, jwtServiceToken, options.jwtSecret, inject);
        providers.push(...this.buildScopedProviders(configToken, serviceToken, jwtServiceToken, configProvider, jwtProviders));
        moduleExports.push(serviceToken, configToken, jwtServiceToken);
        return {
            module: TokenModule_1,
            imports: this.buildFeatureImports(options.imports),
            providers,
            exports: moduleExports
        };
    }
};
exports.TokenModule = TokenModule;
exports.TokenModule = TokenModule = TokenModule_1 = tslib_1.__decorate([
    (0, common_1.Module)({})
], TokenModule);
//# sourceMappingURL=token.module.js.map