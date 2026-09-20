var BasicInfoFormComponent_1;
import { __decorate, __metadata } from "tslib";
import { Component, ViewChild, ElementRef, Input } from '@angular/core';
import { Validators, UntypedFormBuilder } from '@angular/forms';
import { Location } from '@angular/common';
import { RolesEnum } from '@gauzy/contracts';
import { filter, firstValueFrom, tap } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { AuthService, CandidatesService, EmployeesService, ErrorHandlingService, RoleService, CompareDateValidator, UrlPatternValidator, Store } from '@gauzy/ui-core/core';
import { distinctUntilChange } from '@gauzy/ui-core/common';
import { FormHelpers } from '../../../forms/helpers';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
import * as i2 from "@angular/common";
import * as i3 from "@angular/forms";
import * as i4 from "@gauzy/ui-core/core";
import * as i5 from "@nebular/theme";
import * as i6 from "../../../directives/autocomplete-off.directive";
import * as i7 from "../../../directives/img.directive";
import * as i8 from "../../../file-uploader-input/file-uploader-input.component";
import * as i9 from "../../../tags/tags-color-input/tags-color-input.component";
import * as i10 from "../fields/password/password.component";
import * as i11 from "../fields/role/role.component";
let BasicInfoFormComponent = class BasicInfoFormComponent extends TranslationBaseComponent {
    static { BasicInfoFormComponent_1 = this; }
    get isCandidate() {
        return this._isCandidate;
    }
    set isCandidate(value) {
        this._isCandidate = value;
    }
    get isEmployee() {
        return this._isEmployee;
    }
    set isEmployee(value) {
        this._isEmployee = value;
    }
    get isShowRole() {
        return this._isShowRole;
    }
    set isShowRole(value) {
        this._isShowRole = value;
        this.setRoleValidations(value);
    }
    static buildForm(fb, self) {
        return fb.group({
            firstName: [null, Validators.required],
            lastName: [null],
            username: [null],
            email: [null, [Validators.required, Validators.email]],
            imageUrl: { value: null, disabled: true },
            imageId: [null],
            password: [null, [Validators.required, Validators.minLength(4)]],
            startedWorkOn: [null],
            role: [null],
            offerDate: [null],
            acceptDate: [null],
            appliedDate: [null],
            rejectDate: [null],
            source: [null],
            tags: [self.selectedTags],
            featureAsEmployee: [false]
        }, {
            validators: [
                CompareDateValidator.validateDate('offerDate', 'acceptDate'),
                CompareDateValidator.validateDate('offerDate', 'rejectDate'),
                UrlPatternValidator.imageUrlValidator('imageUrl')
            ]
        });
    }
    constructor(translateService, _location, _fb, _authService, _roleService, _employeesService, _candidatesService, _store, _errorHandlingService) {
        super(translateService);
        this.translateService = translateService;
        this._location = _location;
        this._fb = _fb;
        this._authService = _authService;
        this._roleService = _roleService;
        this._employeesService = _employeesService;
        this._candidatesService = _candidatesService;
        this._store = _store;
        this._errorHandlingService = _errorHandlingService;
        this.FormHelpers = FormHelpers;
        this.excludes = [];
        this.selectedTags = [];
        /*
         * Getter & Setter for check is for candidate mutation
         */
        this._isCandidate = false;
        /*
         * Getter & Setter for check is for employee mutation
         */
        this._isEmployee = false;
        /*
         * Getter & Setter for dynamic hide/show roles dropdown
         */
        this._isShowRole = false;
        this.form = BasicInfoFormComponent_1.buildForm(this._fb, this);
    }
    ngOnInit() {
        this.excludeRoles();
        this._store.selectedOrganization$
            .pipe(distinctUntilChange(), filter((organization) => !!organization), tap((organization) => (this.organization = organization)), filter(() => !!this._location.getState()), tap(() => this.patchUsingLocationState(this._location.getState())), untilDestroyed(this))
            .subscribe();
    }
    /**
     * Excludes the SUPER_ADMIN role if the current user doesn't have the necessary permissions.
     */
    async excludeRoles() {
        const hasSuperAdminRole = await firstValueFrom(this._authService.hasRole([RolesEnum.SUPER_ADMIN]));
        if (!hasSuperAdminRole) {
            this.excludes.push(RolesEnum.SUPER_ADMIN);
        }
    }
    /**
     * Checks if the current form's role is either SUPER_ADMIN or ADMIN.
     *
     * @returns A boolean indicating whether the role is SUPER_ADMIN or ADMIN.
     */
    enableEmployee() {
        const role = this.form.get('role').value?.name;
        return role === RolesEnum.SUPER_ADMIN || role === RolesEnum.ADMIN;
    }
    get showImageMeta() {
        return this.form.get('imageUrl') && this.form.get('imageUrl').value;
    }
    /**
     * Registers a user with different roles
     *
     * @param defaultRoleName - Default role to assign if none is specified
     * @param organizationId - ID of the organization
     * @param createdByUserId - ID of the user who created this user
     * @returns A promise of the created user or employee
     */
    async registerUser(defaultRoleName, organizationId, createdByUserId) {
        if (this.form.invalid) {
            return;
        }
        const { firstName, lastName, email, username, password, tags, imageUrl, imageId, featureAsEmployee, role: formRole } = this.form.value;
        const { tenantId, tenant } = this._store.user;
        // Remove unnecessary featureOrganizations property
        delete tenant.featureOrganizations;
        const roleName = formRole?.name || defaultRoleName;
        const role = await this.getRole(roleName, tenantId);
        const user = {
            firstName,
            lastName,
            email,
            username: username || null,
            imageUrl,
            imageId,
            role,
            tenant,
            tags
        };
        if (role.name === RolesEnum.EMPLOYEE) {
            return await this.createEmployee(user);
        }
        else if (role.name === RolesEnum.CANDIDATE) {
            return await this.createCandidate(user);
        }
        else {
            return await this.createUser(user, password, organizationId, createdByUserId, featureAsEmployee);
        }
    }
    /**
     * Creates a user with the specified attributes, either as an employee or a regular user.
     *
     * @param user - The user details.
     * @param password - The password for the user.
     * @param organizationId - (Optional) The ID of the organization.
     * @param createdByUserId - (Optional) The ID of the user who created this user.
     * @param featureAsEmployee - (Optional) Whether to create the user as an employee.
     * @returns A promise resolving to the created user or employee.
     */
    async createUser(user, password, organizationId, createdByUserId, featureAsEmployee) {
        return await firstValueFrom(this._authService.register({
            user,
            password,
            confirmPassword: password,
            organizationId,
            createdByUserId,
            featureAsEmployee
        }));
    }
    /**
     * Fetches a role based on the provided role name and tenant ID.
     *
     * @param roleName - The name of the role to fetch.
     * @param tenantId - The ID of the tenant to which the role belongs.
     * @returns A promise resolving to the role object.
     */
    async getRole(roleName, tenantId) {
        return await firstValueFrom(this._roleService.getRoleByOptions({
            name: roleName,
            tenantId
        }));
    }
    /**
     * Delete existing image
     */
    deleteImageUrl() {
        this.form.get('imageId').setValue(null);
        this.form.get('imageId').updateValueAndValidity();
        this.form.get('imageUrl').setValue(null);
        this.form.get('imageUrl').updateValueAndValidity();
    }
    /**
     * Handle selected tags
     *
     * @param tags An array of tags to set in the form control.
     */
    selectedTagsHandler(tags) {
        this.form.get('tags').setValue(tags);
        this.form.get('tags').updateValueAndValidity();
    }
    ngAfterViewInit() {
        this._setupLogoUrlValidation();
    }
    /**
     * Upload profile image/avatar
     *
     * @param image
     */
    updateImageAsset(image) {
        try {
            if (image && image.id) {
                this.form.get('imageId').setValue(image.id);
                this.form.get('imageUrl').setValue(image.fullUrl);
                this.form.updateValueAndValidity();
                const imageUrlControl = this.form.get('imageUrl');
                imageUrlControl.disable();
            }
        }
        catch (error) {
            console.log('Error while updating user profile/avatar by uploading');
        }
    }
    /**
     * Upload third party URL as image/avatar
     *
     * @param imageUrl The URL of the image to update in the form control.
     */
    updateImageUrl(imageUrl) {
        try {
            const imageUrlControl = this.form.get('imageUrl');
            if (imageUrl) {
                imageUrlControl.enable();
                imageUrlControl.setValue(imageUrl);
            }
            else {
                imageUrlControl.setValue(null);
                imageUrlControl.disable();
            }
        }
        catch (error) {
            console.error('Error while updating user profile/avatar by third party URL:', error);
        }
    }
    /**
     * Sets up validation for image URL based on image loading status.
     */
    _setupLogoUrlValidation() {
        // Clear errors on image load
        this.imagePreviewElement.nativeElement.onload = () => {
            this.form.get('imageUrl').setErrors(null);
        };
        // Set error on image load error, if showImageMeta is true
        this.imagePreviewElement.nativeElement.onerror = () => {
            if (this.showImageMeta) {
                this.form.get('imageUrl').setErrors({ invalidUrl: true });
            }
        };
    }
    /**
     * Handle selection change for roles.
     *
     * @param role The selected role object.
     */
    onSelectionChange(role) {
        if (this.isShowRole) {
            this.isCandidate = role.name === RolesEnum.CANDIDATE;
            this.isEmployee = role.name === RolesEnum.EMPLOYEE;
        }
    }
    /**
     * SET role field validations based on the given value.
     *
     * @param value Indicates whether role validation is required (true) or not (false).
     */
    setRoleValidations(value) {
        const control = this.form.get('role');
        if (value) {
            control.setValidators([Validators.required]);
        }
        else {
            control.clearValidators();
        }
        control.updateValueAndValidity();
    }
    /**
     * Create an employee from the user page.
     *
     * @param user The user object containing employee details.
     * @returns A promise that resolves to the created employee.
     */
    async createEmployee(user) {
        const { id: organizationId, tenantId } = this.organization;
        const { password, tags } = this.form.value;
        const { offerDate = null, acceptDate = null, rejectDate = null, startedWorkOn = null } = this.form.value;
        const employee = {
            tenantId,
            user,
            startedWorkOn,
            password,
            organizationId,
            organization: { id: organizationId },
            offerDate,
            acceptDate,
            rejectDate,
            tags
        };
        try {
            // Create the employee using the employeesService
            return await firstValueFrom(this._employeesService.create(employee));
        }
        catch (error) {
            // Handle any errors here, e.g., log them or rethrow as needed
            this._errorHandlingService.handleError(`Failed to create employee: ${error.message}`);
        }
    }
    /**
     * Create a candidate from user page.
     *
     * @param user The IUser object containing candidate's user details.
     * @returns A Promise resolving to the created ICandidate object.
     */
    async createCandidate(user) {
        const { id: organizationId, tenantId } = this.organization;
        const { password, tags } = this.form.value;
        const { appliedDate = null, rejectDate = null, source: sourceName = null } = this.form.value;
        let source = null;
        if (sourceName !== null) {
            source = {
                name: sourceName,
                tenantId,
                organizationId
            };
        }
        const candidate = {
            user,
            password,
            documents: [],
            appliedDate,
            source,
            rejectDate,
            tags,
            tenantId,
            organizationId
        };
        try {
            // Create the candidate using the _candidatesService
            return await firstValueFrom(this._candidatesService.create(candidate));
        }
        catch (error) {
            // Handle any errors here, e.g., log them or rethrow as needed
            this._errorHandlingService.handleError(`Failed to create candidate: ${error.message}`);
        }
    }
    /**
     * GET location old state & patch form value
     * We are using such functionality for create new employee from header selector
     *
     * @param state
     */
    patchUsingLocationState(state) {
        if (!this.form) {
            return;
        }
        this.form.patchValue({ ...state });
        this.form.updateValueAndValidity();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: BasicInfoFormComponent, deps: [{ token: i1.TranslateService }, { token: i2.Location }, { token: i3.UntypedFormBuilder }, { token: i4.AuthService }, { token: i4.RoleService }, { token: i4.EmployeesService }, { token: i4.CandidatesService }, { token: i4.Store }, { token: i4.ErrorHandlingService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: BasicInfoFormComponent, isStandalone: false, selector: "ga-user-basic-info-form", inputs: { selectedTags: "selectedTags", isCandidate: "isCandidate", isEmployee: "isEmployee", isShowRole: "isShowRole" }, viewQueries: [{ propertyName: "imagePreviewElement", first: true, predicate: ["imagePreview"], descendants: true }], usesInheritance: true, ngImport: i0, template: "<form [formGroup]=\"form\" autocomplete-off no-validate>\n  <div class=\"row\">\n    <div class=\"col-3\">\n      <div class=\"form-group row\" [hidden]=\"form.get('imageUrl').invalid\">\n        <div class=\"col-sm-12\">\n          <div class=\"row preview-img\" [hidden]=\"!showImageMeta\">\n            <div class=\"image\">\n              <img\n                #imagePreview\n                [src]=\"form.get('imageUrl').value\"\n                alt=\"Invalid image\"\n                class=\"img-rounded\"\n                />\n                <button class=\"trash-icon\" nbButton status=\"basic\" size=\"small\" (click)=\"deleteImageUrl()\">\n                  <nb-icon\n                    status=\"danger\"\n                    [title]=\"'FORM.PLACEHOLDERS.REMOVE_IMAGE' | translate\"\n                    icon=\"trash-2-outline\"\n                    [title]=\"'FORM.PLACEHOLDERS.REMOVE_IMAGE' | translate\"\n                  ></nb-icon>\n                </button>\n              </div>\n            </div>\n            <div class=\"row preview-img\" [hidden]=\"showImageMeta\">\n              <div class=\"image\">\n                <i class=\"far fa-image\"></i>\n                <button class=\"trash-icon\" nbButton status=\"basic\" size=\"small\">\n                  <nb-icon\n                    status=\"danger\"\n                    [title]=\"'FORM.PLACEHOLDERS.REMOVE_IMAGE' | translate\"\n                    icon=\"trash-2-outline\"\n                  ></nb-icon>\n                </button>\n              </div>\n            </div>\n          </div>\n        </div>\n      </div>\n      <div class=\"col-9\">\n        <div class=\"row\">\n          <div class=\"col-sm-12\">\n            <div class=\"form-group\">\n              <label for=\"inputImageUrl\" class=\"label\">\n                {{ 'FORM.LABELS.IMAGE_URL' | translate }}\n              </label>\n              <ngx-file-uploader-input\n                id=\"inputImageUrl\"\n                [placeholder]=\"'FORM.PLACEHOLDERS.UPLOADER_PLACEHOLDER' | translate\"\n                [fileUrl]=\"form.get('imageUrl').value\"\n                (uploadedImageAsset)=\"updateImageAsset($event)\"\n                (uploadedImgUrl)=\"updateImageUrl($event)\"\n              ></ngx-file-uploader-input>\n            </div>\n            @if (form.get('imageUrl')?.value !== null && FormHelpers.isInvalidControl(form, 'imageUrl')) {\n              <p class=\"caption status-danger mt-1\">\n                {{ 'FORM.ERROR.INVALID_IMAGE_URL' | translate }}\n              </p>\n            }\n\n          </div>\n        </div>\n      </div>\n    </div>\n    <div class=\"row\">\n      <div class=\"col\">\n        <div class=\"form-group\">\n          <label for=\"firstName\" class=\"label\">\n            {{ 'FORM.LABELS.FIRST_NAME' | translate }}\n          </label>\n          <input\n            nbInput\n            type=\"text\"\n            id=\"firstName\"\n            fullWidth\n            [placeholder]=\"'FORM.PLACEHOLDERS.FIRST_NAME' | translate\"\n            formControlName=\"firstName\"\n            [status]=\"FormHelpers.isInvalidControl(form, 'firstName') ? 'danger' : 'basic'\"\n            />\n            @if (FormHelpers.isInvalidControl(form, 'firstName')) {\n              <p class=\"caption status-danger mt-1\">\n                {{ 'TOASTR.MESSAGE.NAME_REQUIRED' | translate }}\n              </p>\n            }\n          </div>\n        </div>\n        <div class=\"col\">\n          <div class=\"form-group\">\n            <label for=\"lastName\" class=\"label\">{{ 'FORM.LABELS.LAST_NAME' | translate }}</label>\n            <input\n              nbInput\n              type=\"text\"\n              id=\"lastName\"\n              fullWidth\n              [placeholder]=\"'FORM.PLACEHOLDERS.LAST_NAME' | translate\"\n              formControlName=\"lastName\"\n              [status]=\"FormHelpers.isInvalidControl(form, 'lastName') ? 'danger' : 'basic'\"\n              />\n            </div>\n          </div>\n        </div>\n        <div class=\"row\">\n          <div class=\"col-4\">\n            <div class=\"form-group\">\n              <label for=\"username\" class=\"label\">{{ 'FORM.USERNAME' | translate }}</label>\n              <input\n                nbInput\n                type=\"text\"\n                id=\"username\"\n                fullWidth\n                [placeholder]=\"'FORM.USERNAME' | translate\"\n                formControlName=\"username\"\n                [status]=\"FormHelpers.isInvalidControl(form, 'username') ? 'danger' : 'basic'\"\n                />\n              </div>\n              @if (FormHelpers.isInvalidControl(form, 'username')) {\n                <p class=\"caption status-danger mt-1\">\n                  {{ 'TOASTR.MESSAGE.NAME_REQUIRED' | translate }}\n                </p>\n              }\n            </div>\n            <div class=\"col-8\">\n              <div class=\"form-group\">\n                <label for=\"email\" class=\"label\">{{ 'FORM.EMAIL' | translate }}</label>\n                <input\n                  autofocus\n                  pattern=\".+@.+\\..+\"\n                  type=\"email\"\n                  #email\n                  nbInput\n                  type=\"email\"\n                  id=\"email\"\n                  fullWidth\n                  [placeholder]=\"'FORM.EMAIL' | translate\"\n                  formControlName=\"email\"\n                  [status]=\"FormHelpers.isInvalidControl(form, 'email') ? 'danger' : 'basic'\"\n                  />\n                  @if (FormHelpers.isInvalidControl(form, 'email')) {\n                    @if (form.controls.email.errors?.pattern) {\n                      <p class=\"caption status-danger mt-1\">\n                        {{ 'TOASTR.MESSAGE.EMAIL_SHOULD_BE_REAL' | translate }}\n                      </p>\n                    }\n                  }\n                </div>\n              </div>\n            </div>\n            <div class=\"row\">\n              <div class=\"col-8\">\n                <ngx-password-form-field\n                  id=\"password\"\n                  [placeholder]=\"'FORM.PASSWORD' | translate\"\n                  [label]=\"'FORM.PASSWORD' | translate\"\n                  [ctrl]=\"form.controls.password\"\n                  formControlName=\"password\"\n                ></ngx-password-form-field>\n                @if (FormHelpers.isInvalidControl(form, 'password')) {\n                  <p class=\"caption status-danger mt-1\">\n                    {{ 'TOASTR.MESSAGE.PASSWORD_REQUIRED' | translate }}\n                  </p>\n                }\n              </div>\n            </div>\n            <div class=\"row\">\n              @if (isShowRole) {\n                <div class=\"col\">\n                  <ngx-role-form-field\n                    id=\"role\"\n                    formControlName=\"role\"\n                    [placeholder]=\"'FORM.PLACEHOLDERS.ROLE' | translate\"\n                    [label]=\"'FORM.LABELS.ROLE' | translate\"\n                    [excludes]=\"excludes\"\n                    (selectedChange)=\"onSelectionChange($event)\"\n                  ></ngx-role-form-field>\n                </div>\n              }\n              @if (isEmployee) {\n                <div class=\"col\">\n                  <div class=\"form-group\">\n                    <label for=\"startedWork\" class=\"label\">{{ 'FORM.LABELS.START_DATE' | translate }}</label>\n                    <input\n                      [nbDatepicker]=\"startWorkOnDatepicker\"\n                      nbInput\n                      fullWidth\n                      [placeholder]=\"'FORM.PLACEHOLDERS.START_DATE' | translate\"\n                      formControlName=\"startedWorkOn\"\n                      />\n                      <nb-datepicker #startWorkOnDatepicker></nb-datepicker>\n                      @if (form.get('startedWorkOn').touched && form.get('startedWorkOn').value == null) {\n                        <div class=\"notes\">\n                          <p>\n                            {{ 'FORM.NOTIFICATIONS.STARTED_WORK_ON' | translate }}\n                          </p>\n                        </div>\n                      }\n                    </div>\n                  </div>\n                }\n                @if (isCandidate) {\n                  <div class=\"col\">\n                    <div class=\"form-group\">\n                      <label for=\"appliedDate\" class=\"label\">{{ 'FORM.LABELS.APPLIED_DATE' | translate }}</label>\n                      <input\n                        fullWidth\n                        id=\"appliedDate\"\n                        formControlName=\"appliedDate\"\n                        nbInput\n                        [nbDatepicker]=\"appliedDatePicker\"\n                        [placeholder]=\"'POP_UPS.PICK_DATE' | translate\"\n                        />\n                        <nb-datepicker #appliedDatePicker></nb-datepicker>\n                      </div>\n                    </div>\n                  }\n                  @if (isEmployee || isCandidate) {\n                    <div class=\"col\">\n                      <div class=\"form-group\">\n                        <label for=\"rejectDate\" class=\"label\">{{ 'FORM.LABELS.REJECT_DATE' | translate }}</label>\n                        <input\n                          fullWidth\n                          id=\"rejectDate\"\n                          formControlName=\"rejectDate\"\n                          nbInput\n                          [nbDatepicker]=\"rejectDatePicker\"\n                          [placeholder]=\"'POP_UPS.PICK_DATE' | translate\"\n                          [status]=\"FormHelpers.isInvalidControl(form, 'rejectDate') ? 'danger' : 'basic'\"\n                          />\n                          <nb-datepicker #rejectDatePicker></nb-datepicker>\n                        </div>\n                      </div>\n                    }\n                  </div>\n                  @if (isEmployee) {\n                    <div class=\"row\">\n                      <div class=\"col\">\n                        <div class=\"form-group\">\n                          <label for=\"offerDate\" class=\"label\">{{ 'FORM.LABELS.OFFER_DATE' | translate }}</label>\n                          <input\n                            fullWidth\n                            id=\"offerDate\"\n                            formControlName=\"offerDate\"\n                            nbInput\n                            [nbDatepicker]=\"offerDatePicker\"\n                            [placeholder]=\"'POP_UPS.PICK_DATE' | translate\"\n                            />\n                            <nb-datepicker #offerDatePicker></nb-datepicker>\n                          </div>\n                        </div>\n                        <div class=\"col\">\n                          <div class=\"form-group\">\n                            <label for=\"acceptDate\" class=\"label\">{{ 'FORM.LABELS.ACCEPT_DATE' | translate }}</label>\n                            <input\n                              fullWidth\n                              id=\"acceptDate\"\n                              formControlName=\"acceptDate\"\n                              nbInput\n                              [nbDatepicker]=\"acceptDatePicker\"\n                              [placeholder]=\"'POP_UPS.PICK_DATE' | translate\"\n                              [status]=\"FormHelpers.isInvalidControl(form, 'acceptDate') ? 'danger' : 'basic'\"\n                              />\n                              <nb-datepicker #acceptDatePicker></nb-datepicker>\n                            </div>\n                          </div>\n                        </div>\n                      }\n                      <div class=\"row\">\n                        <div class=\"col\">\n                          <div class=\"form-group\">\n                            <ga-tags-color-input\n                              [selectedTags]=\"form.get('tags').value\"\n                              (selectedTagsEvent)=\"selectedTagsHandler($event)\"\n                              [isOrgLevel]=\"true\"\n                              >\n                            </ga-tags-color-input>\n                          </div>\n                        </div>\n                      </div>\n                      @if (isCandidate) {\n                        <div class=\"row\">\n                          <div class=\"col\">\n                            <div class=\"form-group\">\n                              <label for=\"source\" class=\"label\">{{ 'FORM.LABELS.SOURCE' | translate }}</label>\n                              <input\n                                fullWidth\n                                id=\"source\"\n                                formControlName=\"source\"\n                                nbInput\n                                [placeholder]=\"'POP_UPS.SOURCE' | translate\"\n                                />\n                              </div>\n                            </div>\n                          </div>\n                        }\n                        @if (isShowRole) {\n                          @if (enableEmployee()) {\n                            <div class=\"row\">\n                              <div class=\"col-sm-12\">\n                                <div class=\"form-group\">\n                                  <nb-checkbox formControlName=\"featureAsEmployee\">\n                                    {{ 'FORM.LABELS.ENABLE_EMPLOYEE_FEATURES' | translate }}\n                                  </nb-checkbox>\n                                </div>\n                              </div>\n                            </div>\n                          }\n                        }\n                      </form>\n", styles: [".preview-img{padding-left:14px;padding-right:16px}.remove-icon div{cursor:pointer}.remove-icon{padding-left:7px;padding-right:7px;padding-top:2px}.notes{text-indent:1em;max-width:360px}.notes p{margin:0;color:#eac72d;font-size:.75rem;font-weight:300;line-height:initial}.image{position:relative;height:98px;width:130px;border-radius:var(--border-radius)!important;display:flex;align-items:center;justify-content:center;background-color:#7e7e8f1a}.image .img-rounded{object-fit:cover;max-height:98px;max-width:130px;border-radius:var(--border-radius)!important}.image .trash-icon{position:absolute;top:10px;right:10px}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "directive", type: i3.ɵNgNoValidate, selector: "form:not([ngNoForm]):not([ngNativeValidate])" }, { kind: "directive", type: i3.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i3.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i3.NgControlStatusGroup, selector: "[formGroupName],[formArrayName],[ngModelGroup],[formGroup],[formArray],form:not([ngNoForm]),[ngForm]" }, { kind: "directive", type: i3.PatternValidator, selector: "[pattern][formControlName],[pattern][formControl],[pattern][ngModel]", inputs: ["pattern"] }, { kind: "directive", type: i3.FormGroupDirective, selector: "[formGroup]", inputs: ["formGroup"], outputs: ["ngSubmit"], exportAs: ["ngForm"] }, { kind: "directive", type: i3.FormControlName, selector: "[formControlName]", inputs: ["formControlName", "disabled", "ngModel"], outputs: ["ngModelChange"] }, { kind: "component", type: i5.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "component", type: i5.NbCheckboxComponent, selector: "nb-checkbox", inputs: ["checked", "disabled", "status", "indeterminate"], outputs: ["checkedChange"] }, { kind: "directive", type: i5.NbDatepickerDirective, selector: "input[nbDatepicker]", inputs: ["nbDatepicker"] }, { kind: "component", type: i5.NbDatepickerComponent, selector: "nb-datepicker", inputs: ["date"], outputs: ["dateChange"] }, { kind: "component", type: i5.NbIconComponent, selector: "nb-icon", inputs: ["icon", "pack", "options", "status", "config"] }, { kind: "directive", type: i5.NbInputDirective, selector: "input[nbInput],textarea[nbInput]", inputs: ["fieldSize", "status", "shape", "fullWidth"] }, { kind: "directive", type: i6.AutocompleteOffDirective, selector: "[autocomplete-off]" }, { kind: "directive", type: i7.ImgDirective, selector: "img", inputs: ["type", "skipDefaultImage", "enableFadeIn"] }, { kind: "component", type: i8.FileUploaderInputComponent, selector: "ngx-file-uploader-input", inputs: ["placeholder", "locale", "fileUrl"], outputs: ["uploadedImageAsset", "uploadedImgUrl", "uploadedImgData"] }, { kind: "component", type: i9.TagsColorInputComponent, selector: "ga-tags-color-input", inputs: ["selectedTags", "isOrgLevel", "isTenantLevel", "multiple", "label", "addTag"], outputs: ["selectedTagsEvent"] }, { kind: "component", type: i10.PasswordFormFieldComponent, selector: "ngx-password-form-field", inputs: ["ctrl", "label", "placeholder", "icon", "id", "fieldSize", "ngClass", "autocomplete"], outputs: ["onInputChanged"] }, { kind: "component", type: i11.RoleFormFieldComponent, selector: "ngx-role-form-field", inputs: ["excludes", "id", "size", "placeholder", "label", "ctrl"], outputs: ["selectedChange"] }, { kind: "pipe", type: i1.TranslatePipe, name: "translate" }] }); }
};
BasicInfoFormComponent = BasicInfoFormComponent_1 = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [TranslateService,
        Location,
        UntypedFormBuilder,
        AuthService,
        RoleService,
        EmployeesService,
        CandidatesService,
        Store,
        ErrorHandlingService])
], BasicInfoFormComponent);
export { BasicInfoFormComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: BasicInfoFormComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-user-basic-info-form', standalone: false, template: "<form [formGroup]=\"form\" autocomplete-off no-validate>\n  <div class=\"row\">\n    <div class=\"col-3\">\n      <div class=\"form-group row\" [hidden]=\"form.get('imageUrl').invalid\">\n        <div class=\"col-sm-12\">\n          <div class=\"row preview-img\" [hidden]=\"!showImageMeta\">\n            <div class=\"image\">\n              <img\n                #imagePreview\n                [src]=\"form.get('imageUrl').value\"\n                alt=\"Invalid image\"\n                class=\"img-rounded\"\n                />\n                <button class=\"trash-icon\" nbButton status=\"basic\" size=\"small\" (click)=\"deleteImageUrl()\">\n                  <nb-icon\n                    status=\"danger\"\n                    [title]=\"'FORM.PLACEHOLDERS.REMOVE_IMAGE' | translate\"\n                    icon=\"trash-2-outline\"\n                    [title]=\"'FORM.PLACEHOLDERS.REMOVE_IMAGE' | translate\"\n                  ></nb-icon>\n                </button>\n              </div>\n            </div>\n            <div class=\"row preview-img\" [hidden]=\"showImageMeta\">\n              <div class=\"image\">\n                <i class=\"far fa-image\"></i>\n                <button class=\"trash-icon\" nbButton status=\"basic\" size=\"small\">\n                  <nb-icon\n                    status=\"danger\"\n                    [title]=\"'FORM.PLACEHOLDERS.REMOVE_IMAGE' | translate\"\n                    icon=\"trash-2-outline\"\n                  ></nb-icon>\n                </button>\n              </div>\n            </div>\n          </div>\n        </div>\n      </div>\n      <div class=\"col-9\">\n        <div class=\"row\">\n          <div class=\"col-sm-12\">\n            <div class=\"form-group\">\n              <label for=\"inputImageUrl\" class=\"label\">\n                {{ 'FORM.LABELS.IMAGE_URL' | translate }}\n              </label>\n              <ngx-file-uploader-input\n                id=\"inputImageUrl\"\n                [placeholder]=\"'FORM.PLACEHOLDERS.UPLOADER_PLACEHOLDER' | translate\"\n                [fileUrl]=\"form.get('imageUrl').value\"\n                (uploadedImageAsset)=\"updateImageAsset($event)\"\n                (uploadedImgUrl)=\"updateImageUrl($event)\"\n              ></ngx-file-uploader-input>\n            </div>\n            @if (form.get('imageUrl')?.value !== null && FormHelpers.isInvalidControl(form, 'imageUrl')) {\n              <p class=\"caption status-danger mt-1\">\n                {{ 'FORM.ERROR.INVALID_IMAGE_URL' | translate }}\n              </p>\n            }\n\n          </div>\n        </div>\n      </div>\n    </div>\n    <div class=\"row\">\n      <div class=\"col\">\n        <div class=\"form-group\">\n          <label for=\"firstName\" class=\"label\">\n            {{ 'FORM.LABELS.FIRST_NAME' | translate }}\n          </label>\n          <input\n            nbInput\n            type=\"text\"\n            id=\"firstName\"\n            fullWidth\n            [placeholder]=\"'FORM.PLACEHOLDERS.FIRST_NAME' | translate\"\n            formControlName=\"firstName\"\n            [status]=\"FormHelpers.isInvalidControl(form, 'firstName') ? 'danger' : 'basic'\"\n            />\n            @if (FormHelpers.isInvalidControl(form, 'firstName')) {\n              <p class=\"caption status-danger mt-1\">\n                {{ 'TOASTR.MESSAGE.NAME_REQUIRED' | translate }}\n              </p>\n            }\n          </div>\n        </div>\n        <div class=\"col\">\n          <div class=\"form-group\">\n            <label for=\"lastName\" class=\"label\">{{ 'FORM.LABELS.LAST_NAME' | translate }}</label>\n            <input\n              nbInput\n              type=\"text\"\n              id=\"lastName\"\n              fullWidth\n              [placeholder]=\"'FORM.PLACEHOLDERS.LAST_NAME' | translate\"\n              formControlName=\"lastName\"\n              [status]=\"FormHelpers.isInvalidControl(form, 'lastName') ? 'danger' : 'basic'\"\n              />\n            </div>\n          </div>\n        </div>\n        <div class=\"row\">\n          <div class=\"col-4\">\n            <div class=\"form-group\">\n              <label for=\"username\" class=\"label\">{{ 'FORM.USERNAME' | translate }}</label>\n              <input\n                nbInput\n                type=\"text\"\n                id=\"username\"\n                fullWidth\n                [placeholder]=\"'FORM.USERNAME' | translate\"\n                formControlName=\"username\"\n                [status]=\"FormHelpers.isInvalidControl(form, 'username') ? 'danger' : 'basic'\"\n                />\n              </div>\n              @if (FormHelpers.isInvalidControl(form, 'username')) {\n                <p class=\"caption status-danger mt-1\">\n                  {{ 'TOASTR.MESSAGE.NAME_REQUIRED' | translate }}\n                </p>\n              }\n            </div>\n            <div class=\"col-8\">\n              <div class=\"form-group\">\n                <label for=\"email\" class=\"label\">{{ 'FORM.EMAIL' | translate }}</label>\n                <input\n                  autofocus\n                  pattern=\".+@.+\\..+\"\n                  type=\"email\"\n                  #email\n                  nbInput\n                  type=\"email\"\n                  id=\"email\"\n                  fullWidth\n                  [placeholder]=\"'FORM.EMAIL' | translate\"\n                  formControlName=\"email\"\n                  [status]=\"FormHelpers.isInvalidControl(form, 'email') ? 'danger' : 'basic'\"\n                  />\n                  @if (FormHelpers.isInvalidControl(form, 'email')) {\n                    @if (form.controls.email.errors?.pattern) {\n                      <p class=\"caption status-danger mt-1\">\n                        {{ 'TOASTR.MESSAGE.EMAIL_SHOULD_BE_REAL' | translate }}\n                      </p>\n                    }\n                  }\n                </div>\n              </div>\n            </div>\n            <div class=\"row\">\n              <div class=\"col-8\">\n                <ngx-password-form-field\n                  id=\"password\"\n                  [placeholder]=\"'FORM.PASSWORD' | translate\"\n                  [label]=\"'FORM.PASSWORD' | translate\"\n                  [ctrl]=\"form.controls.password\"\n                  formControlName=\"password\"\n                ></ngx-password-form-field>\n                @if (FormHelpers.isInvalidControl(form, 'password')) {\n                  <p class=\"caption status-danger mt-1\">\n                    {{ 'TOASTR.MESSAGE.PASSWORD_REQUIRED' | translate }}\n                  </p>\n                }\n              </div>\n            </div>\n            <div class=\"row\">\n              @if (isShowRole) {\n                <div class=\"col\">\n                  <ngx-role-form-field\n                    id=\"role\"\n                    formControlName=\"role\"\n                    [placeholder]=\"'FORM.PLACEHOLDERS.ROLE' | translate\"\n                    [label]=\"'FORM.LABELS.ROLE' | translate\"\n                    [excludes]=\"excludes\"\n                    (selectedChange)=\"onSelectionChange($event)\"\n                  ></ngx-role-form-field>\n                </div>\n              }\n              @if (isEmployee) {\n                <div class=\"col\">\n                  <div class=\"form-group\">\n                    <label for=\"startedWork\" class=\"label\">{{ 'FORM.LABELS.START_DATE' | translate }}</label>\n                    <input\n                      [nbDatepicker]=\"startWorkOnDatepicker\"\n                      nbInput\n                      fullWidth\n                      [placeholder]=\"'FORM.PLACEHOLDERS.START_DATE' | translate\"\n                      formControlName=\"startedWorkOn\"\n                      />\n                      <nb-datepicker #startWorkOnDatepicker></nb-datepicker>\n                      @if (form.get('startedWorkOn').touched && form.get('startedWorkOn').value == null) {\n                        <div class=\"notes\">\n                          <p>\n                            {{ 'FORM.NOTIFICATIONS.STARTED_WORK_ON' | translate }}\n                          </p>\n                        </div>\n                      }\n                    </div>\n                  </div>\n                }\n                @if (isCandidate) {\n                  <div class=\"col\">\n                    <div class=\"form-group\">\n                      <label for=\"appliedDate\" class=\"label\">{{ 'FORM.LABELS.APPLIED_DATE' | translate }}</label>\n                      <input\n                        fullWidth\n                        id=\"appliedDate\"\n                        formControlName=\"appliedDate\"\n                        nbInput\n                        [nbDatepicker]=\"appliedDatePicker\"\n                        [placeholder]=\"'POP_UPS.PICK_DATE' | translate\"\n                        />\n                        <nb-datepicker #appliedDatePicker></nb-datepicker>\n                      </div>\n                    </div>\n                  }\n                  @if (isEmployee || isCandidate) {\n                    <div class=\"col\">\n                      <div class=\"form-group\">\n                        <label for=\"rejectDate\" class=\"label\">{{ 'FORM.LABELS.REJECT_DATE' | translate }}</label>\n                        <input\n                          fullWidth\n                          id=\"rejectDate\"\n                          formControlName=\"rejectDate\"\n                          nbInput\n                          [nbDatepicker]=\"rejectDatePicker\"\n                          [placeholder]=\"'POP_UPS.PICK_DATE' | translate\"\n                          [status]=\"FormHelpers.isInvalidControl(form, 'rejectDate') ? 'danger' : 'basic'\"\n                          />\n                          <nb-datepicker #rejectDatePicker></nb-datepicker>\n                        </div>\n                      </div>\n                    }\n                  </div>\n                  @if (isEmployee) {\n                    <div class=\"row\">\n                      <div class=\"col\">\n                        <div class=\"form-group\">\n                          <label for=\"offerDate\" class=\"label\">{{ 'FORM.LABELS.OFFER_DATE' | translate }}</label>\n                          <input\n                            fullWidth\n                            id=\"offerDate\"\n                            formControlName=\"offerDate\"\n                            nbInput\n                            [nbDatepicker]=\"offerDatePicker\"\n                            [placeholder]=\"'POP_UPS.PICK_DATE' | translate\"\n                            />\n                            <nb-datepicker #offerDatePicker></nb-datepicker>\n                          </div>\n                        </div>\n                        <div class=\"col\">\n                          <div class=\"form-group\">\n                            <label for=\"acceptDate\" class=\"label\">{{ 'FORM.LABELS.ACCEPT_DATE' | translate }}</label>\n                            <input\n                              fullWidth\n                              id=\"acceptDate\"\n                              formControlName=\"acceptDate\"\n                              nbInput\n                              [nbDatepicker]=\"acceptDatePicker\"\n                              [placeholder]=\"'POP_UPS.PICK_DATE' | translate\"\n                              [status]=\"FormHelpers.isInvalidControl(form, 'acceptDate') ? 'danger' : 'basic'\"\n                              />\n                              <nb-datepicker #acceptDatePicker></nb-datepicker>\n                            </div>\n                          </div>\n                        </div>\n                      }\n                      <div class=\"row\">\n                        <div class=\"col\">\n                          <div class=\"form-group\">\n                            <ga-tags-color-input\n                              [selectedTags]=\"form.get('tags').value\"\n                              (selectedTagsEvent)=\"selectedTagsHandler($event)\"\n                              [isOrgLevel]=\"true\"\n                              >\n                            </ga-tags-color-input>\n                          </div>\n                        </div>\n                      </div>\n                      @if (isCandidate) {\n                        <div class=\"row\">\n                          <div class=\"col\">\n                            <div class=\"form-group\">\n                              <label for=\"source\" class=\"label\">{{ 'FORM.LABELS.SOURCE' | translate }}</label>\n                              <input\n                                fullWidth\n                                id=\"source\"\n                                formControlName=\"source\"\n                                nbInput\n                                [placeholder]=\"'POP_UPS.SOURCE' | translate\"\n                                />\n                              </div>\n                            </div>\n                          </div>\n                        }\n                        @if (isShowRole) {\n                          @if (enableEmployee()) {\n                            <div class=\"row\">\n                              <div class=\"col-sm-12\">\n                                <div class=\"form-group\">\n                                  <nb-checkbox formControlName=\"featureAsEmployee\">\n                                    {{ 'FORM.LABELS.ENABLE_EMPLOYEE_FEATURES' | translate }}\n                                  </nb-checkbox>\n                                </div>\n                              </div>\n                            </div>\n                          }\n                        }\n                      </form>\n", styles: [".preview-img{padding-left:14px;padding-right:16px}.remove-icon div{cursor:pointer}.remove-icon{padding-left:7px;padding-right:7px;padding-top:2px}.notes{text-indent:1em;max-width:360px}.notes p{margin:0;color:#eac72d;font-size:.75rem;font-weight:300;line-height:initial}.image{position:relative;height:98px;width:130px;border-radius:var(--border-radius)!important;display:flex;align-items:center;justify-content:center;background-color:#7e7e8f1a}.image .img-rounded{object-fit:cover;max-height:98px;max-width:130px;border-radius:var(--border-radius)!important}.image .trash-icon{position:absolute;top:10px;right:10px}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }], ctorParameters: () => [{ type: i1.TranslateService }, { type: i2.Location }, { type: i3.UntypedFormBuilder }, { type: i4.AuthService }, { type: i4.RoleService }, { type: i4.EmployeesService }, { type: i4.CandidatesService }, { type: i4.Store }, { type: i4.ErrorHandlingService }], propDecorators: { selectedTags: [{
                type: Input
            }], isCandidate: [{
                type: Input
            }], isEmployee: [{
                type: Input
            }], isShowRole: [{
                type: Input
            }], imagePreviewElement: [{
                type: ViewChild,
                args: ['imagePreview']
            }] } });
//# sourceMappingURL=basic-info-form.component.js.map