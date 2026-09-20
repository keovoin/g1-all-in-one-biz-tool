import { EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { BaseEntityEnum, ID, IDocumentLink, PermissionsEnum } from '@gauzy/contracts';
import { Store, ToastrService } from '@gauzy/ui-core/core';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { DocumentsService } from '../../services/documents.service';
import * as i0 from "@angular/core";
/**
 * The record-side **Documents** panel (`00-product-spec.md` §6.14 R-LNK-02,
 * `10-implementation-plan.md` §6.1 C6): every document attached to one business
 * record, with open / download / unlink plus "attach existing" and "upload new".
 *
 * Mounted on the invoice, task, project, employee and contact detail surfaces. It
 * is the mirror image of the hub's own **Linked records** section: that one lists
 * the records a document points at, this one lists the documents pointing at a
 * record. Both ride the same `GET /plugins/docs/links` endpoint, which already
 * projects a list-safe document (name/kind/mime/size — never content, never the
 * storage key) through the document visibility scope, so a link to a PRIVATE
 * document the caller cannot read never reaches this component at all.
 *
 * 🛑 **Standalone on purpose.** The hosts are app NgModules that must not — and
 * cannot — pull in `DocsUiModule` (it provides the hub's ROUTES factory and its
 * Akita stores). Being standalone also means it brings its own `DocumentsService`
 * provider: outside the hub there is no module-level instance to inherit.
 *
 * 🛑 It gates **itself** on `DOCS_READ` + `FEATURE_DOCUMENTS` rather than making
 * five host templates remember to. A host embeds one line and the panel decides
 * whether it exists.
 */
export declare class DocumentLinksPanelComponent extends TranslationBaseComponent implements OnChanges {
    readonly translateService: TranslateService;
    private readonly documentsService;
    private readonly dialogService;
    private readonly toastrService;
    private readonly router;
    private readonly store;
    /** The business-record type this panel hangs off (e.g. `BaseEntityEnum.Invoice`). */
    entity: BaseEntityEnum;
    /** The business-record id. The panel renders nothing until this is set. */
    entityId: ID;
    /**
     * Optional display name of the host record, persisted into
     * `DocumentLink.metadata.label` when a document is attached — the hub's own
     * Linked-records section renders that label instead of a bare UUID, and it keeps
     * showing something if the record is later renamed or removed.
     */
    entityLabel?: string;
    /**
     * Read-only hosting: hides the attach / upload / unlink affordances while
     * keeping open and download. For surfaces that present the record itself as
     * read-only (the invoice/estimate VIEW page) — mutating attachments belongs on
     * the edit surface there. A host choice, not a permission: `canLink` /
     * `canUpload` are untouched.
     */
    readonly: boolean;
    /**
     * When set, the whole card renders only once at least one link exists — on a
     * read-only host an empty "Documents" card is pure noise. Off by default so
     * the existing hosts keep offering "attach" on an empty panel.
     */
    hideWhenEmpty: boolean;
    /** Emits the current link count after every load/mutation (host badge counters). */
    countChanged: EventEmitter<number>;
    links: IDocumentLink[];
    loading: boolean;
    loadError: boolean;
    /** Set while an upload is in flight — the button spins instead of queueing a second file. */
    uploading: boolean;
    readonly permissions: typeof PermissionsEnum;
    /** Accept list for the file input (UX only — the server sniffs and re-validates). */
    readonly accept = ".pdf,.docx,.xlsx,.pptx,.odt,.ods,.csv,.txt,.md,.html,.png,.jpg,.jpeg,.webp,.gif";
    constructor(translateService: TranslateService, documentsService: DocumentsService, dialogService: NbDialogService, toastrService: ToastrService, router: Router, store: Store);
    /**
     * Reloads on every (entity, entityId) change — the hosts reuse one component
     * instance across records (a routed detail page navigating between ids, a dialog
     * reopened for another row), so binding once in `ngOnInit` would leave the second
     * record showing the first one's documents.
     */
    ngOnChanges(changes: SimpleChanges): void;
    /**
     * The panel exists only for a reader of an org with the feature on. Both halves
     * matter: the permission alone would render a panel whose every request 403s on a
     * feature-disabled organization (`FeatureFlagGuard` fronts all docs routes).
     */
    get visible(): boolean;
    /**
     * The template's root gate: `visible`, narrowed by `hideWhenEmpty` to "only
     * once at least one link has actually loaded". A load in flight or a failed
     * load keeps the card up regardless — hiding it there would hide the error
     * state and the retry affordance with it.
     */
    get shown(): boolean;
    /** Attaching and detaching are both `DOCS_UPDATE` (`POST`/`DELETE /links`). */
    get canLink(): boolean;
    /**
     * "Upload new" is two writes — the document (`DOCS_CREATE`) and then the link
     * (`DOCS_UPDATE`). Both are required: offering it to a `DOCS_CREATE`-only holder
     * would upload the file and then fail to attach it, leaving an orphan in the hub.
     */
    get canUpload(): boolean;
    load(): Promise<void>;
    /** Row label: the document name, falling back to the label captured at link time. */
    labelOf(link: IDocumentLink): string;
    /** Eva icon per document kind — pages and files read very differently in a list. */
    iconOf(link: IDocumentLink): string;
    /** `123 KB`, or an empty string when there are no bytes (a PAGE has none). */
    sizeOf(link: IDocumentLink): string;
    /** Only a FILE has bytes to download; a PAGE's "download" is an export, not this. */
    isFile(link: IDocumentLink): boolean;
    trackByLink(_: number, link: IDocumentLink): string;
    /**
     * Opens the document in the hub: a PAGE goes straight to its editor route, a FILE
     * (or anything else) deep-links the browse surface with `?id=`, which is what
     * opens the detail panel — `docs-shell.component.ts` treats that query param as
     * the source of truth for the open panel.
     */
    open(link: IDocumentLink): void;
    /**
     * Downloads the original bytes.
     *
     * 🛑 `GET /:id/download` answers `{ url }` **as JSON behind the JWT guard** — it
     * is not a redirect. It has to be fetched through the authenticated client and
     * only the resolved provider URL may be handed to the browser; navigating to the
     * endpoint directly sends no token and lands on a 401.
     */
    download(link: IDocumentLink): Promise<void>;
    /** Detaches the document from this record. The document itself is untouched. */
    unlink(link: IDocumentLink): Promise<void>;
    /** Picks an existing document and attaches it to this record. */
    attachExisting(): Promise<void>;
    /**
     * Uploads a file and links it in one gesture.
     *
     * Deliberately two calls, not one: the upload endpoint knows nothing about
     * `DocumentLink`, so the link is created from the accepted document. A failed link
     * write is surfaced but the document is kept — deleting a file the user just
     * uploaded because a follow-up call failed would be the worse outcome.
     */
    uploadNew(input: HTMLInputElement): Promise<void>;
    static ɵfac: i0.ɵɵFactoryDeclaration<DocumentLinksPanelComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<DocumentLinksPanelComponent, "gz-document-links-panel", never, { "entity": { "alias": "entity"; "required": false; }; "entityId": { "alias": "entityId"; "required": false; }; "entityLabel": { "alias": "entityLabel"; "required": false; }; "readonly": { "alias": "readonly"; "required": false; }; "hideWhenEmpty": { "alias": "hideWhenEmpty"; "required": false; }; }, { "countChanged": "countChanged"; }, never, never, true, never>;
}
