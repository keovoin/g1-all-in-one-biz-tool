import { __decorate, __metadata } from "tslib";
import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, combineLatest, merge, Subject } from 'rxjs';
import { debounceTime, filter, tap } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TranslateService } from '@ngx-translate/core';
import { NbIconLibraries } from '@nebular/theme';
import { NgxPermissionsService } from 'ngx-permissions';
import { PermissionsEnum } from '@gauzy/contracts';
import { API_PREFIX, distinctUntilChange, isNotNullOrUndefined } from '@gauzy/ui-core/common';
import { PageDataTableRegistryService, EmployeesService, ServerDataSource, Store, ToastrService, PageTabRegistryService } from '@gauzy/ui-core/core';
import { I18nService } from '@gauzy/ui-core/i18n';
import { EmployeeLinksComponent, NumberEditorComponent, EmployeeLinkEditorComponent, PaginationFilterBaseComponent, NonEditableNumberEditorComponent, ToggleSwitcherComponent } from '@gauzy/ui-core/shared';
import { JobSearchStatusEditorComponent } from '../job-search-status-editor/job-search-status-editor.component';
import { JobSearchStoreService } from '../../providers/job-search-store.service';
import * as i0 from "@angular/core";
import * as i1 from "@nebular/theme";
import * as i2 from "ngx-permissions";
import * as i3 from "@gauzy/ui-core/shared";
import * as i4 from "angular2-smart-table";
import * as i5 from "@ngx-translate/core";
/**
 * Tab identifiers for the job employee page (Browse, Search, History).
 */
export var JobSearchTabsEnum;
(function (JobSearchTabsEnum) {
    JobSearchTabsEnum["BROWSE"] = "BROWSE";
    JobSearchTabsEnum["SEARCH"] = "SEARCH";
    JobSearchTabsEnum["HISTORY"] = "HISTORY";
})(JobSearchTabsEnum || (JobSearchTabsEnum = {}));
/**
 * Job Employee Component
 *
 * Displays and manages job employees: browse list with statistics (available/applied jobs,
 * billing rates, job search status), pagination, and integration with the page tab and data table registries.
 */
let JobEmployeeComponent = class JobEmployeeComponent extends PaginationFilterBaseComponent {
    constructor() {
        super(inject(TranslateService));
        /**
         * Stable permission array for `*ngxPermissionsOnly`.
         * 🛑 Never inline the literal in the binding: a new array on every change-detection
         * cycle makes ngx-permissions re-validate forever under default change detection,
         * which pins the main thread and the view never finishes rendering.
         */
        this.permGateOrgJobEmployeeView = Object.freeze(['ORG_JOB_EMPLOYEE_VIEW']);
        /**
         * Stable permission array for `*ngxPermissionsOnly`.
         * 🛑 Never inline the literal in the binding: a new array on every change-detection
         * cycle makes ngx-permissions re-validate forever under default change detection,
         * which pins the main thread and the view never finishes rendering.
         */
        this.permGateOrgJobEmployeeViewOrgEmployeesEdit = Object.freeze(['ORG_JOB_EMPLOYEE_VIEW', 'ORG_EMPLOYEES_EDIT']);
        this._http = inject(HttpClient);
        this._route = inject(ActivatedRoute);
        this._router = inject(Router);
        this._ngxPermissionsService = inject(NgxPermissionsService);
        this._store = inject(Store);
        this._employeesService = inject(EmployeesService);
        this._jobSearchStoreService = inject(JobSearchStoreService);
        this._toastrService = inject(ToastrService);
        this._currencyPipe = inject(CurrencyPipe);
        this._i18nService = inject(I18nService);
        this._pageDataTableRegistryService = inject(PageDataTableRegistryService);
        this._pageTabRegistryService = inject(PageTabRegistryService);
        this._iconLibraries = inject(NbIconLibraries);
        this.jobSearchTabsEnum = JobSearchTabsEnum;
        this.employees$ = new Subject();
        this.nbTab$ = new BehaviorSubject(JobSearchTabsEnum.BROWSE);
        this.loading = false;
        this.organization = null;
        this.selectedEmployeeId = null;
        this.selectedEmployee = null;
        this.disableButton = true;
        /*
         * Read-only View: a job-search row is a small flat record, so it opens in the
         * right-side drawer rather than on a page of its own.
         */
        this.viewedEmployee = null;
        this.viewSections = [];
        this.tabsetId = this._route.snapshot.data['tabsetId'];
        this.dataTableId = this._route.snapshot.data['dataTableId'];
    }
    /** Initialize permissions, locale, page tabs/columns, smart table settings, and translation listener. */
    ngOnInit() {
        this._initializeUiPermissions();
        this._initializeUiLanguagesAndLocale();
        this._initializePageElements();
        this._applyTranslationOnSmartTable();
        this._loadSmartTableSettings();
    }
    /** Subscribe to employees$, pagination$, and store (organization + employee) to load and refresh job employees. */
    ngAfterViewInit() {
        this.employees$
            .pipe(debounceTime(100), 
        // The list is about to be reloaded, so whatever the drawer is showing
        // is about to go stale — close it rather than leave a detached record open.
        tap(() => this.closeView()), tap(() => this.getActiveJobEmployees()), untilDestroyed(this))
            .subscribe();
        this.pagination$
            .pipe(debounceTime(100), distinctUntilChange(), tap(() => this.employees$.next(true)), untilDestroyed(this))
            .subscribe();
        combineLatest([this._store.selectedOrganization$, this._store.selectedEmployee$])
            .pipe(debounceTime(100), distinctUntilChange(), filter(([organization]) => !!organization), tap(([organization, employee]) => {
            this.organization = organization;
            this.selectedEmployeeId = employee ? employee.id : null;
        }), tap(() => this.employees$.next(true)), untilDestroyed(this))
            .subscribe();
    }
    /**
     * Initializes page elements by registering page tabs and data table columns
     * with the tab and data table registry services.
     */
    _initializePageElements() {
        this.registerPageTabs(this._pageTabRegistryService);
        this.registerDataTableColumns(this._pageDataTableRegistryService);
    }
    /**
     * Registers the Browse, Search, and History tabs for the job employee tabset.
     *
     * @param _pageTabRegistryService - The PageTabRegistryService to register the tabs with.
     * @returns void
     */
    registerPageTabs(_pageTabRegistryService) {
        _pageTabRegistryService.registerPageTab({
            tabsetId: this.tabsetId,
            tabId: 'browse',
            tabIcon: 'globe-2-outline',
            tabsetType: 'standard',
            tabTitle: (_i18n) => _i18n.getTranslation('JOB_EMPLOYEE.BROWSE'),
            order: 1,
            responsive: true,
            template: this.tableLayout
        });
        _pageTabRegistryService.registerPageTab({
            tabsetId: this.tabsetId,
            tabId: 'search',
            tabIcon: 'search-outline',
            tabsetType: 'standard',
            tabTitle: (_i18n) => _i18n.getTranslation('JOB_EMPLOYEE.SEARCH'),
            order: 2,
            responsive: true,
            template: this.comingSoon
        });
        _pageTabRegistryService.registerPageTab({
            tabsetId: this.tabsetId,
            tabId: 'history',
            tabIcon: 'clock-outline',
            tabsetType: 'standard',
            tabTitle: (_i18n) => _i18n.getTranslation('JOB_EMPLOYEE.HISTORY'),
            order: 3,
            responsive: true,
            template: this.comingSoon
        });
    }
    /**
     * Registers data table columns (employee, available/applied jobs, billing rates, job search status).
     * @param _pageDataTableRegistryService - The PageDataTableRegistryService to register the columns with.
     * @returns void
     */
    registerDataTableColumns(_pageDataTableRegistryService) {
        _pageDataTableRegistryService.registerPageDataTableColumn({
            dataTableId: this.dataTableId,
            columnId: 'name',
            order: 0,
            title: () => this.getTranslation('JOB_EMPLOYEE.EMPLOYEE'),
            type: 'custom',
            width: '20%',
            isSortable: true,
            isEditable: false,
            renderComponent: EmployeeLinksComponent,
            valuePrepareFunction: (_, cell) => this.prepareEmployeeValue(_, cell),
            componentInitFunction: (instance, cell) => {
                instance.rowData = cell.getRow().getData();
                instance.value = cell.getValue();
            },
            editor: {
                type: 'custom',
                component: EmployeeLinkEditorComponent
            }
        });
        _pageDataTableRegistryService.registerPageDataTableColumn({
            dataTableId: this.dataTableId,
            columnId: 'availableJobs',
            order: 1,
            title: () => this.getTranslation('JOB_EMPLOYEE.AVAILABLE_JOBS'),
            type: 'text',
            width: '10%',
            isSortable: false,
            isEditable: false,
            valuePrepareFunction: (rawValue) => (isNotNullOrUndefined(rawValue) ? rawValue : 0),
            editor: {
                type: 'custom',
                component: NonEditableNumberEditorComponent
            }
        });
        _pageDataTableRegistryService.registerPageDataTableColumn({
            dataTableId: this.dataTableId,
            columnId: 'appliedJobs',
            order: 2,
            title: () => this.getTranslation('JOB_EMPLOYEE.APPLIED_JOBS'),
            type: 'text',
            width: '10%',
            isSortable: false,
            isEditable: false,
            valuePrepareFunction: (rawValue) => (isNotNullOrUndefined(rawValue) ? rawValue : 0),
            editor: {
                type: 'custom',
                component: NonEditableNumberEditorComponent
            }
        });
        _pageDataTableRegistryService.registerPageDataTableColumn({
            dataTableId: this.dataTableId,
            columnId: 'billRateValue',
            order: 3,
            title: () => this.getTranslation('JOB_EMPLOYEE.BILLING_RATE'),
            type: 'text',
            width: '10%',
            isSortable: false,
            isEditable: true,
            editor: {
                type: 'custom',
                component: NumberEditorComponent
            },
            valuePrepareFunction: (rawValue, cell) => {
                const employee = cell.getRow().getData();
                return this._currencyPipe.transform(rawValue, employee?.billRateCurrency);
            }
        });
        _pageDataTableRegistryService.registerPageDataTableColumn({
            dataTableId: this.dataTableId,
            columnId: 'minimumBillingRate',
            order: 4,
            title: () => this.getTranslation('JOB_EMPLOYEE.MINIMUM_BILLING_RATE'),
            type: 'text',
            width: '20%',
            isSortable: false,
            isEditable: true,
            editor: {
                type: 'custom',
                component: NumberEditorComponent
            },
            valuePrepareFunction: (value, cell) => {
                const employee = cell.getRow().getData();
                return this._currencyPipe.transform(value, employee?.billRateCurrency);
            }
        });
        _pageDataTableRegistryService.registerPageDataTableColumn({
            dataTableId: this.dataTableId,
            columnId: 'isJobSearchActive',
            order: 5,
            title: () => this.getTranslation('JOB_EMPLOYEE.JOB_SEARCH_STATUS'),
            type: 'custom',
            width: '20%',
            isSortable: false,
            isEditable: true,
            renderComponent: ToggleSwitcherComponent,
            componentInitFunction: (instance, cell) => {
                const employee = cell.getRow().getData();
                instance.label = false;
                instance.value = employee.isJobSearchActive;
                /** Subscribe to the onSwitched event and update the job search availability. Use this (parent) for untilDestroyed so cleanup runs when this component is destroyed; the table cell instance may not have UntilDestroy applied in plugin context. */
                instance.onSwitched.pipe(untilDestroyed(this)).subscribe((toggle) => {
                    this._jobSearchStoreService.updateJobSearchAvailability(this.organization, employee, toggle);
                });
            },
            editor: {
                type: 'custom',
                component: JobSearchStatusEditorComponent
            }
        });
    }
    /**
     * Loads the current user's permissions into NgxPermissionsService.
     * @returns void
     */
    _initializeUiPermissions() {
        const permissions = this._store.userRolePermissions.map(({ permission }) => permission);
        this._ngxPermissionsService.flushPermissions();
        this._ngxPermissionsService.loadPermissions(permissions);
    }
    /**
     * Subscribes to preferred language and applies it via TranslateService.
     * @returns void
     */
    _initializeUiLanguagesAndLocale() {
        const preferredLanguage$ = merge(this._store.preferredLanguage$, this._i18nService.preferredLanguage$).pipe(distinctUntilChange(), filter((lang) => !!lang), tap((lang) => {
            this.translateService.use(lang);
        }), untilDestroyed(this));
        preferredLanguage$.subscribe();
    }
    /**
     * Builds and assigns the Smart Table ServerDataSource for job employee statistics
     * (organization/tenant filter, optional employee filter, permission-based restrictions).
     */
    setSmartTableSource() {
        if (!this.organization) {
            return;
        }
        this.loading = true;
        try {
            const { id: organizationId, tenantId } = this.organization;
            const whereClause = {
                tenantId,
                organizationId,
                isActive: true,
                isArchived: false,
                ...(this.selectedEmployeeId ? { id: this.selectedEmployeeId } : {}),
                ...(this.filters.where ? this.filters.where : {})
            };
            if (!this._store.hasPermission(PermissionsEnum.CHANGE_SELECTED_EMPLOYEE)) {
                const employeeId = this._store.user?.employee?.id;
                whereClause.id = employeeId;
            }
            this.smartTableSource = new ServerDataSource(this._http, {
                endPoint: `${API_PREFIX}/employee-job/statistics`,
                relations: ['user'],
                where: { ...whereClause },
                finalize: () => {
                    this.setPagination({
                        ...this.getPagination(),
                        totalItems: this.smartTableSource.count()
                    });
                }
            });
        }
        catch (error) {
            this._toastrService.danger(error);
        }
        finally {
            this.loading = false;
        }
    }
    /**
     * Loads active job employees into the smart table and applies current pagination.
     * @returns void
     */
    async getActiveJobEmployees() {
        try {
            if (!this.organization) {
                return;
            }
            this.setSmartTableSource();
            const { activePage, itemsPerPage } = this.getPagination();
            this.smartTableSource.setPaging(activePage, itemsPerPage, false);
        }
        catch (error) {
            this._toastrService.danger(error);
        }
    }
    /**
     * Builds smart table settings (pager, columns from registry, edit actions, no-data message).
     * @returns void
     */
    _loadSmartTableSettings() {
        const pagination = this.getPagination();
        this.settingsSmartTable = {
            selectedRowIndex: -1,
            hideSubHeader: true,
            noDataMessage: this.getTranslation('SM_TABLE.NO_DATA.EMPLOYEE'),
            isEditable: true,
            actions: {
                // The library's fallback header title is a hardcoded, untranslated 'Actions'.
                columnTitle: this.getTranslation('SM_TABLE.ACTIONS'),
                delete: false,
                // The toolbar's own Add button handles creation (navigates to the
                // employees page); the table's inline-create was never wired up.
                add: false
            },
            pager: {
                display: false,
                perPage: pagination ? pagination.itemsPerPage : 10
            },
            edit: {
                // This is the real per-row action: it puts the row into inline edit of
                // the two rate columns (plus the status toggle).
                editButtonContent: this.renderActionIcon('edit-outline', this.getTranslation('BUTTONS.EDIT')),
                saveButtonContent: this.renderActionIcon('checkmark-outline', this.getTranslation('BUTTONS.SAVE')),
                cancelButtonContent: this.renderActionIcon('close-outline', this.getTranslation('BUTTONS.CANCEL')),
                // `renderActionIcon` returns an inline `<svg>`, and Angular's HTML
                // sanitizer allows no SVG element at all — without this the anchors
                // render empty.
                //
                // `sanitizer` is the library's own supported opt-out, not an ad-hoc key:
                // `EditAction.sanitizer?: SanitizerSettings` in angular2-smart-table, read
                // as `settings.edit?.sanitizer?.bypassHtml` by both anchor rows (the edit
                // button and the save/cancel pair) to pick the mode its `bypassSecurityTrust`
                // pipe hands to `DomSanitizer.bypassSecurityTrustHtml` before the
                // `[innerHTML]` binding. So this IS the DomSanitizer path — the library just
                // owns the call.
                //
                // Safe here because every part of that string is ours: the glyph comes
                // straight out of the registered icon pack and the label is an i18n string,
                // escaped before it is interpolated.
                sanitizer: { bypassHtml: true },
                confirmSave: true
            },
            columns: {
                ...this._pageDataTableRegistryService.getPageDataTableColumns('job-employee-page')
            }
        };
    }
    /**
     * Builds the inner markup for one of the table's row-action anchors.
     *
     * `editButtonContent` and its siblings take a STRING, which the library injects
     * with `[innerHTML]`, so an `<nb-icon>` written in there is never instantiated —
     * which is why these three anchors used to carry FontAwesome glyphs while every
     * other icon on the page came from the app's own pack. Reading the SVG straight
     * out of that pack closes the gap: `edit-outline` here draws exactly what
     * `<nb-icon icon="edit-outline">` draws in the toolbar above the table, and it
     * keeps drawing the same thing if the pack is ever re-pointed (it already maps
     * the Eva names to Tabler icons — see `TablerIconsModule`).
     *
     * @param icon - Icon name in the registered `eva` pack.
     * @param label - Translated accessible name for the action.
     * @returns The anchor's inner markup, or the bare label if the pack is unavailable.
     */
    renderActionIcon(icon, label) {
        const safeLabel = this.escapeHtml(label);
        let glyph = '';
        try {
            glyph = this._iconLibraries.getSvgIcon(icon, 'eva')?.icon?.getContent() ?? '';
        }
        catch {
            // `getSvgIcon` throws when the pack is not registered — outside the app
            // shell, e.g. in an isolated test. The label alone is the library's own
            // default content, so the button still works and still reads.
            glyph = '';
        }
        if (!glyph) {
            return safeLabel;
        }
        // Native `title` rather than `nbTooltip`: this is raw markup, where
        // directives never bind. The label is repeated as visually hidden text so
        // the action is not icon-only to a screen reader.
        return `<span class="ga-action-glyph" title="${safeLabel}" aria-hidden="true">${glyph}</span><span class="sr-only">${safeLabel}</span>`;
    }
    /**
     * Escapes a translated label for interpolation into the raw action markup above,
     * which is rendered with the sanitizer bypassed.
     *
     * @param value - The label to escape.
     * @returns The label with HTML-significant characters replaced by entities.
     */
    escapeHtml(value) {
        return value
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }
    /**
     * Prepares the employee cell value (name, imageUrl, id) for the employee links column.
     * @param _ - The event object.
     * @param cell - The cell object.
     * @returns The employee cell value.
     */
    prepareEmployeeValue(_, cell) {
        const employee = cell.getRow().getData();
        if (employee) {
            const { user, id } = employee;
            return {
                name: user?.name ?? null,
                imageUrl: user?.imageUrl ?? null,
                id: id ?? null
            };
        }
        return { name: null, imageUrl: null, id: null };
    }
    /**
     * Handles smart table edit confirm: updates employee bill rate and minimum billing rate, then refreshes the list.
     * @param event - The event object.
     * @returns void
     */
    async onEditConfirm(event) {
        try {
            if (!this.organization) {
                return;
            }
            const { id: organizationId, tenantId } = this.organization;
            const employeeId = event.data?.id;
            const { billRateValue, minimumBillingRate } = event.newData ?? {};
            await this._employeesService.updateProfile(employeeId, {
                minimumBillingRate: +minimumBillingRate,
                billRateValue: +billRateValue,
                tenantId,
                organizationId
            });
            this.employees$.next(true);
            await event.confirm.resolve(event.newData);
        }
        catch (error) {
            console.error('Error while updating employee rates', error);
            await event.confirm.reject();
        }
    }
    /**
     * Handles smart table edit cancel: refreshes the table to revert in-place changes.
     * @param event - The event object.
     * @returns void
     */
    onEditCancel(event) {
        this.smartTableSource.refresh();
    }
    /** Re-applies smart table settings when the application language changes. */
    _applyTranslationOnSmartTable() {
        this.translateService.onLangChange
            .pipe(tap(() => this._loadSmartTableSettings()), untilDestroyed(this))
            .subscribe();
    }
    /**
     * Updates selected employee and edit button state when a row is selected or deselected.
     * @param isSelected - Whether the employee is selected.
     * @param data - The employee data.
     * @returns void
     */
    onSelectEmployee({ isSelected, data }) {
        // Whatever the drawer is showing no longer matches the selection.
        this.closeView();
        this.disableButton = !isSelected;
        this.selectedEmployee = isSelected ? data : null;
    }
    /**
     * Opens the read-only View of a job employee row in the right-side drawer.
     *
     * @param selectedItem - Row the action was invoked from, when it came from the grid.
     */
    view(selectedItem) {
        if (selectedItem) {
            this.onSelectEmployee({ isSelected: true, data: selectedItem });
        }
        const employee = selectedItem ?? this.selectedEmployee;
        if (!employee) {
            return;
        }
        this.viewSections = this.buildViewSections(employee);
        this.viewedEmployee = employee;
    }
    closeView() {
        this.viewedEmployee = null;
    }
    /**
     * Field descriptor for the drawer — the grid columns, read vertically.
     * Derived cells (zero-defaulted job counters, currency-formatted rates) are
     * pre-computed here exactly as the grid's valuePrepareFunctions render them.
     */
    buildViewSections(employee) {
        return [
            {
                fields: [
                    { label: 'JOB_EMPLOYEE.EMPLOYEE', key: 'user', type: 'person' },
                    { label: 'JOB_EMPLOYEE.AVAILABLE_JOBS', value: employee.availableJobs ?? 0 },
                    { label: 'JOB_EMPLOYEE.APPLIED_JOBS', value: employee.appliedJobs ?? 0 },
                    {
                        label: 'JOB_EMPLOYEE.BILLING_RATE',
                        value: this._currencyPipe.transform(employee.billRateValue, employee.billRateCurrency)
                    },
                    {
                        label: 'JOB_EMPLOYEE.MINIMUM_BILLING_RATE',
                        value: this._currencyPipe.transform(employee.minimumBillingRate, employee.billRateCurrency)
                    },
                    {
                        label: 'JOB_EMPLOYEE.JOB_SEARCH_STATUS',
                        value: employee.isJobSearchActive ?? false,
                        type: 'boolean'
                    }
                ]
            }
        ];
    }
    /**
     * Navigates to the employee edit page for the selected or given employee.
     * @param selectedItem - The employee to edit.
     * @returns void
     */
    edit(selectedItem) {
        if (selectedItem) {
            this.onSelectEmployee({
                isSelected: true,
                data: selectedItem
            });
        }
        const employeeId = this.selectedEmployee?.id;
        if (employeeId) {
            this._router.navigate(['/pages/employees/edit/', employeeId]);
        }
    }
    /**
     * Navigates to the employees page with the add-dialog query param to open the add-employee dialog.
     * @param event - The mouse event that triggered the navigation.
     * @returns void
     */
    async addNew(event) {
        if (!this.organization) {
            return;
        }
        try {
            this._router.navigate(['/pages/employees/'], {
                queryParams: { openAddDialog: true }
            });
        }
        catch (error) {
            this._toastrService.error(error.message || error);
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: JobEmployeeComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: JobEmployeeComponent, isStandalone: false, selector: "ga-job-employees", providers: [CurrencyPipe, JobSearchStoreService], viewQueries: [{ propertyName: "tableLayout", first: true, predicate: ["tableLayout"], descendants: true, static: true }, { propertyName: "comingSoon", first: true, predicate: ["comingSoon"], descendants: true, static: true }, { propertyName: "actionButtons", first: true, predicate: ["actionButtons"], descendants: true, static: true }, { propertyName: "visibleButton", first: true, predicate: ["visibleButton"], descendants: true, static: true }], usesInheritance: true, ngImport: i0, template: "<nb-card [nbSpinner]=\"loading\" nbSpinnerStatus=\"primary\" nbSpinnerSize=\"large\">\n\t<nb-card-header class=\"header\">\n\t\t<h4>\n\t\t\t<ngx-header-title [allowEmployee]=\"false\">\n\t\t\t\t{{ 'JOB_EMPLOYEE.EMPLOYEES' | translate }}\n\t\t\t</ngx-header-title>\n\t\t</h4>\n\t</nb-card-header>\n\t<nb-card-body class=\"p-0\">\n\t\t<div class=\"gauzy-button-container\">\n\t\t\t<ngx-gauzy-button-action\n\t\t\t\t[hasLayoutSelector]=\"false\"\n\t\t\t\t[isDisable]=\"disableButton\"\n\t\t\t\t[buttonTemplateVisible]=\"visibleButton\"\n\t\t\t\t[buttonTemplate]=\"actionButtons\"\n\t\t\t></ngx-gauzy-button-action>\n\t\t</div>\n\n\t\t<!-- Dynamic Tabs -->\n\t\t<gz-dynamic-tabs [tabsetId]=\"tabsetId\"></gz-dynamic-tabs>\n\t</nb-card-body>\n</nb-card>\n\n<!-- Table Layout Template -->\n<ng-template #tableLayout>\n\t<!-- Check if the user has the 'ORG_JOB_EMPLOYEE_VIEW' permission -->\n\t<ng-template [ngxPermissionsOnly]=\"permGateOrgJobEmployeeView\">\n\t\t<div class=\"table-scroll-container\">\n\t\t\t<!-- Smart Table Component -->\n\t\t\t<angular2-smart-table\n\t\t\t\t[class.ga-table-loading]=\"loading\"\n\t\t\t\tclass=\"cursor-pointer\"\n\t\t\t\t[settings]=\"settingsSmartTable\"\n\t\t\t\t[source]=\"smartTableSource\"\n\t\t\t\t(editConfirm)=\"onEditConfirm($event)\"\n\t\t\t\t(editCancel)=\"onEditCancel($event)\"\n\t\t\t\t(userRowSelect)=\"onSelectEmployee($event)\"\n\t\t\t></angular2-smart-table>\n\t\t</div>\n\t\t<div class=\"pagination-container\">\n\t\t\t@if (smartTableSource) {\n\t\t\t\t<!-- Pagination Component -->\n\t\t\t\t<ngx-pagination [source]=\"smartTableSource\"></ngx-pagination>\n\t\t\t}\n\t\t</div>\n\t</ng-template>\n\n\t<!-- If the user does not have the 'ORG_JOB_EMPLOYEE_VIEW' permission -->\n\t<ng-template [ngxPermissionsExcept]=\"['ORG_JOB_EMPLOYEE_VIEW']\">\n\t\t<div>\n\t\t\t<!-- Content to display if the user does not have the 'ORG_JOB_EMPLOYEE_VIEW' permission -->\n\t\t\t<!-- Placeholder: Add alternate content here -->\n\t\t</div>\n\t</ng-template>\n</ng-template>\n\n<!-- Coming Soon Template -->\n<ng-template #comingSoon>\n\t<div class=\"coming-soon-container\">\n\t\t<nb-icon icon=\"flash-outline\" class=\"coming-soon-icon\"></nb-icon>\n\t\t<div>{{ 'COMING_SOON' | translate }}</div>\n\t</div>\n</ng-template>\n\n<ng-template #actionButtons let-buttonSize=\"buttonSize\" let-selectedItem=\"selectedItem\">\n\t<ng-template [ngxPermissionsOnly]=\"permGateOrgJobEmployeeViewOrgEmployeesEdit\">\n\t\t<div class=\"btn-group actions\">\n\t\t\t<ng-template ngxPermissionsOnly=\"ORG_JOB_EMPLOYEE_VIEW\">\n\t\t\t\t<button\n\t\t\t\t\ttype=\"button\"\n\t\t\t\t\t(click)=\"view(selectedItem)\"\n\t\t\t\t\tsize=\"small\"\n\t\t\t\t\tstatus=\"basic\"\n\t\t\t\t\tclass=\"action primary cursor-pointer\"\n\t\t\t\t\tnbButton\n\t\t\t\t>\n\t\t\t\t\t<nb-icon icon=\"eye-outline\" pack=\"eva\"></nb-icon>\n\t\t\t\t\t<span> {{ 'BUTTONS.VIEW' | translate }} </span>\n\t\t\t\t</button>\n\t\t\t</ng-template>\n\t\t\t<ng-template ngxPermissionsOnly=\"ORG_EMPLOYEES_EDIT\">\n\t\t\t\t<button\n\t\t\t\t\t(click)=\"edit(selectedItem)\"\n\t\t\t\t\tsize=\"small\"\n\t\t\t\t\tstatus=\"basic\"\n\t\t\t\t\tclass=\"action primary cursor-pointer\"\n\t\t\t\t\tnbButton\n\t\t\t\t>\n\t\t\t\t\t<nb-icon icon=\"edit-outline\" pack=\"eva\"></nb-icon>\n\t\t\t\t\t<span>{{ 'BUTTONS.EDIT' | translate }}</span>\n\t\t\t\t</button>\n\t\t\t</ng-template>\n\n\t\t\t<!-- <ng-template ngxPermissionsOnly=\"ORG_EMPLOYEES_EDIT\">\n\t\t\t\t<button\n\t\t\t\t\tstyle=\"cursor: pointer\"\n\t\t\t\t\tstatus=\"basic\"\n\t\t\t\t\tclass=\"action\"\n\t\t\t\t\tsize=\"small\"\n\t\t\t\t\t[nbTooltip]=\"'BUTTONS.DELETE' | translate\"\n\t\t\t\t\tnbButton\n\t\t\t\t>\n\t\t\t\t\t<nb-icon status=\"danger\" icon=\"trash-2-outline\" pack=\"eva\"></nb-icon>\n\t\t\t\t</button>\n\t\t\t</ng-template> -->\n\t\t</div>\n\t</ng-template>\n</ng-template>\n\n<ng-template #visibleButton>\n\t<ng-template ngxPermissionsOnly=\"ORG_EMPLOYEES_EDIT\">\n\t\t<button nbButton status=\"success\" size=\"small\" (click)=\"addNew($event)\">\n\t\t\t<nb-icon icon=\"plus-outline\"> </nb-icon>\n\t\t\t{{ 'BUTTONS.ADD' | translate }}\n\t\t</button>\n\t</ng-template>\n</ng-template>\n\n<!-- Read-only View. The projected content is gated here (not inside the drawer)\n     so the record renderer is built fresh for each entry that is opened. -->\n<ngx-record-view-drawer\n\t[open]=\"!!viewedEmployee\"\n\theading=\"JOB_EMPLOYEE.EMPLOYEE\"\n\t[subtitle]=\"viewedEmployee?.user?.name\"\n\t(closed)=\"closeView()\"\n>\n\t@if (viewedEmployee) {\n\t\t<ngx-record-view [record]=\"viewedEmployee\" [sections]=\"viewSections\"></ngx-record-view>\n\t}\n</ngx-record-view-drawer>\n", styles: [".action{box-shadow:inset 0 0 0 1px var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));border:none}.action[nbButton].appearance-filled.status-basic{background-color:var(--gauzy-card-2)}.action.info[nbButton].appearance-filled.status-basic,.action.info-text-1[nbButton].appearance-filled.status-basic{color:var(--gauzy-action-info-text)}.action.secondary{color:var(--text-hint-color)}.action.success{color:var(--gauzy-action-success-text)}.action.warning{color:var(--gauzy-action-warning-text)}.action.orange{color:#ffab2d}.action.primary{color:var(--text-primary-color)}.action.primary.soft[nbButton].appearance-filled.status-basic{background-color:#6e49e81a}.action.select-nb ::ng-deep{box-shadow:none}.action.select-nb ::ng-deep .select-button{box-shadow:inset 0 0 0 1px var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));background:var(--gauzy-card-2)}button{margin:5px}.actions{background:var(--gauzy-card-2);border-radius:var(--button-rectangle-border-radius);padding:2px 4px!important}.gauzy-button-container{display:flex;justify-content:flex-end;width:100%;padding-bottom:0}.card-custom-header{display:flex;flex-direction:column;width:100%;padding-bottom:0}:host ::ng-deep input{border-radius:var(--border-radius);box-shadow:inset 0 0 0 1px var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18))}:host{--gauzy-table-font-size: .6875rem;--gauzy-table-line-height: 1rem;--gauzy-table-cell-padding-y: .1875rem;--gauzy-table-cell-padding-x: .4375rem;--gauzy-table-header-font-size: .75rem;--gauzy-table-header-line-height: .8125rem;--gauzy-table-header-padding-y: .3125rem;--gauzy-table-header-padding-x: .4375rem;--gauzy-table-filter-padding-y: .1875rem;--gauzy-table-control-height: 1.5rem;--gauzy-table-badge-height: 1rem;--gauzy-table-badge-radius: .25rem;--gauzy-table-badge-padding-y: .1875rem;--gauzy-table-chip-font-size: .625rem;--gauzy-table-chip-line-height: .75rem;--gauzy-table-chip-padding-y: 0;--gauzy-table-chip-padding-x: .3125rem;--gauzy-table-chip-gap: .125rem;--gauzy-table-chip-block-gap: .5rem;--gauzy-people-avatar-size: 1.25rem;--gauzy-people-font-size: .75rem;--gauzy-people-chip-padding-y: .25rem;height:100%}:host nb-card{height:100%;background-color:var(--gauzy-card-2)}:host nb-card-body{display:flex;flex-direction:column;height:calc(100vh - 13.5rem)!important;overflow:unset;background-color:unset}:host gz-dynamic-tabs{display:flex;flex-direction:column;flex:1 1 auto;min-height:0}:host .gauzy-button-container{--button-small-icon-size: .875rem;--button-small-icon-offset: .25rem;--button-small-icon-vertical-margin: 0;--button-filled-small-padding: .25rem .625rem;--button-outline-small-padding: .25rem .625rem;--button-ghost-small-padding: .25rem .625rem;--icon-button-filled-small-padding: .25rem;--icon-button-outline-small-padding: .25rem;--icon-button-ghost-small-padding: .25rem;position:absolute;top:0}[dir=ltr] :host .gauzy-button-container{right:18px}[dir=rtl] :host .gauzy-button-container{left:18px}:host .gauzy-button-container{box-sizing:content-box;padding:var(--tabset-tab-padding);padding-inline:0;height:var(--tabset-tab-text-line-height)}@media only screen and (max-width:1532px){:host .gauzy-button-container{padding-block:1.1428571429rem;padding-inline:0}}:host .gauzy-button-container{display:flex;align-items:center;justify-content:flex-end;pointer-events:none}:host .gauzy-button-container>*{pointer-events:auto}:host .gauzy-button-container ::ng-deep .actions-container{padding:0}:host .gauzy-button-container ::ng-deep .actions-container button{margin-block:0}:host ::ng-deep nb-tabset{display:flex;flex-direction:column;height:100%}:host ::ng-deep nb-tabset nb-tab.content-active{flex:1 1 auto;height:auto;min-height:0}:host ::ng-deep nb-tabset{flex:1 1 auto;min-height:0;background-color:var(--gauzy-card-2)}:host ::ng-deep nb-tabset .tab-link{--tabset-tab-text-font-size: var(--gauzy-table-header-font-size, .75rem);--icon-font-size: var(--tabset-tab-text-line-height);--icon-line-height: var(--tabset-tab-text-line-height);--icon-width: var(--tabset-tab-text-line-height);--icon-height: var(--tabset-tab-text-line-height)}[dir=ltr] :host ::ng-deep nb-tabset .tab-link nb-icon+span{margin-left:.375rem}[dir=rtl] :host ::ng-deep nb-tabset .tab-link nb-icon+span{margin-right:.375rem}:host ::ng-deep nb-tabset nb-tab.content-active{display:flex;flex-direction:column;overflow:unset;border-radius:0 0 var(--border-radius) var(--border-radius);background-color:var(--gauzy-card-2)}[dir=ltr] :host ::ng-deep nb-tabset nb-tab.content-active{padding:1rem .5rem 1rem 18px}[dir=rtl] :host ::ng-deep nb-tabset nb-tab.content-active{padding:1rem 18px 1rem .5rem}:host .table-scroll-container{background:var(--gauzy-card-1, var(--background-basic-color-1));box-shadow:inset 0 0 0 1px var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));border-radius:var(--border-radius, .5rem);flex:1 1 auto;min-height:0;max-height:unset}:host .pagination-container{display:flex;justify-content:flex-end;flex-wrap:wrap;gap:.5rem;margin-top:.25rem}@media(max-width:767px){:host .pagination-container{justify-content:center}}:host .pagination-container ::ng-deep ngx-pagination{width:auto}:host .pagination-container ::ng-deep ngx-pagination nav{margin-top:0!important;gap:.75rem}:host .pagination-container ::ng-deep ngx-pagination .pagination{gap:.125rem;font-size:.75rem}:host .pagination-container ::ng-deep ngx-pagination li a,:host .pagination-container ::ng-deep ngx-pagination li span{margin:0}:host .pagination-container ::ng-deep ngx-pagination li span{display:flex;align-items:center;justify-content:center;min-width:1.75rem;height:1.75rem;padding:0 .375rem;font-size:.75rem;line-height:1;border-radius:var(--gauzy-radius-sm, .375rem)}:host .pagination-container ::ng-deep ngx-pagination li span.icon{padding:0;background:var(--gauzy-hover-tint, rgba(126, 126, 143, .12));box-shadow:none;border-radius:var(--gauzy-radius-sm, .375rem)}:host .pagination-container ::ng-deep ngx-pagination li span.icon nb-icon{font-size:.875rem}:host .pagination-container ::ng-deep ngx-pagination li:hover span.icon{background:var(--gauzy-active-tint, rgba(126, 126, 143, .2))}:host .pagination-container ::ng-deep ngx-pagination li.disabled{opacity:.4;pointer-events:none}:host .pagination-container ::ng-deep ngx-pagination li.active span{width:auto;min-width:1.75rem;height:1.75rem;padding:0 .375rem!important;border-radius:var(--gauzy-radius-sm, .375rem);line-height:1;background:var(--gauzy-active-tint, rgba(126, 126, 143, .2));color:var(--text-basic-color);font-weight:600}:host .pagination-container ::ng-deep ngx-pagination>nav>div{gap:.5rem;font-size:.75rem;color:var(--gauzy-text-color-2, var(--text-hint-color))}:host .pagination-container ::ng-deep ngx-pagination nb-select .select-button{min-width:4rem;height:1.75rem;padding:0 .5rem;border-radius:var(--gauzy-radius-sm, .375rem);font-size:.75rem}:host .table-scroll-container ::ng-deep angular2-smart-table tr.angular2-smart-titles>th{border-bottom:1px solid var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));vertical-align:middle}:host .table-scroll-container ::ng-deep angular2-smart-table tbody tr{background:transparent}:host .table-scroll-container ::ng-deep angular2-smart-table tbody tr>td{vertical-align:middle}:host .table-scroll-container ::ng-deep angular2-smart-table tbody tr:hover:not(.selected){background:var(--gauzy-hover-tint, rgba(126, 126, 143, .12))!important}:host .table-scroll-container ::ng-deep angular2-smart-table tbody tr.selected{background:var(--gauzy-active-tint, rgba(126, 126, 143, .2))!important;box-shadow:none!important}:host .table-scroll-container ::ng-deep angular2-smart-table ngx-toggle-switcher{--toggle-width: 1.5rem;--toggle-height: .75rem;--toggle-switcher-size: .5625rem;--toggle-primary-checked-switcher-background-color: var(--text-hint-color)}:host .table-scroll-container ::ng-deep angular2-smart-table ngx-toggle-switcher .toggle.checked .toggle-switcher{background-color:var(--text-control-color)}:host .table-scroll-container ::ng-deep angular2-smart-table input.form-control{width:4.5rem;max-width:100%;min-height:0!important;height:calc(var(--gauzy-table-line-height, 1rem) + 2px)!important;max-height:calc(var(--gauzy-table-line-height, 1rem) + 2px)!important;padding:0 var(--gauzy-table-cell-padding-x, .4375rem)!important;line-height:1!important;font-size:var(--gauzy-table-font-size, .6875rem);color:var(--text-basic-color);background-color:var(--gauzy-sidebar-background-3, var(--input-basic-background-color));border:none;border-radius:var(--gauzy-radius-sm, .375rem);-moz-appearance:textfield;appearance:textfield}:host .table-scroll-container ::ng-deep angular2-smart-table input.form-control::-webkit-outer-spin-button,:host .table-scroll-container ::ng-deep angular2-smart-table input.form-control::-webkit-inner-spin-button{-webkit-appearance:none;appearance:none;margin:0}:host .table-scroll-container ::ng-deep angular2-smart-table input.form-control:focus{outline:none;box-shadow:inset 0 0 0 1px var(--color-primary-default)}:host .table-scroll-container ::ng-deep angular2-smart-table angular2-st-tbody-edit-delete,:host .table-scroll-container ::ng-deep angular2-smart-table angular2-st-tbody-save-cancel{display:flex;align-items:center;gap:.125rem}:host .table-scroll-container ::ng-deep angular2-smart-table a.angular2-smart-action{width:calc(var(--gauzy-table-line-height, 1rem) + 2 * var(--gauzy-table-cell-padding-y, .1875rem));height:calc(var(--gauzy-table-line-height, 1rem) + 2 * var(--gauzy-table-cell-padding-y, .1875rem));padding:0;font-size:var(--gauzy-table-header-font-size, .75rem)!important;line-height:1;border:none;background-color:transparent;border-radius:var(--gauzy-radius-sm, .375rem);color:var(--text-hint-color)}:host .table-scroll-container ::ng-deep angular2-smart-table a.angular2-smart-action:hover{background-color:var(--gauzy-hover-tint, rgba(126, 126, 143, .12))}:host .table-scroll-container ::ng-deep angular2-smart-table a.angular2-smart-action .ga-action-glyph{display:flex;width:.875rem;height:.875rem}:host .table-scroll-container ::ng-deep angular2-smart-table a.angular2-smart-action .ga-action-glyph svg{width:100%;height:100%}:host .table-scroll-container ::ng-deep angular2-smart-table a.angular2-smart-action-edit-edit{color:var(--text-primary-color)}:host .table-scroll-container ::ng-deep angular2-smart-table a.angular2-smart-action-edit-save{color:var(--gauzy-action-success-text)}:host .table-scroll-container ::ng-deep angular2-smart-table a.angular2-smart-action-edit-cancel,:host .table-scroll-container ::ng-deep angular2-smart-table a.angular2-smart-action-delete-delete{color:var(--gauzy-action-danger-text)}:host .table-scroll-container ::ng-deep angular2-smart-table th.angular2-smart-actions,:host .table-scroll-container ::ng-deep angular2-smart-table td.angular2-smart-actions{width:1%;white-space:nowrap}.coming-soon-container{display:flex;flex-direction:column;align-items:center;margin:100px 0}.coming-soon-icon{font-size:50px;color:var(--text-hint-color)}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "component", type: i1.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "component", type: i1.NbCardComponent, selector: "nb-card", inputs: ["size", "status", "accent"] }, { kind: "component", type: i1.NbCardBodyComponent, selector: "nb-card-body" }, { kind: "component", type: i1.NbCardHeaderComponent, selector: "nb-card-header" }, { kind: "component", type: i1.NbIconComponent, selector: "nb-icon", inputs: ["icon", "pack", "options", "status", "config"] }, { kind: "directive", type: i1.NbSpinnerDirective, selector: "[nbSpinner]", inputs: ["nbSpinnerMessage", "nbSpinnerStatus", "nbSpinnerSize", "nbSpinner"] }, { kind: "directive", type: i2.NgxPermissionsDirective, selector: "[ngxPermissionsOnly],[ngxPermissionsExcept]", inputs: ["ngxPermissionsOnly", "ngxPermissionsOnlyThen", "ngxPermissionsOnlyElse", "ngxPermissionsExcept", "ngxPermissionsExceptElse", "ngxPermissionsExceptThen", "ngxPermissionsThen", "ngxPermissionsElse", "ngxPermissionsOnlyAuthorisedStrategy", "ngxPermissionsOnlyUnauthorisedStrategy", "ngxPermissionsExceptUnauthorisedStrategy", "ngxPermissionsExceptAuthorisedStrategy", "ngxPermissionsUnauthorisedStrategy", "ngxPermissionsAuthorisedStrategy"], outputs: ["permissionsAuthorized", "permissionsUnauthorized"] }, { kind: "component", type: i3.HeaderTitleComponent, selector: "ngx-header-title", inputs: ["allowEmployee", "allowOrganization"] }, { kind: "component", type: i4.Angular2SmartTableComponent, selector: "angular2-smart-table", inputs: ["source", "settings"], outputs: ["rowSelect", "userRowSelect", "delete", "edit", "create", "custom", "deleteConfirm", "editConfirm", "editCancel", "createConfirm", "createCancel", "rowHover", "afterGridInit"] }, { kind: "component", type: i3.GauzyButtonActionComponent, selector: "ngx-gauzy-button-action", inputs: ["isDisable", "hasLayoutSelector", "componentName", "buttonTemplate", "buttonTemplateVisible"] }, { kind: "component", type: i3.PaginationV2Component, selector: "ngx-pagination", inputs: ["source", "perPageSelect"], outputs: ["changePage"] }, { kind: "directive", type: i3.SmartTableSettlingDirective, selector: "angular2-smart-table" }, { kind: "directive", type: i3.SmartTableFilterToggleDirective, selector: "angular2-smart-table" }, { kind: "component", type: i3.DynamicTabsComponent, selector: "gz-dynamic-tabs", inputs: ["tabsetId"] }, { kind: "component", type: i3.RecordViewComponent, selector: "ngx-record-view", inputs: ["record", "sections", "placeholder"] }, { kind: "component", type: i3.RecordViewDrawerComponent, selector: "ngx-record-view-drawer", inputs: ["open", "heading", "subtitle"], outputs: ["closed"] }, { kind: "pipe", type: i5.TranslatePipe, name: "translate" }] }); }
};
JobEmployeeComponent = __decorate([
    UntilDestroy(),
    __metadata("design:paramtypes", [])
], JobEmployeeComponent);
export { JobEmployeeComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: JobEmployeeComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-job-employees', providers: [CurrencyPipe, JobSearchStoreService], standalone: false, template: "<nb-card [nbSpinner]=\"loading\" nbSpinnerStatus=\"primary\" nbSpinnerSize=\"large\">\n\t<nb-card-header class=\"header\">\n\t\t<h4>\n\t\t\t<ngx-header-title [allowEmployee]=\"false\">\n\t\t\t\t{{ 'JOB_EMPLOYEE.EMPLOYEES' | translate }}\n\t\t\t</ngx-header-title>\n\t\t</h4>\n\t</nb-card-header>\n\t<nb-card-body class=\"p-0\">\n\t\t<div class=\"gauzy-button-container\">\n\t\t\t<ngx-gauzy-button-action\n\t\t\t\t[hasLayoutSelector]=\"false\"\n\t\t\t\t[isDisable]=\"disableButton\"\n\t\t\t\t[buttonTemplateVisible]=\"visibleButton\"\n\t\t\t\t[buttonTemplate]=\"actionButtons\"\n\t\t\t></ngx-gauzy-button-action>\n\t\t</div>\n\n\t\t<!-- Dynamic Tabs -->\n\t\t<gz-dynamic-tabs [tabsetId]=\"tabsetId\"></gz-dynamic-tabs>\n\t</nb-card-body>\n</nb-card>\n\n<!-- Table Layout Template -->\n<ng-template #tableLayout>\n\t<!-- Check if the user has the 'ORG_JOB_EMPLOYEE_VIEW' permission -->\n\t<ng-template [ngxPermissionsOnly]=\"permGateOrgJobEmployeeView\">\n\t\t<div class=\"table-scroll-container\">\n\t\t\t<!-- Smart Table Component -->\n\t\t\t<angular2-smart-table\n\t\t\t\t[class.ga-table-loading]=\"loading\"\n\t\t\t\tclass=\"cursor-pointer\"\n\t\t\t\t[settings]=\"settingsSmartTable\"\n\t\t\t\t[source]=\"smartTableSource\"\n\t\t\t\t(editConfirm)=\"onEditConfirm($event)\"\n\t\t\t\t(editCancel)=\"onEditCancel($event)\"\n\t\t\t\t(userRowSelect)=\"onSelectEmployee($event)\"\n\t\t\t></angular2-smart-table>\n\t\t</div>\n\t\t<div class=\"pagination-container\">\n\t\t\t@if (smartTableSource) {\n\t\t\t\t<!-- Pagination Component -->\n\t\t\t\t<ngx-pagination [source]=\"smartTableSource\"></ngx-pagination>\n\t\t\t}\n\t\t</div>\n\t</ng-template>\n\n\t<!-- If the user does not have the 'ORG_JOB_EMPLOYEE_VIEW' permission -->\n\t<ng-template [ngxPermissionsExcept]=\"['ORG_JOB_EMPLOYEE_VIEW']\">\n\t\t<div>\n\t\t\t<!-- Content to display if the user does not have the 'ORG_JOB_EMPLOYEE_VIEW' permission -->\n\t\t\t<!-- Placeholder: Add alternate content here -->\n\t\t</div>\n\t</ng-template>\n</ng-template>\n\n<!-- Coming Soon Template -->\n<ng-template #comingSoon>\n\t<div class=\"coming-soon-container\">\n\t\t<nb-icon icon=\"flash-outline\" class=\"coming-soon-icon\"></nb-icon>\n\t\t<div>{{ 'COMING_SOON' | translate }}</div>\n\t</div>\n</ng-template>\n\n<ng-template #actionButtons let-buttonSize=\"buttonSize\" let-selectedItem=\"selectedItem\">\n\t<ng-template [ngxPermissionsOnly]=\"permGateOrgJobEmployeeViewOrgEmployeesEdit\">\n\t\t<div class=\"btn-group actions\">\n\t\t\t<ng-template ngxPermissionsOnly=\"ORG_JOB_EMPLOYEE_VIEW\">\n\t\t\t\t<button\n\t\t\t\t\ttype=\"button\"\n\t\t\t\t\t(click)=\"view(selectedItem)\"\n\t\t\t\t\tsize=\"small\"\n\t\t\t\t\tstatus=\"basic\"\n\t\t\t\t\tclass=\"action primary cursor-pointer\"\n\t\t\t\t\tnbButton\n\t\t\t\t>\n\t\t\t\t\t<nb-icon icon=\"eye-outline\" pack=\"eva\"></nb-icon>\n\t\t\t\t\t<span> {{ 'BUTTONS.VIEW' | translate }} </span>\n\t\t\t\t</button>\n\t\t\t</ng-template>\n\t\t\t<ng-template ngxPermissionsOnly=\"ORG_EMPLOYEES_EDIT\">\n\t\t\t\t<button\n\t\t\t\t\t(click)=\"edit(selectedItem)\"\n\t\t\t\t\tsize=\"small\"\n\t\t\t\t\tstatus=\"basic\"\n\t\t\t\t\tclass=\"action primary cursor-pointer\"\n\t\t\t\t\tnbButton\n\t\t\t\t>\n\t\t\t\t\t<nb-icon icon=\"edit-outline\" pack=\"eva\"></nb-icon>\n\t\t\t\t\t<span>{{ 'BUTTONS.EDIT' | translate }}</span>\n\t\t\t\t</button>\n\t\t\t</ng-template>\n\n\t\t\t<!-- <ng-template ngxPermissionsOnly=\"ORG_EMPLOYEES_EDIT\">\n\t\t\t\t<button\n\t\t\t\t\tstyle=\"cursor: pointer\"\n\t\t\t\t\tstatus=\"basic\"\n\t\t\t\t\tclass=\"action\"\n\t\t\t\t\tsize=\"small\"\n\t\t\t\t\t[nbTooltip]=\"'BUTTONS.DELETE' | translate\"\n\t\t\t\t\tnbButton\n\t\t\t\t>\n\t\t\t\t\t<nb-icon status=\"danger\" icon=\"trash-2-outline\" pack=\"eva\"></nb-icon>\n\t\t\t\t</button>\n\t\t\t</ng-template> -->\n\t\t</div>\n\t</ng-template>\n</ng-template>\n\n<ng-template #visibleButton>\n\t<ng-template ngxPermissionsOnly=\"ORG_EMPLOYEES_EDIT\">\n\t\t<button nbButton status=\"success\" size=\"small\" (click)=\"addNew($event)\">\n\t\t\t<nb-icon icon=\"plus-outline\"> </nb-icon>\n\t\t\t{{ 'BUTTONS.ADD' | translate }}\n\t\t</button>\n\t</ng-template>\n</ng-template>\n\n<!-- Read-only View. The projected content is gated here (not inside the drawer)\n     so the record renderer is built fresh for each entry that is opened. -->\n<ngx-record-view-drawer\n\t[open]=\"!!viewedEmployee\"\n\theading=\"JOB_EMPLOYEE.EMPLOYEE\"\n\t[subtitle]=\"viewedEmployee?.user?.name\"\n\t(closed)=\"closeView()\"\n>\n\t@if (viewedEmployee) {\n\t\t<ngx-record-view [record]=\"viewedEmployee\" [sections]=\"viewSections\"></ngx-record-view>\n\t}\n</ngx-record-view-drawer>\n", styles: [".action{box-shadow:inset 0 0 0 1px var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));border:none}.action[nbButton].appearance-filled.status-basic{background-color:var(--gauzy-card-2)}.action.info[nbButton].appearance-filled.status-basic,.action.info-text-1[nbButton].appearance-filled.status-basic{color:var(--gauzy-action-info-text)}.action.secondary{color:var(--text-hint-color)}.action.success{color:var(--gauzy-action-success-text)}.action.warning{color:var(--gauzy-action-warning-text)}.action.orange{color:#ffab2d}.action.primary{color:var(--text-primary-color)}.action.primary.soft[nbButton].appearance-filled.status-basic{background-color:#6e49e81a}.action.select-nb ::ng-deep{box-shadow:none}.action.select-nb ::ng-deep .select-button{box-shadow:inset 0 0 0 1px var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));background:var(--gauzy-card-2)}button{margin:5px}.actions{background:var(--gauzy-card-2);border-radius:var(--button-rectangle-border-radius);padding:2px 4px!important}.gauzy-button-container{display:flex;justify-content:flex-end;width:100%;padding-bottom:0}.card-custom-header{display:flex;flex-direction:column;width:100%;padding-bottom:0}:host ::ng-deep input{border-radius:var(--border-radius);box-shadow:inset 0 0 0 1px var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18))}:host{--gauzy-table-font-size: .6875rem;--gauzy-table-line-height: 1rem;--gauzy-table-cell-padding-y: .1875rem;--gauzy-table-cell-padding-x: .4375rem;--gauzy-table-header-font-size: .75rem;--gauzy-table-header-line-height: .8125rem;--gauzy-table-header-padding-y: .3125rem;--gauzy-table-header-padding-x: .4375rem;--gauzy-table-filter-padding-y: .1875rem;--gauzy-table-control-height: 1.5rem;--gauzy-table-badge-height: 1rem;--gauzy-table-badge-radius: .25rem;--gauzy-table-badge-padding-y: .1875rem;--gauzy-table-chip-font-size: .625rem;--gauzy-table-chip-line-height: .75rem;--gauzy-table-chip-padding-y: 0;--gauzy-table-chip-padding-x: .3125rem;--gauzy-table-chip-gap: .125rem;--gauzy-table-chip-block-gap: .5rem;--gauzy-people-avatar-size: 1.25rem;--gauzy-people-font-size: .75rem;--gauzy-people-chip-padding-y: .25rem;height:100%}:host nb-card{height:100%;background-color:var(--gauzy-card-2)}:host nb-card-body{display:flex;flex-direction:column;height:calc(100vh - 13.5rem)!important;overflow:unset;background-color:unset}:host gz-dynamic-tabs{display:flex;flex-direction:column;flex:1 1 auto;min-height:0}:host .gauzy-button-container{--button-small-icon-size: .875rem;--button-small-icon-offset: .25rem;--button-small-icon-vertical-margin: 0;--button-filled-small-padding: .25rem .625rem;--button-outline-small-padding: .25rem .625rem;--button-ghost-small-padding: .25rem .625rem;--icon-button-filled-small-padding: .25rem;--icon-button-outline-small-padding: .25rem;--icon-button-ghost-small-padding: .25rem;position:absolute;top:0}[dir=ltr] :host .gauzy-button-container{right:18px}[dir=rtl] :host .gauzy-button-container{left:18px}:host .gauzy-button-container{box-sizing:content-box;padding:var(--tabset-tab-padding);padding-inline:0;height:var(--tabset-tab-text-line-height)}@media only screen and (max-width:1532px){:host .gauzy-button-container{padding-block:1.1428571429rem;padding-inline:0}}:host .gauzy-button-container{display:flex;align-items:center;justify-content:flex-end;pointer-events:none}:host .gauzy-button-container>*{pointer-events:auto}:host .gauzy-button-container ::ng-deep .actions-container{padding:0}:host .gauzy-button-container ::ng-deep .actions-container button{margin-block:0}:host ::ng-deep nb-tabset{display:flex;flex-direction:column;height:100%}:host ::ng-deep nb-tabset nb-tab.content-active{flex:1 1 auto;height:auto;min-height:0}:host ::ng-deep nb-tabset{flex:1 1 auto;min-height:0;background-color:var(--gauzy-card-2)}:host ::ng-deep nb-tabset .tab-link{--tabset-tab-text-font-size: var(--gauzy-table-header-font-size, .75rem);--icon-font-size: var(--tabset-tab-text-line-height);--icon-line-height: var(--tabset-tab-text-line-height);--icon-width: var(--tabset-tab-text-line-height);--icon-height: var(--tabset-tab-text-line-height)}[dir=ltr] :host ::ng-deep nb-tabset .tab-link nb-icon+span{margin-left:.375rem}[dir=rtl] :host ::ng-deep nb-tabset .tab-link nb-icon+span{margin-right:.375rem}:host ::ng-deep nb-tabset nb-tab.content-active{display:flex;flex-direction:column;overflow:unset;border-radius:0 0 var(--border-radius) var(--border-radius);background-color:var(--gauzy-card-2)}[dir=ltr] :host ::ng-deep nb-tabset nb-tab.content-active{padding:1rem .5rem 1rem 18px}[dir=rtl] :host ::ng-deep nb-tabset nb-tab.content-active{padding:1rem 18px 1rem .5rem}:host .table-scroll-container{background:var(--gauzy-card-1, var(--background-basic-color-1));box-shadow:inset 0 0 0 1px var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));border-radius:var(--border-radius, .5rem);flex:1 1 auto;min-height:0;max-height:unset}:host .pagination-container{display:flex;justify-content:flex-end;flex-wrap:wrap;gap:.5rem;margin-top:.25rem}@media(max-width:767px){:host .pagination-container{justify-content:center}}:host .pagination-container ::ng-deep ngx-pagination{width:auto}:host .pagination-container ::ng-deep ngx-pagination nav{margin-top:0!important;gap:.75rem}:host .pagination-container ::ng-deep ngx-pagination .pagination{gap:.125rem;font-size:.75rem}:host .pagination-container ::ng-deep ngx-pagination li a,:host .pagination-container ::ng-deep ngx-pagination li span{margin:0}:host .pagination-container ::ng-deep ngx-pagination li span{display:flex;align-items:center;justify-content:center;min-width:1.75rem;height:1.75rem;padding:0 .375rem;font-size:.75rem;line-height:1;border-radius:var(--gauzy-radius-sm, .375rem)}:host .pagination-container ::ng-deep ngx-pagination li span.icon{padding:0;background:var(--gauzy-hover-tint, rgba(126, 126, 143, .12));box-shadow:none;border-radius:var(--gauzy-radius-sm, .375rem)}:host .pagination-container ::ng-deep ngx-pagination li span.icon nb-icon{font-size:.875rem}:host .pagination-container ::ng-deep ngx-pagination li:hover span.icon{background:var(--gauzy-active-tint, rgba(126, 126, 143, .2))}:host .pagination-container ::ng-deep ngx-pagination li.disabled{opacity:.4;pointer-events:none}:host .pagination-container ::ng-deep ngx-pagination li.active span{width:auto;min-width:1.75rem;height:1.75rem;padding:0 .375rem!important;border-radius:var(--gauzy-radius-sm, .375rem);line-height:1;background:var(--gauzy-active-tint, rgba(126, 126, 143, .2));color:var(--text-basic-color);font-weight:600}:host .pagination-container ::ng-deep ngx-pagination>nav>div{gap:.5rem;font-size:.75rem;color:var(--gauzy-text-color-2, var(--text-hint-color))}:host .pagination-container ::ng-deep ngx-pagination nb-select .select-button{min-width:4rem;height:1.75rem;padding:0 .5rem;border-radius:var(--gauzy-radius-sm, .375rem);font-size:.75rem}:host .table-scroll-container ::ng-deep angular2-smart-table tr.angular2-smart-titles>th{border-bottom:1px solid var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));vertical-align:middle}:host .table-scroll-container ::ng-deep angular2-smart-table tbody tr{background:transparent}:host .table-scroll-container ::ng-deep angular2-smart-table tbody tr>td{vertical-align:middle}:host .table-scroll-container ::ng-deep angular2-smart-table tbody tr:hover:not(.selected){background:var(--gauzy-hover-tint, rgba(126, 126, 143, .12))!important}:host .table-scroll-container ::ng-deep angular2-smart-table tbody tr.selected{background:var(--gauzy-active-tint, rgba(126, 126, 143, .2))!important;box-shadow:none!important}:host .table-scroll-container ::ng-deep angular2-smart-table ngx-toggle-switcher{--toggle-width: 1.5rem;--toggle-height: .75rem;--toggle-switcher-size: .5625rem;--toggle-primary-checked-switcher-background-color: var(--text-hint-color)}:host .table-scroll-container ::ng-deep angular2-smart-table ngx-toggle-switcher .toggle.checked .toggle-switcher{background-color:var(--text-control-color)}:host .table-scroll-container ::ng-deep angular2-smart-table input.form-control{width:4.5rem;max-width:100%;min-height:0!important;height:calc(var(--gauzy-table-line-height, 1rem) + 2px)!important;max-height:calc(var(--gauzy-table-line-height, 1rem) + 2px)!important;padding:0 var(--gauzy-table-cell-padding-x, .4375rem)!important;line-height:1!important;font-size:var(--gauzy-table-font-size, .6875rem);color:var(--text-basic-color);background-color:var(--gauzy-sidebar-background-3, var(--input-basic-background-color));border:none;border-radius:var(--gauzy-radius-sm, .375rem);-moz-appearance:textfield;appearance:textfield}:host .table-scroll-container ::ng-deep angular2-smart-table input.form-control::-webkit-outer-spin-button,:host .table-scroll-container ::ng-deep angular2-smart-table input.form-control::-webkit-inner-spin-button{-webkit-appearance:none;appearance:none;margin:0}:host .table-scroll-container ::ng-deep angular2-smart-table input.form-control:focus{outline:none;box-shadow:inset 0 0 0 1px var(--color-primary-default)}:host .table-scroll-container ::ng-deep angular2-smart-table angular2-st-tbody-edit-delete,:host .table-scroll-container ::ng-deep angular2-smart-table angular2-st-tbody-save-cancel{display:flex;align-items:center;gap:.125rem}:host .table-scroll-container ::ng-deep angular2-smart-table a.angular2-smart-action{width:calc(var(--gauzy-table-line-height, 1rem) + 2 * var(--gauzy-table-cell-padding-y, .1875rem));height:calc(var(--gauzy-table-line-height, 1rem) + 2 * var(--gauzy-table-cell-padding-y, .1875rem));padding:0;font-size:var(--gauzy-table-header-font-size, .75rem)!important;line-height:1;border:none;background-color:transparent;border-radius:var(--gauzy-radius-sm, .375rem);color:var(--text-hint-color)}:host .table-scroll-container ::ng-deep angular2-smart-table a.angular2-smart-action:hover{background-color:var(--gauzy-hover-tint, rgba(126, 126, 143, .12))}:host .table-scroll-container ::ng-deep angular2-smart-table a.angular2-smart-action .ga-action-glyph{display:flex;width:.875rem;height:.875rem}:host .table-scroll-container ::ng-deep angular2-smart-table a.angular2-smart-action .ga-action-glyph svg{width:100%;height:100%}:host .table-scroll-container ::ng-deep angular2-smart-table a.angular2-smart-action-edit-edit{color:var(--text-primary-color)}:host .table-scroll-container ::ng-deep angular2-smart-table a.angular2-smart-action-edit-save{color:var(--gauzy-action-success-text)}:host .table-scroll-container ::ng-deep angular2-smart-table a.angular2-smart-action-edit-cancel,:host .table-scroll-container ::ng-deep angular2-smart-table a.angular2-smart-action-delete-delete{color:var(--gauzy-action-danger-text)}:host .table-scroll-container ::ng-deep angular2-smart-table th.angular2-smart-actions,:host .table-scroll-container ::ng-deep angular2-smart-table td.angular2-smart-actions{width:1%;white-space:nowrap}.coming-soon-container{display:flex;flex-direction:column;align-items:center;margin:100px 0}.coming-soon-icon{font-size:50px;color:var(--text-hint-color)}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }], ctorParameters: () => [], propDecorators: { tableLayout: [{
                type: ViewChild,
                args: ['tableLayout', { static: true }]
            }], comingSoon: [{
                type: ViewChild,
                args: ['comingSoon', { static: true }]
            }], actionButtons: [{
                type: ViewChild,
                args: ['actionButtons', { static: true }]
            }], visibleButton: [{
                type: ViewChild,
                args: ['visibleButton', { static: true }]
            }] } });
//# sourceMappingURL=job-employee.component.js.map