import { EntityMetadata } from 'typeorm';
import { PermissionsEnum } from '@gauzy/contracts';
import { SensitiveRelationConfig } from '../decorators/sensitive-relations.decorator';
/**
 * Key a {@link SensitiveRelationConfig} node uses to declare the permission required to load the
 * relation the node itself describes (as opposed to the relations nested under it).
 */
export declare const SENSITIVE_RELATION_SELF_KEY = "_self";
/**
 * Type guard for a config value that names a permission.
 *
 * @param value - The config value to test.
 * @returns Whether the value is a known {@link PermissionsEnum} member.
 */
export declare function isValidPermission(value: any): value is PermissionsEnum;
/**
 * Returns the required permission for a given relation path by traversing the config tree.
 * Supports nested relations (e.g. 'organization.employees.user').
 *
 * A node that declares both its own permission (`_self`) and nested rules
 * (`employees: { _self: ORG_EMPLOYEES_VIEW, user: ORG_USERS_VIEW }`) does NOT end the walk: the path
 * keeps descending, so `organization.employees.user` resolves to the deeper `ORG_USERS_VIEW` instead of
 * stopping at `ORG_EMPLOYEES_VIEW`. Returning the first `_self` met would let a caller holding only the
 * parent permission load the nested relation too. The nearest `_self` above the last resolvable segment
 * is the answer only when nothing deeper is declared — the relation it guards is loaded all the same.
 *
 * Callers are expected to check every prefix of a path as well (see `normalizeRelationsToPaths`), so
 * the permission guarding `organization.employees` is enforced on its own row.
 *
 * @param config - The sensitive relations config object (nested structure)
 * @param relationPath - The relation path requested (dot notation)
 * @returns The required permission as a PermissionsEnum, or null if none is required
 */
export declare function getRequiredPermissionForRelation(config: SensitiveRelationConfig, relationPath: string): PermissionsEnum | null;
/**
 * Enforces {@link ORGANIZATION_SENSITIVE_RELATIONS} at the data-access boundary, for EVERY entity.
 *
 * `SensitiveRelationsInterceptor` is the declarative, per-controller layer of this protection, but it
 * is mounted on 5 of the ~83 controllers that accept a client-supplied `relations` option — while
 * every entity extending `TenantOrganizationBaseEntity` exposes an `organization` relation. A single
 * unguarded controller is therefore enough to reach the very rows the table protects
 * (`GET /api/equipment/pagination?relations[0]=organization.payments` — no `@Permissions`, no
 * interceptor, plain array form, no bypass trick at all). This function closes that at the sink so it
 * cannot recur as controllers are added.
 *
 * NOTE the boundary: `CrudService` calls this on its read methods. A service that builds its own
 * `createQueryBuilder(...).setFindOptions({ relations })` (`TagService.findTags` behind `GET /api/tags`,
 * `TaskService`, `EmployeeService.pagination`, the time-tracking report services and others) never
 * reaches those methods, so each such method must call `CrudService.assertRelationsPermitted` — or
 * this function, with the metadata of the repository it actually queries — before applying a
 * client-supplied `relations`. Relation lists the server builds itself need no check.
 *
 * The walk advances over the entity graph rather than over the shape of the requested string, so a
 * relation is gated by WHICH entity it is loaded from: `Organization.payments` needs
 * `ORG_PAYMENT_VIEW`, while the unrelated `Invoice.payments` — which the invoices UI loads with
 * `INVOICES_VIEW` — is untouched. The path is checked hop by hop, and a hop that cannot be resolved
 * in the entity metadata simply ends the walk: TypeORM rejects such a path itself, and the prefixes
 * already traversed have been checked.
 *
 * Only client-driven reads are gated. With no request context there is no caller whose permissions
 * could be consulted and no client-supplied `relations` either — seeding, migrations and background
 * jobs build their own options in code — so the check is skipped rather than failing those closed.
 *
 * @param metadata - Entity metadata of the repository the read is issued against.
 * @param relations - The requested `relations` option, in ANY representation.
 * @throws ForbiddenException when a requested relation requires a permission the caller lacks.
 */
export declare function assertSensitiveRelationsAllowed(metadata: EntityMetadata | undefined, relations: unknown): void;
