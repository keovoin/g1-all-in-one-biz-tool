"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HookMetadataAccessor = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
let HookMetadataAccessor = class HookMetadataAccessor {
    constructor(reflector) {
        this.reflector = reflector;
    }
    /**
     * Get the webhook events associated with a target.
     * @param target A function or constructor representing the target class or controller.
     * @returns An array of EmitterWebhookEventName that represent the webhook events.
     */
    getWebhookEvents(target) {
        // Retrieve the metadata for HOOK_EVENTS, if available, from the target.
        // HOOK_EVENTS metadata should contain eventOrEvents property.
        return this.reflector.get('HOOK_EVENTS', target)?.eventOrEvents;
    }
};
exports.HookMetadataAccessor = HookMetadataAccessor;
exports.HookMetadataAccessor = HookMetadataAccessor = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [core_1.Reflector])
], HookMetadataAccessor);
//# sourceMappingURL=hook-metadata.accessor.js.map