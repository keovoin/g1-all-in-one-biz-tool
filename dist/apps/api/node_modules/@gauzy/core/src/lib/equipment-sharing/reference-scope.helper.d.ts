import { ID } from '@gauzy/contracts';
/**
 * The tenant/organization a record belongs to.
 */
export interface IReferenceScope {
    tenantId?: ID;
    organizationId?: ID;
}
/**
 * Looks a row up by scoped criteria. Returns something truthy when the row is in scope.
 */
export type ScopedLookup = (table: string, where: Record<string, unknown>) => Promise<unknown>;
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
export declare function assertReferencesAreInScope(references: ReadonlyArray<readonly [string, ID | undefined]>, scope: IReferenceScope, lookup: ScopedLookup): Promise<void>;
