import { Component, Input } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { catchError, firstValueFrom, of } from 'rxjs';
import { DocumentShareAccessEnum, DocumentVisibilityEnum, PermissionsEnum } from '@gauzy/contracts';
import { EmployeesService, OrganizationTeamsService, Store, ToastrService } from '@gauzy/ui-core/core';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { DOCS_SHARE_ACCESS_LEVELS, DOCS_SHARE_ERROR_CODES } from '../models/docs-share.model';
import { DocumentsService } from '../services/documents.service';
import { DOCS_PERMISSIONS } from '../docs-permission-groups';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
import * as i2 from "@nebular/theme";
import * as i3 from "../services/documents.service";
import * as i4 from "@gauzy/ui-core/core";
import * as i5 from "@angular/common";
import * as i6 from "ngx-permissions";
import * as i7 from "@gauzy/ui-core/shared";
/**
 * Share overlay editor for a document (`08-permissions-security.md` §3,
 * `01-ux-spec.md` §8). Opened from the detail panel and the page-editor overflow
 * menu; everything mutating is `DOCS_UPDATE`-gated.
 *
 * Two blocks:
 *
 *  1. **Visibility** — `ORGANIZATION` ⇄ `PRIVATE` with an explanatory hint.
 *     Shares only mean anything on PRIVATE documents (an ORGANIZATION document
 *     is already readable org-wide and `POST /shares` answers 409
 *     `DOCS_SHARE_NOT_PRIVATE`), so the share block is disabled — not hidden —
 *     while visibility is ORGANIZATION, with the reason spelled out. Hiding it
 *     would leave the user hunting for a control that exists.
 *  2. **Shares** — existing rows (employee or team + VIEW/COMMENT/EDIT), an add
 *     form, inline access changes and revoke.
 *
 * 🛑 The dialog states the §3.3 composition invariant in the access hint:
 * `EDIT` still requires the subject to hold `DOCS_UPDATE`. A share never
 * substitutes for a permission, and promising otherwise in the UI is the kind
 * of thing people plan access around.
 *
 * **Feature detection:** the share endpoints are P1 in `03-backend-plugin.md`.
 * A 404 on the initial `GET /shares` is treated as "this deployment has no
 * share endpoints yet" and renders an unavailable notice — never an error toast
 * (an error a user cannot act on is noise).
 *
 * The employee picker deliberately does **not** reuse `ga-employee-multi-select`:
 * that component gates rendering on `DateRangePickerBuilderService.selectedDateRange$`,
 * which never emits on Documents routes because `docs.routes.ts` disables the
 * header date selector (`selectors: { date: false }`) — it would render an empty
 * box here. The team picker does reuse `ga-team-selector` (no such coupling),
 * with `skipGlobalChange` so picking a team never rewrites global nav state.
 */
export class DocumentShareDialogComponent extends TranslationBaseComponent {
    constructor(translateService, dialogRef, documentsService, employeesService, teamsService, toastrService, store) {
        super(translateService);
        this.translateService = translateService;
        this.dialogRef = dialogRef;
        this.documentsService = documentsService;
        this.employeesService = employeesService;
        this.teamsService = teamsService;
        this.toastrService = toastrService;
        this.store = store;
        /**
         * Stable permission arrays for the template's `*ngxPermissionsOnly` gates.
         * 🛑 Never inline `[permissions.X]` in a binding — a fresh array each change-detection cycle
         * makes ngx-permissions re-validate forever and wedges the main thread.
         */
        this.docsPermissions = DOCS_PERMISSIONS;
        this.rows = [];
        this.employees = [];
        this.teams = [];
        this.loading = false;
        this.saving = false;
        /** True once `GET /shares` answered 404 — the P1 endpoints are not deployed. */
        this.unsupported = false;
        /** True after a 403/404 on a mutation the user turned out not to be allowed. */
        this.forbidden = false;
        // Add-share form
        this.targetKind = 'employee';
        this.selectedEmployeeId = null;
        this.selectedTeamId = null;
        this.newAccess = DocumentShareAccessEnum.VIEW;
        this.visibility = DocumentVisibilityEnum.ORGANIZATION;
        this.accessLevels = DOCS_SHARE_ACCESS_LEVELS;
        this.visibilities = [DocumentVisibilityEnum.ORGANIZATION, DocumentVisibilityEnum.PRIVATE];
        this.visibilityEnum = DocumentVisibilityEnum;
        this.permissions = PermissionsEnum;
    }
    ngOnInit() {
        this.visibility = this.document?.visibility ?? DocumentVisibilityEnum.ORGANIZATION;
        void this.reload();
    }
    // ─── Loading ─────────────────────────────────────────────────
    async reload() {
        if (!this.document?.id)
            return;
        this.loading = true;
        try {
            const [shares, employees, teams] = await Promise.all([
                firstValueFrom(this.documentsService.getShares(this.document.id).pipe(catchError((error) => {
                    // 404 = endpoints absent (P1) OR the document is not visible
                    // to this user; either way there is nothing to show.
                    if (error?.status === 404)
                        this.unsupported = true;
                    if (error?.status === 403)
                        this.forbidden = true;
                    return of([]);
                }))),
                this.loadEmployees(),
                this.loadTeams()
            ]);
            this.employees = employees;
            this.teams = teams;
            this.rows = (shares ?? []).map((share) => this.toRow(share));
        }
        finally {
            this.loading = false;
        }
    }
    async loadEmployees() {
        const { organizationId, tenantId } = this.orgContext();
        if (!organizationId)
            return [];
        const result = await firstValueFrom(this.employeesService
            .getAll(['user'], { organizationId, tenantId })
            .pipe(catchError(() => of({ items: [], total: 0 }))));
        return result?.items ?? [];
    }
    async loadTeams() {
        const { organizationId, tenantId } = this.orgContext();
        if (!organizationId)
            return [];
        try {
            const result = await this.teamsService.getAll([], { organizationId, tenantId });
            return result?.items ?? [];
        }
        catch {
            return [];
        }
    }
    // ─── Visibility ──────────────────────────────────────────────
    get isPrivate() {
        return this.visibility === DocumentVisibilityEnum.PRIVATE;
    }
    /**
     * Flipping to ORGANIZATION does **not** delete existing shares: they simply
     * stop granting anything (§3.3 — shares have no effect on ORGANIZATION
     * documents) and come back if the document goes PRIVATE again. Silently
     * dropping rows on a visibility toggle would be a surprising data loss.
     */
    async onVisibilityChange(visibility) {
        if (!this.document || visibility === this.visibility)
            return;
        const previous = this.visibility;
        this.visibility = visibility;
        this.saving = true;
        try {
            this.document = await firstValueFrom(this.documentsService.update(this.document.id, { visibility }));
            this.visibility = this.document.visibility ?? visibility;
            this.toastrService.success(this.getTranslation('DOCS.TOASTS.VISIBILITY_UPDATED'));
        }
        catch (error) {
            this.visibility = previous; // revert
            this.toastrService.danger(error);
        }
        finally {
            this.saving = false;
        }
    }
    // ─── Shares ──────────────────────────────────────────────────
    get canAdd() {
        if (!this.isPrivate || this.unsupported || this.saving)
            return false;
        return this.targetKind === 'employee' ? !!this.selectedEmployeeId : !!this.selectedTeamId;
    }
    onTargetKindChange(kind) {
        this.targetKind = kind;
        this.selectedEmployeeId = null;
        this.selectedTeamId = null;
    }
    onTeamPicked(team) {
        this.selectedTeamId = team?.id ?? null;
    }
    async addShare() {
        if (!this.canAdd || !this.document)
            return;
        const { organizationId, tenantId } = this.orgContext();
        const input = {
            access: this.newAccess,
            organizationId,
            tenantId,
            // XOR — exactly one target, or the backend answers 400 DOCS_SHARE_TARGET.
            ...(this.targetKind === 'employee'
                ? { employeeId: this.selectedEmployeeId }
                : { teamId: this.selectedTeamId })
        };
        this.saving = true;
        try {
            const share = await firstValueFrom(this.documentsService.createShare(this.document.id, input));
            this.rows = [...this.rows, this.toRow(share)];
            this.selectedEmployeeId = null;
            this.selectedTeamId = null;
            this.newAccess = DocumentShareAccessEnum.VIEW;
            this.toastrService.success(this.getTranslation('DOCS.SHARE.TOAST_ADDED'));
        }
        catch (error) {
            this.handleShareError(error);
        }
        finally {
            this.saving = false;
        }
    }
    async changeAccess(row, access) {
        if (!this.document || row.busy || access === row.share.access)
            return;
        const previous = row.share.access;
        row.busy = true;
        row.share = { ...row.share, access }; // optimistic
        try {
            const updated = await firstValueFrom(this.documentsService.updateShare(this.document.id, row.share.id, { access }));
            row.share = { ...row.share, ...updated };
        }
        catch (error) {
            row.share = { ...row.share, access: previous }; // revert
            this.handleShareError(error);
        }
        finally {
            row.busy = false;
        }
    }
    async revoke(row) {
        if (!this.document || row.busy)
            return;
        row.busy = true;
        try {
            await firstValueFrom(this.documentsService.deleteShare(this.document.id, row.share.id));
            this.rows = this.rows.filter((entry) => entry.share.id !== row.share.id);
            this.toastrService.success(this.getTranslation('DOCS.SHARE.TOAST_REVOKED'));
        }
        catch (error) {
            row.busy = false;
            this.handleShareError(error);
        }
    }
    // ─── Helpers ─────────────────────────────────────────────────
    employeeLabel(employee) {
        return (employee?.fullName ||
            employee?.user?.name ||
            [employee?.user?.firstName, employee?.user?.lastName].filter(Boolean).join(' ') ||
            employee?.user?.email ||
            String(employee?.id ?? ''));
    }
    /** Employees already holding a share are not offered again (duplicate ⇒ 409). */
    get availableEmployees() {
        const taken = new Set(this.rows.map((row) => String(row.share.employeeId ?? '')));
        return this.employees.filter((employee) => !taken.has(String(employee.id)));
    }
    get availableTeams() {
        const taken = new Set(this.rows.map((row) => String(row.share.teamId ?? '')));
        return this.teams.filter((team) => !taken.has(String(team.id)));
    }
    trackRow(_, row) {
        return String(row.share.id);
    }
    close() {
        // Resolves with the (possibly re-fetched) document so the opener can
        // refresh its visibility chip without another round trip.
        this.dialogRef.close(this.document ?? null);
    }
    toRow(share) {
        const kind = share.teamId ? 'team' : 'employee';
        const label = kind === 'team' ? this.teamShareLabel(share) : this.employeeShareLabel(share);
        return { share, label, kind, busy: false };
    }
    /** Team name off the share, then the loaded catalog, then the bare id. */
    teamShareLabel(share) {
        return (share.team?.name ??
            this.teams.find((team) => String(team.id) === String(share.teamId))?.name ??
            String(share.teamId ?? ''));
    }
    /** Employee off the share, else the loaded catalog, else an id-only stub. */
    employeeShareLabel(share) {
        if (share.employee)
            return this.employeeLabel(share.employee);
        const employee = this.employees.find((candidate) => String(candidate.id) === String(share.employeeId));
        return this.employeeLabel(employee ?? { id: share.employeeId });
    }
    /** Maps the documented share error codes onto readable copy; falls back to the raw error. */
    handleShareError(error) {
        const code = error?.error?.code;
        if (code === DOCS_SHARE_ERROR_CODES.NOT_PRIVATE) {
            this.toastrService.danger(this.getTranslation('DOCS.SHARE.ERROR_NOT_PRIVATE'));
            return;
        }
        if (code === DOCS_SHARE_ERROR_CODES.TARGET) {
            this.toastrService.danger(this.getTranslation('DOCS.SHARE.ERROR_TARGET'));
            return;
        }
        if (error?.status === 409) {
            this.toastrService.danger(this.getTranslation('DOCS.SHARE.ERROR_DUPLICATE'));
            return;
        }
        if (error?.status === 404) {
            this.unsupported = true;
            return;
        }
        this.toastrService.danger(error);
    }
    orgContext() {
        const organization = this.store.selectedOrganization;
        return organization ? { organizationId: organization.id, tenantId: organization.tenantId } : {};
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DocumentShareDialogComponent, deps: [{ token: i1.TranslateService }, { token: i2.NbDialogRef }, { token: i3.DocumentsService }, { token: i4.EmployeesService }, { token: i4.OrganizationTeamsService }, { token: i4.ToastrService }, { token: i4.Store }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: DocumentShareDialogComponent, isStandalone: false, selector: "gz-document-share-dialog", inputs: { document: "document" }, providers: [EmployeesService], usesInheritance: true, ngImport: i0, template: "<nb-card class=\"docs-dialog docs-share-dialog\" [nbSpinner]=\"loading\" nbSpinnerStatus=\"primary\">\n\t<nb-card-header class=\"docs-share-header\">\n\t\t<span>{{ 'DOCS.SHARE.TITLE' | translate }}</span>\n\t\t<span class=\"docs-share-doc\" *ngIf=\"document\">{{ document.name }}</span>\n\t</nb-card-header>\n\n\t<nb-card-body>\n\t\t<!-- \u2500\u2500\u2500 Visibility (ORGANIZATION \u21C4 PRIVATE) \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 -->\n\t\t<section class=\"docs-share-section\">\n\t\t\t<label class=\"label\" for=\"docs-share-visibility\">{{ 'DOCS.VISIBILITY.LABEL' | translate }}</label>\n\t\t\t<ng-container *ngxPermissionsOnly=\"docsPermissions.update; else visibilityReadonly\">\n\t\t\t\t<nb-select\n\t\t\t\t\tid=\"docs-share-visibility\"\n\t\t\t\t\tsize=\"small\"\n\t\t\t\t\tfullWidth\n\t\t\t\t\t[selected]=\"visibility\"\n\t\t\t\t\t[disabled]=\"saving\"\n\t\t\t\t\t(selectedChange)=\"onVisibilityChange($event)\"\n\t\t\t\t>\n\t\t\t\t\t<nb-option *ngFor=\"let option of visibilities\" [value]=\"option\">\n\t\t\t\t\t\t{{ 'DOCS.VISIBILITY.' + option | translate }}\n\t\t\t\t\t</nb-option>\n\t\t\t\t</nb-select>\n\t\t\t</ng-container>\n\t\t\t<ng-template #visibilityReadonly>\n\t\t\t\t<div class=\"docs-share-readonly\">{{ 'DOCS.VISIBILITY.' + visibility | translate }}</div>\n\t\t\t</ng-template>\n\t\t\t<p class=\"hint\">\n\t\t\t\t{{\n\t\t\t\t\t(isPrivate ? 'DOCS.SHARE.VISIBILITY_HINT_PRIVATE' : 'DOCS.SHARE.VISIBILITY_HINT_ORGANIZATION')\n\t\t\t\t\t\t| translate\n\t\t\t\t}}\n\t\t\t</p>\n\t\t</section>\n\n\t\t<!-- \u2500\u2500\u2500 Endpoint absent (P1 not deployed) \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 -->\n\t\t<div class=\"docs-share-notice\" *ngIf=\"unsupported\">\n\t\t\t<nb-icon icon=\"info-outline\"></nb-icon>\n\t\t\t<span>{{ 'DOCS.SHARE.UNAVAILABLE' | translate }}</span>\n\t\t</div>\n\n\t\t<!-- \u2500\u2500\u2500 Shares \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 -->\n\t\t<section class=\"docs-share-section\" *ngIf=\"!unsupported\">\n\t\t\t<h6 class=\"docs-share-heading\">{{ 'DOCS.SHARE.PEOPLE' | translate }}</h6>\n\n\t\t\t<!-- ORGANIZATION documents: the block stays visible but inert, with the reason. -->\n\t\t\t<div class=\"docs-share-notice\" *ngIf=\"!isPrivate\">\n\t\t\t\t<nb-icon icon=\"globe-2-outline\"></nb-icon>\n\t\t\t\t<span>{{ 'DOCS.SHARE.ORG_VISIBLE_NOTICE' | translate }}</span>\n\t\t\t</div>\n\n\t\t\t<p class=\"muted\" *ngIf=\"isPrivate && !rows.length\">{{ 'DOCS.SHARE.EMPTY' | translate }}</p>\n\n\t\t\t<ul class=\"docs-share-list\" *ngIf=\"rows.length\">\n\t\t\t\t<li class=\"docs-share-row\" *ngFor=\"let row of rows; trackBy: trackRow\" [class.disabled]=\"!isPrivate\">\n\t\t\t\t\t<nb-icon [icon]=\"row.kind === 'team' ? 'people-outline' : 'person-outline'\" size=\"tiny\"></nb-icon>\n\t\t\t\t\t<span class=\"docs-share-label\" [nbTooltip]=\"row.label\">{{ row.label }}</span>\n\n\t\t\t\t\t<ng-container *ngxPermissionsOnly=\"docsPermissions.update; else accessReadonly\">\n\t\t\t\t\t\t<nb-select\n\t\t\t\t\t\t\tsize=\"tiny\"\n\t\t\t\t\t\t\t[selected]=\"row.share.access\"\n\t\t\t\t\t\t\t[disabled]=\"row.busy || !isPrivate\"\n\t\t\t\t\t\t\t(selectedChange)=\"changeAccess(row, $event)\"\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t<nb-option *ngFor=\"let level of accessLevels\" [value]=\"level\">\n\t\t\t\t\t\t\t\t{{ 'DOCS.SHARE.ACCESS.' + level | translate }}\n\t\t\t\t\t\t\t</nb-option>\n\t\t\t\t\t\t</nb-select>\n\t\t\t\t\t\t<button\n\t\t\t\t\t\t\tnbButton\n\t\t\t\t\t\t\tghost\n\t\t\t\t\t\t\tsize=\"tiny\"\n\t\t\t\t\t\t\tstatus=\"danger\"\n\t\t\t\t\t\t\t[disabled]=\"row.busy\"\n\t\t\t\t\t\t\t[nbTooltip]=\"'DOCS.SHARE.REVOKE' | translate\"\n\t\t\t\t\t\t\t(click)=\"revoke(row)\"\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t<nb-icon icon=\"close-outline\"></nb-icon>\n\t\t\t\t\t\t</button>\n\t\t\t\t\t</ng-container>\n\t\t\t\t\t<ng-template #accessReadonly>\n\t\t\t\t\t\t<span class=\"docs-share-access\">{{ 'DOCS.SHARE.ACCESS.' + row.share.access | translate }}</span>\n\t\t\t\t\t</ng-template>\n\t\t\t\t</li>\n\t\t\t</ul>\n\n\t\t\t<!-- Add share (DOCS_UPDATE only; inert while ORGANIZATION-visible) -->\n\t\t\t<div class=\"docs-share-add\" *ngxPermissionsOnly=\"docsPermissions.update\">\n\t\t\t\t<!-- `<fieldset>` is the semantic grouping element (implicit `group` role); the inline\n\t\t\t\t     rules only neutralize the user-agent fieldset chrome so the layout is unchanged. -->\n\t\t\t\t<fieldset\n\t\t\t\t\tclass=\"docs-share-target-toggle\"\n\t\t\t\t\tstyle=\"border: 0; padding: 0; margin-inline: 0; min-inline-size: 0\"\n\t\t\t\t\t[attr.aria-label]=\"'DOCS.SHARE.ADD' | translate\"\n\t\t\t\t>\n\t\t\t\t\t<button\n\t\t\t\t\t\tnbButton\n\t\t\t\t\t\tsize=\"tiny\"\n\t\t\t\t\t\t[status]=\"targetKind === 'employee' ? 'primary' : 'basic'\"\n\t\t\t\t\t\t[appearance]=\"targetKind === 'employee' ? 'filled' : 'outline'\"\n\t\t\t\t\t\t[attr.aria-pressed]=\"targetKind === 'employee'\"\n\t\t\t\t\t\t[disabled]=\"!isPrivate\"\n\t\t\t\t\t\t(click)=\"onTargetKindChange('employee')\"\n\t\t\t\t\t>\n\t\t\t\t\t\t<nb-icon icon=\"person-outline\"></nb-icon>\n\t\t\t\t\t\t{{ 'DOCS.SHARE.TARGET_EMPLOYEE' | translate }}\n\t\t\t\t\t</button>\n\t\t\t\t\t<button\n\t\t\t\t\t\tnbButton\n\t\t\t\t\t\tsize=\"tiny\"\n\t\t\t\t\t\t[status]=\"targetKind === 'team' ? 'primary' : 'basic'\"\n\t\t\t\t\t\t[appearance]=\"targetKind === 'team' ? 'filled' : 'outline'\"\n\t\t\t\t\t\t[attr.aria-pressed]=\"targetKind === 'team'\"\n\t\t\t\t\t\t[disabled]=\"!isPrivate\"\n\t\t\t\t\t\t(click)=\"onTargetKindChange('team')\"\n\t\t\t\t\t>\n\t\t\t\t\t\t<nb-icon icon=\"people-outline\"></nb-icon>\n\t\t\t\t\t\t{{ 'DOCS.SHARE.TARGET_TEAM' | translate }}\n\t\t\t\t\t</button>\n\t\t\t\t</fieldset>\n\n\t\t\t\t<div class=\"docs-share-picker\">\n\t\t\t\t\t<!-- Employee picker: local nb-select \u2014 see the component doc for why\n\t\t\t\t\t     `ga-employee-multi-select` is not reused on Documents routes. -->\n\t\t\t\t\t<nb-select\n\t\t\t\t\t\t*ngIf=\"targetKind === 'employee'\"\n\t\t\t\t\t\tsize=\"small\"\n\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t[selected]=\"selectedEmployeeId\"\n\t\t\t\t\t\t[disabled]=\"!isPrivate || saving\"\n\t\t\t\t\t\t[placeholder]=\"'DOCS.SHARE.PICK_EMPLOYEE' | translate\"\n\t\t\t\t\t\t(selectedChange)=\"selectedEmployeeId = $event\"\n\t\t\t\t\t>\n\t\t\t\t\t\t<nb-option *ngFor=\"let employee of availableEmployees\" [value]=\"employee.id\">\n\t\t\t\t\t\t\t{{ employeeLabel(employee) }}\n\t\t\t\t\t\t</nb-option>\n\t\t\t\t\t</nb-select>\n\n\t\t\t\t\t<!-- Team picker: reuses the shared ui-core selector. -->\n\t\t\t\t\t<ga-team-selector\n\t\t\t\t\t\t*ngIf=\"targetKind === 'team'\"\n\t\t\t\t\t\tclass=\"docs-share-team-selector\"\n\t\t\t\t\t\t[multiple]=\"false\"\n\t\t\t\t\t\t[showAllOption]=\"false\"\n\t\t\t\t\t\t[defaultSelected]=\"false\"\n\t\t\t\t\t\t[skipGlobalChange]=\"true\"\n\t\t\t\t\t\t[disabled]=\"!isPrivate || saving\"\n\t\t\t\t\t\t[placeholder]=\"'DOCS.SHARE.PICK_TEAM' | translate\"\n\t\t\t\t\t\t(onChanged)=\"onTeamPicked($event)\"\n\t\t\t\t\t></ga-team-selector>\n\n\t\t\t\t\t<nb-select\n\t\t\t\t\t\tsize=\"small\"\n\t\t\t\t\t\t[selected]=\"newAccess\"\n\t\t\t\t\t\t[disabled]=\"!isPrivate || saving\"\n\t\t\t\t\t\t(selectedChange)=\"newAccess = $event\"\n\t\t\t\t\t>\n\t\t\t\t\t\t<nb-option *ngFor=\"let level of accessLevels\" [value]=\"level\">\n\t\t\t\t\t\t\t{{ 'DOCS.SHARE.ACCESS.' + level | translate }}\n\t\t\t\t\t\t</nb-option>\n\t\t\t\t\t</nb-select>\n\n\t\t\t\t\t<button nbButton size=\"small\" status=\"primary\" [disabled]=\"!canAdd\" (click)=\"addShare()\">\n\t\t\t\t\t\t<nb-icon icon=\"plus-outline\"></nb-icon>\n\t\t\t\t\t\t{{ 'DOCS.SHARE.ADD' | translate }}\n\t\t\t\t\t</button>\n\t\t\t\t</div>\n\n\t\t\t\t<p class=\"hint\">{{ 'DOCS.SHARE.ACCESS_HINT' | translate }}</p>\n\t\t\t</div>\n\t\t</section>\n\t</nb-card-body>\n\n\t<nb-card-footer class=\"docs-dialog-footer\">\n\t\t<button nbButton status=\"primary\" (click)=\"close()\">{{ 'DOCS.SHARE.DONE' | translate }}</button>\n\t</nb-card-footer>\n</nb-card>\n", styles: [".docs-share-dialog{width:34rem;max-width:92vw}.docs-share-header{display:flex;flex-direction:column;gap:.125rem}.docs-share-header .docs-share-doc{font-size:.75rem;font-weight:400;color:var(--text-hint-color);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.docs-share-section+.docs-share-section{margin-top:1.25rem;padding-top:1rem;border-top:1px solid var(--divider-color)}.docs-share-heading{margin:0 0 .5rem;font-size:.8125rem;text-transform:uppercase;letter-spacing:.02em;color:var(--text-hint-color)}.docs-share-readonly{font-size:.875rem}.hint{margin:.375rem 0 0;font-size:.75rem;color:var(--text-hint-color)}.muted{color:var(--text-hint-color);font-size:.8125rem}.docs-share-notice{display:flex;align-items:flex-start;gap:.5rem;margin:.75rem 0;padding:.5rem .625rem;border-radius:var(--border-radius);background:var(--background-basic-color-2);font-size:.8125rem;color:var(--text-hint-color)}.docs-share-list{list-style:none;margin:.5rem 0 0;padding:0;display:flex;flex-direction:column;gap:.375rem}.docs-share-row{display:flex;align-items:center;gap:.5rem}.docs-share-row.disabled{opacity:.6}.docs-share-row .docs-share-label{flex:1 1 auto;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:.875rem}.docs-share-row .docs-share-access{font-size:.75rem;color:var(--text-hint-color)}.docs-share-add{margin-top:.875rem}.docs-share-target-toggle{display:inline-flex;gap:.375rem;margin-bottom:.5rem}.docs-share-picker{display:flex;align-items:center;gap:.5rem;flex-wrap:wrap}.docs-share-picker nb-select,.docs-share-picker .docs-share-team-selector{flex:1 1 12rem;min-width:10rem}.docs-dialog-footer{display:flex;justify-content:flex-end;gap:.5rem}\n"], dependencies: [{ kind: "directive", type: i5.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i5.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i6.NgxPermissionsDirective, selector: "[ngxPermissionsOnly],[ngxPermissionsExcept]", inputs: ["ngxPermissionsOnly", "ngxPermissionsOnlyThen", "ngxPermissionsOnlyElse", "ngxPermissionsExcept", "ngxPermissionsExceptElse", "ngxPermissionsExceptThen", "ngxPermissionsThen", "ngxPermissionsElse", "ngxPermissionsOnlyAuthorisedStrategy", "ngxPermissionsOnlyUnauthorisedStrategy", "ngxPermissionsExceptUnauthorisedStrategy", "ngxPermissionsExceptAuthorisedStrategy", "ngxPermissionsUnauthorisedStrategy", "ngxPermissionsAuthorisedStrategy"], outputs: ["permissionsAuthorized", "permissionsUnauthorized"] }, { kind: "component", type: i2.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "component", type: i2.NbCardComponent, selector: "nb-card", inputs: ["size", "status", "accent"] }, { kind: "component", type: i2.NbCardBodyComponent, selector: "nb-card-body" }, { kind: "component", type: i2.NbCardFooterComponent, selector: "nb-card-footer" }, { kind: "component", type: i2.NbCardHeaderComponent, selector: "nb-card-header" }, { kind: "component", type: i2.NbIconComponent, selector: "nb-icon", inputs: ["icon", "pack", "options", "status", "config"] }, { kind: "component", type: i2.NbSelectComponent, selector: "nb-select", inputs: ["size", "status", "shape", "appearance", "optionsListClass", "optionsPanelClass", "optionsWidth", "outline", "filled", "hero", "disabled", "fullWidth", "placeholder", "compareWith", "selected", "multiple", "optionsOverlayOffset", "scrollStrategy"], outputs: ["selectedChange"] }, { kind: "component", type: i2.NbOptionComponent, selector: "nb-option", inputs: ["value", "disabled"], outputs: ["selectionChange"] }, { kind: "directive", type: i2.NbSpinnerDirective, selector: "[nbSpinner]", inputs: ["nbSpinnerMessage", "nbSpinnerStatus", "nbSpinnerSize", "nbSpinner"] }, { kind: "directive", type: i2.NbTooltipDirective, selector: "[nbTooltip]", inputs: ["nbTooltip", "nbTooltipPlacement", "nbTooltipAdjustment", "nbTooltipClass", "nbTooltipIcon", "nbTooltipStatus", "nbTooltipTrigger", "nbTooltipOffset", "nbTooltipDisabled"], outputs: ["nbTooltipShowStateChange"], exportAs: ["nbTooltip"] }, { kind: "component", type: i7.TeamSelectorComponent, selector: "ga-team-selector", inputs: ["shortened", "dropdownClass", "disabled", "multiple", "label", "placeholder", "skipGlobalChange", "defaultSelected", "showAllOption", "organizationTeamId", "employeeId", "projectId"], outputs: ["onChanged"] }, { kind: "pipe", type: i1.TranslatePipe, name: "translate" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DocumentShareDialogComponent, decorators: [{
            type: Component,
            args: [{ selector: 'gz-document-share-dialog', providers: [EmployeesService], standalone: false, template: "<nb-card class=\"docs-dialog docs-share-dialog\" [nbSpinner]=\"loading\" nbSpinnerStatus=\"primary\">\n\t<nb-card-header class=\"docs-share-header\">\n\t\t<span>{{ 'DOCS.SHARE.TITLE' | translate }}</span>\n\t\t<span class=\"docs-share-doc\" *ngIf=\"document\">{{ document.name }}</span>\n\t</nb-card-header>\n\n\t<nb-card-body>\n\t\t<!-- \u2500\u2500\u2500 Visibility (ORGANIZATION \u21C4 PRIVATE) \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 -->\n\t\t<section class=\"docs-share-section\">\n\t\t\t<label class=\"label\" for=\"docs-share-visibility\">{{ 'DOCS.VISIBILITY.LABEL' | translate }}</label>\n\t\t\t<ng-container *ngxPermissionsOnly=\"docsPermissions.update; else visibilityReadonly\">\n\t\t\t\t<nb-select\n\t\t\t\t\tid=\"docs-share-visibility\"\n\t\t\t\t\tsize=\"small\"\n\t\t\t\t\tfullWidth\n\t\t\t\t\t[selected]=\"visibility\"\n\t\t\t\t\t[disabled]=\"saving\"\n\t\t\t\t\t(selectedChange)=\"onVisibilityChange($event)\"\n\t\t\t\t>\n\t\t\t\t\t<nb-option *ngFor=\"let option of visibilities\" [value]=\"option\">\n\t\t\t\t\t\t{{ 'DOCS.VISIBILITY.' + option | translate }}\n\t\t\t\t\t</nb-option>\n\t\t\t\t</nb-select>\n\t\t\t</ng-container>\n\t\t\t<ng-template #visibilityReadonly>\n\t\t\t\t<div class=\"docs-share-readonly\">{{ 'DOCS.VISIBILITY.' + visibility | translate }}</div>\n\t\t\t</ng-template>\n\t\t\t<p class=\"hint\">\n\t\t\t\t{{\n\t\t\t\t\t(isPrivate ? 'DOCS.SHARE.VISIBILITY_HINT_PRIVATE' : 'DOCS.SHARE.VISIBILITY_HINT_ORGANIZATION')\n\t\t\t\t\t\t| translate\n\t\t\t\t}}\n\t\t\t</p>\n\t\t</section>\n\n\t\t<!-- \u2500\u2500\u2500 Endpoint absent (P1 not deployed) \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 -->\n\t\t<div class=\"docs-share-notice\" *ngIf=\"unsupported\">\n\t\t\t<nb-icon icon=\"info-outline\"></nb-icon>\n\t\t\t<span>{{ 'DOCS.SHARE.UNAVAILABLE' | translate }}</span>\n\t\t</div>\n\n\t\t<!-- \u2500\u2500\u2500 Shares \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 -->\n\t\t<section class=\"docs-share-section\" *ngIf=\"!unsupported\">\n\t\t\t<h6 class=\"docs-share-heading\">{{ 'DOCS.SHARE.PEOPLE' | translate }}</h6>\n\n\t\t\t<!-- ORGANIZATION documents: the block stays visible but inert, with the reason. -->\n\t\t\t<div class=\"docs-share-notice\" *ngIf=\"!isPrivate\">\n\t\t\t\t<nb-icon icon=\"globe-2-outline\"></nb-icon>\n\t\t\t\t<span>{{ 'DOCS.SHARE.ORG_VISIBLE_NOTICE' | translate }}</span>\n\t\t\t</div>\n\n\t\t\t<p class=\"muted\" *ngIf=\"isPrivate && !rows.length\">{{ 'DOCS.SHARE.EMPTY' | translate }}</p>\n\n\t\t\t<ul class=\"docs-share-list\" *ngIf=\"rows.length\">\n\t\t\t\t<li class=\"docs-share-row\" *ngFor=\"let row of rows; trackBy: trackRow\" [class.disabled]=\"!isPrivate\">\n\t\t\t\t\t<nb-icon [icon]=\"row.kind === 'team' ? 'people-outline' : 'person-outline'\" size=\"tiny\"></nb-icon>\n\t\t\t\t\t<span class=\"docs-share-label\" [nbTooltip]=\"row.label\">{{ row.label }}</span>\n\n\t\t\t\t\t<ng-container *ngxPermissionsOnly=\"docsPermissions.update; else accessReadonly\">\n\t\t\t\t\t\t<nb-select\n\t\t\t\t\t\t\tsize=\"tiny\"\n\t\t\t\t\t\t\t[selected]=\"row.share.access\"\n\t\t\t\t\t\t\t[disabled]=\"row.busy || !isPrivate\"\n\t\t\t\t\t\t\t(selectedChange)=\"changeAccess(row, $event)\"\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t<nb-option *ngFor=\"let level of accessLevels\" [value]=\"level\">\n\t\t\t\t\t\t\t\t{{ 'DOCS.SHARE.ACCESS.' + level | translate }}\n\t\t\t\t\t\t\t</nb-option>\n\t\t\t\t\t\t</nb-select>\n\t\t\t\t\t\t<button\n\t\t\t\t\t\t\tnbButton\n\t\t\t\t\t\t\tghost\n\t\t\t\t\t\t\tsize=\"tiny\"\n\t\t\t\t\t\t\tstatus=\"danger\"\n\t\t\t\t\t\t\t[disabled]=\"row.busy\"\n\t\t\t\t\t\t\t[nbTooltip]=\"'DOCS.SHARE.REVOKE' | translate\"\n\t\t\t\t\t\t\t(click)=\"revoke(row)\"\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t<nb-icon icon=\"close-outline\"></nb-icon>\n\t\t\t\t\t\t</button>\n\t\t\t\t\t</ng-container>\n\t\t\t\t\t<ng-template #accessReadonly>\n\t\t\t\t\t\t<span class=\"docs-share-access\">{{ 'DOCS.SHARE.ACCESS.' + row.share.access | translate }}</span>\n\t\t\t\t\t</ng-template>\n\t\t\t\t</li>\n\t\t\t</ul>\n\n\t\t\t<!-- Add share (DOCS_UPDATE only; inert while ORGANIZATION-visible) -->\n\t\t\t<div class=\"docs-share-add\" *ngxPermissionsOnly=\"docsPermissions.update\">\n\t\t\t\t<!-- `<fieldset>` is the semantic grouping element (implicit `group` role); the inline\n\t\t\t\t     rules only neutralize the user-agent fieldset chrome so the layout is unchanged. -->\n\t\t\t\t<fieldset\n\t\t\t\t\tclass=\"docs-share-target-toggle\"\n\t\t\t\t\tstyle=\"border: 0; padding: 0; margin-inline: 0; min-inline-size: 0\"\n\t\t\t\t\t[attr.aria-label]=\"'DOCS.SHARE.ADD' | translate\"\n\t\t\t\t>\n\t\t\t\t\t<button\n\t\t\t\t\t\tnbButton\n\t\t\t\t\t\tsize=\"tiny\"\n\t\t\t\t\t\t[status]=\"targetKind === 'employee' ? 'primary' : 'basic'\"\n\t\t\t\t\t\t[appearance]=\"targetKind === 'employee' ? 'filled' : 'outline'\"\n\t\t\t\t\t\t[attr.aria-pressed]=\"targetKind === 'employee'\"\n\t\t\t\t\t\t[disabled]=\"!isPrivate\"\n\t\t\t\t\t\t(click)=\"onTargetKindChange('employee')\"\n\t\t\t\t\t>\n\t\t\t\t\t\t<nb-icon icon=\"person-outline\"></nb-icon>\n\t\t\t\t\t\t{{ 'DOCS.SHARE.TARGET_EMPLOYEE' | translate }}\n\t\t\t\t\t</button>\n\t\t\t\t\t<button\n\t\t\t\t\t\tnbButton\n\t\t\t\t\t\tsize=\"tiny\"\n\t\t\t\t\t\t[status]=\"targetKind === 'team' ? 'primary' : 'basic'\"\n\t\t\t\t\t\t[appearance]=\"targetKind === 'team' ? 'filled' : 'outline'\"\n\t\t\t\t\t\t[attr.aria-pressed]=\"targetKind === 'team'\"\n\t\t\t\t\t\t[disabled]=\"!isPrivate\"\n\t\t\t\t\t\t(click)=\"onTargetKindChange('team')\"\n\t\t\t\t\t>\n\t\t\t\t\t\t<nb-icon icon=\"people-outline\"></nb-icon>\n\t\t\t\t\t\t{{ 'DOCS.SHARE.TARGET_TEAM' | translate }}\n\t\t\t\t\t</button>\n\t\t\t\t</fieldset>\n\n\t\t\t\t<div class=\"docs-share-picker\">\n\t\t\t\t\t<!-- Employee picker: local nb-select \u2014 see the component doc for why\n\t\t\t\t\t     `ga-employee-multi-select` is not reused on Documents routes. -->\n\t\t\t\t\t<nb-select\n\t\t\t\t\t\t*ngIf=\"targetKind === 'employee'\"\n\t\t\t\t\t\tsize=\"small\"\n\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t[selected]=\"selectedEmployeeId\"\n\t\t\t\t\t\t[disabled]=\"!isPrivate || saving\"\n\t\t\t\t\t\t[placeholder]=\"'DOCS.SHARE.PICK_EMPLOYEE' | translate\"\n\t\t\t\t\t\t(selectedChange)=\"selectedEmployeeId = $event\"\n\t\t\t\t\t>\n\t\t\t\t\t\t<nb-option *ngFor=\"let employee of availableEmployees\" [value]=\"employee.id\">\n\t\t\t\t\t\t\t{{ employeeLabel(employee) }}\n\t\t\t\t\t\t</nb-option>\n\t\t\t\t\t</nb-select>\n\n\t\t\t\t\t<!-- Team picker: reuses the shared ui-core selector. -->\n\t\t\t\t\t<ga-team-selector\n\t\t\t\t\t\t*ngIf=\"targetKind === 'team'\"\n\t\t\t\t\t\tclass=\"docs-share-team-selector\"\n\t\t\t\t\t\t[multiple]=\"false\"\n\t\t\t\t\t\t[showAllOption]=\"false\"\n\t\t\t\t\t\t[defaultSelected]=\"false\"\n\t\t\t\t\t\t[skipGlobalChange]=\"true\"\n\t\t\t\t\t\t[disabled]=\"!isPrivate || saving\"\n\t\t\t\t\t\t[placeholder]=\"'DOCS.SHARE.PICK_TEAM' | translate\"\n\t\t\t\t\t\t(onChanged)=\"onTeamPicked($event)\"\n\t\t\t\t\t></ga-team-selector>\n\n\t\t\t\t\t<nb-select\n\t\t\t\t\t\tsize=\"small\"\n\t\t\t\t\t\t[selected]=\"newAccess\"\n\t\t\t\t\t\t[disabled]=\"!isPrivate || saving\"\n\t\t\t\t\t\t(selectedChange)=\"newAccess = $event\"\n\t\t\t\t\t>\n\t\t\t\t\t\t<nb-option *ngFor=\"let level of accessLevels\" [value]=\"level\">\n\t\t\t\t\t\t\t{{ 'DOCS.SHARE.ACCESS.' + level | translate }}\n\t\t\t\t\t\t</nb-option>\n\t\t\t\t\t</nb-select>\n\n\t\t\t\t\t<button nbButton size=\"small\" status=\"primary\" [disabled]=\"!canAdd\" (click)=\"addShare()\">\n\t\t\t\t\t\t<nb-icon icon=\"plus-outline\"></nb-icon>\n\t\t\t\t\t\t{{ 'DOCS.SHARE.ADD' | translate }}\n\t\t\t\t\t</button>\n\t\t\t\t</div>\n\n\t\t\t\t<p class=\"hint\">{{ 'DOCS.SHARE.ACCESS_HINT' | translate }}</p>\n\t\t\t</div>\n\t\t</section>\n\t</nb-card-body>\n\n\t<nb-card-footer class=\"docs-dialog-footer\">\n\t\t<button nbButton status=\"primary\" (click)=\"close()\">{{ 'DOCS.SHARE.DONE' | translate }}</button>\n\t</nb-card-footer>\n</nb-card>\n", styles: [".docs-share-dialog{width:34rem;max-width:92vw}.docs-share-header{display:flex;flex-direction:column;gap:.125rem}.docs-share-header .docs-share-doc{font-size:.75rem;font-weight:400;color:var(--text-hint-color);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.docs-share-section+.docs-share-section{margin-top:1.25rem;padding-top:1rem;border-top:1px solid var(--divider-color)}.docs-share-heading{margin:0 0 .5rem;font-size:.8125rem;text-transform:uppercase;letter-spacing:.02em;color:var(--text-hint-color)}.docs-share-readonly{font-size:.875rem}.hint{margin:.375rem 0 0;font-size:.75rem;color:var(--text-hint-color)}.muted{color:var(--text-hint-color);font-size:.8125rem}.docs-share-notice{display:flex;align-items:flex-start;gap:.5rem;margin:.75rem 0;padding:.5rem .625rem;border-radius:var(--border-radius);background:var(--background-basic-color-2);font-size:.8125rem;color:var(--text-hint-color)}.docs-share-list{list-style:none;margin:.5rem 0 0;padding:0;display:flex;flex-direction:column;gap:.375rem}.docs-share-row{display:flex;align-items:center;gap:.5rem}.docs-share-row.disabled{opacity:.6}.docs-share-row .docs-share-label{flex:1 1 auto;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:.875rem}.docs-share-row .docs-share-access{font-size:.75rem;color:var(--text-hint-color)}.docs-share-add{margin-top:.875rem}.docs-share-target-toggle{display:inline-flex;gap:.375rem;margin-bottom:.5rem}.docs-share-picker{display:flex;align-items:center;gap:.5rem;flex-wrap:wrap}.docs-share-picker nb-select,.docs-share-picker .docs-share-team-selector{flex:1 1 12rem;min-width:10rem}.docs-dialog-footer{display:flex;justify-content:flex-end;gap:.5rem}\n"] }]
        }], ctorParameters: () => [{ type: i1.TranslateService }, { type: i2.NbDialogRef }, { type: i3.DocumentsService }, { type: i4.EmployeesService }, { type: i4.OrganizationTeamsService }, { type: i4.ToastrService }, { type: i4.Store }], propDecorators: { document: [{
                type: Input
            }] } });
//# sourceMappingURL=share-dialog.component.js.map