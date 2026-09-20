import { __decorate, __metadata } from "tslib";
import { Component, Input } from '@angular/core';
import { Router, UrlSerializer } from '@angular/router';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NbDialogService } from '@nebular/theme';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { debounceTime, filter, tap } from 'rxjs/operators';
import moment from 'moment';
import { ClipboardService } from 'ngx-clipboard';
import { InviteService, ServerDataSource, Store, ToastrService } from '@gauzy/ui-core/core';
import { InvitationTypeEnum, RolesEnum, ComponentLayoutStyleEnum, InvitationExpirationEnum, InviteStatusEnum, PermissionsEnum } from '@gauzy/contracts';
import { API_PREFIX, ComponentEnum, distinctUntilChange } from '@gauzy/ui-core/common';
import { PaginationFilterBaseComponent } from '../../smart-data-layout/pagination/pagination-filter-base.component';
import { DateViewComponent } from '../../table-components';
import { InputFilterComponent, InviteStatusFilterComponent, ToggleFilterComponent } from '../../table-filters';
import { DeleteConfirmationComponent } from '../../user/forms/delete-confirmation/delete-confirmation.component';
import { InviteMutationComponent } from '../invite-mutation/invite-mutation.component';
import { ProjectNamesComponent } from './project-names/project-names.component';
import { ResendConfirmationComponent } from './resend-confirmation/resend-confirmation.component';
import { ClientNamesComponent } from './client-names/client-names.component';
import { DepartmentNamesComponent } from './department-names/department-names.component';
import * as i0 from "@angular/core";
import * as i1 from "@nebular/theme";
import * as i2 from "ngx-clipboard";
import * as i3 from "@angular/router";
import * as i4 from "@angular/common";
import * as i5 from "@gauzy/ui-core/core";
import * as i6 from "@ngx-translate/core";
import * as i7 from "@angular/common/http";
import * as i8 from "ngx-permissions";
import * as i9 from "../../components/back-navigation/back-navigation.component";
import * as i10 from "../../components/header-title/header-title.component";
import * as i11 from "angular2-smart-table";
import * as i12 from "../../gauzy-button-action/gauzy-button-action.component";
import * as i13 from "../../smart-data-layout/pagination/pagination-v2/pagination-v2.component";
import * as i14 from "../../smart-data-layout/smart-table-loading/smart-table-settling.directive";
import * as i15 from "../../smart-data-layout/smart-table-filters/smart-table-filter-toggle.directive";
import * as i16 from "../../card-grid/card-grid.component";
let InvitesComponent = class InvitesComponent extends PaginationFilterBaseComponent {
    get invitationType() {
        return this._invitationType;
    }
    set invitationType(value) {
        this._invitationType = value;
    }
    constructor(dialogService, clipboardService, router, _location, _urlSerializer, store, toastrService, translate, inviteService, httpClient) {
        super(translate);
        this.dialogService = dialogService;
        this.clipboardService = clipboardService;
        this.router = router;
        this._location = _location;
        this._urlSerializer = _urlSerializer;
        this.store = store;
        this.toastrService = toastrService;
        this.translate = translate;
        this.inviteService = inviteService;
        this.httpClient = httpClient;
        this.InviteStatusEnum = InviteStatusEnum;
        this.loading = false;
        this.disableButton = true;
        this.PermissionsEnum = PermissionsEnum;
        this.dataLayoutStyle = ComponentLayoutStyleEnum.TABLE;
        this.componentLayoutStyleEnum = ComponentLayoutStyleEnum;
        this.invites = [];
        this.invites$ = this.subject$;
        this._refresh$ = new Subject();
        this.getSelectedPersonRole = () => {
            if (this.isEmployeeInvitation()) {
                return RolesEnum.EMPLOYEE;
            }
            if (this.isCandidateInvitation()) {
                return RolesEnum.CANDIDATE;
            }
        };
        this.setView();
        /**
         * Destroyed textarea element after each copy to clipboard
         */
        clipboardService.configure({ cleanUpAfterCopy: true });
    }
    ngOnInit() {
        this._loadSmartTableSettings();
        this._applyTranslationOnSmartTable();
    }
    ngAfterViewInit() {
        this.clipboardService.copyResponse$
            .pipe(filter((clipboard) => !!clipboard.isSuccess), tap((clipboard) => this.onCopySuccess(clipboard)))
            .subscribe();
        this.invites$
            .pipe(debounceTime(200), tap(() => this.clearItem()), tap(() => this.getInvites()), untilDestroyed(this))
            .subscribe();
        this.pagination$
            .pipe(debounceTime(100), distinctUntilChange(), tap(() => this.invites$.next(true)), untilDestroyed(this))
            .subscribe();
        this.store.selectedOrganization$
            .pipe(debounceTime(100), distinctUntilChange(), filter((organization) => !!organization), tap((organization) => (this.organization = organization)), tap(() => this._refresh$.next(true)), tap(() => this.invites$.next(true)), untilDestroyed(this))
            .subscribe();
        this._refresh$
            .pipe(filter(() => this.dataLayoutStyle === this.componentLayoutStyleEnum.CARDS_GRID), tap(() => this.refreshPagination()), tap(() => (this.invites = [])), untilDestroyed(this))
            .subscribe();
    }
    ngOnDestroy() { }
    setView() {
        this.viewComponentName = ComponentEnum.MANAGE_INVITES;
        this.store
            .componentLayout$(this.viewComponentName)
            .pipe(distinctUntilChange(), tap(() => this.refreshPagination()), tap((componentLayout) => (this.dataLayoutStyle = componentLayout)), tap(() => (this.invites = [])), tap(() => this.invites$.next(true)), untilDestroyed(this))
            .subscribe();
    }
    selectInvite({ isSelected, data }) {
        this.disableButton = !isSelected;
        this.selectedInvite = isSelected ? data : null;
    }
    invite() {
        this.dialogService
            .open(InviteMutationComponent, {
            context: {
                invitationType: this.invitationType
            }
        })
            .onClose.pipe(filter((invite) => !!invite), tap(() => this._refresh$.next(true)), tap(() => this.invites$.next(true)), untilDestroyed(this))
            .subscribe();
    }
    /**
     * Copies the invite URL to the clipboard.
     * If a specific invite item is provided, it sets it as the selected invite
     * before generating the URL.
     *
     * @param selectedItem - An optional invite item to select before copying the URL.
     */
    async copyToClipboard(selectedItem) {
        // If a selected item is passed, set it as the current invite
        if (selectedItem) {
            this.selectInvite({
                isSelected: true,
                data: selectedItem
            });
        }
        if (!this.selectedInvite) {
            return;
        }
        const { email, token } = this.selectedInvite;
        // Create a URL tree with the invite route and query parameters
        const tree = this.router.createUrlTree(['auth/accept-invite'], { queryParams: { email, token } });
        // Prepare the external URL
        const externalUrl = this._location.prepareExternalUrl(this._urlSerializer.serialize(tree));
        // Prepare the full URL and copy it to the clipboard
        const inviteUrl = [location.origin, externalUrl].join('/');
        // Copy the URL to the clipboard
        this.clipboardService.copy(inviteUrl);
    }
    /**
     * Handles the success event after copying text to the clipboard.
     * Displays a success toast message and clears the selected item.
     *
     * @param clipboard - The clipboard response object containing details of the copy action.
     */
    onCopySuccess(clipboard) {
        try {
            this.toastrService.success('TOASTR.MESSAGE.COPIED');
        }
        finally {
            this.clearItem();
        }
    }
    /**
     * Handles the failure event when copying text to the clipboard.
     * Displays an error toast message and clears the selected item.
     *
     * @param clipboard - The clipboard response object containing details of the failed copy action.
     */
    onCopyFailure(clipboard) { }
    /*
     * Register Smart Table Source Config
     */
    setSmartTableSource() {
        if (!this.organization) {
            return;
        }
        // this.loading = true;
        const { id: organizationId, tenantId } = this.organization;
        // Create a new server data source with the specified endpoint and relations
        this.smartTableSource = new ServerDataSource(this.httpClient, {
            endPoint: `${API_PREFIX}/invite`,
            relations: ['projects', 'invitedByUser', 'role', 'organizationContacts', 'departments'],
            where: {
                organizationId,
                tenantId,
                ...(this.invitationType === InvitationTypeEnum.EMPLOYEE
                    ? {
                        role: [RolesEnum.EMPLOYEE]
                    }
                    : {}),
                ...(this.invitationType === InvitationTypeEnum.CANDIDATE
                    ? {
                        role: [RolesEnum.CANDIDATE]
                    }
                    : {}),
                ...(this.filters.where ? this.filters.where : {})
            },
            resultMap: (invite) => this.transformInvite(invite),
            finalize: () => {
                this.setPagination({
                    ...this.getPagination(),
                    totalItems: this.smartTableSource.count()
                });
                this.loading = false;
            }
        });
    }
    /**
     * Transforms an Invite entity into an object with computed properties.
     *
     * @param invite - The Invite entity to transform.
     * @returns A transformed invite object with additional computed properties.
     */
    transformInvite(invite) {
        return {
            ...invite,
            email: invite.email,
            expireDate: invite.expireDate ? moment(invite.expireDate).fromNow() : InvitationExpirationEnum.NEVER,
            createdDate: invite.createdAt,
            imageUrl: invite.invitedByUser?.imageUrl ?? '',
            fullName: invite.invitedByUser?.name ?? '',
            roleName: invite.role?.name ?? '',
            projectNames: invite.projects?.map((project) => project.name) ?? [],
            clientNames: invite.organizationContacts?.map((contact) => contact.name) ?? [],
            departmentNames: invite.departments?.map((department) => department.name) ?? [],
            id: invite.id,
            token: invite.token
        };
    }
    /***
     * GET invites
     *
     */
    async getInvites() {
        if (!this.organization) {
            return;
        }
        try {
            this.setSmartTableSource();
            const { activePage, itemsPerPage } = this.getPagination();
            this.smartTableSource.setPaging(activePage, itemsPerPage, false);
            if (this.dataLayoutStyle === ComponentLayoutStyleEnum.CARDS_GRID) {
                await this.smartTableSource.getElements();
                await this._loadGridLayoutData();
            }
        }
        catch (error) {
            this.toastrService.danger(error);
        }
    }
    /***
     * GET invites for GRID layout
     *
     */
    async _loadGridLayoutData() {
        this.invites.push(...this.smartTableSource.getData());
    }
    /**
     * Load smart table settings
     */
    _loadSmartTableSettings() {
        const pagination = this.getPagination();
        const settingsSmartTable = {
            actions: false,
            pager: {
                display: false,
                perPage: pagination ? pagination.itemsPerPage : 10
            },
            noDataMessage: this.getTranslation('SM_TABLE.NO_DATA.INVITE'),
            columns: {
                email: {
                    title: this.getTranslation('SM_TABLE.EMAIL'),
                    type: 'email',
                    isFilterable: true,
                    filter: {
                        type: 'custom',
                        component: InputFilterComponent
                    },
                    filterFunction: this._getFilterFunction('email')
                },
                roleName: {
                    title: this.getTranslation('SM_TABLE.ROLE'),
                    type: 'text',
                    isFilterable: false
                },
                projects: {
                    title: this.getTranslation('SM_TABLE.PROJECTS'),
                    type: 'custom',
                    isFilterable: false,
                    renderComponent: ProjectNamesComponent,
                    componentInitFunction: (instance, cell) => {
                        instance.rowData = cell.getRow().getData();
                    }
                },
                contact: {
                    title: this.getTranslation('SM_TABLE.CONTACTS'),
                    type: 'custom',
                    isFilterable: false,
                    renderComponent: ClientNamesComponent,
                    componentInitFunction: (instance, cell) => {
                        instance.rowData = cell.getRow().getData();
                    }
                },
                departments: {
                    title: this.getTranslation('SM_TABLE.DEPARTMENTS'),
                    type: 'custom',
                    isFilterable: false,
                    renderComponent: DepartmentNamesComponent,
                    componentInitFunction: (instance, cell) => {
                        instance.rowData = cell.getRow().getData();
                    }
                },
                fullName: {
                    title: this.getTranslation('SM_TABLE.INVITED_BY'),
                    type: 'text',
                    isFilterable: true,
                    filter: {
                        type: 'custom',
                        component: InputFilterComponent
                    },
                    filterFunction: this._getFilterFunction('invitedByUser')
                },
                createdDate: {
                    title: this.getTranslation('SM_TABLE.CREATED'),
                    type: 'custom',
                    isFilterable: false,
                    renderComponent: DateViewComponent,
                    componentInitFunction: (instance, cell) => {
                        instance.rowData = cell.getRow().getData();
                        instance.value = cell.getValue();
                    }
                },
                expireDate: {
                    title: this.getTranslation('SM_TABLE.EXPIRE_DATE'),
                    type: 'text',
                    class: 'text-center',
                    width: '5%',
                    isFilterable: true,
                    filter: {
                        type: 'custom',
                        component: ToggleFilterComponent
                    },
                    filterFunction: (isExpired) => {
                        this.setFilter({ field: 'isExpired', search: isExpired });
                        return true;
                    }
                },
                status: {
                    title: this.getTranslation('SM_TABLE.STATUS'),
                    type: 'text',
                    isFilterable: true,
                    filter: {
                        type: 'custom',
                        component: InviteStatusFilterComponent
                    },
                    filterFunction: (status) => {
                        this.setFilter({ field: 'status', search: status });
                        return !!status;
                    }
                }
            }
        };
        if (this.invitationType === InvitationTypeEnum.EMPLOYEE) {
            delete settingsSmartTable['columns']['roleName'];
        }
        if (this.invitationType === InvitationTypeEnum.USER) {
            delete settingsSmartTable['columns']['projects'];
            delete settingsSmartTable['columns']['contact'];
            delete settingsSmartTable['columns']['departments'];
        }
        if (this.invitationType === InvitationTypeEnum.CANDIDATE) {
            delete settingsSmartTable['columns']['projects'];
            delete settingsSmartTable['columns']['contact'];
            delete settingsSmartTable['columns']['roleName'];
        }
        this.settingsSmartTable = settingsSmartTable;
    }
    /**
     * Helper function to create a reusable filter function for columns.
     * @param field - The field to filter by.
     */
    _getFilterFunction(field) {
        return (value) => {
            this.setFilter({ field, search: value });
            return value.length > 0;
        };
    }
    async deleteInvite(selectedItem) {
        if (selectedItem) {
            this.selectInvite({
                isSelected: true,
                data: selectedItem
            });
        }
        this.dialogService
            .open(DeleteConfirmationComponent, {
            context: {
                recordType: this.selectedInvite.email + ' ' + this.getTranslation('FORM.DELETE_CONFIRMATION.INVITATION')
            }
        })
            .onClose.pipe(untilDestroyed(this))
            .subscribe(async (result) => {
            if (result) {
                try {
                    if (!this.selectedInvite) {
                        this.toastrService.danger('Invitation is not selected');
                        return;
                    }
                    const { id, email } = this.selectedInvite;
                    await this.inviteService
                        .delete(id)
                        .then(() => {
                        this.toastrService.success('TOASTR.MESSAGE.INVITES_DELETE', {
                            email: email
                        });
                    })
                        .finally(() => {
                        this._refresh$.next(true);
                        this.invites$.next(true);
                    });
                }
                catch (error) {
                    this.toastrService.danger(error.error.message || error.message);
                }
            }
        });
    }
    async resendInvite(selectedItem) {
        if (selectedItem) {
            this.selectInvite({
                isSelected: true,
                data: selectedItem
            });
        }
        if (this.selectedInvite.status !== InviteStatusEnum.INVITED) {
            return;
        }
        this.dialogService
            .open(ResendConfirmationComponent, {
            context: {
                email: this.selectedInvite.email
            }
        })
            .onClose.pipe(untilDestroyed(this))
            .subscribe(async (result) => {
            if (result) {
                try {
                    if (!this.selectedInvite) {
                        this.toastrService.danger('Invitation is not selected');
                        return;
                    }
                    const { id, email, organizationId } = this.selectedInvite;
                    await this.inviteService
                        .resendInvite({
                        inviteId: id,
                        inviteType: this.invitationType,
                        organizationId
                    })
                        .then(() => {
                        this.toastrService.success('TOASTR.MESSAGE.INVITES_RESEND', {
                            email
                        });
                    })
                        .finally(() => {
                        this._refresh$.next(true);
                        this.invites$.next(true);
                    });
                }
                catch (error) {
                    this.toastrService.danger(error);
                }
            }
        });
    }
    isEmployeeInvitation() {
        return this.selectedInvite.roleName === InvitationTypeEnum.EMPLOYEE;
    }
    isCandidateInvitation() {
        return this.selectedInvite.roleName === InvitationTypeEnum.CANDIDATE;
    }
    _applyTranslationOnSmartTable() {
        this.translate.onLangChange
            .pipe(tap(() => this._loadSmartTableSettings()), untilDestroyed(this))
            .subscribe();
    }
    /*
     * Clear selected item
     */
    clearItem() {
        this.selectInvite({
            isSelected: false,
            data: null
        });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: InvitesComponent, deps: [{ token: i1.NbDialogService }, { token: i2.ClipboardService }, { token: i3.Router }, { token: i4.Location }, { token: i3.UrlSerializer }, { token: i5.Store }, { token: i5.ToastrService }, { token: i6.TranslateService }, { token: i5.InviteService }, { token: i7.HttpClient }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: InvitesComponent, isStandalone: false, selector: "ga-invites", inputs: { invitationType: "invitationType" }, usesInheritance: true, ngImport: i0, template: "<nb-card>\n  <nb-card-header class=\"d-flex flex-column pb-0\">\n    <div class=\"header-title-with-back\">\n      <ngx-back-navigation></ngx-back-navigation>\n      <h4>\n        <ngx-header-title [allowEmployee]=\"false\">\n          {{ 'INVITE_PAGE.' + invitationType + '.MANAGE' | translate }}\n        </ngx-header-title>\n      </h4>\n    </div>\n    <div class=\"align-self-end\">\n      <ngx-gauzy-button-action\n        [componentName]=\"viewComponentName\"\n        [isDisable]=\"disableButton\"\n        [buttonTemplate]=\"actionButtons\"\n        [buttonTemplateVisible]=\"visibleButton\"\n      ></ngx-gauzy-button-action>\n    </div>\n  </nb-card-header>\n  <nb-card-body [nbSpinner]=\"loading\" nbSpinnerStatus=\"primary\" nbSpinnerSize=\"large\">\n    <!-- Check if the user has the 'ORG_INVITE_VIEW' permission -->\n    <ng-template [ngxPermissionsOnly]=\"[PermissionsEnum.ALL_ORG_VIEW, PermissionsEnum.ORG_INVITE_VIEW]\">\n      @switch (dataLayoutStyle) {\n        <!-- Table View -->\n        @case (componentLayoutStyleEnum.TABLE) {\n          <div class=\"table-scroll-container\">\n            <angular2-smart-table\n              [class.ga-table-loading]=\"loading\"\n              style=\"cursor: pointer\"\n              [settings]=\"settingsSmartTable\"\n              [source]=\"smartTableSource\"\n              (userRowSelect)=\"selectInvite($event)\"\n            ></angular2-smart-table>\n          </div>\n          <div class=\"pagination-container\">\n            @if (smartTableSource) {\n              <ngx-pagination [source]=\"smartTableSource\"></ngx-pagination>\n            }\n          </div>\n        }\n        <!-- Card Grid View -->\n        @case (componentLayoutStyleEnum.CARDS_GRID) {\n          <ga-card-grid\n            [loading]=\"loading\"\n            [totalItems]=\"pagination?.totalItems\"\n            [settings]=\"settingsSmartTable\"\n            [source]=\"invites\"\n            (onSelectedItem)=\"selectInvite($event)\"\n            (scroll)=\"onScroll()\"\n          ></ga-card-grid>\n        }\n        <!-- Optional: Default case if no specific layout matches -->\n        @default {\n          <p>{{ 'SETTINGS_MENU.NO_LAYOUT' | translate }}</p>\n        }\n      }\n    </ng-template>\n  </nb-card-body>\n</nb-card>\n\n<!-- Actions Buttons -->\n<ng-template #actionButtons let-buttonSize=\"buttonSize\" let-selectedItem=\"selectedItem\">\n  <div class=\"btn-group actions\">\n    <ng-template [ngxPermissionsOnly]=\"[PermissionsEnum.ALL_ORG_EDIT, PermissionsEnum.ORG_INVITE_EDIT]\">\n      @if (selectedInvite?.status === InviteStatusEnum.INVITED) {\n        <button\n          nbButton\n          ngxClipboard\n          [disabled]=\"disableButton\"\n          status=\"basic\"\n          class=\"action success\"\n          (click)=\"copyToClipboard(selectedItem)\"\n          size=\"small\"\n          >\n          <i class=\"fas fa-link mr-1\"></i>\n          {{ 'BUTTONS.COPY_LINK' | translate }}\n        </button>\n        <button\n          nbButton\n          [disabled]=\"disableButton\"\n          status=\"basic\"\n          (click)=\"resendInvite(selectedItem)\"\n          class=\"action warning\"\n          size=\"small\"\n          >\n          <i class=\"fas fa-repeat mr-1\"></i>\n          {{ 'BUTTONS.RESEND' | translate }}\n        </button>\n      }\n      <button\n        nbButton\n        [disabled]=\"disableButton\"\n        status=\"basic\"\n        (click)=\"deleteInvite(selectedItem)\"\n        class=\"action\"\n        size=\"small\"\n        [nbTooltip]=\"'BUTTONS.DELETE' | translate\"\n        >\n        <nb-icon icon=\"trash-2-outline\" status=\"danger\"></nb-icon>\n      </button>\n    </ng-template>\n  </div>\n</ng-template>\n\n<!-- Visible button -->\n<ng-template #visibleButton>\n  <ng-template [ngxPermissionsOnly]=\"[PermissionsEnum.ALL_ORG_EDIT, PermissionsEnum.ORG_INVITE_EDIT]\">\n    <button nbButton type=\"button\" size=\"small\" status=\"success\" class=\"invite-button\" (click)=\"invite()\">\n      <i class=\"fas fa-envelope mr-1\"></i>\n      {{ 'BUTTONS.INVITE' | translate }}\n    </button>\n  </ng-template>\n</ng-template>\n", styles: [".action{box-shadow:inset 0 0 0 1px var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));border:none}.action[nbButton].appearance-filled.status-basic{background-color:var(--gauzy-card-2)}.action.info[nbButton].appearance-filled.status-basic,.action.info-text-1[nbButton].appearance-filled.status-basic{color:var(--gauzy-action-info-text)}.action.secondary{color:var(--text-hint-color)}.action.success{color:var(--gauzy-action-success-text)}.action.warning{color:var(--gauzy-action-warning-text)}.action.orange{color:#ffab2d}.action.primary{color:var(--text-primary-color)}.action.primary.soft[nbButton].appearance-filled.status-basic{background-color:#6e49e81a}.action.select-nb ::ng-deep{box-shadow:none}.action.select-nb ::ng-deep .select-button{box-shadow:inset 0 0 0 1px var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));background:var(--gauzy-card-2)}button{margin:5px}.actions{background:var(--gauzy-card-2);border-radius:var(--button-rectangle-border-radius);padding:2px 4px!important}.gauzy-button-container{display:flex;justify-content:flex-end;width:100%;padding-bottom:0}.card-custom-header{display:flex;flex-direction:column;width:100%;padding-bottom:0}:host ::ng-deep input{border-radius:var(--border-radius);box-shadow:inset 0 0 0 1px var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18))}:host nb-card,:host nb-card-body{background-color:var(--gauzy-card-2);margin:0;display:flex;flex-direction:column}:host nb-card .table-scroll-container,:host nb-card .grid-scroll-container,:host nb-card-body .table-scroll-container,:host nb-card-body .grid-scroll-container{flex:1 1 auto;min-height:0;max-height:unset}:host nb-card-body{border-radius:0 0 var(--border-radius) var(--border-radius)}[dir=ltr] :host nb-card-body{padding:1rem .5rem 1rem 18px}[dir=rtl] :host nb-card-body{padding:1rem 18px 1rem .5rem}:host nb-card,:host nb-card-header{border-radius:var(--border-radius)}:host nb-card{display:flex;flex-flow:column;height:100%;border-radius:var(--border-radius)}:host nb-card nb-card-header{flex:0 1 auto}:host nb-card nb-card-body{flex:1 1 auto;overflow:unset;height:calc(100vh - calc(var(--header-height) + var(--footer-height)) - 13.125rem + 3.75rem)}:host nb-card nb-card-footer{flex:0 1 auto}:host .header-title-with-back{display:flex;align-items:center}[dir=rtl] :host .header-title-with-back{gap:24px}:host .invite-button{display:flex;align-items:center;gap:4px}[dir=rtl] :host ::ng-deep ga-layout-selector{margin:0 20px 0 0}:host{--gauzy-table-font-size: .6875rem;--gauzy-table-line-height: 1rem;--gauzy-table-cell-padding-y: .1875rem;--gauzy-table-cell-padding-x: .4375rem;--gauzy-table-header-font-size: .75rem;--gauzy-table-header-line-height: .8125rem;--gauzy-table-header-padding-y: .3125rem;--gauzy-table-header-padding-x: .4375rem;--gauzy-table-filter-padding-y: .1875rem;--gauzy-table-control-height: 1.5rem;--gauzy-table-badge-height: 1rem;--gauzy-table-badge-radius: .25rem;--gauzy-table-badge-padding-y: .1875rem;--gauzy-table-chip-font-size: .625rem;--gauzy-table-chip-line-height: .75rem;--gauzy-table-chip-padding-y: 0;--gauzy-table-chip-padding-x: .3125rem;--gauzy-table-chip-gap: .125rem;--gauzy-table-chip-block-gap: .5rem;--gauzy-people-avatar-size: 1.25rem;--gauzy-people-font-size: .75rem;--gauzy-people-chip-padding-y: .25rem}:host .table-scroll-container{background:var(--gauzy-card-1, var(--background-basic-color-1));box-shadow:inset 0 0 0 1px var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));border-radius:var(--border-radius, .5rem)}:host ::ng-deep angular2-smart-table tr.angular2-smart-titles>th{border-bottom:1px solid var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));vertical-align:middle}:host ::ng-deep angular2-smart-table tbody tr{background:transparent}:host ::ng-deep angular2-smart-table tbody tr>td{vertical-align:middle}:host ::ng-deep angular2-smart-table tbody tr:hover:not(.selected){background:var(--gauzy-hover-tint, rgba(126, 126, 143, .12))!important}:host ::ng-deep angular2-smart-table tbody tr.selected{background:var(--gauzy-active-tint, rgba(126, 126, 143, .2))!important;box-shadow:none!important}:host ::ng-deep ga-notes-with-tags .tags:has(nb-badge){margin-bottom:.5rem}:host ::ng-deep ga-status-badge .badge-success{color:var(--gauzy-action-success-text, #047857);background-color:var(--gauzy-action-success-tint, rgba(4, 120, 87, .08))}:host ::ng-deep ga-status-badge .badge-warning{color:var(--gauzy-action-warning-text, #b45309);background-color:var(--gauzy-action-warning-tint, rgba(180, 83, 9, .08))}:host ::ng-deep ga-status-badge .badge-danger{color:var(--gauzy-action-danger-text, #dc2626);background-color:var(--gauzy-action-danger-tint, rgba(220, 38, 38, .08))}:host .pagination-container{display:flex;justify-content:flex-end;flex-wrap:wrap;gap:.5rem;margin-top:.25rem}@media(max-width:767px){:host .pagination-container{justify-content:center}}:host .pagination-container ::ng-deep ngx-pagination,:host .pagination-container ::ng-deep ga-pagination{width:auto}:host .pagination-container ::ng-deep ngx-pagination nav,:host .pagination-container ::ng-deep ga-pagination nav{margin-top:0!important;gap:.75rem}:host .pagination-container ::ng-deep ngx-pagination .pagination,:host .pagination-container ::ng-deep ga-pagination .pagination{gap:.125rem;font-size:.75rem}:host .pagination-container ::ng-deep ngx-pagination li a,:host .pagination-container ::ng-deep ngx-pagination li span,:host .pagination-container ::ng-deep ga-pagination li a,:host .pagination-container ::ng-deep ga-pagination li span{margin:0}:host .pagination-container ::ng-deep ngx-pagination li span,:host .pagination-container ::ng-deep ga-pagination li span{display:flex;align-items:center;justify-content:center;min-width:1.75rem;height:1.75rem;padding:0 .375rem;font-size:.75rem;line-height:1;border-radius:var(--gauzy-radius-sm, .375rem)}:host .pagination-container ::ng-deep ngx-pagination li span.icon,:host .pagination-container ::ng-deep ga-pagination li span.icon{padding:0;background:var(--gauzy-hover-tint, rgba(126, 126, 143, .12));box-shadow:none;border-radius:var(--gauzy-radius-sm, .375rem)}:host .pagination-container ::ng-deep ngx-pagination li span.icon nb-icon,:host .pagination-container ::ng-deep ga-pagination li span.icon nb-icon{font-size:.875rem}:host .pagination-container ::ng-deep ngx-pagination li:hover span.icon,:host .pagination-container ::ng-deep ga-pagination li:hover span.icon{background:var(--gauzy-active-tint, rgba(126, 126, 143, .2))}:host .pagination-container ::ng-deep ngx-pagination li.disabled,:host .pagination-container ::ng-deep ga-pagination li.disabled{opacity:.4;pointer-events:none}:host .pagination-container ::ng-deep ngx-pagination li.active span,:host .pagination-container ::ng-deep ga-pagination li.active span{width:auto;min-width:1.75rem;height:1.75rem;padding:0 .375rem!important;border-radius:var(--gauzy-radius-sm, .375rem);line-height:1;background:var(--gauzy-active-tint, rgba(126, 126, 143, .2));color:var(--text-basic-color);font-weight:600}:host .pagination-container ::ng-deep ngx-pagination>nav>div,:host .pagination-container ::ng-deep ga-pagination>nav>div{gap:.5rem;font-size:.75rem;color:var(--gauzy-text-color-2, var(--text-hint-color))}:host .pagination-container ::ng-deep ngx-pagination nb-select .select-button,:host .pagination-container ::ng-deep ga-pagination nb-select .select-button{min-width:4rem;height:1.75rem;padding:0 .5rem;border-radius:var(--gauzy-radius-sm, .375rem);font-size:.75rem}:host nb-card-header{--button-small-icon-size: .875rem;--button-small-icon-offset: .25rem;--button-small-icon-vertical-margin: 0;--button-filled-small-padding: .25rem .625rem;--button-outline-small-padding: .25rem .625rem;--button-ghost-small-padding: .25rem .625rem;--icon-button-filled-small-padding: .25rem;--icon-button-outline-small-padding: .25rem;--icon-button-ghost-small-padding: .25rem}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "component", type: i1.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "component", type: i1.NbCardComponent, selector: "nb-card", inputs: ["size", "status", "accent"] }, { kind: "component", type: i1.NbCardBodyComponent, selector: "nb-card-body" }, { kind: "component", type: i1.NbCardHeaderComponent, selector: "nb-card-header" }, { kind: "component", type: i1.NbIconComponent, selector: "nb-icon", inputs: ["icon", "pack", "options", "status", "config"] }, { kind: "directive", type: i1.NbSpinnerDirective, selector: "[nbSpinner]", inputs: ["nbSpinnerMessage", "nbSpinnerStatus", "nbSpinnerSize", "nbSpinner"] }, { kind: "directive", type: i1.NbTooltipDirective, selector: "[nbTooltip]", inputs: ["nbTooltip", "nbTooltipPlacement", "nbTooltipAdjustment", "nbTooltipClass", "nbTooltipIcon", "nbTooltipStatus", "nbTooltipTrigger", "nbTooltipOffset", "nbTooltipDisabled"], outputs: ["nbTooltipShowStateChange"], exportAs: ["nbTooltip"] }, { kind: "directive", type: i2.ClipboardDirective, selector: "[ngxClipboard]", inputs: ["ngxClipboard", "container", "cbContent", "cbSuccessMsg"], outputs: ["cbOnSuccess", "cbOnError"] }, { kind: "directive", type: i8.NgxPermissionsDirective, selector: "[ngxPermissionsOnly],[ngxPermissionsExcept]", inputs: ["ngxPermissionsOnly", "ngxPermissionsOnlyThen", "ngxPermissionsOnlyElse", "ngxPermissionsExcept", "ngxPermissionsExceptElse", "ngxPermissionsExceptThen", "ngxPermissionsThen", "ngxPermissionsElse", "ngxPermissionsOnlyAuthorisedStrategy", "ngxPermissionsOnlyUnauthorisedStrategy", "ngxPermissionsExceptUnauthorisedStrategy", "ngxPermissionsExceptAuthorisedStrategy", "ngxPermissionsUnauthorisedStrategy", "ngxPermissionsAuthorisedStrategy"], outputs: ["permissionsAuthorized", "permissionsUnauthorized"] }, { kind: "component", type: i9.BackNavigationComponent, selector: "ngx-back-navigation", inputs: ["haveLink"] }, { kind: "component", type: i10.HeaderTitleComponent, selector: "ngx-header-title", inputs: ["allowEmployee", "allowOrganization"] }, { kind: "component", type: i11.Angular2SmartTableComponent, selector: "angular2-smart-table", inputs: ["source", "settings"], outputs: ["rowSelect", "userRowSelect", "delete", "edit", "create", "custom", "deleteConfirm", "editConfirm", "editCancel", "createConfirm", "createCancel", "rowHover", "afterGridInit"] }, { kind: "component", type: i12.GauzyButtonActionComponent, selector: "ngx-gauzy-button-action", inputs: ["isDisable", "hasLayoutSelector", "componentName", "buttonTemplate", "buttonTemplateVisible"] }, { kind: "component", type: i13.PaginationV2Component, selector: "ngx-pagination", inputs: ["source", "perPageSelect"], outputs: ["changePage"] }, { kind: "directive", type: i14.SmartTableSettlingDirective, selector: "angular2-smart-table" }, { kind: "directive", type: i15.SmartTableFilterToggleDirective, selector: "angular2-smart-table" }, { kind: "component", type: i16.CardGridComponent, selector: "ga-card-grid", inputs: ["source", "loading", "skeletonCards", "settings", "totalItems"], outputs: ["onSelectedItem", "scroll"] }, { kind: "pipe", type: i6.TranslatePipe, name: "translate" }] }); }
};
InvitesComponent = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [NbDialogService,
        ClipboardService,
        Router,
        Location,
        UrlSerializer,
        Store,
        ToastrService,
        TranslateService,
        InviteService,
        HttpClient])
], InvitesComponent);
export { InvitesComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: InvitesComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-invites', standalone: false, template: "<nb-card>\n  <nb-card-header class=\"d-flex flex-column pb-0\">\n    <div class=\"header-title-with-back\">\n      <ngx-back-navigation></ngx-back-navigation>\n      <h4>\n        <ngx-header-title [allowEmployee]=\"false\">\n          {{ 'INVITE_PAGE.' + invitationType + '.MANAGE' | translate }}\n        </ngx-header-title>\n      </h4>\n    </div>\n    <div class=\"align-self-end\">\n      <ngx-gauzy-button-action\n        [componentName]=\"viewComponentName\"\n        [isDisable]=\"disableButton\"\n        [buttonTemplate]=\"actionButtons\"\n        [buttonTemplateVisible]=\"visibleButton\"\n      ></ngx-gauzy-button-action>\n    </div>\n  </nb-card-header>\n  <nb-card-body [nbSpinner]=\"loading\" nbSpinnerStatus=\"primary\" nbSpinnerSize=\"large\">\n    <!-- Check if the user has the 'ORG_INVITE_VIEW' permission -->\n    <ng-template [ngxPermissionsOnly]=\"[PermissionsEnum.ALL_ORG_VIEW, PermissionsEnum.ORG_INVITE_VIEW]\">\n      @switch (dataLayoutStyle) {\n        <!-- Table View -->\n        @case (componentLayoutStyleEnum.TABLE) {\n          <div class=\"table-scroll-container\">\n            <angular2-smart-table\n              [class.ga-table-loading]=\"loading\"\n              style=\"cursor: pointer\"\n              [settings]=\"settingsSmartTable\"\n              [source]=\"smartTableSource\"\n              (userRowSelect)=\"selectInvite($event)\"\n            ></angular2-smart-table>\n          </div>\n          <div class=\"pagination-container\">\n            @if (smartTableSource) {\n              <ngx-pagination [source]=\"smartTableSource\"></ngx-pagination>\n            }\n          </div>\n        }\n        <!-- Card Grid View -->\n        @case (componentLayoutStyleEnum.CARDS_GRID) {\n          <ga-card-grid\n            [loading]=\"loading\"\n            [totalItems]=\"pagination?.totalItems\"\n            [settings]=\"settingsSmartTable\"\n            [source]=\"invites\"\n            (onSelectedItem)=\"selectInvite($event)\"\n            (scroll)=\"onScroll()\"\n          ></ga-card-grid>\n        }\n        <!-- Optional: Default case if no specific layout matches -->\n        @default {\n          <p>{{ 'SETTINGS_MENU.NO_LAYOUT' | translate }}</p>\n        }\n      }\n    </ng-template>\n  </nb-card-body>\n</nb-card>\n\n<!-- Actions Buttons -->\n<ng-template #actionButtons let-buttonSize=\"buttonSize\" let-selectedItem=\"selectedItem\">\n  <div class=\"btn-group actions\">\n    <ng-template [ngxPermissionsOnly]=\"[PermissionsEnum.ALL_ORG_EDIT, PermissionsEnum.ORG_INVITE_EDIT]\">\n      @if (selectedInvite?.status === InviteStatusEnum.INVITED) {\n        <button\n          nbButton\n          ngxClipboard\n          [disabled]=\"disableButton\"\n          status=\"basic\"\n          class=\"action success\"\n          (click)=\"copyToClipboard(selectedItem)\"\n          size=\"small\"\n          >\n          <i class=\"fas fa-link mr-1\"></i>\n          {{ 'BUTTONS.COPY_LINK' | translate }}\n        </button>\n        <button\n          nbButton\n          [disabled]=\"disableButton\"\n          status=\"basic\"\n          (click)=\"resendInvite(selectedItem)\"\n          class=\"action warning\"\n          size=\"small\"\n          >\n          <i class=\"fas fa-repeat mr-1\"></i>\n          {{ 'BUTTONS.RESEND' | translate }}\n        </button>\n      }\n      <button\n        nbButton\n        [disabled]=\"disableButton\"\n        status=\"basic\"\n        (click)=\"deleteInvite(selectedItem)\"\n        class=\"action\"\n        size=\"small\"\n        [nbTooltip]=\"'BUTTONS.DELETE' | translate\"\n        >\n        <nb-icon icon=\"trash-2-outline\" status=\"danger\"></nb-icon>\n      </button>\n    </ng-template>\n  </div>\n</ng-template>\n\n<!-- Visible button -->\n<ng-template #visibleButton>\n  <ng-template [ngxPermissionsOnly]=\"[PermissionsEnum.ALL_ORG_EDIT, PermissionsEnum.ORG_INVITE_EDIT]\">\n    <button nbButton type=\"button\" size=\"small\" status=\"success\" class=\"invite-button\" (click)=\"invite()\">\n      <i class=\"fas fa-envelope mr-1\"></i>\n      {{ 'BUTTONS.INVITE' | translate }}\n    </button>\n  </ng-template>\n</ng-template>\n", styles: [".action{box-shadow:inset 0 0 0 1px var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));border:none}.action[nbButton].appearance-filled.status-basic{background-color:var(--gauzy-card-2)}.action.info[nbButton].appearance-filled.status-basic,.action.info-text-1[nbButton].appearance-filled.status-basic{color:var(--gauzy-action-info-text)}.action.secondary{color:var(--text-hint-color)}.action.success{color:var(--gauzy-action-success-text)}.action.warning{color:var(--gauzy-action-warning-text)}.action.orange{color:#ffab2d}.action.primary{color:var(--text-primary-color)}.action.primary.soft[nbButton].appearance-filled.status-basic{background-color:#6e49e81a}.action.select-nb ::ng-deep{box-shadow:none}.action.select-nb ::ng-deep .select-button{box-shadow:inset 0 0 0 1px var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));background:var(--gauzy-card-2)}button{margin:5px}.actions{background:var(--gauzy-card-2);border-radius:var(--button-rectangle-border-radius);padding:2px 4px!important}.gauzy-button-container{display:flex;justify-content:flex-end;width:100%;padding-bottom:0}.card-custom-header{display:flex;flex-direction:column;width:100%;padding-bottom:0}:host ::ng-deep input{border-radius:var(--border-radius);box-shadow:inset 0 0 0 1px var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18))}:host nb-card,:host nb-card-body{background-color:var(--gauzy-card-2);margin:0;display:flex;flex-direction:column}:host nb-card .table-scroll-container,:host nb-card .grid-scroll-container,:host nb-card-body .table-scroll-container,:host nb-card-body .grid-scroll-container{flex:1 1 auto;min-height:0;max-height:unset}:host nb-card-body{border-radius:0 0 var(--border-radius) var(--border-radius)}[dir=ltr] :host nb-card-body{padding:1rem .5rem 1rem 18px}[dir=rtl] :host nb-card-body{padding:1rem 18px 1rem .5rem}:host nb-card,:host nb-card-header{border-radius:var(--border-radius)}:host nb-card{display:flex;flex-flow:column;height:100%;border-radius:var(--border-radius)}:host nb-card nb-card-header{flex:0 1 auto}:host nb-card nb-card-body{flex:1 1 auto;overflow:unset;height:calc(100vh - calc(var(--header-height) + var(--footer-height)) - 13.125rem + 3.75rem)}:host nb-card nb-card-footer{flex:0 1 auto}:host .header-title-with-back{display:flex;align-items:center}[dir=rtl] :host .header-title-with-back{gap:24px}:host .invite-button{display:flex;align-items:center;gap:4px}[dir=rtl] :host ::ng-deep ga-layout-selector{margin:0 20px 0 0}:host{--gauzy-table-font-size: .6875rem;--gauzy-table-line-height: 1rem;--gauzy-table-cell-padding-y: .1875rem;--gauzy-table-cell-padding-x: .4375rem;--gauzy-table-header-font-size: .75rem;--gauzy-table-header-line-height: .8125rem;--gauzy-table-header-padding-y: .3125rem;--gauzy-table-header-padding-x: .4375rem;--gauzy-table-filter-padding-y: .1875rem;--gauzy-table-control-height: 1.5rem;--gauzy-table-badge-height: 1rem;--gauzy-table-badge-radius: .25rem;--gauzy-table-badge-padding-y: .1875rem;--gauzy-table-chip-font-size: .625rem;--gauzy-table-chip-line-height: .75rem;--gauzy-table-chip-padding-y: 0;--gauzy-table-chip-padding-x: .3125rem;--gauzy-table-chip-gap: .125rem;--gauzy-table-chip-block-gap: .5rem;--gauzy-people-avatar-size: 1.25rem;--gauzy-people-font-size: .75rem;--gauzy-people-chip-padding-y: .25rem}:host .table-scroll-container{background:var(--gauzy-card-1, var(--background-basic-color-1));box-shadow:inset 0 0 0 1px var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));border-radius:var(--border-radius, .5rem)}:host ::ng-deep angular2-smart-table tr.angular2-smart-titles>th{border-bottom:1px solid var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));vertical-align:middle}:host ::ng-deep angular2-smart-table tbody tr{background:transparent}:host ::ng-deep angular2-smart-table tbody tr>td{vertical-align:middle}:host ::ng-deep angular2-smart-table tbody tr:hover:not(.selected){background:var(--gauzy-hover-tint, rgba(126, 126, 143, .12))!important}:host ::ng-deep angular2-smart-table tbody tr.selected{background:var(--gauzy-active-tint, rgba(126, 126, 143, .2))!important;box-shadow:none!important}:host ::ng-deep ga-notes-with-tags .tags:has(nb-badge){margin-bottom:.5rem}:host ::ng-deep ga-status-badge .badge-success{color:var(--gauzy-action-success-text, #047857);background-color:var(--gauzy-action-success-tint, rgba(4, 120, 87, .08))}:host ::ng-deep ga-status-badge .badge-warning{color:var(--gauzy-action-warning-text, #b45309);background-color:var(--gauzy-action-warning-tint, rgba(180, 83, 9, .08))}:host ::ng-deep ga-status-badge .badge-danger{color:var(--gauzy-action-danger-text, #dc2626);background-color:var(--gauzy-action-danger-tint, rgba(220, 38, 38, .08))}:host .pagination-container{display:flex;justify-content:flex-end;flex-wrap:wrap;gap:.5rem;margin-top:.25rem}@media(max-width:767px){:host .pagination-container{justify-content:center}}:host .pagination-container ::ng-deep ngx-pagination,:host .pagination-container ::ng-deep ga-pagination{width:auto}:host .pagination-container ::ng-deep ngx-pagination nav,:host .pagination-container ::ng-deep ga-pagination nav{margin-top:0!important;gap:.75rem}:host .pagination-container ::ng-deep ngx-pagination .pagination,:host .pagination-container ::ng-deep ga-pagination .pagination{gap:.125rem;font-size:.75rem}:host .pagination-container ::ng-deep ngx-pagination li a,:host .pagination-container ::ng-deep ngx-pagination li span,:host .pagination-container ::ng-deep ga-pagination li a,:host .pagination-container ::ng-deep ga-pagination li span{margin:0}:host .pagination-container ::ng-deep ngx-pagination li span,:host .pagination-container ::ng-deep ga-pagination li span{display:flex;align-items:center;justify-content:center;min-width:1.75rem;height:1.75rem;padding:0 .375rem;font-size:.75rem;line-height:1;border-radius:var(--gauzy-radius-sm, .375rem)}:host .pagination-container ::ng-deep ngx-pagination li span.icon,:host .pagination-container ::ng-deep ga-pagination li span.icon{padding:0;background:var(--gauzy-hover-tint, rgba(126, 126, 143, .12));box-shadow:none;border-radius:var(--gauzy-radius-sm, .375rem)}:host .pagination-container ::ng-deep ngx-pagination li span.icon nb-icon,:host .pagination-container ::ng-deep ga-pagination li span.icon nb-icon{font-size:.875rem}:host .pagination-container ::ng-deep ngx-pagination li:hover span.icon,:host .pagination-container ::ng-deep ga-pagination li:hover span.icon{background:var(--gauzy-active-tint, rgba(126, 126, 143, .2))}:host .pagination-container ::ng-deep ngx-pagination li.disabled,:host .pagination-container ::ng-deep ga-pagination li.disabled{opacity:.4;pointer-events:none}:host .pagination-container ::ng-deep ngx-pagination li.active span,:host .pagination-container ::ng-deep ga-pagination li.active span{width:auto;min-width:1.75rem;height:1.75rem;padding:0 .375rem!important;border-radius:var(--gauzy-radius-sm, .375rem);line-height:1;background:var(--gauzy-active-tint, rgba(126, 126, 143, .2));color:var(--text-basic-color);font-weight:600}:host .pagination-container ::ng-deep ngx-pagination>nav>div,:host .pagination-container ::ng-deep ga-pagination>nav>div{gap:.5rem;font-size:.75rem;color:var(--gauzy-text-color-2, var(--text-hint-color))}:host .pagination-container ::ng-deep ngx-pagination nb-select .select-button,:host .pagination-container ::ng-deep ga-pagination nb-select .select-button{min-width:4rem;height:1.75rem;padding:0 .5rem;border-radius:var(--gauzy-radius-sm, .375rem);font-size:.75rem}:host nb-card-header{--button-small-icon-size: .875rem;--button-small-icon-offset: .25rem;--button-small-icon-vertical-margin: 0;--button-filled-small-padding: .25rem .625rem;--button-outline-small-padding: .25rem .625rem;--button-ghost-small-padding: .25rem .625rem;--icon-button-filled-small-padding: .25rem;--icon-button-outline-small-padding: .25rem;--icon-button-ghost-small-padding: .25rem}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }], ctorParameters: () => [{ type: i1.NbDialogService }, { type: i2.ClipboardService }, { type: i3.Router }, { type: i4.Location }, { type: i3.UrlSerializer }, { type: i5.Store }, { type: i5.ToastrService }, { type: i6.TranslateService }, { type: i5.InviteService }, { type: i7.HttpClient }], propDecorators: { invitationType: [{
                type: Input
            }] } });
//# sourceMappingURL=invites.component.js.map