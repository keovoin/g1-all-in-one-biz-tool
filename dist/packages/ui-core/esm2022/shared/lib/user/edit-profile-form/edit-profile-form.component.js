var EditProfileFormComponent_1;
import { __decorate, __metadata } from "tslib";
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Subject, filter, debounceTime, tap, firstValueFrom } from 'rxjs';
import { DEFAULT_TIME_FORMATS } from '@gauzy/constants';
import { RolesEnum } from '@gauzy/contracts';
import { patterns } from '@gauzy/constants';
import { AuthService, EmailValidator, ErrorHandlingService, MatchValidator, RoleService, Store, ToastrService, UsersService } from '@gauzy/ui-core/core';
import { FormHelpers } from '../../forms/helpers';
import * as i0 from "@angular/core";
import * as i1 from "@angular/forms";
import * as i2 from "@gauzy/ui-core/core";
import * as i3 from "@angular/common";
import * as i4 from "@nebular/theme";
import * as i5 from "@ng-select/ng-select";
import * as i6 from "../../tags/tags-color-input/tags-color-input.component";
import * as i7 from "../../image-uploader/image-uploader.component";
import * as i8 from "../../language/language-selector/language-selector.component";
import * as i9 from "../../directives/autocomplete-off.directive";
import * as i10 from "../../directives/img.directive";
import * as i11 from "../forms/fields/password/password.component";
import * as i12 from "../forms/fields/role/role.component";
import * as i13 from "../../table-components/role/role.component";
import * as i14 from "../../modules/selectors/timezone-selector/timezone-selector.component";
import * as i15 from "../forms/fields/phone/phone.component";
import * as i16 from "@ngx-translate/core";
let EditProfileFormComponent = class EditProfileFormComponent {
    static { EditProfileFormComponent_1 = this; }
    get selectedUser() {
        return this._selectedUser;
    }
    set selectedUser(value) {
        this._selectedUser = value;
    }
    get allowRoleChange() {
        return this._allowRoleChange;
    }
    set allowRoleChange(value) {
        this._allowRoleChange = value;
    }
    static buildForm(fb) {
        return fb.group({
            firstName: [],
            lastName: [],
            email: [null, [Validators.required, Validators.email]],
            imageUrl: [{ value: null, disabled: true }],
            imageId: [],
            password: [],
            repeatPassword: [],
            role: [],
            tags: [],
            preferredLanguage: [],
            timeZone: [],
            timeFormat: [],
            phoneNumber: []
        }, {
            validators: [MatchValidator.mustMatch('password', 'repeatPassword')]
        });
    }
    constructor(_fb, _authService, _userService, _store, _toastrService, _errorHandler, _roleService) {
        this._fb = _fb;
        this._authService = _authService;
        this._userService = _userService;
        this._store = _store;
        this._toastrService = _toastrService;
        this._errorHandler = _errorHandler;
        this._roleService = _roleService;
        this.FormHelpers = FormHelpers;
        this.listOfTimeFormats = DEFAULT_TIME_FORMATS;
        this.user$ = new Subject();
        /*
         * Getter & Setter for allow role change
         */
        this._allowRoleChange = false;
        this.userSubmitted = new EventEmitter();
        this.form = EditProfileFormComponent_1.buildForm(this._fb);
        this.excludes = [];
    }
    async ngOnInit() {
        this.excludeRoles();
        this.user$
            .pipe(debounceTime(100), tap(() => this.getUserProfile()), untilDestroyed(this))
            .subscribe();
        this._store.user$
            .pipe(filter((user) => !!user), tap((user) => (this.user = user)), tap(() => this.user$.next(true)), untilDestroyed(this))
            .subscribe();
    }
    /**
     * Excludes roles based on the user's permissions.
     * Adds the SUPER_ADMIN role to the excludes list if the user lacks SUPER_ADMIN privileges.
     */
    async excludeRoles() {
        try {
            // Check if the user has the SUPER_ADMIN role
            const hasSuperAdminRole = await firstValueFrom(this._authService.hasRole([RolesEnum.SUPER_ADMIN]));
            // Add SUPER_ADMIN to the excludes list if the user lacks the role
            if (!hasSuperAdminRole) {
                this.excludes.push(RolesEnum.SUPER_ADMIN);
            }
        }
        catch (error) {
            this._errorHandler?.handleError(error); // Optional error handling if applicable
        }
    }
    /**
     * Retrieves the profile of the selected user or the current user.
     * Fetches user details including tags and role, and updates the form.
     */
    async getUserProfile() {
        try {
            const relations = ['tags', 'role'];
            let user;
            // If a different user is selected (admin editing another user), use getUserById which requires ORG_USERS_VIEW.
            // Otherwise load the current user's own profile via /user/me which has no permission restriction.
            if (this.selectedUser?.id && this.selectedUser.id !== this.user?.id) {
                user = await this._userService.getUserById(this.selectedUser.id, relations);
            }
            else {
                user = await this._userService.getMe(relations);
            }
            // Patch the form with the retrieved user data
            this._patchForm({ ...user });
        }
        catch (error) {
            this._errorHandler?.handleError(error); // Handle errors gracefully
        }
    }
    handleImageUploadError(error) {
        this._toastrService.danger(error);
    }
    async updateImageAsset(image) {
        this._store.user = {
            ...this._store.user,
            imageId: image.id
        };
        let request = {
            imageId: image.id
        };
        if (this.allowRoleChange) {
            const { tenantId } = this._store.user;
            const role = await firstValueFrom(this._roleService.getRoleByOptions({
                name: this.form.get('role').value.name,
                tenantId
            }));
            request = {
                ...request,
                role
            };
        }
        try {
            await this._userService
                .update(this.selectedUser ? this.selectedUser.id : this._store.userId, request)
                .then((res) => {
                try {
                    if (res) {
                        this._store.user = {
                            ...this._store.user,
                            imageUrl: res.imageUrl
                        };
                    }
                    this._toastrService.success('TOASTR.MESSAGE.IMAGE_UPDATED');
                }
                catch (error) {
                    console.log('Error while uploading profile avatar', error);
                }
            });
        }
        catch (error) {
            this._errorHandler.handleError(error);
        }
    }
    async submitForm() {
        const { timeFormat, timeZone } = this.form.value;
        const { email, firstName, lastName, tags, preferredLanguage, password, phoneNumber } = this.form.value;
        if (!EmailValidator.isValid(email, patterns.email)) {
            this._toastrService.error('TOASTR.MESSAGE.EMAIL_SHOULD_BE_REAL');
            return;
        }
        let request = {
            email,
            firstName,
            lastName,
            tags,
            preferredLanguage,
            timeZone,
            timeFormat,
            phoneNumber
        };
        if (password) {
            request = {
                ...request,
                hash: password
            };
        }
        if (this.allowRoleChange) {
            const { tenantId } = this._store.user;
            const role = await firstValueFrom(this._roleService.getRoleByOptions({
                name: this.form.get('role').value.name,
                tenantId
            }));
            request = {
                ...request,
                role
            };
        }
        try {
            await this._userService
                .update(this.selectedUser ? this.selectedUser.id : this._store.userId, request)
                .then(() => {
                if ((this.selectedUser ? this.selectedUser.id : this._store.userId) === this._store.user.id) {
                    this._store.user.email = request.email;
                }
                this._toastrService.success('TOASTR.MESSAGE.PROFILE_UPDATED');
                this.userSubmitted.emit();
                /**
                 * selectedUser is null for edit profile and populated in User edit
                 * Update app language when current user's profile is modified.
                 */
                if (this.selectedUser && this.selectedUser.id !== this._store.userId) {
                    return;
                }
                this._store.preferredLanguage = preferredLanguage;
            });
        }
        catch (error) {
            this._errorHandler.handleError(error);
        }
    }
    _patchForm(user) {
        if (!user) {
            return;
        }
        this.form.patchValue({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            imageUrl: user.imageUrl,
            imageId: user.imageId,
            role: user.role,
            tags: user.tags,
            preferredLanguage: user.preferredLanguage,
            timeZone: user.timeZone,
            timeFormat: user.timeFormat,
            phoneNumber: user.phoneNumber
        });
        this.role = user.role;
    }
    /**
     *
     * @param tags
     */
    selectedTagsHandler(tags) {
        this.form.get('tags').setValue(tags);
        this.form.get('tags').updateValueAndValidity();
    }
    /**
     * On Selection Change
     * @param role
     */
    onSelectionChange(role) {
        this.form.get('role').setValue(role);
        this.form.get('role').updateValueAndValidity();
    }
    ngOnDestroy() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EditProfileFormComponent, deps: [{ token: i1.UntypedFormBuilder }, { token: i2.AuthService }, { token: i2.UsersService }, { token: i2.Store }, { token: i2.ToastrService }, { token: i2.ErrorHandlingService }, { token: i2.RoleService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: EditProfileFormComponent, isStandalone: false, selector: "ngx-profile", inputs: { selectedUser: "selectedUser", allowRoleChange: "allowRoleChange" }, outputs: { userSubmitted: "userSubmitted" }, ngImport: i0, template: "<nb-card class=\"card-scroll\">\n\t<nb-card-body>\n\t\t<div class=\"content\">\n\t\t\t<div class=\"employee-container\">\n\t\t\t\t<div class=\"employee-photo\">\n\t\t\t\t\t<ng-container [ngTemplateOutlet]=\"imageUploaderTemplate\"></ng-container>\n\t\t\t\t</div>\n\t\t\t\t@if (role) {\n\t\t\t\t\t<gauzy-role class=\"badge\" [value]=\"role\"></gauzy-role>\n\t\t\t\t}\n\t\t\t</div>\n\t\t\t<div class=\"employee-form\">\n\t\t\t\t<form [formGroup]=\"form\" autocomplete-off>\n\t\t\t\t\t<div class=\"row\">\n\t\t\t\t\t\t<div class=\"col\">\n\t\t\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t\t\t<label\n\t\t\t\t\t\t\t\t\tclass=\"label\"\n\t\t\t\t\t\t\t\t\tfor=\"firstName\"\n\t\t\t\t\t\t\t\t\t[innerText]=\"'PROFILE_PAGE.FIRST_NAME' | translate\"\n\t\t\t\t\t\t\t\t></label>\n\t\t\t\t\t\t\t\t<input fullWidth id=\"firstName\" type=\"text\" nbInput formControlName=\"firstName\" />\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\"col\">\n\t\t\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t\t\t<label\n\t\t\t\t\t\t\t\t\tfor=\"lastName\"\n\t\t\t\t\t\t\t\t\tclass=\"label\"\n\t\t\t\t\t\t\t\t\t[innerText]=\"'PROFILE_PAGE.LAST_NAME' | translate\"\n\t\t\t\t\t\t\t\t></label>\n\t\t\t\t\t\t\t\t<input fullWidth id=\"lastName\" type=\"text\" nbInput formControlName=\"lastName\" />\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"row\">\n\t\t\t\t\t\t<div class=\"col\">\n\t\t\t\t\t\t\t<ngx-password-form-field\n\t\t\t\t\t\t\t\tid=\"'password'\"\n\t\t\t\t\t\t\t\t[placeholder]=\"'PROFILE_PAGE.PASSWORD' | translate\"\n\t\t\t\t\t\t\t\t[label]=\"'PROFILE_PAGE.PASSWORD' | translate\"\n\t\t\t\t\t\t\t\t[ctrl]=\"form.get('password')\"\n\t\t\t\t\t\t\t\tformControlName=\"password\"\n\t\t\t\t\t\t\t\t[autocomplete]=\"'new-password'\"\n\t\t\t\t\t\t\t></ngx-password-form-field>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\"col\">\n\t\t\t\t\t\t\t<ngx-password-form-field\n\t\t\t\t\t\t\t\t[id]=\"'reset-password'\"\n\t\t\t\t\t\t\t\t[placeholder]=\"'PROFILE_PAGE.REPEAT_PASSWORD' | translate\"\n\t\t\t\t\t\t\t\t[label]=\"'PROFILE_PAGE.REPEAT_PASSWORD' | translate\"\n\t\t\t\t\t\t\t\t[ctrl]=\"form.get('repeatPassword')\"\n\t\t\t\t\t\t\t\tformControlName=\"repeatPassword\"\n\t\t\t\t\t\t\t\t[autocomplete]=\"'new-password'\"\n\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t@if (FormHelpers.isInvalidControl(form, 'repeatPassword')) {\n\t\t\t\t\t\t\t\t\t<div class=\"invalid-feedback d-block\">\n\t\t\t\t\t\t\t\t\t\t@if (form.get('repeatPassword').errors.mustMatch) {\n\t\t\t\t\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t\t\t\t\t{{ 'PROFILE_PAGE.VALIDATION.PASSWORDS_DO_NOT_MATCH' | translate }}\n\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t</ngx-password-form-field>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"row\">\n\t\t\t\t\t\t<div class=\"col-6\">\n\t\t\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t\t\t<label class=\"label\" for=\"email\" [innerText]=\"'PROFILE_PAGE.EMAIL' | translate\"></label>\n\t\t\t\t\t\t\t\t<input\n\t\t\t\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t\t\t\tid=\"email\"\n\t\t\t\t\t\t\t\t\ttype=\"email\"\n\t\t\t\t\t\t\t\t\tnbInput\n\t\t\t\t\t\t\t\t\tformControlName=\"email\"\n\t\t\t\t\t\t\t\t\t[status]=\"FormHelpers.isInvalidControl(form, 'email') ? 'danger' : 'basic'\"\n\t\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t\t\t@if (FormHelpers.isInvalidControl(form, 'email')) {\n\t\t\t\t\t\t\t\t\t<div class=\"invalid-feedback d-block\">\n\t\t\t\t\t\t\t\t\t\t@if (form.get('email').errors.required) {\n\t\t\t\t\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t\t\t\t\t{{ 'PROFILE_PAGE.VALIDATION.EMAIL_REQUIRED' | translate }}\n\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\"col-6\">\n\t\t\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t\t\t<ga-tags-color-input\n\t\t\t\t\t\t\t\t\t[selectedTags]=\"form.get('tags').value\"\n\t\t\t\t\t\t\t\t\t(selectedTagsEvent)=\"selectedTagsHandler($event)\"\n\t\t\t\t\t\t\t\t\t[isTenantLevel]=\"true\"\n\t\t\t\t\t\t\t\t></ga-tags-color-input>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"row\">\n\t\t\t\t\t\t@if (allowRoleChange) {\n\t\t\t\t\t\t\t<div class=\"col-sm-6\">\n\t\t\t\t\t\t\t\t<ngx-role-form-field\n\t\t\t\t\t\t\t\t\t[id]=\"'role'\"\n\t\t\t\t\t\t\t\t\t[placeholder]=\"'FORM.PLACEHOLDERS.ROLE' | translate\"\n\t\t\t\t\t\t\t\t\t[label]=\"'FORM.LABELS.ROLE' | translate\"\n\t\t\t\t\t\t\t\t\tformControlName=\"role\"\n\t\t\t\t\t\t\t\t\t(selectedChange)=\"onSelectionChange($event)\"\n\t\t\t\t\t\t\t\t\t[excludes]=\"excludes\"\n\t\t\t\t\t\t\t\t></ngx-role-form-field>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t}\n\t\t\t\t\t\t<div class=\"col-sm-6\">\n\t\t\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t\t\t<label\n\t\t\t\t\t\t\t\t\tfor=\"preferredLanguage\"\n\t\t\t\t\t\t\t\t\tclass=\"label\"\n\t\t\t\t\t\t\t\t\t[innerText]=\"'FORM.LABELS.PREFERRED_LANGUAGE' | translate\"\n\t\t\t\t\t\t\t\t></label>\n\t\t\t\t\t\t\t\t<ngx-language-selector\n\t\t\t\t\t\t\t\t\t[placeholder]=\"'FORM.PLACEHOLDERS.PREFERRED_LANGUAGE' | translate\"\n\t\t\t\t\t\t\t\t\tclass=\"d-block\"\n\t\t\t\t\t\t\t\t\t[template]=\"'ng-select'\"\n\t\t\t\t\t\t\t\t\tformControlName=\"preferredLanguage\"\n\t\t\t\t\t\t\t\t></ngx-language-selector>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\"col-sm-6\">\n\t\t\t\t\t\t\t<ga-timezone-selector formControlName=\"timeZone\"></ga-timezone-selector>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\"col-sm-6\">\n\t\t\t\t\t\t\t<ngx-phone-form-input formControlName=\"phoneNumber\"></ngx-phone-form-input>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\"col-6\">\n\t\t\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t\t\t<label class=\"label\" for=\"timeZone\">\n\t\t\t\t\t\t\t\t\t{{ 'FORM.LABELS.TIME_FORMAT' | translate }}\n\t\t\t\t\t\t\t\t</label>\n\t\t\t\t\t\t\t\t<ng-select\n\t\t\t\t\t\t\t\t\tid=\"timeFormat\"\n\t\t\t\t\t\t\t\t\tappendTo=\"body\"\n\t\t\t\t\t\t\t\t\t[(items)]=\"listOfTimeFormats\"\n\t\t\t\t\t\t\t\t\t[placeholder]=\"'FORM.PLACEHOLDERS.TIME_FORMAT' | translate\"\n\t\t\t\t\t\t\t\t\t[searchable]=\"false\"\n\t\t\t\t\t\t\t\t\t[clearable]=\"false\"\n\t\t\t\t\t\t\t\t\tformControlName=\"timeFormat\"\n\t\t\t\t\t\t\t\t></ng-select>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"actions\">\n\t\t\t\t\t\t<button [disabled]=\"form.invalid\" (click)=\"submitForm()\" nbButton status=\"success\">\n\t\t\t\t\t\t\t{{ 'PROFILE_PAGE.SAVE' | translate }}\n\t\t\t\t\t\t</button>\n\t\t\t\t\t</div>\n\t\t\t\t</form>\n\t\t\t</div>\n\t\t</div>\n\t</nb-card-body>\n</nb-card>\n\n<ng-template #imageUploaderTemplate>\n\t<ngx-image-uploader\n\t\t(changeHoverState)=\"hoverState = $event\"\n\t\t(uploadedImageAsset)=\"updateImageAsset($event)\"\n\t\t(uploadImageAssetError)=\"handleImageUploadError($event)\"\n\t></ngx-image-uploader>\n\t<svg\n\t\txmlns=\"http://www.w3.org/2000/svg\"\n\t\txmlns:xlink=\"http://www.w3.org/1999/xlink\"\n\t\twidth=\"68\"\n\t\theight=\"68\"\n\t\tviewBox=\"0 0 68 68\"\n\t\t[style.opacity]=\"hoverState ? '1' : '0.3'\"\n\t>\n\t\t<defs>\n\t\t\t<path\n\t\t\t\tid=\"a\"\n\t\t\t\td=\"M28.667 31.333a2 2 0 1 0-.002-4.001 2 2 0 0 0 .002 4.001m13.333 12H26.748l9.34-7.793c.328-.279.923-.277 1.244-.001l6.001 5.12V42c0 .736-.597 1.333-1.333 1.333M26 24.667h16c.736 0 1.333.597 1.333 1.333v11.152l-4.27-3.643c-1.32-1.122-3.386-1.122-4.694-.008l-9.702 8.096V26c0-.736.597-1.333 1.333-1.333M42 22H26c-2.205 0-4 1.795-4 4v16c0 2.205 1.795 4 4 4h16c2.205 0 4-1.795 4-4V26c0-2.205-1.795-4-4-4\"\n\t\t\t/>\n\t\t</defs>\n\t\t<g fill=\"none\" fill-rule=\"evenodd\">\n\t\t\t<circle cx=\"34\" cy=\"34\" r=\"34\" fill=\"#0091FF\" opacity=\".3\" />\n\t\t\t<circle cx=\"34\" cy=\"34\" r=\"26\" fill=\"#0091FF\" opacity=\".9\" />\n\t\t\t<use fill=\"#FFF\" fill-rule=\"nonzero\" xlink:href=\"#a\" />\n\t\t</g>\n\t</svg>\n\t<div class=\"image-overlay\" [style.opacity]=\"hoverState ? '0.2' : '0'\"></div>\n\t@if (!!form) {\n\t\t<img\n\t\t\t[src]=\"form.get('imageUrl').value\"\n\t\t\talt=\"Profile Photo\"\n\t\t\t(mouseenter)=\"hoverState = true\"\n\t\t\t(mouseleave)=\"hoverState = false\"\n\t\t/>\n\t}\n</ng-template>\n", styles: ["@charset \"UTF-8\";:host nb-card{background-color:var(--gauzy-card-2)}:host nb-card ::ng-deep input,:host nb-card ::ng-deep nb-select.appearance-outline.status-basic .select-button,:host nb-card ::ng-deep .ng-select .ng-select-container{background-color:var(--gauzy-card-1)!important;border:none;min-height:42px!important}:host nb-card ::ng-deep .ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-placeholder,:host nb-card ::ng-deep .ng-select.ng-select-single .ng-select-container .ng-value-container .ng-input{top:unset!important}:host nb-card ::ng-deep label,:host nb-card ::ng-deep .label{font-size:var(--text-label-font-size);font-weight:600;line-height:.8125rem;letter-spacing:-.01em;color:var(--gauzy-text-color-2)}:host nb-card ::ng-deep textarea{background-color:var(--gauzy-card-1)!important;border:none}:host nb-card ::ng-deep .ng-select .ng-select-container input,:host nb-card ::ng-deep nb-tag-list input{background-color:unset!important}:host nb-card ::ng-deep ngx-image-uploader input{height:100%!important}:host nb-card-body{padding:50px 70px}@media only screen and (max-width:1532px){:host nb-card-body{padding:30px 40px}}:host nb-card-body .navigate{display:flex;margin-bottom:35px;cursor:pointer}:host nb-card-body .navigate span{margin-left:7px;font-size:14px;color:#2a2c39}:host nb-card-body .content{display:flex}:host nb-card-body .employee-container{position:relative;display:flex;flex-direction:column;transition:transform .15s ease-in-out}[dir=rtl] :host nb-card-body .employee-container{padding-left:70px}[dir=ltr] :host nb-card-body .employee-container{padding-right:70px}[dir=rtl] :host nb-card-body .employee-container{margin-left:70px}[dir=ltr] :host nb-card-body .employee-container{margin-right:70px}[dir=rtl] :host nb-card-body .employee-container{border-left:1px solid rgba(0,0,0,.1)}[dir=ltr] :host nb-card-body .employee-container{border-right:1px solid rgba(0,0,0,.1)}:host nb-card-body .employee-container .employee-photo{width:fit-content;height:200px;position:relative}:host nb-card-body .employee-container .employee-photo div{pointer-events:none;background:#000;position:absolute;height:100%;width:100%;border-radius:13px}:host nb-card-body .employee-container .employee-photo img{width:200px;height:200px;border-radius:13px;object-fit:cover}:host nb-card-body .employee-container .employee-photo input{width:100%;height:100%!important;opacity:0;position:absolute;z-index:3;cursor:pointer}:host nb-card-body .employee-container .employee-photo svg{z-index:2;transition:opacity .2s ease-in;opacity:.3;position:absolute;top:calc(50% - 34px);left:calc(50% - 34px)}:host nb-card-body .employee-container .employee-photo svg g circle{fill:var(--text-primary-color)}:host nb-card-body .badge{position:relative;margin-top:10px;display:flex}:host nb-card-body .employee-form{width:60%}:host nb-card-body .actions{display:flex;justify-content:flex-start;width:100%;margin-top:30px}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "directive", type: i3.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: i1.ɵNgNoValidate, selector: "form:not([ngNoForm]):not([ngNativeValidate])" }, { kind: "directive", type: i1.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i1.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i1.NgControlStatusGroup, selector: "[formGroupName],[formArrayName],[ngModelGroup],[formGroup],[formArray],form:not([ngNoForm]),[ngForm]" }, { kind: "directive", type: i1.FormGroupDirective, selector: "[formGroup]", inputs: ["formGroup"], outputs: ["ngSubmit"], exportAs: ["ngForm"] }, { kind: "directive", type: i1.FormControlName, selector: "[formControlName]", inputs: ["formControlName", "disabled", "ngModel"], outputs: ["ngModelChange"] }, { kind: "component", type: i4.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "component", type: i4.NbCardComponent, selector: "nb-card", inputs: ["size", "status", "accent"] }, { kind: "component", type: i4.NbCardBodyComponent, selector: "nb-card-body" }, { kind: "directive", type: i4.NbInputDirective, selector: "input[nbInput],textarea[nbInput]", inputs: ["fieldSize", "status", "shape", "fullWidth"] }, { kind: "component", type: i5.NgSelectComponent, selector: "ng-select", inputs: ["ariaLabelDropdown", "ariaLabel", "markFirst", "placeholder", "fixedPlaceholder", "notFoundText", "typeToSearchText", "preventToggleOnRightClick", "addTagText", "loadingText", "clearAllText", "dropdownPosition", "appendTo", "outsideClickEvent", "loading", "closeOnSelect", "hideSelected", "selectOnTab", "openOnEnter", "maxSelectedItems", "groupBy", "groupValue", "bufferAmount", "virtualScroll", "selectableGroup", "tabFocusOnClearButton", "selectableGroupAsModel", "searchFn", "trackByFn", "clearOnBackspace", "labelForId", "inputAttrs", "tabIndex", "readonly", "searchWhileComposing", "minTermLength", "editableSearchTerm", "ngClass", "typeahead", "multiple", "addTag", "searchable", "clearable", "clearKeepsDisabledOptions", "deselectOnClick", "clearSearchOnAdd", "compareWith", "keyDownFn", "bindLabel", "bindValue", "appearance", "isOpen", "items"], outputs: ["bindLabelChange", "bindValueChange", "appearanceChange", "isOpenChange", "itemsChange", "blur", "focus", "change", "open", "close", "search", "clear", "add", "remove", "scroll", "scrollToEnd"], exportAs: ["ngSelect"] }, { kind: "component", type: i6.TagsColorInputComponent, selector: "ga-tags-color-input", inputs: ["selectedTags", "isOrgLevel", "isTenantLevel", "multiple", "label", "addTag"], outputs: ["selectedTagsEvent"] }, { kind: "component", type: i7.ImageUploaderComponent, selector: "ngx-image-uploader", inputs: ["styles", "folder"], outputs: ["changeHoverState", "uploadedImageAsset", "uploadImageAssetError"] }, { kind: "component", type: i8.LanguageSelectorComponent, selector: "ngx-language-selector", inputs: ["placeholder", "clearable", "addTag", "selectedLanguageCode", "selectBy", "labelForId", "template", "size"], outputs: ["selectedLanguageEvent"] }, { kind: "directive", type: i9.AutocompleteOffDirective, selector: "[autocomplete-off]" }, { kind: "directive", type: i10.ImgDirective, selector: "img", inputs: ["type", "skipDefaultImage", "enableFadeIn"] }, { kind: "component", type: i11.PasswordFormFieldComponent, selector: "ngx-password-form-field", inputs: ["ctrl", "label", "placeholder", "icon", "id", "fieldSize", "ngClass", "autocomplete"], outputs: ["onInputChanged"] }, { kind: "component", type: i12.RoleFormFieldComponent, selector: "ngx-role-form-field", inputs: ["excludes", "id", "size", "placeholder", "label", "ctrl"], outputs: ["selectedChange"] }, { kind: "component", type: i13.RoleComponent, selector: "gauzy-role", inputs: ["value", "status", "role"] }, { kind: "component", type: i14.TimeZoneSelectorComponent, selector: "ga-timezone-selector", inputs: ["timeZone"], outputs: ["onChanged"] }, { kind: "component", type: i15.PhoneFormInputComponent, selector: "ngx-phone-form-input", inputs: ["phoneNumber", "placeholder"], outputs: ["onChanged"] }, { kind: "pipe", type: i16.TranslatePipe, name: "translate" }] }); }
};
EditProfileFormComponent = EditProfileFormComponent_1 = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [UntypedFormBuilder,
        AuthService,
        UsersService,
        Store,
        ToastrService,
        ErrorHandlingService,
        RoleService])
], EditProfileFormComponent);
export { EditProfileFormComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EditProfileFormComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-profile', standalone: false, template: "<nb-card class=\"card-scroll\">\n\t<nb-card-body>\n\t\t<div class=\"content\">\n\t\t\t<div class=\"employee-container\">\n\t\t\t\t<div class=\"employee-photo\">\n\t\t\t\t\t<ng-container [ngTemplateOutlet]=\"imageUploaderTemplate\"></ng-container>\n\t\t\t\t</div>\n\t\t\t\t@if (role) {\n\t\t\t\t\t<gauzy-role class=\"badge\" [value]=\"role\"></gauzy-role>\n\t\t\t\t}\n\t\t\t</div>\n\t\t\t<div class=\"employee-form\">\n\t\t\t\t<form [formGroup]=\"form\" autocomplete-off>\n\t\t\t\t\t<div class=\"row\">\n\t\t\t\t\t\t<div class=\"col\">\n\t\t\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t\t\t<label\n\t\t\t\t\t\t\t\t\tclass=\"label\"\n\t\t\t\t\t\t\t\t\tfor=\"firstName\"\n\t\t\t\t\t\t\t\t\t[innerText]=\"'PROFILE_PAGE.FIRST_NAME' | translate\"\n\t\t\t\t\t\t\t\t></label>\n\t\t\t\t\t\t\t\t<input fullWidth id=\"firstName\" type=\"text\" nbInput formControlName=\"firstName\" />\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\"col\">\n\t\t\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t\t\t<label\n\t\t\t\t\t\t\t\t\tfor=\"lastName\"\n\t\t\t\t\t\t\t\t\tclass=\"label\"\n\t\t\t\t\t\t\t\t\t[innerText]=\"'PROFILE_PAGE.LAST_NAME' | translate\"\n\t\t\t\t\t\t\t\t></label>\n\t\t\t\t\t\t\t\t<input fullWidth id=\"lastName\" type=\"text\" nbInput formControlName=\"lastName\" />\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"row\">\n\t\t\t\t\t\t<div class=\"col\">\n\t\t\t\t\t\t\t<ngx-password-form-field\n\t\t\t\t\t\t\t\tid=\"'password'\"\n\t\t\t\t\t\t\t\t[placeholder]=\"'PROFILE_PAGE.PASSWORD' | translate\"\n\t\t\t\t\t\t\t\t[label]=\"'PROFILE_PAGE.PASSWORD' | translate\"\n\t\t\t\t\t\t\t\t[ctrl]=\"form.get('password')\"\n\t\t\t\t\t\t\t\tformControlName=\"password\"\n\t\t\t\t\t\t\t\t[autocomplete]=\"'new-password'\"\n\t\t\t\t\t\t\t></ngx-password-form-field>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\"col\">\n\t\t\t\t\t\t\t<ngx-password-form-field\n\t\t\t\t\t\t\t\t[id]=\"'reset-password'\"\n\t\t\t\t\t\t\t\t[placeholder]=\"'PROFILE_PAGE.REPEAT_PASSWORD' | translate\"\n\t\t\t\t\t\t\t\t[label]=\"'PROFILE_PAGE.REPEAT_PASSWORD' | translate\"\n\t\t\t\t\t\t\t\t[ctrl]=\"form.get('repeatPassword')\"\n\t\t\t\t\t\t\t\tformControlName=\"repeatPassword\"\n\t\t\t\t\t\t\t\t[autocomplete]=\"'new-password'\"\n\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t@if (FormHelpers.isInvalidControl(form, 'repeatPassword')) {\n\t\t\t\t\t\t\t\t\t<div class=\"invalid-feedback d-block\">\n\t\t\t\t\t\t\t\t\t\t@if (form.get('repeatPassword').errors.mustMatch) {\n\t\t\t\t\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t\t\t\t\t{{ 'PROFILE_PAGE.VALIDATION.PASSWORDS_DO_NOT_MATCH' | translate }}\n\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t</ngx-password-form-field>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"row\">\n\t\t\t\t\t\t<div class=\"col-6\">\n\t\t\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t\t\t<label class=\"label\" for=\"email\" [innerText]=\"'PROFILE_PAGE.EMAIL' | translate\"></label>\n\t\t\t\t\t\t\t\t<input\n\t\t\t\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t\t\t\tid=\"email\"\n\t\t\t\t\t\t\t\t\ttype=\"email\"\n\t\t\t\t\t\t\t\t\tnbInput\n\t\t\t\t\t\t\t\t\tformControlName=\"email\"\n\t\t\t\t\t\t\t\t\t[status]=\"FormHelpers.isInvalidControl(form, 'email') ? 'danger' : 'basic'\"\n\t\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t\t\t@if (FormHelpers.isInvalidControl(form, 'email')) {\n\t\t\t\t\t\t\t\t\t<div class=\"invalid-feedback d-block\">\n\t\t\t\t\t\t\t\t\t\t@if (form.get('email').errors.required) {\n\t\t\t\t\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t\t\t\t\t{{ 'PROFILE_PAGE.VALIDATION.EMAIL_REQUIRED' | translate }}\n\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\"col-6\">\n\t\t\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t\t\t<ga-tags-color-input\n\t\t\t\t\t\t\t\t\t[selectedTags]=\"form.get('tags').value\"\n\t\t\t\t\t\t\t\t\t(selectedTagsEvent)=\"selectedTagsHandler($event)\"\n\t\t\t\t\t\t\t\t\t[isTenantLevel]=\"true\"\n\t\t\t\t\t\t\t\t></ga-tags-color-input>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"row\">\n\t\t\t\t\t\t@if (allowRoleChange) {\n\t\t\t\t\t\t\t<div class=\"col-sm-6\">\n\t\t\t\t\t\t\t\t<ngx-role-form-field\n\t\t\t\t\t\t\t\t\t[id]=\"'role'\"\n\t\t\t\t\t\t\t\t\t[placeholder]=\"'FORM.PLACEHOLDERS.ROLE' | translate\"\n\t\t\t\t\t\t\t\t\t[label]=\"'FORM.LABELS.ROLE' | translate\"\n\t\t\t\t\t\t\t\t\tformControlName=\"role\"\n\t\t\t\t\t\t\t\t\t(selectedChange)=\"onSelectionChange($event)\"\n\t\t\t\t\t\t\t\t\t[excludes]=\"excludes\"\n\t\t\t\t\t\t\t\t></ngx-role-form-field>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t}\n\t\t\t\t\t\t<div class=\"col-sm-6\">\n\t\t\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t\t\t<label\n\t\t\t\t\t\t\t\t\tfor=\"preferredLanguage\"\n\t\t\t\t\t\t\t\t\tclass=\"label\"\n\t\t\t\t\t\t\t\t\t[innerText]=\"'FORM.LABELS.PREFERRED_LANGUAGE' | translate\"\n\t\t\t\t\t\t\t\t></label>\n\t\t\t\t\t\t\t\t<ngx-language-selector\n\t\t\t\t\t\t\t\t\t[placeholder]=\"'FORM.PLACEHOLDERS.PREFERRED_LANGUAGE' | translate\"\n\t\t\t\t\t\t\t\t\tclass=\"d-block\"\n\t\t\t\t\t\t\t\t\t[template]=\"'ng-select'\"\n\t\t\t\t\t\t\t\t\tformControlName=\"preferredLanguage\"\n\t\t\t\t\t\t\t\t></ngx-language-selector>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\"col-sm-6\">\n\t\t\t\t\t\t\t<ga-timezone-selector formControlName=\"timeZone\"></ga-timezone-selector>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\"col-sm-6\">\n\t\t\t\t\t\t\t<ngx-phone-form-input formControlName=\"phoneNumber\"></ngx-phone-form-input>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\"col-6\">\n\t\t\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t\t\t<label class=\"label\" for=\"timeZone\">\n\t\t\t\t\t\t\t\t\t{{ 'FORM.LABELS.TIME_FORMAT' | translate }}\n\t\t\t\t\t\t\t\t</label>\n\t\t\t\t\t\t\t\t<ng-select\n\t\t\t\t\t\t\t\t\tid=\"timeFormat\"\n\t\t\t\t\t\t\t\t\tappendTo=\"body\"\n\t\t\t\t\t\t\t\t\t[(items)]=\"listOfTimeFormats\"\n\t\t\t\t\t\t\t\t\t[placeholder]=\"'FORM.PLACEHOLDERS.TIME_FORMAT' | translate\"\n\t\t\t\t\t\t\t\t\t[searchable]=\"false\"\n\t\t\t\t\t\t\t\t\t[clearable]=\"false\"\n\t\t\t\t\t\t\t\t\tformControlName=\"timeFormat\"\n\t\t\t\t\t\t\t\t></ng-select>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"actions\">\n\t\t\t\t\t\t<button [disabled]=\"form.invalid\" (click)=\"submitForm()\" nbButton status=\"success\">\n\t\t\t\t\t\t\t{{ 'PROFILE_PAGE.SAVE' | translate }}\n\t\t\t\t\t\t</button>\n\t\t\t\t\t</div>\n\t\t\t\t</form>\n\t\t\t</div>\n\t\t</div>\n\t</nb-card-body>\n</nb-card>\n\n<ng-template #imageUploaderTemplate>\n\t<ngx-image-uploader\n\t\t(changeHoverState)=\"hoverState = $event\"\n\t\t(uploadedImageAsset)=\"updateImageAsset($event)\"\n\t\t(uploadImageAssetError)=\"handleImageUploadError($event)\"\n\t></ngx-image-uploader>\n\t<svg\n\t\txmlns=\"http://www.w3.org/2000/svg\"\n\t\txmlns:xlink=\"http://www.w3.org/1999/xlink\"\n\t\twidth=\"68\"\n\t\theight=\"68\"\n\t\tviewBox=\"0 0 68 68\"\n\t\t[style.opacity]=\"hoverState ? '1' : '0.3'\"\n\t>\n\t\t<defs>\n\t\t\t<path\n\t\t\t\tid=\"a\"\n\t\t\t\td=\"M28.667 31.333a2 2 0 1 0-.002-4.001 2 2 0 0 0 .002 4.001m13.333 12H26.748l9.34-7.793c.328-.279.923-.277 1.244-.001l6.001 5.12V42c0 .736-.597 1.333-1.333 1.333M26 24.667h16c.736 0 1.333.597 1.333 1.333v11.152l-4.27-3.643c-1.32-1.122-3.386-1.122-4.694-.008l-9.702 8.096V26c0-.736.597-1.333 1.333-1.333M42 22H26c-2.205 0-4 1.795-4 4v16c0 2.205 1.795 4 4 4h16c2.205 0 4-1.795 4-4V26c0-2.205-1.795-4-4-4\"\n\t\t\t/>\n\t\t</defs>\n\t\t<g fill=\"none\" fill-rule=\"evenodd\">\n\t\t\t<circle cx=\"34\" cy=\"34\" r=\"34\" fill=\"#0091FF\" opacity=\".3\" />\n\t\t\t<circle cx=\"34\" cy=\"34\" r=\"26\" fill=\"#0091FF\" opacity=\".9\" />\n\t\t\t<use fill=\"#FFF\" fill-rule=\"nonzero\" xlink:href=\"#a\" />\n\t\t</g>\n\t</svg>\n\t<div class=\"image-overlay\" [style.opacity]=\"hoverState ? '0.2' : '0'\"></div>\n\t@if (!!form) {\n\t\t<img\n\t\t\t[src]=\"form.get('imageUrl').value\"\n\t\t\talt=\"Profile Photo\"\n\t\t\t(mouseenter)=\"hoverState = true\"\n\t\t\t(mouseleave)=\"hoverState = false\"\n\t\t/>\n\t}\n</ng-template>\n", styles: ["@charset \"UTF-8\";:host nb-card{background-color:var(--gauzy-card-2)}:host nb-card ::ng-deep input,:host nb-card ::ng-deep nb-select.appearance-outline.status-basic .select-button,:host nb-card ::ng-deep .ng-select .ng-select-container{background-color:var(--gauzy-card-1)!important;border:none;min-height:42px!important}:host nb-card ::ng-deep .ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-placeholder,:host nb-card ::ng-deep .ng-select.ng-select-single .ng-select-container .ng-value-container .ng-input{top:unset!important}:host nb-card ::ng-deep label,:host nb-card ::ng-deep .label{font-size:var(--text-label-font-size);font-weight:600;line-height:.8125rem;letter-spacing:-.01em;color:var(--gauzy-text-color-2)}:host nb-card ::ng-deep textarea{background-color:var(--gauzy-card-1)!important;border:none}:host nb-card ::ng-deep .ng-select .ng-select-container input,:host nb-card ::ng-deep nb-tag-list input{background-color:unset!important}:host nb-card ::ng-deep ngx-image-uploader input{height:100%!important}:host nb-card-body{padding:50px 70px}@media only screen and (max-width:1532px){:host nb-card-body{padding:30px 40px}}:host nb-card-body .navigate{display:flex;margin-bottom:35px;cursor:pointer}:host nb-card-body .navigate span{margin-left:7px;font-size:14px;color:#2a2c39}:host nb-card-body .content{display:flex}:host nb-card-body .employee-container{position:relative;display:flex;flex-direction:column;transition:transform .15s ease-in-out}[dir=rtl] :host nb-card-body .employee-container{padding-left:70px}[dir=ltr] :host nb-card-body .employee-container{padding-right:70px}[dir=rtl] :host nb-card-body .employee-container{margin-left:70px}[dir=ltr] :host nb-card-body .employee-container{margin-right:70px}[dir=rtl] :host nb-card-body .employee-container{border-left:1px solid rgba(0,0,0,.1)}[dir=ltr] :host nb-card-body .employee-container{border-right:1px solid rgba(0,0,0,.1)}:host nb-card-body .employee-container .employee-photo{width:fit-content;height:200px;position:relative}:host nb-card-body .employee-container .employee-photo div{pointer-events:none;background:#000;position:absolute;height:100%;width:100%;border-radius:13px}:host nb-card-body .employee-container .employee-photo img{width:200px;height:200px;border-radius:13px;object-fit:cover}:host nb-card-body .employee-container .employee-photo input{width:100%;height:100%!important;opacity:0;position:absolute;z-index:3;cursor:pointer}:host nb-card-body .employee-container .employee-photo svg{z-index:2;transition:opacity .2s ease-in;opacity:.3;position:absolute;top:calc(50% - 34px);left:calc(50% - 34px)}:host nb-card-body .employee-container .employee-photo svg g circle{fill:var(--text-primary-color)}:host nb-card-body .badge{position:relative;margin-top:10px;display:flex}:host nb-card-body .employee-form{width:60%}:host nb-card-body .actions{display:flex;justify-content:flex-start;width:100%;margin-top:30px}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }], ctorParameters: () => [{ type: i1.UntypedFormBuilder }, { type: i2.AuthService }, { type: i2.UsersService }, { type: i2.Store }, { type: i2.ToastrService }, { type: i2.ErrorHandlingService }, { type: i2.RoleService }], propDecorators: { selectedUser: [{
                type: Input
            }], allowRoleChange: [{
                type: Input
            }], userSubmitted: [{
                type: Output
            }] } });
//# sourceMappingURL=edit-profile-form.component.js.map