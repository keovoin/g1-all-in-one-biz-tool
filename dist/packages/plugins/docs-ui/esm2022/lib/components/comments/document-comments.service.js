import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseEntityEnum } from '@gauzy/contracts';
import { API_PREFIX, toParams } from '@gauzy/ui-core/common';
import { Store } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
import * as i2 from "@gauzy/ui-core/core";
/** Author identity + the user block behind it — everything a comment row renders. */
const COMMENT_RELATIONS = ['employee', 'employee.user'];
/** `PaginationQueryDTO.take` is `@Max(100)`; asking for more is a 400, not a bigger page. */
export const COMMENTS_PAGE_SIZE = 100;
/**
 * Client for the platform's generic comment API (`/api/comment`), bound to
 * `(BaseEntityEnum.Document, documentId)`.
 *
 * Documents contributes no comment endpoints of its own — `BaseEntityEnum.Document`
 * is the whole integration (spec 08 §1), so threading, mentions, resolve and the
 * notification fan-out all come from `CommentService`.
 *
 * 🛑 `BaseQueryDTO.where` is `@IsNotEmpty()` and the controller runs under
 * `ValidationPipe`, so the filter must always carry the tenant/organization
 * scope alongside the entity keys — an empty `where` is a 400 that blanks the
 * thread rather than showing it unscoped.
 */
export class DocumentCommentsService {
    constructor(http, store) {
        this.http = http;
        this.store = store;
        this.API_URL = `${API_PREFIX}/comment`;
    }
    /**
     * One page of comments for a document, oldest first.
     *
     * Replies are NOT requested as a relation: they are ordinary rows of the same
     * entity, so the page already contains them and `buildCommentThread()` groups
     * them client-side. Asking for `replies` as well would return each reply twice
     * and make "how many comments are there" ambiguous.
     */
    getAll(documentId) {
        return this.http.get(this.API_URL, {
            params: toParams({
                where: {
                    entity: BaseEntityEnum.Document,
                    entityId: documentId,
                    ...this.orgContext()
                },
                relations: COMMENT_RELATIONS,
                order: { createdAt: 'ASC' },
                take: COMMENTS_PAGE_SIZE
            })
        });
    }
    /**
     * Posts a comment or a reply (`parentId`).
     *
     * `employeeId` is intentionally NOT sent: `CommentService.create()` takes the
     * author from `RequestContext.currentEmployeeId()` and only falls back to the
     * body, so sending one would let a client attribute a comment to someone else.
     */
    create(input) {
        return this.http.post(this.API_URL, { ...this.orgContext(), ...input });
    }
    /**
     * Edits / resolves a comment.
     *
     * 🛑 The server-side update matches on `{ id, employeeId: currentEmployee }` —
     * every field of this call, `resolved` included, is author-only. The UI must
     * gate on authorship rather than on a `DOCS_*` permission or the request comes
     * back 400 "Comment update failed".
     */
    update(id, input) {
        return this.http.put(`${this.API_URL}/${id}`, input);
    }
    delete(id) {
        return this.http.delete(`${this.API_URL}/${id}`);
    }
    /** Tenant/organization scope from the selected organization, as every Documents call does. */
    orgContext() {
        const organization = this.store.selectedOrganization;
        return organization ? { organizationId: organization.id, tenantId: organization.tenantId } : {};
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DocumentCommentsService, deps: [{ token: i1.HttpClient }, { token: i2.Store }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DocumentCommentsService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DocumentCommentsService, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i1.HttpClient }, { type: i2.Store }] });
//# sourceMappingURL=document-comments.service.js.map