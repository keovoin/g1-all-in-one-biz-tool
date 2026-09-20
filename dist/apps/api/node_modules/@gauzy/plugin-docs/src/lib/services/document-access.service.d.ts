import { WhereExpressionBuilder } from 'typeorm';
import { DocumentShareAccessEnum, ID } from '@gauzy/contracts';
import { TypeOrmDocumentShareRepository } from '../repositories/type-orm-document-share.repository';
import { IDocumentAccessRow, IDocumentAccessSubject } from './document-access.predicate';
/**
 * Resolves the requesting subject (user id, employee id, current team ids, permissions)
 * and answers share-overlay questions for the read/write paths.
 *
 * There are two evaluation surfaces and they are kept deliberately in lock-step:
 *
 * - **SQL** — `buildShareGrantExistsSql()` folded into `DocumentService.applyVisibilityScope()`
 *   and into the retrieval filter set, so lists/facets/tree/retrieval stay single-query;
 * - **In-memory** — the pure predicates of `document-access.predicate.ts`, used by the
 *   by-id paths (`findOneScoped`) and by the share-administration checks.
 *
 * Team membership is resolved at evaluation time on both surfaces — a removed team member
 * loses access on their next request, with no materialized copies to invalidate.
 */
export declare class DocumentAccessService {
    private readonly typeOrmDocumentShareRepository;
    private readonly logger;
    constructor(typeOrmDocumentShareRepository: TypeOrmDocumentShareRepository);
    /**
     * The employee id of the requesting user.
     *
     * `RequestContext.currentEmployeeId()` deliberately returns `null` for users holding
     * `CHANGE_SELECTED_EMPLOYEE` (it means "the selected employee", not "me"), which would
     * silently drop share grants for managers — so the identity is read off the JWT user.
     *
     * @returns The requesting user's employee id, or null.
     */
    currentEmployeeId(): ID | null;
    /**
     * Loads the team ids the requesting employee currently belongs to.
     *
     * @param employeeId The employee whose memberships to resolve.
     * @returns The organization-team ids (empty when the subject has no employee record).
     */
    currentTeamIds(employeeId?: ID | null): Promise<ID[]>;
    /**
     * Builds the access subject of the current request: identity + the permissions the
     * route guards have already proven.
     *
     * @returns The requesting subject (team ids resolved).
     */
    currentSubject(): Promise<IDocumentAccessSubject>;
    /**
     * Folds the share-grant `EXISTS` clause into a visibility bracket, when — and only
     * when — the requesting subject has an employee identity to match shares against.
     *
     * @param web The `OR` bracket of the visibility scope.
     * @param alias The document alias in the surrounding query.
     * @returns True when the clause was added (i.e. the parameters were bound).
     */
    applyShareScope(web: WhereExpressionBuilder, alias: string): boolean;
    /**
     * Loads the share rows of one document (used by the by-id access checks and by the
     * share-administration endpoints).
     *
     * @param documentId The document whose overlay to load.
     * @returns The share rows, or an empty array on any lookup failure.
     */
    loadShares(documentId: ID): Promise<Array<{
        employeeId?: ID;
        teamId?: ID;
        access: DocumentShareAccessEnum;
    }>>;
    /**
     * Whether the requesting subject may READ the given row, evaluating the full
     * §3.4 truth table including the share overlay.
     *
     * @param document The document projection (`visibility`, `createdByUserId`, `id`).
     * @param documentId The document id, when the row projection does not carry it.
     * @returns True when the row is readable.
     */
    canRead(document: IDocumentAccessRow, documentId: ID): Promise<boolean>;
    /**
     * Whether the requesting subject may MUTATE the given row (§1.6 ownership + `EDIT`
     * share overlay).
     *
     * @param document The document projection.
     * @param documentId The document id.
     * @returns True when the subject may mutate the row.
     */
    canWrite(document: IDocumentAccessRow, documentId: ID): Promise<boolean>;
    /**
     * Whether the requesting subject may administer the document's share overlay
     * (creator or `DOCS_MANAGE` only — a grantee can never re-share).
     *
     * @param document The document projection.
     * @returns True when share CRUD is permitted on the row.
     */
    canAdministerShares(document: IDocumentAccessRow): Promise<boolean>;
    /**
     * The strongest share access the requesting subject holds on one document.
     *
     * @param document The document projection.
     * @param documentId The document id.
     * @returns The share access level, or null.
     */
    effectiveShareAccess(document: IDocumentAccessRow, documentId: ID): Promise<DocumentShareAccessEnum | null>;
    /**
     * Whether the requesting subject holds at least the given share level on a document.
     *
     * @param document The document projection.
     * @param documentId The document id.
     * @param minimum The minimum share access required.
     * @returns True when the overlay grants at least that level.
     */
    hasShareAtLeast(document: IDocumentAccessRow, documentId: ID, minimum: DocumentShareAccessEnum): Promise<boolean>;
}
