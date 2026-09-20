import { AfterViewInit, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, FormGroupDirective } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { NbDialogRef } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { FileUploader } from 'ng2-file-upload';
import { IEmployeeJobApplication, IEmployee, IEmployeeJobPost, IEmployeeProposalTemplate, IOrganization, ISelectedEmployee, JobPostSourceEnum } from '@gauzy/contracts';
import { ErrorHandlingService, JobService, Store } from '@gauzy/ui-core/core';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { EmployeeSelectorComponent, FormHelpers, RichTextEditorComponent } from '@gauzy/ui-core/shared';
import * as i0 from "@angular/core";
export declare class ApplyJobManuallyComponent extends TranslationBaseComponent implements AfterViewInit, OnInit, OnDestroy {
    readonly translateService: TranslateService;
    private readonly _fb;
    private readonly _sanitizer;
    private readonly _dialogRef;
    private readonly _store;
    private readonly _jobService;
    private readonly _errorHandlingService;
    JobPostSourceEnum: typeof JobPostSourceEnum;
    FormHelpers: typeof FormHelpers;
    organization: IOrganization;
    uploader: FileUploader;
    hasDropZoneOver: boolean;
    loading: boolean;
    proposal$: Subject<boolean>;
    proposalTemplate: IEmployeeProposalTemplate;
    /** Apply Job Manually Mutation Form */
    form: UntypedFormGroup;
    static buildForm(fb: UntypedFormBuilder): UntypedFormGroup;
    /**  Getter and setter for selected Employee */
    _selectedEmployee: ISelectedEmployee;
    get selectedEmployee(): ISelectedEmployee;
    set selectedEmployee(selectedEmployee: ISelectedEmployee);
    /**  Getter and setter for selected Job Post */
    _employeeJobPost: IEmployeeJobPost;
    get employeeJobPost(): IEmployeeJobPost;
    set employeeJobPost(value: IEmployeeJobPost);
    /** Form group directive */
    formDirective: FormGroupDirective;
    /** Cover-letter rich text editor component */
    proposalEditor: RichTextEditorComponent;
    /** Employee selector component */
    employeeSelector: EmployeeSelectorComponent;
    /**
     * Newly generate employee job application
     */
    application$: Subject<IEmployeeJobApplication>;
    private retryUntil$;
    constructor(translateService: TranslateService, _fb: UntypedFormBuilder, _sanitizer: DomSanitizer, _dialogRef: NbDialogRef<ApplyJobManuallyComponent>, _store: Store, _jobService: JobService, _errorHandlingService: ErrorHandlingService);
    ngOnInit(): void;
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    /**
     * Load settings for the file uploader, including headers and additional form data.
     *
     * @returns void
     */
    private _loadUploaderSettings;
    /**
     * File over base
     * @param e
     */
    fileOverBase(e: any): void;
    /**
     * Patch job provider details after load page
     */
    patchFormValue(): void;
    /**
     * On Proposal template change
     *
     * @param item
     */
    onProposalTemplateChange(item: IEmployeeProposalTemplate | null): void;
    /**
     * On submit job proposal details
     */
    onSubmit(): void;
    /** Set default employee for job apply */
    setDefaultEmployee(employee: ISelectedEmployee | IEmployee): void;
    /** Set default employee rates */
    setDefaultEmployeeRates(employee: ISelectedEmployee | IEmployee): void;
    /** Create employee job application record. */
    private callPreProcessEmployeeJobApplication;
    /**
     * Generate AI proposal for employee job application
     *
     * @param application
     */
    generateAIProposal(employeeJobApplication: IEmployeeJobApplication): Promise<void>;
    /**
     * Get AI generated proposal for employee job application
     * Every 3 seconds try to get proposal
     *
     * @param employeeJobApplicationId
     */
    getAIGeneratedProposal(employeeJobApplicationId: string): Promise<void>;
    /**
     * Get plain text from proposal
     *
     */
    getPlainText(): string;
    /**
     * On editor change — receives the current HTML content emitted by the rich text editor.
     */
    onEditorChange(content: string | object): void;
    /**
     * Close dialog
     */
    close(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ApplyJobManuallyComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ApplyJobManuallyComponent, "ga-apply-job-manually", never, { "selectedEmployee": { "alias": "selectedEmployee"; "required": false; }; "employeeJobPost": { "alias": "employeeJobPost"; "required": false; }; }, {}, never, never, false, never>;
}
