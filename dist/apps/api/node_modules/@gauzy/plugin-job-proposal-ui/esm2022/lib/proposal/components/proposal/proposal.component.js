import { __decorate, __metadata } from "tslib";
import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { combineLatest, Subject } from 'rxjs';
import { debounceTime, filter, tap } from 'rxjs/operators';
import { NbDialogService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ComponentLayoutStyleEnum, ProposalStatusEnum, PermissionsEnum } from '@gauzy/contracts';
import { DateRangePickerBuilderService, ErrorHandlingService, ProposalsService, ServerDataSource, Store, ToastrService } from '@gauzy/ui-core/core';
import { API_PREFIX, ComponentEnum, distinctUntilChange, toUTC } from '@gauzy/ui-core/common';
import { ActionConfirmationComponent, ClickableLinkComponent, ContactLinksComponent, DateViewComponent, DeleteConfirmationComponent, EmployeeLinksComponent, InputFilterComponent, NotesWithTagsComponent, OrganizationContactFilterComponent, PaginationFilterBaseComponent, StatusBadgeComponent, TagsColorFilterComponent, TagsOnlyComponent, getAdjustDateRangeFutureAllowed } from '@gauzy/ui-core/shared';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
import * as i2 from "@gauzy/ui-core/core";
import * as i3 from "@angular/router";
import * as i4 from "@nebular/theme";
import * as i5 from "@angular/common/http";
import * as i6 from "@angular/common";
import * as i7 from "ngx-permissions";
import * as i8 from "@gauzy/ui-core/shared";
import * as i9 from "angular2-smart-table";
let ProposalComponent = class ProposalComponent extends PaginationFilterBaseComponent {
    constructor(translateService, _store, _dateRangePickerBuilderService, _router, _proposalsService, _toastrService, _dialogService, _errorHandlingService, _httpClient) {
        super(translateService);
        this.translateService = translateService;
        this._store = _store;
        this._dateRangePickerBuilderService = _dateRangePickerBuilderService;
        this._router = _router;
        this._proposalsService = _proposalsService;
        this._toastrService = _toastrService;
        this._dialogService = _dialogService;
        this._errorHandlingService = _errorHandlingService;
        this._httpClient = _httpClient;
        this.proposals = [];
        this.dataLayoutStyle = ComponentLayoutStyleEnum.TABLE;
        this.componentLayoutStyleEnum = ComponentLayoutStyleEnum;
        this.viewComponentName = ComponentEnum.PROPOSALS;
        this.proposalStatusEnum = ProposalStatusEnum;
        // Initialized so the header stat cards never render a blank value while
        // the first page of data is still loading.
        this.successRate = '0 %';
        this.totalProposals = 0;
        this.countAccepted = 0;
        /** Monotonic guard so an older statistics response cannot overwrite a newer one. */
        this.statisticsRequestId = 0;
        this.loading = false;
        this.disableButton = true;
        this.proposals$ = this.subject$;
        this._refresh$ = new Subject();
        /**
         * Maps a proposal status to a text label and a corresponding badge class.
         * @param cell - The proposal status.
         * @returns {object} - An object containing the text label and badge class.
         */
        this.statusMapper = (cell) => {
            let badgeClass;
            let statusText;
            if (cell === ProposalStatusEnum.SENT) {
                badgeClass = 'warning';
                statusText = this.getTranslation('BUTTONS.SENT');
            }
            else {
                badgeClass = 'success';
                statusText = this.getTranslation('BUTTONS.ACCEPTED');
            }
            return {
                text: statusText,
                class: badgeClass
            };
        };
        /**
         * Maps properties of an IProposal object to a new object with a modified structure.
         *
         * @param item - The IProposal object to be mapped.
         * @returns {object} - The mapped object.
         */
        this.proposalMapper = (item) => ({
            id: item.id,
            valueDate: item.valueDate,
            jobPostUrl: item.jobPostUrl,
            jobTitle: item.jobPostContent
                .toString()
                .replace(/<[^>]*(>|$)|&nbsp;/g, '')
                .split(/[\s,\n]+/)
                .slice(0, 3)
                .join(' '),
            jobPostContent: item.jobPostContent,
            proposalContent: item.proposalContent,
            tags: item.tags,
            status: item.status,
            statusBadge: this.statusMapper(item.status),
            author: item.employee,
            organizationContact: item.organizationContact ? item.organizationContact : null
        });
        this.setView();
    }
    ngOnInit() {
        this._loadSmartTableSettings();
        this._applyTranslationOnSmartTable();
        // Subscribe to changes in the proposals$ observable stream
        this.proposals$
            .pipe(
        // Wait for 100 milliseconds to debounce rapid changes
        debounceTime(100), 
        // Clear the selected item
        tap(() => this.clearItem()), 
        // Retrieve and update the proposals
        tap(() => this.getProposals()), 
        // Unsubscribe when the component is destroyed
        untilDestroyed(this))
            .subscribe();
        // Subscribe to changes in the pagination$ observable stream
        this.pagination$
            .pipe(
        // Wait for 100 milliseconds to debounce rapid changes
        debounceTime(100), 
        // Only react when the pagination value changes
        distinctUntilChange(), 
        // Trigger a refresh of proposals
        tap(() => this.proposals$.next(true)), 
        // Unsubscribe when the component is destroyed
        untilDestroyed(this))
            .subscribe();
        // Combine observable streams to react to changes in organization, date range, and employee
        const storeOrganization$ = this._store.selectedOrganization$;
        const storeDateRange$ = this._dateRangePickerBuilderService.selectedDateRange$;
        const storeEmployee$ = this._store.selectedEmployee$;
        combineLatest([storeOrganization$, storeDateRange$, storeEmployee$])
            .pipe(
        // Wait for 500 milliseconds to debounce rapid changes
        debounceTime(500), 
        // Only react when both organization and date range are available
        filter(([organization, dateRange]) => !!organization && !!dateRange), 
        // Only react when there's a change in the combined values
        distinctUntilChange(), 
        // Update component properties based on the latest values
        tap(([organization, dateRange, employee]) => {
            this.organization = organization;
            this.selectedDateRange = dateRange;
            this.selectedEmployeeId = employee ? employee.id : null;
        }), 
        // Trigger refresh actions
        tap(() => this._refresh$.next(true)), tap(() => this.proposals$.next(true)), 
        // Unsubscribe when the component is destroyed
        untilDestroyed(this))
            .subscribe();
        // Subscribe to changes in the _refresh$ observable stream
        this._refresh$
            .pipe(
        // Only react when the data layout style is CARDS_GRID
        filter(() => this.dataLayoutStyle === ComponentLayoutStyleEnum.CARDS_GRID), 
        // Trigger a refresh of pagination
        tap(() => this.refreshPagination()), 
        // Reset the proposals array
        tap(() => (this.proposals = [])), 
        // Unsubscribe when the component is destroyed
        untilDestroyed(this))
            .subscribe();
    }
    ngAfterViewInit() {
        // Check if a user exists in the store and the user lacks a specific permission
        if (this._store.user && !this._store.hasPermission(PermissionsEnum.CHANGE_SELECTED_EMPLOYEE)) {
            // Delete the 'author' column from the smartTableSettings.columns object
            delete this.smartTableSettings['columns']['author'];
            // Clone the smartTableSettings object to trigger change detection
            this.smartTableSettings = Object.assign({}, this.smartTableSettings);
        }
    }
    /**
     * Sets the view based on the component layout.
     */
    setView() {
        this._store
            .componentLayout$(this.viewComponentName)
            .pipe(distinctUntilChange(), tap((componentLayout) => (this.dataLayoutStyle = componentLayout)), tap(() => this.refreshPagination()), filter((componentLayout) => componentLayout === ComponentLayoutStyleEnum.CARDS_GRID), 
        // If the layout style is CARDS_GRID, reset the proposals array
        tap(() => (this.proposals = [])), 
        // Trigger a refresh of proposals
        tap(() => this.proposals$.next(true)), untilDestroyed(this))
            .subscribe();
    }
    /**
     * Navigates to the edit page of a proposal.
     * @param selectedItem - The proposal item for which edit page is to be displayed.
     */
    edit(selectedItem) {
        // If a proposal item is selected, mark it as selected
        if (selectedItem) {
            this.selectProposal({
                isSelected: true,
                data: selectedItem
            });
        }
        // If a proposal is selected, navigate to its edit page
        if (this.selectedProposal) {
            this._router.navigate([`/pages/sales/proposals/edit`, this.selectedProposal.id]);
        }
    }
    /**
     * Navigates to the details page of a proposal.
     * @param selectedItem - The proposal item for which details are to be displayed.
     */
    details(selectedItem) {
        // If a proposal item is selected, mark it as selected
        if (selectedItem) {
            this.selectProposal({
                isSelected: true,
                data: selectedItem
            });
        }
        // If a proposal is selected, navigate to its details page
        if (this.selectedProposal) {
            this._router.navigate([`/pages/sales/proposals/details`, this.selectedProposal.id]);
        }
    }
    /**
     * Deletes a proposal after user confirmation.
     * @param selectedItem - The proposal item to be deleted.
     */
    delete(selectedItem) {
        // If a proposal item is selected, mark it as selected
        if (selectedItem) {
            this.selectProposal({
                isSelected: true,
                data: selectedItem
            });
        }
        // Open the dialog for user confirmation
        const dialogRef = this._dialogService.open(DeleteConfirmationComponent, {
            context: {
                recordType: 'Proposal'
            }
        });
        // Wait for the dialog to close and get the result
        dialogRef.onClose.pipe(untilDestroyed(this)).subscribe(async (dialogResult) => {
            try {
                // If there is a result and a proposal is selected
                if (dialogResult) {
                    if (!this.selectedProposal) {
                        return;
                    }
                    const { id: proposalId } = this.selectedProposal;
                    // Delete the proposal
                    await this._proposalsService.delete(proposalId);
                    // Display a success message
                    this._toastrService.success('NOTES.PROPOSALS.DELETE_PROPOSAL');
                }
            }
            catch (error) {
                // Handle errors during the process
                this._errorHandlingService.handleError(error);
            }
            finally {
                // Trigger refresh actions
                this._refresh$.next(true);
                this.proposals$.next(true);
            }
        });
    }
    /**
     * Switches the status of a proposal to "ACCEPTED" after user confirmation.
     * @param selectedItem - The proposal item to be switched.
     */
    switchToAccepted(selectedItem) {
        // If a proposal item is selected, mark it as selected
        if (selectedItem) {
            this.selectProposal({
                isSelected: true,
                data: selectedItem
            });
        }
        // Open the dialog for user confirmation
        const dialogRef = this._dialogService.open(ActionConfirmationComponent, {
            context: {
                recordType: 'status'
            }
        });
        // Wait for the dialog to close and get the result
        dialogRef.onClose.pipe(untilDestroyed(this)).subscribe(async (dialogResult) => {
            try {
                // If there is a result and a proposal is selected
                if (dialogResult) {
                    if (!this.selectedProposal) {
                        return;
                    }
                    const { id: organizationId, tenantId } = this.organization;
                    const { id: proposalId } = this.selectedProposal;
                    // Update the proposal status to "ACCEPTED"
                    await this._proposalsService.update(proposalId, {
                        status: ProposalStatusEnum.ACCEPTED,
                        organizationId,
                        tenantId
                    });
                    // TODO: Translate the success message
                    this._toastrService.success('NOTES.PROPOSALS.PROPOSAL_ACCEPTED');
                }
            }
            catch (error) {
                // Handle errors during the process
                this._errorHandlingService.handleError(error);
            }
            finally {
                // Trigger refresh actions
                this._refresh$.next(true);
                this.proposals$.next(true);
            }
        });
    }
    /**
     * Switches the status of a proposal to "SENT" after user confirmation.
     * @param selectedItem - The proposal item to be switched.
     */
    switchToSent(selectedItem) {
        // If a proposal item is selected, mark it as selected
        if (selectedItem) {
            this.selectProposal({
                isSelected: true,
                data: selectedItem
            });
        }
        // Open the dialog for user confirmation
        const dialogRef = this._dialogService.open(ActionConfirmationComponent, {
            context: {
                recordType: 'status'
            }
        });
        // Wait for the dialog to close and get the result
        dialogRef.onClose.pipe(untilDestroyed(this)).subscribe(async (dialogResult) => {
            try {
                // If there is a result, proceed with creating a new income
                if (dialogResult) {
                    if (!this.selectedProposal) {
                        return;
                    }
                    const { id: organizationId, tenantId } = this.organization;
                    const { id: proposalId } = this.selectedProposal;
                    // Update the proposal status to "SENT"
                    await this._proposalsService.update(proposalId, {
                        status: ProposalStatusEnum.SENT,
                        organizationId,
                        tenantId
                    });
                    this._toastrService.success('NOTES.PROPOSALS.PROPOSAL_SENT');
                }
            }
            catch (error) {
                // Handle errors during the process
                this._errorHandlingService.handleError(error);
            }
            finally {
                this._refresh$.next(true);
                this.proposals$.next(true);
            }
        });
    }
    /**
     * Load Smart Table settings to configure the component.
     */
    _loadSmartTableSettings() {
        const pagination = this.getPagination();
        this.smartTableSettings = {
            actions: false,
            editable: true,
            selectedRowIndex: -1,
            pager: {
                display: false,
                perPage: pagination ? pagination.itemsPerPage : 10
            },
            noDataMessage: this.getTranslation('SM_TABLE.NO_DATA.PROPOSAL'),
            columns: {
                valueDate: {
                    title: this.getTranslation('SM_TABLE.DATE'),
                    type: 'custom',
                    width: '10%',
                    isFilterable: false,
                    sortDirection: 'desc',
                    renderComponent: DateViewComponent,
                    componentInitFunction: (instance, cell) => {
                        instance.rowData = cell.getRow().getData();
                        instance.value = cell.getValue();
                    }
                },
                jobTitle: {
                    title: this.getTranslation('SM_TABLE.JOB_TITLE'),
                    type: this.dataLayoutStyle === ComponentLayoutStyleEnum.TABLE ? 'custom' : 'string',
                    width: '25%',
                    renderComponent: this.dataLayoutStyle === ComponentLayoutStyleEnum.TABLE ? NotesWithTagsComponent : null,
                    componentInitFunction: (instance, cell) => {
                        instance.rowData = cell.getRow().getData();
                        instance.value = cell.getValue();
                    },
                    filter: {
                        type: 'custom',
                        component: InputFilterComponent
                    },
                    filterFunction: (value) => {
                        this.setFilter({ field: 'jobPostContent', search: value });
                    }
                },
                jobPostUrl: {
                    title: this.getTranslation('SM_TABLE.JOB_POST_URL'),
                    type: 'custom', // Set column type to 'custom'
                    width: '25%',
                    isFilterable: false,
                    renderComponent: ClickableLinkComponent,
                    componentInitFunction: (instance, cell) => {
                        instance.rowData = cell.getRow().getData();
                        instance.value = cell.getValue();
                        instance.href = 'jobPostUrl';
                    }
                },
                organizationContact: {
                    title: this.getTranslation('SM_TABLE.CONTACT_NAME'),
                    type: 'custom',
                    width: '20%',
                    renderComponent: ContactLinksComponent,
                    componentInitFunction: (instance, cell) => {
                        instance.rowData = cell.getRow().getData();
                        instance.value = cell.getRawValue();
                    },
                    filter: {
                        type: 'custom',
                        component: OrganizationContactFilterComponent
                    },
                    filterFunction: (value) => {
                        this.setFilter({
                            field: 'organizationContactId',
                            search: value?.id || null
                        });
                    }
                },
                author: {
                    title: this.getTranslation('SM_TABLE.AUTHOR'),
                    type: 'custom',
                    width: '20%',
                    isFilterable: false,
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
                statusBadge: {
                    title: this.getTranslation('SM_TABLE.STATUS'),
                    type: 'custom',
                    width: '5%',
                    class: 'text-center',
                    isFilterable: false,
                    renderComponent: StatusBadgeComponent,
                    componentInitFunction: (instance, cell) => {
                        instance.value = cell.getRawValue();
                    }
                }
            }
        };
        if (this.dataLayoutStyle === ComponentLayoutStyleEnum.CARDS_GRID) {
            this.smartTableSettings['columns']['tags'] = {
                title: this.getTranslation('SM_TABLE.TAGS'),
                type: 'custom',
                width: '20%',
                class: 'align-row',
                renderComponent: TagsOnlyComponent,
                componentInitFunction: (instance, cell) => {
                    instance.rowData = cell.getRow().getData();
                    instance.value = cell.getRawValue();
                },
                filter: {
                    type: 'custom',
                    component: TagsColorFilterComponent
                },
                filterFunction: (tags) => {
                    const tagIds = [];
                    for (const tag of tags) {
                        tagIds.push(tag.id);
                    }
                    this.setFilter({ field: 'tags', search: tagIds });
                },
                isSortable: false
            };
        }
    }
    /**
     * Handles the selection of a proposal.
     * @param isSelected - A boolean indicating whether the proposal is selected.
     * @param data - The proposal data.
     */
    selectProposal({ isSelected, data }) {
        // Update the disableButton property based on the isSelected value
        this.disableButton = !isSelected;
        // Update the selectedProposal property based on the isSelected value
        this.selectedProposal = isSelected ? data : null;
    }
    /*
     * Register Smart Table Source Config
     */
    setSmartTableSource() {
        if (!this.organization) {
            return;
        }
        this.loading = true;
        const { id: organizationId, tenantId } = this.organization;
        const { startDate, endDate } = getAdjustDateRangeFutureAllowed(this.selectedDateRange);
        this.smartTableSource = new ServerDataSource(this._httpClient, {
            endPoint: `${API_PREFIX}/proposal/pagination`,
            relations: ['organization', 'employee', 'employee.user', 'tags', 'organizationContact'],
            join: {
                ...(this.filters.join ? this.filters.join : {})
            },
            where: {
                organizationId,
                tenantId,
                ...(this.selectedEmployeeId ? { employeeId: this.selectedEmployeeId } : {}),
                valueDate: {
                    startDate: toUTC(startDate).format('YYYY-MM-DD HH:mm:ss'),
                    endDate: toUTC(endDate).format('YYYY-MM-DD HH:mm:ss')
                },
                ...(this.filters.where ? this.filters.where : {})
            },
            resultMap: (proposal) => this.proposalMapper(proposal),
            finalize: () => {
                // Calculate the statistics
                this.calculateStatistics();
                // Set pagination
                this.setPagination({
                    ...this.getPagination(),
                    totalItems: this.smartTableSource.count()
                });
                this.loading = false;
            }
        });
    }
    /**
     * Calculates and updates statistics related to proposals.
     *
     * Over the whole filtered set, not the current page: the old version read
     * `smartTableSource.getData()`, so with server pagination the cards
     * described whichever page happened to be loaded. One relation-free query
     * scoped by the same org/employee/date-range window the table uses keeps
     * the numbers honest; it is bounded by the selected date range.
     */
    async calculateStatistics() {
        if (!this.organization) {
            return;
        }
        const { id: organizationId, tenantId } = this.organization;
        const { startDate, endDate } = getAdjustDateRangeFutureAllowed(this.selectedDateRange);
        // Overlapping refreshes resolve out of order; only the newest request
        // may write the cards, or stale criteria overwrite fresh values.
        const requestId = ++this.statisticsRequestId;
        try {
            const { items, total } = await this._proposalsService.getAll([], {
                organizationId,
                tenantId,
                ...(this.selectedEmployeeId ? { employeeId: this.selectedEmployeeId } : {}),
                valueDate: {
                    startDate: toUTC(startDate).format('YYYY-MM-DD HH:mm:ss'),
                    endDate: toUTC(endDate).format('YYYY-MM-DD HH:mm:ss')
                },
                // The same column filters the table query applies — without them
                // the cards would describe a different proposal set than the rows.
                ...(this.filters.where ? this.filters.where : {})
            });
            if (requestId !== this.statisticsRequestId) {
                return;
            }
            this.totalProposals = total;
            this.countAccepted = items.filter((proposal) => proposal.status === ProposalStatusEnum.ACCEPTED).length;
            this.successRate = this.totalProposals
                ? `${((this.countAccepted / this.totalProposals) * 100).toFixed(0)} %`
                : '0 %';
        }
        catch {
            // The cards are decoration on a list page — a failed aggregate must
            // never take the table down with it. The last shown values stay.
        }
    }
    /**
     * Retrieves proposals, sets up smart table source, and updates component state.
     * @returns {Promise<void>} A Promise that resolves when the operation is complete.
     */
    async getProposals() {
        // Check if 'organization' is not defined
        if (!this.organization) {
            return; // If not defined, exit the function
        }
        try {
            // Set up the smart table source
            this.setSmartTableSource();
            // Get current pagination settings
            const { activePage, itemsPerPage } = this.getPagination();
            // Set paging and sorting for the smart table source
            this.smartTableSource.setPaging(activePage, itemsPerPage, false);
            // Set sort for the smart table source
            this.smartTableSource.setSort([
                {
                    field: 'valueDate',
                    direction: 'desc'
                }
            ], false);
            // If the layout style is GRID, initiate GRID view pagination
            if (this.dataLayoutStyle === ComponentLayoutStyleEnum.CARDS_GRID) {
                // If the layout style is GRID, initiate GRID view pagination
                await this.smartTableSource.getElements();
                // Update the 'proposals' array with the retrieved data
                this.proposals.push(...this.smartTableSource.getData());
                // Set pagination information based on the smart table source
                this.setPagination({
                    ...this.getPagination(),
                    totalItems: this.smartTableSource.count()
                });
            }
        }
        catch (error) {
            // Handle errors by displaying a danger toastr message
            this._errorHandlingService.handleError(error);
        }
    }
    /**
     * Applies translation updates on the smart table when the language changes.
     */
    _applyTranslationOnSmartTable() {
        // Subscribe to the onLangChange event from the translateService
        this.translateService.onLangChange
            .pipe(
        // Trigger the _loadSmartTableSettings method when the language changes
        tap(() => this._loadSmartTableSettings()), 
        // Unsubscribe when the component is destroyed to avoid memory leaks
        untilDestroyed(this))
            .subscribe();
    }
    /*
     * Clear selected item
     */
    clearItem() {
        this.selectProposal({ isSelected: false, data: null });
    }
    ngOnDestroy() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ProposalComponent, deps: [{ token: i1.TranslateService }, { token: i2.Store }, { token: i2.DateRangePickerBuilderService }, { token: i3.Router }, { token: i2.ProposalsService }, { token: i2.ToastrService }, { token: i4.NbDialogService }, { token: i2.ErrorHandlingService }, { token: i5.HttpClient }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: ProposalComponent, isStandalone: false, selector: "ga-proposal-list", viewQueries: [{ propertyName: "actionButtons", first: true, predicate: ["actionButtons"], descendants: true, static: true }, { propertyName: "visibleButton", first: true, predicate: ["visibleButton"], descendants: true, static: true }], usesInheritance: true, ngImport: i0, template: "<nb-card>\n\t<nb-card-header class=\"card-custom-header\">\n\t\t<!-- Title block: the heading only (the breadcrumb trail is parked under it\n\t\t     at runtime by ngx-header-title). -->\n\t\t<div class=\"card-header-title\">\n\t\t\t<h4>\n\t\t\t\t<ngx-header-title>\n\t\t\t\t\t{{ 'PROPOSALS_PAGE.HEADER' | translate }}\n\t\t\t\t</ngx-header-title>\n\t\t\t</h4>\n\t\t</div>\n\n\t\t<!-- Statistics Template -->\n\t\t<ng-container [ngTemplateOutlet]=\"statisticsTemplate\"></ng-container>\n\n\t\t<!-- Action side of the one-line page header (see `.ga-page-header` in\n\t\t     ui-core/static/styles/_overrides.scss): the secondary \"Manage Templates\"\n\t\t     sits with `+ Add`, the action strip and the view selector, so all of them\n\t\t     are centred on the same axis as the title. It used to be a sibling of the\n\t\t     <h4> inside the title block, where `.card-header-title`'s own\n\t\t     `space-between` stranded it mid-header, on the title's line but attached\n\t\t     to neither side of it. -->\n\t\t<div class=\"gauzy-button-container\">\n\t\t\t<ng-template ngxPermissionsOnly=\"ORG_PROPOSAL_TEMPLATES_VIEW\">\n\t\t\t\t<button\n\t\t\t\t\tnbButton\n\t\t\t\t\tstatus=\"basic\"\n\t\t\t\t\tclass=\"action primary soft\"\n\t\t\t\t\t[routerLink]=\"['/pages/jobs/proposal-template']\"\n\t\t\t\t\tsize=\"small\"\n\t\t\t\t>\n\t\t\t\t\t<nb-icon icon=\"file-text-outline\"></nb-icon>\n\t\t\t\t\t{{ 'BUTTONS.MANAGE_TEMPLATES' | translate | titlecase }}\n\t\t\t\t</button>\n\t\t\t</ng-template>\n\t\t\t<ngx-gauzy-button-action\n\t\t\t\t[buttonTemplateVisible]=\"visibleButton\"\n\t\t\t\t[isDisable]=\"disableButton\"\n\t\t\t\t[buttonTemplate]=\"actionButtons\"\n\t\t\t\t[componentName]=\"viewComponentName\"\n\t\t\t></ngx-gauzy-button-action>\n\t\t</div>\n\t</nb-card-header>\n\t<nb-card-body class=\"content\" [nbSpinner]=\"loading\" nbSpinnerStatus=\"primary\" nbSpinnerSize=\"large\">\n\t\t@if (dataLayoutStyle === componentLayoutStyleEnum.TABLE) {\n\t\t\t<div class=\"table-scroll-container custom-table\">\n\t\t\t\t<angular2-smart-table\n\t\t\t\t\t[class.ga-table-loading]=\"loading\"\n\t\t\t\t\tstyle=\"cursor: pointer\"\n\t\t\t\t\t[settings]=\"smartTableSettings\"\n\t\t\t\t\t[source]=\"smartTableSource\"\n\t\t\t\t\t(userRowSelect)=\"selectProposal($event)\"\n\t\t\t\t></angular2-smart-table>\n\t\t\t</div>\n\t\t\t<div class=\"pagination-container\">\n\t\t\t\t@if (smartTableSource) {\n\t\t\t\t\t<ngx-pagination [source]=\"smartTableSource\"></ngx-pagination>\n\t\t\t\t}\n\t\t\t</div>\n\t\t} @else {\n\t\t\t<ga-card-grid\n\t\t\t\t[loading]=\"loading\"\n\t\t\t\t[totalItems]=\"pagination?.totalItems\"\n\t\t\t\t[settings]=\"smartTableSettings\"\n\t\t\t\t[source]=\"proposals\"\n\t\t\t\t(onSelectedItem)=\"selectProposal($event)\"\n\t\t\t\t(scroll)=\"onScroll()\"\n\t\t\t></ga-card-grid>\n\t\t}\n\t</nb-card-body>\n</nb-card>\n\n<!--  -->\n<ng-template #actionButtons let-buttonSize=\"buttonSize\" let-selectedItem=\"selectedItem\">\n\t<div class=\"btn-group actions\">\n\t\t<!-- View carries the record's OWN guard (the one the details route\n\t\t     enforces), not the edit guard the mutating actions sit behind. It\n\t\t     opens the existing read-only details page, which made the former\n\t\t     DETAILS button a duplicate. -->\n\t\t<ng-template ngxPermissionsOnly=\"ORG_PROPOSALS_VIEW\">\n\t\t\t<button\n\t\t\t\tnbButton\n\t\t\t\ttype=\"button\"\n\t\t\t\t(click)=\"details(selectedItem)\"\n\t\t\t\tstatus=\"basic\"\n\t\t\t\tclass=\"action secondary\"\n\t\t\t\t[disabled]=\"disableButton\"\n\t\t\t\tsize=\"small\"\n\t\t\t>\n\t\t\t\t<nb-icon icon=\"eye-outline\" pack=\"eva\"></nb-icon>\n\t\t\t\t{{ 'BUTTONS.VIEW' | translate }}\n\t\t\t</button>\n\t\t</ng-template>\n\t\t<ng-template ngxPermissionsOnly=\"ORG_PROPOSALS_EDIT\">\n\t\t\t<ng-container\n\t\t\t\t[ngTemplateOutlet]=\"statusButtonTemplate\"\n\t\t\t\t[ngTemplateOutletContext]=\"{\n\t\t\t\t\titem: selectedProposal || selectedItem,\n\t\t\t\t\tbuttonSize: buttonSize\n\t\t\t\t}\"\n\t\t\t></ng-container>\n\t\t\t<button\n\t\t\t\t(click)=\"edit()\"\n\t\t\t\tnbButton\n\t\t\t\ttype=\"button\"\n\t\t\t\tstatus=\"basic\"\n\t\t\t\tclass=\"action primary\"\n\t\t\t\tsize=\"small\"\n\t\t\t\t[disabled]=\"disableButton\"\n\t\t\t>\n\t\t\t\t<nb-icon icon=\"edit-outline\"></nb-icon>\n\t\t\t\t{{ 'BUTTONS.EDIT' | translate }}\n\t\t\t</button>\n\t\t\t<button\n\t\t\t\tnbButton\n\t\t\t\ttype=\"button\"\n\t\t\t\t(click)=\"delete(selectedItem)\"\n\t\t\t\tstatus=\"basic\"\n\t\t\t\tclass=\"action\"\n\t\t\t\tsize=\"small\"\n\t\t\t\t[nbTooltip]=\"'BUTTONS.DELETE' | translate\"\n\t\t\t\t[disabled]=\"disableButton\"\n\t\t\t>\n\t\t\t\t<nb-icon status=\"danger\" icon=\"trash-2-outline\"></nb-icon>\n\t\t\t</button>\n\t\t</ng-template>\n\t</div>\n</ng-template>\n\n<!-- Status Button Template -->\n<ng-template #statusButtonTemplate let-item=\"item\" let-buttonSize=\"buttonSize\">\n\t@if (item?.status) {\n\t\t<button\n\t\t\tnbButton\n\t\t\ttype=\"button\"\n\t\t\tsize=\"small\"\n\t\t\tstatus=\"basic\"\n\t\t\tclass=\"action warning\"\n\t\t\t[disabled]=\"!item || disableButton\"\n\t\t\t(click)=\"item?.status === proposalStatusEnum.SENT ? switchToAccepted(item) : switchToSent(item)\"\n\t\t>\n\t\t\t<nb-icon icon=\"done-all-outline\"></nb-icon>\n\t\t\t<span>\n\t\t\t\t{{\n\t\t\t\t\t(item?.status === proposalStatusEnum.ACCEPTED ? 'BUTTONS.MARK_AS_SENT' : 'BUTTONS.MARK_AS_ACCEPTED')\n\t\t\t\t\t\t| translate\n\t\t\t\t}}\n\t\t\t</span>\n\t\t</button>\n\t}\n</ng-template>\n\n<!-- Visible Button Template -->\n<ng-template #visibleButton>\n\t<ng-template ngxPermissionsOnly=\"ORG_PROPOSAL_TEMPLATES_VIEW\">\n\t\t<button\n\t\t\tnbButton\n\t\t\ttype=\"button\"\n\t\t\tstatus=\"success\"\n\t\t\tsize=\"small\"\n\t\t\t[routerLink]=\"['/pages/sales/proposals/register']\"\n\t\t\tclass=\"\"\n\t\t>\n\t\t\t<nb-icon icon=\"plus-outline\"> </nb-icon>\n\t\t\t{{ 'BUTTONS.ADD' | translate }}\n\t\t</button>\n\t</ng-template>\n</ng-template>\n\n<!-- Statistics Template -->\n<ng-template #statisticsTemplate>\n\t<div class=\"statistics\">\n\t\t<div class=\"stat-card\">\n\t\t\t<span class=\"stat-value\">{{ countAccepted }}</span>\n\t\t\t<span class=\"stat-label\">{{ 'PROPOSALS_PAGE.ACCEPTED_PROPOSALS' | translate }}</span>\n\t\t</div>\n\t\t<div class=\"stat-card\">\n\t\t\t<span class=\"stat-value\">{{ totalProposals }}</span>\n\t\t\t<span class=\"stat-label\">{{ 'PROPOSALS_PAGE.TOTAL_PROPOSALS' | translate }}</span>\n\t\t</div>\n\t\t<div class=\"stat-card\">\n\t\t\t<span class=\"stat-value\">{{ successRate }}</span>\n\t\t\t<span class=\"stat-label\">{{ 'PROPOSALS_PAGE.SUCCESS_RATE' | translate }}</span>\n\t\t</div>\n\t</div>\n</ng-template>\n", styles: [".action{box-shadow:inset 0 0 0 1px var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));border:none}.action[nbButton].appearance-filled.status-basic{background-color:var(--gauzy-card-2)}.action.info[nbButton].appearance-filled.status-basic,.action.info-text-1[nbButton].appearance-filled.status-basic{color:var(--gauzy-action-info-text)}.action.secondary{color:var(--text-hint-color)}.action.success{color:var(--gauzy-action-success-text)}.action.warning{color:var(--gauzy-action-warning-text)}.action.orange{color:#ffab2d}.action.primary{color:var(--text-primary-color)}.action.primary.soft[nbButton].appearance-filled.status-basic{background-color:#6e49e81a}.action.select-nb ::ng-deep{box-shadow:none}.action.select-nb ::ng-deep .select-button{box-shadow:inset 0 0 0 1px var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));background:var(--gauzy-card-2)}button{margin:5px}.actions{background:var(--gauzy-card-2);border-radius:var(--button-rectangle-border-radius);padding:2px 4px!important}.gauzy-button-container{display:flex;justify-content:flex-end;width:100%;padding-bottom:0}.card-custom-header{display:flex;flex-direction:column;width:100%;padding-bottom:0}:host ::ng-deep input{border-radius:var(--border-radius);box-shadow:inset 0 0 0 1px var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18))}:host nb-card,:host nb-card-body{background-color:var(--gauzy-card-2);margin:0;display:flex;flex-direction:column}:host nb-card .table-scroll-container,:host nb-card .grid-scroll-container,:host nb-card-body .table-scroll-container,:host nb-card-body .grid-scroll-container{flex:1 1 auto;min-height:0;max-height:unset}:host nb-card-body{border-radius:0 0 var(--border-radius) var(--border-radius)}[dir=ltr] :host nb-card-body{padding:1rem .5rem 1rem 18px}[dir=rtl] :host nb-card-body{padding:1rem 18px 1rem .5rem}:host nb-card,:host nb-card-header{border-radius:var(--border-radius)}:host nb-card{display:flex;flex-flow:column;height:100%;border-radius:var(--border-radius)}:host nb-card nb-card-header{flex:0 1 auto}:host nb-card nb-card-body{flex:1 1 auto;overflow:unset;height:calc(100vh - calc(var(--header-height) + var(--footer-height)) - 13.125rem + 3.75rem)}:host nb-card nb-card-footer{flex:0 1 auto}.statistics{display:flex;flex-wrap:wrap;align-items:stretch;gap:.5rem;margin-block:.5rem}.statistics .stat-card{background:var(--gauzy-card-1, var(--background-basic-color-1));box-shadow:inset 0 0 0 1px var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));border-radius:var(--border-radius, .5rem);border-radius:var(--gauzy-radius-sm, .375rem);display:flex;flex-direction:column;justify-content:center;gap:.125rem;min-width:7rem;padding:.375rem .75rem}.statistics .stat-value{font-size:1.0625rem;font-weight:600;line-height:1.25rem;color:var(--text-basic-color);font-variant-numeric:tabular-nums}.statistics .stat-label{font-size:.625rem;font-weight:600;line-height:.875rem;letter-spacing:.04em;text-transform:uppercase;color:var(--text-hint-color)}:host{--gauzy-table-font-size: .6875rem;--gauzy-table-line-height: 1rem;--gauzy-table-cell-padding-y: .1875rem;--gauzy-table-cell-padding-x: .4375rem;--gauzy-table-header-font-size: .75rem;--gauzy-table-header-line-height: .8125rem;--gauzy-table-header-padding-y: .3125rem;--gauzy-table-header-padding-x: .4375rem;--gauzy-table-filter-padding-y: .1875rem;--gauzy-table-control-height: 1.5rem;--gauzy-table-badge-height: 1rem;--gauzy-table-badge-radius: .25rem;--gauzy-table-badge-padding-y: .1875rem;--gauzy-table-chip-font-size: .625rem;--gauzy-table-chip-line-height: .75rem;--gauzy-table-chip-padding-y: 0;--gauzy-table-chip-padding-x: .3125rem;--gauzy-table-chip-gap: .125rem;--gauzy-table-chip-block-gap: .5rem;--gauzy-people-avatar-size: 1.25rem;--gauzy-people-font-size: .75rem;--gauzy-people-chip-padding-y: .25rem;display:flex;flex-direction:column;height:100%;min-height:0}:host nb-card-body{height:calc(100vh - 21.5rem)!important}:host .gauzy-button-container{--button-small-icon-size: .875rem;--button-small-icon-offset: .25rem;--button-small-icon-vertical-margin: 0;--button-filled-small-padding: .25rem .625rem;--button-outline-small-padding: .25rem .625rem;--button-ghost-small-padding: .25rem .625rem;--icon-button-filled-small-padding: .25rem;--icon-button-outline-small-padding: .25rem;--icon-button-ghost-small-padding: .25rem}:host .table-scroll-container{background:var(--gauzy-card-1, var(--background-basic-color-1));box-shadow:inset 0 0 0 1px var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));border-radius:var(--border-radius, .5rem)}:host ::ng-deep ga-notes-with-tags .tags:has(nb-badge){margin-bottom:.5rem}:host ::ng-deep ga-status-badge .badge-success{color:var(--gauzy-action-success-text, #047857);background-color:var(--gauzy-action-success-tint, rgba(4, 120, 87, .08))}:host ::ng-deep ga-status-badge .badge-warning{color:var(--gauzy-action-warning-text, #b45309);background-color:var(--gauzy-action-warning-tint, rgba(180, 83, 9, .08))}:host ::ng-deep ga-status-badge .badge-danger{color:var(--gauzy-action-danger-text, #dc2626);background-color:var(--gauzy-action-danger-tint, rgba(220, 38, 38, .08))}:host .pagination-container{display:flex;justify-content:flex-end;flex-wrap:wrap;gap:.5rem;margin-top:.25rem}@media(max-width:767px){:host .pagination-container{justify-content:center}}:host .pagination-container ::ng-deep ngx-pagination{width:auto}:host .pagination-container ::ng-deep ngx-pagination nav{margin-top:0!important;gap:.75rem}:host .pagination-container ::ng-deep ngx-pagination .pagination{gap:.125rem;font-size:.75rem}:host .pagination-container ::ng-deep ngx-pagination li a,:host .pagination-container ::ng-deep ngx-pagination li span{margin:0}:host .pagination-container ::ng-deep ngx-pagination li span{display:flex;align-items:center;justify-content:center;min-width:1.75rem;height:1.75rem;padding:0 .375rem;font-size:.75rem;line-height:1;border-radius:var(--gauzy-radius-sm, .375rem)}:host .pagination-container ::ng-deep ngx-pagination li span.icon{padding:0;background:var(--gauzy-hover-tint, rgba(126, 126, 143, .12));box-shadow:none;border-radius:var(--gauzy-radius-sm, .375rem)}:host .pagination-container ::ng-deep ngx-pagination li span.icon nb-icon{font-size:.875rem}:host .pagination-container ::ng-deep ngx-pagination li:hover span.icon{background:var(--gauzy-active-tint, rgba(126, 126, 143, .2))}:host .pagination-container ::ng-deep ngx-pagination li.disabled{opacity:.4;pointer-events:none}:host .pagination-container ::ng-deep ngx-pagination li.active span{width:auto;min-width:1.75rem;height:1.75rem;padding:0 .375rem!important;border-radius:var(--gauzy-radius-sm, .375rem);line-height:1;background:var(--gauzy-active-tint, rgba(126, 126, 143, .2));color:var(--text-basic-color);font-weight:600}:host .pagination-container ::ng-deep ngx-pagination>nav>div{gap:.5rem;font-size:.75rem;color:var(--gauzy-text-color-2, var(--text-hint-color))}:host .pagination-container ::ng-deep ngx-pagination nb-select .select-button{min-width:4rem;height:1.75rem;padding:0 .5rem;border-radius:var(--gauzy-radius-sm, .375rem);font-size:.75rem}:host .table-scroll-container ::ng-deep angular2-smart-table tr.angular2-smart-titles>th{border-bottom:1px solid var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));vertical-align:middle}:host .table-scroll-container ::ng-deep angular2-smart-table tbody tr{background:transparent}:host .table-scroll-container ::ng-deep angular2-smart-table tbody tr>td{vertical-align:middle}:host .table-scroll-container ::ng-deep angular2-smart-table tbody tr:hover:not(.selected){background:var(--gauzy-hover-tint, rgba(126, 126, 143, .12))!important}:host .table-scroll-container ::ng-deep angular2-smart-table tbody tr.selected{background:var(--gauzy-active-tint, rgba(126, 126, 143, .2))!important;box-shadow:none!important}[dir=ltr] :host .table-scroll-container ::ng-deep angular2-smart-table ngx-employee-links a{padding:.125rem .375rem .125rem .125rem}[dir=rtl] :host .table-scroll-container ::ng-deep angular2-smart-table ngx-employee-links a{padding:.125rem .125rem .125rem .375rem}:host .table-scroll-container ::ng-deep angular2-smart-table ngx-employee-links img{width:var(--gauzy-people-avatar-size, 1rem);height:var(--gauzy-people-avatar-size, 1rem)}[dir=ltr] :host .table-scroll-container ::ng-deep angular2-smart-table ngx-employee-links img{margin-right:var(--gauzy-people-gap, .375rem)}[dir=rtl] :host .table-scroll-container ::ng-deep angular2-smart-table ngx-employee-links img{margin-left:var(--gauzy-people-gap, .375rem)}:host .table-scroll-container ::ng-deep angular2-smart-table ngx-employee-links .names-wrapper.names-wrapper{max-width:var(--gauzy-people-name-max-width, 8rem);font-size:var(--gauzy-people-font-size, .6875rem);line-height:var(--gauzy-people-avatar-size, 1rem)}:host .table-scroll-container ::ng-deep angular2-smart-table ngx-contact-links .inner-wrapper.inner-wrapper{gap:var(--gauzy-people-gap, .375rem)}[dir=ltr] :host .table-scroll-container ::ng-deep angular2-smart-table ngx-contact-links .inner-wrapper.inner-wrapper{padding:.125rem .375rem .125rem .125rem}[dir=rtl] :host .table-scroll-container ::ng-deep angular2-smart-table ngx-contact-links .inner-wrapper.inner-wrapper{padding:.125rem .125rem .125rem .375rem}:host .table-scroll-container ::ng-deep angular2-smart-table ngx-contact-links .inner-wrapper.inner-wrapper .avatar img{width:var(--gauzy-people-avatar-size, 1rem)!important;height:var(--gauzy-people-avatar-size, 1rem)!important}:host .table-scroll-container ::ng-deep angular2-smart-table ngx-contact-links .inner-wrapper.inner-wrapper .names-wrapper.names-wrapper{max-width:var(--gauzy-people-name-max-width, 8rem)}:host .table-scroll-container ::ng-deep angular2-smart-table ngx-contact-links .inner-wrapper.inner-wrapper .link-text.link-text{font-size:var(--gauzy-people-font-size, .6875rem);line-height:var(--gauzy-people-avatar-size, 1rem)}:host .table-scroll-container ::ng-deep angular2-smart-table ngx-contact-links .inner-wrapper.inner-wrapper .prefix.prefix{width:var(--gauzy-people-avatar-size, 1rem);height:var(--gauzy-people-avatar-size, 1rem);padding:0;gap:0;font-size:var(--gauzy-people-initials-font-size, .5625rem);line-height:var(--gauzy-people-avatar-size, 1rem)}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "directive", type: i3.RouterLink, selector: "[routerLink]", inputs: ["target", "queryParams", "fragment", "queryParamsHandling", "state", "info", "relativeTo", "preserveFragment", "skipLocationChange", "replaceUrl", "routerLink"] }, { kind: "component", type: i4.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "component", type: i4.NbCardComponent, selector: "nb-card", inputs: ["size", "status", "accent"] }, { kind: "component", type: i4.NbCardBodyComponent, selector: "nb-card-body" }, { kind: "component", type: i4.NbCardHeaderComponent, selector: "nb-card-header" }, { kind: "component", type: i4.NbIconComponent, selector: "nb-icon", inputs: ["icon", "pack", "options", "status", "config"] }, { kind: "directive", type: i4.NbSpinnerDirective, selector: "[nbSpinner]", inputs: ["nbSpinnerMessage", "nbSpinnerStatus", "nbSpinnerSize", "nbSpinner"] }, { kind: "directive", type: i4.NbTooltipDirective, selector: "[nbTooltip]", inputs: ["nbTooltip", "nbTooltipPlacement", "nbTooltipAdjustment", "nbTooltipClass", "nbTooltipIcon", "nbTooltipStatus", "nbTooltipTrigger", "nbTooltipOffset", "nbTooltipDisabled"], outputs: ["nbTooltipShowStateChange"], exportAs: ["nbTooltip"] }, { kind: "directive", type: i6.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: i7.NgxPermissionsDirective, selector: "[ngxPermissionsOnly],[ngxPermissionsExcept]", inputs: ["ngxPermissionsOnly", "ngxPermissionsOnlyThen", "ngxPermissionsOnlyElse", "ngxPermissionsExcept", "ngxPermissionsExceptElse", "ngxPermissionsExceptThen", "ngxPermissionsThen", "ngxPermissionsElse", "ngxPermissionsOnlyAuthorisedStrategy", "ngxPermissionsOnlyUnauthorisedStrategy", "ngxPermissionsExceptUnauthorisedStrategy", "ngxPermissionsExceptAuthorisedStrategy", "ngxPermissionsUnauthorisedStrategy", "ngxPermissionsAuthorisedStrategy"], outputs: ["permissionsAuthorized", "permissionsUnauthorized"] }, { kind: "component", type: i8.HeaderTitleComponent, selector: "ngx-header-title", inputs: ["allowEmployee", "allowOrganization"] }, { kind: "component", type: i8.CardGridComponent, selector: "ga-card-grid", inputs: ["source", "loading", "skeletonCards", "settings", "totalItems"], outputs: ["onSelectedItem", "scroll"] }, { kind: "component", type: i9.Angular2SmartTableComponent, selector: "angular2-smart-table", inputs: ["source", "settings"], outputs: ["rowSelect", "userRowSelect", "delete", "edit", "create", "custom", "deleteConfirm", "editConfirm", "editCancel", "createConfirm", "createCancel", "rowHover", "afterGridInit"] }, { kind: "component", type: i8.GauzyButtonActionComponent, selector: "ngx-gauzy-button-action", inputs: ["isDisable", "hasLayoutSelector", "componentName", "buttonTemplate", "buttonTemplateVisible"] }, { kind: "component", type: i8.PaginationV2Component, selector: "ngx-pagination", inputs: ["source", "perPageSelect"], outputs: ["changePage"] }, { kind: "directive", type: i8.SmartTableSettlingDirective, selector: "angular2-smart-table" }, { kind: "directive", type: i8.SmartTableFilterToggleDirective, selector: "angular2-smart-table" }, { kind: "pipe", type: i1.TranslatePipe, name: "translate" }, { kind: "pipe", type: i6.TitleCasePipe, name: "titlecase" }] }); }
};
ProposalComponent = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [TranslateService,
        Store,
        DateRangePickerBuilderService,
        Router,
        ProposalsService,
        ToastrService,
        NbDialogService,
        ErrorHandlingService,
        HttpClient])
], ProposalComponent);
export { ProposalComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ProposalComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-proposal-list', standalone: false, template: "<nb-card>\n\t<nb-card-header class=\"card-custom-header\">\n\t\t<!-- Title block: the heading only (the breadcrumb trail is parked under it\n\t\t     at runtime by ngx-header-title). -->\n\t\t<div class=\"card-header-title\">\n\t\t\t<h4>\n\t\t\t\t<ngx-header-title>\n\t\t\t\t\t{{ 'PROPOSALS_PAGE.HEADER' | translate }}\n\t\t\t\t</ngx-header-title>\n\t\t\t</h4>\n\t\t</div>\n\n\t\t<!-- Statistics Template -->\n\t\t<ng-container [ngTemplateOutlet]=\"statisticsTemplate\"></ng-container>\n\n\t\t<!-- Action side of the one-line page header (see `.ga-page-header` in\n\t\t     ui-core/static/styles/_overrides.scss): the secondary \"Manage Templates\"\n\t\t     sits with `+ Add`, the action strip and the view selector, so all of them\n\t\t     are centred on the same axis as the title. It used to be a sibling of the\n\t\t     <h4> inside the title block, where `.card-header-title`'s own\n\t\t     `space-between` stranded it mid-header, on the title's line but attached\n\t\t     to neither side of it. -->\n\t\t<div class=\"gauzy-button-container\">\n\t\t\t<ng-template ngxPermissionsOnly=\"ORG_PROPOSAL_TEMPLATES_VIEW\">\n\t\t\t\t<button\n\t\t\t\t\tnbButton\n\t\t\t\t\tstatus=\"basic\"\n\t\t\t\t\tclass=\"action primary soft\"\n\t\t\t\t\t[routerLink]=\"['/pages/jobs/proposal-template']\"\n\t\t\t\t\tsize=\"small\"\n\t\t\t\t>\n\t\t\t\t\t<nb-icon icon=\"file-text-outline\"></nb-icon>\n\t\t\t\t\t{{ 'BUTTONS.MANAGE_TEMPLATES' | translate | titlecase }}\n\t\t\t\t</button>\n\t\t\t</ng-template>\n\t\t\t<ngx-gauzy-button-action\n\t\t\t\t[buttonTemplateVisible]=\"visibleButton\"\n\t\t\t\t[isDisable]=\"disableButton\"\n\t\t\t\t[buttonTemplate]=\"actionButtons\"\n\t\t\t\t[componentName]=\"viewComponentName\"\n\t\t\t></ngx-gauzy-button-action>\n\t\t</div>\n\t</nb-card-header>\n\t<nb-card-body class=\"content\" [nbSpinner]=\"loading\" nbSpinnerStatus=\"primary\" nbSpinnerSize=\"large\">\n\t\t@if (dataLayoutStyle === componentLayoutStyleEnum.TABLE) {\n\t\t\t<div class=\"table-scroll-container custom-table\">\n\t\t\t\t<angular2-smart-table\n\t\t\t\t\t[class.ga-table-loading]=\"loading\"\n\t\t\t\t\tstyle=\"cursor: pointer\"\n\t\t\t\t\t[settings]=\"smartTableSettings\"\n\t\t\t\t\t[source]=\"smartTableSource\"\n\t\t\t\t\t(userRowSelect)=\"selectProposal($event)\"\n\t\t\t\t></angular2-smart-table>\n\t\t\t</div>\n\t\t\t<div class=\"pagination-container\">\n\t\t\t\t@if (smartTableSource) {\n\t\t\t\t\t<ngx-pagination [source]=\"smartTableSource\"></ngx-pagination>\n\t\t\t\t}\n\t\t\t</div>\n\t\t} @else {\n\t\t\t<ga-card-grid\n\t\t\t\t[loading]=\"loading\"\n\t\t\t\t[totalItems]=\"pagination?.totalItems\"\n\t\t\t\t[settings]=\"smartTableSettings\"\n\t\t\t\t[source]=\"proposals\"\n\t\t\t\t(onSelectedItem)=\"selectProposal($event)\"\n\t\t\t\t(scroll)=\"onScroll()\"\n\t\t\t></ga-card-grid>\n\t\t}\n\t</nb-card-body>\n</nb-card>\n\n<!--  -->\n<ng-template #actionButtons let-buttonSize=\"buttonSize\" let-selectedItem=\"selectedItem\">\n\t<div class=\"btn-group actions\">\n\t\t<!-- View carries the record's OWN guard (the one the details route\n\t\t     enforces), not the edit guard the mutating actions sit behind. It\n\t\t     opens the existing read-only details page, which made the former\n\t\t     DETAILS button a duplicate. -->\n\t\t<ng-template ngxPermissionsOnly=\"ORG_PROPOSALS_VIEW\">\n\t\t\t<button\n\t\t\t\tnbButton\n\t\t\t\ttype=\"button\"\n\t\t\t\t(click)=\"details(selectedItem)\"\n\t\t\t\tstatus=\"basic\"\n\t\t\t\tclass=\"action secondary\"\n\t\t\t\t[disabled]=\"disableButton\"\n\t\t\t\tsize=\"small\"\n\t\t\t>\n\t\t\t\t<nb-icon icon=\"eye-outline\" pack=\"eva\"></nb-icon>\n\t\t\t\t{{ 'BUTTONS.VIEW' | translate }}\n\t\t\t</button>\n\t\t</ng-template>\n\t\t<ng-template ngxPermissionsOnly=\"ORG_PROPOSALS_EDIT\">\n\t\t\t<ng-container\n\t\t\t\t[ngTemplateOutlet]=\"statusButtonTemplate\"\n\t\t\t\t[ngTemplateOutletContext]=\"{\n\t\t\t\t\titem: selectedProposal || selectedItem,\n\t\t\t\t\tbuttonSize: buttonSize\n\t\t\t\t}\"\n\t\t\t></ng-container>\n\t\t\t<button\n\t\t\t\t(click)=\"edit()\"\n\t\t\t\tnbButton\n\t\t\t\ttype=\"button\"\n\t\t\t\tstatus=\"basic\"\n\t\t\t\tclass=\"action primary\"\n\t\t\t\tsize=\"small\"\n\t\t\t\t[disabled]=\"disableButton\"\n\t\t\t>\n\t\t\t\t<nb-icon icon=\"edit-outline\"></nb-icon>\n\t\t\t\t{{ 'BUTTONS.EDIT' | translate }}\n\t\t\t</button>\n\t\t\t<button\n\t\t\t\tnbButton\n\t\t\t\ttype=\"button\"\n\t\t\t\t(click)=\"delete(selectedItem)\"\n\t\t\t\tstatus=\"basic\"\n\t\t\t\tclass=\"action\"\n\t\t\t\tsize=\"small\"\n\t\t\t\t[nbTooltip]=\"'BUTTONS.DELETE' | translate\"\n\t\t\t\t[disabled]=\"disableButton\"\n\t\t\t>\n\t\t\t\t<nb-icon status=\"danger\" icon=\"trash-2-outline\"></nb-icon>\n\t\t\t</button>\n\t\t</ng-template>\n\t</div>\n</ng-template>\n\n<!-- Status Button Template -->\n<ng-template #statusButtonTemplate let-item=\"item\" let-buttonSize=\"buttonSize\">\n\t@if (item?.status) {\n\t\t<button\n\t\t\tnbButton\n\t\t\ttype=\"button\"\n\t\t\tsize=\"small\"\n\t\t\tstatus=\"basic\"\n\t\t\tclass=\"action warning\"\n\t\t\t[disabled]=\"!item || disableButton\"\n\t\t\t(click)=\"item?.status === proposalStatusEnum.SENT ? switchToAccepted(item) : switchToSent(item)\"\n\t\t>\n\t\t\t<nb-icon icon=\"done-all-outline\"></nb-icon>\n\t\t\t<span>\n\t\t\t\t{{\n\t\t\t\t\t(item?.status === proposalStatusEnum.ACCEPTED ? 'BUTTONS.MARK_AS_SENT' : 'BUTTONS.MARK_AS_ACCEPTED')\n\t\t\t\t\t\t| translate\n\t\t\t\t}}\n\t\t\t</span>\n\t\t</button>\n\t}\n</ng-template>\n\n<!-- Visible Button Template -->\n<ng-template #visibleButton>\n\t<ng-template ngxPermissionsOnly=\"ORG_PROPOSAL_TEMPLATES_VIEW\">\n\t\t<button\n\t\t\tnbButton\n\t\t\ttype=\"button\"\n\t\t\tstatus=\"success\"\n\t\t\tsize=\"small\"\n\t\t\t[routerLink]=\"['/pages/sales/proposals/register']\"\n\t\t\tclass=\"\"\n\t\t>\n\t\t\t<nb-icon icon=\"plus-outline\"> </nb-icon>\n\t\t\t{{ 'BUTTONS.ADD' | translate }}\n\t\t</button>\n\t</ng-template>\n</ng-template>\n\n<!-- Statistics Template -->\n<ng-template #statisticsTemplate>\n\t<div class=\"statistics\">\n\t\t<div class=\"stat-card\">\n\t\t\t<span class=\"stat-value\">{{ countAccepted }}</span>\n\t\t\t<span class=\"stat-label\">{{ 'PROPOSALS_PAGE.ACCEPTED_PROPOSALS' | translate }}</span>\n\t\t</div>\n\t\t<div class=\"stat-card\">\n\t\t\t<span class=\"stat-value\">{{ totalProposals }}</span>\n\t\t\t<span class=\"stat-label\">{{ 'PROPOSALS_PAGE.TOTAL_PROPOSALS' | translate }}</span>\n\t\t</div>\n\t\t<div class=\"stat-card\">\n\t\t\t<span class=\"stat-value\">{{ successRate }}</span>\n\t\t\t<span class=\"stat-label\">{{ 'PROPOSALS_PAGE.SUCCESS_RATE' | translate }}</span>\n\t\t</div>\n\t</div>\n</ng-template>\n", styles: [".action{box-shadow:inset 0 0 0 1px var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));border:none}.action[nbButton].appearance-filled.status-basic{background-color:var(--gauzy-card-2)}.action.info[nbButton].appearance-filled.status-basic,.action.info-text-1[nbButton].appearance-filled.status-basic{color:var(--gauzy-action-info-text)}.action.secondary{color:var(--text-hint-color)}.action.success{color:var(--gauzy-action-success-text)}.action.warning{color:var(--gauzy-action-warning-text)}.action.orange{color:#ffab2d}.action.primary{color:var(--text-primary-color)}.action.primary.soft[nbButton].appearance-filled.status-basic{background-color:#6e49e81a}.action.select-nb ::ng-deep{box-shadow:none}.action.select-nb ::ng-deep .select-button{box-shadow:inset 0 0 0 1px var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));background:var(--gauzy-card-2)}button{margin:5px}.actions{background:var(--gauzy-card-2);border-radius:var(--button-rectangle-border-radius);padding:2px 4px!important}.gauzy-button-container{display:flex;justify-content:flex-end;width:100%;padding-bottom:0}.card-custom-header{display:flex;flex-direction:column;width:100%;padding-bottom:0}:host ::ng-deep input{border-radius:var(--border-radius);box-shadow:inset 0 0 0 1px var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18))}:host nb-card,:host nb-card-body{background-color:var(--gauzy-card-2);margin:0;display:flex;flex-direction:column}:host nb-card .table-scroll-container,:host nb-card .grid-scroll-container,:host nb-card-body .table-scroll-container,:host nb-card-body .grid-scroll-container{flex:1 1 auto;min-height:0;max-height:unset}:host nb-card-body{border-radius:0 0 var(--border-radius) var(--border-radius)}[dir=ltr] :host nb-card-body{padding:1rem .5rem 1rem 18px}[dir=rtl] :host nb-card-body{padding:1rem 18px 1rem .5rem}:host nb-card,:host nb-card-header{border-radius:var(--border-radius)}:host nb-card{display:flex;flex-flow:column;height:100%;border-radius:var(--border-radius)}:host nb-card nb-card-header{flex:0 1 auto}:host nb-card nb-card-body{flex:1 1 auto;overflow:unset;height:calc(100vh - calc(var(--header-height) + var(--footer-height)) - 13.125rem + 3.75rem)}:host nb-card nb-card-footer{flex:0 1 auto}.statistics{display:flex;flex-wrap:wrap;align-items:stretch;gap:.5rem;margin-block:.5rem}.statistics .stat-card{background:var(--gauzy-card-1, var(--background-basic-color-1));box-shadow:inset 0 0 0 1px var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));border-radius:var(--border-radius, .5rem);border-radius:var(--gauzy-radius-sm, .375rem);display:flex;flex-direction:column;justify-content:center;gap:.125rem;min-width:7rem;padding:.375rem .75rem}.statistics .stat-value{font-size:1.0625rem;font-weight:600;line-height:1.25rem;color:var(--text-basic-color);font-variant-numeric:tabular-nums}.statistics .stat-label{font-size:.625rem;font-weight:600;line-height:.875rem;letter-spacing:.04em;text-transform:uppercase;color:var(--text-hint-color)}:host{--gauzy-table-font-size: .6875rem;--gauzy-table-line-height: 1rem;--gauzy-table-cell-padding-y: .1875rem;--gauzy-table-cell-padding-x: .4375rem;--gauzy-table-header-font-size: .75rem;--gauzy-table-header-line-height: .8125rem;--gauzy-table-header-padding-y: .3125rem;--gauzy-table-header-padding-x: .4375rem;--gauzy-table-filter-padding-y: .1875rem;--gauzy-table-control-height: 1.5rem;--gauzy-table-badge-height: 1rem;--gauzy-table-badge-radius: .25rem;--gauzy-table-badge-padding-y: .1875rem;--gauzy-table-chip-font-size: .625rem;--gauzy-table-chip-line-height: .75rem;--gauzy-table-chip-padding-y: 0;--gauzy-table-chip-padding-x: .3125rem;--gauzy-table-chip-gap: .125rem;--gauzy-table-chip-block-gap: .5rem;--gauzy-people-avatar-size: 1.25rem;--gauzy-people-font-size: .75rem;--gauzy-people-chip-padding-y: .25rem;display:flex;flex-direction:column;height:100%;min-height:0}:host nb-card-body{height:calc(100vh - 21.5rem)!important}:host .gauzy-button-container{--button-small-icon-size: .875rem;--button-small-icon-offset: .25rem;--button-small-icon-vertical-margin: 0;--button-filled-small-padding: .25rem .625rem;--button-outline-small-padding: .25rem .625rem;--button-ghost-small-padding: .25rem .625rem;--icon-button-filled-small-padding: .25rem;--icon-button-outline-small-padding: .25rem;--icon-button-ghost-small-padding: .25rem}:host .table-scroll-container{background:var(--gauzy-card-1, var(--background-basic-color-1));box-shadow:inset 0 0 0 1px var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));border-radius:var(--border-radius, .5rem)}:host ::ng-deep ga-notes-with-tags .tags:has(nb-badge){margin-bottom:.5rem}:host ::ng-deep ga-status-badge .badge-success{color:var(--gauzy-action-success-text, #047857);background-color:var(--gauzy-action-success-tint, rgba(4, 120, 87, .08))}:host ::ng-deep ga-status-badge .badge-warning{color:var(--gauzy-action-warning-text, #b45309);background-color:var(--gauzy-action-warning-tint, rgba(180, 83, 9, .08))}:host ::ng-deep ga-status-badge .badge-danger{color:var(--gauzy-action-danger-text, #dc2626);background-color:var(--gauzy-action-danger-tint, rgba(220, 38, 38, .08))}:host .pagination-container{display:flex;justify-content:flex-end;flex-wrap:wrap;gap:.5rem;margin-top:.25rem}@media(max-width:767px){:host .pagination-container{justify-content:center}}:host .pagination-container ::ng-deep ngx-pagination{width:auto}:host .pagination-container ::ng-deep ngx-pagination nav{margin-top:0!important;gap:.75rem}:host .pagination-container ::ng-deep ngx-pagination .pagination{gap:.125rem;font-size:.75rem}:host .pagination-container ::ng-deep ngx-pagination li a,:host .pagination-container ::ng-deep ngx-pagination li span{margin:0}:host .pagination-container ::ng-deep ngx-pagination li span{display:flex;align-items:center;justify-content:center;min-width:1.75rem;height:1.75rem;padding:0 .375rem;font-size:.75rem;line-height:1;border-radius:var(--gauzy-radius-sm, .375rem)}:host .pagination-container ::ng-deep ngx-pagination li span.icon{padding:0;background:var(--gauzy-hover-tint, rgba(126, 126, 143, .12));box-shadow:none;border-radius:var(--gauzy-radius-sm, .375rem)}:host .pagination-container ::ng-deep ngx-pagination li span.icon nb-icon{font-size:.875rem}:host .pagination-container ::ng-deep ngx-pagination li:hover span.icon{background:var(--gauzy-active-tint, rgba(126, 126, 143, .2))}:host .pagination-container ::ng-deep ngx-pagination li.disabled{opacity:.4;pointer-events:none}:host .pagination-container ::ng-deep ngx-pagination li.active span{width:auto;min-width:1.75rem;height:1.75rem;padding:0 .375rem!important;border-radius:var(--gauzy-radius-sm, .375rem);line-height:1;background:var(--gauzy-active-tint, rgba(126, 126, 143, .2));color:var(--text-basic-color);font-weight:600}:host .pagination-container ::ng-deep ngx-pagination>nav>div{gap:.5rem;font-size:.75rem;color:var(--gauzy-text-color-2, var(--text-hint-color))}:host .pagination-container ::ng-deep ngx-pagination nb-select .select-button{min-width:4rem;height:1.75rem;padding:0 .5rem;border-radius:var(--gauzy-radius-sm, .375rem);font-size:.75rem}:host .table-scroll-container ::ng-deep angular2-smart-table tr.angular2-smart-titles>th{border-bottom:1px solid var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));vertical-align:middle}:host .table-scroll-container ::ng-deep angular2-smart-table tbody tr{background:transparent}:host .table-scroll-container ::ng-deep angular2-smart-table tbody tr>td{vertical-align:middle}:host .table-scroll-container ::ng-deep angular2-smart-table tbody tr:hover:not(.selected){background:var(--gauzy-hover-tint, rgba(126, 126, 143, .12))!important}:host .table-scroll-container ::ng-deep angular2-smart-table tbody tr.selected{background:var(--gauzy-active-tint, rgba(126, 126, 143, .2))!important;box-shadow:none!important}[dir=ltr] :host .table-scroll-container ::ng-deep angular2-smart-table ngx-employee-links a{padding:.125rem .375rem .125rem .125rem}[dir=rtl] :host .table-scroll-container ::ng-deep angular2-smart-table ngx-employee-links a{padding:.125rem .125rem .125rem .375rem}:host .table-scroll-container ::ng-deep angular2-smart-table ngx-employee-links img{width:var(--gauzy-people-avatar-size, 1rem);height:var(--gauzy-people-avatar-size, 1rem)}[dir=ltr] :host .table-scroll-container ::ng-deep angular2-smart-table ngx-employee-links img{margin-right:var(--gauzy-people-gap, .375rem)}[dir=rtl] :host .table-scroll-container ::ng-deep angular2-smart-table ngx-employee-links img{margin-left:var(--gauzy-people-gap, .375rem)}:host .table-scroll-container ::ng-deep angular2-smart-table ngx-employee-links .names-wrapper.names-wrapper{max-width:var(--gauzy-people-name-max-width, 8rem);font-size:var(--gauzy-people-font-size, .6875rem);line-height:var(--gauzy-people-avatar-size, 1rem)}:host .table-scroll-container ::ng-deep angular2-smart-table ngx-contact-links .inner-wrapper.inner-wrapper{gap:var(--gauzy-people-gap, .375rem)}[dir=ltr] :host .table-scroll-container ::ng-deep angular2-smart-table ngx-contact-links .inner-wrapper.inner-wrapper{padding:.125rem .375rem .125rem .125rem}[dir=rtl] :host .table-scroll-container ::ng-deep angular2-smart-table ngx-contact-links .inner-wrapper.inner-wrapper{padding:.125rem .125rem .125rem .375rem}:host .table-scroll-container ::ng-deep angular2-smart-table ngx-contact-links .inner-wrapper.inner-wrapper .avatar img{width:var(--gauzy-people-avatar-size, 1rem)!important;height:var(--gauzy-people-avatar-size, 1rem)!important}:host .table-scroll-container ::ng-deep angular2-smart-table ngx-contact-links .inner-wrapper.inner-wrapper .names-wrapper.names-wrapper{max-width:var(--gauzy-people-name-max-width, 8rem)}:host .table-scroll-container ::ng-deep angular2-smart-table ngx-contact-links .inner-wrapper.inner-wrapper .link-text.link-text{font-size:var(--gauzy-people-font-size, .6875rem);line-height:var(--gauzy-people-avatar-size, 1rem)}:host .table-scroll-container ::ng-deep angular2-smart-table ngx-contact-links .inner-wrapper.inner-wrapper .prefix.prefix{width:var(--gauzy-people-avatar-size, 1rem);height:var(--gauzy-people-avatar-size, 1rem);padding:0;gap:0;font-size:var(--gauzy-people-initials-font-size, .5625rem);line-height:var(--gauzy-people-avatar-size, 1rem)}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }], ctorParameters: () => [{ type: i1.TranslateService }, { type: i2.Store }, { type: i2.DateRangePickerBuilderService }, { type: i3.Router }, { type: i2.ProposalsService }, { type: i2.ToastrService }, { type: i4.NbDialogService }, { type: i2.ErrorHandlingService }, { type: i5.HttpClient }], propDecorators: { actionButtons: [{
                type: ViewChild,
                args: ['actionButtons', { static: true }]
            }], visibleButton: [{
                type: ViewChild,
                args: ['visibleButton', { static: true }]
            }] } });
//# sourceMappingURL=proposal.component.js.map