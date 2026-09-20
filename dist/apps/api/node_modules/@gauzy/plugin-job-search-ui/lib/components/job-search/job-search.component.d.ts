import { AfterViewInit, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { NbDialogService, NbTabComponent } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { NgxPermissionsService } from 'ngx-permissions';
import { DateRangePickerBuilderService, ErrorHandlingService, ProposalTemplateService, ServerDataSource, Store, ToastrService } from '@gauzy/ui-core/core';
import { IEmployeeJobApplication, IDateRangePicker, IEmployeeJobPost, IJobMatchings, IOrganization, ISelectedEmployee, IVisibilityJobPostInput, JobPostSourceEnum, JobPostStatusEnum, JobPostTypeEnum, JobSearchTabsEnum, PermissionsEnum, IEmployeeProposalTemplate } from '@gauzy/contracts';
import { JobService } from '@gauzy/ui-core/core';
import { I18nService } from '@gauzy/ui-core/i18n';
import { PaginationFilterBaseComponent } from '@gauzy/ui-core/shared';
import * as i0 from "@angular/core";
export declare class JobSearchComponent extends PaginationFilterBaseComponent implements AfterViewInit, OnInit, OnDestroy {
    readonly translateService: TranslateService;
    private readonly _fb;
    private readonly _http;
    private readonly _activatedRoute;
    private readonly _router;
    private readonly _dialogService;
    private readonly _store;
    private readonly _proposalTemplateService;
    private readonly _toastrService;
    private readonly _jobService;
    private readonly _dateRangePickerBuilderService;
    private readonly _errorHandlingService;
    private readonly _ngxPermissionsService;
    private readonly _i18nService;
    /**
     * Stable permission array for `*ngxPermissionsOnly`.
     * 🛑 Never inline the literal in the binding: a new array on every change-detection
     * cycle makes ngx-permissions re-validate forever under default change detection,
     * which pins the main thread and the view never finishes rendering.
     */
    readonly permGateOrgJobSearch: string[];
    /**
     * Stable permission array for `*ngxPermissionsOnly`.
     * 🛑 Never inline the literal in the binding: a new array on every change-detection
     * cycle makes ngx-permissions re-validate forever under default change detection,
     * which pins the main thread and the view never finishes rendering.
     */
    readonly permGateAllOrgView: string[];
    /**
     * Stable permission array for `*ngxPermissionsOnly`.
     * 🛑 Never inline the literal in the binding: a new array on every change-detection
     * cycle makes ngx-permissions re-validate forever under default change detection,
     * which pins the main thread and the view never finishes rendering.
     */
    readonly permGateOrgJobApply: string[];
    /**
     * Stable permission array for `*ngxPermissionsOnly`.
     * 🛑 Never inline the literal in the binding: a new array on every change-detection
     * cycle makes ngx-permissions re-validate forever under default change detection,
     * which pins the main thread and the view never finishes rendering.
     */
    readonly permGateOrgJobEdit: string[];
    loading: boolean;
    isRefresh: boolean;
    autoRefresh: boolean;
    settingsSmartTable: any;
    isOpenAdvancedFilter: boolean;
    jobs: IEmployeeJobPost[];
    JobPostSourceEnum: typeof JobPostSourceEnum;
    JobPostTypeEnum: typeof JobPostTypeEnum;
    JobPostStatusEnum: typeof JobPostStatusEnum;
    PermissionsEnum: typeof PermissionsEnum;
    JobSearchTabsEnum: typeof JobSearchTabsEnum;
    jobs$: Subject<any>;
    smartTableSource: ServerDataSource;
    autoRefreshTimer: Subscription;
    disableButton: boolean;
    selectedJob: IEmployeeJobPost;
    nbTab$: Subject<string>;
    organization: IOrganization;
    selectedEmployee: ISelectedEmployee;
    selectedDateRange: IDateRangePicker;
    /** Typed as any to avoid TemplateRef type mismatch across plugin vs workspace @angular/core. */
    readonly actionButtons: any;
    /** Typed as any to avoid TemplateRef type mismatch across plugin vs workspace @angular/core. */
    readonly visibleButton: any;
    form: UntypedFormGroup;
    static buildForm(fb: UntypedFormBuilder): UntypedFormGroup;
    constructor(translateService: TranslateService, _fb: UntypedFormBuilder, _http: HttpClient, _activatedRoute: ActivatedRoute, _router: Router, _dialogService: NbDialogService, _store: Store, _proposalTemplateService: ProposalTemplateService, _toastrService: ToastrService, _jobService: JobService, _dateRangePickerBuilderService: DateRangePickerBuilderService, _errorHandlingService: ErrorHandlingService, _ngxPermissionsService: NgxPermissionsService, _i18nService: I18nService);
    ngOnInit(): void;
    ngAfterViewInit(): void;
    /**
     * Initialize UI permissions
     */
    private initializeUiPermissions;
    /**
     * Initialize UI languages and Update Locale
     */
    private initializeUiLanguagesAndLocale;
    /**
     * Retrieves the default proposal template for the specified employee and organization.
     * @param {IJobMatchings} job - The job matching object containing employeeId.
     * @returns {Promise<any>} A promise resolving to the default proposal template or null if not found.
     */
    getEmployeeDefaultProposalTemplate(job: IJobMatchings): Promise<IEmployeeProposalTemplate | null>;
    /**
     * Copies the given text to the clipboard.
     * @param {string} text - The text to be copied to the clipboard.
     * @returns {Promise<void>} A promise that resolves when the text is copied.
     */
    copyTextToClipboard(text: string): Promise<void | boolean>;
    /**
     * Sets the auto refresh behavior based on the provided value.
     * @param {boolean} value - If true, enables auto refresh; if false, disables it.
     */
    setAutoRefresh(value: boolean): void;
    /**
     * Handles custom events related to job actions such as viewing, applying, and hiding jobs.
     * @param $event The custom event containing action and data payload.
     */
    onCustomEvents($event: {
        action: string;
        data: any;
    }): Promise<void>;
    /**
     * On select job search Row
     *
     * @param param0
     */
    onSelectJob({ isSelected, data }: {
        isSelected: any;
        data: any;
    }): void;
    /**
     * Opens the job post URL in a new tab if a job is selected and has a valid URL.
     */
    viewJob(): void;
    /**
     * Updates job visibility by hiding the selected job post.
     * Displays success message on job hidden and refreshes the smart table source.
     */
    hideJob(): Promise<void>;
    /**
     * Updates job visibility by hiding the job post based on the provided input.
     *
     * @param input The input data containing employee ID, provider code, and provider job ID.
     */
    hideJobPost(input: IVisibilityJobPostInput): Promise<void>;
    /**
     * Marks the selected job as already applied on the provider site.
     * Updates job application status and refreshes the smart table source.
     */
    appliedJob(): Promise<void>;
    /**
     * Apply for a job post using the provided job application details.
     *
     * @param applyJobPost The job application details.
     */
    applyToJob(applyJobPost: IEmployeeJobApplication): Promise<void>;
    /**
     * Apply for a job automatically using the selected job details.
     */
    applyToJobAutomatically(): Promise<void>;
    /**
     * Apply for a job manually using a dialog component.
     */
    applyToJobManually(): Promise<void>;
    /**
     * Loads smart table settings.
     */
    private _loadSmartTableSettings;
    setSmartTableSource(): void;
    /**
     * Retrieves employee jobs based on various filters and sets the smart table data source.
     * @returns Promise<void>
     */
    private getEmployeeJobs;
    hideAll(): Promise<void>;
    private _applyTranslationOnSmartTable;
    /**
     * Handles tab change event.
     * Resets the form and updates the active tab ID.
     * @param tab The tab component that triggered the change.
     */
    onTabChange(tab: NbTabComponent): void;
    /**
     * Initiates a job search based on form validity.
     * Emits a signal to start fetching jobs if the form is valid.
     */
    searchJobs(): void;
    /**
     * Handles form submission on Enter key press.
     * Initiates a job search.
     */
    handleSubmitOnEnter(): void;
    /**
     * Resets the form, clears filters, and refreshes the job list.
     */
    reset(): void;
    /**
     * Initiates a refresh of job list with updated parameters.
     * Resets pagination, triggers job fetch, and scrolls to top of page.
     */
    refresh(): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<JobSearchComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<JobSearchComponent, "ga-job-search", never, {}, {}, never, never, false, never>;
}
