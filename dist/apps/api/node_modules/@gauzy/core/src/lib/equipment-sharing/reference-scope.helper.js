"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertReferencesAreInScope = assertReferencesAreInScope;
const common_1 = require("@nestjs/common");
/**
 * Refuses a referenced row that is not inside the given scope.
 *
 * The equipment-sharing update is a delete-then-recreate that spreads the request body, so a
 * body-supplied `equipmentId` or `equipmentSharingPolicyId` is persisted verbatim. Pinning the
 * record's own `organizationId` protects the ROW; it says nothing about what the row POINTS AT, and
 * the foreign key only proves the referenced row exists — not that it belongs here. Without this,
 * an update could re-attach a sharing to another organization's equipment.
 *
 * Lives in its own module, free of entity imports, so it can be unit-tested: importing the service
 * pulls in the entity graph and trips a pre-existing circular-import failure.
 *
 * @param references - `[table, id]` pairs to validate; entries without an id are skipped.
 * @param scope - The tenant/organization the referencing record belongs to.
 * @param lookup - Performs the scoped lookup.
 * @throws ForbiddenException when a reference is missing, or when there is no tenant to scope by.
 */
async function assertReferencesAreInScope(references, scope, lookup) {
    for (const [table, referenceId] of references) {
        if (!referenceId) {
            continue;
        }
        // Fail CLOSED without a tenant. An existence check that cannot be scoped proves nothing, and
        // answering "in scope" because there is no scope to compare against is how these guards rot.
        if (!scope.tenantId) {
            throw new common_1.ForbiddenException('Cannot validate the referenced record without a tenant context');
        }
        const where = { id: referenceId, tenantId: scope.tenantId };
        if (scope.organizationId) {
            where['organizationId'] = scope.organizationId;
        }
        if (!(await lookup(table, where))) {
            throw new common_1.ForbiddenException(`The referenced ${table.replace(/_/g, ' ')} is not available here`);
        }
    }
}
//# sourceMappingURL=reference-scope.helper.js.map