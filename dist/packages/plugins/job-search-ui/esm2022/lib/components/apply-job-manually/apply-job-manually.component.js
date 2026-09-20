var ApplyJobManuallyComponent_1;
import { __decorate, __metadata } from "tslib";
import { Component, Input, SecurityContext, ViewChild } from '@angular/core';
import { UntypedFormBuilder, FormGroupDirective, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Subject, combineLatest, switchMap, timer } from 'rxjs';
import { debounceTime, filter, tap } from 'rxjs/operators';
import { NbDialogRef } from '@nebular/theme';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TranslateService } from '@ngx-translate/core';
import { FileUploader } from 'ng2-file-upload';
import { JobPostSourceEnum } from '@gauzy/contracts';
import { environment } from '@gauzy/ui-config';
import { API_PREFIX, distinctUntilChange, isNotEmpty, sleep } from '@gauzy/ui-core/common';
import { ErrorHandlingService, JobService, Store } from '@gauzy/ui-core/core';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { EmployeeSelectorComponent, FormHelpers, RichTextEditorComponent } from '@gauzy/ui-core/shared';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
import * as i2 from "@angular/forms";
import * as i3 from "@angular/platform-browser";
import * as i4 from "@nebular/theme";
import * as i5 from "@gauzy/ui-core/core";
import * as i6 from "ng2-file-upload";
import * as i7 from "@gauzy/ui-core/shared";
import * as i8 from "../job-title-description-details/job-title-description-details.component";
let ApplyJobManuallyComponent = class ApplyJobManuallyComponent extends TranslationBaseComponent {
    static { ApplyJobManuallyComponent_1 = this; }
    static buildForm(fb) {
        return fb.group({
            proposal: [], // Cover Letter
            details: [], // Proposal details
            attachments: [],
            rate: [null, Validators.required], // Hourly Rate
            employeeId: [null, Validators.required]
        });
    }
    get selectedEmployee() {
        return this._selectedEmployee;
    }
    set selectedEmployee(selectedEmployee) {
        this._selectedEmployee = selectedEmployee;
    }
    get employeeJobPost() {
        return this._employeeJobPost;
    }
    set employeeJobPost(value) {
        this._employeeJobPost = value;
        this.patchFormValue();
    }
    constructor(translateService, _fb, _sanitizer, _dialogRef, _store, _jobService, _errorHandlingService) {
        super(translateService);
        this.translateService = translateService;
        this._fb = _fb;
        this._sanitizer = _sanitizer;
        this._dialogRef = _dialogRef;
        this._store = _store;
        this._jobService = _jobService;
        this._errorHandlingService = _errorHandlingService;
        this.JobPostSourceEnum = JobPostSourceEnum;
        this.FormHelpers = FormHelpers;
        this.hasDropZoneOver = false;
        this.loading = false;
        this.proposal$ = new Subject();
        /** Apply Job Manually Mutation Form */
        this.form = ApplyJobManuallyComponent_1.buildForm(this._fb);
        /**
         * Newly generate employee job application
         */
        this.application$ = new Subject();
    }
    ngOnInit() {
        const storeOrganization$ = this._store.selectedOrganization$;
        const storeEmployee$ = this._store.selectedEmployee$;
        combineLatest([storeOrganization$, storeEmployee$])
            .pipe(debounceTime(100), distinctUntilChange(), filter(([organization]) => !!organization), tap(([organization, employee]) => {
            this.organization = organization;
            this.selectedEmployee = employee && employee.id ? employee : null;
        }), tap(() => this.employeeSelector.selectEmployeeById(this.selectedEmployee?.id)), untilDestroyed(this))
            .subscribe();
        this._store.user$
            .pipe(filter((user) => !!user), tap(() => this._loadUploaderSettings()), untilDestroyed(this))
            .subscribe();
        this.proposal$
            .pipe(filter(() => !!this.form.get('employeeId').value), tap(() => this.callPreProcessEmployeeJobApplication()), untilDestroyed(this))
            .subscribe();
        this.application$
            .pipe(tap((application) => this.generateAIProposal(application)), untilDestroyed(this))
            .subscribe();
    }
    ngAfterViewInit() {
        this.uploader.onAfterAddingFile = (file) => {
            file.withCredentials = false;
        };
        this.uploader.onSuccessItem = (item, response, status) => {
            try {
                if (response) {
                    const image = JSON.parse(response);
                    if (image && image.id) {
                        this.form.get('attachments').setValue(image.fullUrl);
                        this.form.get('attachments').updateValueAndValidity();
                    }
                }
            }
            catch (error) {
                console.log('Error while uploaded project files', error);
            }
        };
        this.uploader.onErrorItem = (item, response, status) => {
            try {
                if (response) {
                    const error = JSON.parse(response);
                    console.log('Error while uploaded project files error', error);
                    this._errorHandlingService.handleError(error);
                }
            }
            catch (error) {
                console.log('Error while uploaded project files error', error);
            }
        };
    }
    ngOnDestroy() {
        if (this.retryUntil$) {
            this.retryUntil$.unsubscribe();
        }
    }
    /**
     * Load settings for the file uploader, including headers and additional form data.
     *
     * @returns void
     */
    _loadUploaderSettings() {
        if (!this._store.user) {
            return;
        }
        const token = this._store.token;
        const tenantId = this._store.user.tenantId;
        const headers = [];
        headers.push({ name: 'Authorization', value: `Bearer ${token}` });
        headers.push({ name: 'Tenant-Id', value: tenantId });
        if (!!this.organization) {
            const { id, tenantId } = this.organization;
            headers.push({ name: 'Organization-Id', value: `${id}` });
            headers.push({ name: 'Tenant-Id', value: `${tenantId}` });
        }
        const uploaderOptions = {
            url: environment.API_BASE_URL + `${API_PREFIX}/image-assets/upload/proposal_attachments`,
            method: 'POST', // XHR request method
            autoUpload: true, // Upload files automatically upon addition to upload queue
            isHTML5: true, // Use xhrTransport in favor of iframeTransport
            removeAfterUpload: true, // Calculate progress independently for each uploaded file
            headers: headers // XHR request headers
        };
        this.uploader = new FileUploader(uploaderOptions);
        // Adding additional form data
        this.uploader.onBuildItemForm = (fileItem, form) => {
            if (!!this._store.user.tenantId) {
                form.append('tenantId', tenantId);
            }
            if (!!this.organization) {
                const { id, tenantId } = this.organization;
                form.append('organizationId', id);
                form.append('tenantId', tenantId);
            }
        };
    }
    /**
     * File over base
     * @param e
     */
    fileOverBase(e) {
        this.hasDropZoneOver = e;
    }
    /**
     * Patch job provider details after load page
     */
    patchFormValue() {
        if (this.employeeJobPost) {
            const { providerCode, employee } = this.employeeJobPost;
            this.setDefaultEmployee(employee);
            const proposal = this.form.get('proposal');
            const details = this.form.get('details');
            /** Cover Letter required if job provider is Upwork */
            if (providerCode === JobPostSourceEnum.UPWORK) {
                proposal.setValidators([Validators.required]);
                details.setValidators(null);
            }
            else {
                proposal.setValidators(null);
                details.setValidators([Validators.required]);
            }
            this.form.updateValueAndValidity();
        }
    }
    /**
     * On Proposal template change
     *
     * @param item
     */
    onProposalTemplateChange(item) {
        /** Generate proposal using GauzyAI */
        this.proposalTemplate = item || null;
        /** Patch proposal value inside form directive */
        this.form.patchValue({
            proposal: this.proposalTemplate?.content || null,
            details: this.proposalTemplate?.content || null
        });
    }
    /**
     * On submit job proposal details
     */
    onSubmit() {
        if (this.form.invalid) {
            return;
        }
        const { employeeId, proposal, rate, details, attachments } = this.form.value;
        const { providerCode, providerJobId } = this.employeeJobPost;
        /** Apply job post input */
        const applyJobPost = {
            applied: true,
            employeeId,
            proposal,
            rate,
            details,
            attachments,
            providerCode,
            providerJobId
        };
        try {
            this._dialogRef.close(applyJobPost);
        }
        catch (error) {
            console.log('Error while applying job post', error);
            this._errorHandlingService.handleError(error);
        }
    }
    /** Set default employee for job apply */
    setDefaultEmployee(employee) {
        if (isNotEmpty(employee) && this.form.get('employeeId')) {
            this.form.get('employeeId').setValue(employee.id);
            this.form.get('employeeId').updateValueAndValidity();
            this.setDefaultEmployeeRates(employee);
        }
    }
    /** Set default employee rates */
    setDefaultEmployeeRates(employee) {
        if (employee) {
            this.form.get('rate').setValue(employee?.billRateValue);
            this.form.get('rate').updateValueAndValidity();
        }
    }
    /** Create employee job application record. */
    async callPreProcessEmployeeJobApplication() {
        /** Generate job application record for employee */
        const employeeId = this.form.get('employeeId').value;
        if (!employeeId) {
            return;
        }
        const rate = this.form.get('rate').value;
        const proposalTemplate = this.proposalTemplate?.content || null;
        const jobPost = this.employeeJobPost.jobPost;
        const { id: employeeJobPostId, isActive, isArchived } = this.employeeJobPost;
        try {
            /** Generate employee job application request parameters */
            const generateProposalRequest = {
                employeeId: employeeId,
                proposalTemplate: proposalTemplate,
                employeeJobPostId: employeeJobPostId,
                jobPostId: jobPost.id,
                jobPost: jobPost,
                providerCode: jobPost.providerCode,
                providerJobId: jobPost.providerJobId,
                isProposalGeneratedByAI: true,
                jobStatus: jobPost.jobStatus,
                jobType: jobPost.jobType,
                jobDateCreated: jobPost.jobDateCreated,
                rate: rate,
                isActive: isActive,
                isArchived: isArchived,
                attachments: '{}',
                qa: '{}',
                terms: '{}'
            };
            this.loading = true;
            // Send the employee job application
            const application = await this._jobService.preProcessEmployeeJobApplication(generateProposalRequest);
            // send the employee job application
            this.application$.next(application);
        }
        catch (error) {
            console.error('Error while creating employee job application', error);
        }
    }
    /**
     * Generate AI proposal for employee job application
     *
     * @param application
     */
    async generateAIProposal(employeeJobApplication) {
        try {
            const employeeJobApplicationId = employeeJobApplication.id;
            await this._jobService.generateAIProposal(employeeJobApplicationId);
            // Sleeps for 10 seconds before get proposal.
            const sleepDelay = 10000;
            await sleep(sleepDelay);
            // try to get AI generated proposal for specific employee job application
            await this.getAIGeneratedProposal(employeeJobApplicationId);
        }
        catch (error) {
            console.error('Error while initiate process for generate AI proposal by employee job application', error);
        }
    }
    /**
     * Get AI generated proposal for employee job application
     * Every 3 seconds try to get proposal
     *
     * @param employeeJobApplicationId
     */
    async getAIGeneratedProposal(employeeJobApplicationId) {
        if (this.retryUntil$) {
            this.retryUntil$.unsubscribe();
        }
        const retryDelay = 5000; // Delay between retries in milliseconds
        // sleep for every 3 seconds
        const source$ = timer(0, retryDelay);
        this.retryUntil$ = source$
            .pipe(filter(() => !!employeeJobApplicationId), switchMap(() => this._jobService.getEmployeeJobApplication(employeeJobApplicationId)), tap((application) => {
            const { isProposalGeneratedByAI } = application;
            // Stop making API calls as the desired parameter is found
            if (isProposalGeneratedByAI) {
                try {
                    /** If employee proposal generated successfully from Gauzy AI */
                    if (isNotEmpty(application)) {
                        // Replace line breaks with spaces
                        const proposal = application.proposal
                            .replace(/\n\n/g, '<br/><br>')
                            .replace(/\n/g, '<br/>');
                        // Set editor html content (syncs the bound form control through the CVA)
                        this.proposalEditor?.setContent(proposal);
                        /** Patch proposal value inside form directive */
                        this.form.patchValue({
                            details: proposal,
                            proposal: proposal
                        });
                    }
                    else {
                        this.form.patchValue({
                            proposal: this.proposalTemplate,
                            details: this.proposalTemplate
                        });
                    }
                }
                finally {
                    this.loading = false;
                    this.retryUntil$.unsubscribe();
                }
            }
        }), untilDestroyed(this))
            .subscribe();
    }
    /**
     * Get plain text from proposal
     *
     */
    getPlainText() {
        const content = this.proposalEditor?.getHTML() ?? '';
        /**
         * Create temporary div element
         */
        const element = document.createElement('div');
        element.innerHTML = this._sanitizer.sanitize(SecurityContext.HTML, // Set bypassSecurityTrustHtml to allow the HTML content
        content);
        const plainText = element.textContent || element.innerText || '';
        return plainText.trim();
    }
    /**
     * On editor change — receives the current HTML content emitted by the rich text editor.
     */
    onEditorChange(content) { }
    /**
     * Close dialog
     */
    close() {
        this._dialogRef.close(false);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ApplyJobManuallyComponent, deps: [{ token: i1.TranslateService }, { token: i2.UntypedFormBuilder }, { token: i3.DomSanitizer }, { token: i4.NbDialogRef }, { token: i5.Store }, { token: i5.JobService }, { token: i5.ErrorHandlingService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: ApplyJobManuallyComponent, isStandalone: false, selector: "ga-apply-job-manually", inputs: { selectedEmployee: "selectedEmployee", employeeJobPost: "employeeJobPost" }, providers: [], viewQueries: [{ propertyName: "formDirective", first: true, predicate: ["formDirective"], descendants: true }, { propertyName: "proposalEditor", first: true, predicate: ["proposalEditor"], descendants: true }, { propertyName: "employeeSelector", first: true, predicate: ["employeeSelector"], descendants: true }], usesInheritance: true, ngImport: i0, template: "<div class=\"main\">\n\t<nb-card>\n\t\t<nb-card-header class=\"d-flex flex-column\">\n\t\t\t<span class=\"cancel\">\n\t\t\t\t<i class=\"fas fa-times\" (click)=\"close()\"></i>\n\t\t\t</span>\n\t\t\t<h5 class=\"title\">\n\t\t\t\t{{ 'JOBS.APPLY_JOB_TITLE' | translate }}\n\t\t\t</h5>\n\t\t</nb-card-header>\n\t\t<nb-card-body class=\"body\">\n\t\t\t<div class=\"row\">\n\t\t\t\t<div class=\"col-5\">\n\t\t\t\t\t<nb-card>\n\t\t\t\t\t\t<nb-card-header>\n\t\t\t\t\t\t\t{{ 'JOBS.JOB_DETAILS' | translate }}\n\t\t\t\t\t\t</nb-card-header>\n\t\t\t\t\t\t<nb-card-body class=\"p-3\">\n\t\t\t\t\t\t\t<job-title-description-details\n\t\t\t\t\t\t\t\t[rowData]=\"employeeJobPost\"\n\t\t\t\t\t\t\t\t[hideJobIcon]=\"false\"\n\t\t\t\t\t\t\t></job-title-description-details>\n\t\t\t\t\t\t</nb-card-body>\n\t\t\t\t\t</nb-card>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"col-7\">\n\t\t\t\t\t<nb-card>\n\t\t\t\t\t\t<nb-card-header>\n\t\t\t\t\t\t\t{{ 'PROPOSALS_PAGE.PROPOSAL_DETAILS.PROPOSAL_DETAILS' | translate }}\n\t\t\t\t\t\t</nb-card-header>\n\t\t\t\t\t\t<nb-card-body>\n\t\t\t\t\t\t\t<form #formDirective=\"ngForm\" [formGroup]=\"form\" (ngSubmit)=\"onSubmit()\">\n\t\t\t\t\t\t\t\t<div class=\"row\">\n\t\t\t\t\t\t\t\t\t<div class=\"col-xl-3 col-lg-7\">\n\t\t\t\t\t\t\t\t\t\t<div class=\"form-group m-0\">\n\t\t\t\t\t\t\t\t\t\t\t<label class=\"label\" for=\"job_employee\">\n\t\t\t\t\t\t\t\t\t\t\t\t{{ 'HEADER.SELECT_EMPLOYEE' | translate }}\n\t\t\t\t\t\t\t\t\t\t\t</label>\n\t\t\t\t\t\t\t\t\t\t\t<ga-employee-selector\n\t\t\t\t\t\t\t\t\t\t\t\t#employeeSelector\n\t\t\t\t\t\t\t\t\t\t\t\t[placeholder]=\"'HEADER.SELECT_EMPLOYEE' | translate\"\n\t\t\t\t\t\t\t\t\t\t\t\t[clearable]=\"false\"\n\t\t\t\t\t\t\t\t\t\t\t\t[addTag]=\"false\"\n\t\t\t\t\t\t\t\t\t\t\t\t[defaultSelected]=\"false\"\n\t\t\t\t\t\t\t\t\t\t\t\t[showAllEmployeesOption]=\"false\"\n\t\t\t\t\t\t\t\t\t\t\t\t[skipGlobalChange]=\"true\"\n\t\t\t\t\t\t\t\t\t\t\t\t(selectionChanged)=\"setDefaultEmployee($event)\"\n\t\t\t\t\t\t\t\t\t\t\t\t[selectedEmployee]=\"selectedEmployee\"\n\t\t\t\t\t\t\t\t\t\t\t></ga-employee-selector>\n\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t<div class=\"col-xl-2 col-lg-5\">\n\t\t\t\t\t\t\t\t\t\t<div class=\"form-group m-0\">\n\t\t\t\t\t\t\t\t\t\t\t<label class=\"label\" for=\"hourly_rate\">\n\t\t\t\t\t\t\t\t\t\t\t\t{{ 'FORM.LABELS.HOURLY_RATE' | translate }}\n\t\t\t\t\t\t\t\t\t\t\t</label>\n\t\t\t\t\t\t\t\t\t\t\t<nb-form-field>\n\t\t\t\t\t\t\t\t\t\t\t\t<button type=\"button\" nbPrefix nbButton ghost>$</button>\n\t\t\t\t\t\t\t\t\t\t\t\t<input\n\t\t\t\t\t\t\t\t\t\t\t\t\tid=\"hourly_rate\"\n\t\t\t\t\t\t\t\t\t\t\t\t\tmin=\"1\"\n\t\t\t\t\t\t\t\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t\t\t\t\t\t\t\tnbInput\n\t\t\t\t\t\t\t\t\t\t\t\t\ttype=\"number\"\n\t\t\t\t\t\t\t\t\t\t\t\t\tclass=\"form-control\"\n\t\t\t\t\t\t\t\t\t\t\t\t\tformControlName=\"rate\"\n\t\t\t\t\t\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t\t\t\t\t\t</nb-form-field>\n\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t@if (form.get('employeeId').value) {\n\t\t\t\t\t\t\t\t\t<div class=\"col-xl-7 col-lg-12\">\n\t\t\t\t\t\t\t\t\t\t<div class=\"row\">\n\t\t\t\t\t\t\t\t\t\t\t<div class=\"col-7\">\n\t\t\t\t\t\t\t\t\t\t\t\t<label class=\"label\" for=\"proposal_template\">\n\t\t\t\t\t\t\t\t\t\t\t\t\t{{ 'PROPOSALS_PAGE.REGISTER.TEMPLATE' | translate }}\n\t\t\t\t\t\t\t\t\t\t\t\t</label>\n\t\t\t\t\t\t\t\t\t\t\t\t<ngx-proposal-template-select\n\t\t\t\t\t\t\t\t\t\t\t\t\tid=\"proposal_template\"\n\t\t\t\t\t\t\t\t\t\t\t\t\t[employeeId]=\"form.get('employeeId').value\"\n\t\t\t\t\t\t\t\t\t\t\t\t\t(selectedChange)=\"onProposalTemplateChange($event)\"\n\t\t\t\t\t\t\t\t\t\t\t\t></ngx-proposal-template-select>\n\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t\t<div class=\"col-5 h-100 align-self-end\">\n\t\t\t\t\t\t\t\t\t\t\t\t<button\n\t\t\t\t\t\t\t\t\t\t\t\t\tstatus=\"primary\"\n\t\t\t\t\t\t\t\t\t\t\t\t\tclass=\"button-generate-proposal\"\n\t\t\t\t\t\t\t\t\t\t\t\t\toutline\n\t\t\t\t\t\t\t\t\t\t\t\t\tnbButton\n\t\t\t\t\t\t\t\t\t\t\t\t\tdebounceClick\n\t\t\t\t\t\t\t\t\t\t\t\t\t(throttledClick)=\"proposal$.next(true)\"\n\t\t\t\t\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t\t\t\t\t{{ 'BUTTONS.GENERATE_PROPOSAL' | translate }}\n\t\t\t\t\t\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t@if (JobPostSourceEnum.UPWORK === employeeJobPost?.jobPost?.providerCode) {\n\t\t\t\t\t\t\t\t<div class=\"row\">\n\t\t\t\t\t\t\t\t\t<div class=\"col-12\">\n\t\t\t\t\t\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t\t\t\t\t\t<label class=\"label\" for=\"proposal\">\n\t\t\t\t\t\t\t\t\t\t\t\t{{ 'FORM.LABELS.COVER_LETTER' | translate }}\n\t\t\t\t\t\t\t\t\t\t\t</label>\n\t\t\t\t\t\t\t\t\t\t\t<div class=\"sync-container\">\n\t\t\t\t\t\t\t\t\t\t\t\t<nb-icon\n\t\t\t\t\t\t\t\t\t\t\t\t\tclass=\"sync caption-2\"\n\t\t\t\t\t\t\t\t\t\t\t\t\ticon=\"sync-outline\"\n\t\t\t\t\t\t\t\t\t\t\t\t\tdebounceClick\n\t\t\t\t\t\t\t\t\t\t\t\t\t(throttledClick)=\"proposal$.next(true)\"\n\t\t\t\t\t\t\t\t\t\t\t\t\t[class.spin]=\"loading\"\n\t\t\t\t\t\t\t\t\t\t\t\t></nb-icon>\n\t\t\t\t\t\t\t\t\t\t\t\t@if (loading) {\n\t\t\t\t\t\t\t\t\t\t\t\t<span class=\"ml-1 caption-2\">Generating Proposal ...</span>\n\t\t\t\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t\t<ga-rich-text-editor\n\t\t\t\t\t\t\t\t\t\t\t\t#proposalEditor\n\t\t\t\t\t\t\t\t\t\t\t\tid=\"proposal\"\n\t\t\t\t\t\t\t\t\t\t\t\tformControlName=\"proposal\"\n\t\t\t\t\t\t\t\t\t\t\t\tpreset=\"standard\"\n\t\t\t\t\t\t\t\t\t\t\t\toutputFormat=\"html\"\n\t\t\t\t\t\t\t\t\t\t\t\tminHeight=\"191px\"\n\t\t\t\t\t\t\t\t\t\t\t\t(changed)=\"onEditorChange($event)\"\n\t\t\t\t\t\t\t\t\t\t\t></ga-rich-text-editor>\n\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t} @if (JobPostSourceEnum.UPWORK !== employeeJobPost?.jobPost?.providerCode) {\n\t\t\t\t\t\t\t\t<div class=\"row\">\n\t\t\t\t\t\t\t\t\t<div class=\"col-12\">\n\t\t\t\t\t\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t\t\t\t\t\t<div class=\"sync-container\">\n\t\t\t\t\t\t\t\t\t\t\t\t<label class=\"label m-0\" for=\"details\">\n\t\t\t\t\t\t\t\t\t\t\t\t\t{{ 'FORM.LABELS.DETAILS' | translate }}\n\t\t\t\t\t\t\t\t\t\t\t\t</label>\n\t\t\t\t\t\t\t\t\t\t\t\t<nb-icon\n\t\t\t\t\t\t\t\t\t\t\t\t\tclass=\"sync\"\n\t\t\t\t\t\t\t\t\t\t\t\t\ticon=\"sync-outline\"\n\t\t\t\t\t\t\t\t\t\t\t\t\tdebounceClick\n\t\t\t\t\t\t\t\t\t\t\t\t\t(throttledClick)=\"proposal$.next(true)\"\n\t\t\t\t\t\t\t\t\t\t\t\t\t[class.spin]=\"loading\"\n\t\t\t\t\t\t\t\t\t\t\t\t></nb-icon>\n\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t\t<ga-rich-text-editor\n\t\t\t\t\t\t\t\t\t\t\t\tid=\"details\"\n\t\t\t\t\t\t\t\t\t\t\t\tformControlName=\"details\"\n\t\t\t\t\t\t\t\t\t\t\t\tpreset=\"standard\"\n\t\t\t\t\t\t\t\t\t\t\t\toutputFormat=\"html\"\n\t\t\t\t\t\t\t\t\t\t\t\tminHeight=\"191px\"\n\t\t\t\t\t\t\t\t\t\t\t></ga-rich-text-editor>\n\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t<div class=\"row drag-drop\">\n\t\t\t\t\t\t\t\t\t<div class=\"col-12\">\n\t\t\t\t\t\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t\t\t\t\t\t<label class=\"label\" for=\"attachments\">\n\t\t\t\t\t\t\t\t\t\t\t\t{{ 'FORM.LABELS.ATTACHMENTS' | translate }}\n\t\t\t\t\t\t\t\t\t\t\t</label>\n\t\t\t\t\t\t\t\t\t\t\t<div\n\t\t\t\t\t\t\t\t\t\t\t\tng2FileDrop\n\t\t\t\t\t\t\t\t\t\t\t\t[uploader]=\"uploader\"\n\t\t\t\t\t\t\t\t\t\t\t\t(fileOver)=\"fileOverBase($event)\"\n\t\t\t\t\t\t\t\t\t\t\t\t[class.nv-file-over]=\"hasDropZoneOver\"\n\t\t\t\t\t\t\t\t\t\t\t\tclass=\"well my-drop-zone\"\n\t\t\t\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t\t\t\t{{ 'FORM.PLACEHOLDERS.DRAG_DROP_FILE' | translate }}\n\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</form>\n\t\t\t\t\t\t</nb-card-body>\n\t\t\t\t\t</nb-card>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</nb-card-body>\n\t\t<nb-card-footer class=\"text-right\">\n\t\t\t<button status=\"basic\" outline class=\"mr-3\" nbButton (click)=\"close()\">\n\t\t\t\t{{ 'BUTTONS.CANCEL' | translate }}\n\t\t\t</button>\n\t\t\t<button [disabled]=\"form.invalid\" status=\"success\" nbButton (click)=\"formDirective.ngSubmit.emit()\">\n\t\t\t\t{{ 'BUTTONS.APPLY' | translate }}\n\t\t\t</button>\n\t\t</nb-card-footer>\n\t</nb-card>\n</div>\n", styles: ["@charset \"UTF-8\";:host i{cursor:pointer}:host .cancel{width:100%;display:flex}[dir=ltr] :host .cancel{justify-content:flex-end}[dir=rtl] :host .cancel{justify-content:flex-start}:host .cancel i{font-size:11px;color:var(--gauzy-text-color-1)}:host [nbButton].appearance-outline.status-basic{background-color:transparent;border-color:#f56d584d;border-width:2px;color:#f56d58}:host [nbButton].appearance-outline.status-basic:hover{border-color:#f56d58}:host [nbButton].appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #f56d580d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host .title{color:var(--text-primary-color);font-size:16px;font-weight:600;line-height:16px;letter-spacing:0em}:host [nbButton].gray.appearance-outline.status-basic{background-color:transparent;border-color:#7e7e8f4d;border-width:2px;color:#7e7e8f}:host [nbButton].gray.appearance-outline.status-basic:hover{border-color:#7e7e8f}:host [nbButton].gray.appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #7e7e8f0d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].gray.appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host [nbButton].green.appearance-outline.status-basic{background-color:transparent;border-color:#25b8694d;border-width:2px;color:#25b869}:host [nbButton].green.appearance-outline.status-basic:hover{border-color:#25b869}:host [nbButton].green.appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #25b8690d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].green.appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host [nbButton].green.appearance-outline.status-basic[disabled],:host [nbButton].green.appearance-outline.status-basic.btn-disabled{background-color:var(--button-outline-basic-disabled-background-color);border-color:var(--button-outline-basic-disabled-border-color);color:var(--button-outline-basic-disabled-text-color);box-shadow:unset}:host [nbButton].primary.appearance-filled.status-primary{color:var(--text-primary-color);border:unset;background-color:var(--color-primary-transparent-default);box-shadow:var(--gauzy-shadow)}[dir=ltr] :host ::ng-deep input,[dir=ltr] :host ::ng-deep textarea{text-align:start}[dir=rtl] :host ::ng-deep input,[dir=rtl] :host ::ng-deep textarea{text-align:end}:host ::ng-deep input,:host ::ng-deep nb-select.appearance-outline.status-basic .select-button,:host ::ng-deep .ng-select .ng-select-container{background-color:var(--gauzy-sidebar-background-4)!important;border:none;min-height:calc(var(--select-medium-text-line-height) + .4375rem * 2)!important}:host ::ng-deep .ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-placeholder,:host ::ng-deep .ng-select.ng-select-single .ng-select-container .ng-value-container .ng-input{top:unset!important}:host ::ng-deep label,:host ::ng-deep .label{font-size:var(--text-label-font-size);font-weight:600;line-height:.8125rem;letter-spacing:-.01em;color:var(--gauzy-text-color-2)}:host ::ng-deep textarea{background-color:var(--gauzy-sidebar-background-4)!important;border:none}:host ::ng-deep .ng-select .ng-select-container input,:host ::ng-deep nb-tag-list input{background-color:unset!important}:host .main{display:flex;justify-content:center}:host .main>nb-card{height:100vh;width:95%}:host nb-card{background-color:var(--gauzy-card-1)}:host nb-card nb-card-body{background-color:var(--gauzy-card-2)}:host nb-card nb-card-body nb-card,:host nb-card nb-card-body nb-card-body{background-color:var(--gauzy-card-1);border-radius:var(--border-radius)}[dir=rtl] :host ::ng-deep .cancel{justify-content:flex-start}[dir=rtl] :host ::ng-deep .title{text-align:right}:host ::ng-deep job-title-description-details div.job-detail{display:flex;flex-direction:column}:host ::ng-deep job-title-description-details div.job-detail .job-body{overflow:auto;max-height:calc(100vh - 30.75rem)}:host .well{height:50px;display:flex;align-items:center;justify-content:center;color:var(--gauzy-text-color-2)}:host .my-drop-zone{border:dashed 3px var(--gauzy-border-default-color);border-radius:var(--border-radius)}:host .nv-file-over{border:dashed 3px red;border-radius:var(--border-radius)}:host .sync-container{display:flex;align-items:center;justify-content:flex-end;gap:4px;margin-bottom:4px}:host .sync-container .sync{color:var(--gauzy-text-color-2);cursor:pointer}:host .sync-container .sync.spin{color:var(--text-primary-color);animation:rotate 1s linear 0s infinite}@keyframes rotate{0%{transform:rotate(0)}to{transform:rotate(360deg)}}:host .sync-container span{color:var(--text-primary-color)}:host .button-generate-proposal{width:100%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:block;margin-bottom:5.5px}:host form{height:calc(100vh - 22.5rem);display:flex;flex-direction:column}:host form .drag-drop{margin-top:auto}:host ::ng-deep ga-rich-text-editor .rich-text-editor__content{height:calc(100vh - 40.5rem)!important;overflow-y:auto}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "component", type: i4.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "component", type: i4.NbCardComponent, selector: "nb-card", inputs: ["size", "status", "accent"] }, { kind: "component", type: i4.NbCardBodyComponent, selector: "nb-card-body" }, { kind: "component", type: i4.NbCardFooterComponent, selector: "nb-card-footer" }, { kind: "component", type: i4.NbCardHeaderComponent, selector: "nb-card-header" }, { kind: "component", type: i4.NbFormFieldComponent, selector: "nb-form-field" }, { kind: "directive", type: i4.NbPrefixDirective, selector: "[nbPrefix]" }, { kind: "component", type: i4.NbIconComponent, selector: "nb-icon", inputs: ["icon", "pack", "options", "status", "config"] }, { kind: "directive", type: i4.NbInputDirective, selector: "input[nbInput],textarea[nbInput]", inputs: ["fieldSize", "status", "shape", "fullWidth"] }, { kind: "directive", type: i6.FileDropDirective, selector: "[ng2FileDrop]", inputs: ["uploader"], outputs: ["fileOver", "onFileDrop"] }, { kind: "component", type: i7.ProposalTemplateSelectComponent, selector: "ngx-proposal-template-select", inputs: ["disabled", "multiple", "employeeId"], outputs: ["selectedChange"] }, { kind: "component", type: i7.RichTextEditorComponent, selector: "ga-rich-text-editor", inputs: ["preset", "placeholder", "outputFormat", "minHeight", "maxHeight", "characterLimit", "showCharacterCount", "editorClass", "disabled"], outputs: ["created", "changed", "focused", "blurred"] }, { kind: "component", type: i7.EmployeeSelectorComponent, selector: "ga-employee-selector", inputs: ["clearable", "addTag", "skipGlobalChange", "disabled", "placeholder", "defaultSelected", "showAllEmployeesOption", "dropdownClass", "selectedDateRange", "selectedEmployee"], outputs: ["selectionChanged"] }, { kind: "directive", type: i2.ɵNgNoValidate, selector: "form:not([ngNoForm]):not([ngNativeValidate])" }, { kind: "directive", type: i2.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i2.NumberValueAccessor, selector: "input[type=number][formControlName],input[type=number][formControl],input[type=number][ngModel]" }, { kind: "directive", type: i2.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i2.NgControlStatusGroup, selector: "[formGroupName],[formArrayName],[ngModelGroup],[formGroup],[formArray],form:not([ngNoForm]),[ngForm]" }, { kind: "directive", type: i2.MinValidator, selector: "input[type=number][min][formControlName],input[type=number][min][formControl],input[type=number][min][ngModel]", inputs: ["min"] }, { kind: "directive", type: i2.FormGroupDirective, selector: "[formGroup]", inputs: ["formGroup"], outputs: ["ngSubmit"], exportAs: ["ngForm"] }, { kind: "directive", type: i2.FormControlName, selector: "[formControlName]", inputs: ["formControlName", "disabled", "ngModel"], outputs: ["ngModelChange"] }, { kind: "directive", type: i7.DebounceClickDirective, selector: "[debounceClick]", inputs: ["debounceTime"], outputs: ["throttledClick"] }, { kind: "component", type: i8.JobTitleDescriptionDetailsComponent, selector: "job-title-description-details", inputs: ["rowData", "hideJobIcon"], outputs: ["hideJobEvent"] }, { kind: "pipe", type: i1.TranslatePipe, name: "translate" }] }); }
};
ApplyJobManuallyComponent = ApplyJobManuallyComponent_1 = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [TranslateService,
        UntypedFormBuilder,
        DomSanitizer,
        NbDialogRef,
        Store,
        JobService,
        ErrorHandlingService])
], ApplyJobManuallyComponent);
export { ApplyJobManuallyComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ApplyJobManuallyComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-apply-job-manually', providers: [], standalone: false, template: "<div class=\"main\">\n\t<nb-card>\n\t\t<nb-card-header class=\"d-flex flex-column\">\n\t\t\t<span class=\"cancel\">\n\t\t\t\t<i class=\"fas fa-times\" (click)=\"close()\"></i>\n\t\t\t</span>\n\t\t\t<h5 class=\"title\">\n\t\t\t\t{{ 'JOBS.APPLY_JOB_TITLE' | translate }}\n\t\t\t</h5>\n\t\t</nb-card-header>\n\t\t<nb-card-body class=\"body\">\n\t\t\t<div class=\"row\">\n\t\t\t\t<div class=\"col-5\">\n\t\t\t\t\t<nb-card>\n\t\t\t\t\t\t<nb-card-header>\n\t\t\t\t\t\t\t{{ 'JOBS.JOB_DETAILS' | translate }}\n\t\t\t\t\t\t</nb-card-header>\n\t\t\t\t\t\t<nb-card-body class=\"p-3\">\n\t\t\t\t\t\t\t<job-title-description-details\n\t\t\t\t\t\t\t\t[rowData]=\"employeeJobPost\"\n\t\t\t\t\t\t\t\t[hideJobIcon]=\"false\"\n\t\t\t\t\t\t\t></job-title-description-details>\n\t\t\t\t\t\t</nb-card-body>\n\t\t\t\t\t</nb-card>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"col-7\">\n\t\t\t\t\t<nb-card>\n\t\t\t\t\t\t<nb-card-header>\n\t\t\t\t\t\t\t{{ 'PROPOSALS_PAGE.PROPOSAL_DETAILS.PROPOSAL_DETAILS' | translate }}\n\t\t\t\t\t\t</nb-card-header>\n\t\t\t\t\t\t<nb-card-body>\n\t\t\t\t\t\t\t<form #formDirective=\"ngForm\" [formGroup]=\"form\" (ngSubmit)=\"onSubmit()\">\n\t\t\t\t\t\t\t\t<div class=\"row\">\n\t\t\t\t\t\t\t\t\t<div class=\"col-xl-3 col-lg-7\">\n\t\t\t\t\t\t\t\t\t\t<div class=\"form-group m-0\">\n\t\t\t\t\t\t\t\t\t\t\t<label class=\"label\" for=\"job_employee\">\n\t\t\t\t\t\t\t\t\t\t\t\t{{ 'HEADER.SELECT_EMPLOYEE' | translate }}\n\t\t\t\t\t\t\t\t\t\t\t</label>\n\t\t\t\t\t\t\t\t\t\t\t<ga-employee-selector\n\t\t\t\t\t\t\t\t\t\t\t\t#employeeSelector\n\t\t\t\t\t\t\t\t\t\t\t\t[placeholder]=\"'HEADER.SELECT_EMPLOYEE' | translate\"\n\t\t\t\t\t\t\t\t\t\t\t\t[clearable]=\"false\"\n\t\t\t\t\t\t\t\t\t\t\t\t[addTag]=\"false\"\n\t\t\t\t\t\t\t\t\t\t\t\t[defaultSelected]=\"false\"\n\t\t\t\t\t\t\t\t\t\t\t\t[showAllEmployeesOption]=\"false\"\n\t\t\t\t\t\t\t\t\t\t\t\t[skipGlobalChange]=\"true\"\n\t\t\t\t\t\t\t\t\t\t\t\t(selectionChanged)=\"setDefaultEmployee($event)\"\n\t\t\t\t\t\t\t\t\t\t\t\t[selectedEmployee]=\"selectedEmployee\"\n\t\t\t\t\t\t\t\t\t\t\t></ga-employee-selector>\n\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t<div class=\"col-xl-2 col-lg-5\">\n\t\t\t\t\t\t\t\t\t\t<div class=\"form-group m-0\">\n\t\t\t\t\t\t\t\t\t\t\t<label class=\"label\" for=\"hourly_rate\">\n\t\t\t\t\t\t\t\t\t\t\t\t{{ 'FORM.LABELS.HOURLY_RATE' | translate }}\n\t\t\t\t\t\t\t\t\t\t\t</label>\n\t\t\t\t\t\t\t\t\t\t\t<nb-form-field>\n\t\t\t\t\t\t\t\t\t\t\t\t<button type=\"button\" nbPrefix nbButton ghost>$</button>\n\t\t\t\t\t\t\t\t\t\t\t\t<input\n\t\t\t\t\t\t\t\t\t\t\t\t\tid=\"hourly_rate\"\n\t\t\t\t\t\t\t\t\t\t\t\t\tmin=\"1\"\n\t\t\t\t\t\t\t\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t\t\t\t\t\t\t\tnbInput\n\t\t\t\t\t\t\t\t\t\t\t\t\ttype=\"number\"\n\t\t\t\t\t\t\t\t\t\t\t\t\tclass=\"form-control\"\n\t\t\t\t\t\t\t\t\t\t\t\t\tformControlName=\"rate\"\n\t\t\t\t\t\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t\t\t\t\t\t</nb-form-field>\n\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t@if (form.get('employeeId').value) {\n\t\t\t\t\t\t\t\t\t<div class=\"col-xl-7 col-lg-12\">\n\t\t\t\t\t\t\t\t\t\t<div class=\"row\">\n\t\t\t\t\t\t\t\t\t\t\t<div class=\"col-7\">\n\t\t\t\t\t\t\t\t\t\t\t\t<label class=\"label\" for=\"proposal_template\">\n\t\t\t\t\t\t\t\t\t\t\t\t\t{{ 'PROPOSALS_PAGE.REGISTER.TEMPLATE' | translate }}\n\t\t\t\t\t\t\t\t\t\t\t\t</label>\n\t\t\t\t\t\t\t\t\t\t\t\t<ngx-proposal-template-select\n\t\t\t\t\t\t\t\t\t\t\t\t\tid=\"proposal_template\"\n\t\t\t\t\t\t\t\t\t\t\t\t\t[employeeId]=\"form.get('employeeId').value\"\n\t\t\t\t\t\t\t\t\t\t\t\t\t(selectedChange)=\"onProposalTemplateChange($event)\"\n\t\t\t\t\t\t\t\t\t\t\t\t></ngx-proposal-template-select>\n\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t\t<div class=\"col-5 h-100 align-self-end\">\n\t\t\t\t\t\t\t\t\t\t\t\t<button\n\t\t\t\t\t\t\t\t\t\t\t\t\tstatus=\"primary\"\n\t\t\t\t\t\t\t\t\t\t\t\t\tclass=\"button-generate-proposal\"\n\t\t\t\t\t\t\t\t\t\t\t\t\toutline\n\t\t\t\t\t\t\t\t\t\t\t\t\tnbButton\n\t\t\t\t\t\t\t\t\t\t\t\t\tdebounceClick\n\t\t\t\t\t\t\t\t\t\t\t\t\t(throttledClick)=\"proposal$.next(true)\"\n\t\t\t\t\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t\t\t\t\t{{ 'BUTTONS.GENERATE_PROPOSAL' | translate }}\n\t\t\t\t\t\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t@if (JobPostSourceEnum.UPWORK === employeeJobPost?.jobPost?.providerCode) {\n\t\t\t\t\t\t\t\t<div class=\"row\">\n\t\t\t\t\t\t\t\t\t<div class=\"col-12\">\n\t\t\t\t\t\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t\t\t\t\t\t<label class=\"label\" for=\"proposal\">\n\t\t\t\t\t\t\t\t\t\t\t\t{{ 'FORM.LABELS.COVER_LETTER' | translate }}\n\t\t\t\t\t\t\t\t\t\t\t</label>\n\t\t\t\t\t\t\t\t\t\t\t<div class=\"sync-container\">\n\t\t\t\t\t\t\t\t\t\t\t\t<nb-icon\n\t\t\t\t\t\t\t\t\t\t\t\t\tclass=\"sync caption-2\"\n\t\t\t\t\t\t\t\t\t\t\t\t\ticon=\"sync-outline\"\n\t\t\t\t\t\t\t\t\t\t\t\t\tdebounceClick\n\t\t\t\t\t\t\t\t\t\t\t\t\t(throttledClick)=\"proposal$.next(true)\"\n\t\t\t\t\t\t\t\t\t\t\t\t\t[class.spin]=\"loading\"\n\t\t\t\t\t\t\t\t\t\t\t\t></nb-icon>\n\t\t\t\t\t\t\t\t\t\t\t\t@if (loading) {\n\t\t\t\t\t\t\t\t\t\t\t\t<span class=\"ml-1 caption-2\">Generating Proposal ...</span>\n\t\t\t\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t\t<ga-rich-text-editor\n\t\t\t\t\t\t\t\t\t\t\t\t#proposalEditor\n\t\t\t\t\t\t\t\t\t\t\t\tid=\"proposal\"\n\t\t\t\t\t\t\t\t\t\t\t\tformControlName=\"proposal\"\n\t\t\t\t\t\t\t\t\t\t\t\tpreset=\"standard\"\n\t\t\t\t\t\t\t\t\t\t\t\toutputFormat=\"html\"\n\t\t\t\t\t\t\t\t\t\t\t\tminHeight=\"191px\"\n\t\t\t\t\t\t\t\t\t\t\t\t(changed)=\"onEditorChange($event)\"\n\t\t\t\t\t\t\t\t\t\t\t></ga-rich-text-editor>\n\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t} @if (JobPostSourceEnum.UPWORK !== employeeJobPost?.jobPost?.providerCode) {\n\t\t\t\t\t\t\t\t<div class=\"row\">\n\t\t\t\t\t\t\t\t\t<div class=\"col-12\">\n\t\t\t\t\t\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t\t\t\t\t\t<div class=\"sync-container\">\n\t\t\t\t\t\t\t\t\t\t\t\t<label class=\"label m-0\" for=\"details\">\n\t\t\t\t\t\t\t\t\t\t\t\t\t{{ 'FORM.LABELS.DETAILS' | translate }}\n\t\t\t\t\t\t\t\t\t\t\t\t</label>\n\t\t\t\t\t\t\t\t\t\t\t\t<nb-icon\n\t\t\t\t\t\t\t\t\t\t\t\t\tclass=\"sync\"\n\t\t\t\t\t\t\t\t\t\t\t\t\ticon=\"sync-outline\"\n\t\t\t\t\t\t\t\t\t\t\t\t\tdebounceClick\n\t\t\t\t\t\t\t\t\t\t\t\t\t(throttledClick)=\"proposal$.next(true)\"\n\t\t\t\t\t\t\t\t\t\t\t\t\t[class.spin]=\"loading\"\n\t\t\t\t\t\t\t\t\t\t\t\t></nb-icon>\n\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t\t<ga-rich-text-editor\n\t\t\t\t\t\t\t\t\t\t\t\tid=\"details\"\n\t\t\t\t\t\t\t\t\t\t\t\tformControlName=\"details\"\n\t\t\t\t\t\t\t\t\t\t\t\tpreset=\"standard\"\n\t\t\t\t\t\t\t\t\t\t\t\toutputFormat=\"html\"\n\t\t\t\t\t\t\t\t\t\t\t\tminHeight=\"191px\"\n\t\t\t\t\t\t\t\t\t\t\t></ga-rich-text-editor>\n\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t<div class=\"row drag-drop\">\n\t\t\t\t\t\t\t\t\t<div class=\"col-12\">\n\t\t\t\t\t\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t\t\t\t\t\t<label class=\"label\" for=\"attachments\">\n\t\t\t\t\t\t\t\t\t\t\t\t{{ 'FORM.LABELS.ATTACHMENTS' | translate }}\n\t\t\t\t\t\t\t\t\t\t\t</label>\n\t\t\t\t\t\t\t\t\t\t\t<div\n\t\t\t\t\t\t\t\t\t\t\t\tng2FileDrop\n\t\t\t\t\t\t\t\t\t\t\t\t[uploader]=\"uploader\"\n\t\t\t\t\t\t\t\t\t\t\t\t(fileOver)=\"fileOverBase($event)\"\n\t\t\t\t\t\t\t\t\t\t\t\t[class.nv-file-over]=\"hasDropZoneOver\"\n\t\t\t\t\t\t\t\t\t\t\t\tclass=\"well my-drop-zone\"\n\t\t\t\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t\t\t\t{{ 'FORM.PLACEHOLDERS.DRAG_DROP_FILE' | translate }}\n\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</form>\n\t\t\t\t\t\t</nb-card-body>\n\t\t\t\t\t</nb-card>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</nb-card-body>\n\t\t<nb-card-footer class=\"text-right\">\n\t\t\t<button status=\"basic\" outline class=\"mr-3\" nbButton (click)=\"close()\">\n\t\t\t\t{{ 'BUTTONS.CANCEL' | translate }}\n\t\t\t</button>\n\t\t\t<button [disabled]=\"form.invalid\" status=\"success\" nbButton (click)=\"formDirective.ngSubmit.emit()\">\n\t\t\t\t{{ 'BUTTONS.APPLY' | translate }}\n\t\t\t</button>\n\t\t</nb-card-footer>\n\t</nb-card>\n</div>\n", styles: ["@charset \"UTF-8\";:host i{cursor:pointer}:host .cancel{width:100%;display:flex}[dir=ltr] :host .cancel{justify-content:flex-end}[dir=rtl] :host .cancel{justify-content:flex-start}:host .cancel i{font-size:11px;color:var(--gauzy-text-color-1)}:host [nbButton].appearance-outline.status-basic{background-color:transparent;border-color:#f56d584d;border-width:2px;color:#f56d58}:host [nbButton].appearance-outline.status-basic:hover{border-color:#f56d58}:host [nbButton].appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #f56d580d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host .title{color:var(--text-primary-color);font-size:16px;font-weight:600;line-height:16px;letter-spacing:0em}:host [nbButton].gray.appearance-outline.status-basic{background-color:transparent;border-color:#7e7e8f4d;border-width:2px;color:#7e7e8f}:host [nbButton].gray.appearance-outline.status-basic:hover{border-color:#7e7e8f}:host [nbButton].gray.appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #7e7e8f0d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].gray.appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host [nbButton].green.appearance-outline.status-basic{background-color:transparent;border-color:#25b8694d;border-width:2px;color:#25b869}:host [nbButton].green.appearance-outline.status-basic:hover{border-color:#25b869}:host [nbButton].green.appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #25b8690d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].green.appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host [nbButton].green.appearance-outline.status-basic[disabled],:host [nbButton].green.appearance-outline.status-basic.btn-disabled{background-color:var(--button-outline-basic-disabled-background-color);border-color:var(--button-outline-basic-disabled-border-color);color:var(--button-outline-basic-disabled-text-color);box-shadow:unset}:host [nbButton].primary.appearance-filled.status-primary{color:var(--text-primary-color);border:unset;background-color:var(--color-primary-transparent-default);box-shadow:var(--gauzy-shadow)}[dir=ltr] :host ::ng-deep input,[dir=ltr] :host ::ng-deep textarea{text-align:start}[dir=rtl] :host ::ng-deep input,[dir=rtl] :host ::ng-deep textarea{text-align:end}:host ::ng-deep input,:host ::ng-deep nb-select.appearance-outline.status-basic .select-button,:host ::ng-deep .ng-select .ng-select-container{background-color:var(--gauzy-sidebar-background-4)!important;border:none;min-height:calc(var(--select-medium-text-line-height) + .4375rem * 2)!important}:host ::ng-deep .ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-placeholder,:host ::ng-deep .ng-select.ng-select-single .ng-select-container .ng-value-container .ng-input{top:unset!important}:host ::ng-deep label,:host ::ng-deep .label{font-size:var(--text-label-font-size);font-weight:600;line-height:.8125rem;letter-spacing:-.01em;color:var(--gauzy-text-color-2)}:host ::ng-deep textarea{background-color:var(--gauzy-sidebar-background-4)!important;border:none}:host ::ng-deep .ng-select .ng-select-container input,:host ::ng-deep nb-tag-list input{background-color:unset!important}:host .main{display:flex;justify-content:center}:host .main>nb-card{height:100vh;width:95%}:host nb-card{background-color:var(--gauzy-card-1)}:host nb-card nb-card-body{background-color:var(--gauzy-card-2)}:host nb-card nb-card-body nb-card,:host nb-card nb-card-body nb-card-body{background-color:var(--gauzy-card-1);border-radius:var(--border-radius)}[dir=rtl] :host ::ng-deep .cancel{justify-content:flex-start}[dir=rtl] :host ::ng-deep .title{text-align:right}:host ::ng-deep job-title-description-details div.job-detail{display:flex;flex-direction:column}:host ::ng-deep job-title-description-details div.job-detail .job-body{overflow:auto;max-height:calc(100vh - 30.75rem)}:host .well{height:50px;display:flex;align-items:center;justify-content:center;color:var(--gauzy-text-color-2)}:host .my-drop-zone{border:dashed 3px var(--gauzy-border-default-color);border-radius:var(--border-radius)}:host .nv-file-over{border:dashed 3px red;border-radius:var(--border-radius)}:host .sync-container{display:flex;align-items:center;justify-content:flex-end;gap:4px;margin-bottom:4px}:host .sync-container .sync{color:var(--gauzy-text-color-2);cursor:pointer}:host .sync-container .sync.spin{color:var(--text-primary-color);animation:rotate 1s linear 0s infinite}@keyframes rotate{0%{transform:rotate(0)}to{transform:rotate(360deg)}}:host .sync-container span{color:var(--text-primary-color)}:host .button-generate-proposal{width:100%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:block;margin-bottom:5.5px}:host form{height:calc(100vh - 22.5rem);display:flex;flex-direction:column}:host form .drag-drop{margin-top:auto}:host ::ng-deep ga-rich-text-editor .rich-text-editor__content{height:calc(100vh - 40.5rem)!important;overflow-y:auto}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }], ctorParameters: () => [{ type: i1.TranslateService }, { type: i2.UntypedFormBuilder }, { type: i3.DomSanitizer }, { type: i4.NbDialogRef }, { type: i5.Store }, { type: i5.JobService }, { type: i5.ErrorHandlingService }], propDecorators: { selectedEmployee: [{
                type: Input
            }], employeeJobPost: [{
                type: Input
            }], formDirective: [{
                type: ViewChild,
                args: ['formDirective', { static: false }]
            }], proposalEditor: [{
                type: ViewChild,
                args: ['proposalEditor']
            }], employeeSelector: [{
                type: ViewChild,
                args: ['employeeSelector']
            }] } });
//# sourceMappingURL=apply-job-manually.component.js.map