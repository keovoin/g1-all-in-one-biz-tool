import { __decorate, __metadata } from "tslib";
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NbBadgeModule, NbButtonModule, NbCardModule, NbDialogService, NbIconModule, NbInputModule, NbProgressBarModule, NbSelectModule, NbSpinnerModule, NbToggleModule, NbTooltipModule } from '@nebular/theme';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { NgxPermissionsModule } from 'ngx-permissions';
import { catchError, filter, firstValueFrom, of, tap } from 'rxjs';
import { DocumentVisibilityEnum, PermissionsEnum } from '@gauzy/contracts';
import { distinctUntilChange } from '@gauzy/ui-core/common';
import { Store, ToastrService } from '@gauzy/ui-core/core';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { DeleteConfirmationComponent } from '@gauzy/ui-core/shared';
import { CategoryDialogComponent } from '../../dialogs/category-dialog.component';
import { CategoryMergeDialogComponent } from '../../dialogs/category-merge-dialog.component';
import { normalizeDocumentStorage } from '../../models/docs-api.model';
import { DocumentsService } from '../../services/documents.service';
import { DOCS_PERMISSIONS } from '../../docs-permission-groups';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
import * as i2 from "../../services/documents.service";
import * as i3 from "@gauzy/ui-core/core";
import * as i4 from "@nebular/theme";
import * as i5 from "@angular/common";
import * as i6 from "@angular/forms";
import * as i7 from "ngx-permissions";
/**
 * Divisor for the quota editor. The wire field is bytes (`@IsInt() @Min(0)`), but an
 * org quota is a GiB-scale number and nobody should have to type ten digits — the
 * field edits GiB and converts on the way in and out.
 */
const BYTES_PER_GIB = 1024 * 1024 * 1024;
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
let DocsSettingsPageComponent = class DocsSettingsPageComponent extends TranslationBaseComponent {
    constructor(translateService, documentsService, toastrService, dialogService, store) {
        super(translateService);
        this.translateService = translateService;
        this.documentsService = documentsService;
        this.toastrService = toastrService;
        this.dialogService = dialogService;
        this.store = store;
        /**
         * Stable permission arrays for the template's `*ngxPermissionsOnly` gates.
         * 🛑 Never inline `[permissions.X]` in a binding — a fresh array each change-detection cycle
         * makes ngx-permissions re-validate forever and wedges the main thread.
         */
        this.docsPermissions = DOCS_PERMISSIONS;
        this.settings = null;
        this.knowledge = null;
        this.categories = [];
        this.loading = false;
        this.savingDefaults = false;
        this.loadError = false;
        this.permissions = PermissionsEnum;
        this.visibilities = [DocumentVisibilityEnum.ORGANIZATION, DocumentVisibilityEnum.PRIVATE];
        // ─── Storage usage (P1 quota, spec 08 §5.7) ──────────────────
        /**
         * `null` on any deployment that does not report usage — the whole card is
         * hidden then, rather than showing an invented "0 bytes used".
         *
         * Held as a field, not a getter: the template binds it through `*ngIf ... as`
         * and a getter would allocate a fresh object on every change-detection pass.
         */
        this.storage = null;
        // ─── Quota editor (the one writable quota field) ─────────────
        /**
         * Bound to the quota input, in GiB; `0` = unlimited, `null` = the deployment
         * does not expose a writable quota (the field is not rendered then).
         */
        this.quotaGib = null;
        /** True while the quota PUT is in flight — the field and its button are disabled. */
        this.savingQuota = false;
    }
    ngOnInit() {
        this.store.selectedOrganization$
            .pipe(filter((organization) => !!organization), distinctUntilChange(), tap(() => void this.load()), untilDestroyed(this))
            .subscribe();
    }
    // ─── Loading ─────────────────────────────────────────────────
    async load() {
        this.loading = true;
        this.loadError = false;
        try {
            // Only the settings call is load-bearing: the knowledge probe and the
            // catalog degrade to "unknown"/empty rather than failing the page.
            const [settings, knowledge, categories] = await Promise.all([
                firstValueFrom(this.documentsService.getSettings()),
                firstValueFrom(this.documentsService.getKnowledgeStatus().pipe(catchError(() => of(null)))),
                firstValueFrom(this.documentsService.getCategories().pipe(catchError(() => of([]))))
            ]);
            this.settings = settings;
            this.storage = normalizeDocumentStorage(settings);
            this.quotaGib = this.toGib(settings?.defaults?.quotaBytes);
            this.knowledge = knowledge;
            this.categories = (categories ?? []);
        }
        catch {
            this.loadError = true;
            this.settings = null;
            this.storage = null;
            this.quotaGib = null;
        }
        finally {
            this.loading = false;
        }
    }
    // ─── Org defaults ────────────────────────────────────────────
    get defaults() {
        return this.settings?.defaults ?? null;
    }
    /**
     * Partial PUT of the defaults block only — `capabilities` and the computed
     * `quota` usage numbers are never writable.
     *
     * The response is re-normalized into {@link storage}: a `quotaBytes` write moves
     * the meter, and rebinding only `settings` would leave the card showing the old
     * limit until the next full page load.
     */
    async saveDefaults(partial) {
        if (!this.settings || this.savingDefaults)
            return;
        const previous = this.settings;
        const previousStorage = this.storage;
        // Optimistic: the toggles must not lag a round trip.
        this.settings = { ...previous, defaults: { ...previous.defaults, ...partial } };
        this.savingDefaults = true;
        try {
            this.settings = await firstValueFrom(this.documentsService.updateSettings(partial));
            this.storage = normalizeDocumentStorage(this.settings);
            this.quotaGib = this.toGib(this.settings?.defaults?.quotaBytes);
            this.toastrService.success(this.getTranslation('DOCS.TOASTS.UPDATED'));
        }
        catch (error) {
            this.settings = previous; // revert
            this.storage = previousStorage;
            this.quotaGib = this.toGib(previous?.defaults?.quotaBytes);
            this.toastrService.danger(error);
        }
        finally {
            this.savingDefaults = false;
        }
    }
    onImportDefaultToggle(importToKnowledgeDefault) {
        void this.saveDefaults({ importToKnowledgeDefault });
    }
    onAutoClassifyToggle(autoClassify) {
        void this.saveDefaults({ autoClassify });
    }
    onDefaultVisibilityChange(defaultVisibility) {
        void this.saveDefaults({ defaultVisibility });
    }
    /** `null` when the quota is unlimited — there is no meaningful percentage. */
    get storagePercent() {
        const storage = this.storage;
        if (!storage?.quotaBytes)
            return null;
        return Math.min(100, Math.round((storage.usedBytes / storage.quotaBytes) * 100));
    }
    /** Bar color: ≥ 95 % danger, ≥ 80 % warning, otherwise informational. */
    get storageStatus() {
        const percent = this.storagePercent ?? 0;
        if (percent >= 95)
            return 'danger';
        if (percent >= 80)
            return 'warning';
        return 'info';
    }
    /**
     * Whether this deployment reports a writable org quota at all.
     *
     * Keyed on `defaults.quotaBytes` — the field the PUT accepts — NOT on the
     * computed usage block: a deployment can report usage without accepting a
     * per-organization override, and an input bound to a field the server would
     * strip is a control that silently does nothing.
     */
    get canEditQuota() {
        return typeof this.settings?.defaults?.quotaBytes === 'number';
    }
    /** True once the field differs from what the server currently holds. */
    get quotaDirty() {
        if (!this.canEditQuota)
            return false;
        return this.toBytes(this.quotaGib) !== (this.settings?.defaults?.quotaBytes ?? 0);
    }
    /** Persists the quota through the shared defaults PUT (`quotaBytes`, bytes, `0` = unlimited). */
    async saveQuota() {
        if (!this.canEditQuota || this.savingQuota || !this.quotaDirty)
            return;
        this.savingQuota = true;
        try {
            await this.saveDefaults({ quotaBytes: this.toBytes(this.quotaGib) });
        }
        finally {
            this.savingQuota = false;
        }
    }
    /** Bytes → GiB for the editor; `undefined` (unsupported) stays `null`. */
    toGib(bytes) {
        if (typeof bytes !== 'number' || !Number.isFinite(bytes))
            return null;
        if (bytes <= 0)
            return 0;
        // Two decimals keeps a 512 MiB quota editable without turning into 0.
        return Math.round((bytes / BYTES_PER_GIB) * 100) / 100;
    }
    /** GiB → bytes for the wire. Anything unusable (blank, negative, NaN) means unlimited. */
    toBytes(gib) {
        if (typeof gib !== 'number' || !Number.isFinite(gib) || gib <= 0)
            return 0;
        return Math.round(gib * BYTES_PER_GIB);
    }
    humanizeSize(bytes) {
        if (!bytes)
            return '0 B';
        const units = ['B', 'KB', 'MB', 'GB', 'TB'];
        const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
        const value = bytes / Math.pow(1024, exponent);
        return `${value >= 10 || exponent === 0 ? Math.round(value) : value.toFixed(1)} ${units[exponent]}`;
    }
    // ─── Categories ──────────────────────────────────────────────
    async createCategory() {
        const result = await firstValueFrom(this.dialogService.open(CategoryDialogComponent).onClose);
        if (!result)
            return;
        try {
            // `CreateDocumentCategoryDTO` extends `TenantOrganizationBaseDTO`, which
            // REQUIRES `organizationId` — omitting it fails validation with a 400.
            const organization = this.store.selectedOrganization;
            await firstValueFrom(this.documentsService.createCategory({
                ...result,
                organizationId: organization?.id,
                tenantId: organization?.tenantId
            }));
            this.toastrService.success(this.getTranslation('DOCS.TOASTS.CREATED'));
            await this.reloadCategories();
        }
        catch (error) {
            this.toastrService.danger(error);
        }
    }
    async editCategory(category) {
        const result = await firstValueFrom(this.dialogService.open(CategoryDialogComponent, { context: { category } }).onClose);
        if (!result)
            return;
        try {
            await firstValueFrom(this.documentsService.updateCategory(category.id, result));
            this.toastrService.success(this.getTranslation('DOCS.TOASTS.UPDATED'));
            await this.reloadCategories();
        }
        catch (error) {
            this.toastrService.danger(error);
        }
    }
    /** System rows cannot be deleted (backend returns 409 `DOCS_CATEGORY_SYSTEM`). */
    async deleteCategory(category) {
        if (category.isSystem)
            return;
        const confirmed = await firstValueFrom(this.dialogService.open(DeleteConfirmationComponent, {
            context: { recordType: this.getTranslation('DOCS.SETTINGS.CATEGORIES') }
        }).onClose);
        if (!confirmed)
            return;
        try {
            await firstValueFrom(this.documentsService.deleteCategory(category.id));
            this.toastrService.success(this.getTranslation('DOCS.TOASTS.DELETED'));
            await this.reloadCategories();
        }
        catch (error) {
            this.toastrService.danger(error);
        }
    }
    async mergeCategory(category) {
        const targets = this.categories.filter((row) => String(row.id) !== String(category.id));
        if (!targets.length)
            return;
        const targetId = await firstValueFrom(this.dialogService.open(CategoryMergeDialogComponent, { context: { source: category, targets } }).onClose);
        if (!targetId)
            return;
        try {
            await firstValueFrom(this.documentsService.mergeCategory(category.id, targetId));
            this.toastrService.success(this.getTranslation('DOCS.TOASTS.UPDATED'));
            await this.reloadCategories();
        }
        catch (error) {
            this.toastrService.danger(error);
        }
    }
    trackById(_, category) {
        return String(category.id);
    }
    async reloadCategories() {
        this.categories = ((await firstValueFrom(this.documentsService.getCategories().pipe(catchError(() => of([]))))) ?? []);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DocsSettingsPageComponent, deps: [{ token: i1.TranslateService }, { token: i2.DocumentsService }, { token: i3.ToastrService }, { token: i4.NbDialogService }, { token: i3.Store }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: DocsSettingsPageComponent, isStandalone: true, selector: "gz-docs-settings-page", providers: [DocumentsService], usesInheritance: true, ngImport: i0, template: "<div class=\"docs-settings\" [nbSpinner]=\"loading\" nbSpinnerStatus=\"primary\">\n\t<div class=\"docs-settings-header\">\n\t\t<h4>{{ 'DOCS.SETTINGS.TITLE' | translate }}</h4>\n\t\t<p class=\"muted\">{{ 'DOCS.SETTINGS.SUBTITLE' | translate }}</p>\n\t</div>\n\n\t<!-- Load error -->\n\t<nb-card *ngIf=\"loadError\" class=\"docs-settings-card\">\n\t\t<nb-card-body class=\"docs-settings-error\">\n\t\t\t<nb-icon icon=\"alert-triangle-outline\" status=\"danger\"></nb-icon>\n\t\t\t<span>{{ 'DOCS.SETTINGS.LOAD_ERROR' | translate }}</span>\n\t\t\t<button nbButton size=\"small\" (click)=\"load()\">{{ 'DOCS.ERRORS.GENERIC_RETRY' | translate }}</button>\n\t\t</nb-card-body>\n\t</nb-card>\n\n\t<!-- 1. AI knowledge status banner (GET /knowledge/status) -->\n\t<nb-card *ngIf=\"knowledge\" class=\"docs-settings-card\">\n\t\t<nb-card-header>{{ 'DOCS.SETTINGS.KNOWLEDGE_STATUS' | translate }}</nb-card-header>\n\t\t<nb-card-body class=\"docs-knowledge-banner\">\n\t\t\t<div class=\"docs-knowledge-fact\">\n\t\t\t\t<nb-icon\n\t\t\t\t\t[icon]=\"knowledge.vectorCapable ? 'checkmark-circle-2-outline' : 'alert-triangle-outline'\"\n\t\t\t\t\t[status]=\"knowledge.vectorCapable ? 'success' : 'warning'\"\n\t\t\t\t></nb-icon>\n\t\t\t\t<span>\n\t\t\t\t\t{{\n\t\t\t\t\t\t(knowledge.vectorCapable\n\t\t\t\t\t\t\t? 'DOCS.SETTINGS.VECTOR_CAPABLE'\n\t\t\t\t\t\t\t: 'DOCS.SETTINGS.VECTOR_NOT_CAPABLE'\n\t\t\t\t\t\t) | translate\n\t\t\t\t\t}}\n\t\t\t\t</span>\n\t\t\t</div>\n\t\t\t<div class=\"docs-knowledge-fact\">\n\t\t\t\t<nb-icon\n\t\t\t\t\t[icon]=\"knowledge.embeddingProviderConfigured ? 'checkmark-circle-2-outline' : 'alert-triangle-outline'\"\n\t\t\t\t\t[status]=\"knowledge.embeddingProviderConfigured ? 'success' : 'warning'\"\n\t\t\t\t></nb-icon>\n\t\t\t\t<span>\n\t\t\t\t\t{{\n\t\t\t\t\t\t(knowledge.embeddingProviderConfigured\n\t\t\t\t\t\t\t? 'DOCS.SETTINGS.EMBEDDING_CONFIGURED'\n\t\t\t\t\t\t\t: 'DOCS.SETTINGS.EMBEDDING_NOT_CONFIGURED'\n\t\t\t\t\t\t) | translate\n\t\t\t\t\t}}\n\t\t\t\t</span>\n\t\t\t</div>\n\t\t\t<div class=\"docs-knowledge-fact\" *ngIf=\"knowledge.embeddingModel\">\n\t\t\t\t<nb-icon icon=\"cube-outline\"></nb-icon>\n\t\t\t\t<span>{{ 'DOCS.SETTINGS.EMBEDDING_MODEL' | translate }}:</span>\n\t\t\t\t<code>{{ knowledge.embeddingModel }}</code>\n\t\t\t</div>\n\t\t</nb-card-body>\n\t</nb-card>\n\n\t<!-- 2. Organization defaults (PUT /settings) -->\n\t<nb-card *ngIf=\"defaults as orgDefaults\" class=\"docs-settings-card\">\n\t\t<nb-card-header>{{ 'DOCS.SETTINGS.DEFAULTS' | translate }}</nb-card-header>\n\t\t<nb-card-body>\n\t\t\t<ng-container *ngxPermissionsOnly=\"docsPermissions.manage; else defaultsReadonly\">\n\t\t\t\t<div class=\"docs-settings-row\">\n\t\t\t\t\t<nb-toggle\n\t\t\t\t\t\tlabelPosition=\"end\"\n\t\t\t\t\t\t[checked]=\"orgDefaults.importToKnowledgeDefault\"\n\t\t\t\t\t\t[disabled]=\"savingDefaults\"\n\t\t\t\t\t\t(checkedChange)=\"onImportDefaultToggle($event)\"\n\t\t\t\t\t>\n\t\t\t\t\t\t{{ 'DOCS.SETTINGS.IMPORT_DEFAULT' | translate }}\n\t\t\t\t\t</nb-toggle>\n\t\t\t\t\t<div class=\"hint\">{{ 'DOCS.UPLOAD.KNOWLEDGE_HINT' | translate }}</div>\n\t\t\t\t</div>\n\n\t\t\t\t<div class=\"docs-settings-row\">\n\t\t\t\t\t<nb-toggle\n\t\t\t\t\t\tlabelPosition=\"end\"\n\t\t\t\t\t\t[checked]=\"orgDefaults.autoClassify\"\n\t\t\t\t\t\t[disabled]=\"savingDefaults\"\n\t\t\t\t\t\t(checkedChange)=\"onAutoClassifyToggle($event)\"\n\t\t\t\t\t>\n\t\t\t\t\t\t{{ 'DOCS.UPLOAD.AI_CLASSIFY_TOGGLE' | translate }}\n\t\t\t\t\t</nb-toggle>\n\t\t\t\t\t<div class=\"hint\">{{ 'DOCS.UPLOAD.AI_CLASSIFY_HINT' | translate }}</div>\n\t\t\t\t</div>\n\n\t\t\t\t<div class=\"docs-settings-row\">\n\t\t\t\t\t<label class=\"label\" for=\"docs-settings-default-visibility\">\n\t\t\t\t\t\t{{ 'DOCS.VISIBILITY.LABEL' | translate }}\n\t\t\t\t\t</label>\n\t\t\t\t\t<nb-select\n\t\t\t\t\t\tid=\"docs-settings-default-visibility\"\n\t\t\t\t\t\tsize=\"small\"\n\t\t\t\t\t\t[selected]=\"orgDefaults.defaultVisibility\"\n\t\t\t\t\t\t[disabled]=\"savingDefaults\"\n\t\t\t\t\t\t(selectedChange)=\"onDefaultVisibilityChange($event)\"\n\t\t\t\t\t>\n\t\t\t\t\t\t<nb-option *ngFor=\"let visibility of visibilities\" [value]=\"visibility\">\n\t\t\t\t\t\t\t{{ 'DOCS.VISIBILITY.' + visibility | translate }}\n\t\t\t\t\t\t</nb-option>\n\t\t\t\t\t</nb-select>\n\t\t\t\t\t<div class=\"hint\">{{ 'DOCS.VISIBILITY.HINT' | translate }}</div>\n\t\t\t\t</div>\n\t\t\t</ng-container>\n\n\t\t\t<ng-template #defaultsReadonly>\n\t\t\t\t<dl class=\"docs-settings-meta\">\n\t\t\t\t\t<dt>{{ 'DOCS.SETTINGS.IMPORT_DEFAULT' | translate }}</dt>\n\t\t\t\t\t<dd>{{ orgDefaults.importToKnowledgeDefault ? '\u2713' : '\u2014' }}</dd>\n\t\t\t\t\t<dt>{{ 'DOCS.UPLOAD.AI_CLASSIFY_TOGGLE' | translate }}</dt>\n\t\t\t\t\t<dd>{{ orgDefaults.autoClassify ? '\u2713' : '\u2014' }}</dd>\n\t\t\t\t\t<dt>{{ 'DOCS.VISIBILITY.LABEL' | translate }}</dt>\n\t\t\t\t\t<dd>{{ 'DOCS.VISIBILITY.' + orgDefaults.defaultVisibility | translate }}</dd>\n\t\t\t\t</dl>\n\t\t\t</ng-template>\n\t\t</nb-card-body>\n\t</nb-card>\n\n\t<!-- 3. Storage usage (P1 quota \u2014 DOCS_MANAGE only, spec 08 \u00A75.7).\n\t     Rendered only when the deployment actually reports usage. The permission gate\n\t     wraps the whole card: nested inside it, a non-manager saw an empty card shell. -->\n\t<ng-container *ngxPermissionsOnly=\"docsPermissions.manage\">\n\t\t<nb-card *ngIf=\"storage as usage\" class=\"docs-settings-card\">\n\t\t\t<nb-card-header>{{ 'DOCS.SETTINGS.STORAGE' | translate }}</nb-card-header>\n\t\t\t<nb-card-body>\n\t\t\t\t<div class=\"docs-storage-line\">\n\t\t\t\t\t<ng-container *ngIf=\"usage.quotaBytes; else unlimitedQuota\">\n\t\t\t\t\t\t{{\n\t\t\t\t\t\t\t'DOCS.SETTINGS.STORAGE_USED'\n\t\t\t\t\t\t\t\t| translate\n\t\t\t\t\t\t\t\t\t: { used: humanizeSize(usage.usedBytes), quota: humanizeSize(usage.quotaBytes) }\n\t\t\t\t\t\t}}\n\t\t\t\t\t\t<span class=\"docs-storage-percent\">({{ storagePercent }}%)</span>\n\t\t\t\t\t</ng-container>\n\t\t\t\t\t<ng-template #unlimitedQuota>\n\t\t\t\t\t\t{{ 'DOCS.SETTINGS.STORAGE_USED_UNLIMITED' | translate : { used: humanizeSize(usage.usedBytes) } }}\n\t\t\t\t\t</ng-template>\n\t\t\t\t</div>\n\n\t\t\t\t<nb-progress-bar\n\t\t\t\t\t*ngIf=\"usage.quotaBytes\"\n\t\t\t\t\tsize=\"tiny\"\n\t\t\t\t\t[value]=\"storagePercent\"\n\t\t\t\t\t[status]=\"storageStatus\"\n\t\t\t\t></nb-progress-bar>\n\n\t\t\t\t<p class=\"hint\">\n\t\t\t\t\t{{\n\t\t\t\t\t\t(usage.quotaBytes ? 'DOCS.SETTINGS.STORAGE_HINT' : 'DOCS.SETTINGS.STORAGE_UNLIMITED_HINT')\n\t\t\t\t\t\t\t| translate\n\t\t\t\t\t}}\n\t\t\t\t</p>\n\t\t\t\t<p class=\"hint warn\" *ngIf=\"storagePercent !== null && storagePercent >= 80\">\n\t\t\t\t\t{{ 'DOCS.SETTINGS.STORAGE_NEAR_LIMIT' | translate }}\n\t\t\t\t</p>\n\n\t\t\t\t<!-- The one writable quota field (`DocumentSettingsDTO.quotaBytes`). Edited in\n\t\t\t\t     GiB, sent in bytes; 0 = unlimited for this organization. -->\n\t\t\t\t<div class=\"docs-settings-row docs-storage-quota\" *ngIf=\"canEditQuota\">\n\t\t\t\t\t<label class=\"label\" for=\"docs-settings-quota\">\n\t\t\t\t\t\t{{ 'DOCS.SETTINGS.STORAGE_QUOTA' | translate }}\n\t\t\t\t\t</label>\n\t\t\t\t\t<div class=\"docs-storage-quota-field\">\n\t\t\t\t\t\t<input\n\t\t\t\t\t\t\tid=\"docs-settings-quota\"\n\t\t\t\t\t\t\tnbInput\n\t\t\t\t\t\t\tfieldSize=\"small\"\n\t\t\t\t\t\t\ttype=\"number\"\n\t\t\t\t\t\t\tmin=\"0\"\n\t\t\t\t\t\t\tstep=\"0.5\"\n\t\t\t\t\t\t\t[(ngModel)]=\"quotaGib\"\n\t\t\t\t\t\t\t[disabled]=\"savingDefaults || savingQuota\"\n\t\t\t\t\t\t/>\n\t\t\t\t\t\t<span class=\"docs-storage-quota-unit\">{{ 'DOCS.SETTINGS.STORAGE_QUOTA_UNIT' | translate }}</span>\n\t\t\t\t\t\t<button\n\t\t\t\t\t\t\tnbButton\n\t\t\t\t\t\t\tsize=\"small\"\n\t\t\t\t\t\t\tstatus=\"primary\"\n\t\t\t\t\t\t\t[disabled]=\"!quotaDirty || savingDefaults || savingQuota\"\n\t\t\t\t\t\t\t(click)=\"saveQuota()\"\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t{{ 'BUTTONS.SAVE' | translate }}\n\t\t\t\t\t\t</button>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"hint\">{{ 'DOCS.SETTINGS.STORAGE_QUOTA_HINT' | translate }}</div>\n\t\t\t\t</div>\n\t\t\t</nb-card-body>\n\t\t</nb-card>\n\t</ng-container>\n\n\t<!-- 4. Category catalog -->\n\t<nb-card class=\"docs-settings-card\">\n\t\t<nb-card-header class=\"docs-settings-card-header\">\n\t\t\t<span>{{ 'DOCS.SETTINGS.CATEGORIES' | translate }}</span>\n\t\t\t<button\n\t\t\t\t*ngxPermissionsOnly=\"docsPermissions.manage\"\n\t\t\t\tnbButton\n\t\t\t\tsize=\"small\"\n\t\t\t\tstatus=\"primary\"\n\t\t\t\t(click)=\"createCategory()\"\n\t\t\t>\n\t\t\t\t<nb-icon icon=\"plus-outline\"></nb-icon>\n\t\t\t\t{{ 'DOCS.SETTINGS.CATEGORY_NEW' | translate }}\n\t\t\t</button>\n\t\t</nb-card-header>\n\t\t<nb-card-body>\n\t\t\t<p class=\"muted\" *ngIf=\"!categories.length\">{{ 'DOCS.SETTINGS.NO_CATEGORIES' | translate }}</p>\n\n\t\t\t<table class=\"docs-category-table\" *ngIf=\"categories.length\">\n\t\t\t\t<thead>\n\t\t\t\t\t<tr>\n\t\t\t\t\t\t<th>{{ 'DOCS.TABLE.COLUMNS.NAME' | translate }}</th>\n\t\t\t\t\t\t<th>{{ 'DOCS.SETTINGS.CATEGORY_DESCRIPTION' | translate }}</th>\n\t\t\t\t\t\t<th class=\"numeric\">{{ 'DOCS.SETTINGS.CATEGORY_DOCUMENTS' | translate }}</th>\n\t\t\t\t\t\t<th class=\"actions\">{{ 'DOCS.TABLE.COLUMNS.ACTIONS' | translate }}</th>\n\t\t\t\t\t</tr>\n\t\t\t\t</thead>\n\t\t\t\t<tbody>\n\t\t\t\t\t<tr *ngFor=\"let category of categories; trackBy: trackById\">\n\t\t\t\t\t\t<td>\n\t\t\t\t\t\t\t<span class=\"docs-category-swatch\" [style.background]=\"category.color || null\"></span>\n\t\t\t\t\t\t\t{{ category.name }}\n\t\t\t\t\t\t\t<nb-badge\n\t\t\t\t\t\t\t\t*ngIf=\"category.isSystem\"\n\t\t\t\t\t\t\t\tstatus=\"basic\"\n\t\t\t\t\t\t\t\t[text]=\"'DOCS.SETTINGS.CATEGORY_SYSTEM' | translate\"\n\t\t\t\t\t\t\t></nb-badge>\n\t\t\t\t\t\t</td>\n\t\t\t\t\t\t<td class=\"muted\">{{ category.description || '\u2014' }}</td>\n\t\t\t\t\t\t<td class=\"numeric\">{{ category.documentCount ?? 0 }}</td>\n\t\t\t\t\t\t<!-- The cell always renders (column alignment); only the controls are gated. -->\n\t\t\t\t\t\t<td class=\"actions\">\n\t\t\t\t\t\t\t<ng-container *ngxPermissionsOnly=\"docsPermissions.manage\">\n\t\t\t\t\t\t\t<button\n\t\t\t\t\t\t\t\tnbButton\n\t\t\t\t\t\t\t\tghost\n\t\t\t\t\t\t\t\tsize=\"tiny\"\n\t\t\t\t\t\t\t\t(click)=\"editCategory(category)\"\n\t\t\t\t\t\t\t\t[nbTooltip]=\"'DOCS.SETTINGS.CATEGORY_EDIT' | translate\"\n\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t<nb-icon icon=\"edit-outline\"></nb-icon>\n\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t\t<button\n\t\t\t\t\t\t\t\tnbButton\n\t\t\t\t\t\t\t\tghost\n\t\t\t\t\t\t\t\tsize=\"tiny\"\n\t\t\t\t\t\t\t\t[disabled]=\"categories.length < 2\"\n\t\t\t\t\t\t\t\t(click)=\"mergeCategory(category)\"\n\t\t\t\t\t\t\t\t[nbTooltip]=\"'DOCS.SETTINGS.CATEGORY_MERGE' | translate\"\n\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t<nb-icon icon=\"shuffle-2-outline\"></nb-icon>\n\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t\t<button\n\t\t\t\t\t\t\t\tnbButton\n\t\t\t\t\t\t\t\tghost\n\t\t\t\t\t\t\t\tsize=\"tiny\"\n\t\t\t\t\t\t\t\tstatus=\"danger\"\n\t\t\t\t\t\t\t\t[disabled]=\"category.isSystem\"\n\t\t\t\t\t\t\t\t(click)=\"deleteCategory(category)\"\n\t\t\t\t\t\t\t\t[nbTooltip]=\"'DOCS.SETTINGS.CATEGORY_DELETE' | translate\"\n\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t<nb-icon icon=\"trash-2-outline\"></nb-icon>\n\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t\t</ng-container>\n\t\t\t\t\t\t</td>\n\t\t\t\t\t</tr>\n\t\t\t\t</tbody>\n\t\t\t</table>\n\t\t</nb-card-body>\n\t</nb-card>\n</div>\n", styles: [":host{display:block}.docs-settings{display:flex;flex-direction:column;gap:1rem;padding:1rem;min-height:12rem}.docs-settings-header h4{margin:0}.muted{color:var(--text-hint-color);margin:0}.hint{color:var(--text-hint-color);font-size:.75rem;margin-top:.25rem}.hint.warn{color:var(--text-warning-color)}.docs-storage-line{margin-bottom:.5rem;font-size:.875rem}.docs-storage-line .docs-storage-percent{margin-left:.375rem;color:var(--text-hint-color)}.docs-storage-quota{margin-top:1rem}.docs-storage-quota .docs-storage-quota-field{display:flex;align-items:center;gap:.5rem}.docs-storage-quota .docs-storage-quota-field input{width:8rem}.docs-storage-quota .docs-storage-quota-unit{color:var(--text-hint-color);font-size:.875rem}.label{display:block;margin-bottom:.25rem;font-weight:600}.docs-settings-card{margin:0}.docs-settings-card-header{display:flex;align-items:center;justify-content:space-between;gap:.75rem}.docs-settings-error{display:flex;align-items:center;gap:.5rem}.docs-knowledge-banner{display:flex;flex-direction:column;gap:.5rem}.docs-knowledge-banner .docs-knowledge-fact{display:flex;align-items:center;gap:.5rem}.docs-knowledge-banner .docs-knowledge-fact code{font-size:.8125rem}.docs-settings-row+.docs-settings-row{margin-top:1rem}.docs-settings-meta{display:grid;grid-template-columns:auto 1fr;gap:.25rem 1rem;margin:0}.docs-settings-meta dt{color:var(--text-hint-color)}.docs-settings-meta dd{margin:0}.docs-category-table{width:100%;border-collapse:collapse}.docs-category-table th,.docs-category-table td{padding:.5rem .375rem;border-bottom:1px solid var(--divider-color);text-align:left;vertical-align:middle}.docs-category-table th{font-size:.75rem;text-transform:uppercase;color:var(--text-hint-color)}.docs-category-table .numeric{text-align:right;width:6rem}.docs-category-table .actions{text-align:right;white-space:nowrap;width:9rem}.docs-category-swatch{display:inline-block;width:.625rem;height:.625rem;margin-right:.375rem;border-radius:50%;background:var(--text-hint-color);vertical-align:middle}\n"], dependencies: [{ kind: "ngmodule", type: CommonModule }, { kind: "directive", type: i5.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i5.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "ngmodule", type: FormsModule }, { kind: "directive", type: i6.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i6.NumberValueAccessor, selector: "input[type=number][formControlName],input[type=number][formControl],input[type=number][ngModel]" }, { kind: "directive", type: i6.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i6.MinValidator, selector: "input[type=number][min][formControlName],input[type=number][min][formControl],input[type=number][min][ngModel]", inputs: ["min"] }, { kind: "directive", type: i6.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "ngmodule", type: TranslateModule }, { kind: "ngmodule", type: NgxPermissionsModule }, { kind: "directive", type: i7.NgxPermissionsDirective, selector: "[ngxPermissionsOnly],[ngxPermissionsExcept]", inputs: ["ngxPermissionsOnly", "ngxPermissionsOnlyThen", "ngxPermissionsOnlyElse", "ngxPermissionsExcept", "ngxPermissionsExceptElse", "ngxPermissionsExceptThen", "ngxPermissionsThen", "ngxPermissionsElse", "ngxPermissionsOnlyAuthorisedStrategy", "ngxPermissionsOnlyUnauthorisedStrategy", "ngxPermissionsExceptUnauthorisedStrategy", "ngxPermissionsExceptAuthorisedStrategy", "ngxPermissionsUnauthorisedStrategy", "ngxPermissionsAuthorisedStrategy"], outputs: ["permissionsAuthorized", "permissionsUnauthorized"] }, { kind: "ngmodule", type: NbBadgeModule }, { kind: "component", type: i4.NbBadgeComponent, selector: "nb-badge", inputs: ["text", "position", "dotMode", "status"] }, { kind: "ngmodule", type: NbButtonModule }, { kind: "component", type: i4.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "ngmodule", type: NbCardModule }, { kind: "component", type: i4.NbCardComponent, selector: "nb-card", inputs: ["size", "status", "accent"] }, { kind: "component", type: i4.NbCardBodyComponent, selector: "nb-card-body" }, { kind: "component", type: i4.NbCardHeaderComponent, selector: "nb-card-header" }, { kind: "ngmodule", type: NbIconModule }, { kind: "component", type: i4.NbIconComponent, selector: "nb-icon", inputs: ["icon", "pack", "options", "status", "config"] }, { kind: "ngmodule", type: NbInputModule }, { kind: "directive", type: i4.NbInputDirective, selector: "input[nbInput],textarea[nbInput]", inputs: ["fieldSize", "status", "shape", "fullWidth"] }, { kind: "ngmodule", type: NbProgressBarModule }, { kind: "component", type: i4.NbProgressBarComponent, selector: "nb-progress-bar", inputs: ["value", "status", "size", "displayValue"] }, { kind: "ngmodule", type: NbSelectModule }, { kind: "component", type: i4.NbSelectComponent, selector: "nb-select", inputs: ["size", "status", "shape", "appearance", "optionsListClass", "optionsPanelClass", "optionsWidth", "outline", "filled", "hero", "disabled", "fullWidth", "placeholder", "compareWith", "selected", "multiple", "optionsOverlayOffset", "scrollStrategy"], outputs: ["selectedChange"] }, { kind: "component", type: i4.NbOptionComponent, selector: "nb-option", inputs: ["value", "disabled"], outputs: ["selectionChange"] }, { kind: "ngmodule", type: NbSpinnerModule }, { kind: "directive", type: i4.NbSpinnerDirective, selector: "[nbSpinner]", inputs: ["nbSpinnerMessage", "nbSpinnerStatus", "nbSpinnerSize", "nbSpinner"] }, { kind: "ngmodule", type: NbToggleModule }, { kind: "component", type: i4.NbToggleComponent, selector: "nb-toggle", inputs: ["checked", "disabled", "status", "labelPosition"], outputs: ["checkedChange"] }, { kind: "ngmodule", type: NbTooltipModule }, { kind: "directive", type: i4.NbTooltipDirective, selector: "[nbTooltip]", inputs: ["nbTooltip", "nbTooltipPlacement", "nbTooltipAdjustment", "nbTooltipClass", "nbTooltipIcon", "nbTooltipStatus", "nbTooltipTrigger", "nbTooltipOffset", "nbTooltipDisabled"], outputs: ["nbTooltipShowStateChange"], exportAs: ["nbTooltip"] }, { kind: "pipe", type: i1.TranslatePipe, name: "translate" }] }); }
};
DocsSettingsPageComponent = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [TranslateService,
        DocumentsService,
        ToastrService,
        NbDialogService,
        Store])
], DocsSettingsPageComponent);
export { DocsSettingsPageComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DocsSettingsPageComponent, decorators: [{
            type: Component,
            args: [{ selector: 'gz-docs-settings-page', imports: [
                        CommonModule,
                        FormsModule,
                        TranslateModule,
                        NgxPermissionsModule,
                        NbBadgeModule,
                        NbButtonModule,
                        NbCardModule,
                        NbIconModule,
                        NbInputModule,
                        NbProgressBarModule,
                        NbSelectModule,
                        NbSpinnerModule,
                        NbToggleModule,
                        NbTooltipModule
                    ], providers: [DocumentsService], template: "<div class=\"docs-settings\" [nbSpinner]=\"loading\" nbSpinnerStatus=\"primary\">\n\t<div class=\"docs-settings-header\">\n\t\t<h4>{{ 'DOCS.SETTINGS.TITLE' | translate }}</h4>\n\t\t<p class=\"muted\">{{ 'DOCS.SETTINGS.SUBTITLE' | translate }}</p>\n\t</div>\n\n\t<!-- Load error -->\n\t<nb-card *ngIf=\"loadError\" class=\"docs-settings-card\">\n\t\t<nb-card-body class=\"docs-settings-error\">\n\t\t\t<nb-icon icon=\"alert-triangle-outline\" status=\"danger\"></nb-icon>\n\t\t\t<span>{{ 'DOCS.SETTINGS.LOAD_ERROR' | translate }}</span>\n\t\t\t<button nbButton size=\"small\" (click)=\"load()\">{{ 'DOCS.ERRORS.GENERIC_RETRY' | translate }}</button>\n\t\t</nb-card-body>\n\t</nb-card>\n\n\t<!-- 1. AI knowledge status banner (GET /knowledge/status) -->\n\t<nb-card *ngIf=\"knowledge\" class=\"docs-settings-card\">\n\t\t<nb-card-header>{{ 'DOCS.SETTINGS.KNOWLEDGE_STATUS' | translate }}</nb-card-header>\n\t\t<nb-card-body class=\"docs-knowledge-banner\">\n\t\t\t<div class=\"docs-knowledge-fact\">\n\t\t\t\t<nb-icon\n\t\t\t\t\t[icon]=\"knowledge.vectorCapable ? 'checkmark-circle-2-outline' : 'alert-triangle-outline'\"\n\t\t\t\t\t[status]=\"knowledge.vectorCapable ? 'success' : 'warning'\"\n\t\t\t\t></nb-icon>\n\t\t\t\t<span>\n\t\t\t\t\t{{\n\t\t\t\t\t\t(knowledge.vectorCapable\n\t\t\t\t\t\t\t? 'DOCS.SETTINGS.VECTOR_CAPABLE'\n\t\t\t\t\t\t\t: 'DOCS.SETTINGS.VECTOR_NOT_CAPABLE'\n\t\t\t\t\t\t) | translate\n\t\t\t\t\t}}\n\t\t\t\t</span>\n\t\t\t</div>\n\t\t\t<div class=\"docs-knowledge-fact\">\n\t\t\t\t<nb-icon\n\t\t\t\t\t[icon]=\"knowledge.embeddingProviderConfigured ? 'checkmark-circle-2-outline' : 'alert-triangle-outline'\"\n\t\t\t\t\t[status]=\"knowledge.embeddingProviderConfigured ? 'success' : 'warning'\"\n\t\t\t\t></nb-icon>\n\t\t\t\t<span>\n\t\t\t\t\t{{\n\t\t\t\t\t\t(knowledge.embeddingProviderConfigured\n\t\t\t\t\t\t\t? 'DOCS.SETTINGS.EMBEDDING_CONFIGURED'\n\t\t\t\t\t\t\t: 'DOCS.SETTINGS.EMBEDDING_NOT_CONFIGURED'\n\t\t\t\t\t\t) | translate\n\t\t\t\t\t}}\n\t\t\t\t</span>\n\t\t\t</div>\n\t\t\t<div class=\"docs-knowledge-fact\" *ngIf=\"knowledge.embeddingModel\">\n\t\t\t\t<nb-icon icon=\"cube-outline\"></nb-icon>\n\t\t\t\t<span>{{ 'DOCS.SETTINGS.EMBEDDING_MODEL' | translate }}:</span>\n\t\t\t\t<code>{{ knowledge.embeddingModel }}</code>\n\t\t\t</div>\n\t\t</nb-card-body>\n\t</nb-card>\n\n\t<!-- 2. Organization defaults (PUT /settings) -->\n\t<nb-card *ngIf=\"defaults as orgDefaults\" class=\"docs-settings-card\">\n\t\t<nb-card-header>{{ 'DOCS.SETTINGS.DEFAULTS' | translate }}</nb-card-header>\n\t\t<nb-card-body>\n\t\t\t<ng-container *ngxPermissionsOnly=\"docsPermissions.manage; else defaultsReadonly\">\n\t\t\t\t<div class=\"docs-settings-row\">\n\t\t\t\t\t<nb-toggle\n\t\t\t\t\t\tlabelPosition=\"end\"\n\t\t\t\t\t\t[checked]=\"orgDefaults.importToKnowledgeDefault\"\n\t\t\t\t\t\t[disabled]=\"savingDefaults\"\n\t\t\t\t\t\t(checkedChange)=\"onImportDefaultToggle($event)\"\n\t\t\t\t\t>\n\t\t\t\t\t\t{{ 'DOCS.SETTINGS.IMPORT_DEFAULT' | translate }}\n\t\t\t\t\t</nb-toggle>\n\t\t\t\t\t<div class=\"hint\">{{ 'DOCS.UPLOAD.KNOWLEDGE_HINT' | translate }}</div>\n\t\t\t\t</div>\n\n\t\t\t\t<div class=\"docs-settings-row\">\n\t\t\t\t\t<nb-toggle\n\t\t\t\t\t\tlabelPosition=\"end\"\n\t\t\t\t\t\t[checked]=\"orgDefaults.autoClassify\"\n\t\t\t\t\t\t[disabled]=\"savingDefaults\"\n\t\t\t\t\t\t(checkedChange)=\"onAutoClassifyToggle($event)\"\n\t\t\t\t\t>\n\t\t\t\t\t\t{{ 'DOCS.UPLOAD.AI_CLASSIFY_TOGGLE' | translate }}\n\t\t\t\t\t</nb-toggle>\n\t\t\t\t\t<div class=\"hint\">{{ 'DOCS.UPLOAD.AI_CLASSIFY_HINT' | translate }}</div>\n\t\t\t\t</div>\n\n\t\t\t\t<div class=\"docs-settings-row\">\n\t\t\t\t\t<label class=\"label\" for=\"docs-settings-default-visibility\">\n\t\t\t\t\t\t{{ 'DOCS.VISIBILITY.LABEL' | translate }}\n\t\t\t\t\t</label>\n\t\t\t\t\t<nb-select\n\t\t\t\t\t\tid=\"docs-settings-default-visibility\"\n\t\t\t\t\t\tsize=\"small\"\n\t\t\t\t\t\t[selected]=\"orgDefaults.defaultVisibility\"\n\t\t\t\t\t\t[disabled]=\"savingDefaults\"\n\t\t\t\t\t\t(selectedChange)=\"onDefaultVisibilityChange($event)\"\n\t\t\t\t\t>\n\t\t\t\t\t\t<nb-option *ngFor=\"let visibility of visibilities\" [value]=\"visibility\">\n\t\t\t\t\t\t\t{{ 'DOCS.VISIBILITY.' + visibility | translate }}\n\t\t\t\t\t\t</nb-option>\n\t\t\t\t\t</nb-select>\n\t\t\t\t\t<div class=\"hint\">{{ 'DOCS.VISIBILITY.HINT' | translate }}</div>\n\t\t\t\t</div>\n\t\t\t</ng-container>\n\n\t\t\t<ng-template #defaultsReadonly>\n\t\t\t\t<dl class=\"docs-settings-meta\">\n\t\t\t\t\t<dt>{{ 'DOCS.SETTINGS.IMPORT_DEFAULT' | translate }}</dt>\n\t\t\t\t\t<dd>{{ orgDefaults.importToKnowledgeDefault ? '\u2713' : '\u2014' }}</dd>\n\t\t\t\t\t<dt>{{ 'DOCS.UPLOAD.AI_CLASSIFY_TOGGLE' | translate }}</dt>\n\t\t\t\t\t<dd>{{ orgDefaults.autoClassify ? '\u2713' : '\u2014' }}</dd>\n\t\t\t\t\t<dt>{{ 'DOCS.VISIBILITY.LABEL' | translate }}</dt>\n\t\t\t\t\t<dd>{{ 'DOCS.VISIBILITY.' + orgDefaults.defaultVisibility | translate }}</dd>\n\t\t\t\t</dl>\n\t\t\t</ng-template>\n\t\t</nb-card-body>\n\t</nb-card>\n\n\t<!-- 3. Storage usage (P1 quota \u2014 DOCS_MANAGE only, spec 08 \u00A75.7).\n\t     Rendered only when the deployment actually reports usage. The permission gate\n\t     wraps the whole card: nested inside it, a non-manager saw an empty card shell. -->\n\t<ng-container *ngxPermissionsOnly=\"docsPermissions.manage\">\n\t\t<nb-card *ngIf=\"storage as usage\" class=\"docs-settings-card\">\n\t\t\t<nb-card-header>{{ 'DOCS.SETTINGS.STORAGE' | translate }}</nb-card-header>\n\t\t\t<nb-card-body>\n\t\t\t\t<div class=\"docs-storage-line\">\n\t\t\t\t\t<ng-container *ngIf=\"usage.quotaBytes; else unlimitedQuota\">\n\t\t\t\t\t\t{{\n\t\t\t\t\t\t\t'DOCS.SETTINGS.STORAGE_USED'\n\t\t\t\t\t\t\t\t| translate\n\t\t\t\t\t\t\t\t\t: { used: humanizeSize(usage.usedBytes), quota: humanizeSize(usage.quotaBytes) }\n\t\t\t\t\t\t}}\n\t\t\t\t\t\t<span class=\"docs-storage-percent\">({{ storagePercent }}%)</span>\n\t\t\t\t\t</ng-container>\n\t\t\t\t\t<ng-template #unlimitedQuota>\n\t\t\t\t\t\t{{ 'DOCS.SETTINGS.STORAGE_USED_UNLIMITED' | translate : { used: humanizeSize(usage.usedBytes) } }}\n\t\t\t\t\t</ng-template>\n\t\t\t\t</div>\n\n\t\t\t\t<nb-progress-bar\n\t\t\t\t\t*ngIf=\"usage.quotaBytes\"\n\t\t\t\t\tsize=\"tiny\"\n\t\t\t\t\t[value]=\"storagePercent\"\n\t\t\t\t\t[status]=\"storageStatus\"\n\t\t\t\t></nb-progress-bar>\n\n\t\t\t\t<p class=\"hint\">\n\t\t\t\t\t{{\n\t\t\t\t\t\t(usage.quotaBytes ? 'DOCS.SETTINGS.STORAGE_HINT' : 'DOCS.SETTINGS.STORAGE_UNLIMITED_HINT')\n\t\t\t\t\t\t\t| translate\n\t\t\t\t\t}}\n\t\t\t\t</p>\n\t\t\t\t<p class=\"hint warn\" *ngIf=\"storagePercent !== null && storagePercent >= 80\">\n\t\t\t\t\t{{ 'DOCS.SETTINGS.STORAGE_NEAR_LIMIT' | translate }}\n\t\t\t\t</p>\n\n\t\t\t\t<!-- The one writable quota field (`DocumentSettingsDTO.quotaBytes`). Edited in\n\t\t\t\t     GiB, sent in bytes; 0 = unlimited for this organization. -->\n\t\t\t\t<div class=\"docs-settings-row docs-storage-quota\" *ngIf=\"canEditQuota\">\n\t\t\t\t\t<label class=\"label\" for=\"docs-settings-quota\">\n\t\t\t\t\t\t{{ 'DOCS.SETTINGS.STORAGE_QUOTA' | translate }}\n\t\t\t\t\t</label>\n\t\t\t\t\t<div class=\"docs-storage-quota-field\">\n\t\t\t\t\t\t<input\n\t\t\t\t\t\t\tid=\"docs-settings-quota\"\n\t\t\t\t\t\t\tnbInput\n\t\t\t\t\t\t\tfieldSize=\"small\"\n\t\t\t\t\t\t\ttype=\"number\"\n\t\t\t\t\t\t\tmin=\"0\"\n\t\t\t\t\t\t\tstep=\"0.5\"\n\t\t\t\t\t\t\t[(ngModel)]=\"quotaGib\"\n\t\t\t\t\t\t\t[disabled]=\"savingDefaults || savingQuota\"\n\t\t\t\t\t\t/>\n\t\t\t\t\t\t<span class=\"docs-storage-quota-unit\">{{ 'DOCS.SETTINGS.STORAGE_QUOTA_UNIT' | translate }}</span>\n\t\t\t\t\t\t<button\n\t\t\t\t\t\t\tnbButton\n\t\t\t\t\t\t\tsize=\"small\"\n\t\t\t\t\t\t\tstatus=\"primary\"\n\t\t\t\t\t\t\t[disabled]=\"!quotaDirty || savingDefaults || savingQuota\"\n\t\t\t\t\t\t\t(click)=\"saveQuota()\"\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t{{ 'BUTTONS.SAVE' | translate }}\n\t\t\t\t\t\t</button>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"hint\">{{ 'DOCS.SETTINGS.STORAGE_QUOTA_HINT' | translate }}</div>\n\t\t\t\t</div>\n\t\t\t</nb-card-body>\n\t\t</nb-card>\n\t</ng-container>\n\n\t<!-- 4. Category catalog -->\n\t<nb-card class=\"docs-settings-card\">\n\t\t<nb-card-header class=\"docs-settings-card-header\">\n\t\t\t<span>{{ 'DOCS.SETTINGS.CATEGORIES' | translate }}</span>\n\t\t\t<button\n\t\t\t\t*ngxPermissionsOnly=\"docsPermissions.manage\"\n\t\t\t\tnbButton\n\t\t\t\tsize=\"small\"\n\t\t\t\tstatus=\"primary\"\n\t\t\t\t(click)=\"createCategory()\"\n\t\t\t>\n\t\t\t\t<nb-icon icon=\"plus-outline\"></nb-icon>\n\t\t\t\t{{ 'DOCS.SETTINGS.CATEGORY_NEW' | translate }}\n\t\t\t</button>\n\t\t</nb-card-header>\n\t\t<nb-card-body>\n\t\t\t<p class=\"muted\" *ngIf=\"!categories.length\">{{ 'DOCS.SETTINGS.NO_CATEGORIES' | translate }}</p>\n\n\t\t\t<table class=\"docs-category-table\" *ngIf=\"categories.length\">\n\t\t\t\t<thead>\n\t\t\t\t\t<tr>\n\t\t\t\t\t\t<th>{{ 'DOCS.TABLE.COLUMNS.NAME' | translate }}</th>\n\t\t\t\t\t\t<th>{{ 'DOCS.SETTINGS.CATEGORY_DESCRIPTION' | translate }}</th>\n\t\t\t\t\t\t<th class=\"numeric\">{{ 'DOCS.SETTINGS.CATEGORY_DOCUMENTS' | translate }}</th>\n\t\t\t\t\t\t<th class=\"actions\">{{ 'DOCS.TABLE.COLUMNS.ACTIONS' | translate }}</th>\n\t\t\t\t\t</tr>\n\t\t\t\t</thead>\n\t\t\t\t<tbody>\n\t\t\t\t\t<tr *ngFor=\"let category of categories; trackBy: trackById\">\n\t\t\t\t\t\t<td>\n\t\t\t\t\t\t\t<span class=\"docs-category-swatch\" [style.background]=\"category.color || null\"></span>\n\t\t\t\t\t\t\t{{ category.name }}\n\t\t\t\t\t\t\t<nb-badge\n\t\t\t\t\t\t\t\t*ngIf=\"category.isSystem\"\n\t\t\t\t\t\t\t\tstatus=\"basic\"\n\t\t\t\t\t\t\t\t[text]=\"'DOCS.SETTINGS.CATEGORY_SYSTEM' | translate\"\n\t\t\t\t\t\t\t></nb-badge>\n\t\t\t\t\t\t</td>\n\t\t\t\t\t\t<td class=\"muted\">{{ category.description || '\u2014' }}</td>\n\t\t\t\t\t\t<td class=\"numeric\">{{ category.documentCount ?? 0 }}</td>\n\t\t\t\t\t\t<!-- The cell always renders (column alignment); only the controls are gated. -->\n\t\t\t\t\t\t<td class=\"actions\">\n\t\t\t\t\t\t\t<ng-container *ngxPermissionsOnly=\"docsPermissions.manage\">\n\t\t\t\t\t\t\t<button\n\t\t\t\t\t\t\t\tnbButton\n\t\t\t\t\t\t\t\tghost\n\t\t\t\t\t\t\t\tsize=\"tiny\"\n\t\t\t\t\t\t\t\t(click)=\"editCategory(category)\"\n\t\t\t\t\t\t\t\t[nbTooltip]=\"'DOCS.SETTINGS.CATEGORY_EDIT' | translate\"\n\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t<nb-icon icon=\"edit-outline\"></nb-icon>\n\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t\t<button\n\t\t\t\t\t\t\t\tnbButton\n\t\t\t\t\t\t\t\tghost\n\t\t\t\t\t\t\t\tsize=\"tiny\"\n\t\t\t\t\t\t\t\t[disabled]=\"categories.length < 2\"\n\t\t\t\t\t\t\t\t(click)=\"mergeCategory(category)\"\n\t\t\t\t\t\t\t\t[nbTooltip]=\"'DOCS.SETTINGS.CATEGORY_MERGE' | translate\"\n\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t<nb-icon icon=\"shuffle-2-outline\"></nb-icon>\n\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t\t<button\n\t\t\t\t\t\t\t\tnbButton\n\t\t\t\t\t\t\t\tghost\n\t\t\t\t\t\t\t\tsize=\"tiny\"\n\t\t\t\t\t\t\t\tstatus=\"danger\"\n\t\t\t\t\t\t\t\t[disabled]=\"category.isSystem\"\n\t\t\t\t\t\t\t\t(click)=\"deleteCategory(category)\"\n\t\t\t\t\t\t\t\t[nbTooltip]=\"'DOCS.SETTINGS.CATEGORY_DELETE' | translate\"\n\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t<nb-icon icon=\"trash-2-outline\"></nb-icon>\n\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t\t</ng-container>\n\t\t\t\t\t\t</td>\n\t\t\t\t\t</tr>\n\t\t\t\t</tbody>\n\t\t\t</table>\n\t\t</nb-card-body>\n\t</nb-card>\n</div>\n", styles: [":host{display:block}.docs-settings{display:flex;flex-direction:column;gap:1rem;padding:1rem;min-height:12rem}.docs-settings-header h4{margin:0}.muted{color:var(--text-hint-color);margin:0}.hint{color:var(--text-hint-color);font-size:.75rem;margin-top:.25rem}.hint.warn{color:var(--text-warning-color)}.docs-storage-line{margin-bottom:.5rem;font-size:.875rem}.docs-storage-line .docs-storage-percent{margin-left:.375rem;color:var(--text-hint-color)}.docs-storage-quota{margin-top:1rem}.docs-storage-quota .docs-storage-quota-field{display:flex;align-items:center;gap:.5rem}.docs-storage-quota .docs-storage-quota-field input{width:8rem}.docs-storage-quota .docs-storage-quota-unit{color:var(--text-hint-color);font-size:.875rem}.label{display:block;margin-bottom:.25rem;font-weight:600}.docs-settings-card{margin:0}.docs-settings-card-header{display:flex;align-items:center;justify-content:space-between;gap:.75rem}.docs-settings-error{display:flex;align-items:center;gap:.5rem}.docs-knowledge-banner{display:flex;flex-direction:column;gap:.5rem}.docs-knowledge-banner .docs-knowledge-fact{display:flex;align-items:center;gap:.5rem}.docs-knowledge-banner .docs-knowledge-fact code{font-size:.8125rem}.docs-settings-row+.docs-settings-row{margin-top:1rem}.docs-settings-meta{display:grid;grid-template-columns:auto 1fr;gap:.25rem 1rem;margin:0}.docs-settings-meta dt{color:var(--text-hint-color)}.docs-settings-meta dd{margin:0}.docs-category-table{width:100%;border-collapse:collapse}.docs-category-table th,.docs-category-table td{padding:.5rem .375rem;border-bottom:1px solid var(--divider-color);text-align:left;vertical-align:middle}.docs-category-table th{font-size:.75rem;text-transform:uppercase;color:var(--text-hint-color)}.docs-category-table .numeric{text-align:right;width:6rem}.docs-category-table .actions{text-align:right;white-space:nowrap;width:9rem}.docs-category-swatch{display:inline-block;width:.625rem;height:.625rem;margin-right:.375rem;border-radius:50%;background:var(--text-hint-color);vertical-align:middle}\n"] }]
        }], ctorParameters: () => [{ type: i1.TranslateService }, { type: i2.DocumentsService }, { type: i3.ToastrService }, { type: i4.NbDialogService }, { type: i3.Store }] });
//# sourceMappingURL=docs-settings-page.component.js.map