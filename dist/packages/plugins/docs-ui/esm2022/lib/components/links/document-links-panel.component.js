import { __decorate, __metadata } from "tslib";
import { CommonModule } from '@angular/common';
import { HttpEventType } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { NbButtonModule, NbCardModule, NbDialogService, NbIconModule, NbSpinnerModule, NbTooltipModule } from '@nebular/theme';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { filter, firstValueFrom, map } from 'rxjs';
import { BaseEntityEnum, DocumentKindEnum, FeatureEnum, PermissionsEnum } from '@gauzy/contracts';
import { Store, ToastrService } from '@gauzy/ui-core/core';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { DOCS_PAGE_LINK, DOCS_UPLOAD_ACCEPT } from '../../docs.constants';
import { DocumentsService } from '../../services/documents.service';
import { DocumentAttachDialogComponent } from './document-attach-dialog.component';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
import * as i2 from "../../services/documents.service";
import * as i3 from "@nebular/theme";
import * as i4 from "@gauzy/ui-core/core";
import * as i5 from "@angular/router";
import * as i6 from "@angular/common";
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
let DocumentLinksPanelComponent = class DocumentLinksPanelComponent extends TranslationBaseComponent {
    constructor(translateService, documentsService, dialogService, toastrService, router, store) {
        super(translateService);
        this.translateService = translateService;
        this.documentsService = documentsService;
        this.dialogService = dialogService;
        this.toastrService = toastrService;
        this.router = router;
        this.store = store;
        /**
         * Read-only hosting: hides the attach / upload / unlink affordances while
         * keeping open and download. For surfaces that present the record itself as
         * read-only (the invoice/estimate VIEW page) — mutating attachments belongs on
         * the edit surface there. A host choice, not a permission: `canLink` /
         * `canUpload` are untouched.
         */
        this.readonly = false;
        /**
         * When set, the whole card renders only once at least one link exists — on a
         * read-only host an empty "Documents" card is pure noise. Off by default so
         * the existing hosts keep offering "attach" on an empty panel.
         */
        this.hideWhenEmpty = false;
        /** Emits the current link count after every load/mutation (host badge counters). */
        this.countChanged = new EventEmitter();
        this.links = [];
        this.loading = false;
        this.loadError = false;
        /** Set while an upload is in flight — the button spins instead of queueing a second file. */
        this.uploading = false;
        this.permissions = PermissionsEnum;
        /** Accept list for the file input (UX only — the server sniffs and re-validates). */
        this.accept = DOCS_UPLOAD_ACCEPT;
    }
    /**
     * Reloads on every (entity, entityId) change — the hosts reuse one component
     * instance across records (a routed detail page navigating between ids, a dialog
     * reopened for another row), so binding once in `ngOnInit` would leave the second
     * record showing the first one's documents.
     */
    ngOnChanges(changes) {
        if (changes['entity'] || changes['entityId']) {
            void this.load();
        }
    }
    // ─── Visibility ──────────────────────────────────────────────
    /**
     * The panel exists only for a reader of an org with the feature on. Both halves
     * matter: the permission alone would render a panel whose every request 403s on a
     * feature-disabled organization (`FeatureFlagGuard` fronts all docs routes).
     */
    get visible() {
        return (!!this.entity &&
            !!this.entityId &&
            this.store.hasPermission(PermissionsEnum.DOCS_READ) &&
            this.store.hasFeatureEnabled(FeatureEnum.FEATURE_DOCUMENTS));
    }
    /**
     * The template's root gate: `visible`, narrowed by `hideWhenEmpty` to "only
     * once at least one link has actually loaded". A load in flight or a failed
     * load keeps the card up regardless — hiding it there would hide the error
     * state and the retry affordance with it.
     */
    get shown() {
        return this.visible && (!this.hideWhenEmpty || this.loading || this.loadError || this.links.length > 0);
    }
    /** Attaching and detaching are both `DOCS_UPDATE` (`POST`/`DELETE /links`). */
    get canLink() {
        return this.store.hasPermission(PermissionsEnum.DOCS_UPDATE);
    }
    /**
     * "Upload new" is two writes — the document (`DOCS_CREATE`) and then the link
     * (`DOCS_UPDATE`). Both are required: offering it to a `DOCS_CREATE`-only holder
     * would upload the file and then fail to attach it, leaving an orphan in the hub.
     */
    get canUpload() {
        return this.store.hasPermission(PermissionsEnum.DOCS_CREATE) && this.canLink;
    }
    // ─── Loading ─────────────────────────────────────────────────
    async load() {
        if (!this.visible) {
            this.links = [];
            return;
        }
        this.loading = true;
        this.loadError = false;
        try {
            this.links = await firstValueFrom(this.documentsService.findLinks(this.entity, this.entityId));
            this.countChanged.emit(this.links.length);
        }
        catch {
            // Fault-isolated: an attachments panel that fails must not take the host
            // record page down with it.
            this.loadError = true;
            this.links = [];
        }
        finally {
            this.loading = false;
        }
    }
    // ─── Row rendering ───────────────────────────────────────────
    /** Row label: the document name, falling back to the label captured at link time. */
    labelOf(link) {
        const metadata = (link?.metadata ?? {});
        return link?.document?.name || metadata.label || String(link?.documentId ?? '');
    }
    /** Eva icon per document kind — pages and files read very differently in a list. */
    iconOf(link) {
        return link?.document?.kind === DocumentKindEnum.PAGE ? 'file-text-outline' : 'attach-outline';
    }
    /** `123 KB`, or an empty string when there are no bytes (a PAGE has none). */
    sizeOf(link) {
        const bytes = link?.document?.fileSize;
        if (!bytes || bytes <= 0)
            return '';
        const units = ['B', 'KB', 'MB', 'GB', 'TB'];
        const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
        const value = bytes / Math.pow(1024, exponent);
        return `${value >= 10 || exponent === 0 ? Math.round(value) : value.toFixed(1)} ${units[exponent]}`;
    }
    /** Only a FILE has bytes to download; a PAGE's "download" is an export, not this. */
    isFile(link) {
        return link?.document?.kind === DocumentKindEnum.FILE;
    }
    trackByLink(_, link) {
        return String(link?.id ?? link?.documentId);
    }
    // ─── Actions ─────────────────────────────────────────────────
    /**
     * Opens the document in the hub: a PAGE goes straight to its editor route, a FILE
     * (or anything else) deep-links the browse surface with `?id=`, which is what
     * opens the detail panel — `docs-shell.component.ts` treats that query param as
     * the source of truth for the open panel.
     */
    open(link) {
        const documentId = link?.documentId ?? link?.document?.id;
        if (!documentId)
            return;
        if (link?.document?.kind === DocumentKindEnum.PAGE) {
            void this.router.navigate([`${DOCS_PAGE_LINK}/page`, documentId]);
            return;
        }
        void this.router.navigate([DOCS_PAGE_LINK], { queryParams: { id: documentId } });
    }
    /**
     * Downloads the original bytes.
     *
     * 🛑 `GET /:id/download` answers `{ url }` **as JSON behind the JWT guard** — it
     * is not a redirect. It has to be fetched through the authenticated client and
     * only the resolved provider URL may be handed to the browser; navigating to the
     * endpoint directly sends no token and lands on a 401.
     */
    async download(link) {
        const documentId = link?.documentId ?? link?.document?.id;
        if (!documentId)
            return;
        try {
            const url = await firstValueFrom(this.documentsService.getDownloadUrl(documentId));
            if (url) {
                window.open(url, '_blank', 'noopener');
            }
        }
        catch (error) {
            this.toastrService.danger(error);
        }
    }
    /** Detaches the document from this record. The document itself is untouched. */
    async unlink(link) {
        if (!link?.id)
            return;
        try {
            await firstValueFrom(this.documentsService.deleteLink(link.id));
            this.links = this.links.filter((row) => String(row.id) !== String(link.id));
            this.countChanged.emit(this.links.length);
            this.toastrService.success(this.getTranslation('DOCS.LINKS.TOAST_REMOVED'));
        }
        catch (error) {
            this.toastrService.danger(error);
        }
    }
    /** Picks an existing document and attaches it to this record. */
    async attachExisting() {
        const attached = await firstValueFrom(this.dialogService.open(DocumentAttachDialogComponent, {
            context: {
                entity: this.entity,
                entityId: this.entityId,
                entityLabel: this.entityLabel,
                existing: this.links
            }
        }).onClose);
        if (!attached)
            return;
        // Re-read rather than pushing the dialog's row: `POST /links` answers with the
        // bare link, no `document` relation, and a row without it renders as an id.
        await this.load();
    }
    /**
     * Uploads a file and links it in one gesture.
     *
     * Deliberately two calls, not one: the upload endpoint knows nothing about
     * `DocumentLink`, so the link is created from the accepted document. A failed link
     * write is surfaced but the document is kept — deleting a file the user just
     * uploaded because a follow-up call failed would be the worse outcome.
     */
    async uploadNew(input) {
        const file = input?.files?.[0];
        // Cleared immediately so picking the same file twice still fires `change`.
        if (input)
            input.value = '';
        if (!file || this.uploading)
            return;
        const organization = this.store.selectedOrganization;
        this.uploading = true;
        try {
            // 🛑 `upload()` is a progress stream: the FIRST emission is the `Sent`
            // event, not the result. Only the `Response` event carries the document.
            const document = await firstValueFrom(this.documentsService
                .upload(file, { organizationId: organization?.id, tenantId: organization?.tenantId })
                .pipe(filter((event) => event.type === HttpEventType.Response), map((event) => event.body)));
            if (!document?.id)
                return;
            await firstValueFrom(this.documentsService.createLink({
                documentId: document.id,
                entity: this.entity,
                entityId: this.entityId,
                metadata: { label: this.entityLabel ?? '' },
                organizationId: organization?.id,
                tenantId: organization?.tenantId
            }));
            this.toastrService.success(this.getTranslation('DOCS.LINKS.TOAST_ADDED'));
            await this.load();
        }
        catch (error) {
            this.toastrService.danger(error);
        }
        finally {
            this.uploading = false;
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DocumentLinksPanelComponent, deps: [{ token: i1.TranslateService }, { token: i2.DocumentsService }, { token: i3.NbDialogService }, { token: i4.ToastrService }, { token: i5.Router }, { token: i4.Store }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: DocumentLinksPanelComponent, isStandalone: true, selector: "gz-document-links-panel", inputs: { entity: "entity", entityId: "entityId", entityLabel: "entityLabel", readonly: "readonly", hideWhenEmpty: "hideWhenEmpty" }, outputs: { countChanged: "countChanged" }, providers: [DocumentsService], usesInheritance: true, usesOnChanges: true, ngImport: i0, template: "<!--\n\tRecord-side Documents panel (spec 00 \u00A76.14 R-LNK-02). The whole card disappears\n\tfor a user without DOCS_READ or on an organization with FEATURE_DOCUMENTS off \u2014\n\tthe component decides, not the five host templates.\n\n\tThe action gates are `*ngIf` over Store checks rather than `*ngxPermissionsOnly`:\n\tuploading needs DOCS_CREATE **and** DOCS_UPDATE (a document write followed by a\n\tlink write), and `ngxPermissionsOnly` with a list is an OR \u2014 it would offer the\n\tbutton to someone who can only do half of it and leave the file unattached.\n\n\t`readonly` hosts (the invoice/estimate VIEW page) additionally drop the\n\tattach / upload / unlink affordances \u2014 open and download stay.\n-->\n<nb-card *ngIf=\"shown\" class=\"docs-links-panel\">\n\t<nb-card-header class=\"docs-links-panel-header\">\n\t\t<span>{{ 'DOCS.LINKS.PANEL_TITLE' | translate }}</span>\n\t\t<span class=\"docs-links-panel-count\" *ngIf=\"links.length\">{{ links.length }}</span>\n\n\t\t<span class=\"docs-links-panel-actions\">\n\t\t\t<button *ngIf=\"!readonly && canLink\" nbButton ghost size=\"tiny\" (click)=\"attachExisting()\">\n\t\t\t\t<nb-icon icon=\"link-2-outline\"></nb-icon>\n\t\t\t\t{{ 'DOCS.LINKS.ATTACH_EXISTING' | translate }}\n\t\t\t</button>\n\n\t\t\t<ng-container *ngIf=\"!readonly && canUpload\">\n\t\t\t\t<button nbButton ghost size=\"tiny\" [disabled]=\"uploading\" (click)=\"fileInput.click()\">\n\t\t\t\t\t<nb-icon icon=\"upload-outline\"></nb-icon>\n\t\t\t\t\t{{ 'DOCS.LINKS.UPLOAD_NEW' | translate }}\n\t\t\t\t</button>\n\t\t\t\t<!--\n\t\t\t\t\tVisually hidden and driven entirely by the button above, so it carries an id and\n\t\t\t\t\tan explicit accessible name, and is taken out of the tab order: a focusable\n\t\t\t\t\tcontrol the user cannot see is a keyboard trap, and the button is the real one.\n\t\t\t\t-->\n\t\t\t\t<input\n\t\t\t\t\t#fileInput\n\t\t\t\t\tid=\"docs-links-panel-file-input\"\n\t\t\t\t\ttype=\"file\"\n\t\t\t\t\ttabindex=\"-1\"\n\t\t\t\t\tclass=\"docs-links-panel-file\"\n\t\t\t\t\t[attr.aria-label]=\"'DOCS.LINKS.UPLOAD_NEW' | translate\"\n\t\t\t\t\t[accept]=\"accept\"\n\t\t\t\t\t(change)=\"uploadNew(fileInput)\"\n\t\t\t\t/>\n\t\t\t</ng-container>\n\t\t</span>\n\t</nb-card-header>\n\n\t<nb-card-body [nbSpinner]=\"loading || uploading\" nbSpinnerStatus=\"primary\">\n\t\t<div class=\"docs-links-panel-error\" *ngIf=\"loadError\">\n\t\t\t<nb-icon icon=\"alert-triangle-outline\" status=\"danger\"></nb-icon>\n\t\t\t<span>{{ 'DOCS.LINKS.PANEL_LOAD_ERROR' | translate }}</span>\n\t\t\t<button nbButton size=\"tiny\" (click)=\"load()\">{{ 'DOCS.ERRORS.GENERIC_RETRY' | translate }}</button>\n\t\t</div>\n\n\t\t<p class=\"muted\" *ngIf=\"!loading && !loadError && !links.length\">\n\t\t\t{{ 'DOCS.LINKS.PANEL_EMPTY' | translate }}\n\t\t</p>\n\n\t\t<div class=\"docs-links-row\" *ngFor=\"let link of links; trackBy: trackByLink\">\n\t\t\t<nb-icon [icon]=\"iconOf(link)\" size=\"tiny\"></nb-icon>\n\n\t\t\t<button type=\"button\" class=\"docs-links-row-open\" [title]=\"labelOf(link)\" (click)=\"open(link)\">\n\t\t\t\t{{ labelOf(link) }}\n\t\t\t</button>\n\n\t\t\t<span class=\"docs-links-row-meta\" *ngIf=\"sizeOf(link)\">{{ sizeOf(link) }}</span>\n\n\t\t\t<span class=\"docs-links-row-actions\">\n\t\t\t\t<button\n\t\t\t\t\t*ngIf=\"isFile(link)\"\n\t\t\t\t\tnbButton\n\t\t\t\t\tghost\n\t\t\t\t\tsize=\"tiny\"\n\t\t\t\t\t[nbTooltip]=\"'DOCS.PREVIEW.DOWNLOAD' | translate\"\n\t\t\t\t\t(click)=\"download(link)\"\n\t\t\t\t>\n\t\t\t\t\t<nb-icon icon=\"download-outline\"></nb-icon>\n\t\t\t\t</button>\n\t\t\t\t<button\n\t\t\t\t\t*ngIf=\"!readonly && canLink\"\n\t\t\t\t\tnbButton\n\t\t\t\t\tghost\n\t\t\t\t\tsize=\"tiny\"\n\t\t\t\t\tstatus=\"danger\"\n\t\t\t\t\t[nbTooltip]=\"'DOCS.LINKS.REMOVE' | translate\"\n\t\t\t\t\t(click)=\"unlink(link)\"\n\t\t\t\t>\n\t\t\t\t\t<nb-icon icon=\"close-outline\"></nb-icon>\n\t\t\t\t</button>\n\t\t\t</span>\n\t\t</div>\n\t</nb-card-body>\n</nb-card>\n", styles: ["@charset \"UTF-8\";:host{display:block}.docs-links-panel{margin:0}.docs-links-panel-header{display:flex;align-items:center;gap:.5rem}.docs-links-panel-count{color:var(--text-hint-color);font-size:.75rem}.docs-links-panel-actions{display:flex;align-items:center;gap:.25rem;margin-left:auto}.docs-links-panel-file{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}.muted{color:var(--text-hint-color);margin:0}.docs-links-panel-error{display:flex;align-items:center;gap:.5rem;margin-bottom:.5rem}.docs-links-row{display:flex;align-items:center;gap:.5rem;padding:.25rem 0}.docs-links-row+.docs-links-row{border-top:1px solid var(--divider-color)}.docs-links-row-open{flex:1 1 auto;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;text-align:left;padding:0;border:none;background:none;color:var(--text-primary-color);cursor:pointer}.docs-links-row-open:hover{text-decoration:underline}.docs-links-row-meta{color:var(--text-hint-color);font-size:.75rem;white-space:nowrap}.docs-links-row-actions{display:flex;align-items:center;gap:.125rem;margin-left:auto}\n"], dependencies: [{ kind: "ngmodule", type: CommonModule }, { kind: "directive", type: i6.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i6.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "ngmodule", type: TranslateModule }, { kind: "ngmodule", type: NbButtonModule }, { kind: "component", type: i3.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "ngmodule", type: NbCardModule }, { kind: "component", type: i3.NbCardComponent, selector: "nb-card", inputs: ["size", "status", "accent"] }, { kind: "component", type: i3.NbCardBodyComponent, selector: "nb-card-body" }, { kind: "component", type: i3.NbCardHeaderComponent, selector: "nb-card-header" }, { kind: "ngmodule", type: NbIconModule }, { kind: "component", type: i3.NbIconComponent, selector: "nb-icon", inputs: ["icon", "pack", "options", "status", "config"] }, { kind: "ngmodule", type: NbSpinnerModule }, { kind: "directive", type: i3.NbSpinnerDirective, selector: "[nbSpinner]", inputs: ["nbSpinnerMessage", "nbSpinnerStatus", "nbSpinnerSize", "nbSpinner"] }, { kind: "ngmodule", type: NbTooltipModule }, { kind: "directive", type: i3.NbTooltipDirective, selector: "[nbTooltip]", inputs: ["nbTooltip", "nbTooltipPlacement", "nbTooltipAdjustment", "nbTooltipClass", "nbTooltipIcon", "nbTooltipStatus", "nbTooltipTrigger", "nbTooltipOffset", "nbTooltipDisabled"], outputs: ["nbTooltipShowStateChange"], exportAs: ["nbTooltip"] }, { kind: "pipe", type: i1.TranslatePipe, name: "translate" }] }); }
};
DocumentLinksPanelComponent = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [TranslateService,
        DocumentsService,
        NbDialogService,
        ToastrService,
        Router,
        Store])
], DocumentLinksPanelComponent);
export { DocumentLinksPanelComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DocumentLinksPanelComponent, decorators: [{
            type: Component,
            args: [{ selector: 'gz-document-links-panel', standalone: true, imports: [
                        CommonModule,
                        TranslateModule,
                        NbButtonModule,
                        NbCardModule,
                        NbIconModule,
                        NbSpinnerModule,
                        NbTooltipModule
                    ], providers: [DocumentsService], template: "<!--\n\tRecord-side Documents panel (spec 00 \u00A76.14 R-LNK-02). The whole card disappears\n\tfor a user without DOCS_READ or on an organization with FEATURE_DOCUMENTS off \u2014\n\tthe component decides, not the five host templates.\n\n\tThe action gates are `*ngIf` over Store checks rather than `*ngxPermissionsOnly`:\n\tuploading needs DOCS_CREATE **and** DOCS_UPDATE (a document write followed by a\n\tlink write), and `ngxPermissionsOnly` with a list is an OR \u2014 it would offer the\n\tbutton to someone who can only do half of it and leave the file unattached.\n\n\t`readonly` hosts (the invoice/estimate VIEW page) additionally drop the\n\tattach / upload / unlink affordances \u2014 open and download stay.\n-->\n<nb-card *ngIf=\"shown\" class=\"docs-links-panel\">\n\t<nb-card-header class=\"docs-links-panel-header\">\n\t\t<span>{{ 'DOCS.LINKS.PANEL_TITLE' | translate }}</span>\n\t\t<span class=\"docs-links-panel-count\" *ngIf=\"links.length\">{{ links.length }}</span>\n\n\t\t<span class=\"docs-links-panel-actions\">\n\t\t\t<button *ngIf=\"!readonly && canLink\" nbButton ghost size=\"tiny\" (click)=\"attachExisting()\">\n\t\t\t\t<nb-icon icon=\"link-2-outline\"></nb-icon>\n\t\t\t\t{{ 'DOCS.LINKS.ATTACH_EXISTING' | translate }}\n\t\t\t</button>\n\n\t\t\t<ng-container *ngIf=\"!readonly && canUpload\">\n\t\t\t\t<button nbButton ghost size=\"tiny\" [disabled]=\"uploading\" (click)=\"fileInput.click()\">\n\t\t\t\t\t<nb-icon icon=\"upload-outline\"></nb-icon>\n\t\t\t\t\t{{ 'DOCS.LINKS.UPLOAD_NEW' | translate }}\n\t\t\t\t</button>\n\t\t\t\t<!--\n\t\t\t\t\tVisually hidden and driven entirely by the button above, so it carries an id and\n\t\t\t\t\tan explicit accessible name, and is taken out of the tab order: a focusable\n\t\t\t\t\tcontrol the user cannot see is a keyboard trap, and the button is the real one.\n\t\t\t\t-->\n\t\t\t\t<input\n\t\t\t\t\t#fileInput\n\t\t\t\t\tid=\"docs-links-panel-file-input\"\n\t\t\t\t\ttype=\"file\"\n\t\t\t\t\ttabindex=\"-1\"\n\t\t\t\t\tclass=\"docs-links-panel-file\"\n\t\t\t\t\t[attr.aria-label]=\"'DOCS.LINKS.UPLOAD_NEW' | translate\"\n\t\t\t\t\t[accept]=\"accept\"\n\t\t\t\t\t(change)=\"uploadNew(fileInput)\"\n\t\t\t\t/>\n\t\t\t</ng-container>\n\t\t</span>\n\t</nb-card-header>\n\n\t<nb-card-body [nbSpinner]=\"loading || uploading\" nbSpinnerStatus=\"primary\">\n\t\t<div class=\"docs-links-panel-error\" *ngIf=\"loadError\">\n\t\t\t<nb-icon icon=\"alert-triangle-outline\" status=\"danger\"></nb-icon>\n\t\t\t<span>{{ 'DOCS.LINKS.PANEL_LOAD_ERROR' | translate }}</span>\n\t\t\t<button nbButton size=\"tiny\" (click)=\"load()\">{{ 'DOCS.ERRORS.GENERIC_RETRY' | translate }}</button>\n\t\t</div>\n\n\t\t<p class=\"muted\" *ngIf=\"!loading && !loadError && !links.length\">\n\t\t\t{{ 'DOCS.LINKS.PANEL_EMPTY' | translate }}\n\t\t</p>\n\n\t\t<div class=\"docs-links-row\" *ngFor=\"let link of links; trackBy: trackByLink\">\n\t\t\t<nb-icon [icon]=\"iconOf(link)\" size=\"tiny\"></nb-icon>\n\n\t\t\t<button type=\"button\" class=\"docs-links-row-open\" [title]=\"labelOf(link)\" (click)=\"open(link)\">\n\t\t\t\t{{ labelOf(link) }}\n\t\t\t</button>\n\n\t\t\t<span class=\"docs-links-row-meta\" *ngIf=\"sizeOf(link)\">{{ sizeOf(link) }}</span>\n\n\t\t\t<span class=\"docs-links-row-actions\">\n\t\t\t\t<button\n\t\t\t\t\t*ngIf=\"isFile(link)\"\n\t\t\t\t\tnbButton\n\t\t\t\t\tghost\n\t\t\t\t\tsize=\"tiny\"\n\t\t\t\t\t[nbTooltip]=\"'DOCS.PREVIEW.DOWNLOAD' | translate\"\n\t\t\t\t\t(click)=\"download(link)\"\n\t\t\t\t>\n\t\t\t\t\t<nb-icon icon=\"download-outline\"></nb-icon>\n\t\t\t\t</button>\n\t\t\t\t<button\n\t\t\t\t\t*ngIf=\"!readonly && canLink\"\n\t\t\t\t\tnbButton\n\t\t\t\t\tghost\n\t\t\t\t\tsize=\"tiny\"\n\t\t\t\t\tstatus=\"danger\"\n\t\t\t\t\t[nbTooltip]=\"'DOCS.LINKS.REMOVE' | translate\"\n\t\t\t\t\t(click)=\"unlink(link)\"\n\t\t\t\t>\n\t\t\t\t\t<nb-icon icon=\"close-outline\"></nb-icon>\n\t\t\t\t</button>\n\t\t\t</span>\n\t\t</div>\n\t</nb-card-body>\n</nb-card>\n", styles: ["@charset \"UTF-8\";:host{display:block}.docs-links-panel{margin:0}.docs-links-panel-header{display:flex;align-items:center;gap:.5rem}.docs-links-panel-count{color:var(--text-hint-color);font-size:.75rem}.docs-links-panel-actions{display:flex;align-items:center;gap:.25rem;margin-left:auto}.docs-links-panel-file{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}.muted{color:var(--text-hint-color);margin:0}.docs-links-panel-error{display:flex;align-items:center;gap:.5rem;margin-bottom:.5rem}.docs-links-row{display:flex;align-items:center;gap:.5rem;padding:.25rem 0}.docs-links-row+.docs-links-row{border-top:1px solid var(--divider-color)}.docs-links-row-open{flex:1 1 auto;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;text-align:left;padding:0;border:none;background:none;color:var(--text-primary-color);cursor:pointer}.docs-links-row-open:hover{text-decoration:underline}.docs-links-row-meta{color:var(--text-hint-color);font-size:.75rem;white-space:nowrap}.docs-links-row-actions{display:flex;align-items:center;gap:.125rem;margin-left:auto}\n"] }]
        }], ctorParameters: () => [{ type: i1.TranslateService }, { type: i2.DocumentsService }, { type: i3.NbDialogService }, { type: i4.ToastrService }, { type: i5.Router }, { type: i4.Store }], propDecorators: { entity: [{
                type: Input
            }], entityId: [{
                type: Input
            }], entityLabel: [{
                type: Input
            }], readonly: [{
                type: Input
            }], hideWhenEmpty: [{
                type: Input
            }], countChanged: [{
                type: Output
            }] } });
//# sourceMappingURL=document-links-panel.component.js.map