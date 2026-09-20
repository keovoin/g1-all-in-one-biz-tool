"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CamshotFactory = void 0;
const core_1 = require("@gauzy/core");
class CamshotFactory {
    static create(input) {
        return {
            ...input,
            ...this.common(input)
        };
    }
    static common(input) {
        const tenantId = input.tenantId || core_1.RequestContext.currentTenantId();
        const organizationId = input.organizationId;
        const uploadedById = input.uploadedById || core_1.RequestContext.currentEmployeeId();
        const userId = core_1.RequestContext.currentUserId();
        return {
            tenantId,
            organizationId,
            uploadedById,
            userId
        };
    }
}
exports.CamshotFactory = CamshotFactory;
//# sourceMappingURL=camshot.factory.js.map