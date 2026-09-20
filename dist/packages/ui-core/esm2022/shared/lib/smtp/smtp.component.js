var SMTPComponent_1;
import { __decorate, __metadata } from "tslib";
import { Component, Input, ViewChild } from '@angular/core';
import { UntypedFormBuilder, FormGroupDirective, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PermissionsEnum, SMTPSecureEnum } from '@gauzy/contracts';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TranslateService } from '@ngx-translate/core';
import { filter, pairwise, tap } from 'rxjs/operators';
import { patterns } from '@gauzy/constants';
import { Store } from '@gauzy/ui-core/core';
import { CustomSmtpService, ToastrService } from '@gauzy/ui-core/core';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { FormHelpers } from '../forms/helpers';
import * as i0 from "@angular/core";
import * as i1 from "@angular/router";
import * as i2 from "@angular/forms";
import * as i3 from "@gauzy/ui-core/core";
import * as i4 from "@ngx-translate/core";
import * as i5 from "@nebular/theme";
import * as i6 from "ngx-permissions";
import * as i7 from "@angular/common";
let SMTPComponent = class SMTPComponent extends TranslationBaseComponent {
    static { SMTPComponent_1 = this; }
    static buildForm(fb) {
        return fb.group({
            id: [],
            organizationId: [],
            fromAddress: [null, Validators.compose([Validators.required, Validators.pattern(patterns.email)])],
            host: [null, Validators.compose([Validators.required, Validators.pattern(patterns.host)])],
            port: [],
            secure: [],
            username: [null, Validators.required],
            password: [null, Validators.required],
            isValidate: [false]
        });
    }
    constructor(_activatedRoute, fb, customSmtpService, translate, toastrService, store) {
        super(translate);
        this._activatedRoute = _activatedRoute;
        this.fb = fb;
        this.customSmtpService = customSmtpService;
        this.translate = translate;
        this.toastrService = toastrService;
        this.store = store;
        this.secureOptions = [
            { label: SMTPSecureEnum.TRUE, value: true },
            { label: SMTPSecureEnum.FALSE, value: false }
        ];
        this.PermissionsEnum = PermissionsEnum;
        this.FormHelpers = FormHelpers;
        /*
         * SMTP Mutation Form
         */
        this.form = SMTPComponent_1.buildForm(this.fb);
    }
    ngOnInit() {
        this._activatedRoute.data
            .pipe(filter((data) => !!data), tap(({ isOrganization }) => (this.isOrganization = isOrganization)), untilDestroyed(this))
            .subscribe();
        this.store.user$
            .pipe(filter((user) => !!user), tap((user) => (this.user = user)), untilDestroyed(this))
            .subscribe();
        this.store.selectedOrganization$
            .pipe(filter((organization) => !!organization), tap((organization) => (this.organization = organization)), tap(() => this.getTenantSmtpSetting()), untilDestroyed(this))
            .subscribe();
    }
    ngOnChanges(change) {
        if (change.organization.previousValue) {
            this.getTenantSmtpSetting();
        }
    }
    ngAfterViewInit() {
        const username = this.form.get('username');
        username.valueChanges.pipe(filter((val) => !!val)).subscribe((value) => {
            const substring = '****';
            this.isWrapped = value.includes(substring);
        });
        this.form.valueChanges.pipe(pairwise()).subscribe((values) => {
            const oldVal = values[0];
            const newVal = values[1];
            if ((newVal.username && oldVal.username) || (newVal.host && oldVal.host)) {
                if (newVal.username !== oldVal.username || newVal.host !== oldVal.host) {
                    this.isValidated = false;
                }
            }
        });
    }
    /*
     * Get tenant SMTP details
     */
    getTenantSmtpSetting() {
        if (!this.user) {
            return;
        }
        const { tenantId } = this.user;
        this.loading = true;
        this.customSmtpService
            .getSMTPSetting({
            tenantId,
            ...(this.organization && this.isOrganization
                ? {
                    organizationId: this.organization.id
                }
                : {})
        })
            .then((setting) => {
            this.formDirective.resetForm();
            if (setting && setting.hasOwnProperty('auth')) {
                this.globalSmtpPatch(setting);
            }
            else {
                this.customSmtp = setting;
                this.patchValue();
            }
            // if organization exist
            if (this.organization && this.isOrganization) {
                this.form.patchValue({
                    organizationId: this.organization.id
                });
            }
        })
            .finally(() => (this.loading = false));
    }
    /*
     * Patch old SMTP details for tenant
     */
    patchValue() {
        if (this.customSmtp) {
            this.isValidated = this.customSmtp.isValidate ? true : false;
            this.form.patchValue({
                id: this.customSmtp.id,
                host: this.customSmtp.host,
                port: this.customSmtp.port,
                secure: this.customSmtp.secure,
                username: this.customSmtp.username,
                password: this.customSmtp.password,
                isValidate: this.customSmtp.isValidate,
                fromAddress: this.customSmtp.fromAddress
            });
        }
    }
    /*
     * Global SMTP Configuration
     */
    globalSmtpPatch(setting) {
        this.form.patchValue({
            host: setting.host,
            port: setting.port,
            secure: setting.secure,
            username: setting['auth']['user'],
            password: setting['auth']['pass']
        });
    }
    onSubmit() {
        if (this.form.invalid) {
            return;
        }
        if (this.form.get('id').value) {
            this.updateSetting();
        }
        else {
            this.saveSetting();
        }
    }
    saveSetting() {
        if (this.form.invalid) {
            return;
        }
        this.customSmtpService
            .saveSMTPSetting({
            ...this.form.getRawValue(),
            isValidate: this.isValidated
        })
            .then(() => {
            this.toastrService.success(this.getTranslation('TOASTR.TITLE.SUCCESS'), this.getTranslation(`TOASTR.MESSAGE.CUSTOM_SMTP_ADDED`));
        })
            .catch(() => {
            this.toastrService.error('TOASTR.MESSAGE.ERRORS');
        })
            .finally(() => this.getTenantSmtpSetting());
    }
    updateSetting() {
        if (this.form.invalid) {
            return;
        }
        const { id } = this.form.getRawValue();
        this.customSmtpService
            .updateSMTPSetting(id, {
            ...this.form.getRawValue(),
            isValidate: this.isValidated
        })
            .then(() => {
            this.toastrService.success(this.getTranslation('TOASTR.TITLE.SUCCESS'), this.getTranslation(`TOASTR.MESSAGE.CUSTOM_SMTP_UPDATED`));
        })
            .catch(() => {
            this.toastrService.error('TOASTR.MESSAGE.ERRORS');
        })
            .finally(() => this.getTenantSmtpSetting());
    }
    /**
     * Validate SMTP Credentials
     */
    async validateSmtp() {
        try {
            const smtp = this.form.getRawValue();
            const validatedSmtp = await this.customSmtpService.validateSMTPSetting(smtp);
            if (typeof validatedSmtp === 'object') {
                this.isValidated = false;
                this.toastrService.error(validatedSmtp);
            }
            else {
                this.isValidated = true;
                this.toastrService.success(this.getTranslation('TOASTR.TITLE.SUCCESS'));
            }
        }
        catch (error) {
            this.isValidated = false;
            this.toastrService.error(this.getTranslation('TOASTR.MESSAGE.ERRORS'));
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: SMTPComponent, deps: [{ token: i1.ActivatedRoute }, { token: i2.UntypedFormBuilder }, { token: i3.CustomSmtpService }, { token: i4.TranslateService }, { token: i3.ToastrService }, { token: i3.Store }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: SMTPComponent, isStandalone: false, selector: "ng-component", inputs: { organization: "organization", isOrganization: "isOrganization" }, viewQueries: [{ propertyName: "formDirective", first: true, predicate: ["formDirective"], descendants: true }], usesInheritance: true, usesOnChanges: true, ngImport: i0, template: "<ng-template [ngxPermissionsOnly]=\"PermissionsEnum.CUSTOM_SMTP_VIEW\">\n  <nb-card\n    class=\"card-smtp\"\n    [nbSpinner]=\"loading\"\n    nbSpinnerStatus=\"primary\"\n    nbSpinnerSize=\"large\"\n    >\n    <nb-card-header>\n      @if (isOrganization) {\n        <header>\n          {{\n          'CUSTOM_SMTP_PAGE.HEADER'\n          | translate: { name: organization?.name }\n          }}\n        </header>\n      } @else {\n        <header>\n          {{\n          'CUSTOM_SMTP_PAGE.HEADER'\n          | translate: { name: user?.tenant?.name }\n          }}\n        </header>\n      }\n    </nb-card-header>\n    <nb-card-body>\n      <form\n        [formGroup]=\"form\"\n        id=\"smtpForm\"\n        #formDirective=\"ngForm\"\n        (ngSubmit)=\"onSubmit()\"\n        >\n        <div class=\"row\">\n          <div class=\"col-sm-12 col-md-3\">\n            <label class=\"label\" for=\"fromAddress\">\n              {{ 'CUSTOM_SMTP_PAGE.FROM_ADDRESS' | translate }}\n            </label>\n            <input\n              id=\"fromAddress\"\n              nbInput\n              fullWidth\n              type=\"text\"\n              [placeholder]=\"'CUSTOM_SMTP_PAGE.FROM_ADDRESS' | translate\"\n              formControlName=\"fromAddress\"\n\t\t\t\t\t\t\t[status]=\"\n\t\t\t\t\t\t\t\tFormHelpers.isInvalidControl(form, 'fromAddress')\n\t\t\t\t\t\t\t\t\t? 'danger' :\n\t\t\t\t\t\t\t\t\t'basic'\n\t\t\t\t\t\t\t\"\n              />\n            </div>\n            <div class=\"col-sm-12 col-md-3\">\n              <label class=\"label\" for=\"host\">\n                {{ 'CUSTOM_SMTP_PAGE.HOST' | translate }}\n              </label>\n              <input\n                id=\"host\"\n                nbInput\n                fullWidth\n                type=\"text\"\n                [placeholder]=\"'CUSTOM_SMTP_PAGE.HOST' | translate\"\n                formControlName=\"host\"\n\t\t\t\t\t\t\t[status]=\"\n\t\t\t\t\t\t\t\tFormHelpers.isInvalidControl(form, 'host')\n\t\t\t\t\t\t\t\t\t? 'danger' :\n\t\t\t\t\t\t\t\t\t'basic'\n\t\t\t\t\t\t\t\"\n                />\n              </div>\n              <div class=\"col-sm-12 col-md-3\">\n                <label class=\"label\" for=\"port\">\n                  {{ 'CUSTOM_SMTP_PAGE.PORT' | translate }}\n                </label>\n                <input\n                  id=\"port\"\n                  nbInput\n                  fullWidth\n                  type=\"number\"\n                  [placeholder]=\"'CUSTOM_SMTP_PAGE.PORT' | translate\"\n                  formControlName=\"port\"\n                  />\n                </div>\n                <div class=\"col-sm-12 col-md-3\">\n                  <label class=\"label\" for=\"secure\">\n                    {{ 'CUSTOM_SMTP_PAGE.SECURE' | translate }}\n                  </label>\n                  <nb-select\n                    id=\"secure\"\n                    class=\"d-block\"\n                    size=\"medium\"\n                    fullWidth\n                    formControlName=\"secure\"\n                    >\n                    @for (secure of secureOptions; track secure) {\n                      <nb-option\n                        [value]=\"secure.value\"\n                        >\n                        {{ secure.label | titlecase }}\n                      </nb-option>\n                    }\n                  </nb-select>\n                </div>\n              </div>\n              <div class=\"row mt-2\">\n                <div class=\"col-sm-12 col-md-5\">\n                  <label class=\"label\" for=\"username\">\n                    {{ 'CUSTOM_SMTP_PAGE.AUTH.USERNAME' | translate }}\n                  </label>\n                  <input\n                    nbInput\n                    type=\"text\"\n                    fullWidth\n                    [placeholder]=\"'CUSTOM_SMTP_PAGE.AUTH.USERNAME' | translate\"\n                    id=\"username\"\n                    formControlName=\"username\"\n\t\t\t\t\t\t\t[status]=\"\n\t\t\t\t\t\t\t\tFormHelpers.isInvalidControl(form, 'username')\n\t\t\t\t\t\t\t\t\t? 'danger' :\n\t\t\t\t\t\t\t\t\t'basic'\n\t\t\t\t\t\t\t\"\n                    />\n                  </div>\n                  <div class=\"col-sm-12 col-md-5\">\n                    <label class=\"label\" for=\"password\">\n                      {{ 'CUSTOM_SMTP_PAGE.AUTH.PASSWORD' | translate }}\n                    </label>\n                    <input\n                      nbInput\n                      type=\"text\"\n                      fullWidth\n                      [placeholder]=\"'CUSTOM_SMTP_PAGE.AUTH.PASSWORD' | translate\"\n                      id=\"password\"\n                      formControlName=\"password\"\n\t\t\t\t\t\t\t[status]=\"\n\t\t\t\t\t\t\t\tFormHelpers.isInvalidControl(form, 'password')\n\t\t\t\t\t\t\t\t\t? 'danger' :\n\t\t\t\t\t\t\t\t\t'basic'\n\t\t\t\t\t\t\t\"\n                      />\n                    </div>\n                  </div>\n                </form>\n              </nb-card-body>\n              <nb-card-footer>\n                @if (isValidated) {\n                  <button\n                    class=\"mr-2\"\n                    nbButton\n                    status=\"success\"\n                    (click)=\"formDirective.ngSubmit.emit()\"\n                    [disabled]=\"form.invalid || isWrapped\"\n                    >\n                    {{ 'BUTTONS.SAVE' | translate }}\n                  </button>\n                  <button\n                    class=\"mr-2\"\n                    nbButton\n                    status=\"success\"\n                    [disabled]=\"isValidated\"\n                    >\n                    {{ 'BUTTONS.VALIDATED' | translate }}\n                  </button>\n                } @else {\n                  <button\n                    class=\"mr-2\"\n                    nbButton\n                    status=\"primary\"\n                    (click)=\"validateSmtp()\"\n                    [disabled]=\"form.invalid\"\n                    >\n                    {{ 'BUTTONS.VALIDATE' | translate }}\n                  </button>\n                }\n              </nb-card-footer>\n            </nb-card>\n          </ng-template>\n", styles: [":host header{font-size:18px;font-weight:600;line-height:30px;letter-spacing:0em}:host nb-card{background-color:var(--gauzy-card-2)}:host nb-card.card-smtp{height:calc(100vh - 16.5rem);border-radius:0 0 var(--border-radius) var(--border-radius);padding:0;margin:0}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "directive", type: i2.ɵNgNoValidate, selector: "form:not([ngNoForm]):not([ngNativeValidate])" }, { kind: "directive", type: i2.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i2.NumberValueAccessor, selector: "input[type=number][formControlName],input[type=number][formControl],input[type=number][ngModel]" }, { kind: "directive", type: i2.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i2.NgControlStatusGroup, selector: "[formGroupName],[formArrayName],[ngModelGroup],[formGroup],[formArray],form:not([ngNoForm]),[ngForm]" }, { kind: "directive", type: i2.FormGroupDirective, selector: "[formGroup]", inputs: ["formGroup"], outputs: ["ngSubmit"], exportAs: ["ngForm"] }, { kind: "directive", type: i2.FormControlName, selector: "[formControlName]", inputs: ["formControlName", "disabled", "ngModel"], outputs: ["ngModelChange"] }, { kind: "component", type: i5.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "component", type: i5.NbCardComponent, selector: "nb-card", inputs: ["size", "status", "accent"] }, { kind: "component", type: i5.NbCardBodyComponent, selector: "nb-card-body" }, { kind: "component", type: i5.NbCardFooterComponent, selector: "nb-card-footer" }, { kind: "component", type: i5.NbCardHeaderComponent, selector: "nb-card-header" }, { kind: "directive", type: i5.NbInputDirective, selector: "input[nbInput],textarea[nbInput]", inputs: ["fieldSize", "status", "shape", "fullWidth"] }, { kind: "component", type: i5.NbSelectComponent, selector: "nb-select", inputs: ["size", "status", "shape", "appearance", "optionsListClass", "optionsPanelClass", "optionsWidth", "outline", "filled", "hero", "disabled", "fullWidth", "placeholder", "compareWith", "selected", "multiple", "optionsOverlayOffset", "scrollStrategy"], outputs: ["selectedChange"] }, { kind: "component", type: i5.NbOptionComponent, selector: "nb-option", inputs: ["value", "disabled"], outputs: ["selectionChange"] }, { kind: "directive", type: i5.NbSpinnerDirective, selector: "[nbSpinner]", inputs: ["nbSpinnerMessage", "nbSpinnerStatus", "nbSpinnerSize", "nbSpinner"] }, { kind: "directive", type: i6.NgxPermissionsDirective, selector: "[ngxPermissionsOnly],[ngxPermissionsExcept]", inputs: ["ngxPermissionsOnly", "ngxPermissionsOnlyThen", "ngxPermissionsOnlyElse", "ngxPermissionsExcept", "ngxPermissionsExceptElse", "ngxPermissionsExceptThen", "ngxPermissionsThen", "ngxPermissionsElse", "ngxPermissionsOnlyAuthorisedStrategy", "ngxPermissionsOnlyUnauthorisedStrategy", "ngxPermissionsExceptUnauthorisedStrategy", "ngxPermissionsExceptAuthorisedStrategy", "ngxPermissionsUnauthorisedStrategy", "ngxPermissionsAuthorisedStrategy"], outputs: ["permissionsAuthorized", "permissionsUnauthorized"] }, { kind: "pipe", type: i7.TitleCasePipe, name: "titlecase" }, { kind: "pipe", type: i4.TranslatePipe, name: "translate" }] }); }
};
SMTPComponent = SMTPComponent_1 = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [ActivatedRoute,
        UntypedFormBuilder,
        CustomSmtpService,
        TranslateService,
        ToastrService,
        Store])
], SMTPComponent);
export { SMTPComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: SMTPComponent, decorators: [{
            type: Component,
            args: [{ standalone: false, template: "<ng-template [ngxPermissionsOnly]=\"PermissionsEnum.CUSTOM_SMTP_VIEW\">\n  <nb-card\n    class=\"card-smtp\"\n    [nbSpinner]=\"loading\"\n    nbSpinnerStatus=\"primary\"\n    nbSpinnerSize=\"large\"\n    >\n    <nb-card-header>\n      @if (isOrganization) {\n        <header>\n          {{\n          'CUSTOM_SMTP_PAGE.HEADER'\n          | translate: { name: organization?.name }\n          }}\n        </header>\n      } @else {\n        <header>\n          {{\n          'CUSTOM_SMTP_PAGE.HEADER'\n          | translate: { name: user?.tenant?.name }\n          }}\n        </header>\n      }\n    </nb-card-header>\n    <nb-card-body>\n      <form\n        [formGroup]=\"form\"\n        id=\"smtpForm\"\n        #formDirective=\"ngForm\"\n        (ngSubmit)=\"onSubmit()\"\n        >\n        <div class=\"row\">\n          <div class=\"col-sm-12 col-md-3\">\n            <label class=\"label\" for=\"fromAddress\">\n              {{ 'CUSTOM_SMTP_PAGE.FROM_ADDRESS' | translate }}\n            </label>\n            <input\n              id=\"fromAddress\"\n              nbInput\n              fullWidth\n              type=\"text\"\n              [placeholder]=\"'CUSTOM_SMTP_PAGE.FROM_ADDRESS' | translate\"\n              formControlName=\"fromAddress\"\n\t\t\t\t\t\t\t[status]=\"\n\t\t\t\t\t\t\t\tFormHelpers.isInvalidControl(form, 'fromAddress')\n\t\t\t\t\t\t\t\t\t? 'danger' :\n\t\t\t\t\t\t\t\t\t'basic'\n\t\t\t\t\t\t\t\"\n              />\n            </div>\n            <div class=\"col-sm-12 col-md-3\">\n              <label class=\"label\" for=\"host\">\n                {{ 'CUSTOM_SMTP_PAGE.HOST' | translate }}\n              </label>\n              <input\n                id=\"host\"\n                nbInput\n                fullWidth\n                type=\"text\"\n                [placeholder]=\"'CUSTOM_SMTP_PAGE.HOST' | translate\"\n                formControlName=\"host\"\n\t\t\t\t\t\t\t[status]=\"\n\t\t\t\t\t\t\t\tFormHelpers.isInvalidControl(form, 'host')\n\t\t\t\t\t\t\t\t\t? 'danger' :\n\t\t\t\t\t\t\t\t\t'basic'\n\t\t\t\t\t\t\t\"\n                />\n              </div>\n              <div class=\"col-sm-12 col-md-3\">\n                <label class=\"label\" for=\"port\">\n                  {{ 'CUSTOM_SMTP_PAGE.PORT' | translate }}\n                </label>\n                <input\n                  id=\"port\"\n                  nbInput\n                  fullWidth\n                  type=\"number\"\n                  [placeholder]=\"'CUSTOM_SMTP_PAGE.PORT' | translate\"\n                  formControlName=\"port\"\n                  />\n                </div>\n                <div class=\"col-sm-12 col-md-3\">\n                  <label class=\"label\" for=\"secure\">\n                    {{ 'CUSTOM_SMTP_PAGE.SECURE' | translate }}\n                  </label>\n                  <nb-select\n                    id=\"secure\"\n                    class=\"d-block\"\n                    size=\"medium\"\n                    fullWidth\n                    formControlName=\"secure\"\n                    >\n                    @for (secure of secureOptions; track secure) {\n                      <nb-option\n                        [value]=\"secure.value\"\n                        >\n                        {{ secure.label | titlecase }}\n                      </nb-option>\n                    }\n                  </nb-select>\n                </div>\n              </div>\n              <div class=\"row mt-2\">\n                <div class=\"col-sm-12 col-md-5\">\n                  <label class=\"label\" for=\"username\">\n                    {{ 'CUSTOM_SMTP_PAGE.AUTH.USERNAME' | translate }}\n                  </label>\n                  <input\n                    nbInput\n                    type=\"text\"\n                    fullWidth\n                    [placeholder]=\"'CUSTOM_SMTP_PAGE.AUTH.USERNAME' | translate\"\n                    id=\"username\"\n                    formControlName=\"username\"\n\t\t\t\t\t\t\t[status]=\"\n\t\t\t\t\t\t\t\tFormHelpers.isInvalidControl(form, 'username')\n\t\t\t\t\t\t\t\t\t? 'danger' :\n\t\t\t\t\t\t\t\t\t'basic'\n\t\t\t\t\t\t\t\"\n                    />\n                  </div>\n                  <div class=\"col-sm-12 col-md-5\">\n                    <label class=\"label\" for=\"password\">\n                      {{ 'CUSTOM_SMTP_PAGE.AUTH.PASSWORD' | translate }}\n                    </label>\n                    <input\n                      nbInput\n                      type=\"text\"\n                      fullWidth\n                      [placeholder]=\"'CUSTOM_SMTP_PAGE.AUTH.PASSWORD' | translate\"\n                      id=\"password\"\n                      formControlName=\"password\"\n\t\t\t\t\t\t\t[status]=\"\n\t\t\t\t\t\t\t\tFormHelpers.isInvalidControl(form, 'password')\n\t\t\t\t\t\t\t\t\t? 'danger' :\n\t\t\t\t\t\t\t\t\t'basic'\n\t\t\t\t\t\t\t\"\n                      />\n                    </div>\n                  </div>\n                </form>\n              </nb-card-body>\n              <nb-card-footer>\n                @if (isValidated) {\n                  <button\n                    class=\"mr-2\"\n                    nbButton\n                    status=\"success\"\n                    (click)=\"formDirective.ngSubmit.emit()\"\n                    [disabled]=\"form.invalid || isWrapped\"\n                    >\n                    {{ 'BUTTONS.SAVE' | translate }}\n                  </button>\n                  <button\n                    class=\"mr-2\"\n                    nbButton\n                    status=\"success\"\n                    [disabled]=\"isValidated\"\n                    >\n                    {{ 'BUTTONS.VALIDATED' | translate }}\n                  </button>\n                } @else {\n                  <button\n                    class=\"mr-2\"\n                    nbButton\n                    status=\"primary\"\n                    (click)=\"validateSmtp()\"\n                    [disabled]=\"form.invalid\"\n                    >\n                    {{ 'BUTTONS.VALIDATE' | translate }}\n                  </button>\n                }\n              </nb-card-footer>\n            </nb-card>\n          </ng-template>\n", styles: [":host header{font-size:18px;font-weight:600;line-height:30px;letter-spacing:0em}:host nb-card{background-color:var(--gauzy-card-2)}:host nb-card.card-smtp{height:calc(100vh - 16.5rem);border-radius:0 0 var(--border-radius) var(--border-radius);padding:0;margin:0}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }], ctorParameters: () => [{ type: i1.ActivatedRoute }, { type: i2.UntypedFormBuilder }, { type: i3.CustomSmtpService }, { type: i4.TranslateService }, { type: i3.ToastrService }, { type: i3.Store }], propDecorators: { formDirective: [{
                type: ViewChild,
                args: ['formDirective']
            }], organization: [{
                type: Input
            }], isOrganization: [{
                type: Input
            }] } });
//# sourceMappingURL=smtp.component.js.map