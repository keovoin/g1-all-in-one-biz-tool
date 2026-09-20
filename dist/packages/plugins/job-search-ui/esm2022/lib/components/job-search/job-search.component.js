var JobSearchComponent_1;
import { __decorate, __metadata } from "tslib";
import { Component, ViewChild } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, combineLatest, firstValueFrom, map, merge, Subscription, timer } from 'rxjs';
import { debounceTime, filter, tap } from 'rxjs/operators';
import { NbDialogService } from '@nebular/theme';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TranslateService } from '@ngx-translate/core';
import { NgxPermissionsService } from 'ngx-permissions';
import { AtLeastOneFieldValidator, DateRangePickerBuilderService, ErrorHandlingService, ProposalTemplateService, ServerDataSource, Store, ToastrService } from '@gauzy/ui-core/core';
import { JobPostSourceEnum, JobPostStatusEnum, JobPostTypeEnum, JobSearchTabsEnum, PermissionsEnum, IntegrationEntity } from '@gauzy/contracts';
import { JobService } from '@gauzy/ui-core/core';
import { I18nService } from '@gauzy/ui-core/i18n';
import { EmployeeLinksComponent, PaginationFilterBaseComponent, getAdjustDateRangeFutureAllowed } from '@gauzy/ui-core/shared';
import { API_PREFIX, distinctUntilChange, isNotEmpty, toUTC } from '@gauzy/ui-core/common';
import { ApplyJobManuallyComponent } from '../apply-job-manually/apply-job-manually.component';
import { JobTitleDescriptionDetailsComponent } from '../job-title-description-details/job-title-description-details.component';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
import * as i2 from "@angular/forms";
import * as i3 from "@angular/common/http";
import * as i4 from "@angular/router";
import * as i5 from "@nebular/theme";
import * as i6 from "@gauzy/ui-core/core";
import * as i7 from "ngx-permissions";
import * as i8 from "@gauzy/ui-core/i18n";
import * as i9 from "angular2-smart-table";
import * as i10 from "@gauzy/ui-core/shared";
import * as i11 from "@angular/common";
let JobSearchComponent = class JobSearchComponent extends PaginationFilterBaseComponent {
    static { JobSearchComponent_1 = this; }
    static buildForm(fb) {
        return fb.group({
            title: [],
            jobSource: [],
            jobType: [],
            jobStatus: [],
            budget: []
        }, {
            validators: [AtLeastOneFieldValidator]
        });
    }
    constructor(translateService, _fb, _http, _activatedRoute, _router, _dialogService, _store, _proposalTemplateService, _toastrService, _jobService, _dateRangePickerBuilderService, _errorHandlingService, _ngxPermissionsService, _i18nService) {
        super(translateService);
        this.translateService = translateService;
        this._fb = _fb;
        this._http = _http;
        this._activatedRoute = _activatedRoute;
        this._router = _router;
        this._dialogService = _dialogService;
        this._store = _store;
        this._proposalTemplateService = _proposalTemplateService;
        this._toastrService = _toastrService;
        this._jobService = _jobService;
        this._dateRangePickerBuilderService = _dateRangePickerBuilderService;
        this._errorHandlingService = _errorHandlingService;
        this._ngxPermissionsService = _ngxPermissionsService;
        this._i18nService = _i18nService;
        /**
         * Stable permission array for `*ngxPermissionsOnly`.
         * 🛑 Never inline the literal in the binding: a new array on every change-detection
         * cycle makes ngx-permissions re-validate forever under default change detection,
         * which pins the main thread and the view never finishes rendering.
         */
        this.permGateOrgJobSearch = Object.freeze(['ORG_JOB_SEARCH']);
        /**
         * Stable permission array for `*ngxPermissionsOnly`.
         * 🛑 Never inline the literal in the binding: a new array on every change-detection
         * cycle makes ngx-permissions re-validate forever under default change detection,
         * which pins the main thread and the view never finishes rendering.
         */
        this.permGateAllOrgView = Object.freeze(['ALL_ORG_VIEW']);
        /**
         * Stable permission array for `*ngxPermissionsOnly`.
         * 🛑 Never inline the literal in the binding: a new array on every change-detection
         * cycle makes ngx-permissions re-validate forever under default change detection,
         * which pins the main thread and the view never finishes rendering.
         */
        this.permGateOrgJobApply = Object.freeze(['ORG_JOB_APPLY']);
        /**
         * Stable permission array for `*ngxPermissionsOnly`.
         * 🛑 Never inline the literal in the binding: a new array on every change-detection
         * cycle makes ngx-permissions re-validate forever under default change detection,
         * which pins the main thread and the view never finishes rendering.
         */
        this.permGateOrgJobEdit = Object.freeze(['ORG_JOB_EDIT']);
        this.loading = false;
        this.isRefresh = false;
        this.autoRefresh = false;
        this.settingsSmartTable = {
            selectedRowIndex: -1,
            editable: false,
            hideSubHeader: true,
            actions: false
        };
        this.isOpenAdvancedFilter = false;
        this.jobs = [];
        this.JobPostSourceEnum = JobPostSourceEnum;
        this.JobPostTypeEnum = JobPostTypeEnum;
        this.JobPostStatusEnum = JobPostStatusEnum;
        this.PermissionsEnum = PermissionsEnum;
        this.JobSearchTabsEnum = JobSearchTabsEnum;
        this.jobs$ = this.subject$;
        this.disableButton = true;
        this.nbTab$ = new BehaviorSubject(JobSearchTabsEnum.ACTIONS);
        /*
         * Search Tab Form
         */
        this.form = JobSearchComponent_1.buildForm(this._fb);
        // Creating the observable pipeline
        this._activatedRoute.data
            .pipe(filter(({ integration }) => {
            if (!integration) {
                this._router.navigate(['/pages/jobs']);
                return false;
            }
            return true; // Continue with the pipeline if integration is found
        }), 
        // Extracting the 'entitySettings' property from the 'integration_tenant' object in the route's data
        map(({ integration }) => integration?.entitySettings), 
        // Finding the entity setting related to the specified entity type
        map((entitySettings) => entitySettings.find((setting) => setting.entity === IntegrationEntity.JOB_MATCHING)), 
        // Updating the specified component property with the fetched entity setting
        tap((entity) => {
            if (!entity || !entity.sync || !entity.isActive) {
                this._router.navigate(['/pages/jobs']);
            }
        }), 
        // Handling the component lifecycle to avoid memory leaks
        untilDestroyed(this))
            .subscribe();
    }
    ngOnInit() {
        this._applyTranslationOnSmartTable();
        // Initialize UI permissions
        this.initializeUiPermissions();
        // Initialize UI languages and Update Locale
        this.initializeUiLanguagesAndLocale();
        this.jobs$
            .pipe(debounceTime(100), tap(() => this.onSelectJob({ isSelected: false, data: null })), tap(async () => await this.getEmployeeJobs()), tap(() => (this.isRefresh = false)), untilDestroyed(this))
            .subscribe();
        this.nbTab$
            .pipe(debounceTime(100), distinctUntilChange(), tap(() => this.jobs$.next(true)), untilDestroyed(this))
            .subscribe();
        this.pagination$
            .pipe(debounceTime(100), distinctUntilChange(), tap(() => this.jobs$.next(true)), untilDestroyed(this))
            .subscribe();
    }
    ngAfterViewInit() {
        const storeOrganization$ = this._store.selectedOrganization$;
        const storeEmployee$ = this._store.selectedEmployee$;
        const selectedDateRange$ = this._dateRangePickerBuilderService.selectedDateRange$;
        combineLatest([storeOrganization$, selectedDateRange$, storeEmployee$])
            .pipe(debounceTime(100), distinctUntilChange(), filter(([organization, dateRange]) => !!organization && !!dateRange), tap(([organization, dateRange, employee]) => {
            this.organization = organization;
            this.selectedDateRange = dateRange;
            this.selectedEmployee = employee && employee.id ? employee : null;
        }), tap(() => this._loadSmartTableSettings()), tap(() => this.jobs$.next(true)), untilDestroyed(this))
            .subscribe();
    }
    /**
     * Initialize UI permissions
     */
    initializeUiPermissions() {
        // Load permissions
        const permissions = this._store.userRolePermissions.map(({ permission }) => permission);
        this._ngxPermissionsService.flushPermissions(); // Flush permissions
        this._ngxPermissionsService.loadPermissions(permissions); // Load permissions
    }
    /**
     * Initialize UI languages and Update Locale
     */
    initializeUiLanguagesAndLocale() {
        // Observable that emits when preferred language changes.
        const preferredLanguage$ = merge(this._store.preferredLanguage$, this._i18nService.preferredLanguage$).pipe(distinctUntilChange(), filter((lang) => !!lang), tap((lang) => {
            this.translateService.use(lang);
        }), untilDestroyed(this));
        // Subscribe to initiate the stream
        preferredLanguage$.subscribe();
    }
    /**
     * Retrieves the default proposal template for the specified employee and organization.
     * @param {IJobMatchings} job - The job matching object containing employeeId.
     * @returns {Promise<any>} A promise resolving to the default proposal template or null if not found.
     */
    async getEmployeeDefaultProposalTemplate(job) {
        // Check if organization context is available
        if (!this.organization) {
            return null;
        }
        // Extract necessary IDs
        const { id: organizationId, tenantId } = this.organization;
        const { employeeId } = job;
        // Retrieve proposal templates matching criteria
        const { items = [] } = await this._proposalTemplateService.getAll({
            where: {
                tenantId,
                organizationId,
                employeeId,
                isDefault: true
            }
        });
        // Return the first matching default template or null if not found
        return items.length > 0 ? items[0] : null;
    }
    /**
     * Copies the given text to the clipboard.
     * @param {string} text - The text to be copied to the clipboard.
     * @returns {Promise<void>} A promise that resolves when the text is copied.
     */
    async copyTextToClipboard(text) {
        if (!navigator.clipboard) {
            // Fallback method for older browsers that do not support navigator.clipboard API
            const textArea = document.createElement('textarea');
            textArea.value = text;
            // Avoid scrolling to bottom
            textArea.style.position = 'fixed';
            textArea.style.opacity = '0'; // Make textarea invisible
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
                const successful = document.execCommand('copy');
                if (!successful) {
                    throw new Error('Fallback: Copy command was unsuccessful');
                }
                console.log('Fallback: Copying text command was successful');
            }
            catch (error) {
                console.error('Fallback: Oops, unable to copy', error);
                throw new Error(`Fallback: Copy command was unsuccessful: ${error?.message}`);
            }
            finally {
                document.body.removeChild(textArea); // Clean up
            }
        }
        else {
            // Modern method using navigator.clipboard API
            try {
                await navigator.clipboard.writeText(text);
                console.log('Async: Copying to clipboard was successful!');
            }
            catch (error) {
                console.error('Async: Could not copy text: ', error);
                throw new Error(`Async: Could not copy text: ${error?.message}`);
            }
        }
    }
    /**
     * Sets the auto refresh behavior based on the provided value.
     * @param {boolean} value - If true, enables auto refresh; if false, disables it.
     */
    setAutoRefresh(value) {
        if (value) {
            // Enable auto refresh
            this.autoRefreshTimer = timer(0, 60000) // Timer starts immediately and fires every 60 seconds
                .pipe(tap(() => this.refresh()), // Perform the refresh action on each timer tick
            untilDestroyed(this) // Automatically unsubscribe when component is destroyed
            )
                .subscribe();
        }
        else {
            // Disable auto refresh
            if (this.autoRefreshTimer instanceof Subscription) {
                this.autoRefreshTimer.unsubscribe(); // Unsubscribe from the timer observable
                this.autoRefreshTimer = null; // Clear the timer reference
            }
        }
    }
    /**
     * Handles custom events related to job actions such as viewing, applying, and hiding jobs.
     * @param $event The custom event containing action and data payload.
     */
    async onCustomEvents($event) {
        switch ($event.action) {
            case 'view':
                if ($event.data.jobPost) {
                    window.open($event.data.jobPost.url, '_blank');
                }
                break;
            case 'apply':
                // Define the applyRequest object
                const applyRequest = {
                    applied: true,
                    employeeId: $event.data.employeeId,
                    providerCode: $event.data.providerCode,
                    providerJobId: $event.data.providerJobId
                };
                try {
                    // Await the applyJob function call
                    const resp = await this._jobService.applyJob(applyRequest);
                    // Show success message and refresh smart table
                    this._toastrService.success('TOASTR.MESSAGE.JOB_APPLIED');
                    this.smartTableSource.refresh();
                    // Check if a redirect is required
                    if (resp.isRedirectRequired) {
                        // Fetch the proposal template
                        const proposalTemplate = await this.getEmployeeDefaultProposalTemplate($event.data);
                        if (proposalTemplate) {
                            // Copy proposal content to clipboard
                            await this.copyTextToClipboard(proposalTemplate.content);
                        }
                        // Open a new window with job post URL
                        window.open($event.data.jobPost.url, '_blank');
                    }
                }
                catch (error) {
                    console.error('Error while applying job:', error);
                    // Optionally show an error message or handle the error scenario
                    this._errorHandlingService.handleError(error);
                }
                break;
            case 'hide':
                try {
                    await this.hideJobPost({
                        hide: true,
                        employeeId: $event.data.employeeId,
                        providerCode: $event.data.providerCode,
                        providerJobId: $event.data.providerJobId
                    });
                    this._toastrService.success('TOASTR.MESSAGE.JOB_HIDDEN');
                    this.smartTableSource.refresh();
                }
                catch (error) {
                    console.log('Error while hide job', error);
                    // Optionally show an error message or handle the error scenario
                    this._errorHandlingService.handleError(error);
                }
                break;
            default:
                break;
        }
    }
    /**
     * On select job search Row
     *
     * @param param0
     */
    onSelectJob({ isSelected, data }) {
        this.disableButton = !isSelected;
        this.selectedJob = isSelected ? data : null;
    }
    /**
     * Opens the job post URL in a new tab if a job is selected and has a valid URL.
     */
    viewJob() {
        if (!this.selectedJob) {
            return;
        }
        if (this.selectedJob.jobPost && this.selectedJob.jobPost.url) {
            window.open(this.selectedJob.jobPost.url, '_blank');
        }
    }
    /**
     * Updates job visibility by hiding the selected job post.
     * Displays success message on job hidden and refreshes the smart table source.
     */
    async hideJob() {
        // Check if a job is selected
        if (!this.selectedJob) {
            return;
        }
        try {
            // Destructure selected job properties
            const { employeeId, providerCode, providerJobId } = this.selectedJob;
            // Call service method to hide the job post
            await this.hideJobPost({ hide: true, employeeId, providerCode, providerJobId });
            // Display success message using toastr service
            this._toastrService.success('TOASTR.MESSAGE.JOB_HIDDEN');
            // Refresh the smart table source
            this.smartTableSource.refresh();
            // Clear selection of the job post
            this.onSelectJob({ isSelected: false, data: null });
        }
        catch (error) {
            // Log and handle any errors that occur during hiding the job post
            console.error('Error while hiding job', error);
            this._toastrService.error('TOASTR.MESSAGE.ERROR_HIDING_JOB');
        }
    }
    /**
     * Updates job visibility by hiding the job post based on the provided input.
     *
     * @param input The input data containing employee ID, provider code, and provider job ID.
     */
    async hideJobPost(input) {
        try {
            const { employeeId, providerCode, providerJobId } = input;
            // Check if provider code and provider job ID are provided
            if (providerCode && providerJobId) {
                // Prepare payload for hiding job post
                const payload = {
                    hide: true,
                    employeeId,
                    providerCode,
                    providerJobId
                };
                // Call job service method to hide the job post
                await this._jobService.hideJob(payload);
            }
        }
        catch (error) {
            // Log and handle any errors that occur during hiding the job post
            console.error('Error while hiding job', error);
        }
    }
    /**
     * Marks the selected job as already applied on the provider site.
     * Updates job application status and refreshes the smart table source.
     */
    async appliedJob() {
        // Check if a job is selected
        if (!this.selectedJob) {
            return;
        }
        try {
            // Destructure selected job properties
            const { employeeId, providerCode, providerJobId } = this.selectedJob;
            // Call job service method to update job application status
            await this._jobService.updateApplied({
                employeeId,
                providerCode,
                providerJobId,
                applied: true
            });
            // Display success message using toastr service
            this._toastrService.success('TOASTR.MESSAGE.JOB_APPLIED');
            // Refresh the smart table source
            this.smartTableSource.refresh();
        }
        catch (error) {
            // Log and handle any errors that occur during updating job application status
            console.error('Error while marking job as applied', error);
            this._toastrService.error('TOASTR.MESSAGE.ERROR_APPLYING_JOB');
        }
    }
    /**
     * Apply for a job post using the provided job application details.
     *
     * @param applyJobPost The job application details.
     */
    async applyToJob(applyJobPost) {
        // Check if a job is selected
        if (!this.selectedJob) {
            return;
        }
        try {
            // Apply for the job using job service method
            const appliedJob = await this._jobService.applyJob(applyJobPost);
            // Display success message using toastr service
            this._toastrService.success('TOASTR.MESSAGE.JOB_APPLIED');
            // Remove the selected row from the table after applying
            const row = document.querySelector('angular2-smart-table > table > tbody > .angular2-smart-row.selected');
            if (row) {
                row.remove();
                this.onSelectJob({ isSelected: false, data: null });
            }
            // Handle redirection and proposal copying if required
            if (appliedJob.isRedirectRequired) {
                // Copy proposal to clipboard if generated, else use default proposal template
                if (appliedJob.proposal) {
                    await this.copyTextToClipboard(appliedJob.proposal);
                }
                else {
                    const proposalTemplate = await this.getEmployeeDefaultProposalTemplate(this.selectedJob);
                    if (proposalTemplate) {
                        await this.copyTextToClipboard(proposalTemplate.content);
                    }
                }
                // Open job post URL in a new tab
                window.open(this.selectedJob.jobPost.url, '_blank');
            }
        }
        catch (error) {
            // Log and handle any errors that occur during job application
            console.error('Error while applying job post', error);
            this._toastrService.error('TOASTR.MESSAGE.ERROR_APPLYING_JOB');
        }
    }
    /**
     * Apply for a job automatically using the selected job details.
     */
    async applyToJobAutomatically() {
        // Check if a job is selected
        if (!this.selectedJob) {
            return;
        }
        try {
            // Prepare job application details
            const { providerCode, providerJobId, employeeId } = this.selectedJob;
            const applyJobPost = {
                applied: true,
                // Choose employeeId based on whether selectedEmployee is defined
                ...(this.selectedEmployee?.id ? { employeeId: this.selectedEmployee.id } : { employeeId }),
                providerCode,
                providerJobId
            };
            // Apply for the job using applyToJob method
            await this.applyToJob(applyJobPost);
        }
        catch (error) {
            // Log and handle any errors that occur during automatic job application
            console.error('Error while applying job post automatically', error);
        }
    }
    /**
     * Apply for a job manually using a dialog component.
     */
    async applyToJobManually() {
        // Check if a job is selected
        if (!this.selectedJob) {
            return;
        }
        // Open a dialog to handle manual job application
        const dialog = this._dialogService.open(ApplyJobManuallyComponent, {
            context: {
                employeeJobPost: this.selectedJob,
                selectedEmployee: this.selectedEmployee
            },
            hasScroll: false
        });
        try {
            // Wait for dialog result
            const result = await firstValueFrom(dialog.onClose);
            // Process job application if result is available
            if (result) {
                const { providerCode, providerJobId } = this.selectedJob;
                const { applied, employeeId, proposal, rate, details, attachments } = result;
                // Prepare job application details
                const applyJobPost = {
                    applied,
                    employeeId,
                    proposal,
                    rate,
                    details,
                    attachments,
                    providerCode,
                    providerJobId
                };
                // Apply for the job using applyToJob method
                await this.applyToJob(applyJobPost);
            }
        }
        catch (error) {
            // Log and handle any errors that occur during manual job application
            console.error('Error while applying job post manually', error);
        }
    }
    /**
     * Loads smart table settings.
     */
    _loadSmartTableSettings() {
        const self = this;
        const pagination = this.getPagination();
        this.settingsSmartTable = {
            ...this.settingsSmartTable,
            pager: {
                display: false,
                perPage: pagination ? pagination.itemsPerPage : 10
            },
            columns: {
                ...(this.selectedEmployee?.id
                    ? {}
                    : {
                        employee: {
                            title: this.getTranslation('JOBS.EMPLOYEE'),
                            isFilterable: false,
                            width: '15%',
                            type: 'custom',
                            isSortable: false,
                            renderComponent: EmployeeLinksComponent,
                            componentInitFunction: (instance, cell) => {
                                // Get row data
                                const employee = cell.getRawValue();
                                instance.rowData = cell.getRow().getData();
                                // Set value
                                instance.value = {
                                    name: employee?.user?.name ?? null,
                                    imageUrl: employee?.user?.imageUrl ?? null,
                                    id: employee?.id ?? null
                                };
                            }
                        }
                    }),
                jobDetails: {
                    title: this.getTranslation('JOBS.JOB_DETAILS'),
                    width: '85%',
                    type: 'custom',
                    isFilterable: false,
                    isSortable: false,
                    renderComponent: JobTitleDescriptionDetailsComponent,
                    componentInitFunction(instance, cell) {
                        // Get row data
                        instance.rowData = cell.getRow().getData();
                        // Hide job event
                        instance.hideJobEvent.subscribe((event) => {
                            self.onCustomEvents({ action: 'hide', data: event });
                        });
                    }
                }
            }
        };
    }
    /*
     * Register Smart Table Source Config
     */
    setSmartTableSource() {
        if (!this.organization) {
            return;
        }
        try {
            /**
             * Initiate smart table source configuration
             */
            this.smartTableSource = new ServerDataSource(this._http, {
                endPoint: `${API_PREFIX}/employee-job`,
                pagerPageKey: 'page',
                pagerLimitKey: 'limit',
                finalize: () => {
                    this.setPagination({
                        ...this.getPagination(),
                        totalItems: this.smartTableSource.count()
                    });
                    this.loading = false;
                }
            });
        }
        catch (error) {
            console.log('Error while retrieving employee Job searches', error);
            this._errorHandlingService.handleError(error);
        }
    }
    /**
     * Retrieves employee jobs based on various filters and sets the smart table data source.
     * @returns Promise<void>
     */
    async getEmployeeJobs() {
        if (!this.organization) {
            return;
        }
        try {
            this.setSmartTableSource();
        }
        catch (error) {
            console.log('Error while set smart table source configuration', error);
        }
        try {
            const { activePage, itemsPerPage } = this.getPagination();
            const { title, jobSource, jobType, jobStatus, budget } = this.form.value;
            const { startDate, endDate } = getAdjustDateRangeFutureAllowed(this.selectedDateRange);
            const { id: organizationId, tenantId } = this.organization;
            /**
             * Set header selectors filters configuration
             */
            this.smartTableSource.setFilter([
                ...(isNotEmpty(organizationId)
                    ? [
                        {
                            field: 'organizationId',
                            search: organizationId
                        },
                        {
                            field: 'tenantId',
                            search: tenantId
                        }
                    ]
                    : []),
                ...(isNotEmpty(this.selectedEmployee?.id)
                    ? [
                        {
                            field: 'employeeIds',
                            search: [this.selectedEmployee?.id]
                        }
                    ]
                    : []),
                ...(startDate && endDate
                    ? [
                        {
                            field: 'jobDateCreated',
                            search: {
                                between: {
                                    lower: toUTC(startDate).format('YYYY-MM-DD HH:mm:ss'),
                                    upper: toUTC(endDate).format('YYYY-MM-DD HH:mm:ss')
                                }
                            }
                        }
                    ]
                    : []),
                ...(title
                    ? [
                        {
                            field: 'title',
                            search: title
                        }
                    ]
                    : []),
                ...(jobSource
                    ? [
                        {
                            field: 'jobSource',
                            search: jobSource
                        }
                    ]
                    : []),
                ...(jobType
                    ? [
                        {
                            field: 'jobType',
                            search: jobType
                        }
                    ]
                    : []),
                ...(jobStatus
                    ? [
                        {
                            field: 'jobStatus',
                            search: jobStatus
                        }
                    ]
                    : []),
                ...(budget
                    ? [
                        {
                            field: 'budget',
                            search: budget
                        }
                    ]
                    : []),
                // Get only fresh jobs (not applied yet)
                ...(true
                    ? [
                        {
                            field: 'isApplied',
                            search: 'false'
                        }
                    ]
                    : [])
            ], false);
            /**
             * Set smart table sorting filters configuration
             */
            this.smartTableSource.setSort([
                {
                    field: 'status',
                    direction: 'asc'
                }
            ], false);
            /**
             * Applied smart table pagination configuration
             */
            this.smartTableSource.setPaging(activePage, itemsPerPage, false);
        }
        catch (error) {
            this._toastrService.danger(error);
        }
    }
    /*
     * Hide all jobs
     */
    async hideAll() {
        const request = {
            hide: true,
            ...(isNotEmpty(this.selectedEmployee) ? { employeeId: this.selectedEmployee.id } : {})
        };
        try {
            await this._jobService.hideJob(request);
            this._toastrService.success('TOASTR.MESSAGE.JOB_HIDDEN');
            this.smartTableSource.refresh();
        }
        catch (error) {
            console.log('Error while hiding jobs:', error);
            // Handle and log errors using an error handling service
            this._errorHandlingService.handleError(error);
        }
    }
    _applyTranslationOnSmartTable() {
        this.translateService.onLangChange
            .pipe(tap(() => this._loadSmartTableSettings()), untilDestroyed(this))
            .subscribe();
    }
    /**
     * Handles tab change event.
     * Resets the form and updates the active tab ID.
     * @param tab The tab component that triggered the change.
     */
    onTabChange(tab) {
        this.form.reset();
        this.nbTab$.next(tab.tabId);
    }
    /**
     * Initiates a job search based on form validity.
     * Emits a signal to start fetching jobs if the form is valid.
     */
    searchJobs() {
        if (this.form.invalid) {
            return;
        }
        this.jobs$.next(true);
    }
    /**
     * Handles form submission on Enter key press.
     * Initiates a job search.
     */
    handleSubmitOnEnter() {
        this.searchJobs();
    }
    /**
     * Resets the form, clears filters, and refreshes the job list.
     */
    reset() {
        this.form.reset();
        this._filters = {};
        this.refresh();
    }
    /**
     * Initiates a refresh of job list with updated parameters.
     * Resets pagination, triggers job fetch, and scrolls to top of page.
     */
    refresh() {
        this.isRefresh = true;
        this.refreshPagination();
        this.scrollTop();
        this.jobs$.next(true);
    }
    ngOnDestroy() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: JobSearchComponent, deps: [{ token: i1.TranslateService }, { token: i2.UntypedFormBuilder }, { token: i3.HttpClient }, { token: i4.ActivatedRoute }, { token: i4.Router }, { token: i5.NbDialogService }, { token: i6.Store }, { token: i6.ProposalTemplateService }, { token: i6.ToastrService }, { token: i6.JobService }, { token: i6.DateRangePickerBuilderService }, { token: i6.ErrorHandlingService }, { token: i7.NgxPermissionsService }, { token: i8.I18nService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: JobSearchComponent, isStandalone: false, selector: "ga-job-search", viewQueries: [{ propertyName: "actionButtons", first: true, predicate: ["actionButtons"], descendants: true, static: true }, { propertyName: "visibleButton", first: true, predicate: ["visibleButton"], descendants: true, static: true }], usesInheritance: true, ngImport: i0, template: "<nb-card>\n\t<nb-card-header class=\"header d-flex justify-content-between align-items-center p-3\">\n\t\t<h4>\n\t\t\t<ngx-header-title>\n\t\t\t\t{{ 'JOBS.JOB_SEARCH' | translate }}\n\t\t\t</ngx-header-title>\n\t\t</h4>\n\t\t<div>\n\t\t\t<ng-template [ngxPermissionsOnly]=\"PermissionsEnum.ORG_JOB_EMPLOYEE_VIEW\">\n\t\t\t\t<button\n\t\t\t\t\tstatus=\"primary\"\n\t\t\t\t\t[routerLink]=\"'/pages/jobs/employee'\"\n\t\t\t\t\tsize=\"small\"\n\t\t\t\t\toutline\n\t\t\t\t\tclass=\"action\"\n\t\t\t\t\tnbButton\n\t\t\t\t>\n\t\t\t\t\t{{ 'JOBS.EMPLOYEES' | translate }}\n\t\t\t\t</button>\n\t\t\t</ng-template>\n\t\t\t<ng-template [ngxPermissionsOnly]=\"PermissionsEnum.ORG_JOB_MATCHING_VIEW\">\n\t\t\t\t<button\n\t\t\t\t\tstatus=\"primary\"\n\t\t\t\t\t[routerLink]=\"'/pages/jobs/matching'\"\n\t\t\t\t\tsize=\"small\"\n\t\t\t\t\tclass=\"action\"\n\t\t\t\t\toutline\n\t\t\t\t\tnbButton\n\t\t\t\t>\n\t\t\t\t\t{{ 'JOBS.MATCHINGS' | translate }}\n\t\t\t\t</button>\n\t\t\t</ng-template>\n\t\t\t<ng-template [ngxPermissionsOnly]=\"PermissionsEnum.ORG_PROPOSAL_TEMPLATES_VIEW\">\n\t\t\t\t<button\n\t\t\t\t\tstatus=\"primary\"\n\t\t\t\t\t[routerLink]=\"'/pages/jobs/proposal-template'\"\n\t\t\t\t\tsize=\"small\"\n\t\t\t\t\tclass=\"action\"\n\t\t\t\t\toutline\n\t\t\t\t\tnbButton\n\t\t\t\t>\n\t\t\t\t\t{{ 'JOBS.PROPOSALS_TEMPLATE' | translate }}\n\t\t\t\t</button>\n\t\t\t</ng-template>\n\t\t</div>\n\t</nb-card-header>\n\t<nb-card-body class=\"p-0\">\n\t\t<div class=\"gauzy-button-container\">\n\t\t\t<ngx-gauzy-button-action\n\t\t\t\t[isDisable]=\"disableButton\"\n\t\t\t\t[buttonTemplateVisible]=\"visibleButton\"\n\t\t\t\t[buttonTemplate]=\"actionButtons\"\n\t\t\t\t[hasLayoutSelector]=\"false\"\n\t\t\t></ngx-gauzy-button-action>\n\t\t\t<div class=\"d-flex align-items-center\">\n\t\t\t\t<nb-toggle\n\t\t\t\t\tclass=\"mr-3 ml-3\"\n\t\t\t\t\t(checkedChange)=\"setAutoRefresh($event)\"\n\t\t\t\t\t[(ngModel)]=\"autoRefresh\"\n\t\t\t\t\tstatus=\"basic\"\n\t\t\t\t\toutline\n\t\t\t\t\tsize=\"small\"\n\t\t\t\t>\n\t\t\t\t\t{{ 'BUTTONS.AUTO_REFRESH' | translate }}\n\t\t\t\t</nb-toggle>\n\t\t\t\t@if (autoRefresh) {\n\t\t\t\t\t<ng-container [ngTemplateOutlet]=\"sync\"></ng-container>\n\t\t\t\t}\n\t\t\t\t@if (!autoRefresh) {\n\t\t\t\t\t<button\n\t\t\t\t\t\ttype=\"button\"\n\t\t\t\t\t\t(click)=\"refresh()\"\n\t\t\t\t\t\tnbButton\n\t\t\t\t\t\tstatus=\"basic\"\n\t\t\t\t\t\toutline\n\t\t\t\t\t\tsize=\"small\"\n\t\t\t\t\t\tclass=\"refresh-button\"\n\t\t\t\t\t>\n\t\t\t\t\t\t<ng-container [ngTemplateOutlet]=\"sync\"></ng-container>\n\t\t\t\t\t\t{{ 'BUTTONS.REFRESH' | translate }}\n\t\t\t\t\t</button>\n\t\t\t\t}\n\t\t\t</div>\n\t\t</div>\n\t\t<nb-tabset (changeTab)=\"onTabChange($event)\">\n\t\t\t<nb-tab [tabId]=\"JobSearchTabsEnum.ACTIONS\" [tabTitle]=\"'JOBS.BROWSE' | translate\">\n\t\t\t\t@if ((nbTab$ | async) === JobSearchTabsEnum.ACTIONS) {\n\t\t\t\t\t<ng-template [ngTemplateOutlet]=\"tableLayout\"></ng-template>\n\t\t\t\t}\n\t\t\t</nb-tab>\n\t\t\t<nb-tab [tabId]=\"JobSearchTabsEnum.SEARCH\" [tabTitle]=\"'JOBS.SEARCH' | translate\">\n\t\t\t\t<div class=\"job-filters\">\n\t\t\t\t\t<div class=\"advanced-filter\">\n\t\t\t\t\t\t<nb-card>\n\t\t\t\t\t\t\t<nb-card-body class=\"body-filter\">\n\t\t\t\t\t\t\t\t<form\n\t\t\t\t\t\t\t\t\t[formGroup]=\"form\"\n\t\t\t\t\t\t\t\t\t(ngSubmit)=\"searchJobs()\"\n\t\t\t\t\t\t\t\t\t(keydown.enter)=\"handleSubmitOnEnter()\"\n\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t<div class=\"row\">\n\t\t\t\t\t\t\t\t\t\t<div class=\"col-xl-6 col-md-8 col-12 form-group m-0\">\n\t\t\t\t\t\t\t\t\t\t\t<input\n\t\t\t\t\t\t\t\t\t\t\t\tnbInput\n\t\t\t\t\t\t\t\t\t\t\t\ttype=\"text\"\n\t\t\t\t\t\t\t\t\t\t\t\tclass=\"w-100\"\n\t\t\t\t\t\t\t\t\t\t\t\t[placeholder]=\"'JOBS.JOB_SEARCH' | translate\"\n\t\t\t\t\t\t\t\t\t\t\t\tformControlName=\"title\"\n\t\t\t\t\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t<div class=\"row selects mt-3\">\n\t\t\t\t\t\t\t\t\t\t<div class=\"col-xl-2 col-lg-3 col-md-6 form-group\">\n\t\t\t\t\t\t\t\t\t\t\t<label class=\"d-block\" for=\"jobSource\">\n\t\t\t\t\t\t\t\t\t\t\t\t{{ 'JOBS.FILTER.SOURCE' | translate }}\n\t\t\t\t\t\t\t\t\t\t\t</label>\n\t\t\t\t\t\t\t\t\t\t\t<nb-select\n\t\t\t\t\t\t\t\t\t\t\t\tid=\"jobSource\"\n\t\t\t\t\t\t\t\t\t\t\t\t[placeholder]=\"'JOBS.FILTER.SOURCE' | translate\"\n\t\t\t\t\t\t\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t\t\t\t\t\t\tmultiple\n\t\t\t\t\t\t\t\t\t\t\t\tformControlName=\"jobSource\"\n\t\t\t\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t\t\t\t@for (source of JobPostSourceEnum | keyvalue; track source) {\n\t\t\t\t\t\t\t\t\t\t\t\t\t<nb-option [value]=\"source?.value | lowercase\">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t{{ 'JOBS.' + source.key | translate }}\n\t\t\t\t\t\t\t\t\t\t\t\t\t</nb-option>\n\t\t\t\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\t\t\t</nb-select>\n\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t<div class=\"col-xl-2 col-lg-3 col-md-6 form-group\">\n\t\t\t\t\t\t\t\t\t\t\t<label class=\"d-block\" for=\"jobType\">\n\t\t\t\t\t\t\t\t\t\t\t\t{{ 'JOBS.FILTER.JOB_TYPE' | translate }}\n\t\t\t\t\t\t\t\t\t\t\t</label>\n\t\t\t\t\t\t\t\t\t\t\t<nb-select\n\t\t\t\t\t\t\t\t\t\t\t\tid=\"jobType\"\n\t\t\t\t\t\t\t\t\t\t\t\t[placeholder]=\"'JOBS.FILTER.JOB_TYPE' | translate\"\n\t\t\t\t\t\t\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t\t\t\t\t\t\tmultiple\n\t\t\t\t\t\t\t\t\t\t\t\tformControlName=\"jobType\"\n\t\t\t\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t\t\t\t@for (type of JobPostTypeEnum | keyvalue; track type) {\n\t\t\t\t\t\t\t\t\t\t\t\t\t<nb-option [value]=\"type.value | lowercase\">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t{{ 'JOBS.' + type.key | translate }}\n\t\t\t\t\t\t\t\t\t\t\t\t\t</nb-option>\n\t\t\t\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\t\t\t</nb-select>\n\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t<div class=\"col-xl-2 col-lg-3 col-md-6 form-group\">\n\t\t\t\t\t\t\t\t\t\t\t<label class=\"d-block\" for=\"jobStatus\">\n\t\t\t\t\t\t\t\t\t\t\t\t{{ 'JOBS.FILTER.JOB_STATUS' | translate }}\n\t\t\t\t\t\t\t\t\t\t\t</label>\n\t\t\t\t\t\t\t\t\t\t\t<nb-select\n\t\t\t\t\t\t\t\t\t\t\t\tid=\"jobStatus\"\n\t\t\t\t\t\t\t\t\t\t\t\t[placeholder]=\"'JOBS.FILTER.JOB_STATUS' | translate\"\n\t\t\t\t\t\t\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t\t\t\t\t\t\tformControlName=\"jobStatus\"\n\t\t\t\t\t\t\t\t\t\t\t\t[multiple]=\"true\"\n\t\t\t\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t\t\t\t@for (type of JobPostStatusEnum | keyvalue; track type) {\n\t\t\t\t\t\t\t\t\t\t\t\t\t<nb-option [value]=\"type.value | lowercase\">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t{{ 'JOBS.' + type.key | translate }}\n\t\t\t\t\t\t\t\t\t\t\t\t\t</nb-option>\n\t\t\t\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\t\t\t</nb-select>\n\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t<div class=\"col-xl-2 col-lg-3 col-md-6 form-group\">\n\t\t\t\t\t\t\t\t\t\t\t<label class=\"d-block\" for=\"budget\">\n\t\t\t\t\t\t\t\t\t\t\t\t{{ 'JOBS.FILTER.BUDGET' | translate }}\n\t\t\t\t\t\t\t\t\t\t\t</label>\n\t\t\t\t\t\t\t\t\t\t\t<nb-select\n\t\t\t\t\t\t\t\t\t\t\t\tid=\"budget\"\n\t\t\t\t\t\t\t\t\t\t\t\t[placeholder]=\"'JOBS.FILTER.BUDGET' | translate\"\n\t\t\t\t\t\t\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t\t\t\t\t\t\tmultiple\n\t\t\t\t\t\t\t\t\t\t\t\tformControlName=\"budget\"\n\t\t\t\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t\t\t\t<nb-option [value]=\"[null, 100]\">\n\t\t\t\t\t\t\t\t\t\t\t\t\t{{ 'JOBS.FILTER.LESS_THAN' | translate }}\n\t\t\t\t\t\t\t\t\t\t\t\t\t$100\n\t\t\t\t\t\t\t\t\t\t\t\t</nb-option>\n\t\t\t\t\t\t\t\t\t\t\t\t<nb-option [value]=\"[100, 500]\"> $100 - $500 </nb-option>\n\t\t\t\t\t\t\t\t\t\t\t\t<nb-option [value]=\"[500, 1000]\"> $500 - $1K </nb-option>\n\t\t\t\t\t\t\t\t\t\t\t\t<nb-option [value]=\"[1000, 5000]\"> $1K - $5K </nb-option>\n\t\t\t\t\t\t\t\t\t\t\t\t<nb-option [value]=\"[5000, null]\"> $5K+ </nb-option>\n\t\t\t\t\t\t\t\t\t\t\t</nb-select>\n\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t<div class=\"row\">\n\t\t\t\t\t\t\t\t\t\t<button\n\t\t\t\t\t\t\t\t\t\t\ttype=\"submit\"\n\t\t\t\t\t\t\t\t\t\t\tsize=\"small\"\n\t\t\t\t\t\t\t\t\t\t\tstatus=\"success\"\n\t\t\t\t\t\t\t\t\t\t\tclass=\"mr-3 ml-3\"\n\t\t\t\t\t\t\t\t\t\t\tnbButton\n\t\t\t\t\t\t\t\t\t\t\t[disabled]=\"form.invalid\"\n\t\t\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t\t\t{{ 'BUTTONS.SEARCH' | translate }}\n\t\t\t\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t\t\t\t\t<button\n\t\t\t\t\t\t\t\t\t\t\ttype=\"reset\"\n\t\t\t\t\t\t\t\t\t\t\tnbButton\n\t\t\t\t\t\t\t\t\t\t\tsize=\"small\"\n\t\t\t\t\t\t\t\t\t\t\tstatus=\"basic\"\n\t\t\t\t\t\t\t\t\t\t\toutline\n\t\t\t\t\t\t\t\t\t\t\t[disabled]=\"form.invalid\"\n\t\t\t\t\t\t\t\t\t\t\t(click)=\"reset()\"\n\t\t\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t\t\t{{ 'BUTTONS.RESET' | translate }}\n\t\t\t\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t</form>\n\t\t\t\t\t\t\t</nb-card-body>\n\t\t\t\t\t\t</nb-card>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t@if ((nbTab$ | async) === JobSearchTabsEnum.SEARCH) {\n\t\t\t\t\t<ng-template [ngTemplateOutlet]=\"tableLayout\"></ng-template>\n\t\t\t\t}\n\t\t\t</nb-tab>\n\t\t</nb-tabset>\n\t</nb-card-body>\n</nb-card>\n\n<!-- Template for the table layout -->\n<ng-template #tableLayout>\n\t<ng-template [ngxPermissionsOnly]=\"permGateOrgJobSearch\">\n\t\t<div class=\"table-scroll-container\">\n\t\t\t@if (settingsSmartTable) {\n\t\t\t\t<angular2-smart-table\n\t\t\t\t\t[class.ga-table-loading]=\"loading\"\n\t\t\t\t\tstyle=\"cursor: pointer\"\n\t\t\t\t\t[settings]=\"settingsSmartTable\"\n\t\t\t\t\t(userRowSelect)=\"onSelectJob($event)\"\n\t\t\t\t\t[source]=\"smartTableSource\"\n\t\t\t\t></angular2-smart-table>\n\t\t\t}\n\t\t</div>\n\t\t<div class=\"pagination-container\">\n\t\t\t@if (smartTableSource) {\n\t\t\t\t<ngx-pagination [source]=\"smartTableSource\"></ngx-pagination>\n\t\t\t}\n\t\t</div>\n\t</ng-template>\n\t<ng-template [ngxPermissionsExcept]=\"['ORG_JOB_SEARCH']\">\n\t\t<div>\n\t\t\t<!-- Content to display if the user does not have 'canEditComponent' permission -->\n\t\t</div>\n\t</ng-template>\n</ng-template>\n\n<!-- Template for the action buttons -->\n<ng-template #actionButtons let-buttonSize=\"buttonSize\" let-selectedItem=\"selectedItem\">\n\t<ng-template [ngxPermissionsOnly]=\"permGateAllOrgView\">\n\t\t<div class=\"btn-group actions\">\n\t\t\t<ng-template [ngxPermissionsOnly]=\"permGateOrgJobSearch\">\n\t\t\t\t<button status=\"basic\" class=\"action secondary\" size=\"small\" (click)=\"viewJob()\" nbButton>\n\t\t\t\t\t<nb-icon icon=\"eye-outline\" pack=\"eva\"></nb-icon>\n\t\t\t\t\t<span> {{ 'JOBS.VIEW' | translate }} </span>\n\t\t\t\t</button>\n\t\t\t</ng-template>\n\t\t\t<ng-template [ngxPermissionsOnly]=\"permGateOrgJobApply\">\n\t\t\t\t<button\n\t\t\t\t\tsize=\"small\"\n\t\t\t\t\tstyle=\"cursor: pointer\"\n\t\t\t\t\tstatus=\"basic\"\n\t\t\t\t\tclass=\"action success\"\n\t\t\t\t\t(click)=\"applyToJobManually()\"\n\t\t\t\t\tnbButton\n\t\t\t\t>\n\t\t\t\t\t<nb-icon icon=\"checkmark-outline\" pack=\"eva\"></nb-icon>\n\t\t\t\t\t<span>{{ 'JOBS.APPLY' | translate }}</span>\n\t\t\t\t</button>\n\t\t\t\t<button\n\t\t\t\t\tsize=\"small\"\n\t\t\t\t\tstyle=\"cursor: pointer\"\n\t\t\t\t\tstatus=\"basic\"\n\t\t\t\t\tclass=\"action success\"\n\t\t\t\t\t(click)=\"applyToJobAutomatically()\"\n\t\t\t\t\tnbButton\n\t\t\t\t>\n\t\t\t\t\t<nb-icon icon=\"checkmark-outline\" pack=\"eva\"></nb-icon>\n\t\t\t\t\t<span>{{ 'JOBS.APPLY_AUTO' | translate }}</span>\n\t\t\t\t</button>\n\t\t\t\t<button\n\t\t\t\t\tsize=\"small\"\n\t\t\t\t\tstyle=\"cursor: pointer\"\n\t\t\t\t\tstatus=\"basic\"\n\t\t\t\t\tclass=\"action primary\"\n\t\t\t\t\tnbButton\n\t\t\t\t\t(click)=\"appliedJob()\"\n\t\t\t\t>\n\t\t\t\t\t<nb-icon icon=\"checkmark-outline\" pack=\"eva\"></nb-icon>\n\t\t\t\t\t<span>{{ 'JOBS.APPLIED' | translate }}</span>\n\t\t\t\t</button>\n\t\t\t</ng-template>\n\t\t\t<ng-template [ngxPermissionsOnly]=\"permGateOrgJobEdit\">\n\t\t\t\t<button\n\t\t\t\t\tstyle=\"cursor: pointer\"\n\t\t\t\t\tstatus=\"basic\"\n\t\t\t\t\tclass=\"action warning\"\n\t\t\t\t\tsize=\"small\"\n\t\t\t\t\t(click)=\"hideJob()\"\n\t\t\t\t\t[nbTooltip]=\"'JOBS.HIDE' | translate\"\n\t\t\t\t\tnbButton\n\t\t\t\t>\n\t\t\t\t\t<nb-icon icon=\"eye-off-outline\" pack=\"eva\"></nb-icon>\n\t\t\t\t</button>\n\t\t\t</ng-template>\n\t\t</div>\n\t</ng-template>\n</ng-template>\n\n<!-- Template for the visible button -->\n<ng-template #visibleButton>\n\t<ng-template [ngxPermissionsOnly]=\"permGateOrgJobEdit\">\n\t\t<button\n\t\t\tsize=\"small\"\n\t\t\tstatus=\"basic\"\n\t\t\tclass=\"action warning\"\n\t\t\ttype=\"button\"\n\t\t\t(confirm)=\"hideAll()\"\n\t\t\tngxConfirmDialog\n\t\t\t[message]=\"'JOBS.HIDE_ALL_CONFIRM' | translate\"\n\t\t\t[yesText]=\"'BUTTONS.YES_HIDE_ALL_JOBS' | translate\"\n\t\t\t[noText]=\"'BUTTONS.CANCEL' | translate\"\n\t\t\tnbButton\n\t\t>\n\t\t\t<nb-icon icon=\"eye-off-outline\"></nb-icon>\n\t\t\t{{ 'BUTTONS.HIDE_ALL' | translate }}\n\t\t</button>\n\t</ng-template>\n</ng-template>\n\n<!-- Template for the sync button -->\n<ng-template #sync>\n\t<div class=\"sync-container\">\n\t\t<nb-icon class=\"sync\" icon=\"sync-outline\" [class.spin]=\"isRefresh\" size=\"small\"></nb-icon>\n\t</div>\n</ng-template>\n", styles: ["@charset \"UTF-8\";.action{box-shadow:inset 0 0 0 1px var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));border:none}.action[nbButton].appearance-filled.status-basic{background-color:var(--gauzy-card-2)}.action.info[nbButton].appearance-filled.status-basic,.action.info-text-1[nbButton].appearance-filled.status-basic{color:var(--gauzy-action-info-text)}.action.secondary{color:var(--text-hint-color)}.action.success{color:var(--gauzy-action-success-text)}.action.warning{color:var(--gauzy-action-warning-text)}.action.orange{color:#ffab2d}.action.primary{color:var(--text-primary-color)}.action.primary.soft[nbButton].appearance-filled.status-basic{background-color:#6e49e81a}.action.select-nb ::ng-deep{box-shadow:none}.action.select-nb ::ng-deep .select-button{box-shadow:inset 0 0 0 1px var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));background:var(--gauzy-card-2)}button{margin:5px}.actions{background:var(--gauzy-card-2);border-radius:var(--button-rectangle-border-radius);padding:2px 4px!important}.gauzy-button-container{display:flex;justify-content:flex-end;width:100%;padding-bottom:0}.card-custom-header{display:flex;flex-direction:column;width:100%;padding-bottom:0}:host ::ng-deep input{border-radius:var(--border-radius);box-shadow:inset 0 0 0 1px var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18))}:host .form-group nb-select,:host .form-group input{max-width:none}:host ::ng-deep .toggle-label{margin-bottom:0}:host ::ng-deep ngx-avatar .inner-wrapper{background-color:var(--color-primary-transparent-100);border-radius:var(--button-rectangle-border-radius);padding:3px 9px 3px 3px;display:flex;flex-direction:row;align-items:center;width:fit-content}:host ::ng-deep ngx-avatar .inner-wrapper .image-container{height:20px;width:20px;display:flex;align-items:center;justify-content:center}:host ::ng-deep ngx-avatar .inner-wrapper .image-container img[type=user]{height:18px;width:18px}:host ::ng-deep ngx-avatar .inner-wrapper .link-text{color:var(--text-primary-color);font-weight:400}:host nb-tab.content-active{padding:1rem;border-radius:0 0 var(--border-radius) var(--border-radius);display:flex;flex-direction:column;height:calc(100vh - calc(var(--header-height) + var(--footer-height)) - 13.125rem + 2.5rem);overflow:unset}[dir=ltr] :host nb-tab.content-active{padding:1rem .5rem 1rem 18px}[dir=rtl] :host nb-tab.content-active{padding:1rem 18px 1rem .5rem}[dir=ltr] :host nb-tab.content-active .job-filters{margin-right:.625rem}[dir=rtl] :host nb-tab.content-active .job-filters{margin-left:.625rem}:host nb-card,:host nb-tab{background-color:var(--gauzy-card-2);margin-bottom:0}:host nb-card-body{overflow:unset!important}:host nb-card-body.body-filter{height:auto!important}:host ::ng-deep .advanced-filter nb-select.shape-rectangle .select-button{border-radius:var(--button-rectangle-border-radius);box-shadow:inset 0 0 0 1px var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));min-height:2rem;display:flex;align-items:center;border:none}:host ::ng-deep .advanced-filter nb-select.size-medium .select-button.placeholder{font-size:var(--select-medium-text-font-size)}:host ::ng-deep .advanced-filter nb-select.appearance-outline.size-medium .select-button{border:none}:host ::ng-deep .advanced-filter nb-select button span{display:block;overflow-x:hidden;text-overflow:ellipsis}:host ::ng-deep .table-scroll-container{flex-grow:10;max-height:unset}.sync-container .sync{color:var(--gauzy-text-color-2);cursor:pointer;margin:0!important}.sync-container .sync.spin{color:var(--text-primary-color);animation:rotate 1s linear 0s infinite}@keyframes rotate{0%{transform:rotate(0)}to{transform:rotate(360deg)}}.sync-container span{color:var(--text-primary-color)}.refresh-button{display:flex;align-items:center;gap:4px}:host nb-card-header{--button-small-icon-size: .875rem;--button-small-icon-offset: .25rem;--button-small-icon-vertical-margin: 0;--button-filled-small-padding: .25rem .625rem;--button-outline-small-padding: .25rem .625rem;--button-ghost-small-padding: .25rem .625rem;--icon-button-filled-small-padding: .25rem;--icon-button-outline-small-padding: .25rem;--icon-button-ghost-small-padding: .25rem}:host .gauzy-button-container{--button-small-icon-size: .875rem;--button-small-icon-offset: .25rem;--button-small-icon-vertical-margin: 0;--button-filled-small-padding: .25rem .625rem;--button-outline-small-padding: .25rem .625rem;--button-ghost-small-padding: .25rem .625rem;--icon-button-filled-small-padding: .25rem;--icon-button-outline-small-padding: .25rem;--icon-button-ghost-small-padding: .25rem;position:absolute;top:0}[dir=ltr] :host .gauzy-button-container{right:1rem}[dir=rtl] :host .gauzy-button-container{left:1rem}:host .gauzy-button-container{box-sizing:content-box;padding:var(--tabset-tab-padding);padding-inline:0;height:var(--tabset-tab-text-line-height)}@media only screen and (max-width:1532px){:host .gauzy-button-container{padding-block:1.1428571429rem;padding-inline:0}}:host .gauzy-button-container{display:flex;align-items:center;justify-content:flex-end;pointer-events:none}:host .gauzy-button-container>*{pointer-events:auto}:host .gauzy-button-container ::ng-deep .actions-container{padding:0}:host .gauzy-button-container ::ng-deep .actions-container button{margin-block:0}.advanced-filter{border-radius:var(--border-radius)}.job-filters{margin-bottom:1rem}.job-filters nb-card{background-color:var(--gauzy-card-3)}.job-filters nb-card nb-card-body{border-radius:var(--border-radius)}.job-filters ::ng-deep input,.job-filters ::ng-deep nb-select.appearance-outline.status-basic .select-button,.job-filters ::ng-deep .ng-select .ng-select-container{background-color:var(--gauzy-card-1)!important;border:none;min-height:42px!important}.job-filters ::ng-deep .ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-placeholder,.job-filters ::ng-deep .ng-select.ng-select-single .ng-select-container .ng-value-container .ng-input{top:unset!important}.job-filters ::ng-deep label,.job-filters ::ng-deep .label{font-size:var(--text-label-font-size);font-weight:600;line-height:.8125rem;letter-spacing:-.01em;color:var(--gauzy-text-color-2)}.job-filters ::ng-deep textarea{background-color:var(--gauzy-card-1)!important;border:none}.job-filters ::ng-deep .ng-select .ng-select-container input,.job-filters ::ng-deep nb-tag-list input{background-color:unset!important}.job-filters .selects ::ng-deep input,.job-filters .selects ::ng-deep nb-select.appearance-outline.status-basic .select-button,.job-filters .selects ::ng-deep .ng-select .ng-select-container{background-color:var(--gauzy-card-4)!important;border:none;min-height:2rem!important}.job-filters .selects ::ng-deep .ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-placeholder,.job-filters .selects ::ng-deep .ng-select.ng-select-single .ng-select-container .ng-value-container .ng-input{top:unset!important}.job-filters .selects ::ng-deep label,.job-filters .selects ::ng-deep .label{font-size:var(--text-label-font-size);font-weight:600;line-height:.8125rem;letter-spacing:-.01em;color:var(--gauzy-text-color-2)}.job-filters .selects ::ng-deep textarea{background-color:var(--gauzy-card-4)!important;border:none}.job-filters .selects ::ng-deep .ng-select .ng-select-container input,.job-filters .selects ::ng-deep nb-tag-list input{background-color:unset!important}nb-tabset nb-tab:nth-child(2) div:nth-child(1){padding-right:0;--scrollbar-width: 0}nb-tabset nb-tab:nth-child(3){overflow-y:scroll}nb-tabset nb-tab:nth-child(3) div:nth-child(1){margin-right:0!important}nb-tabset nb-tab:nth-child(3) div:nth-child(2){padding-right:0;--scrollbar-width: 0;min-height:80%}:host{--gauzy-table-font-size: .6875rem;--gauzy-table-line-height: 1rem;--gauzy-table-cell-padding-y: .1875rem;--gauzy-table-cell-padding-x: .4375rem;--gauzy-table-header-font-size: .75rem;--gauzy-table-header-line-height: .8125rem;--gauzy-table-header-padding-y: .3125rem;--gauzy-table-header-padding-x: .4375rem;--gauzy-table-filter-padding-y: .1875rem;--gauzy-table-control-height: 1.5rem;--gauzy-table-badge-height: 1rem;--gauzy-table-badge-radius: .25rem;--gauzy-table-badge-padding-y: .1875rem;--gauzy-table-chip-font-size: .625rem;--gauzy-table-chip-line-height: .75rem;--gauzy-table-chip-padding-y: 0;--gauzy-table-chip-padding-x: .3125rem;--gauzy-table-chip-gap: .125rem;--gauzy-table-chip-block-gap: .5rem;--gauzy-people-avatar-size: 1.25rem;--gauzy-people-font-size: .75rem;--gauzy-people-chip-padding-y: .25rem}:host .table-scroll-container{background:var(--gauzy-card-1, var(--background-basic-color-1));box-shadow:inset 0 0 0 1px var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));border-radius:var(--border-radius, .5rem)}:host ::ng-deep angular2-smart-table tr.angular2-smart-titles>th{border-bottom:1px solid var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));vertical-align:middle}:host ::ng-deep angular2-smart-table tbody tr{background:transparent}:host ::ng-deep angular2-smart-table tbody tr>td{vertical-align:middle}:host ::ng-deep angular2-smart-table tbody tr:hover:not(.selected){background:var(--gauzy-hover-tint, rgba(126, 126, 143, .12))!important}:host ::ng-deep angular2-smart-table tbody tr.selected{background:var(--gauzy-active-tint, rgba(126, 126, 143, .2))!important;box-shadow:none!important}:host ::ng-deep angular2-smart-table tbody tr>td{vertical-align:top}:host ::ng-deep ga-notes-with-tags .tags:has(nb-badge){margin-bottom:.5rem}:host ::ng-deep ga-status-badge .badge-success{color:var(--gauzy-action-success-text, #047857);background-color:var(--gauzy-action-success-tint, rgba(4, 120, 87, .08))}:host ::ng-deep ga-status-badge .badge-warning{color:var(--gauzy-action-warning-text, #b45309);background-color:var(--gauzy-action-warning-tint, rgba(180, 83, 9, .08))}:host ::ng-deep ga-status-badge .badge-danger{color:var(--gauzy-action-danger-text, #dc2626);background-color:var(--gauzy-action-danger-tint, rgba(220, 38, 38, .08))}:host .pagination-container{display:flex;justify-content:flex-end;flex-wrap:wrap;gap:.5rem;margin-top:.25rem}@media(max-width:767px){:host .pagination-container{justify-content:center}}:host .pagination-container ::ng-deep ngx-pagination{width:auto}:host .pagination-container ::ng-deep ngx-pagination nav{margin-top:0!important;gap:.75rem}:host .pagination-container ::ng-deep ngx-pagination .pagination{gap:.125rem;font-size:.75rem}:host .pagination-container ::ng-deep ngx-pagination li a,:host .pagination-container ::ng-deep ngx-pagination li span{margin:0}:host .pagination-container ::ng-deep ngx-pagination li span{display:flex;align-items:center;justify-content:center;min-width:1.75rem;height:1.75rem;padding:0 .375rem;font-size:.75rem;line-height:1;border-radius:var(--gauzy-radius-sm, .375rem)}:host .pagination-container ::ng-deep ngx-pagination li span.icon{padding:0;background:var(--gauzy-hover-tint, rgba(126, 126, 143, .12));box-shadow:none;border-radius:var(--gauzy-radius-sm, .375rem)}:host .pagination-container ::ng-deep ngx-pagination li span.icon nb-icon{font-size:.875rem}:host .pagination-container ::ng-deep ngx-pagination li:hover span.icon{background:var(--gauzy-active-tint, rgba(126, 126, 143, .2))}:host .pagination-container ::ng-deep ngx-pagination li.disabled{opacity:.4;pointer-events:none}:host .pagination-container ::ng-deep ngx-pagination li.active span{width:auto;min-width:1.75rem;height:1.75rem;padding:0 .375rem!important;border-radius:var(--gauzy-radius-sm, .375rem);line-height:1;background:var(--gauzy-active-tint, rgba(126, 126, 143, .2));color:var(--text-basic-color);font-weight:600}:host .pagination-container ::ng-deep ngx-pagination>nav>div{gap:.5rem;font-size:.75rem;color:var(--gauzy-text-color-2, var(--text-hint-color))}:host .pagination-container ::ng-deep ngx-pagination nb-select .select-button{min-width:4rem;height:1.75rem;padding:0 .5rem;border-radius:var(--gauzy-radius-sm, .375rem);font-size:.75rem}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "directive", type: i4.RouterLink, selector: "[routerLink]", inputs: ["target", "queryParams", "fragment", "queryParamsHandling", "state", "info", "relativeTo", "preserveFragment", "skipLocationChange", "replaceUrl", "routerLink"] }, { kind: "component", type: i5.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "component", type: i5.NbCardComponent, selector: "nb-card", inputs: ["size", "status", "accent"] }, { kind: "component", type: i5.NbCardBodyComponent, selector: "nb-card-body" }, { kind: "component", type: i5.NbCardHeaderComponent, selector: "nb-card-header" }, { kind: "component", type: i5.NbIconComponent, selector: "nb-icon", inputs: ["icon", "pack", "options", "status", "config"] }, { kind: "directive", type: i5.NbInputDirective, selector: "input[nbInput],textarea[nbInput]", inputs: ["fieldSize", "status", "shape", "fullWidth"] }, { kind: "component", type: i5.NbSelectComponent, selector: "nb-select", inputs: ["size", "status", "shape", "appearance", "optionsListClass", "optionsPanelClass", "optionsWidth", "outline", "filled", "hero", "disabled", "fullWidth", "placeholder", "compareWith", "selected", "multiple", "optionsOverlayOffset", "scrollStrategy"], outputs: ["selectedChange"] }, { kind: "component", type: i5.NbOptionComponent, selector: "nb-option", inputs: ["value", "disabled"], outputs: ["selectionChange"] }, { kind: "component", type: i5.NbTabsetComponent, selector: "nb-tabset", inputs: ["fullWidth", "routeParam"], outputs: ["changeTab"] }, { kind: "component", type: i5.NbTabComponent, selector: "nb-tab", inputs: ["tabTitle", "tabId", "badgeDot", "tabIcon", "disabled", "responsive", "route", "active", "lazyLoad", "badgeText", "badgeStatus", "badgePosition"] }, { kind: "component", type: i5.NbToggleComponent, selector: "nb-toggle", inputs: ["checked", "disabled", "status", "labelPosition"], outputs: ["checkedChange"] }, { kind: "directive", type: i5.NbTooltipDirective, selector: "[nbTooltip]", inputs: ["nbTooltip", "nbTooltipPlacement", "nbTooltipAdjustment", "nbTooltipClass", "nbTooltipIcon", "nbTooltipStatus", "nbTooltipTrigger", "nbTooltipOffset", "nbTooltipDisabled"], outputs: ["nbTooltipShowStateChange"], exportAs: ["nbTooltip"] }, { kind: "component", type: i9.Angular2SmartTableComponent, selector: "angular2-smart-table", inputs: ["source", "settings"], outputs: ["rowSelect", "userRowSelect", "delete", "edit", "create", "custom", "deleteConfirm", "editConfirm", "editCancel", "createConfirm", "createCancel", "rowHover", "afterGridInit"] }, { kind: "component", type: i10.GauzyButtonActionComponent, selector: "ngx-gauzy-button-action", inputs: ["isDisable", "hasLayoutSelector", "componentName", "buttonTemplate", "buttonTemplateVisible"] }, { kind: "component", type: i10.PaginationV2Component, selector: "ngx-pagination", inputs: ["source", "perPageSelect"], outputs: ["changePage"] }, { kind: "directive", type: i10.SmartTableSettlingDirective, selector: "angular2-smart-table" }, { kind: "directive", type: i10.SmartTableFilterToggleDirective, selector: "angular2-smart-table" }, { kind: "directive", type: i10.ConfirmDirective, selector: "[ngxConfirmDialog]", inputs: ["message", "title", "yesText", "noText"], outputs: ["confirm", "decline"] }, { kind: "directive", type: i11.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: i2.ɵNgNoValidate, selector: "form:not([ngNoForm]):not([ngNativeValidate])" }, { kind: "directive", type: i2.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i2.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i2.NgControlStatusGroup, selector: "[formGroupName],[formArrayName],[ngModelGroup],[formGroup],[formArray],form:not([ngNoForm]),[ngForm]" }, { kind: "directive", type: i2.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "directive", type: i2.FormGroupDirective, selector: "[formGroup]", inputs: ["formGroup"], outputs: ["ngSubmit"], exportAs: ["ngForm"] }, { kind: "directive", type: i2.FormControlName, selector: "[formControlName]", inputs: ["formControlName", "disabled", "ngModel"], outputs: ["ngModelChange"] }, { kind: "directive", type: i7.NgxPermissionsDirective, selector: "[ngxPermissionsOnly],[ngxPermissionsExcept]", inputs: ["ngxPermissionsOnly", "ngxPermissionsOnlyThen", "ngxPermissionsOnlyElse", "ngxPermissionsExcept", "ngxPermissionsExceptElse", "ngxPermissionsExceptThen", "ngxPermissionsThen", "ngxPermissionsElse", "ngxPermissionsOnlyAuthorisedStrategy", "ngxPermissionsOnlyUnauthorisedStrategy", "ngxPermissionsExceptUnauthorisedStrategy", "ngxPermissionsExceptAuthorisedStrategy", "ngxPermissionsUnauthorisedStrategy", "ngxPermissionsAuthorisedStrategy"], outputs: ["permissionsAuthorized", "permissionsUnauthorized"] }, { kind: "component", type: i10.HeaderTitleComponent, selector: "ngx-header-title", inputs: ["allowEmployee", "allowOrganization"] }, { kind: "pipe", type: i1.TranslatePipe, name: "translate" }, { kind: "pipe", type: i11.AsyncPipe, name: "async" }, { kind: "pipe", type: i11.LowerCasePipe, name: "lowercase" }, { kind: "pipe", type: i11.KeyValuePipe, name: "keyvalue" }] }); }
};
JobSearchComponent = JobSearchComponent_1 = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [TranslateService,
        UntypedFormBuilder,
        HttpClient,
        ActivatedRoute,
        Router,
        NbDialogService,
        Store,
        ProposalTemplateService,
        ToastrService,
        JobService,
        DateRangePickerBuilderService,
        ErrorHandlingService,
        NgxPermissionsService,
        I18nService])
], JobSearchComponent);
export { JobSearchComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: JobSearchComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-job-search', standalone: false, template: "<nb-card>\n\t<nb-card-header class=\"header d-flex justify-content-between align-items-center p-3\">\n\t\t<h4>\n\t\t\t<ngx-header-title>\n\t\t\t\t{{ 'JOBS.JOB_SEARCH' | translate }}\n\t\t\t</ngx-header-title>\n\t\t</h4>\n\t\t<div>\n\t\t\t<ng-template [ngxPermissionsOnly]=\"PermissionsEnum.ORG_JOB_EMPLOYEE_VIEW\">\n\t\t\t\t<button\n\t\t\t\t\tstatus=\"primary\"\n\t\t\t\t\t[routerLink]=\"'/pages/jobs/employee'\"\n\t\t\t\t\tsize=\"small\"\n\t\t\t\t\toutline\n\t\t\t\t\tclass=\"action\"\n\t\t\t\t\tnbButton\n\t\t\t\t>\n\t\t\t\t\t{{ 'JOBS.EMPLOYEES' | translate }}\n\t\t\t\t</button>\n\t\t\t</ng-template>\n\t\t\t<ng-template [ngxPermissionsOnly]=\"PermissionsEnum.ORG_JOB_MATCHING_VIEW\">\n\t\t\t\t<button\n\t\t\t\t\tstatus=\"primary\"\n\t\t\t\t\t[routerLink]=\"'/pages/jobs/matching'\"\n\t\t\t\t\tsize=\"small\"\n\t\t\t\t\tclass=\"action\"\n\t\t\t\t\toutline\n\t\t\t\t\tnbButton\n\t\t\t\t>\n\t\t\t\t\t{{ 'JOBS.MATCHINGS' | translate }}\n\t\t\t\t</button>\n\t\t\t</ng-template>\n\t\t\t<ng-template [ngxPermissionsOnly]=\"PermissionsEnum.ORG_PROPOSAL_TEMPLATES_VIEW\">\n\t\t\t\t<button\n\t\t\t\t\tstatus=\"primary\"\n\t\t\t\t\t[routerLink]=\"'/pages/jobs/proposal-template'\"\n\t\t\t\t\tsize=\"small\"\n\t\t\t\t\tclass=\"action\"\n\t\t\t\t\toutline\n\t\t\t\t\tnbButton\n\t\t\t\t>\n\t\t\t\t\t{{ 'JOBS.PROPOSALS_TEMPLATE' | translate }}\n\t\t\t\t</button>\n\t\t\t</ng-template>\n\t\t</div>\n\t</nb-card-header>\n\t<nb-card-body class=\"p-0\">\n\t\t<div class=\"gauzy-button-container\">\n\t\t\t<ngx-gauzy-button-action\n\t\t\t\t[isDisable]=\"disableButton\"\n\t\t\t\t[buttonTemplateVisible]=\"visibleButton\"\n\t\t\t\t[buttonTemplate]=\"actionButtons\"\n\t\t\t\t[hasLayoutSelector]=\"false\"\n\t\t\t></ngx-gauzy-button-action>\n\t\t\t<div class=\"d-flex align-items-center\">\n\t\t\t\t<nb-toggle\n\t\t\t\t\tclass=\"mr-3 ml-3\"\n\t\t\t\t\t(checkedChange)=\"setAutoRefresh($event)\"\n\t\t\t\t\t[(ngModel)]=\"autoRefresh\"\n\t\t\t\t\tstatus=\"basic\"\n\t\t\t\t\toutline\n\t\t\t\t\tsize=\"small\"\n\t\t\t\t>\n\t\t\t\t\t{{ 'BUTTONS.AUTO_REFRESH' | translate }}\n\t\t\t\t</nb-toggle>\n\t\t\t\t@if (autoRefresh) {\n\t\t\t\t\t<ng-container [ngTemplateOutlet]=\"sync\"></ng-container>\n\t\t\t\t}\n\t\t\t\t@if (!autoRefresh) {\n\t\t\t\t\t<button\n\t\t\t\t\t\ttype=\"button\"\n\t\t\t\t\t\t(click)=\"refresh()\"\n\t\t\t\t\t\tnbButton\n\t\t\t\t\t\tstatus=\"basic\"\n\t\t\t\t\t\toutline\n\t\t\t\t\t\tsize=\"small\"\n\t\t\t\t\t\tclass=\"refresh-button\"\n\t\t\t\t\t>\n\t\t\t\t\t\t<ng-container [ngTemplateOutlet]=\"sync\"></ng-container>\n\t\t\t\t\t\t{{ 'BUTTONS.REFRESH' | translate }}\n\t\t\t\t\t</button>\n\t\t\t\t}\n\t\t\t</div>\n\t\t</div>\n\t\t<nb-tabset (changeTab)=\"onTabChange($event)\">\n\t\t\t<nb-tab [tabId]=\"JobSearchTabsEnum.ACTIONS\" [tabTitle]=\"'JOBS.BROWSE' | translate\">\n\t\t\t\t@if ((nbTab$ | async) === JobSearchTabsEnum.ACTIONS) {\n\t\t\t\t\t<ng-template [ngTemplateOutlet]=\"tableLayout\"></ng-template>\n\t\t\t\t}\n\t\t\t</nb-tab>\n\t\t\t<nb-tab [tabId]=\"JobSearchTabsEnum.SEARCH\" [tabTitle]=\"'JOBS.SEARCH' | translate\">\n\t\t\t\t<div class=\"job-filters\">\n\t\t\t\t\t<div class=\"advanced-filter\">\n\t\t\t\t\t\t<nb-card>\n\t\t\t\t\t\t\t<nb-card-body class=\"body-filter\">\n\t\t\t\t\t\t\t\t<form\n\t\t\t\t\t\t\t\t\t[formGroup]=\"form\"\n\t\t\t\t\t\t\t\t\t(ngSubmit)=\"searchJobs()\"\n\t\t\t\t\t\t\t\t\t(keydown.enter)=\"handleSubmitOnEnter()\"\n\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t<div class=\"row\">\n\t\t\t\t\t\t\t\t\t\t<div class=\"col-xl-6 col-md-8 col-12 form-group m-0\">\n\t\t\t\t\t\t\t\t\t\t\t<input\n\t\t\t\t\t\t\t\t\t\t\t\tnbInput\n\t\t\t\t\t\t\t\t\t\t\t\ttype=\"text\"\n\t\t\t\t\t\t\t\t\t\t\t\tclass=\"w-100\"\n\t\t\t\t\t\t\t\t\t\t\t\t[placeholder]=\"'JOBS.JOB_SEARCH' | translate\"\n\t\t\t\t\t\t\t\t\t\t\t\tformControlName=\"title\"\n\t\t\t\t\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t<div class=\"row selects mt-3\">\n\t\t\t\t\t\t\t\t\t\t<div class=\"col-xl-2 col-lg-3 col-md-6 form-group\">\n\t\t\t\t\t\t\t\t\t\t\t<label class=\"d-block\" for=\"jobSource\">\n\t\t\t\t\t\t\t\t\t\t\t\t{{ 'JOBS.FILTER.SOURCE' | translate }}\n\t\t\t\t\t\t\t\t\t\t\t</label>\n\t\t\t\t\t\t\t\t\t\t\t<nb-select\n\t\t\t\t\t\t\t\t\t\t\t\tid=\"jobSource\"\n\t\t\t\t\t\t\t\t\t\t\t\t[placeholder]=\"'JOBS.FILTER.SOURCE' | translate\"\n\t\t\t\t\t\t\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t\t\t\t\t\t\tmultiple\n\t\t\t\t\t\t\t\t\t\t\t\tformControlName=\"jobSource\"\n\t\t\t\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t\t\t\t@for (source of JobPostSourceEnum | keyvalue; track source) {\n\t\t\t\t\t\t\t\t\t\t\t\t\t<nb-option [value]=\"source?.value | lowercase\">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t{{ 'JOBS.' + source.key | translate }}\n\t\t\t\t\t\t\t\t\t\t\t\t\t</nb-option>\n\t\t\t\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\t\t\t</nb-select>\n\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t<div class=\"col-xl-2 col-lg-3 col-md-6 form-group\">\n\t\t\t\t\t\t\t\t\t\t\t<label class=\"d-block\" for=\"jobType\">\n\t\t\t\t\t\t\t\t\t\t\t\t{{ 'JOBS.FILTER.JOB_TYPE' | translate }}\n\t\t\t\t\t\t\t\t\t\t\t</label>\n\t\t\t\t\t\t\t\t\t\t\t<nb-select\n\t\t\t\t\t\t\t\t\t\t\t\tid=\"jobType\"\n\t\t\t\t\t\t\t\t\t\t\t\t[placeholder]=\"'JOBS.FILTER.JOB_TYPE' | translate\"\n\t\t\t\t\t\t\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t\t\t\t\t\t\tmultiple\n\t\t\t\t\t\t\t\t\t\t\t\tformControlName=\"jobType\"\n\t\t\t\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t\t\t\t@for (type of JobPostTypeEnum | keyvalue; track type) {\n\t\t\t\t\t\t\t\t\t\t\t\t\t<nb-option [value]=\"type.value | lowercase\">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t{{ 'JOBS.' + type.key | translate }}\n\t\t\t\t\t\t\t\t\t\t\t\t\t</nb-option>\n\t\t\t\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\t\t\t</nb-select>\n\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t<div class=\"col-xl-2 col-lg-3 col-md-6 form-group\">\n\t\t\t\t\t\t\t\t\t\t\t<label class=\"d-block\" for=\"jobStatus\">\n\t\t\t\t\t\t\t\t\t\t\t\t{{ 'JOBS.FILTER.JOB_STATUS' | translate }}\n\t\t\t\t\t\t\t\t\t\t\t</label>\n\t\t\t\t\t\t\t\t\t\t\t<nb-select\n\t\t\t\t\t\t\t\t\t\t\t\tid=\"jobStatus\"\n\t\t\t\t\t\t\t\t\t\t\t\t[placeholder]=\"'JOBS.FILTER.JOB_STATUS' | translate\"\n\t\t\t\t\t\t\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t\t\t\t\t\t\tformControlName=\"jobStatus\"\n\t\t\t\t\t\t\t\t\t\t\t\t[multiple]=\"true\"\n\t\t\t\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t\t\t\t@for (type of JobPostStatusEnum | keyvalue; track type) {\n\t\t\t\t\t\t\t\t\t\t\t\t\t<nb-option [value]=\"type.value | lowercase\">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t{{ 'JOBS.' + type.key | translate }}\n\t\t\t\t\t\t\t\t\t\t\t\t\t</nb-option>\n\t\t\t\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\t\t\t</nb-select>\n\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t<div class=\"col-xl-2 col-lg-3 col-md-6 form-group\">\n\t\t\t\t\t\t\t\t\t\t\t<label class=\"d-block\" for=\"budget\">\n\t\t\t\t\t\t\t\t\t\t\t\t{{ 'JOBS.FILTER.BUDGET' | translate }}\n\t\t\t\t\t\t\t\t\t\t\t</label>\n\t\t\t\t\t\t\t\t\t\t\t<nb-select\n\t\t\t\t\t\t\t\t\t\t\t\tid=\"budget\"\n\t\t\t\t\t\t\t\t\t\t\t\t[placeholder]=\"'JOBS.FILTER.BUDGET' | translate\"\n\t\t\t\t\t\t\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t\t\t\t\t\t\tmultiple\n\t\t\t\t\t\t\t\t\t\t\t\tformControlName=\"budget\"\n\t\t\t\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t\t\t\t<nb-option [value]=\"[null, 100]\">\n\t\t\t\t\t\t\t\t\t\t\t\t\t{{ 'JOBS.FILTER.LESS_THAN' | translate }}\n\t\t\t\t\t\t\t\t\t\t\t\t\t$100\n\t\t\t\t\t\t\t\t\t\t\t\t</nb-option>\n\t\t\t\t\t\t\t\t\t\t\t\t<nb-option [value]=\"[100, 500]\"> $100 - $500 </nb-option>\n\t\t\t\t\t\t\t\t\t\t\t\t<nb-option [value]=\"[500, 1000]\"> $500 - $1K </nb-option>\n\t\t\t\t\t\t\t\t\t\t\t\t<nb-option [value]=\"[1000, 5000]\"> $1K - $5K </nb-option>\n\t\t\t\t\t\t\t\t\t\t\t\t<nb-option [value]=\"[5000, null]\"> $5K+ </nb-option>\n\t\t\t\t\t\t\t\t\t\t\t</nb-select>\n\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t<div class=\"row\">\n\t\t\t\t\t\t\t\t\t\t<button\n\t\t\t\t\t\t\t\t\t\t\ttype=\"submit\"\n\t\t\t\t\t\t\t\t\t\t\tsize=\"small\"\n\t\t\t\t\t\t\t\t\t\t\tstatus=\"success\"\n\t\t\t\t\t\t\t\t\t\t\tclass=\"mr-3 ml-3\"\n\t\t\t\t\t\t\t\t\t\t\tnbButton\n\t\t\t\t\t\t\t\t\t\t\t[disabled]=\"form.invalid\"\n\t\t\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t\t\t{{ 'BUTTONS.SEARCH' | translate }}\n\t\t\t\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t\t\t\t\t<button\n\t\t\t\t\t\t\t\t\t\t\ttype=\"reset\"\n\t\t\t\t\t\t\t\t\t\t\tnbButton\n\t\t\t\t\t\t\t\t\t\t\tsize=\"small\"\n\t\t\t\t\t\t\t\t\t\t\tstatus=\"basic\"\n\t\t\t\t\t\t\t\t\t\t\toutline\n\t\t\t\t\t\t\t\t\t\t\t[disabled]=\"form.invalid\"\n\t\t\t\t\t\t\t\t\t\t\t(click)=\"reset()\"\n\t\t\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t\t\t{{ 'BUTTONS.RESET' | translate }}\n\t\t\t\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t</form>\n\t\t\t\t\t\t\t</nb-card-body>\n\t\t\t\t\t\t</nb-card>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t@if ((nbTab$ | async) === JobSearchTabsEnum.SEARCH) {\n\t\t\t\t\t<ng-template [ngTemplateOutlet]=\"tableLayout\"></ng-template>\n\t\t\t\t}\n\t\t\t</nb-tab>\n\t\t</nb-tabset>\n\t</nb-card-body>\n</nb-card>\n\n<!-- Template for the table layout -->\n<ng-template #tableLayout>\n\t<ng-template [ngxPermissionsOnly]=\"permGateOrgJobSearch\">\n\t\t<div class=\"table-scroll-container\">\n\t\t\t@if (settingsSmartTable) {\n\t\t\t\t<angular2-smart-table\n\t\t\t\t\t[class.ga-table-loading]=\"loading\"\n\t\t\t\t\tstyle=\"cursor: pointer\"\n\t\t\t\t\t[settings]=\"settingsSmartTable\"\n\t\t\t\t\t(userRowSelect)=\"onSelectJob($event)\"\n\t\t\t\t\t[source]=\"smartTableSource\"\n\t\t\t\t></angular2-smart-table>\n\t\t\t}\n\t\t</div>\n\t\t<div class=\"pagination-container\">\n\t\t\t@if (smartTableSource) {\n\t\t\t\t<ngx-pagination [source]=\"smartTableSource\"></ngx-pagination>\n\t\t\t}\n\t\t</div>\n\t</ng-template>\n\t<ng-template [ngxPermissionsExcept]=\"['ORG_JOB_SEARCH']\">\n\t\t<div>\n\t\t\t<!-- Content to display if the user does not have 'canEditComponent' permission -->\n\t\t</div>\n\t</ng-template>\n</ng-template>\n\n<!-- Template for the action buttons -->\n<ng-template #actionButtons let-buttonSize=\"buttonSize\" let-selectedItem=\"selectedItem\">\n\t<ng-template [ngxPermissionsOnly]=\"permGateAllOrgView\">\n\t\t<div class=\"btn-group actions\">\n\t\t\t<ng-template [ngxPermissionsOnly]=\"permGateOrgJobSearch\">\n\t\t\t\t<button status=\"basic\" class=\"action secondary\" size=\"small\" (click)=\"viewJob()\" nbButton>\n\t\t\t\t\t<nb-icon icon=\"eye-outline\" pack=\"eva\"></nb-icon>\n\t\t\t\t\t<span> {{ 'JOBS.VIEW' | translate }} </span>\n\t\t\t\t</button>\n\t\t\t</ng-template>\n\t\t\t<ng-template [ngxPermissionsOnly]=\"permGateOrgJobApply\">\n\t\t\t\t<button\n\t\t\t\t\tsize=\"small\"\n\t\t\t\t\tstyle=\"cursor: pointer\"\n\t\t\t\t\tstatus=\"basic\"\n\t\t\t\t\tclass=\"action success\"\n\t\t\t\t\t(click)=\"applyToJobManually()\"\n\t\t\t\t\tnbButton\n\t\t\t\t>\n\t\t\t\t\t<nb-icon icon=\"checkmark-outline\" pack=\"eva\"></nb-icon>\n\t\t\t\t\t<span>{{ 'JOBS.APPLY' | translate }}</span>\n\t\t\t\t</button>\n\t\t\t\t<button\n\t\t\t\t\tsize=\"small\"\n\t\t\t\t\tstyle=\"cursor: pointer\"\n\t\t\t\t\tstatus=\"basic\"\n\t\t\t\t\tclass=\"action success\"\n\t\t\t\t\t(click)=\"applyToJobAutomatically()\"\n\t\t\t\t\tnbButton\n\t\t\t\t>\n\t\t\t\t\t<nb-icon icon=\"checkmark-outline\" pack=\"eva\"></nb-icon>\n\t\t\t\t\t<span>{{ 'JOBS.APPLY_AUTO' | translate }}</span>\n\t\t\t\t</button>\n\t\t\t\t<button\n\t\t\t\t\tsize=\"small\"\n\t\t\t\t\tstyle=\"cursor: pointer\"\n\t\t\t\t\tstatus=\"basic\"\n\t\t\t\t\tclass=\"action primary\"\n\t\t\t\t\tnbButton\n\t\t\t\t\t(click)=\"appliedJob()\"\n\t\t\t\t>\n\t\t\t\t\t<nb-icon icon=\"checkmark-outline\" pack=\"eva\"></nb-icon>\n\t\t\t\t\t<span>{{ 'JOBS.APPLIED' | translate }}</span>\n\t\t\t\t</button>\n\t\t\t</ng-template>\n\t\t\t<ng-template [ngxPermissionsOnly]=\"permGateOrgJobEdit\">\n\t\t\t\t<button\n\t\t\t\t\tstyle=\"cursor: pointer\"\n\t\t\t\t\tstatus=\"basic\"\n\t\t\t\t\tclass=\"action warning\"\n\t\t\t\t\tsize=\"small\"\n\t\t\t\t\t(click)=\"hideJob()\"\n\t\t\t\t\t[nbTooltip]=\"'JOBS.HIDE' | translate\"\n\t\t\t\t\tnbButton\n\t\t\t\t>\n\t\t\t\t\t<nb-icon icon=\"eye-off-outline\" pack=\"eva\"></nb-icon>\n\t\t\t\t</button>\n\t\t\t</ng-template>\n\t\t</div>\n\t</ng-template>\n</ng-template>\n\n<!-- Template for the visible button -->\n<ng-template #visibleButton>\n\t<ng-template [ngxPermissionsOnly]=\"permGateOrgJobEdit\">\n\t\t<button\n\t\t\tsize=\"small\"\n\t\t\tstatus=\"basic\"\n\t\t\tclass=\"action warning\"\n\t\t\ttype=\"button\"\n\t\t\t(confirm)=\"hideAll()\"\n\t\t\tngxConfirmDialog\n\t\t\t[message]=\"'JOBS.HIDE_ALL_CONFIRM' | translate\"\n\t\t\t[yesText]=\"'BUTTONS.YES_HIDE_ALL_JOBS' | translate\"\n\t\t\t[noText]=\"'BUTTONS.CANCEL' | translate\"\n\t\t\tnbButton\n\t\t>\n\t\t\t<nb-icon icon=\"eye-off-outline\"></nb-icon>\n\t\t\t{{ 'BUTTONS.HIDE_ALL' | translate }}\n\t\t</button>\n\t</ng-template>\n</ng-template>\n\n<!-- Template for the sync button -->\n<ng-template #sync>\n\t<div class=\"sync-container\">\n\t\t<nb-icon class=\"sync\" icon=\"sync-outline\" [class.spin]=\"isRefresh\" size=\"small\"></nb-icon>\n\t</div>\n</ng-template>\n", styles: ["@charset \"UTF-8\";.action{box-shadow:inset 0 0 0 1px var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));border:none}.action[nbButton].appearance-filled.status-basic{background-color:var(--gauzy-card-2)}.action.info[nbButton].appearance-filled.status-basic,.action.info-text-1[nbButton].appearance-filled.status-basic{color:var(--gauzy-action-info-text)}.action.secondary{color:var(--text-hint-color)}.action.success{color:var(--gauzy-action-success-text)}.action.warning{color:var(--gauzy-action-warning-text)}.action.orange{color:#ffab2d}.action.primary{color:var(--text-primary-color)}.action.primary.soft[nbButton].appearance-filled.status-basic{background-color:#6e49e81a}.action.select-nb ::ng-deep{box-shadow:none}.action.select-nb ::ng-deep .select-button{box-shadow:inset 0 0 0 1px var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));background:var(--gauzy-card-2)}button{margin:5px}.actions{background:var(--gauzy-card-2);border-radius:var(--button-rectangle-border-radius);padding:2px 4px!important}.gauzy-button-container{display:flex;justify-content:flex-end;width:100%;padding-bottom:0}.card-custom-header{display:flex;flex-direction:column;width:100%;padding-bottom:0}:host ::ng-deep input{border-radius:var(--border-radius);box-shadow:inset 0 0 0 1px var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18))}:host .form-group nb-select,:host .form-group input{max-width:none}:host ::ng-deep .toggle-label{margin-bottom:0}:host ::ng-deep ngx-avatar .inner-wrapper{background-color:var(--color-primary-transparent-100);border-radius:var(--button-rectangle-border-radius);padding:3px 9px 3px 3px;display:flex;flex-direction:row;align-items:center;width:fit-content}:host ::ng-deep ngx-avatar .inner-wrapper .image-container{height:20px;width:20px;display:flex;align-items:center;justify-content:center}:host ::ng-deep ngx-avatar .inner-wrapper .image-container img[type=user]{height:18px;width:18px}:host ::ng-deep ngx-avatar .inner-wrapper .link-text{color:var(--text-primary-color);font-weight:400}:host nb-tab.content-active{padding:1rem;border-radius:0 0 var(--border-radius) var(--border-radius);display:flex;flex-direction:column;height:calc(100vh - calc(var(--header-height) + var(--footer-height)) - 13.125rem + 2.5rem);overflow:unset}[dir=ltr] :host nb-tab.content-active{padding:1rem .5rem 1rem 18px}[dir=rtl] :host nb-tab.content-active{padding:1rem 18px 1rem .5rem}[dir=ltr] :host nb-tab.content-active .job-filters{margin-right:.625rem}[dir=rtl] :host nb-tab.content-active .job-filters{margin-left:.625rem}:host nb-card,:host nb-tab{background-color:var(--gauzy-card-2);margin-bottom:0}:host nb-card-body{overflow:unset!important}:host nb-card-body.body-filter{height:auto!important}:host ::ng-deep .advanced-filter nb-select.shape-rectangle .select-button{border-radius:var(--button-rectangle-border-radius);box-shadow:inset 0 0 0 1px var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));min-height:2rem;display:flex;align-items:center;border:none}:host ::ng-deep .advanced-filter nb-select.size-medium .select-button.placeholder{font-size:var(--select-medium-text-font-size)}:host ::ng-deep .advanced-filter nb-select.appearance-outline.size-medium .select-button{border:none}:host ::ng-deep .advanced-filter nb-select button span{display:block;overflow-x:hidden;text-overflow:ellipsis}:host ::ng-deep .table-scroll-container{flex-grow:10;max-height:unset}.sync-container .sync{color:var(--gauzy-text-color-2);cursor:pointer;margin:0!important}.sync-container .sync.spin{color:var(--text-primary-color);animation:rotate 1s linear 0s infinite}@keyframes rotate{0%{transform:rotate(0)}to{transform:rotate(360deg)}}.sync-container span{color:var(--text-primary-color)}.refresh-button{display:flex;align-items:center;gap:4px}:host nb-card-header{--button-small-icon-size: .875rem;--button-small-icon-offset: .25rem;--button-small-icon-vertical-margin: 0;--button-filled-small-padding: .25rem .625rem;--button-outline-small-padding: .25rem .625rem;--button-ghost-small-padding: .25rem .625rem;--icon-button-filled-small-padding: .25rem;--icon-button-outline-small-padding: .25rem;--icon-button-ghost-small-padding: .25rem}:host .gauzy-button-container{--button-small-icon-size: .875rem;--button-small-icon-offset: .25rem;--button-small-icon-vertical-margin: 0;--button-filled-small-padding: .25rem .625rem;--button-outline-small-padding: .25rem .625rem;--button-ghost-small-padding: .25rem .625rem;--icon-button-filled-small-padding: .25rem;--icon-button-outline-small-padding: .25rem;--icon-button-ghost-small-padding: .25rem;position:absolute;top:0}[dir=ltr] :host .gauzy-button-container{right:1rem}[dir=rtl] :host .gauzy-button-container{left:1rem}:host .gauzy-button-container{box-sizing:content-box;padding:var(--tabset-tab-padding);padding-inline:0;height:var(--tabset-tab-text-line-height)}@media only screen and (max-width:1532px){:host .gauzy-button-container{padding-block:1.1428571429rem;padding-inline:0}}:host .gauzy-button-container{display:flex;align-items:center;justify-content:flex-end;pointer-events:none}:host .gauzy-button-container>*{pointer-events:auto}:host .gauzy-button-container ::ng-deep .actions-container{padding:0}:host .gauzy-button-container ::ng-deep .actions-container button{margin-block:0}.advanced-filter{border-radius:var(--border-radius)}.job-filters{margin-bottom:1rem}.job-filters nb-card{background-color:var(--gauzy-card-3)}.job-filters nb-card nb-card-body{border-radius:var(--border-radius)}.job-filters ::ng-deep input,.job-filters ::ng-deep nb-select.appearance-outline.status-basic .select-button,.job-filters ::ng-deep .ng-select .ng-select-container{background-color:var(--gauzy-card-1)!important;border:none;min-height:42px!important}.job-filters ::ng-deep .ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-placeholder,.job-filters ::ng-deep .ng-select.ng-select-single .ng-select-container .ng-value-container .ng-input{top:unset!important}.job-filters ::ng-deep label,.job-filters ::ng-deep .label{font-size:var(--text-label-font-size);font-weight:600;line-height:.8125rem;letter-spacing:-.01em;color:var(--gauzy-text-color-2)}.job-filters ::ng-deep textarea{background-color:var(--gauzy-card-1)!important;border:none}.job-filters ::ng-deep .ng-select .ng-select-container input,.job-filters ::ng-deep nb-tag-list input{background-color:unset!important}.job-filters .selects ::ng-deep input,.job-filters .selects ::ng-deep nb-select.appearance-outline.status-basic .select-button,.job-filters .selects ::ng-deep .ng-select .ng-select-container{background-color:var(--gauzy-card-4)!important;border:none;min-height:2rem!important}.job-filters .selects ::ng-deep .ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-placeholder,.job-filters .selects ::ng-deep .ng-select.ng-select-single .ng-select-container .ng-value-container .ng-input{top:unset!important}.job-filters .selects ::ng-deep label,.job-filters .selects ::ng-deep .label{font-size:var(--text-label-font-size);font-weight:600;line-height:.8125rem;letter-spacing:-.01em;color:var(--gauzy-text-color-2)}.job-filters .selects ::ng-deep textarea{background-color:var(--gauzy-card-4)!important;border:none}.job-filters .selects ::ng-deep .ng-select .ng-select-container input,.job-filters .selects ::ng-deep nb-tag-list input{background-color:unset!important}nb-tabset nb-tab:nth-child(2) div:nth-child(1){padding-right:0;--scrollbar-width: 0}nb-tabset nb-tab:nth-child(3){overflow-y:scroll}nb-tabset nb-tab:nth-child(3) div:nth-child(1){margin-right:0!important}nb-tabset nb-tab:nth-child(3) div:nth-child(2){padding-right:0;--scrollbar-width: 0;min-height:80%}:host{--gauzy-table-font-size: .6875rem;--gauzy-table-line-height: 1rem;--gauzy-table-cell-padding-y: .1875rem;--gauzy-table-cell-padding-x: .4375rem;--gauzy-table-header-font-size: .75rem;--gauzy-table-header-line-height: .8125rem;--gauzy-table-header-padding-y: .3125rem;--gauzy-table-header-padding-x: .4375rem;--gauzy-table-filter-padding-y: .1875rem;--gauzy-table-control-height: 1.5rem;--gauzy-table-badge-height: 1rem;--gauzy-table-badge-radius: .25rem;--gauzy-table-badge-padding-y: .1875rem;--gauzy-table-chip-font-size: .625rem;--gauzy-table-chip-line-height: .75rem;--gauzy-table-chip-padding-y: 0;--gauzy-table-chip-padding-x: .3125rem;--gauzy-table-chip-gap: .125rem;--gauzy-table-chip-block-gap: .5rem;--gauzy-people-avatar-size: 1.25rem;--gauzy-people-font-size: .75rem;--gauzy-people-chip-padding-y: .25rem}:host .table-scroll-container{background:var(--gauzy-card-1, var(--background-basic-color-1));box-shadow:inset 0 0 0 1px var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));border-radius:var(--border-radius, .5rem)}:host ::ng-deep angular2-smart-table tr.angular2-smart-titles>th{border-bottom:1px solid var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));vertical-align:middle}:host ::ng-deep angular2-smart-table tbody tr{background:transparent}:host ::ng-deep angular2-smart-table tbody tr>td{vertical-align:middle}:host ::ng-deep angular2-smart-table tbody tr:hover:not(.selected){background:var(--gauzy-hover-tint, rgba(126, 126, 143, .12))!important}:host ::ng-deep angular2-smart-table tbody tr.selected{background:var(--gauzy-active-tint, rgba(126, 126, 143, .2))!important;box-shadow:none!important}:host ::ng-deep angular2-smart-table tbody tr>td{vertical-align:top}:host ::ng-deep ga-notes-with-tags .tags:has(nb-badge){margin-bottom:.5rem}:host ::ng-deep ga-status-badge .badge-success{color:var(--gauzy-action-success-text, #047857);background-color:var(--gauzy-action-success-tint, rgba(4, 120, 87, .08))}:host ::ng-deep ga-status-badge .badge-warning{color:var(--gauzy-action-warning-text, #b45309);background-color:var(--gauzy-action-warning-tint, rgba(180, 83, 9, .08))}:host ::ng-deep ga-status-badge .badge-danger{color:var(--gauzy-action-danger-text, #dc2626);background-color:var(--gauzy-action-danger-tint, rgba(220, 38, 38, .08))}:host .pagination-container{display:flex;justify-content:flex-end;flex-wrap:wrap;gap:.5rem;margin-top:.25rem}@media(max-width:767px){:host .pagination-container{justify-content:center}}:host .pagination-container ::ng-deep ngx-pagination{width:auto}:host .pagination-container ::ng-deep ngx-pagination nav{margin-top:0!important;gap:.75rem}:host .pagination-container ::ng-deep ngx-pagination .pagination{gap:.125rem;font-size:.75rem}:host .pagination-container ::ng-deep ngx-pagination li a,:host .pagination-container ::ng-deep ngx-pagination li span{margin:0}:host .pagination-container ::ng-deep ngx-pagination li span{display:flex;align-items:center;justify-content:center;min-width:1.75rem;height:1.75rem;padding:0 .375rem;font-size:.75rem;line-height:1;border-radius:var(--gauzy-radius-sm, .375rem)}:host .pagination-container ::ng-deep ngx-pagination li span.icon{padding:0;background:var(--gauzy-hover-tint, rgba(126, 126, 143, .12));box-shadow:none;border-radius:var(--gauzy-radius-sm, .375rem)}:host .pagination-container ::ng-deep ngx-pagination li span.icon nb-icon{font-size:.875rem}:host .pagination-container ::ng-deep ngx-pagination li:hover span.icon{background:var(--gauzy-active-tint, rgba(126, 126, 143, .2))}:host .pagination-container ::ng-deep ngx-pagination li.disabled{opacity:.4;pointer-events:none}:host .pagination-container ::ng-deep ngx-pagination li.active span{width:auto;min-width:1.75rem;height:1.75rem;padding:0 .375rem!important;border-radius:var(--gauzy-radius-sm, .375rem);line-height:1;background:var(--gauzy-active-tint, rgba(126, 126, 143, .2));color:var(--text-basic-color);font-weight:600}:host .pagination-container ::ng-deep ngx-pagination>nav>div{gap:.5rem;font-size:.75rem;color:var(--gauzy-text-color-2, var(--text-hint-color))}:host .pagination-container ::ng-deep ngx-pagination nb-select .select-button{min-width:4rem;height:1.75rem;padding:0 .5rem;border-radius:var(--gauzy-radius-sm, .375rem);font-size:.75rem}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }], ctorParameters: () => [{ type: i1.TranslateService }, { type: i2.UntypedFormBuilder }, { type: i3.HttpClient }, { type: i4.ActivatedRoute }, { type: i4.Router }, { type: i5.NbDialogService }, { type: i6.Store }, { type: i6.ProposalTemplateService }, { type: i6.ToastrService }, { type: i6.JobService }, { type: i6.DateRangePickerBuilderService }, { type: i6.ErrorHandlingService }, { type: i7.NgxPermissionsService }, { type: i8.I18nService }], propDecorators: { actionButtons: [{
                type: ViewChild,
                args: ['actionButtons', { static: true }]
            }], visibleButton: [{
                type: ViewChild,
                args: ['visibleButton', { static: true }]
            }] } });
//# sourceMappingURL=job-search.component.js.map