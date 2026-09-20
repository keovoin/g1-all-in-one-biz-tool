import { Injectable } from '@angular/core';
import { catchError, map, of, shareReplay } from 'rxjs';
import { EmployeesService, Store } from '@gauzy/ui-core/core';
import { filterMentionCandidates, MENTION_TRIGGER } from './document-comments.model';
import * as i0 from "@angular/core";
import * as i1 from "@gauzy/ui-core/core";
/**
 * Org-scoped employee directory behind the comment composer's `@` menu.
 *
 * Provided once on the thread (not per composer) so the root composer, every
 * reply box and every inline editor share a single `shareReplay(1)` fetch —
 * the editor's mention suggestion caches for exactly the same reason
 * (`employee-mention.suggestion.ts`), and a panel with three open composers
 * should still cost one request.
 *
 * The list loads lazily on the first `@`, and a failure resolves to an empty
 * menu rather than an error: mentioning is an assist, not the point of the box.
 */
export class MentionDirectoryService {
    constructor(employeesService, store) {
        this.employeesService = employeesService;
        this.store = store;
    }
    /** Candidates whose label matches `query`, capped for the popup. */
    search(query) {
        return this.employees().pipe(map((employees) => filterMentionCandidates(employees, query)));
    }
    /**
     * Everyone whose `@Name` already appears in a saved comment body.
     *
     * 🛑 An edit re-sends `mentionEmployeeIds` and the backend *replaces* the
     * mention rows with exactly that array (`MentionService.updateEntityMentions`),
     * so an editor seeded with an empty list would silently un-mention everyone
     * the comment names. Re-deriving from the text is what keeps an edit additive.
     */
    matchInText(text) {
        return this.employees().pipe(map((employees) => filterMentionCandidates(employees, '', Number.MAX_SAFE_INTEGER).filter((candidate) => text.includes(`${MENTION_TRIGGER}${candidate.label}`))));
    }
    employees() {
        if (!this.employees$) {
            const organization = this.store.selectedOrganization;
            this.employees$ = (organization
                ? this.employeesService.getAll(['user'], {
                    organizationId: organization.id,
                    tenantId: organization.tenantId
                })
                : of({ items: [], total: 0 })).pipe(map((page) => page?.items ?? []), catchError(() => of([])), shareReplay({ bufferSize: 1, refCount: false }));
        }
        return this.employees$;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: MentionDirectoryService, deps: [{ token: i1.EmployeesService }, { token: i1.Store }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: MentionDirectoryService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: MentionDirectoryService, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i1.EmployeesService }, { type: i1.Store }] });
//# sourceMappingURL=mention-directory.service.js.map