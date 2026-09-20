import { OnInit } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { DocumentVisibilityEnum, IDocumentCategory, PermissionsEnum } from '@gauzy/contracts';
import { Store, ToastrService } from '@gauzy/ui-core/core';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { IDocumentSettings, IDocumentSettingsDefaults, IDocumentSettingsStorage, IKnowledgeStatus } from '../../models/docs-api.model';
import { DocumentsService } from '../../services/documents.service';
import * as i0 from "@angular/core";
/** Catalog rows carry a `documentCount` projection the shared entity does not declare. */
type DocsCategoryRow = IDocumentCategory & {
    documentCount?: number;
};
/**
 * Documents settings page, registered at the `settings-sections` location so it
 * renders inside the core settings shell (`04-frontend-plugin.md` §2.1).
 *
 * Three blocks:
 *  1. Knowledge status banner — `GET /knowledge/status` (`vectorCapable`,
 *     `embeddingProviderConfigured`, `embeddingModel`); purely informational and
 *     silent on failure, so a deployment without the AI stack never shows an error.
 *  2. Org defaults — the writable block of `GET/PUT /settings`
 *     (`importToKnowledgeDefault`, `autoClassify`, `defaultVisibility`).
 *     `capabilities` is read-only by contract and is never sent back.
 *  3. Category catalog — full CRUD + merge (`DOCS_MANAGE`).
 *
 * Standalone + lazily loaded: it provides its own `DocumentsService` because it
 * lives outside `DocsUiModule`'s injector.
 */
export declare class DocsSettingsPageComponent extends TranslationBaseComponent implements OnInit {
    readonly translateService: TranslateService;
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
    settings: IDocumentSettings | null;
    knowledge: IKnowledgeStatus | null;
    categories: DocsCategoryRow[];
    loading: boolean;
    savingDefaults: boolean;
    loadError: boolean;
    readonly permissions: typeof PermissionsEnum;
    readonly visibilities: DocumentVisibilityEnum[];
    constructor(translateService: TranslateService, documentsService: DocumentsService, toastrService: ToastrService, dialogService: NbDialogService, store: Store);
    ngOnInit(): void;
    load(): Promise<void>;
    get defaults(): IDocumentSettingsDefaults | null;
    /**
     * Partial PUT of the defaults block only — `capabilities` and the computed
     * `quota` usage numbers are never writable.
     *
     * The response is re-normalized into {@link storage}: a `quotaBytes` write moves
     * the meter, and rebinding only `settings` would leave the card showing the old
     * limit until the next full page load.
     */
    saveDefaults(partial: Partial<IDocumentSettingsDefaults>): Promise<void>;
    onImportDefaultToggle(importToKnowledgeDefault: boolean): void;
    onAutoClassifyToggle(autoClassify: boolean): void;
    onDefaultVisibilityChange(defaultVisibility: DocumentVisibilityEnum): void;
    /**
     * `null` on any deployment that does not report usage — the whole card is
     * hidden then, rather than showing an invented "0 bytes used".
     *
     * Held as a field, not a getter: the template binds it through `*ngIf ... as`
     * and a getter would allocate a fresh object on every change-detection pass.
     */
    storage: IDocumentSettingsStorage | null;
    /** `null` when the quota is unlimited — there is no meaningful percentage. */
    get storagePercent(): number | null;
    /** Bar color: ≥ 95 % danger, ≥ 80 % warning, otherwise informational. */
    get storageStatus(): 'danger' | 'warning' | 'info';
    /**
     * Bound to the quota input, in GiB; `0` = unlimited, `null` = the deployment
     * does not expose a writable quota (the field is not rendered then).
     */
    quotaGib: number | null;
    /** True while the quota PUT is in flight — the field and its button are disabled. */
    savingQuota: boolean;
    /**
     * Whether this deployment reports a writable org quota at all.
     *
     * Keyed on `defaults.quotaBytes` — the field the PUT accepts — NOT on the
     * computed usage block: a deployment can report usage without accepting a
     * per-organization override, and an input bound to a field the server would
     * strip is a control that silently does nothing.
     */
    get canEditQuota(): boolean;
    /** True once the field differs from what the server currently holds. */
    get quotaDirty(): boolean;
    /** Persists the quota through the shared defaults PUT (`quotaBytes`, bytes, `0` = unlimited). */
    saveQuota(): Promise<void>;
    /** Bytes → GiB for the editor; `undefined` (unsupported) stays `null`. */
    private toGib;
    /** GiB → bytes for the wire. Anything unusable (blank, negative, NaN) means unlimited. */
    private toBytes;
    humanizeSize(bytes?: number | null): string;
    createCategory(): Promise<void>;
    editCategory(category: DocsCategoryRow): Promise<void>;
    /** System rows cannot be deleted (backend returns 409 `DOCS_CATEGORY_SYSTEM`). */
    deleteCategory(category: DocsCategoryRow): Promise<void>;
    mergeCategory(category: DocsCategoryRow): Promise<void>;
    trackById(_: number, category: DocsCategoryRow): string;
    private reloadCategories;
    static ɵfac: i0.ɵɵFactoryDeclaration<DocsSettingsPageComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<DocsSettingsPageComponent, "gz-docs-settings-page", never, {}, {}, never, never, true, never>;
}
export {};
