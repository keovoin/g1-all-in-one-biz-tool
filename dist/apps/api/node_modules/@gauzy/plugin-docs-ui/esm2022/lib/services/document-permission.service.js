import { Injectable } from '@angular/core';
import { DocumentVisibilityEnum, PermissionsEnum } from '@gauzy/contracts';
import { Store } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
import * as i1 from "@gauzy/ui-core/core";
/**
 * Ownership scoping of the mutating affordances (`08-permissions-security.md` §1.7/§1.8).
 *
 * `ngxPermissionsOnly` can only answer "does this user hold `DOCS_UPDATE`" — it cannot express
 * "…on *this* document". The backend's write rule is
 * `DOCS_UPDATE AND (DOCS_MANAGE OR creator OR an EDIT share)`
 * (`plugins/docs/.../document-access.predicate.ts` `isDocumentWritable`), so a `DOCS_UPDATE`
 * holder without `DOCS_MANAGE` was being offered edit/move/archive/delete on *every* document
 * and only learned otherwise from a `403 DOCS_WRITE_FORBIDDEN`.
 *
 * This service supplies the missing row-level half. Every caller keeps its existing
 * `ngxPermissionsOnly` gate and ANDs {@link canMutate} on top — the verb permission and the
 * ownership scope are two independent conditions, exactly as they are on the server.
 *
 * 🛑 FE gating is UX only; the backend stays the enforcement boundary (§1.7). That is why the
 * PRIVATE branch below deliberately errs towards *showing* an action rather than hiding one.
 */
export class DocumentPermissionService {
    constructor(store) {
        this.store = store;
    }
    /** `DOCS_MANAGE` — the admin override that mutates everything in scope (§1.8). */
    get canManageAll() {
        return this.store.hasPermission(PermissionsEnum.DOCS_MANAGE);
    }
    /**
     * Whether the current user created the document.
     *
     * Ownership is **user**-identity based (§1.6): `createdByUserId` is a `User` id, which is what
     * `Store.userId` holds — not the employee id the share overlay is keyed by.
     */
    isCreator(document) {
        const userId = this.store.userId;
        return !!userId && !!document?.createdByUserId && String(document.createdByUserId) === String(userId);
    }
    /**
     * Whether the mutating affordances should be offered for this document.
     *
     * `DOCS_MANAGE` holder, or the document's own creator. The third server-side path — an `EDIT`
     * share — cannot be evaluated here: shares are a separate `GET /documents/:id/shares` read and
     * are never part of a document projection. They apply to PRIVATE documents only (§3.3), and a
     * PRIVATE document that is neither owned nor covered by `DOCS_MANAGE` is only *readable at all*
     * because a share grants it — so that case resolves to `true` and lets the backend decide,
     * rather than stripping the controls from a legitimate `EDIT` grantee. Every other document
     * (i.e. the ORGANIZATION-visible majority) is answered exactly.
     *
     * An absent document is not mutable: a panel with nothing loaded has nothing to offer.
     */
    canMutate(document) {
        if (!document)
            return false;
        if (this.canManageAll || this.isCreator(document))
            return true;
        return document.visibility === DocumentVisibilityEnum.PRIVATE;
    }
    /** Every row of a selection is mutable (bulk affordances). Empty selections are not mutable. */
    canMutateAll(documents) {
        if (!documents?.length)
            return false;
        return documents.every((document) => this.canMutate(document));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DocumentPermissionService, deps: [{ token: i1.Store }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DocumentPermissionService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DocumentPermissionService, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i1.Store }] });
//# sourceMappingURL=document-permission.service.js.map