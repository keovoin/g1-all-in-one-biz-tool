"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertCurrentUserBelongsToOrganization = assertCurrentUserBelongsToOrganization;
const common_1 = require("@nestjs/common");
const context_1 = require("../core/context");
const internal_1 = require("../core/entities/internal");
/**
 * Refuse a read scoped to an organization the current user is not a member of.
 *
 * Services that list through the raw repository cannot lean on the query DTO for this: the
 * `organizationId` membership validator on `TenantOrganizationBaseDTO` is conditional and is
 * skipped entirely whenever the request carries `sentTo`, so a caller could name a sibling
 * organization of their tenant and read it. This repeats the check the validator would have made
 * (a `user_organization` row for this tenant, user and organization) and fails closed when it
 * cannot reach a verdict: no organization, no tenant or no user in the request context all refuse.
 *
 * @param manager the TypeORM entity manager to run the membership lookup with
 * @param organizationId the organization the read is about to be scoped to
 * @throws BadRequestException when no organization is supplied
 * @throws ForbiddenException when there is no authenticated tenant user, or they are not a member
 */
async function assertCurrentUserBelongsToOrganization(manager, organizationId) {
    if (!organizationId) {
        throw new common_1.BadRequestException('organizationId is required');
    }
    const tenantId = context_1.RequestContext.currentTenantId();
    const userId = context_1.RequestContext.currentUserId();
    if (!tenantId || !userId) {
        throw new common_1.ForbiddenException('You are not a member of this organization');
    }
    const memberships = await manager.count(internal_1.UserOrganization, {
        where: { tenantId, userId, organizationId }
    });
    if (memberships === 0) {
        throw new common_1.ForbiddenException('You are not a member of this organization');
    }
}
//# sourceMappingURL=assert-organization-membership.js.map