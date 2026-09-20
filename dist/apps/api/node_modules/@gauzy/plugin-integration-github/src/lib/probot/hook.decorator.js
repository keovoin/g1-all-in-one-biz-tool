"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hook = Hook;
const common_1 = require("@nestjs/common");
/**
 * Sets up hook trigger on functions.
 * @param eventOrEvents The GitHub webhook event(s) to trigger this function.
 */
function Hook(eventOrEvents) {
    return (0, common_1.applyDecorators)((0, common_1.SetMetadata)('HOOK_EVENTS', { eventOrEvents }));
}
//# sourceMappingURL=hook.decorator.js.map