"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalFavoriteDiscoveryService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const is_favoritable_1 = require("../core/decorators/is-favoritable");
let GlobalFavoriteDiscoveryService = class GlobalFavoriteDiscoveryService {
    constructor(discoveryService, metadataScanner, reflector) {
        this.discoveryService = discoveryService;
        this.metadataScanner = metadataScanner;
        this.reflector = reflector;
        this.serviceMap = new Map();
    }
    // Scan all app providers
    onModuleInit() {
        const providers = this.discoveryService.getProviders();
        this.scanProviders(providers);
    }
    scanProviders(providers) {
        providers.forEach((wrapper) => {
            const { instance, metatype } = wrapper;
            if (!instance || !metatype) {
                return;
            }
            const isFavoriteService = this.reflector.get(is_favoritable_1.FAVORITABLE_TYPE, metatype);
            if (isFavoriteService) {
                const type = this.extractTypeFromProvider(metatype);
                if (type) {
                    const methods = this.metadataScanner.getAllMethodNames(Object.getPrototypeOf(instance));
                    this.serviceMap.set(type, { instance, methods });
                }
            }
        });
    }
    // Extract service favorite type
    extractTypeFromProvider(metatype) {
        return Reflect.getMetadata(is_favoritable_1.FAVORITABLE_TYPE, metatype);
    }
    // Get "Favoritable" service
    getService(type) {
        return this.serviceMap.get(type);
    }
    callMethod(type, methodName, ...args) {
        const serviceWithMethods = this.serviceMap.get(type);
        if (!serviceWithMethods) {
            throw new common_1.BadRequestException(`Service for type ${type} not found`);
        }
        const { instance, methods } = serviceWithMethods;
        if (!methods.includes(methodName)) {
            throw new common_1.InternalServerErrorException(`Method ${methodName} not found in service for type ${type}`);
        }
        return instance[methodName](...args);
    }
};
exports.GlobalFavoriteDiscoveryService = GlobalFavoriteDiscoveryService;
exports.GlobalFavoriteDiscoveryService = GlobalFavoriteDiscoveryService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [core_1.DiscoveryService,
        core_1.MetadataScanner,
        core_1.Reflector])
], GlobalFavoriteDiscoveryService);
//# sourceMappingURL=global-favorite-service.service.js.map