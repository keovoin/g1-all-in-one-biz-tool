import { __decorate, __metadata } from "tslib";
import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NbDialogService } from '@nebular/theme';
import { combineLatest, Subject, firstValueFrom, BehaviorSubject, merge } from 'rxjs';
import { debounceTime, filter, tap } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TranslateService } from '@ngx-translate/core';
import { NgxPermissionsService } from 'ngx-permissions';
import { PermissionsEnum } from '@gauzy/contracts';
import { API_PREFIX, distinctUntilChange } from '@gauzy/ui-core/common';
import { ErrorHandlingService, ProposalTemplateService, ServerDataSource, Store, ToastrService } from '@gauzy/ui-core/core';
import { I18nService } from '@gauzy/ui-core/i18n';
import { DeleteConfirmationComponent, EmployeeLinksComponent, Nl2BrPipe, PaginationFilterBaseComponent, TruncatePipe } from '@gauzy/ui-core/shared';
import { ProposalTemplateFormComponent } from '../proposal-template-form/proposal-template-form.component';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
import * as i2 from "@gauzy/ui-core/core";
import * as i3 from "@nebular/theme";
import * as i4 from "@gauzy/ui-core/shared";
import * as i5 from "@angular/common/http";
import * as i6 from "@angular/router";
import * as i7 from "ngx-permissions";
import * as i8 from "@gauzy/ui-core/i18n";
import * as i9 from "@angular/common";
import * as i10 from "angular2-smart-table";
export var ProposalTemplateTabsEnum;
(function (ProposalTemplateTabsEnum) {
    ProposalTemplateTabsEnum["ACTIONS"] = "ACTIONS";
    ProposalTemplateTabsEnum["SEARCH"] = "SEARCH";
})(ProposalTemplateTabsEnum || (ProposalTemplateTabsEnum = {}));
let ProposalTemplateListComponent = class ProposalTemplateListComponent extends PaginationFilterBaseComponent {
    constructor(translateService, _store, _toastrService, _proposalTemplateService, _dialogService, _nl2BrPipe, _truncatePipe, _http, _route, _errorHandlingService, _ngxPermissionsService, _i18nService) {
        super(translateService);
        this._store = _store;
        this._toastrService = _toastrService;
        this._proposalTemplateService = _proposalTemplateService;
        this._dialogService = _dialogService;
        this._nl2BrPipe = _nl2BrPipe;
        this._truncatePipe = _truncatePipe;
        this._http = _http;
        this._route = _route;
        this._errorHandlingService = _errorHandlingService;
        this._ngxPermissionsService = _ngxPermissionsService;
        this._i18nService = _i18nService;
        this.disableButton = true;
        this.loading = false;
        this.proposalTemplateTabsEnum = ProposalTemplateTabsEnum;
        this.templates$ = new Subject();
        this.nbTab$ = new BehaviorSubject(ProposalTemplateTabsEnum.ACTIONS);
        this.viewSections = [];
    }
    ngOnInit() {
        // Apply translation on smart table
        this._applyTranslationOnSmartTable();
        // Load smart table settings
        this._loadSmartTableSettings();
        // Initialize UI permissions
        this.initializeUiPermissions();
        // Initialize UI languages and Update Locale
        this.initializeUiLanguagesAndLocale();
        // Subscribe to changes in the templates$ observable stream
        this.templates$
            .pipe(debounceTime(100), tap(() => this.clearItem()), tap(() => this.getProposalTemplates()), untilDestroyed(this))
            .subscribe();
        this.nbTab$
            .pipe(debounceTime(100), distinctUntilChange(), tap(() => this.templates$.next(true)), untilDestroyed(this))
            .subscribe();
        this.pagination$
            .pipe(debounceTime(100), distinctUntilChange(), tap(() => this.templates$.next(true)), untilDestroyed(this))
            .subscribe();
        const storeOrganization$ = this._store.selectedOrganization$;
        const storeEmployee$ = this._store.selectedEmployee$;
        combineLatest([storeOrganization$, storeEmployee$])
            .pipe(debounceTime(300), distinctUntilChange(), filter(([organization]) => !!organization), tap(([organization, employee]) => {
            this.organization = organization;
            this.selectedEmployee = employee && employee.id ? employee : null;
        }), tap(() => this.refreshPagination()), tap(() => this.templates$.next(true)), untilDestroyed(this))
            .subscribe();
        this._route.queryParamMap
            .pipe(filter((params) => !!params && params.get('openAddDialog') === 'true'), debounceTime(1000), tap(() => this.createProposalTemplate()), untilDestroyed(this))
            .subscribe();
    }
    ngAfterViewInit() {
        if (this._store.user && !this._store.hasPermission(PermissionsEnum.CHANGE_SELECTED_EMPLOYEE)) {
            delete this.smartTableSettings['columns']['employeeId'];
            this.smartTableSettings = Object.assign({}, this.smartTableSettings);
        }
    }
    initializeUiPermissions() {
        const permissions = this._store.userRolePermissions.map(({ permission }) => permission);
        this._ngxPermissionsService.flushPermissions();
        this._ngxPermissionsService.loadPermissions(permissions);
    }
    initializeUiLanguagesAndLocale() {
        const preferredLanguage$ = merge(this._store.preferredLanguage$, this._i18nService.preferredLanguage$).pipe(distinctUntilChange(), filter((lang) => !!lang), tap((lang) => {
            this.translateService.use(lang);
        }), untilDestroyed(this));
        preferredLanguage$.subscribe();
    }
    setSmartTableSource() {
        if (!this.organization)
            return;
        this.loading = true;
        const { id: organizationId, tenantId } = this.organization;
        this.smartTableSource = new ServerDataSource(this._http, {
            endPoint: `${API_PREFIX}/employee-proposal-template/pagination`,
            relations: ['employee', 'employee.user'],
            where: {
                organizationId,
                tenantId,
                ...(this.selectedEmployee ? { employeeId: this.selectedEmployee.id } : {}),
                ...(this.filters.where ? this.filters.where : {})
            },
            finalize: () => {
                this.setPagination({
                    ...this.getPagination(),
                    totalItems: this.smartTableSource.count()
                });
                this.loading = false;
            }
        });
    }
    async getProposalTemplates() {
        if (!this.organization)
            return;
        try {
            this.setSmartTableSource();
            const { activePage, itemsPerPage } = this.getPagination();
            this.smartTableSource.setPaging(activePage, itemsPerPage, false);
        }
        catch (error) {
            console.log('Error while retrieving proposal templates', error);
            this._errorHandlingService.handleError(error);
        }
    }
    selectProposalTemplate({ isSelected, data }) {
        this.disableButton = !isSelected;
        this.selectedItem = isSelected ? data : null;
    }
    /**
     * Opens the read-only View of a proposal template in the right-side drawer.
     *
     * @param selectedItem - Row the action was invoked from, when it came from the grid.
     */
    viewProposalTemplate(selectedItem) {
        if (selectedItem) {
            this.selectProposalTemplate({ isSelected: true, data: selectedItem });
        }
        const template = selectedItem ?? this.selectedItem;
        if (!template) {
            return;
        }
        this.viewSections = this.buildViewSections();
        this.viewedTemplate = template;
    }
    closeView() {
        this.viewedTemplate = null;
    }
    /**
     * Field descriptor for the drawer — the grid columns, read vertically, plus
     * the full template body the grid truncates.
     */
    buildViewSections() {
        return [
            {
                fields: [
                    { label: 'PROPOSAL_TEMPLATE.EMPLOYEE', key: 'employee', type: 'person' },
                    { label: 'PROPOSAL_TEMPLATE.NAME', key: 'name' },
                    { label: 'PROPOSAL_TEMPLATE.IS_DEFAULT', key: 'isDefault', type: 'boolean' }
                ]
            },
            {
                fields: [{ label: 'PROPOSAL_TEMPLATE.DESCRIPTION', key: 'content', type: 'html', wide: true }]
            }
        ];
    }
    _loadSmartTableSettings() {
        const pagination = this.getPagination();
        this.smartTableSettings = {
            actions: false,
            editable: true,
            hideSubHeader: true,
            selectedRowIndex: -1,
            noDataMessage: this.getTranslation('SM_TABLE.NO_DATA.PROPOSAL_TEMPLATE'),
            pager: {
                display: false,
                perPage: pagination ? pagination.itemsPerPage : 10
            },
            columns: {
                employee: {
                    title: this.getTranslation('PROPOSAL_TEMPLATE.EMPLOYEE'),
                    isFilterable: false,
                    width: '20%',
                    type: 'custom',
                    isSortable: false,
                    renderComponent: EmployeeLinksComponent,
                    valuePrepareFunction: (value) => ({
                        id: value?.id,
                        name: value?.user?.name,
                        fullName: value?.fullName,
                        imageUrl: value?.user?.imageUrl
                    }),
                    componentInitFunction: (instance, cell) => {
                        instance.value = cell.getValue();
                    }
                },
                name: {
                    title: this.getTranslation('PROPOSAL_TEMPLATE.NAME'),
                    type: 'text',
                    width: '30%',
                    isFilterable: false,
                    isSortable: false,
                    valuePrepareFunction: (value) => value.slice(0, 150)
                },
                content: {
                    title: this.getTranslation('PROPOSAL_TEMPLATE.DESCRIPTION'),
                    type: 'html',
                    width: '40%',
                    isFilterable: false,
                    isSortable: false,
                    valuePrepareFunction: (value) => {
                        return value ? this._truncatePipe.transform(this._nl2BrPipe.transform(value), 500) : '';
                    }
                },
                isDefault: {
                    title: this.getTranslation('PROPOSAL_TEMPLATE.IS_DEFAULT'),
                    type: 'text',
                    width: '10%',
                    isFilterable: false,
                    isSortable: false,
                    valuePrepareFunction: (value) => {
                        return value
                            ? this.getTranslation('PROPOSAL_TEMPLATE.YES')
                            : this.getTranslation('PROPOSAL_TEMPLATE.NO');
                    }
                }
            }
        };
    }
    async createProposalTemplate() {
        const dialog = this._dialogService.open(ProposalTemplateFormComponent, {
            context: { selectedEmployee: this.selectedEmployee }
        });
        const data = await firstValueFrom(dialog.onClose);
        if (data) {
            this.templates$.next(true);
        }
    }
    async editProposalTemplate() {
        const dialog = this._dialogService.open(ProposalTemplateFormComponent, {
            context: {
                proposalTemplate: this.selectedItem,
                selectedEmployee: this.selectedEmployee
            }
        });
        const data = await firstValueFrom(dialog.onClose);
        if (data) {
            this.templates$.next(true);
        }
    }
    deleteProposalTemplate(selectedItem) {
        if (selectedItem) {
            this.selectProposalTemplate({
                isSelected: true,
                data: selectedItem
            });
        }
        const dialogRef = this._dialogService.open(DeleteConfirmationComponent, {
            context: { recordType: 'Proposal' }
        });
        dialogRef.onClose.pipe(untilDestroyed(this)).subscribe(async (dialogResult) => {
            try {
                if (dialogResult) {
                    if (!this.selectedItem)
                        return;
                    const { id: proposalTemplateId, name } = this.selectedItem;
                    await this._proposalTemplateService.delete(proposalTemplateId);
                    this._toastrService.success('PROPOSAL_TEMPLATE.PROPOSAL_DELETE_MESSAGE', { name });
                }
            }
            catch (error) {
                this._errorHandlingService.handleError(error);
            }
            finally {
                this.templates$.next(true);
            }
        });
    }
    async makeDefaultTemplate(input) {
        try {
            if (!this.selectedItem)
                return;
            const { id: proposalTemplateId, organizationId, tenantId } = this.selectedItem;
            const result = await this._proposalTemplateService.makeDefault(proposalTemplateId, {
                isDefault: input.isDefault,
                organizationId,
                tenantId
            });
            const successMessage = result.isDefault
                ? 'PROPOSAL_TEMPLATE.PROPOSAL_MAKE_DEFAULT_MESSAGE'
                : 'PROPOSAL_TEMPLATE.PROPOSAL_REMOVE_DEFAULT_MESSAGE';
            this._toastrService.success(successMessage, { name: this.selectedItem.name });
        }
        catch (error) {
            this._errorHandlingService.handleError(error);
        }
        finally {
            this.templates$.next(true);
        }
    }
    clearItem() {
        // The list is about to be reloaded, so whatever the drawer is showing is
        // about to go stale — close it rather than leave a detached record open.
        this.closeView();
        this.selectProposalTemplate({ isSelected: false, data: null });
    }
    _applyTranslationOnSmartTable() {
        this.translateService.onLangChange
            .pipe(tap(() => this._loadSmartTableSettings()), untilDestroyed(this))
            .subscribe();
    }
    onTabChange(tab) {
        this.nbTab$.next(tab.tabId);
    }
    ngOnDestroy() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ProposalTemplateListComponent, deps: [{ token: i1.TranslateService }, { token: i2.Store }, { token: i2.ToastrService }, { token: i2.ProposalTemplateService }, { token: i3.NbDialogService }, { token: i4.Nl2BrPipe }, { token: i4.TruncatePipe }, { token: i5.HttpClient }, { token: i6.ActivatedRoute }, { token: i2.ErrorHandlingService }, { token: i7.NgxPermissionsService }, { token: i8.I18nService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: ProposalTemplateListComponent, isStandalone: false, selector: "ga-proposal-template-list", viewQueries: [{ propertyName: "actionButtons", first: true, predicate: ["actionButtons"], descendants: true, static: true }, { propertyName: "visibleButton", first: true, predicate: ["visibleButton"], descendants: true, static: true }], usesInheritance: true, ngImport: i0, template: "<nb-card [nbSpinner]=\"loading\" nbSpinnerStatus=\"primary\" nbSpinnerSize=\"large\">\n\t<nb-card-header class=\"card-header-title\">\n\t\t<div class=\"card-header-title\">\n\t\t\t<ngx-back-navigation></ngx-back-navigation>\n\t\t\t<h4>\n\t\t\t\t<ngx-header-title>\n\t\t\t\t\t{{ 'PROPOSAL_TEMPLATE.PROPOSAL_TEMPLATE' | translate }}\n\t\t\t\t</ngx-header-title>\n\t\t\t</h4>\n\t\t</div>\n\t</nb-card-header>\n\t<nb-card-body class=\"p-0\">\n\t\t<div class=\"gauzy-button-container\">\n\t\t\t<ngx-gauzy-button-action\n\t\t\t\t[hasLayoutSelector]=\"false\"\n\t\t\t\t[buttonTemplateVisible]=\"visibleButton\"\n\t\t\t\t[buttonTemplate]=\"actionButtons\"\n\t\t\t\t[isDisable]=\"!selectedItem && disableButton\"\n\t\t\t></ngx-gauzy-button-action>\n\t\t</div>\n\t\t<nb-tabset (changeTab)=\"onTabChange($event)\">\n\t\t\t<nb-tab [tabTitle]=\"'PROPOSAL_TEMPLATE.BROWSE' | translate\" [tabId]=\"proposalTemplateTabsEnum.ACTIONS\">\n\t\t\t\t@if ((nbTab$ | async) === proposalTemplateTabsEnum.ACTIONS) {\n\t\t\t\t\t<ng-template [ngTemplateOutlet]=\"tableLayout\"></ng-template>\n\t\t\t\t}\n\t\t\t</nb-tab>\n\t\t\t<nb-tab [tabTitle]=\"'PROPOSAL_TEMPLATE.SEARCH' | translate\" [tabId]=\"proposalTemplateTabsEnum.SEARCH\">\n\t\t\t\t@if ((nbTab$ | async) === proposalTemplateTabsEnum.SEARCH) {\n\t\t\t\t\t<ng-template [ngTemplateOutlet]=\"tableLayout\"></ng-template>\n\t\t\t\t}\n\t\t\t</nb-tab>\n\t\t</nb-tabset>\n\t</nb-card-body>\n</nb-card>\n\n<!-- Actions Buttons -->\n<ng-template #actionButtons let-buttonSize=\"buttonSize\">\n\t<div class=\"btn-group actions\">\n\t\t<ng-template ngxPermissionsOnly=\"ORG_PROPOSAL_TEMPLATES_VIEW\">\n\t\t\t<button\n\t\t\t\tnbButton\n\t\t\t\tstatus=\"basic\"\n\t\t\t\t(click)=\"viewProposalTemplate()\"\n\t\t\t\t[disabled]=\"!selectedItem && disableButton\"\n\t\t\t\tclass=\"mr-2\"\n\t\t\t\tclass=\"action secondary\"\n\t\t\t\tsize=\"small\"\n\t\t\t>\n\t\t\t\t<nb-icon class=\"mr-1\" icon=\"eye-outline\"></nb-icon>\n\t\t\t\t{{ 'BUTTONS.VIEW' | translate }}\n\t\t\t</button>\n\t\t</ng-template>\n\t\t<ng-template ngxPermissionsOnly=\"ORG_PROPOSAL_TEMPLATES_EDIT\">\n\t\t\t<button\n\t\t\t\tnbButton\n\t\t\t\tstatus=\"basic\"\n\t\t\t\t(click)=\"editProposalTemplate()\"\n\t\t\t\t[disabled]=\"!selectedItem && disableButton\"\n\t\t\t\tclass=\"mr-2\"\n\t\t\t\tclass=\"action primary\"\n\t\t\t\tsize=\"small\"\n\t\t\t>\n\t\t\t\t<nb-icon class=\"mr-1\" icon=\"edit-outline\"></nb-icon>\n\t\t\t\t{{ 'BUTTONS.EDIT' | translate }}\n\t\t\t</button>\n\t\t\t<button\n\t\t\t\tnbButton\n\t\t\t\tstatus=\"basic\"\n\t\t\t\tsize=\"small\"\n\t\t\t\tngxConfirmDialog\n\t\t\t\t[message]=\"'PROPOSAL_TEMPLATE.CONFIRM_DELETE' | translate\"\n\t\t\t\t(confirm)=\"deleteProposalTemplate()\"\n\t\t\t\t[disabled]=\"!selectedItem && disableButton\"\n\t\t\t\tclass=\"action mr-2\"\n\t\t\t\t[nbTooltip]=\"'BUTTONS.DELETE' | translate\"\n\t\t\t>\n\t\t\t\t<nb-icon status=\"danger\" icon=\"trash-2-outline\"> </nb-icon>\n\t\t\t</button>\n\t\t\t@if (selectedItem?.isDefault) {\n\t\t\t\t<button\n\t\t\t\t\tnbButton\n\t\t\t\t\tstatus=\"basic\"\n\t\t\t\t\t(click)=\"makeDefaultTemplate({ isDefault: false })\"\n\t\t\t\t\tclass=\"mr-2\"\n\t\t\t\t\tclass=\"action primary\"\n\t\t\t\t\tsize=\"small\"\n\t\t\t\t>\n\t\t\t\t\t{{ 'BUTTONS.REMOVE_DEFAULT' | translate }}\n\t\t\t\t</button>\n\t\t\t} @else {\n\t\t\t\t<button\n\t\t\t\t\tnbButton\n\t\t\t\t\tstatus=\"basic\"\n\t\t\t\t\t(click)=\"makeDefaultTemplate({ isDefault: true })\"\n\t\t\t\t\tclass=\"mr-2\"\n\t\t\t\t\tclass=\"action primary\"\n\t\t\t\t\tsize=\"small\"\n\t\t\t\t>\n\t\t\t\t\t{{ 'BUTTONS.MAKE_DEFAULT' | translate }}\n\t\t\t\t</button>\n\t\t\t}\n\t\t</ng-template>\n\t</div>\n</ng-template>\n\n<!-- Buttons -->\n<ng-template #visibleButton>\n\t<ng-template ngxPermissionsOnly=\"ORG_PROPOSAL_TEMPLATES_EDIT\">\n\t\t<button nbButton status=\"success\" size=\"small\" (click)=\"createProposalTemplate()\">\n\t\t\t<nb-icon class=\"mr-1\" icon=\"plus-outline\"></nb-icon>\n\t\t\t{{ 'BUTTONS.ADD' | translate }}\n\t\t</button>\n\t</ng-template>\n</ng-template>\n\n<!-- Smart Table -->\n<ng-template #tableLayout>\n\t<ng-template ngxPermissionsOnly=\"ORG_PROPOSAL_TEMPLATES_VIEW\">\n\t\t<div class=\"table-scroll-container\">\n\t\t\t<angular2-smart-table\n\t\t\t\t[class.ga-table-loading]=\"loading\"\n\t\t\t\tstyle=\"cursor: pointer\"\n\t\t\t\t[settings]=\"smartTableSettings\"\n\t\t\t\t[source]=\"smartTableSource\"\n\t\t\t\t(userRowSelect)=\"selectProposalTemplate($event)\"\n\t\t\t></angular2-smart-table>\n\t\t</div>\n\t\t<div class=\"pagination-container\">\n\t\t\t@if (smartTableSource) {\n\t\t\t\t<ngx-pagination [source]=\"smartTableSource\"></ngx-pagination>\n\t\t\t}\n\t\t</div>\n\t</ng-template>\n</ng-template>\n\n<!-- Read-only View. The projected content is gated here (not inside the drawer)\n     so the record renderer is built fresh for each entry that is opened. -->\n<ngx-record-view-drawer\n\t[open]=\"!!viewedTemplate\"\n\theading=\"PROPOSAL_TEMPLATE.PROPOSAL_TEMPLATE\"\n\t[subtitle]=\"viewedTemplate?.name\"\n\t(closed)=\"closeView()\"\n>\n\t@if (viewedTemplate) {\n\t\t<ngx-record-view [record]=\"viewedTemplate\" [sections]=\"viewSections\"></ngx-record-view>\n\t}\n</ngx-record-view-drawer>\n", styles: [".action{box-shadow:inset 0 0 0 1px var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));border:none}.action[nbButton].appearance-filled.status-basic{background-color:var(--gauzy-card-2)}.action.info[nbButton].appearance-filled.status-basic,.action.info-text-1[nbButton].appearance-filled.status-basic{color:var(--gauzy-action-info-text)}.action.secondary{color:var(--text-hint-color)}.action.success{color:var(--gauzy-action-success-text)}.action.warning{color:var(--gauzy-action-warning-text)}.action.orange{color:#ffab2d}.action.primary{color:var(--text-primary-color)}.action.primary.soft[nbButton].appearance-filled.status-basic{background-color:#6e49e81a}.action.select-nb ::ng-deep{box-shadow:none}.action.select-nb ::ng-deep .select-button{box-shadow:inset 0 0 0 1px var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));background:var(--gauzy-card-2)}button{margin:5px}.actions{background:var(--gauzy-card-2);border-radius:var(--button-rectangle-border-radius);padding:2px 4px!important}.gauzy-button-container{display:flex;justify-content:flex-end;width:100%;padding-bottom:0}.card-custom-header{display:flex;flex-direction:column;width:100%;padding-bottom:0}:host ::ng-deep input{border-radius:var(--border-radius);box-shadow:inset 0 0 0 1px var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18))}:host{--gauzy-table-font-size: .6875rem;--gauzy-table-line-height: 1rem;--gauzy-table-cell-padding-y: .1875rem;--gauzy-table-cell-padding-x: .4375rem;--gauzy-table-header-font-size: .75rem;--gauzy-table-header-line-height: .8125rem;--gauzy-table-header-padding-y: .3125rem;--gauzy-table-header-padding-x: .4375rem;--gauzy-table-filter-padding-y: .1875rem;--gauzy-table-control-height: 1.5rem;--gauzy-table-badge-height: 1rem;--gauzy-table-badge-radius: .25rem;--gauzy-table-badge-padding-y: .1875rem;--gauzy-table-chip-font-size: .625rem;--gauzy-table-chip-line-height: .75rem;--gauzy-table-chip-padding-y: 0;--gauzy-table-chip-padding-x: .3125rem;--gauzy-table-chip-gap: .125rem;--gauzy-table-chip-block-gap: .5rem;--gauzy-people-avatar-size: 1.25rem;--gauzy-people-font-size: .75rem;--gauzy-people-chip-padding-y: .25rem;height:100%}:host nb-card{height:100%;background-color:var(--gauzy-card-2)}:host nb-card-body{display:flex;flex-direction:column;height:calc(100vh - 13.5rem)!important;overflow:unset;background-color:unset}:host nb-tabset{display:flex;flex-direction:column;height:100%}:host nb-tabset nb-tab.content-active{flex:1 1 auto;height:auto;min-height:0}:host nb-tabset{flex:1 1 auto;min-height:0}:host nb-tabset nb-tab.content-active{display:flex;flex-direction:column;overflow:unset;border-radius:0 0 var(--border-radius) var(--border-radius);background-color:var(--gauzy-card-2)}[dir=ltr] :host nb-tabset nb-tab.content-active{padding:1rem .5rem 1rem 18px}[dir=rtl] :host nb-tabset nb-tab.content-active{padding:1rem 18px 1rem .5rem}:host .gauzy-button-container{--button-small-icon-size: .875rem;--button-small-icon-offset: .25rem;--button-small-icon-vertical-margin: 0;--button-filled-small-padding: .25rem .625rem;--button-outline-small-padding: .25rem .625rem;--button-ghost-small-padding: .25rem .625rem;--icon-button-filled-small-padding: .25rem;--icon-button-outline-small-padding: .25rem;--icon-button-ghost-small-padding: .25rem;position:absolute;top:0}[dir=ltr] :host .gauzy-button-container{right:18px}[dir=rtl] :host .gauzy-button-container{left:18px}:host .gauzy-button-container{box-sizing:content-box;padding:var(--tabset-tab-padding);padding-inline:0;height:var(--tabset-tab-text-line-height)}@media only screen and (max-width:1532px){:host .gauzy-button-container{padding-block:1.1428571429rem;padding-inline:0}}:host .gauzy-button-container{display:flex;align-items:center;justify-content:flex-end;pointer-events:none}:host .gauzy-button-container>*{pointer-events:auto}:host .gauzy-button-container ::ng-deep .actions-container{padding:0}:host .gauzy-button-container ::ng-deep .actions-container button{margin-block:0}:host ::ng-deep nb-tabset .tab-link{--tabset-tab-text-font-size: var(--gauzy-table-header-font-size, .75rem)}:host .table-scroll-container{background:var(--gauzy-card-1, var(--background-basic-color-1));box-shadow:inset 0 0 0 1px var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));border-radius:var(--border-radius, .5rem);flex:1 1 auto;min-height:0;max-height:unset}:host .pagination-container{display:flex;justify-content:flex-end;flex-wrap:wrap;gap:.5rem;margin-top:.25rem}@media(max-width:767px){:host .pagination-container{justify-content:center}}:host .pagination-container ::ng-deep ngx-pagination{width:auto}:host .pagination-container ::ng-deep ngx-pagination nav{margin-top:0!important;gap:.75rem}:host .pagination-container ::ng-deep ngx-pagination .pagination{gap:.125rem;font-size:.75rem}:host .pagination-container ::ng-deep ngx-pagination li a,:host .pagination-container ::ng-deep ngx-pagination li span{margin:0}:host .pagination-container ::ng-deep ngx-pagination li span{display:flex;align-items:center;justify-content:center;min-width:1.75rem;height:1.75rem;padding:0 .375rem;font-size:.75rem;line-height:1;border-radius:var(--gauzy-radius-sm, .375rem)}:host .pagination-container ::ng-deep ngx-pagination li span.icon{padding:0;background:var(--gauzy-hover-tint, rgba(126, 126, 143, .12));box-shadow:none;border-radius:var(--gauzy-radius-sm, .375rem)}:host .pagination-container ::ng-deep ngx-pagination li span.icon nb-icon{font-size:.875rem}:host .pagination-container ::ng-deep ngx-pagination li:hover span.icon{background:var(--gauzy-active-tint, rgba(126, 126, 143, .2))}:host .pagination-container ::ng-deep ngx-pagination li.disabled{opacity:.4;pointer-events:none}:host .pagination-container ::ng-deep ngx-pagination li.active span{width:auto;min-width:1.75rem;height:1.75rem;padding:0 .375rem!important;border-radius:var(--gauzy-radius-sm, .375rem);line-height:1;background:var(--gauzy-active-tint, rgba(126, 126, 143, .2));color:var(--text-basic-color);font-weight:600}:host .pagination-container ::ng-deep ngx-pagination>nav>div{gap:.5rem;font-size:.75rem;color:var(--gauzy-text-color-2, var(--text-hint-color))}:host .pagination-container ::ng-deep ngx-pagination nb-select .select-button{min-width:4rem;height:1.75rem;padding:0 .5rem;border-radius:var(--gauzy-radius-sm, .375rem);font-size:.75rem}:host .table-scroll-container ::ng-deep angular2-smart-table tr.angular2-smart-titles>th{border-bottom:1px solid var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));vertical-align:middle}:host .table-scroll-container ::ng-deep angular2-smart-table tbody tr{background:transparent}:host .table-scroll-container ::ng-deep angular2-smart-table tbody tr>td{vertical-align:middle}:host .table-scroll-container ::ng-deep angular2-smart-table tbody tr:hover:not(.selected){background:var(--gauzy-hover-tint, rgba(126, 126, 143, .12))!important}:host .table-scroll-container ::ng-deep angular2-smart-table tbody tr.selected{background:var(--gauzy-active-tint, rgba(126, 126, 143, .2))!important;box-shadow:none!important}:host ::ng-deep ngx-avatar .inner-wrapper{background-color:var(--color-primary-transparent-100);border-radius:var(--button-rectangle-border-radius);padding:3px 9px 3px 3px;display:flex;flex-direction:row;align-items:center;width:fit-content}:host ::ng-deep ngx-avatar .inner-wrapper .image-container{height:20px;width:20px;display:flex;align-items:center;justify-content:center}:host ::ng-deep ngx-avatar .inner-wrapper .image-container img[type=user]{height:18px;width:18px}:host ::ng-deep ngx-avatar .inner-wrapper .link-text{color:var(--text-primary-color);font-weight:400}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "component", type: i3.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "component", type: i3.NbCardComponent, selector: "nb-card", inputs: ["size", "status", "accent"] }, { kind: "component", type: i3.NbCardBodyComponent, selector: "nb-card-body" }, { kind: "component", type: i3.NbCardHeaderComponent, selector: "nb-card-header" }, { kind: "component", type: i3.NbIconComponent, selector: "nb-icon", inputs: ["icon", "pack", "options", "status", "config"] }, { kind: "directive", type: i3.NbSpinnerDirective, selector: "[nbSpinner]", inputs: ["nbSpinnerMessage", "nbSpinnerStatus", "nbSpinnerSize", "nbSpinner"] }, { kind: "component", type: i3.NbTabsetComponent, selector: "nb-tabset", inputs: ["fullWidth", "routeParam"], outputs: ["changeTab"] }, { kind: "component", type: i3.NbTabComponent, selector: "nb-tab", inputs: ["tabTitle", "tabId", "badgeDot", "tabIcon", "disabled", "responsive", "route", "active", "lazyLoad", "badgeText", "badgeStatus", "badgePosition"] }, { kind: "directive", type: i3.NbTooltipDirective, selector: "[nbTooltip]", inputs: ["nbTooltip", "nbTooltipPlacement", "nbTooltipAdjustment", "nbTooltipClass", "nbTooltipIcon", "nbTooltipStatus", "nbTooltipTrigger", "nbTooltipOffset", "nbTooltipDisabled"], outputs: ["nbTooltipShowStateChange"], exportAs: ["nbTooltip"] }, { kind: "directive", type: i9.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: i7.NgxPermissionsDirective, selector: "[ngxPermissionsOnly],[ngxPermissionsExcept]", inputs: ["ngxPermissionsOnly", "ngxPermissionsOnlyThen", "ngxPermissionsOnlyElse", "ngxPermissionsExcept", "ngxPermissionsExceptElse", "ngxPermissionsExceptThen", "ngxPermissionsThen", "ngxPermissionsElse", "ngxPermissionsOnlyAuthorisedStrategy", "ngxPermissionsOnlyUnauthorisedStrategy", "ngxPermissionsExceptUnauthorisedStrategy", "ngxPermissionsExceptAuthorisedStrategy", "ngxPermissionsUnauthorisedStrategy", "ngxPermissionsAuthorisedStrategy"], outputs: ["permissionsAuthorized", "permissionsUnauthorized"] }, { kind: "component", type: i4.BackNavigationComponent, selector: "ngx-back-navigation", inputs: ["haveLink"] }, { kind: "component", type: i4.HeaderTitleComponent, selector: "ngx-header-title", inputs: ["allowEmployee", "allowOrganization"] }, { kind: "component", type: i10.Angular2SmartTableComponent, selector: "angular2-smart-table", inputs: ["source", "settings"], outputs: ["rowSelect", "userRowSelect", "delete", "edit", "create", "custom", "deleteConfirm", "editConfirm", "editCancel", "createConfirm", "createCancel", "rowHover", "afterGridInit"] }, { kind: "component", type: i4.GauzyButtonActionComponent, selector: "ngx-gauzy-button-action", inputs: ["isDisable", "hasLayoutSelector", "componentName", "buttonTemplate", "buttonTemplateVisible"] }, { kind: "component", type: i4.PaginationV2Component, selector: "ngx-pagination", inputs: ["source", "perPageSelect"], outputs: ["changePage"] }, { kind: "directive", type: i4.SmartTableSettlingDirective, selector: "angular2-smart-table" }, { kind: "directive", type: i4.SmartTableFilterToggleDirective, selector: "angular2-smart-table" }, { kind: "directive", type: i4.ConfirmDirective, selector: "[ngxConfirmDialog]", inputs: ["message", "title", "yesText", "noText"], outputs: ["confirm", "decline"] }, { kind: "component", type: i4.RecordViewComponent, selector: "ngx-record-view", inputs: ["record", "sections", "placeholder"] }, { kind: "component", type: i4.RecordViewDrawerComponent, selector: "ngx-record-view-drawer", inputs: ["open", "heading", "subtitle"], outputs: ["closed"] }, { kind: "pipe", type: i1.TranslatePipe, name: "translate" }, { kind: "pipe", type: i9.AsyncPipe, name: "async" }] }); }
};
ProposalTemplateListComponent = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [TranslateService,
        Store,
        ToastrService,
        ProposalTemplateService,
        NbDialogService,
        Nl2BrPipe,
        TruncatePipe,
        HttpClient,
        ActivatedRoute,
        ErrorHandlingService,
        NgxPermissionsService,
        I18nService])
], ProposalTemplateListComponent);
export { ProposalTemplateListComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ProposalTemplateListComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-proposal-template-list', standalone: false, template: "<nb-card [nbSpinner]=\"loading\" nbSpinnerStatus=\"primary\" nbSpinnerSize=\"large\">\n\t<nb-card-header class=\"card-header-title\">\n\t\t<div class=\"card-header-title\">\n\t\t\t<ngx-back-navigation></ngx-back-navigation>\n\t\t\t<h4>\n\t\t\t\t<ngx-header-title>\n\t\t\t\t\t{{ 'PROPOSAL_TEMPLATE.PROPOSAL_TEMPLATE' | translate }}\n\t\t\t\t</ngx-header-title>\n\t\t\t</h4>\n\t\t</div>\n\t</nb-card-header>\n\t<nb-card-body class=\"p-0\">\n\t\t<div class=\"gauzy-button-container\">\n\t\t\t<ngx-gauzy-button-action\n\t\t\t\t[hasLayoutSelector]=\"false\"\n\t\t\t\t[buttonTemplateVisible]=\"visibleButton\"\n\t\t\t\t[buttonTemplate]=\"actionButtons\"\n\t\t\t\t[isDisable]=\"!selectedItem && disableButton\"\n\t\t\t></ngx-gauzy-button-action>\n\t\t</div>\n\t\t<nb-tabset (changeTab)=\"onTabChange($event)\">\n\t\t\t<nb-tab [tabTitle]=\"'PROPOSAL_TEMPLATE.BROWSE' | translate\" [tabId]=\"proposalTemplateTabsEnum.ACTIONS\">\n\t\t\t\t@if ((nbTab$ | async) === proposalTemplateTabsEnum.ACTIONS) {\n\t\t\t\t\t<ng-template [ngTemplateOutlet]=\"tableLayout\"></ng-template>\n\t\t\t\t}\n\t\t\t</nb-tab>\n\t\t\t<nb-tab [tabTitle]=\"'PROPOSAL_TEMPLATE.SEARCH' | translate\" [tabId]=\"proposalTemplateTabsEnum.SEARCH\">\n\t\t\t\t@if ((nbTab$ | async) === proposalTemplateTabsEnum.SEARCH) {\n\t\t\t\t\t<ng-template [ngTemplateOutlet]=\"tableLayout\"></ng-template>\n\t\t\t\t}\n\t\t\t</nb-tab>\n\t\t</nb-tabset>\n\t</nb-card-body>\n</nb-card>\n\n<!-- Actions Buttons -->\n<ng-template #actionButtons let-buttonSize=\"buttonSize\">\n\t<div class=\"btn-group actions\">\n\t\t<ng-template ngxPermissionsOnly=\"ORG_PROPOSAL_TEMPLATES_VIEW\">\n\t\t\t<button\n\t\t\t\tnbButton\n\t\t\t\tstatus=\"basic\"\n\t\t\t\t(click)=\"viewProposalTemplate()\"\n\t\t\t\t[disabled]=\"!selectedItem && disableButton\"\n\t\t\t\tclass=\"mr-2\"\n\t\t\t\tclass=\"action secondary\"\n\t\t\t\tsize=\"small\"\n\t\t\t>\n\t\t\t\t<nb-icon class=\"mr-1\" icon=\"eye-outline\"></nb-icon>\n\t\t\t\t{{ 'BUTTONS.VIEW' | translate }}\n\t\t\t</button>\n\t\t</ng-template>\n\t\t<ng-template ngxPermissionsOnly=\"ORG_PROPOSAL_TEMPLATES_EDIT\">\n\t\t\t<button\n\t\t\t\tnbButton\n\t\t\t\tstatus=\"basic\"\n\t\t\t\t(click)=\"editProposalTemplate()\"\n\t\t\t\t[disabled]=\"!selectedItem && disableButton\"\n\t\t\t\tclass=\"mr-2\"\n\t\t\t\tclass=\"action primary\"\n\t\t\t\tsize=\"small\"\n\t\t\t>\n\t\t\t\t<nb-icon class=\"mr-1\" icon=\"edit-outline\"></nb-icon>\n\t\t\t\t{{ 'BUTTONS.EDIT' | translate }}\n\t\t\t</button>\n\t\t\t<button\n\t\t\t\tnbButton\n\t\t\t\tstatus=\"basic\"\n\t\t\t\tsize=\"small\"\n\t\t\t\tngxConfirmDialog\n\t\t\t\t[message]=\"'PROPOSAL_TEMPLATE.CONFIRM_DELETE' | translate\"\n\t\t\t\t(confirm)=\"deleteProposalTemplate()\"\n\t\t\t\t[disabled]=\"!selectedItem && disableButton\"\n\t\t\t\tclass=\"action mr-2\"\n\t\t\t\t[nbTooltip]=\"'BUTTONS.DELETE' | translate\"\n\t\t\t>\n\t\t\t\t<nb-icon status=\"danger\" icon=\"trash-2-outline\"> </nb-icon>\n\t\t\t</button>\n\t\t\t@if (selectedItem?.isDefault) {\n\t\t\t\t<button\n\t\t\t\t\tnbButton\n\t\t\t\t\tstatus=\"basic\"\n\t\t\t\t\t(click)=\"makeDefaultTemplate({ isDefault: false })\"\n\t\t\t\t\tclass=\"mr-2\"\n\t\t\t\t\tclass=\"action primary\"\n\t\t\t\t\tsize=\"small\"\n\t\t\t\t>\n\t\t\t\t\t{{ 'BUTTONS.REMOVE_DEFAULT' | translate }}\n\t\t\t\t</button>\n\t\t\t} @else {\n\t\t\t\t<button\n\t\t\t\t\tnbButton\n\t\t\t\t\tstatus=\"basic\"\n\t\t\t\t\t(click)=\"makeDefaultTemplate({ isDefault: true })\"\n\t\t\t\t\tclass=\"mr-2\"\n\t\t\t\t\tclass=\"action primary\"\n\t\t\t\t\tsize=\"small\"\n\t\t\t\t>\n\t\t\t\t\t{{ 'BUTTONS.MAKE_DEFAULT' | translate }}\n\t\t\t\t</button>\n\t\t\t}\n\t\t</ng-template>\n\t</div>\n</ng-template>\n\n<!-- Buttons -->\n<ng-template #visibleButton>\n\t<ng-template ngxPermissionsOnly=\"ORG_PROPOSAL_TEMPLATES_EDIT\">\n\t\t<button nbButton status=\"success\" size=\"small\" (click)=\"createProposalTemplate()\">\n\t\t\t<nb-icon class=\"mr-1\" icon=\"plus-outline\"></nb-icon>\n\t\t\t{{ 'BUTTONS.ADD' | translate }}\n\t\t</button>\n\t</ng-template>\n</ng-template>\n\n<!-- Smart Table -->\n<ng-template #tableLayout>\n\t<ng-template ngxPermissionsOnly=\"ORG_PROPOSAL_TEMPLATES_VIEW\">\n\t\t<div class=\"table-scroll-container\">\n\t\t\t<angular2-smart-table\n\t\t\t\t[class.ga-table-loading]=\"loading\"\n\t\t\t\tstyle=\"cursor: pointer\"\n\t\t\t\t[settings]=\"smartTableSettings\"\n\t\t\t\t[source]=\"smartTableSource\"\n\t\t\t\t(userRowSelect)=\"selectProposalTemplate($event)\"\n\t\t\t></angular2-smart-table>\n\t\t</div>\n\t\t<div class=\"pagination-container\">\n\t\t\t@if (smartTableSource) {\n\t\t\t\t<ngx-pagination [source]=\"smartTableSource\"></ngx-pagination>\n\t\t\t}\n\t\t</div>\n\t</ng-template>\n</ng-template>\n\n<!-- Read-only View. The projected content is gated here (not inside the drawer)\n     so the record renderer is built fresh for each entry that is opened. -->\n<ngx-record-view-drawer\n\t[open]=\"!!viewedTemplate\"\n\theading=\"PROPOSAL_TEMPLATE.PROPOSAL_TEMPLATE\"\n\t[subtitle]=\"viewedTemplate?.name\"\n\t(closed)=\"closeView()\"\n>\n\t@if (viewedTemplate) {\n\t\t<ngx-record-view [record]=\"viewedTemplate\" [sections]=\"viewSections\"></ngx-record-view>\n\t}\n</ngx-record-view-drawer>\n", styles: [".action{box-shadow:inset 0 0 0 1px var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));border:none}.action[nbButton].appearance-filled.status-basic{background-color:var(--gauzy-card-2)}.action.info[nbButton].appearance-filled.status-basic,.action.info-text-1[nbButton].appearance-filled.status-basic{color:var(--gauzy-action-info-text)}.action.secondary{color:var(--text-hint-color)}.action.success{color:var(--gauzy-action-success-text)}.action.warning{color:var(--gauzy-action-warning-text)}.action.orange{color:#ffab2d}.action.primary{color:var(--text-primary-color)}.action.primary.soft[nbButton].appearance-filled.status-basic{background-color:#6e49e81a}.action.select-nb ::ng-deep{box-shadow:none}.action.select-nb ::ng-deep .select-button{box-shadow:inset 0 0 0 1px var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));background:var(--gauzy-card-2)}button{margin:5px}.actions{background:var(--gauzy-card-2);border-radius:var(--button-rectangle-border-radius);padding:2px 4px!important}.gauzy-button-container{display:flex;justify-content:flex-end;width:100%;padding-bottom:0}.card-custom-header{display:flex;flex-direction:column;width:100%;padding-bottom:0}:host ::ng-deep input{border-radius:var(--border-radius);box-shadow:inset 0 0 0 1px var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18))}:host{--gauzy-table-font-size: .6875rem;--gauzy-table-line-height: 1rem;--gauzy-table-cell-padding-y: .1875rem;--gauzy-table-cell-padding-x: .4375rem;--gauzy-table-header-font-size: .75rem;--gauzy-table-header-line-height: .8125rem;--gauzy-table-header-padding-y: .3125rem;--gauzy-table-header-padding-x: .4375rem;--gauzy-table-filter-padding-y: .1875rem;--gauzy-table-control-height: 1.5rem;--gauzy-table-badge-height: 1rem;--gauzy-table-badge-radius: .25rem;--gauzy-table-badge-padding-y: .1875rem;--gauzy-table-chip-font-size: .625rem;--gauzy-table-chip-line-height: .75rem;--gauzy-table-chip-padding-y: 0;--gauzy-table-chip-padding-x: .3125rem;--gauzy-table-chip-gap: .125rem;--gauzy-table-chip-block-gap: .5rem;--gauzy-people-avatar-size: 1.25rem;--gauzy-people-font-size: .75rem;--gauzy-people-chip-padding-y: .25rem;height:100%}:host nb-card{height:100%;background-color:var(--gauzy-card-2)}:host nb-card-body{display:flex;flex-direction:column;height:calc(100vh - 13.5rem)!important;overflow:unset;background-color:unset}:host nb-tabset{display:flex;flex-direction:column;height:100%}:host nb-tabset nb-tab.content-active{flex:1 1 auto;height:auto;min-height:0}:host nb-tabset{flex:1 1 auto;min-height:0}:host nb-tabset nb-tab.content-active{display:flex;flex-direction:column;overflow:unset;border-radius:0 0 var(--border-radius) var(--border-radius);background-color:var(--gauzy-card-2)}[dir=ltr] :host nb-tabset nb-tab.content-active{padding:1rem .5rem 1rem 18px}[dir=rtl] :host nb-tabset nb-tab.content-active{padding:1rem 18px 1rem .5rem}:host .gauzy-button-container{--button-small-icon-size: .875rem;--button-small-icon-offset: .25rem;--button-small-icon-vertical-margin: 0;--button-filled-small-padding: .25rem .625rem;--button-outline-small-padding: .25rem .625rem;--button-ghost-small-padding: .25rem .625rem;--icon-button-filled-small-padding: .25rem;--icon-button-outline-small-padding: .25rem;--icon-button-ghost-small-padding: .25rem;position:absolute;top:0}[dir=ltr] :host .gauzy-button-container{right:18px}[dir=rtl] :host .gauzy-button-container{left:18px}:host .gauzy-button-container{box-sizing:content-box;padding:var(--tabset-tab-padding);padding-inline:0;height:var(--tabset-tab-text-line-height)}@media only screen and (max-width:1532px){:host .gauzy-button-container{padding-block:1.1428571429rem;padding-inline:0}}:host .gauzy-button-container{display:flex;align-items:center;justify-content:flex-end;pointer-events:none}:host .gauzy-button-container>*{pointer-events:auto}:host .gauzy-button-container ::ng-deep .actions-container{padding:0}:host .gauzy-button-container ::ng-deep .actions-container button{margin-block:0}:host ::ng-deep nb-tabset .tab-link{--tabset-tab-text-font-size: var(--gauzy-table-header-font-size, .75rem)}:host .table-scroll-container{background:var(--gauzy-card-1, var(--background-basic-color-1));box-shadow:inset 0 0 0 1px var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));border-radius:var(--border-radius, .5rem);flex:1 1 auto;min-height:0;max-height:unset}:host .pagination-container{display:flex;justify-content:flex-end;flex-wrap:wrap;gap:.5rem;margin-top:.25rem}@media(max-width:767px){:host .pagination-container{justify-content:center}}:host .pagination-container ::ng-deep ngx-pagination{width:auto}:host .pagination-container ::ng-deep ngx-pagination nav{margin-top:0!important;gap:.75rem}:host .pagination-container ::ng-deep ngx-pagination .pagination{gap:.125rem;font-size:.75rem}:host .pagination-container ::ng-deep ngx-pagination li a,:host .pagination-container ::ng-deep ngx-pagination li span{margin:0}:host .pagination-container ::ng-deep ngx-pagination li span{display:flex;align-items:center;justify-content:center;min-width:1.75rem;height:1.75rem;padding:0 .375rem;font-size:.75rem;line-height:1;border-radius:var(--gauzy-radius-sm, .375rem)}:host .pagination-container ::ng-deep ngx-pagination li span.icon{padding:0;background:var(--gauzy-hover-tint, rgba(126, 126, 143, .12));box-shadow:none;border-radius:var(--gauzy-radius-sm, .375rem)}:host .pagination-container ::ng-deep ngx-pagination li span.icon nb-icon{font-size:.875rem}:host .pagination-container ::ng-deep ngx-pagination li:hover span.icon{background:var(--gauzy-active-tint, rgba(126, 126, 143, .2))}:host .pagination-container ::ng-deep ngx-pagination li.disabled{opacity:.4;pointer-events:none}:host .pagination-container ::ng-deep ngx-pagination li.active span{width:auto;min-width:1.75rem;height:1.75rem;padding:0 .375rem!important;border-radius:var(--gauzy-radius-sm, .375rem);line-height:1;background:var(--gauzy-active-tint, rgba(126, 126, 143, .2));color:var(--text-basic-color);font-weight:600}:host .pagination-container ::ng-deep ngx-pagination>nav>div{gap:.5rem;font-size:.75rem;color:var(--gauzy-text-color-2, var(--text-hint-color))}:host .pagination-container ::ng-deep ngx-pagination nb-select .select-button{min-width:4rem;height:1.75rem;padding:0 .5rem;border-radius:var(--gauzy-radius-sm, .375rem);font-size:.75rem}:host .table-scroll-container ::ng-deep angular2-smart-table tr.angular2-smart-titles>th{border-bottom:1px solid var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));vertical-align:middle}:host .table-scroll-container ::ng-deep angular2-smart-table tbody tr{background:transparent}:host .table-scroll-container ::ng-deep angular2-smart-table tbody tr>td{vertical-align:middle}:host .table-scroll-container ::ng-deep angular2-smart-table tbody tr:hover:not(.selected){background:var(--gauzy-hover-tint, rgba(126, 126, 143, .12))!important}:host .table-scroll-container ::ng-deep angular2-smart-table tbody tr.selected{background:var(--gauzy-active-tint, rgba(126, 126, 143, .2))!important;box-shadow:none!important}:host ::ng-deep ngx-avatar .inner-wrapper{background-color:var(--color-primary-transparent-100);border-radius:var(--button-rectangle-border-radius);padding:3px 9px 3px 3px;display:flex;flex-direction:row;align-items:center;width:fit-content}:host ::ng-deep ngx-avatar .inner-wrapper .image-container{height:20px;width:20px;display:flex;align-items:center;justify-content:center}:host ::ng-deep ngx-avatar .inner-wrapper .image-container img[type=user]{height:18px;width:18px}:host ::ng-deep ngx-avatar .inner-wrapper .link-text{color:var(--text-primary-color);font-weight:400}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }], ctorParameters: () => [{ type: i1.TranslateService }, { type: i2.Store }, { type: i2.ToastrService }, { type: i2.ProposalTemplateService }, { type: i3.NbDialogService }, { type: i4.Nl2BrPipe }, { type: i4.TruncatePipe }, { type: i5.HttpClient }, { type: i6.ActivatedRoute }, { type: i2.ErrorHandlingService }, { type: i7.NgxPermissionsService }, { type: i8.I18nService }], propDecorators: { actionButtons: [{
                type: ViewChild,
                args: ['actionButtons', { static: true }]
            }], visibleButton: [{
                type: ViewChild,
                args: ['visibleButton', { static: true }]
            }] } });
//# sourceMappingURL=proposal-template-list.component.js.map