import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseEntityEnum } from '@gauzy/contracts';
import { API_PREFIX, toParams } from '@gauzy/ui-core/common';
import { Store } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
import * as i2 from "@gauzy/ui-core/core";
/** Author identity + the user block behind it — everything a timeline row renders. */
const ACTIVITY_RELATIONS = ['employee', 'employee.user'];
/** Rows per "Show more" click. `PaginationQueryDTO.take` is `@Max(100)`; this stays well under it. */
export const DOCS_ACTIVITY_PAGE_SIZE = 20;
/** Hard cap on how deep the panel timeline goes (`04-frontend-plugin.md` §4.6: cap 100). */
export const DOCS_ACTIVITY_MAX_ITEMS = 100;
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
export class DocumentActivityService {
    constructor(http, store) {
        this.http = http;
        this.store = store;
        this.API_URL = `${API_PREFIX}/activity-log`;
    }
    /**
     * One page of activity entries for a document, newest first.
     *
     * @param documentId The document the entries belong to.
     * @param page 1-based page number (see the class doc — this is the DTO's `skip`).
     * @returns The paginated activity rows; `total` is the full match count, not the page size.
     */
    getPage(documentId, page = 1) {
        return this.http.get(this.API_URL, {
            params: toParams({
                entity: BaseEntityEnum.Document,
                entityId: documentId,
                orderBy: 'createdAt',
                order: 'DESC',
                relations: ACTIVITY_RELATIONS,
                take: DOCS_ACTIVITY_PAGE_SIZE,
                skip: Math.max(1, Math.trunc(page) || 1),
                ...this.orgContext()
            })
        });
    }
    /** Tenant/organization scope from the selected organization, as every Documents call does. */
    orgContext() {
        const organization = this.store.selectedOrganization;
        return organization ? { organizationId: organization.id, tenantId: organization.tenantId } : {};
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DocumentActivityService, deps: [{ token: i1.HttpClient }, { token: i2.Store }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DocumentActivityService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DocumentActivityService, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i1.HttpClient }, { type: i2.Store }] });
//# sourceMappingURL=document-activity.service.js.map