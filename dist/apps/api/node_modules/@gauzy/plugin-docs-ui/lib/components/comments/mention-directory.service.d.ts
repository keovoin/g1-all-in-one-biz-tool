import { Observable } from 'rxjs';
import { EmployeesService, Store } from '@gauzy/ui-core/core';
import { IMentionCandidate } from './document-comments.model';
import * as i0 from "@angular/core";
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
export declare class MentionDirectoryService {
    private readonly employeesService;
    private readonly store;
    private employees$?;
    constructor(employeesService: EmployeesService, store: Store);
    /** Candidates whose label matches `query`, capped for the popup. */
    search(query: string): Observable<IMentionCandidate[]>;
    /**
     * Everyone whose `@Name` already appears in a saved comment body.
     *
     * 🛑 An edit re-sends `mentionEmployeeIds` and the backend *replaces* the
     * mention rows with exactly that array (`MentionService.updateEntityMentions`),
     * so an editor seeded with an empty list would silently un-mention everyone
     * the comment names. Re-deriving from the text is what keeps an edit additive.
     */
    matchInText(text: string): Observable<IMentionCandidate[]>;
    private employees;
    static ɵfac: i0.ɵɵFactoryDeclaration<MentionDirectoryService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<MentionDirectoryService>;
}
