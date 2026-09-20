import { OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { IOrganization, JobPostSourceEnum, IJobPreset, IJobSearchCategory, IJobSearchOccupation, IMatchingCriterions, JobPostTypeEnum, ID } from '@gauzy/contracts';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import * as i0 from "@angular/core";
export declare class JobMatchingComponent extends TranslationBaseComponent implements OnInit {
    /**
     * Stable permission array for `*ngxPermissionsOnly`.
     * 🛑 Never inline the literal in the binding: a new array on every change-detection
     * cycle makes ngx-permissions re-validate forever under default change detection,
     * which pins the main thread and the view never finishes rendering.
     */
    readonly permGateOrgJobMatchingViewAllOrgView: string[];
    criterionForm: {
        jobSource: JobPostSourceEnum;
        jobPresetId: any;
    };
    private readonly _ngxPermissionsService;
    private readonly _store;
    private readonly _i18nService;
    private readonly _jobPresetService;
    private readonly _jobSearchOccupationService;
    private readonly _jobSearchCategoryService;
    private readonly _toastrService;
    private readonly _errorHandlingService;
    JobPostSourceEnum: typeof JobPostSourceEnum;
    JobPostTypeEnum: typeof JobPostTypeEnum;
    jobPresets: IJobPreset[];
    categories: IJobSearchCategory[];
    occupations: IJobSearchOccupation[];
    criterions: IMatchingCriterions[];
    hasAnyChanges: boolean;
    hasAddPreset$: Observable<boolean>;
    selectedEmployeeId: ID;
    organization: IOrganization;
    private payloads$;
    constructor();
    ngOnInit(): void;
    /**
     * Initialize UI permissions
     */
    private initializeUiPermissions;
    /**
     * Initialize UI languages and Update Locale
     */
    private initializeUiLanguagesAndLocale;
    /**
     * Prepare Unique Payloads
     *
     * @returns
     */
    preparePayloads(): void;
    /**
     * Get Job Presets
     *
     * @returns
     */
    getJobPresets(): Promise<void>;
    /**
     * Get Employee Criterions
     *
     * @returns
     */
    getEmployeeCriterions(): Promise<void>;
    /**
     * Add new preset from here
     *
     * @param name
     */
    addPreset: (name: string) => Promise<void>;
    onPresetSelected(jobPreset: IJobPreset): Promise<void>;
    /**
     * On Source Selected
     *
     * @returns
     */
    onSourceSelected(): void;
    /**
     * Update Employee Preset
     *
     * @returns
     */
    updateEmployeePreset(): Promise<void>;
    /**
     * Save Job Preset
     *
     * @returns
     */
    saveJobPreset(): Promise<void>;
    /**
     * Save Criterion
     *
     * @param criterion
     */
    saveCriterion(criterion?: IMatchingCriterions): Promise<void>;
    /**
     * Delete criterion
     *
     * @param index
     * @param criterion
     * @returns
     */
    deleteCriterions(index: number, criterion: IMatchingCriterions): Promise<void>;
    /**
     * Add new criterion
     *
     * @param criterion
     */
    addNewCriterion(criterion?: IMatchingCriterions): void;
    /**
     * Get Categories
     */
    getCategories(): Promise<void>;
    /**
     * Get Occupations
     */
    getOccupations(): Promise<void>;
    /**
     * Create new job search category
     *
     * @param name
     * @returns
     */
    createNewCategories: (name: IJobSearchCategory["name"]) => Promise<void>;
    /**
     * Create new job search occupation
     *
     * @param name
     * @returns
     */
    createNewOccupations: (name: IJobSearchOccupation["name"]) => Promise<void>;
    static ɵfac: i0.ɵɵFactoryDeclaration<JobMatchingComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<JobMatchingComponent, "ga-job-matching", never, {}, {}, never, never, false, never>;
}
