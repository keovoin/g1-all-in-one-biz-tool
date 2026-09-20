"use strict";
var ConfigService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const config_loader_1 = require("./config-loader");
const environment_1 = require("./environments/environment");
let ConfigService = ConfigService_1 = class ConfigService {
    constructor() {
        this.environment = environment_1.environment;
        this.logger = new common_1.Logger(ConfigService_1.name);
        void this.initConfig();
    }
    /**
     * Initializes the configuration and environment variables.
     * Uses an async method since constructors cannot be async.
     */
    async initConfig() {
        this.config = (0, config_loader_1.getConfig)();
        // Assign environment variables dynamically
        Object.entries(this.environment.env).forEach(([key, value]) => {
            process.env[key] = value;
        });
        this.logger.log(`Is Production: ${this.environment.production}`);
    }
    /**
     * Retrieves the entire configuration object as a read-only copy.
     *
     * @returns {Readonly<Partial<ApplicationPluginConfig>>} - The entire configuration object.
     */
    getConfig() {
        return Object.freeze({ ...this.config });
    }
    /**
     * Retrieves a specific configuration value from the application configuration.
     *
     * @param {keyof ApplicationPluginConfig} key - The configuration key to fetch.
     * @returns {Readonly<ApplicationPluginConfig[keyof ApplicationPluginConfig]>} - The requested configuration value.
     */
    getConfigValue(key) {
        if (!(key in this.config)) {
            throw new Error(`Configuration key "${String(key)}" not found.`);
        }
        return this.config[key];
    }
    /**
     * Get the API server configuration options.
     */
    get apiConfigOptions() {
        return this.config.apiConfigOptions;
    }
    /**
     * Get the GraphQL configuration options.
     */
    get graphqlConfigOptions() {
        return this.config.apiConfigOptions?.graphqlConfigOptions;
    }
    /**
     * Get the TypeORM connection options.
     */
    get dbConnectionOptions() {
        return this.config.dbConnectionOptions ?? {};
    }
    /**
     * Get the MikroORM connection options.
     */
    get dbMikroOrmConnectionOptions() {
        return this.config.dbMikroOrmConnectionOptions ?? {};
    }
    /**
     * Get the Knex connection options.
     */
    get dbKnexConnectionOptions() {
        return this.config.dbKnexConnectionOptions;
    }
    /**
     * Get the plugins configuration.
     */
    get plugins() {
        return this.config.plugins ?? [];
    }
    /**
     * Get the asset configuration options.
     */
    get assetOptions() {
        return this.config.assetOptions;
    }
    /**
     * Retrieves an environment variable value with proper type inference.
     *
     * @param {K} key - The environment variable key.
     * @returns {IEnvironment[K]} - The corresponding environment value.
     * @throws {Error} If the key does not exist in the environment.
     */
    get(key) {
        if (!(key in this.environment)) {
            throw new Error(`Environment variable "${String(key)}" is not defined.`);
        }
        return this.environment[key];
    }
    /**
     * Check if the application is running in production mode.
     *
     * @returns `true` if production mode, otherwise `false`.
     */
    isProd() {
        return this.environment.production;
    }
};
exports.ConfigService = ConfigService;
exports.ConfigService = ConfigService = ConfigService_1 = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [])
], ConfigService);
//# sourceMappingURL=config.service.js.map