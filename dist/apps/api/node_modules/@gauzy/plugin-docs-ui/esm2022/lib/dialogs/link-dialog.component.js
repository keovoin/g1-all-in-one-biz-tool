import { Component, Input } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { catchError, firstValueFrom, of } from 'rxjs';
import { BaseEntityEnum } from '@gauzy/contracts';
import { EmployeesService, InvoicesService, OrganizationContactService, OrganizationProjectsService, OrganizationTeamsService, Store, TasksService, ToastrService } from '@gauzy/ui-core/core';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { DOCS_LINK_ENTITIES } from '../models/docs-link.model';
import { DocumentsService } from '../services/documents.service';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
import * as i2 from "@nebular/theme";
import * as i3 from "../services/documents.service";
import * as i4 from "@gauzy/ui-core/core";
import * as i5 from "@angular/common";
import * as i6 from "@angular/forms";
/**
 * Add-link flow for the detail panel's **Linked records** section
 * (`01-ux-spec.md` §8.9, `02-domain-model.md` `DocumentLink`): pick an entity
 * type, pick a record, create the link. `DOCS_UPDATE` — the caller gates the
 * entry point, this dialog is never reachable without it.
 *
 * Records are loaded per entity type through the existing `@gauzy/ui-core/core`
 * services rather than embedding six different shared selector components: the
 * selectors disagree on value shape (`ISelectedEmployee` vs id vs entity), two
 * of them write global navigation state, and `ga-employee-multi-select` cannot
 * render at all on Documents routes (see `share-dialog.component.ts`). One
 * uniform `nb-select` over `IDocsLinkCandidate` is both smaller and predictable.
 *
 * The label the user picked is persisted into `DocumentLink.metadata.label`, so
 * the panel can render the link without N follow-up fetches — and a record that
 * is later renamed or deleted still shows *something* instead of a bare UUID.
 */
export class DocumentLinkDialogComponent extends TranslationBaseComponent {
    constructor(translateService, dialogRef, documentsService, tasksService, projectsService, teamsService, employeesService, contactsService, invoicesService, toastrService, store) {
        super(translateService);
        this.translateService = translateService;
        this.dialogRef = dialogRef;
        this.documentsService = documentsService;
        this.tasksService = tasksService;
        this.projectsService = projectsService;
        this.teamsService = teamsService;
        this.employeesService = employeesService;
        this.contactsService = contactsService;
        this.invoicesService = invoicesService;
        this.toastrService = toastrService;
        this.store = store;
        /** Links that already exist — their targets are filtered out of the picker. */
        this.existing = [];
        this.entities = DOCS_LINK_ENTITIES;
        this.entity = DOCS_LINK_ENTITIES[0].entity;
        this.candidates = [];
        this.selectedId = null;
        this.search = '';
        this.loading = false;
        this.saving = false;
    }
    ngOnInit() {
        void this.loadCandidates();
    }
    // ─── Entity type / record loading ────────────────────────────
    async onEntityChange(entity) {
        this.entity = entity;
        this.selectedId = null;
        this.search = '';
        await this.loadCandidates();
    }
    /**
     * Loads the pickable records for the current entity type. Every loader is
     * fault-isolated: a service the tenant cannot read (e.g. invoices without the
     * accounting permission) yields an empty picker, never a broken dialog.
     */
    async loadCandidates() {
        const { organizationId, tenantId } = this.orgContext();
        if (!organizationId) {
            this.candidates = [];
            return;
        }
        this.loading = true;
        try {
            this.candidates = await this.fetchCandidates(this.entity, organizationId, tenantId);
        }
        catch {
            this.candidates = [];
        }
        finally {
            this.loading = false;
        }
    }
    async fetchCandidates(entity, organizationId, tenantId) {
        const where = { organizationId, tenantId };
        switch (entity) {
            case BaseEntityEnum.Task: {
                const result = await firstValueFrom(this.tasksService.getAllTasks(where).pipe(catchError(() => of({ items: [], total: 0 }))));
                return (result?.items ?? []).map((task) => ({
                    id: task.id,
                    label: this.taskLabel(task)
                }));
            }
            case BaseEntityEnum.OrganizationProject: {
                const result = await this.projectsService.getAll([], where);
                return (result?.items ?? []).map((project) => ({
                    id: project.id,
                    label: project.name
                }));
            }
            case BaseEntityEnum.OrganizationTeam: {
                const result = await this.teamsService.getAll([], where);
                return (result?.items ?? []).map((team) => ({
                    id: team.id,
                    label: team.name
                }));
            }
            case BaseEntityEnum.Employee: {
                const result = await firstValueFrom(this.employeesService
                    .getAll(['user'], where)
                    .pipe(catchError(() => of({ items: [], total: 0 }))));
                return (result?.items ?? []).map((employee) => ({
                    id: employee.id,
                    label: employee.fullName ||
                        employee.user?.name ||
                        [employee.user?.firstName, employee.user?.lastName].filter(Boolean).join(' ') ||
                        String(employee.id)
                }));
            }
            case BaseEntityEnum.OrganizationContact: {
                const result = await this.contactsService.getAll([], where);
                return (result?.items ?? []).map((contact) => ({
                    id: contact.id,
                    label: contact.name
                }));
            }
            case BaseEntityEnum.Invoice: {
                const result = await this.invoicesService.getAll(where);
                return (result?.items ?? []).map((invoice) => ({
                    id: invoice.id,
                    label: `#${invoice.invoiceNumber ?? invoice.id}`
                }));
            }
            default:
                return [];
        }
    }
    /**
     * Picker label for a task: the human task key plus the title (e.g.
     * `"EG-42 · Fix the thing"`). `prefix`/`number` are both optional — a task
     * without a number is shown by title alone, one without a project prefix
     * falls back to `#`.
     */
    taskLabel(task) {
        if (!task.number)
            return task.title;
        const key = task.prefix ? `${task.prefix}-` : '#';
        return `${key}${task.number} · ${task.title}`;
    }
    // ─── Picker ──────────────────────────────────────────────────
    /** Already-linked targets are hidden — `DocumentLink` is idempotent per (document, entity, entityId). */
    get filtered() {
        const linked = new Set((this.existing ?? [])
            .filter((link) => link.entity === this.entity)
            .map((link) => String(link.entityId)));
        const term = this.search.trim().toLowerCase();
        return this.candidates
            .filter((candidate) => !linked.has(String(candidate.id)))
            .filter((candidate) => !term || candidate.label.toLowerCase().includes(term));
    }
    get canConfirm() {
        return !!this.selectedId && !this.saving;
    }
    async confirm() {
        if (!this.canConfirm || !this.document)
            return;
        const candidate = this.candidates.find((entry) => String(entry.id) === String(this.selectedId));
        const { organizationId, tenantId } = this.orgContext();
        this.saving = true;
        try {
            const link = await firstValueFrom(this.documentsService.createLink({
                documentId: this.document.id,
                entity: this.entity,
                entityId: this.selectedId,
                // Display label captured at link time (spec 02 `DocumentLink.metadata`).
                metadata: { label: candidate?.label ?? '' },
                organizationId,
                tenantId
            }));
            this.toastrService.success(this.getTranslation('DOCS.LINKS.TOAST_ADDED'));
            this.dialogRef.close(link);
        }
        catch (error) {
            this.toastrService.danger(error);
            this.saving = false;
        }
    }
    cancel() {
        this.dialogRef.close(null);
    }
    trackCandidate(_, candidate) {
        return String(candidate.id);
    }
    orgContext() {
        const organization = this.store.selectedOrganization;
        return organization ? { organizationId: organization.id, tenantId: organization.tenantId } : {};
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DocumentLinkDialogComponent, deps: [{ token: i1.TranslateService }, { token: i2.NbDialogRef }, { token: i3.DocumentsService }, { token: i4.TasksService }, { token: i4.OrganizationProjectsService }, { token: i4.OrganizationTeamsService }, { token: i4.EmployeesService }, { token: i4.OrganizationContactService }, { token: i4.InvoicesService }, { token: i4.ToastrService }, { token: i4.Store }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: DocumentLinkDialogComponent, isStandalone: false, selector: "gz-docs-link-dialog", inputs: { document: "document", existing: "existing" }, providers: [EmployeesService, InvoicesService], usesInheritance: true, ngImport: i0, template: "<nb-card class=\"docs-dialog docs-link-dialog\">\n\t<nb-card-header>{{ 'DOCS.LINKS.DIALOG_TITLE' | translate }}</nb-card-header>\n\n\t<nb-card-body [nbSpinner]=\"loading\" nbSpinnerStatus=\"primary\">\n\t\t<label class=\"label\" for=\"docs-link-entity\">{{ 'DOCS.LINKS.ENTITY_TYPE' | translate }}</label>\n\t\t<nb-select\n\t\t\tid=\"docs-link-entity\"\n\t\t\tsize=\"small\"\n\t\t\tfullWidth\n\t\t\t[selected]=\"entity\"\n\t\t\t[disabled]=\"saving\"\n\t\t\t(selectedChange)=\"onEntityChange($event)\"\n\t\t>\n\t\t\t<nb-option *ngFor=\"let descriptor of entities\" [value]=\"descriptor.entity\">\n\t\t\t\t<nb-icon [icon]=\"descriptor.icon\" size=\"tiny\"></nb-icon>\n\t\t\t\t{{ descriptor.labelKey | translate }}\n\t\t\t</nb-option>\n\t\t</nb-select>\n\n\t\t<label class=\"label\" for=\"docs-link-search\">{{ 'DOCS.LINKS.RECORD' | translate }}</label>\n\t\t<input\n\t\t\tid=\"docs-link-search\"\n\t\t\tnbInput\n\t\t\tfullWidth\n\t\t\tsize=\"small\"\n\t\t\ttype=\"text\"\n\t\t\t[placeholder]=\"'DOCS.LINKS.SEARCH_PLACEHOLDER' | translate\"\n\t\t\t[disabled]=\"saving\"\n\t\t\t[(ngModel)]=\"search\"\n\t\t/>\n\n\t\t<p class=\"muted\" *ngIf=\"!loading && !filtered.length\">{{ 'DOCS.LINKS.NO_RECORDS' | translate }}</p>\n\n\t\t<div class=\"docs-link-list\" *ngIf=\"filtered.length\">\n\t\t\t<button\n\t\t\t\ttype=\"button\"\n\t\t\t\tclass=\"docs-link-item\"\n\t\t\t\t*ngFor=\"let candidate of filtered; trackBy: trackCandidate\"\n\t\t\t\t[class.selected]=\"selectedId === candidate.id\"\n\t\t\t\t[disabled]=\"saving\"\n\t\t\t\t(click)=\"selectedId = candidate.id\"\n\t\t\t>\n\t\t\t\t{{ candidate.label }}\n\t\t\t</button>\n\t\t</div>\n\t</nb-card-body>\n\n\t<nb-card-footer class=\"docs-dialog-footer\">\n\t\t<button nbButton ghost [disabled]=\"saving\" (click)=\"cancel()\">{{ 'DOCS.UPLOAD.CANCEL' | translate }}</button>\n\t\t<button nbButton status=\"primary\" [disabled]=\"!canConfirm\" (click)=\"confirm()\">\n\t\t\t{{ 'DOCS.LINKS.CONFIRM' | translate }}\n\t\t</button>\n\t</nb-card-footer>\n</nb-card>\n", styles: [".docs-link-dialog{width:28rem;max-width:92vw}.label{display:block;margin:.75rem 0 .25rem}.label:first-child{margin-top:0}.muted{margin:.75rem 0 0;color:var(--text-hint-color);font-size:.8125rem}.docs-link-list{margin-top:.5rem;max-height:16rem;overflow-y:auto;border:1px solid var(--divider-color);border-radius:var(--border-radius)}.docs-link-item{display:block;width:100%;padding:.375rem .625rem;border:0;background:transparent;color:inherit;font-size:.875rem;text-align:left;cursor:pointer;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.docs-link-item:hover:not(:disabled){background:var(--background-basic-color-2)}.docs-link-item.selected{background:var(--color-primary-transparent-200);font-weight:600}.docs-link-item:disabled{cursor:default;opacity:.6}.docs-dialog-footer{display:flex;justify-content:flex-end;gap:.5rem}\n"], dependencies: [{ kind: "directive", type: i5.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i5.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i6.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i6.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i6.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "component", type: i2.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "component", type: i2.NbCardComponent, selector: "nb-card", inputs: ["size", "status", "accent"] }, { kind: "component", type: i2.NbCardBodyComponent, selector: "nb-card-body" }, { kind: "component", type: i2.NbCardFooterComponent, selector: "nb-card-footer" }, { kind: "component", type: i2.NbCardHeaderComponent, selector: "nb-card-header" }, { kind: "component", type: i2.NbIconComponent, selector: "nb-icon", inputs: ["icon", "pack", "options", "status", "config"] }, { kind: "directive", type: i2.NbInputDirective, selector: "input[nbInput],textarea[nbInput]", inputs: ["fieldSize", "status", "shape", "fullWidth"] }, { kind: "component", type: i2.NbSelectComponent, selector: "nb-select", inputs: ["size", "status", "shape", "appearance", "optionsListClass", "optionsPanelClass", "optionsWidth", "outline", "filled", "hero", "disabled", "fullWidth", "placeholder", "compareWith", "selected", "multiple", "optionsOverlayOffset", "scrollStrategy"], outputs: ["selectedChange"] }, { kind: "component", type: i2.NbOptionComponent, selector: "nb-option", inputs: ["value", "disabled"], outputs: ["selectionChange"] }, { kind: "directive", type: i2.NbSpinnerDirective, selector: "[nbSpinner]", inputs: ["nbSpinnerMessage", "nbSpinnerStatus", "nbSpinnerSize", "nbSpinner"] }, { kind: "pipe", type: i1.TranslatePipe, name: "translate" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DocumentLinkDialogComponent, decorators: [{
            type: Component,
            args: [{ selector: 'gz-docs-link-dialog', providers: [EmployeesService, InvoicesService], standalone: false, template: "<nb-card class=\"docs-dialog docs-link-dialog\">\n\t<nb-card-header>{{ 'DOCS.LINKS.DIALOG_TITLE' | translate }}</nb-card-header>\n\n\t<nb-card-body [nbSpinner]=\"loading\" nbSpinnerStatus=\"primary\">\n\t\t<label class=\"label\" for=\"docs-link-entity\">{{ 'DOCS.LINKS.ENTITY_TYPE' | translate }}</label>\n\t\t<nb-select\n\t\t\tid=\"docs-link-entity\"\n\t\t\tsize=\"small\"\n\t\t\tfullWidth\n\t\t\t[selected]=\"entity\"\n\t\t\t[disabled]=\"saving\"\n\t\t\t(selectedChange)=\"onEntityChange($event)\"\n\t\t>\n\t\t\t<nb-option *ngFor=\"let descriptor of entities\" [value]=\"descriptor.entity\">\n\t\t\t\t<nb-icon [icon]=\"descriptor.icon\" size=\"tiny\"></nb-icon>\n\t\t\t\t{{ descriptor.labelKey | translate }}\n\t\t\t</nb-option>\n\t\t</nb-select>\n\n\t\t<label class=\"label\" for=\"docs-link-search\">{{ 'DOCS.LINKS.RECORD' | translate }}</label>\n\t\t<input\n\t\t\tid=\"docs-link-search\"\n\t\t\tnbInput\n\t\t\tfullWidth\n\t\t\tsize=\"small\"\n\t\t\ttype=\"text\"\n\t\t\t[placeholder]=\"'DOCS.LINKS.SEARCH_PLACEHOLDER' | translate\"\n\t\t\t[disabled]=\"saving\"\n\t\t\t[(ngModel)]=\"search\"\n\t\t/>\n\n\t\t<p class=\"muted\" *ngIf=\"!loading && !filtered.length\">{{ 'DOCS.LINKS.NO_RECORDS' | translate }}</p>\n\n\t\t<div class=\"docs-link-list\" *ngIf=\"filtered.length\">\n\t\t\t<button\n\t\t\t\ttype=\"button\"\n\t\t\t\tclass=\"docs-link-item\"\n\t\t\t\t*ngFor=\"let candidate of filtered; trackBy: trackCandidate\"\n\t\t\t\t[class.selected]=\"selectedId === candidate.id\"\n\t\t\t\t[disabled]=\"saving\"\n\t\t\t\t(click)=\"selectedId = candidate.id\"\n\t\t\t>\n\t\t\t\t{{ candidate.label }}\n\t\t\t</button>\n\t\t</div>\n\t</nb-card-body>\n\n\t<nb-card-footer class=\"docs-dialog-footer\">\n\t\t<button nbButton ghost [disabled]=\"saving\" (click)=\"cancel()\">{{ 'DOCS.UPLOAD.CANCEL' | translate }}</button>\n\t\t<button nbButton status=\"primary\" [disabled]=\"!canConfirm\" (click)=\"confirm()\">\n\t\t\t{{ 'DOCS.LINKS.CONFIRM' | translate }}\n\t\t</button>\n\t</nb-card-footer>\n</nb-card>\n", styles: [".docs-link-dialog{width:28rem;max-width:92vw}.label{display:block;margin:.75rem 0 .25rem}.label:first-child{margin-top:0}.muted{margin:.75rem 0 0;color:var(--text-hint-color);font-size:.8125rem}.docs-link-list{margin-top:.5rem;max-height:16rem;overflow-y:auto;border:1px solid var(--divider-color);border-radius:var(--border-radius)}.docs-link-item{display:block;width:100%;padding:.375rem .625rem;border:0;background:transparent;color:inherit;font-size:.875rem;text-align:left;cursor:pointer;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.docs-link-item:hover:not(:disabled){background:var(--background-basic-color-2)}.docs-link-item.selected{background:var(--color-primary-transparent-200);font-weight:600}.docs-link-item:disabled{cursor:default;opacity:.6}.docs-dialog-footer{display:flex;justify-content:flex-end;gap:.5rem}\n"] }]
        }], ctorParameters: () => [{ type: i1.TranslateService }, { type: i2.NbDialogRef }, { type: i3.DocumentsService }, { type: i4.TasksService }, { type: i4.OrganizationProjectsService }, { type: i4.OrganizationTeamsService }, { type: i4.EmployeesService }, { type: i4.OrganizationContactService }, { type: i4.InvoicesService }, { type: i4.ToastrService }, { type: i4.Store }], propDecorators: { document: [{
                type: Input
            }], existing: [{
                type: Input
            }] } });
//# sourceMappingURL=link-dialog.component.js.map