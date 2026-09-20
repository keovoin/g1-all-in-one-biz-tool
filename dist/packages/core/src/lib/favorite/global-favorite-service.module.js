"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalFavoriteModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const global_favorite_service_service_1 = require("./global-favorite-service.service");
let GlobalFavoriteModule = class GlobalFavoriteModule {
};
exports.GlobalFavoriteModule = GlobalFavoriteModule;
exports.GlobalFavoriteModule = GlobalFavoriteModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [core_1.DiscoveryModule],
        providers: [global_favorite_service_service_1.GlobalFavoriteDiscoveryService],
        exports: [global_favorite_service_service_1.GlobalFavoriteDiscoveryService]
    })
], GlobalFavoriteModule);
//# sourceMappingURL=global-favorite-service.module.js.map