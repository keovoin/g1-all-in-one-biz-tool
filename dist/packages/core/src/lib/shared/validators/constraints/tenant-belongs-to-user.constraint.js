"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantBelongsToUserConstraint = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
const underscore_1 = require("underscore");
const context_1 = require("../../../core/context");
/**
 * Validates whether the specified tenant belongs to the current user.
 *
 */
let TenantBelongsToUserConstraint = class TenantBelongsToUserConstraint {
    /**
     * Validates whether the specified tenant belongs to the current user.
     *
     * @param value - The tenant ID or tenant object to be validated.
     * @returns A boolean indicating whether the specified tenant belongs to the current user.
     */
    async validate(value) {
        if ((0, underscore_1.isEmpty)(value))
            return true;
        const currentTenantId = context_1.RequestContext.currentTenantId();
        // Combining both conditions into one line for brevity
        return typeof value === 'string' ? value === currentTenantId : value.id === currentTenantId;
    }
    /**
     * Gets the default message when validation for the "IsTenantBelongsToUser" constraint fails.
     *
     * @param validationArguments - Validation arguments.
     * @returns The default error message.
     */
    defaultMessage(validationArguments) {
        const { value } = validationArguments;
        return `The user is not associated with the requested tenant. Received tenant details: ${JSON.stringify(value)}`;
    }
};
exports.TenantBelongsToUserConstraint = TenantBelongsToUserConstraint;
exports.TenantBelongsToUserConstraint = TenantBelongsToUserConstraint = tslib_1.__decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: "IsTenantBelongsToUser", async: true }),
    (0, common_1.Injectable)()
], TenantBelongsToUserConstraint);
//# sourceMappingURL=tenant-belongs-to-user.constraint.js.map