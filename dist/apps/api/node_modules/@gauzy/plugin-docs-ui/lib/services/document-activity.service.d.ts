import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IActivityLog, ID, IPagination } from '@gauzy/contracts';
import { Store } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
/** Rows per "Show more" click. `PaginationQueryDTO.take` is `@Max(100)`; this stays well under it. */
export declare const DOCS_ACTIVITY_PAGE_SIZE = 20;
/** Hard cap on how deep the panel timeline goes (`04-frontend-plugin.md` §4.6: cap 100). */
export declare const DOCS_ACTIVITY_MAX_ITEMS = 100;
/**
 * Client for the platform's generic activity-log API (`/api/activity-log`), scoped to
 * `(BaseEntityEnum.Document, documentId)`.
 *
 * Documents contributes no activity endpoint of its own: every mutation and every
 * pipeline/knowledge/review transition is turned into an `ActivityLog` row by
 * `DocumentActivityLogSubscriber` (plugin-docs), and this is the read side of that seam
 * (`00-product-spec.md` §6.12 R-COL-03).
 *
 * 🛑 Two properties of `GetActivityLogsDTO` decide the shape of every call here:
 *
 * - **`skip` is a 1-based PAGE NUMBER, not an offset.** `ActivityLogService.findActivityLogs()`
 *   computes `skip: take * (skip - 1)`, so paging by `skip += take` would jump 20 *pages* per
 *   click and show an empty timeline from the second page on.
 * - **The organization scope is REQUIRED.** The DTO intersects `TenantOrganizationBaseDTO`,
 *   whose `organization` member is validated (`@IsObject()`) as soon as `organizationId` is
 *   absent — so a call without the scope is a 400, not an unscoped read.
 */
export declare class DocumentActivityService {
    private readonly http;
    private readonly store;
    private readonly API_URL;
    constructor(http: HttpClient, store: Store);
    /**
     * One page of activity entries for a document, newest first.
     *
     * @param documentId The document the entries belong to.
     * @param page 1-based page number (see the class doc — this is the DTO's `skip`).
     * @returns The paginated activity rows; `total` is the full match count, not the page size.
     */
    getPage(documentId: ID, page?: number): Observable<IPagination<IActivityLog>>;
    /** Tenant/organization scope from the selected organization, as every Documents call does. */
    private orgContext;
    static ɵfac: i0.ɵɵFactoryDeclaration<DocumentActivityService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<DocumentActivityService>;
}
