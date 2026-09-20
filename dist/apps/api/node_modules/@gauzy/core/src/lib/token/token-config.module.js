"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenConfigModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const token_config_registry_1 = require("./token-config.registry");
let TokenConfigModule = class TokenConfigModule {
};
exports.TokenConfigModule = TokenConfigModule;
exports.TokenConfigModule = TokenConfigModule = tslib_1.__decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        providers: [token_config_registry_1.TokenConfigRegistry],
        exports: [token_config_registry_1.TokenConfigRegistry]
    })
], TokenConfigModule);
//# sourceMappingURL=token-config.module.js.map