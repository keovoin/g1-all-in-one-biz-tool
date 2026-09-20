import { OnDestroy } from '@angular/core';
import { ID, JsonData } from '@gauzy/contracts';
import { IDocumentContentUpdateInput } from '../../models/docs-api.model';
import * as i0 from "@angular/core";
/** Autosave pill states (spec 05 §9.2 + UX spec §10.6). */
export type DocsSaveState = 'idle' | 'dirty' | 'saving' | 'saved' | 'conflict' | 'locked' | 'offline' | 'error';
/** Content-save metadata the editor stamps (spec 05 §9.1). */
export interface IDocumentContentMetadata {
    /** Extension-set version the JSON was produced with — the loader shim's discriminator. */
    schemaVersion: number;
}
export interface IAutosavePayload {
    contentJson: JsonData;
    contentHtml: string;
    mentionEmployeeIds: string[];
    /** Stamped on every save so a future schema migration has something to branch on. */
    metadata?: IDocumentContentMetadata;
    /** Base64 Yjs seed for the reserved `contentBinary` column (spec 05 §9.1/§11). */
    contentBinary?: string | null;
}
/**
 * The wire body of `PUT /documents/:id/content`.
 *
 * 🛑 `metadata` and `contentBinary` are declared here rather than on
 * `IDocumentContentUpdateInput` because that model file belongs to the plugin-surface area;
 * the fields are additive and this intersection becomes redundant (not wrong) once they land
 * there. They only take effect once `UpdateDocumentContentDTO` accepts them — the DTO runs
 * under `whitelist: true`, which **silently strips** unknown properties rather than erroring.
 */
export interface IDocumentContentSaveBody extends IDocumentContentUpdateInput {
    metadata?: IDocumentContentMetadata;
    contentBinary?: string;
}
export interface IConflictInfo {
    code: string;
    currentUpdatedAt?: string;
}
/**
 * Content autosave state machine (spec 05 §9.2):
 * `idle → dirty → saving → idle | conflict | error`.
 *
 * - Save fires 2 s after the last edit or at a 15 s max-dirty ceiling.
 * - Optimistic concurrency via `expectedUpdatedAt`; 409 → `conflict` (frozen
 *   until the page resolves), 423 → `locked`.
 * - Network errors retry with exponential backoff (2/4/8… capped 60 s) as
 *   `offline`; saves never overlap (single-flight, latest state wins).
 * - Saves are skipped while the payload provider returns null (uploads pending).
 */
export declare class DocumentAutosaveService implements OnDestroy {
    private readonly documentsService;
    private readonly zone;
    private readonly _state$;
    readonly state$: import("rxjs").Observable<DocsSaveState>;
    private readonly _conflict$;
    readonly conflict$: import("rxjs").Observable<IConflictInfo>;
    private documentId;
    /** The `updatedAt` last loaded/saved — the optimistic-concurrency token. */
    private expectedUpdatedAt;
    private payloadProvider;
    /**
     * Bumped by every `init()`. A save started for the previous document may land
     * after the editor was rebuilt for another `:id`; its result must never write
     * the new session's token or unblock its single-flight latch.
     */
    private session;
    private dirty;
    private frozen;
    private inFlight;
    private retryCount;
    private debounceTimer;
    private ceilingTimer;
    private retryTimer;
    get state(): DocsSaveState;
    get isDirty(): boolean;
    get updatedAt(): string | null;
    /**
     * Starts (or restarts) an autosave session. Restarting is what the editor does
     * when the route ':id' changes: every timer, latch and freeze of the previous
     * document is dropped so nothing from it can write into the new one.
     */
    init(documentId: ID, updatedAt: string | Date | undefined, payloadProvider: () => IAutosavePayload | null): void;
    /** Called on every doc-changing transaction. */
    markDirty(): void;
    /** Manual flush (Ctrl/Cmd+S, blur, visibility change, route leave). */
    flush(options?: {
        forceSnapshot?: boolean;
    }): Promise<boolean>;
    /** Conflict resolved (reload or keep-as-copy done) — resume with a fresh token. */
    resolve(updatedAt: string | Date | undefined, options?: {
        discardLocal?: boolean;
    }): void;
    /**
     * The lock was released (the page's own lock toggle, or a refetch that came
     * back unlocked). A 423 freeze has no self-clearing path, so without this the
     * editor stays read-only until a full reload (spec 05 §9.2 "lock respect").
     * A `conflict` freeze is deliberately untouched — only the page's conflict
     * actions resolve that one.
     */
    lockReleased(updatedAt?: string | Date): void;
    /** Manual retry from the error pill. */
    retryNow(): void;
    ngOnDestroy(): void;
    private handleError;
    /**
     * Arms the 2 s debounce and — unless one is already running — the 15 s max-dirty
     * ceiling. Each timer nulls its own handle when it fires, so "already running"
     * stays truthful and the ceiling can always be re-armed.
     */
    private armSaveTimers;
    private schedule;
    private clearTimers;
    static ɵfac: i0.ɵɵFactoryDeclaration<DocumentAutosaveService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<DocumentAutosaveService>;
}
