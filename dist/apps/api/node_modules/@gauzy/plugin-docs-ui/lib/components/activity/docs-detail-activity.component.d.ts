import { OnChanges, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ID } from '@gauzy/contracts';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { DocumentActivityService } from '../../services/document-activity.service';
import { IDocumentActivityChange, IDocumentActivityEntry } from './docs-activity.model';
import * as i0 from "@angular/core";
/**
 * Activity timeline of the detail panel (`00-product-spec.md` §6.12 R-COL-03,
 * `01-ux-spec.md` §8.11, `04-frontend-plugin.md` §4.6).
 *
 * Reads back the rows `DocumentActivityLogSubscriber` writes on the backend event-bus seam:
 * newest first, "Show more" paging, capped at {@link DOCS_ACTIVITY_MAX_ITEMS}. System-driven
 * transitions (the whole extraction/classification/embedding pipeline marks itself
 * `actor: 'system'`) are attributed to "System" rather than to whoever happened to upload the
 * file.
 *
 * **Fault-isolated on purpose.** The panel loads links, comments and activity independently;
 * a failing activity read renders an inline retry here and leaves the rest of the panel intact.
 *
 * **Unknown values are never invented.** An action outside `ActionTypeEnum`, a column outside
 * the field-label map and an enum member with no translation all fall back to the raw stored
 * text — `custom-handler.ts` returns a missing key verbatim, so translating blindly would print
 * `DOCS.STATUS.<unmapped value>` at the user.
 */
export declare class DocsDetailActivityComponent extends TranslationBaseComponent implements OnChanges {
    readonly translateService: TranslateService;
    private readonly activityService;
    documentId: ID;
    entries: IDocumentActivityEntry[];
    loading: boolean;
    loadError: boolean;
    /** Full match count reported by the API — decides whether "Show more" is offered. */
    total: number;
    /** 1-based page number; the DTO `skip` is a page, not an offset. */
    private page;
    constructor(translateService: TranslateService, activityService: DocumentActivityService);
    ngOnChanges(changes: SimpleChanges): void;
    /** Re-reads the first page, dropping anything already loaded. */
    reload(): Promise<void>;
    /** Appends the next page; no-op once the cap or the end of the log is reached. */
    showMore(): Promise<void>;
    /**
     * True while there are more rows to fetch AND the cap leaves room for them.
     *
     * Both halves matter: `total` is the whole log for this document, which can be far larger
     * than the 100-row window the panel is specified to show.
     */
    get canShowMore(): boolean;
    private load;
    /** Retry target for the inline error: re-asks for the page that failed, keeping what loaded. */
    retry(): void;
    /** "System" for pipeline-owned transitions, the author's name otherwise. */
    actorLabel(entry: IDocumentActivityEntry): string;
    /** Translated action, or the raw stored action for anything outside `ActionTypeEnum`. */
    actionLabel(entry: IDocumentActivityEntry): string;
    /** Translated column name, or the raw column for anything outside the label map. */
    fieldLabel(change: IDocumentActivityChange): string;
    /** True when the change carries a before/after pair worth printing. */
    hasValues(change: IDocumentActivityChange): boolean;
    /** Enum member → its label; booleans → Yes/No; anything else → its own text. */
    valueLabel(change: IDocumentActivityChange, value: unknown): string;
    trackEntry(_: number, entry: IDocumentActivityEntry): string;
    trackChange(_: number, change: IDocumentActivityChange): string;
    private isPrintable;
    /**
     * Translates a key, falling back to the raw stored text when the key does not exist.
     *
     * 🛑 `custom-handler.ts` returns a missing key **verbatim**, so `instant()` cannot be trusted
     * to have found anything: comparing the result against the key is the only way to tell a
     * translation from a miss, and the miss must render the raw enum (spec 04 §4.6).
     */
    private translateOrRaw;
    static ɵfac: i0.ɵɵFactoryDeclaration<DocsDetailActivityComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<DocsDetailActivityComponent, "gz-docs-detail-activity", never, { "documentId": { "alias": "documentId"; "required": false; }; }, {}, never, never, false, never>;
}
