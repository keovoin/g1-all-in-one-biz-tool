"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestConfigProvider = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const constants_1 = require("@gauzy/constants");
let RequestConfigProvider = class RequestConfigProvider {
    constructor(options) {
        this.options = options;
        this.defaultConfig = new Object();
        this.config = new Object();
        this.setDefaultConfig(options);
        this.resetConfig();
    }
    /**
     * Set the default configuration options.
     * @param defaultConfig - The default configuration options to set.
     */
    setDefaultConfig(defaultConfig) {
        this.defaultConfig = defaultConfig;
    }
    /**
     * Reset the configuration options to the default values.
     */
    resetConfig() {
        this.config = { ...this.defaultConfig };
    }
    /**
     * Set the configuration options.
     * @param config - The configuration options to set.
     */
    setConfig(config) {
        this.config = { ...this.defaultConfig, ...config };
    }
    /**
     * Get the current configuration options.
     * @returns The current configuration options.
     */
    getConfig() {
        return this.config;
    }
};
exports.RequestConfigProvider = RequestConfigProvider;
exports.RequestConfigProvider = RequestConfigProvider = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, common_1.Inject)(constants_1.GAUZY_AI_CONFIG_TOKEN)),
    tslib_1.__metadata("design:paramtypes", [Object])
], RequestConfigProvider);
//# sourceMappingURL=request-config.provider.js.map