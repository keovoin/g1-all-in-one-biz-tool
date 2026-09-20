import { __decorate, __metadata } from "tslib";
import { Component, inject } from '@angular/core';
import { combineLatest, map, BehaviorSubject, merge } from 'rxjs';
import { debounceTime, filter, tap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { NgxPermissionsService } from 'ngx-permissions';
import { omit } from 'underscore';
import { JobPostSourceEnum, JobPostTypeEnum } from '@gauzy/contracts';
import { distinctUntilChange, isEmpty, isNotEmpty } from '@gauzy/ui-core/common';
import { ErrorHandlingService, JobPresetService, JobSearchCategoryService, JobSearchOccupationService, Store, ToastrService } from '@gauzy/ui-core/core';
import { I18nService, TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import * as i0 from "@angular/core";
import * as i1 from "@nebular/theme";
import * as i2 from "@ng-select/ng-select";
import * as i3 from "@angular/forms";
import * as i4 from "ngx-permissions";
import * as i5 from "@gauzy/ui-core/shared";
import * as i6 from "@ngx-translate/core";
import * as i7 from "@angular/common";
let JobMatchingComponent = class JobMatchingComponent extends TranslationBaseComponent {
    constructor() {
        super(inject(TranslateService));
        /**
         * Stable permission array for `*ngxPermissionsOnly`.
         * 🛑 Never inline the literal in the binding: a new array on every change-detection
         * cycle makes ngx-permissions re-validate forever under default change detection,
         * which pins the main thread and the view never finishes rendering.
         */
        this.permGateOrgJobMatchingViewAllOrgView = Object.freeze(['ORG_JOB_MATCHING_VIEW', 'ALL_ORG_VIEW']);
        this.criterionForm = {
            jobSource: JobPostSourceEnum.UPWORK,
            jobPresetId: null
        };
        this._ngxPermissionsService = inject(NgxPermissionsService);
        this._store = inject(Store);
        this._i18nService = inject(I18nService);
        this._jobPresetService = inject(JobPresetService);
        this._jobSearchOccupationService = inject(JobSearchOccupationService);
        this._jobSearchCategoryService = inject(JobSearchCategoryService);
        this._toastrService = inject(ToastrService);
        this._errorHandlingService = inject(ErrorHandlingService);
        this.JobPostSourceEnum = JobPostSourceEnum;
        this.JobPostTypeEnum = JobPostTypeEnum;
        this.jobPresets = [];
        this.categories = [];
        this.occupations = [];
        this.criterions = [];
        this.hasAnyChanges = false;
        this.hasAddPreset$ = this._store.selectedEmployee$.pipe(map((employee) => !(!!employee && !!employee.id)));
        this.payloads$ = new BehaviorSubject(null);
        /**
         * Add new preset from here
         *
         * @param name
         */
        this.addPreset = async (name) => {
            if (!this.organization) {
                return;
            }
            try {
                const { id: organizationId, tenantId } = this.organization;
                const jobPreset = await this._jobPresetService.createJobPreset({
                    name,
                    tenantId,
                    organizationId,
                    ...(this.selectedEmployeeId ? { employees: [{ id: this.selectedEmployeeId }] } : [])
                });
                this.jobPresets = this.jobPresets.concat([jobPreset]);
                this.criterionForm.jobPresetId = jobPreset.id;
                this.criterions = [];
                this.addNewCriterion();
            }
            catch (error) {
                console.error('Error while creating job presets', error);
                this._errorHandlingService.handleError(error);
            }
        };
        /**
         * Create new job search category
         *
         * @param name
         * @returns
         */
        this.createNewCategories = async (name) => {
            if (!this.organization) {
                return;
            }
            try {
                const { id: organizationId, tenantId } = this.organization;
                const { jobSource } = this.criterionForm;
                const category = await this._jobSearchCategoryService.create({
                    name,
                    tenantId,
                    organizationId,
                    jobSource
                });
                this.categories = this.categories.concat([category]);
            }
            catch (error) {
                console.error('Error while creating new job search category', error);
            }
        };
        /**
         * Create new job search occupation
         *
         * @param name
         * @returns
         */
        this.createNewOccupations = async (name) => {
            if (!this.organization) {
                return;
            }
            try {
                const { id: organizationId, tenantId } = this.organization;
                const { jobSource } = this.criterionForm;
                const occupation = await this._jobSearchOccupationService.create({
                    name,
                    tenantId,
                    organizationId,
                    jobSource
                });
                this.occupations = this.occupations.concat([occupation]);
            }
            catch (error) {
                console.error('Error while creating new job search occupation', error);
            }
        };
    }
    ngOnInit() {
        // Initialize UI permissions
        this.initializeUiPermissions();
        // Initialize UI languages and Update Locale
        this.initializeUiLanguagesAndLocale();
        this.payloads$
            .pipe(debounceTime(100), distinctUntilChange(), filter((payloads) => !!payloads), tap(() => this.getJobPresets()), untilDestroyed(this))
            .subscribe();
        // Get Organization
        const storeOrganization$ = this._store.selectedOrganization$.pipe(distinctUntilChange(), filter((organization) => !!organization), tap((organization) => (this.organization = organization)), tap(() => {
            this.getCategories();
            this.getOccupations();
        }), untilDestroyed(this));
        // Get Employee
        const storeEmployee$ = this._store.selectedEmployee$.pipe(distinctUntilChange(), filter((employee) => !!employee), tap((employee) => (this.selectedEmployeeId = employee.id)), tap(() => this.getEmployeeCriterions()), untilDestroyed(this));
        combineLatest([storeOrganization$, storeEmployee$])
            .pipe(distinctUntilChange(), tap(() => this.preparePayloads()), untilDestroyed(this))
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
     * Prepare Unique Payloads
     *
     * @returns
     */
    preparePayloads() {
        if (!this.organization) {
            return;
        }
        // Get Organization
        const { id: organizationId, tenantId } = this.organization;
        // Prepare Payloads
        const request = {
            tenantId,
            organizationId,
            ...(this.selectedEmployeeId ? { employeeId: this.selectedEmployeeId } : {})
        };
        this.payloads$.next(request);
    }
    /**
     * Get Job Presets
     *
     * @returns
     */
    async getJobPresets() {
        if (!this.organization) {
            return;
        }
        try {
            const payloads = this.payloads$.getValue();
            const jobPresets = await this._jobPresetService.getJobPresets(payloads);
            this.jobPresets = jobPresets;
            if (this.selectedEmployeeId) {
                this.criterionForm.jobPresetId = jobPresets.length > 0 ? jobPresets[0].id : null;
            }
        }
        catch (error) {
            console.error('Error while retrieving job presets', error);
            this._errorHandlingService.handleError(error);
        }
    }
    /**
     * Get Employee Criterions
     *
     * @returns
     */
    async getEmployeeCriterions() {
        if (!this.organization) {
            return;
        }
        try {
            this.criterions = [];
            if (this.selectedEmployeeId) {
                this.criterions = await this._jobPresetService.getEmployeeCriterions(this.selectedEmployeeId);
                if (isEmpty(this.criterions)) {
                    this.addNewCriterion();
                }
            }
        }
        catch (error) {
            console.error('Error while retrieving employee criterions', error);
            this._errorHandlingService.handleError(error);
        }
    }
    async onPresetSelected(jobPreset) {
        try {
            this.criterions = [];
            if (jobPreset) {
                if (this.selectedEmployeeId) {
                    await this.updateEmployeePreset();
                }
                else {
                    const { jobPresetCriterions = [] } = await this._jobPresetService.getJobPreset(jobPreset.id);
                    if (isNotEmpty(jobPresetCriterions)) {
                        this.criterions = jobPresetCriterions;
                    }
                    else {
                        this.addNewCriterion();
                    }
                }
            }
            this.hasAnyChanges = false;
        }
        catch (error) {
            console.log('Error while change job preset', error);
            this._errorHandlingService.handleError(error);
        }
    }
    /**
     * On Source Selected
     *
     * @returns
     */
    onSourceSelected() {
        this.criterionForm.jobPresetId = null;
        this.updateEmployeePreset();
    }
    /**
     * Update Employee Preset
     *
     * @returns
     */
    async updateEmployeePreset() {
        if (!this.organization || !this.selectedEmployeeId) {
            return;
        }
        try {
            // Get Organization
            const { id: organizationId, tenantId } = this.organization;
            const { jobSource, jobPresetId } = this.criterionForm;
            // Update Employee Preset
            this.criterions = await this._jobPresetService.saveEmployeePreset({
                source: jobSource,
                jobPresetIds: [jobPresetId],
                employeeId: this.selectedEmployeeId,
                tenantId,
                organizationId
            });
        }
        catch (error) {
            console.error('Error while updating employee preset', error);
            this._errorHandlingService.handleError(error);
        }
    }
    /**
     * Save Job Preset
     *
     * @returns
     */
    async saveJobPreset() {
        if (!this.organization || !this.criterionForm.jobPresetId) {
            return;
        }
        // Get Organization
        const { id: organizationId, tenantId } = this.organization;
        const { jobPresetId } = this.criterionForm;
        // Create job preset
        const request = {
            id: jobPresetId,
            tenantId,
            organizationId
        };
        // Update criterions
        if (this.criterions && this.criterions.length > 0) {
            request.jobPresetCriterions = this.criterions
                .map((item) => omit(item, 'employeeId', 'id', 'jobPresetId'))
                .filter((criterion) => Object.values(criterion).length > 0);
        }
        // Create job preset
        const jobPreset = await this._jobPresetService.createJobPreset(request);
        // Update criterions
        if (jobPreset) {
            this.hasAnyChanges = false;
            this._toastrService.success('TOASTR.MESSAGE.PRESET_SAVED');
        }
    }
    /**
     * Save Criterion
     *
     * @param criterion
     */
    async saveCriterion(criterion) {
        if (!this.organization) {
            return;
        }
        // Get Organization
        const { id: organizationId, tenantId } = this.organization;
        let createdCriterion;
        this.hasAnyChanges = true;
        try {
            if (this.selectedEmployeeId) {
                createdCriterion = await this._jobPresetService.createEmployeeCriterion(this.selectedEmployeeId, {
                    ...criterion,
                    tenantId,
                    organizationId
                });
            }
            else {
                createdCriterion = await this._jobPresetService.createJobPresetCriterion(this.criterionForm.jobPresetId, {
                    ...criterion,
                    tenantId,
                    organizationId
                });
            }
            const index = this.criterions.indexOf(criterion);
            this.criterions[index] = createdCriterion;
            this._toastrService.success('TOASTR.MESSAGE.JOB_MATCHING_SAVED');
        }
        catch (error) {
            this._toastrService.error('TOASTR.MESSAGE.JOB_MATCHING_ERROR');
        }
    }
    /**
     * Delete criterion
     *
     * @param index
     * @param criterion
     * @returns
     */
    async deleteCriterions(index, criterion) {
        if (criterion.id) {
            this.hasAnyChanges = true;
            if (this.selectedEmployeeId) {
                try {
                    await this._jobPresetService.deleteEmployeeCriterion(this.selectedEmployeeId, criterion.id);
                    this._toastrService.success('TOASTR.MESSAGE.JOB_MATCHING_DELETED');
                }
                catch (error) {
                    this._toastrService.error('TOASTR.MESSAGE.JOB_MATCHING_ERROR');
                    return;
                }
            }
            else {
                try {
                    await this._jobPresetService.deleteJobPresetCriterion(criterion.id);
                    this._toastrService.success('TOASTR.MESSAGE.JOB_MATCHING_DELETED');
                }
                catch (error) {
                    this._toastrService.error('TOASTR.MESSAGE.JOB_MATCHING_ERROR');
                    return;
                }
            }
        }
        this.criterions.splice(index, 1);
        if (this.criterions.length === 0) {
            this.addNewCriterion();
        }
    }
    /**
     * Add new criterion
     *
     * @param criterion
     */
    addNewCriterion(criterion = {
        jobType: JobPostTypeEnum.HOURLY
    }) {
        this.criterions.push(criterion);
    }
    /**
     * Get Categories
     */
    async getCategories() {
        if (!this.organization) {
            return;
        }
        try {
            const { id: organizationId, tenantId } = this.organization;
            const { jobSource } = this.criterionForm;
            // Get Categories
            const categories = await this._jobSearchCategoryService.getAll({
                tenantId,
                organizationId,
                jobSource
            });
            // Set Categories
            this.categories = categories.items;
        }
        catch (error) {
            console.error('Error while retrieving job categories', error);
        }
    }
    /**
     * Get Occupations
     */
    async getOccupations() {
        if (!this.organization) {
            return;
        }
        try {
            const { id: organizationId, tenantId } = this.organization;
            const { jobSource } = this.criterionForm;
            // Get Occupations
            const occupations = await this._jobSearchOccupationService.getAll({
                tenantId,
                organizationId,
                jobSource
            });
            // Set Occupations
            this.occupations = occupations.items;
        }
        catch (error) {
            console.error('Error while retrieving job occupations', error);
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: JobMatchingComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: JobMatchingComponent, isStandalone: false, selector: "ga-job-matching", usesInheritance: true, ngImport: i0, template: "<nb-card>\n  <nb-card-header class=\"header\">\n    <h4>\n      {{ 'JOB_MATCHING.CONFIGURE_EMPLOYEES_TO_JOBS_MATCHING' | translate }}\n    </h4>\n  </nb-card-header>\n  <nb-card-body>\n    <div class=\"row\">\n      <div class=\"col-sm-6\">\n        <div class=\"form-group\">\n          <label>{{ 'JOB_MATCHING.SOURCE' | translate }}</label>\n          <nb-select\n            [placeholder]=\"'JOB_MATCHING.SOURCE' | translate\"\n            fullWidth\n            (selectedChange)=\"onSourceSelected()\"\n            [(ngModel)]=\"criterionForm.jobSource\"\n            >\n            @for (source of JobPostSourceEnum | keyvalue; track source) {\n              <nb-option\n                [value]=\"source.value | lowercase\"\n                >\n                {{ 'JOBS.' + source.key | translate }}\n              </nb-option>\n            }\n          </nb-select>\n        </div>\n      </div>\n    </div>\n    <ng-template [ngxPermissionsOnly]=\"permGateOrgJobMatchingViewAllOrgView\">\n      <div class=\"row\">\n        <div class=\"col-sm-6\">\n          <div class=\"form-group\">\n            <label class=\"d-block\">\n              {{ 'JOB_MATCHING.PRESET' | translate }}\n            </label>\n            <div class=\"w-100\">\n              <div class=\"row\">\n                <div class=\"col-12\">\n                  <ng-select\n                    [addTag]=\"(hasAddPreset$ | async) ? addPreset : null\"\n                    (change)=\"onPresetSelected($event)\"\n                    [clearable]=\"true\"\n                    [items]=\"jobPresets\"\n                    [(ngModel)]=\"criterionForm.jobPresetId\"\n                    [placeholder]=\"'JOB_MATCHING.PRESET' | translate\"\n                    bindValue=\"id\"\n                    bindLabel=\"name\"\n                    appendTo=\"body\"\n                  ></ng-select>\n                </div>\n                <div class=\"col-12\">\n                  @if (criterionForm?.jobPresetId && hasAnyChanges && !selectedEmployeeId) {\n                    @if (selectedEmployeeId) {\n                      <button\n                        nbButton\n                        status=\"primary\"\n                        ngxConfirmDialog\n                        [message]=\"'JOB_MATCHING.SAVE_PRESET_MESSAGE' | translate\"\n                        (confirm)=\"saveJobPreset()\"\n                        >\n                        <nb-icon icon=\"save-outline\"></nb-icon>\n                        {{ 'JOB_MATCHING.SAVE' | translate }}\n                      </button>\n                    }\n                  }\n                </div>\n              </div>\n            </div>\n          </div>\n        </div>\n      </div>\n      @if (selectedEmployeeId || criterionForm?.jobPresetId) {\n        <div class=\"row align-items-center my-3\">\n          <h6 class=\"col m-0\">{{ 'JOB_MATCHING.CRITERIONS' | translate }}</h6>\n          <div class=\"col-auto\">\n            <button nbButton status=\"primary\" (click)=\"addNewCriterion()\">\n              <nb-icon icon=\"plus-outline\"></nb-icon>\n              {{ 'JOB_MATCHING.ADD_NEW_CRITERIONS' | translate }}\n            </button>\n          </div>\n        </div>\n      }\n      <div class=\"criterions-list-container\">\n        @for (criterion of criterions; track criterion; let index = $index) {\n          <div class=\"criterions-list\">\n            <form #form (ngSubmit)=\"saveCriterion(criterion)\">\n              <div class=\"row\">\n                <div class=\"col-auto\">\n                  <h6>{{ index + 1 }}</h6>\n                </div>\n                <div class=\"col-sm\">\n                  <div class=\"form-group\">\n                    <label class=\"d-block col-sm-2\"> {{ 'JOB_MATCHING.KEYWORDS' | translate }}</label>\n                    <div class=\"col-sm-6\">\n                      <input\n                        nbInput\n                        fullWidth\n                        name=\"keyword\"\n                        [(ngModel)]=\"criterion.keyword\"\n                        [placeholder]=\"'JOB_MATCHING.KEYWORDS' | translate\"\n                        />\n                      </div>\n                    </div>\n                    <div class=\"form-group\">\n                      <label class=\"d-block col-sm-2\"> {{ 'JOB_MATCHING.CATEGORY' | translate }}</label>\n                      <div class=\"col-sm-6\">\n                        <ng-select\n                          name=\"categoryId\"\n                          [addTag]=\"createNewCategories\"\n                          [(ngModel)]=\"criterion.categoryId\"\n                          [clearable]=\"true\"\n                          [items]=\"categories\"\n                          [placeholder]=\"'JOB_MATCHING.CATEGORY' | translate\"\n                          bindValue=\"id\"\n                          bindLabel=\"name\"\n                          appendTo=\"body\"\n                          >\n                        </ng-select>\n                      </div>\n                    </div>\n                    <div class=\"form-group\">\n                      <label class=\"d-block col-sm-2\"> {{ 'JOB_MATCHING.OCCUPATION' | translate }}</label>\n                      <div class=\"col-sm-6\">\n                        <ng-select\n                          name=\"occupationId\"\n                          [addTag]=\"createNewOccupations\"\n                          [(ngModel)]=\"criterion.occupationId\"\n                          [clearable]=\"true\"\n                          [items]=\"occupations\"\n                          [placeholder]=\"'JOB_MATCHING.OCCUPATION' | translate\"\n                          bindValue=\"id\"\n                          bindLabel=\"name\"\n                          appendTo=\"body\"\n                          >\n                        </ng-select>\n                      </div>\n                    </div>\n                    <div class=\"row\">\n                      <label class=\"d-block col-sm-2\"></label>\n                      <div class=\"col-sm\">\n                        <nb-radio-group name=\"jobType\" class=\"d-flex\" [(ngModel)]=\"criterion.jobType\">\n                          @for (type of JobPostTypeEnum | keyvalue; track type) {\n                            <nb-radio\n                              [value]=\"type.value | lowercase\"\n                              >\n                              {{ 'JOBS.' + type.key | translate }}\n                            </nb-radio>\n                          }\n                        </nb-radio-group>\n                      </div>\n                      <div class=\"col-auto footer-buttons\">\n                        <button\n                          nbButton\n                          status=\"basic\"\n                          type=\"button\"\n                          size=\"small\"\n                          [nbTooltip]=\"'JOB_MATCHING.DELETE' | translate\"\n                          ngxConfirmDialog\n                          class=\"action\"\n                          [message]=\"'JOB_MATCHING.DELETE_CRITERION_MESSAGE' | translate\"\n                          (confirm)=\"deleteCriterions(index, criterion)\"\n                          >\n                          <nb-icon status=\"danger\" icon=\"trash-outline\"></nb-icon>\n                        </button>\n                        <button type=\"submit\" nbButton status=\"success\" size=\"small\">\n                          <nb-icon icon=\"save-outline\"></nb-icon>\n                          {{ 'JOB_MATCHING.SAVE' | translate }}\n                        </button>\n                      </div>\n                    </div>\n                  </div>\n                </div>\n              </form>\n            </div>\n          }\n        </div>\n      </ng-template>\n    </nb-card-body>\n  </nb-card>\n", styles: ["@charset \"UTF-8\";:host{height:100%}:host nb-card,:host nb-card-body{background-color:var(--gauzy-card-2)}:host nb-card{height:100%}:host nb-card nb-card-body{border-radius:0 0 var(--border-radius) var(--border-radius)}:host .form-group.row{display:flex;flex-direction:column;background:var(--gauzy-card-3);padding:10px 20px 18px 12px;border-radius:var(--border-radius);width:100%}:host .footer-buttons{display:flex;gap:4px}:host ::ng-deep input,:host ::ng-deep nb-select.appearance-outline.status-basic .select-button,:host ::ng-deep .ng-select .ng-select-container{background-color:var(--gauzy-card-1)!important;border:none;min-height:42px!important}:host ::ng-deep .ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-placeholder,:host ::ng-deep .ng-select.ng-select-single .ng-select-container .ng-value-container .ng-input{top:unset!important}:host ::ng-deep label,:host ::ng-deep .label{font-size:var(--text-label-font-size);font-weight:600;line-height:.8125rem;letter-spacing:-.01em;color:var(--gauzy-text-color-2)}:host ::ng-deep textarea{background-color:var(--gauzy-card-1)!important;border:none}:host ::ng-deep .ng-select .ng-select-container input,:host ::ng-deep nb-tag-list input{background-color:unset!important}:host .criterions-list-container{display:flex;flex-direction:column;gap:1rem;padding:8px;overflow-y:auto}:host .criterions-list-container .criterions-list{border:none;border-radius:var(--border-radius);background-color:var(--gauzy-card-2);padding:1.5rem .5rem 1rem 1rem}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "component", type: i1.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "component", type: i1.NbCardComponent, selector: "nb-card", inputs: ["size", "status", "accent"] }, { kind: "component", type: i1.NbCardBodyComponent, selector: "nb-card-body" }, { kind: "component", type: i1.NbCardHeaderComponent, selector: "nb-card-header" }, { kind: "component", type: i1.NbIconComponent, selector: "nb-icon", inputs: ["icon", "pack", "options", "status", "config"] }, { kind: "directive", type: i1.NbInputDirective, selector: "input[nbInput],textarea[nbInput]", inputs: ["fieldSize", "status", "shape", "fullWidth"] }, { kind: "component", type: i1.NbRadioComponent, selector: "nb-radio", inputs: ["name", "checked", "value", "disabled", "status"], outputs: ["valueChange", "blur"] }, { kind: "component", type: i1.NbRadioGroupComponent, selector: "nb-radio-group", inputs: ["value", "name", "disabled", "status"], outputs: ["valueChange"] }, { kind: "component", type: i1.NbSelectComponent, selector: "nb-select", inputs: ["size", "status", "shape", "appearance", "optionsListClass", "optionsPanelClass", "optionsWidth", "outline", "filled", "hero", "disabled", "fullWidth", "placeholder", "compareWith", "selected", "multiple", "optionsOverlayOffset", "scrollStrategy"], outputs: ["selectedChange"] }, { kind: "component", type: i1.NbOptionComponent, selector: "nb-option", inputs: ["value", "disabled"], outputs: ["selectionChange"] }, { kind: "directive", type: i1.NbTooltipDirective, selector: "[nbTooltip]", inputs: ["nbTooltip", "nbTooltipPlacement", "nbTooltipAdjustment", "nbTooltipClass", "nbTooltipIcon", "nbTooltipStatus", "nbTooltipTrigger", "nbTooltipOffset", "nbTooltipDisabled"], outputs: ["nbTooltipShowStateChange"], exportAs: ["nbTooltip"] }, { kind: "component", type: i2.NgSelectComponent, selector: "ng-select", inputs: ["ariaLabelDropdown", "ariaLabel", "markFirst", "placeholder", "fixedPlaceholder", "notFoundText", "typeToSearchText", "preventToggleOnRightClick", "addTagText", "loadingText", "clearAllText", "dropdownPosition", "appendTo", "outsideClickEvent", "loading", "closeOnSelect", "hideSelected", "selectOnTab", "openOnEnter", "maxSelectedItems", "groupBy", "groupValue", "bufferAmount", "virtualScroll", "selectableGroup", "tabFocusOnClearButton", "selectableGroupAsModel", "searchFn", "trackByFn", "clearOnBackspace", "labelForId", "inputAttrs", "tabIndex", "readonly", "searchWhileComposing", "minTermLength", "editableSearchTerm", "ngClass", "typeahead", "multiple", "addTag", "searchable", "clearable", "clearKeepsDisabledOptions", "deselectOnClick", "clearSearchOnAdd", "compareWith", "keyDownFn", "bindLabel", "bindValue", "appearance", "isOpen", "items"], outputs: ["bindLabelChange", "bindValueChange", "appearanceChange", "isOpenChange", "itemsChange", "blur", "focus", "change", "open", "close", "search", "clear", "add", "remove", "scroll", "scrollToEnd"], exportAs: ["ngSelect"] }, { kind: "directive", type: i3.ɵNgNoValidate, selector: "form:not([ngNoForm]):not([ngNativeValidate])" }, { kind: "directive", type: i3.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i3.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i3.NgControlStatusGroup, selector: "[formGroupName],[formArrayName],[ngModelGroup],[formGroup],[formArray],form:not([ngNoForm]),[ngForm]" }, { kind: "directive", type: i3.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "directive", type: i3.NgForm, selector: "form:not([ngNoForm]):not([formGroup]):not([formArray]),ng-form,[ngForm]", inputs: ["ngFormOptions"], outputs: ["ngSubmit"], exportAs: ["ngForm"] }, { kind: "directive", type: i4.NgxPermissionsDirective, selector: "[ngxPermissionsOnly],[ngxPermissionsExcept]", inputs: ["ngxPermissionsOnly", "ngxPermissionsOnlyThen", "ngxPermissionsOnlyElse", "ngxPermissionsExcept", "ngxPermissionsExceptElse", "ngxPermissionsExceptThen", "ngxPermissionsThen", "ngxPermissionsElse", "ngxPermissionsOnlyAuthorisedStrategy", "ngxPermissionsOnlyUnauthorisedStrategy", "ngxPermissionsExceptUnauthorisedStrategy", "ngxPermissionsExceptAuthorisedStrategy", "ngxPermissionsUnauthorisedStrategy", "ngxPermissionsAuthorisedStrategy"], outputs: ["permissionsAuthorized", "permissionsUnauthorized"] }, { kind: "directive", type: i5.ConfirmDirective, selector: "[ngxConfirmDialog]", inputs: ["message", "title", "yesText", "noText"], outputs: ["confirm", "decline"] }, { kind: "pipe", type: i6.TranslatePipe, name: "translate" }, { kind: "pipe", type: i7.AsyncPipe, name: "async" }, { kind: "pipe", type: i7.LowerCasePipe, name: "lowercase" }, { kind: "pipe", type: i7.KeyValuePipe, name: "keyvalue" }] }); }
};
JobMatchingComponent = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [])
], JobMatchingComponent);
export { JobMatchingComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: JobMatchingComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-job-matching', standalone: false, template: "<nb-card>\n  <nb-card-header class=\"header\">\n    <h4>\n      {{ 'JOB_MATCHING.CONFIGURE_EMPLOYEES_TO_JOBS_MATCHING' | translate }}\n    </h4>\n  </nb-card-header>\n  <nb-card-body>\n    <div class=\"row\">\n      <div class=\"col-sm-6\">\n        <div class=\"form-group\">\n          <label>{{ 'JOB_MATCHING.SOURCE' | translate }}</label>\n          <nb-select\n            [placeholder]=\"'JOB_MATCHING.SOURCE' | translate\"\n            fullWidth\n            (selectedChange)=\"onSourceSelected()\"\n            [(ngModel)]=\"criterionForm.jobSource\"\n            >\n            @for (source of JobPostSourceEnum | keyvalue; track source) {\n              <nb-option\n                [value]=\"source.value | lowercase\"\n                >\n                {{ 'JOBS.' + source.key | translate }}\n              </nb-option>\n            }\n          </nb-select>\n        </div>\n      </div>\n    </div>\n    <ng-template [ngxPermissionsOnly]=\"permGateOrgJobMatchingViewAllOrgView\">\n      <div class=\"row\">\n        <div class=\"col-sm-6\">\n          <div class=\"form-group\">\n            <label class=\"d-block\">\n              {{ 'JOB_MATCHING.PRESET' | translate }}\n            </label>\n            <div class=\"w-100\">\n              <div class=\"row\">\n                <div class=\"col-12\">\n                  <ng-select\n                    [addTag]=\"(hasAddPreset$ | async) ? addPreset : null\"\n                    (change)=\"onPresetSelected($event)\"\n                    [clearable]=\"true\"\n                    [items]=\"jobPresets\"\n                    [(ngModel)]=\"criterionForm.jobPresetId\"\n                    [placeholder]=\"'JOB_MATCHING.PRESET' | translate\"\n                    bindValue=\"id\"\n                    bindLabel=\"name\"\n                    appendTo=\"body\"\n                  ></ng-select>\n                </div>\n                <div class=\"col-12\">\n                  @if (criterionForm?.jobPresetId && hasAnyChanges && !selectedEmployeeId) {\n                    @if (selectedEmployeeId) {\n                      <button\n                        nbButton\n                        status=\"primary\"\n                        ngxConfirmDialog\n                        [message]=\"'JOB_MATCHING.SAVE_PRESET_MESSAGE' | translate\"\n                        (confirm)=\"saveJobPreset()\"\n                        >\n                        <nb-icon icon=\"save-outline\"></nb-icon>\n                        {{ 'JOB_MATCHING.SAVE' | translate }}\n                      </button>\n                    }\n                  }\n                </div>\n              </div>\n            </div>\n          </div>\n        </div>\n      </div>\n      @if (selectedEmployeeId || criterionForm?.jobPresetId) {\n        <div class=\"row align-items-center my-3\">\n          <h6 class=\"col m-0\">{{ 'JOB_MATCHING.CRITERIONS' | translate }}</h6>\n          <div class=\"col-auto\">\n            <button nbButton status=\"primary\" (click)=\"addNewCriterion()\">\n              <nb-icon icon=\"plus-outline\"></nb-icon>\n              {{ 'JOB_MATCHING.ADD_NEW_CRITERIONS' | translate }}\n            </button>\n          </div>\n        </div>\n      }\n      <div class=\"criterions-list-container\">\n        @for (criterion of criterions; track criterion; let index = $index) {\n          <div class=\"criterions-list\">\n            <form #form (ngSubmit)=\"saveCriterion(criterion)\">\n              <div class=\"row\">\n                <div class=\"col-auto\">\n                  <h6>{{ index + 1 }}</h6>\n                </div>\n                <div class=\"col-sm\">\n                  <div class=\"form-group\">\n                    <label class=\"d-block col-sm-2\"> {{ 'JOB_MATCHING.KEYWORDS' | translate }}</label>\n                    <div class=\"col-sm-6\">\n                      <input\n                        nbInput\n                        fullWidth\n                        name=\"keyword\"\n                        [(ngModel)]=\"criterion.keyword\"\n                        [placeholder]=\"'JOB_MATCHING.KEYWORDS' | translate\"\n                        />\n                      </div>\n                    </div>\n                    <div class=\"form-group\">\n                      <label class=\"d-block col-sm-2\"> {{ 'JOB_MATCHING.CATEGORY' | translate }}</label>\n                      <div class=\"col-sm-6\">\n                        <ng-select\n                          name=\"categoryId\"\n                          [addTag]=\"createNewCategories\"\n                          [(ngModel)]=\"criterion.categoryId\"\n                          [clearable]=\"true\"\n                          [items]=\"categories\"\n                          [placeholder]=\"'JOB_MATCHING.CATEGORY' | translate\"\n                          bindValue=\"id\"\n                          bindLabel=\"name\"\n                          appendTo=\"body\"\n                          >\n                        </ng-select>\n                      </div>\n                    </div>\n                    <div class=\"form-group\">\n                      <label class=\"d-block col-sm-2\"> {{ 'JOB_MATCHING.OCCUPATION' | translate }}</label>\n                      <div class=\"col-sm-6\">\n                        <ng-select\n                          name=\"occupationId\"\n                          [addTag]=\"createNewOccupations\"\n                          [(ngModel)]=\"criterion.occupationId\"\n                          [clearable]=\"true\"\n                          [items]=\"occupations\"\n                          [placeholder]=\"'JOB_MATCHING.OCCUPATION' | translate\"\n                          bindValue=\"id\"\n                          bindLabel=\"name\"\n                          appendTo=\"body\"\n                          >\n                        </ng-select>\n                      </div>\n                    </div>\n                    <div class=\"row\">\n                      <label class=\"d-block col-sm-2\"></label>\n                      <div class=\"col-sm\">\n                        <nb-radio-group name=\"jobType\" class=\"d-flex\" [(ngModel)]=\"criterion.jobType\">\n                          @for (type of JobPostTypeEnum | keyvalue; track type) {\n                            <nb-radio\n                              [value]=\"type.value | lowercase\"\n                              >\n                              {{ 'JOBS.' + type.key | translate }}\n                            </nb-radio>\n                          }\n                        </nb-radio-group>\n                      </div>\n                      <div class=\"col-auto footer-buttons\">\n                        <button\n                          nbButton\n                          status=\"basic\"\n                          type=\"button\"\n                          size=\"small\"\n                          [nbTooltip]=\"'JOB_MATCHING.DELETE' | translate\"\n                          ngxConfirmDialog\n                          class=\"action\"\n                          [message]=\"'JOB_MATCHING.DELETE_CRITERION_MESSAGE' | translate\"\n                          (confirm)=\"deleteCriterions(index, criterion)\"\n                          >\n                          <nb-icon status=\"danger\" icon=\"trash-outline\"></nb-icon>\n                        </button>\n                        <button type=\"submit\" nbButton status=\"success\" size=\"small\">\n                          <nb-icon icon=\"save-outline\"></nb-icon>\n                          {{ 'JOB_MATCHING.SAVE' | translate }}\n                        </button>\n                      </div>\n                    </div>\n                  </div>\n                </div>\n              </form>\n            </div>\n          }\n        </div>\n      </ng-template>\n    </nb-card-body>\n  </nb-card>\n", styles: ["@charset \"UTF-8\";:host{height:100%}:host nb-card,:host nb-card-body{background-color:var(--gauzy-card-2)}:host nb-card{height:100%}:host nb-card nb-card-body{border-radius:0 0 var(--border-radius) var(--border-radius)}:host .form-group.row{display:flex;flex-direction:column;background:var(--gauzy-card-3);padding:10px 20px 18px 12px;border-radius:var(--border-radius);width:100%}:host .footer-buttons{display:flex;gap:4px}:host ::ng-deep input,:host ::ng-deep nb-select.appearance-outline.status-basic .select-button,:host ::ng-deep .ng-select .ng-select-container{background-color:var(--gauzy-card-1)!important;border:none;min-height:42px!important}:host ::ng-deep .ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-placeholder,:host ::ng-deep .ng-select.ng-select-single .ng-select-container .ng-value-container .ng-input{top:unset!important}:host ::ng-deep label,:host ::ng-deep .label{font-size:var(--text-label-font-size);font-weight:600;line-height:.8125rem;letter-spacing:-.01em;color:var(--gauzy-text-color-2)}:host ::ng-deep textarea{background-color:var(--gauzy-card-1)!important;border:none}:host ::ng-deep .ng-select .ng-select-container input,:host ::ng-deep nb-tag-list input{background-color:unset!important}:host .criterions-list-container{display:flex;flex-direction:column;gap:1rem;padding:8px;overflow-y:auto}:host .criterions-list-container .criterions-list{border:none;border-radius:var(--border-radius);background-color:var(--gauzy-card-2);padding:1.5rem .5rem 1rem 1rem}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }], ctorParameters: () => [] });
//# sourceMappingURL=job-matching.component.js.map