import { __decorate, __metadata } from "tslib";
import { Component, Input, ViewChild } from '@angular/core';
import { InvitationTypeEnum } from '@gauzy/contracts';
import { NbDialogRef } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { filter, tap } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { OrganizationContactService, OrganizationDepartmentsService, OrganizationProjectsService, OrganizationTeamsService, ToastrService } from '@gauzy/ui-core/core';
import { Store } from '@gauzy/ui-core/core';
import { EmailInviteFormComponent } from '../forms/email-invite-form/email-invite-form.component';
import * as i0 from "@angular/core";
import * as i1 from "@nebular/theme";
import * as i2 from "@gauzy/ui-core/core";
import * as i3 from "@ngx-translate/core";
import * as i4 from "../forms/email-invite-form/email-invite-form.component";
let InviteMutationComponent = class InviteMutationComponent extends TranslationBaseComponent {
    get invitationType() {
        return this._invitationType;
    }
    set invitationType(value) {
        this._invitationType = value;
    }
    constructor(dialogRef, organizationProjectsService, organizationContactService, organizationDepartmentsService, organizationTeamsService, translateService, toastrService, store) {
        super(translateService);
        this.dialogRef = dialogRef;
        this.organizationProjectsService = organizationProjectsService;
        this.organizationContactService = organizationContactService;
        this.organizationDepartmentsService = organizationDepartmentsService;
        this.organizationTeamsService = organizationTeamsService;
        this.translateService = translateService;
        this.toastrService = toastrService;
        this.store = store;
        this.organizationProjects = [];
        this.organizationContacts = [];
        this.organizationDepartments = [];
        this.organizationTeams = [];
    }
    ngOnInit() {
        this.store.selectedOrganization$
            .pipe(filter((organization) => !!organization), tap((organization) => (this.organization = organization)), tap(() => this.loadOrganizationData()), untilDestroyed(this))
            .subscribe();
    }
    async loadOrganizationData() {
        if (!this.organization) {
            return;
        }
        try {
            await this.loadProjects();
            await this.loadOrganizationContacts();
            await this.loadDepartments();
            await this.getOrganizationTeams();
        }
        catch (error) {
            this.toastrService.danger(error);
        }
    }
    async loadProjects() {
        const { tenantId } = this.store.user;
        const { id: organizationId } = this.organization;
        const { items = [] } = await this.organizationProjectsService.getAll([], { organizationId, tenantId });
        this.organizationProjects = items;
    }
    async loadOrganizationContacts() {
        const { tenantId } = this.store.user;
        const { id: organizationId } = this.organization;
        const { items = [] } = await this.organizationContactService.getAll([], { organizationId, tenantId });
        this.organizationContacts = items;
    }
    async loadDepartments() {
        const { tenantId } = this.store.user;
        const { id: organizationId } = this.organization;
        const { items = [] } = await this.organizationDepartmentsService.getAll([], { organizationId, tenantId });
        this.organizationDepartments = items;
    }
    async getOrganizationTeams() {
        if (!this.organization) {
            return;
        }
        const { tenantId } = this.store.user;
        const { id: organizationId } = this.organization;
        const { items = [] } = await this.organizationTeamsService.getAll([], { organizationId, tenantId });
        this.organizationTeams = items;
    }
    closeDialog(savedInvites = []) {
        this.dialogRef.close(savedInvites);
    }
    async add() {
        try {
            const { items, total, ignored } = await this.emailInviteForm.saveInvites();
            if (ignored > 0) {
                this.toastrService.warning('INVITE_PAGE.IGNORED', {
                    total,
                    ignored
                });
            }
            else {
                this.toastrService.success('INVITE_PAGE.SENT', {
                    total
                });
            }
            this.closeDialog(items);
        }
        catch (error) {
            this.toastrService.danger(error);
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: InviteMutationComponent, deps: [{ token: i1.NbDialogRef }, { token: i2.OrganizationProjectsService }, { token: i2.OrganizationContactService }, { token: i2.OrganizationDepartmentsService }, { token: i2.OrganizationTeamsService }, { token: i3.TranslateService }, { token: i2.ToastrService }, { token: i2.Store }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: InviteMutationComponent, isStandalone: false, selector: "ga-invite-mutation", inputs: { invitationType: "invitationType" }, viewQueries: [{ propertyName: "emailInviteForm", first: true, predicate: ["emailInviteForm"], descendants: true }], usesInheritance: true, ngImport: i0, template: "<nb-card>\n\t<nb-card-header class=\"d-flex flex-column\">\n\t\t<span class=\"cancel\"\n\t\t\t><i class=\"fas fa-times\" (click)=\"closeDialog()\"></i\n\t\t></span>\n\t\t<h5 class=\"title\">\n\t\t\t{{ 'INVITE_PAGE.' + invitationType + '.HEADER' | translate }}\n\t\t</h5>\n\t</nb-card-header>\n\t<nb-card-body>\n\t\t<ga-email-invite-form\n\t\t\t#emailInviteForm\n\t\t\t[organizationProjects]=\"organizationProjects\"\n\t\t\t[organizationContacts]=\"organizationContacts\"\n\t\t\t[organizationDepartments]=\"organizationDepartments\"\n\t\t\t[organizationTeams]=\"organizationTeams\"\n\t\t\t[invitationType]=\"invitationType\"\n\t\t></ga-email-invite-form>\n\t</nb-card-body>\n\t<nb-card-footer class=\"text-left\">\n\t\t<button class=\"mr-2\" status=\"basic\" outline (click)=\"closeDialog()\" nbButton>\n\t\t\t{{ 'BUTTONS.CANCEL' | translate }}\n\t\t</button>\n\t\t<button\n\t\t\tclass=\"mr-2\"\n\t\t\t[disabled]=\"emailInviteForm.form.invalid\"\n\t\t\tstatus=\"success\"\n\t\t\t(click)=\"add()\"\n\t\t\tnbButton\n\t\t>\n\t\t\t{{ 'INVITE_PAGE.' + invitationType + '.ACTION' | translate }}\n\t\t</button>\n\t</nb-card-footer>\n</nb-card>\n", styles: ["@charset \"UTF-8\";:host i{cursor:pointer}:host .cancel{width:100%;display:flex}[dir=ltr] :host .cancel{justify-content:flex-end}[dir=rtl] :host .cancel{justify-content:flex-start}:host .cancel i{font-size:11px;color:var(--gauzy-text-color-1)}:host [nbButton].appearance-outline.status-basic{background-color:transparent;border-color:#f56d584d;border-width:2px;color:#f56d58}:host [nbButton].appearance-outline.status-basic:hover{border-color:#f56d58}:host [nbButton].appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #f56d580d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host .title{color:var(--text-primary-color);font-size:16px;font-weight:600;line-height:16px;letter-spacing:0em}:host [nbButton].gray.appearance-outline.status-basic{background-color:transparent;border-color:#7e7e8f4d;border-width:2px;color:#7e7e8f}:host [nbButton].gray.appearance-outline.status-basic:hover{border-color:#7e7e8f}:host [nbButton].gray.appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #7e7e8f0d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].gray.appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host [nbButton].green.appearance-outline.status-basic{background-color:transparent;border-color:#25b8694d;border-width:2px;color:#25b869}:host [nbButton].green.appearance-outline.status-basic:hover{border-color:#25b869}:host [nbButton].green.appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #25b8690d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].green.appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host [nbButton].green.appearance-outline.status-basic[disabled],:host [nbButton].green.appearance-outline.status-basic.btn-disabled{background-color:var(--button-outline-basic-disabled-background-color);border-color:var(--button-outline-basic-disabled-border-color);color:var(--button-outline-basic-disabled-text-color);box-shadow:unset}:host [nbButton].primary.appearance-filled.status-primary{color:var(--text-primary-color);border:unset;background-color:var(--color-primary-transparent-default);box-shadow:var(--gauzy-shadow)}[dir=ltr] :host ::ng-deep input,[dir=ltr] :host ::ng-deep textarea{text-align:start}[dir=rtl] :host ::ng-deep input,[dir=rtl] :host ::ng-deep textarea{text-align:end}:host ::ng-deep input,:host ::ng-deep nb-select.appearance-outline.status-basic .select-button,:host ::ng-deep .ng-select .ng-select-container{background-color:var(--gauzy-sidebar-background-4)!important;border:none;min-height:calc(var(--select-medium-text-line-height) + .4375rem * 2)!important}:host ::ng-deep .ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-placeholder,:host ::ng-deep .ng-select.ng-select-single .ng-select-container .ng-value-container .ng-input{top:unset!important}:host ::ng-deep label,:host ::ng-deep .label{font-size:var(--text-label-font-size);font-weight:600;line-height:.8125rem;letter-spacing:-.01em;color:var(--gauzy-text-color-2)}:host ::ng-deep textarea{background-color:var(--gauzy-sidebar-background-4)!important;border:none}:host ::ng-deep .ng-select .ng-select-container input,:host ::ng-deep nb-tag-list input{background-color:unset!important}:host nb-card{background-color:var(--gauzy-card-1)}:host nb-card nb-card-header nb-icon.close{cursor:pointer}nb-card{width:645px;background-color:var(--gauzy-card-1)}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "component", type: i1.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "component", type: i1.NbCardComponent, selector: "nb-card", inputs: ["size", "status", "accent"] }, { kind: "component", type: i1.NbCardBodyComponent, selector: "nb-card-body" }, { kind: "component", type: i1.NbCardFooterComponent, selector: "nb-card-footer" }, { kind: "component", type: i1.NbCardHeaderComponent, selector: "nb-card-header" }, { kind: "component", type: i4.EmailInviteFormComponent, selector: "ga-email-invite-form", inputs: ["organizationProjects", "organizationContacts", "organizationDepartments", "organizationTeams", "invitationType"] }, { kind: "pipe", type: i3.TranslatePipe, name: "translate" }] }); }
};
InviteMutationComponent = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [NbDialogRef,
        OrganizationProjectsService,
        OrganizationContactService,
        OrganizationDepartmentsService,
        OrganizationTeamsService,
        TranslateService,
        ToastrService,
        Store])
], InviteMutationComponent);
export { InviteMutationComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: InviteMutationComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-invite-mutation', standalone: false, template: "<nb-card>\n\t<nb-card-header class=\"d-flex flex-column\">\n\t\t<span class=\"cancel\"\n\t\t\t><i class=\"fas fa-times\" (click)=\"closeDialog()\"></i\n\t\t></span>\n\t\t<h5 class=\"title\">\n\t\t\t{{ 'INVITE_PAGE.' + invitationType + '.HEADER' | translate }}\n\t\t</h5>\n\t</nb-card-header>\n\t<nb-card-body>\n\t\t<ga-email-invite-form\n\t\t\t#emailInviteForm\n\t\t\t[organizationProjects]=\"organizationProjects\"\n\t\t\t[organizationContacts]=\"organizationContacts\"\n\t\t\t[organizationDepartments]=\"organizationDepartments\"\n\t\t\t[organizationTeams]=\"organizationTeams\"\n\t\t\t[invitationType]=\"invitationType\"\n\t\t></ga-email-invite-form>\n\t</nb-card-body>\n\t<nb-card-footer class=\"text-left\">\n\t\t<button class=\"mr-2\" status=\"basic\" outline (click)=\"closeDialog()\" nbButton>\n\t\t\t{{ 'BUTTONS.CANCEL' | translate }}\n\t\t</button>\n\t\t<button\n\t\t\tclass=\"mr-2\"\n\t\t\t[disabled]=\"emailInviteForm.form.invalid\"\n\t\t\tstatus=\"success\"\n\t\t\t(click)=\"add()\"\n\t\t\tnbButton\n\t\t>\n\t\t\t{{ 'INVITE_PAGE.' + invitationType + '.ACTION' | translate }}\n\t\t</button>\n\t</nb-card-footer>\n</nb-card>\n", styles: ["@charset \"UTF-8\";:host i{cursor:pointer}:host .cancel{width:100%;display:flex}[dir=ltr] :host .cancel{justify-content:flex-end}[dir=rtl] :host .cancel{justify-content:flex-start}:host .cancel i{font-size:11px;color:var(--gauzy-text-color-1)}:host [nbButton].appearance-outline.status-basic{background-color:transparent;border-color:#f56d584d;border-width:2px;color:#f56d58}:host [nbButton].appearance-outline.status-basic:hover{border-color:#f56d58}:host [nbButton].appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #f56d580d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host .title{color:var(--text-primary-color);font-size:16px;font-weight:600;line-height:16px;letter-spacing:0em}:host [nbButton].gray.appearance-outline.status-basic{background-color:transparent;border-color:#7e7e8f4d;border-width:2px;color:#7e7e8f}:host [nbButton].gray.appearance-outline.status-basic:hover{border-color:#7e7e8f}:host [nbButton].gray.appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #7e7e8f0d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].gray.appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host [nbButton].green.appearance-outline.status-basic{background-color:transparent;border-color:#25b8694d;border-width:2px;color:#25b869}:host [nbButton].green.appearance-outline.status-basic:hover{border-color:#25b869}:host [nbButton].green.appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #25b8690d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].green.appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host [nbButton].green.appearance-outline.status-basic[disabled],:host [nbButton].green.appearance-outline.status-basic.btn-disabled{background-color:var(--button-outline-basic-disabled-background-color);border-color:var(--button-outline-basic-disabled-border-color);color:var(--button-outline-basic-disabled-text-color);box-shadow:unset}:host [nbButton].primary.appearance-filled.status-primary{color:var(--text-primary-color);border:unset;background-color:var(--color-primary-transparent-default);box-shadow:var(--gauzy-shadow)}[dir=ltr] :host ::ng-deep input,[dir=ltr] :host ::ng-deep textarea{text-align:start}[dir=rtl] :host ::ng-deep input,[dir=rtl] :host ::ng-deep textarea{text-align:end}:host ::ng-deep input,:host ::ng-deep nb-select.appearance-outline.status-basic .select-button,:host ::ng-deep .ng-select .ng-select-container{background-color:var(--gauzy-sidebar-background-4)!important;border:none;min-height:calc(var(--select-medium-text-line-height) + .4375rem * 2)!important}:host ::ng-deep .ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-placeholder,:host ::ng-deep .ng-select.ng-select-single .ng-select-container .ng-value-container .ng-input{top:unset!important}:host ::ng-deep label,:host ::ng-deep .label{font-size:var(--text-label-font-size);font-weight:600;line-height:.8125rem;letter-spacing:-.01em;color:var(--gauzy-text-color-2)}:host ::ng-deep textarea{background-color:var(--gauzy-sidebar-background-4)!important;border:none}:host ::ng-deep .ng-select .ng-select-container input,:host ::ng-deep nb-tag-list input{background-color:unset!important}:host nb-card{background-color:var(--gauzy-card-1)}:host nb-card nb-card-header nb-icon.close{cursor:pointer}nb-card{width:645px;background-color:var(--gauzy-card-1)}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }], ctorParameters: () => [{ type: i1.NbDialogRef }, { type: i2.OrganizationProjectsService }, { type: i2.OrganizationContactService }, { type: i2.OrganizationDepartmentsService }, { type: i2.OrganizationTeamsService }, { type: i3.TranslateService }, { type: i2.ToastrService }, { type: i2.Store }], propDecorators: { invitationType: [{
                type: Input
            }], emailInviteForm: [{
                type: ViewChild,
                args: ['emailInviteForm']
            }] } });
//# sourceMappingURL=invite-mutation.component.js.map