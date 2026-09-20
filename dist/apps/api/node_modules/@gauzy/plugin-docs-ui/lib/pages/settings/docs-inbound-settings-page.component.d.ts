import { OnInit } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { DocumentInboundAddressKindEnum, DocumentInboundDomainStatusEnum, IDocumentInboundDomainVerification, PermissionsEnum } from '@gauzy/contracts';
import { Store, ToastrService } from '@gauzy/ui-core/core';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { IDocumentSettingsCapabilities } from '../../models/docs-api.model';
import { IDocumentInboundAddressView } from '../../models/docs-inbound.model';
import { DocumentInboundAddressService } from '../../services/document-inbound-address.service';
import { DocumentsService } from '../../services/documents.service';
import * as i0 from "@angular/core";
/** Which destructive action a row is currently asking the user to confirm. */
export type DocsInboundConfirm = 'secret' | 'address' | null;
/**
 * View row: one capture address plus everything the card needs to edit it.
 *
 * 🛑 Every array on this object is a **field whose identity changes only when its contents
 * change**. The template iterates `allowlist` directly, and a getter that rebuilt it per
 * change-detection pass is precisely what pegged the main thread in the filter bar
 * (`facet-multiselect.component.ts:52-64`).
 */
export interface IDocsInboundAddressRow {
    /** The wire row. Replaced wholesale on every mutation so `[checked]` bindings re-evaluate. */
    address: IDocumentInboundAddressView;
    /** `GET /:id/verification`; `null` for a PLATFORM row or when the probe failed. */
    verification: IDocumentInboundDomainVerification | null;
    /** Allowlist draft. Empty means "any sender that passes SPF/DKIM". */
    allowlist: string[];
    /** True once the draft differs from what the server holds — gates the Save button. */
    allowlistDirty: boolean;
    /** Bound to the "add entry" input. */
    allowlistEntry: string;
    /** Per-row in-flight guard, so one rotation does not freeze every other card. */
    busy: boolean;
    /** Inline two-step confirmation for the two irreversible actions. */
    confirm: DocsInboundConfirm;
    /**
     * Stable `ngTemplateOutlet` context for the shared controls block.
     *
     * Built once in {@link DocsInboundSettingsPageComponent.toRow} rather than written inline as
     * `context: { $implicit: row }`: an object literal in a template allocates a fresh context on
     * every change-detection pass, which is the same identity churn that wedged the filter bar.
     */
    context: {
        $implicit: IDocsInboundAddressRow;
    };
}
/**
 * Inbound email capture settings, registered at the `settings-sections` location so it renders
 * inside the core settings shell alongside the main Documents settings page.
 *
 * Two blocks, mirroring the two kinds of address (spec 07 §17.2):
 *
 *  1. **Shared address** (`PLATFORM`) — minted automatically by the server on first read. The
 *     address itself is the credential, so it is shown read-only with a copy button and can only
 *     be *rotated*, never edited. An empty list means the deployment has no inbound domain
 *     configured and there was nothing to mint — said plainly rather than shown as an error.
 *  2. **Tenant domains** (`CUSTOM_DOMAIN`) — added here, each with its DNS TXT record, a verify
 *     button and a status. Mail is REJECTED until the record verifies, and a `FAILED` row means
 *     a record that once verified has since disappeared; both facts are stated on the card,
 *     because "PENDING" on its own does not tell an administrator that mail is bouncing.
 *
 * Both kinds share the sender allowlist, the body-import preference and the active flag.
 *
 * 🛑 **The relay secret is returned exactly once** — on create and on rotate. It is handed
 * straight to {@link InboundSecretDialogComponent} and never stored on this component, in a
 * store, or in a toast.
 *
 * Standalone + lazily loaded: it provides its own services because it lives outside
 * `DocsUiModule`'s injector.
 */
export declare class DocsInboundSettingsPageComponent extends TranslationBaseComponent implements OnInit {
    readonly translateService: TranslateService;
    private readonly inboundService;
    private readonly documentsService;
    private readonly toastrService;
    private readonly dialogService;
    private readonly store;
    /**
     * Stable permission arrays for the template's `*ngxPermissionsOnly` gates.
     * 🛑 Never inline `[permissions.X]` in a binding — a fresh array each change-detection cycle
     * makes ngx-permissions re-validate forever and wedges the main thread.
     */
    readonly docsPermissions: Readonly<{
        read: PermissionsEnum[];
        create: PermissionsEnum[];
        update: PermissionsEnum[];
        delete: PermissionsEnum[];
        manage: PermissionsEnum[];
        review: PermissionsEnum[];
        aiImport: PermissionsEnum[];
    }>;
    /** The organization's PLATFORM row, or `null` when the deployment mints none. */
    platform: IDocsInboundAddressRow | null;
    /**
     * The organization's CUSTOM_DOMAIN rows.
     *
     * A field, not a getter: the template iterates it and a getter would hand `*ngFor` a fresh
     * array on every change-detection pass.
     */
    customDomains: IDocsInboundAddressRow[];
    /** Deployment capabilities from `GET /settings` — used only for the "capture is off" banner. */
    capabilities: IDocumentSettingsCapabilities | null;
    loading: boolean;
    loadError: boolean;
    /** True once the list answered 404 — this deployment predates the capture endpoints. */
    unsupported: boolean;
    /** True while `POST /inbound-addresses` is in flight. */
    adding: boolean;
    readonly permissions: typeof PermissionsEnum;
    readonly kinds: typeof DocumentInboundAddressKindEnum;
    readonly statuses: typeof DocumentInboundDomainStatusEnum;
    readonly allowlistMax = 200;
    constructor(translateService: TranslateService, inboundService: DocumentInboundAddressService, documentsService: DocumentsService, toastrService: ToastrService, dialogService: NbDialogService, store: Store);
    ngOnInit(): void;
    load(): Promise<void>;
    /**
     * Splits the wire rows into the two cards and fetches each custom domain's DNS record.
     *
     * One extra call per custom domain — a handful at most, and the record is only authoritative
     * server-side (the `_gauzy-docs` prefix is a backend constant). A failed probe leaves that
     * row's `verification` at `null`, which the template renders as "record unavailable" instead
     * of failing the whole page.
     */
    private project;
    /** Wire row → view row. The allowlist is copied so editing never mutates the response. */
    private toRow;
    onImportBodyToggle(row: IDocsInboundAddressRow, importBodyAsNote: boolean): void;
    onActiveToggle(row: IDocsInboundAddressRow, isActive: boolean): void;
    /**
     * Partial update of one address.
     *
     * Optimistic, and it must be: `nb-toggle` is bound through `[checked]`, so if the row were
     * left untouched while the request flew, the binding value would not change and Angular
     * would never push the old state back — a failed save would leave a toggle showing the
     * opposite of what the server holds. The snapshot is restored on error for the same reason
     * (`docs-settings-page.component.ts:161-181`).
     */
    private patch;
    /**
     * Can the typed entry be added? Guards the Add button and is re-checked in
     * {@link addAllowlistEntry} — Enter reaches the handler without the button.
     */
    canAddAllowlistEntry(row: IDocsInboundAddressRow): boolean;
    addAllowlistEntry(row: IDocsInboundAddressRow): void;
    removeAllowlistEntry(row: IDocsInboundAddressRow, entry: string): void;
    /**
     * Persists the draft.
     *
     * An empty array is sent as an empty array, not omitted: that is how the list is *cleared*,
     * and the server reads a cleared list as "accept any sender that passes SPF/DKIM".
     */
    saveAllowlist(row: IDocsInboundAddressRow): Promise<void>;
    /**
     * Re-derives {@link IDocsInboundAddressRow.allowlistDirty} against the server's value.
     *
     * @param adopt When true, the draft is replaced by the server's list (after a successful
     * allowlist save). Otherwise the draft is left alone and only the dirty flag is recomputed —
     * so adding an entry and removing it again correctly reads as clean.
     */
    private syncAllowlist;
    /**
     * Re-checks the TXT record.
     *
     * 🛑 A missing record is a **200**, not a failure: the endpoint answers with the unchanged
     * (or degraded) status plus a `message`. Reading the status rather than assuming success is
     * the whole point — a `catch`-only implementation would report "verified" for every failure.
     */
    verify(row: IDocsInboundAddressRow): Promise<void>;
    addDomain(): Promise<void>;
    /** Arms the inline confirmation strip for one irreversible action. */
    askConfirm(row: IDocsInboundAddressRow, confirm: DocsInboundConfirm): void;
    cancelConfirm(row: IDocsInboundAddressRow): void;
    /**
     * Issues a new relay secret. The previous one stops working immediately, so the relay has to
     * be updated with the value the dialog shows — which is why the warning is stated inline,
     * before the click, rather than only in the reveal dialog afterwards.
     *
     * Offered for `CUSTOM_DOMAIN` only. A `PLATFORM` row has no per-address secret — deliveries to
     * it are authenticated by the deployment-wide relay signature instead.
     *
     * 🛑 Not because rotating one would *break* capture: the webhook gate is an OR
     * (`inbound-email.service.ts` — `if (!globalSignatureOk && !perAddressSecretOk) throw`), so an
     * address secret on a PLATFORM row leaves the global signature working. It is hidden because
     * it would be **inert**: the platform relay never sends the per-address secret header, so the
     * button would hand out a one-time secret that nothing ever presents — a credential the user
     * is told to store and act on, which in fact does nothing.
     */
    rotateSecret(row: IDocsInboundAddressRow): Promise<void>;
    /**
     * Mints a new PLATFORM address. The old one stops resolving at once — anything still mailing
     * it will bounce — so this is a two-step action with the consequence spelled out.
     */
    rotateAddress(row: IDocsInboundAddressRow): Promise<void>;
    /**
     * Puts the one-time secret in front of the user and waits for the acknowledgement.
     *
     * `closeOnEsc`/`closeOnBackdropClick` are off on purpose: the plaintext cannot be asked for
     * again, so a reflexive Esc must not be able to throw it away.
     */
    private revealSecret;
    /**
     * Copies a value and confirms with a toast.
     *
     * A denied clipboard permission is swallowed, as everywhere else in this package
     * (`docs-row-actions.service.ts:232-240`): every value copied here is also selectable on
     * screen, so a failure leaves the user no worse off and nothing to roll back.
     */
    copy(value: string | null | undefined, messageKey: string): Promise<void>;
    statusLabelKey(status?: DocumentInboundDomainStatusEnum): string;
    statusHintKey(status?: DocumentInboundDomainStatusEnum): string;
    statusBadge(status?: DocumentInboundDomainStatusEnum): 'warning' | 'success' | 'danger';
    trackByRowId(_: number, row: IDocsInboundAddressRow): string;
    /** Entries are unique within a list (duplicates are refused on add), so the value is the key. */
    trackByEntry(_: number, entry: string): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<DocsInboundSettingsPageComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<DocsInboundSettingsPageComponent, "gz-docs-inbound-settings-page", never, {}, {}, never, never, true, never>;
}
