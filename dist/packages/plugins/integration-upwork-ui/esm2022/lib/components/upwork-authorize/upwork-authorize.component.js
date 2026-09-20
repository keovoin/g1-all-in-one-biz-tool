var UpworkAuthorizeComponent_1;
import { __decorate } from "tslib";
import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EMPTY, debounceTime, tap, switchMap, filter } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { IntegrationEnum, isUpworkExistingAuthorization } from '@gauzy/contracts';
import { IntegrationsService, Store, UpworkService } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
import * as i1 from "@nebular/theme";
import * as i2 from "@angular/forms";
import * as i3 from "@gauzy/ui-core/shared";
import * as i4 from "@ngx-translate/core";
let UpworkAuthorizeComponent = class UpworkAuthorizeComponent {
    constructor() {
        this._fb = inject(UntypedFormBuilder);
        this._upworkService = inject(UpworkService);
        this._activatedRoute = inject(ActivatedRoute);
        this._router = inject(Router);
        this._store = inject(Store);
        this._integrationsService = inject(IntegrationsService);
        this.form = UpworkAuthorizeComponent_1.buildForm(this._fb);
    }
    static { UpworkAuthorizeComponent_1 = this; }
    static buildForm(fb) {
        return fb.group({
            consumerKey: [null, Validators.required],
            consumerSecret: [null, Validators.required]
        });
    }
    ngOnInit() {
        this._store.selectedOrganization$
            .pipe(filter((organization) => !!organization), tap((organization) => (this.organization = organization)), untilDestroyed(this))
            .subscribe();
        this._activatedRoute.data
            .pipe(debounceTime(100), filter(({ state }) => !!state), tap(({ state }) => (this.rememberState = state)), tap(() => this._getUpworkVerifier()), untilDestroyed(this))
            .subscribe();
    }
    _getUpworkVerifier() {
        this._activatedRoute.queryParams
            .pipe(switchMap((params) => {
            if (params && params.oauth_verifier) {
                if (this.organization) {
                    const { id: organizationId } = this.organization;
                    const { oauth_token, oauth_verifier } = params;
                    return this._upworkService.getAccessToken({ requestToken: oauth_token, verifier: oauth_verifier }, organizationId);
                }
            }
            // if remember state is true
            if (this.rememberState) {
                this._checkRememberState();
            }
            return EMPTY;
        }), tap((res) => this._redirectToUpworkIntegration(res.integrationId)), untilDestroyed(this))
            .subscribe();
    }
    /**
     * Upwork integration remember state API call
     */
    _checkRememberState() {
        if (!this.organization) {
            return;
        }
        const { id: organizationId, tenantId } = this.organization;
        const state$ = this._integrationsService.getIntegrationByOptions({
            name: IntegrationEnum.UPWORK,
            organizationId,
            tenantId
        });
        state$
            .pipe(filter((integration) => !!integration.id), tap((integration) => {
            this._redirectToUpworkIntegration(integration.id);
        }), untilDestroyed(this))
            .subscribe();
    }
    /**
     * Starts the Upwork OAuth handshake, or opens the integration that already completed it.
     *
     * @param config The Upwork consumer key and secret typed into the form.
     */
    authorizeUpwork(config) {
        if (!this.organization || this.form.invalid) {
            return;
        }
        const { id: organizationId } = this.organization;
        const token$ = this._upworkService.getAccessTokenSecretPair(config, organizationId);
        token$
            .pipe(tap((token) => {
            // The API never returns the access token, so an already-authorized app is recognized
            // by its integration id; it used to answer with nothing at all, which threw here.
            if (isUpworkExistingAuthorization(token)) {
                this._redirectToUpworkIntegration(token.integrationId);
            }
            else if (token?.url) {
                window.location.replace(token.url);
            }
        }), untilDestroyed(this))
            .subscribe();
    }
    /**
     *
     * @param integrationId
     */
    _redirectToUpworkIntegration(integrationId) {
        this._router.navigate(['pages/integrations/upwork', integrationId]);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: UpworkAuthorizeComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: UpworkAuthorizeComponent, isStandalone: false, selector: "ngx-upwork-authorize", ngImport: i0, template: "<nb-card class=\"card-scroll\">\n\t<nb-card-header class=\"d-flex\">\n\t\t<ngx-back-navigation></ngx-back-navigation>\n\t\t<h5>{{ 'MENU.UPWORK' | translate }}</h5>\n\t</nb-card-header>\n\t<nb-card-body>\n\t\t<form class=\"col-xl-6 col-12\" [formGroup]=\"form\" (ngSubmit)=\"authorizeUpwork(form.value)\">\n\t\t\t<div class=\"form-group\">\n\t\t\t\t<label for=\"consumerKey\" class=\"label\">{{ 'INTEGRATIONS.UPWORK_PAGE.API_KEY' | translate }}</label>\n\t\t\t\t<input\n\t\t\t\t\tfullWidth\n\t\t\t\t\tid=\"consumerKey\"\n\t\t\t\t\tformControlName=\"consumerKey\"\n\t\t\t\t\ttype=\"text\"\n\t\t\t\t\tnbInput\n\t\t\t\t\t[placeholder]=\"'FORM.PLACEHOLDERS.UPWORK_API_KEY' | translate\"\n\t\t\t\t/>\n\t\t\t</div>\n\t\t\t<div class=\"form-group\">\n\t\t\t\t<label for=\"consumerSecret\" class=\"label\">{{ 'INTEGRATIONS.UPWORK_PAGE.SECRET' | translate }}</label>\n\t\t\t\t<input\n\t\t\t\t\tfullWidth\n\t\t\t\t\tid=\"consumerSecret\"\n\t\t\t\t\tformControlName=\"consumerSecret\"\n\t\t\t\t\ttype=\"text\"\n\t\t\t\t\tnbInput\n\t\t\t\t\t[placeholder]=\"'FORM.PLACEHOLDERS.UPWORK_SECRET' | translate\"\n\t\t\t\t/>\n\t\t\t</div>\n\t\t\t<div class=\"hint\">\n\t\t\t\t<nb-icon icon=\"info-outline\"></nb-icon>\n\t\t\t\t{{ 'INTEGRATIONS.UPWORK_PAGE.NEXT_STEP_INFO' | translate }}\n\t\t\t</div>\n\t\t\t<button nbButton status=\"primary\" [disabled]=\"form.invalid\" size=\"small\" outline>\n\t\t\t\t{{ 'BUTTONS.NEXT' | translate }}\n\t\t\t</button>\n\t\t</form>\n\t</nb-card-body>\n</nb-card>\n", styles: [".hint{margin-bottom:20px}button{box-shadow:var(--gauzy-shadow);border:none!important}:host nb-card,:host nb-card-body{background-color:var(--gauzy-card-2)}\n"], dependencies: [{ kind: "component", type: i1.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "component", type: i1.NbCardComponent, selector: "nb-card", inputs: ["size", "status", "accent"] }, { kind: "component", type: i1.NbCardBodyComponent, selector: "nb-card-body" }, { kind: "component", type: i1.NbCardHeaderComponent, selector: "nb-card-header" }, { kind: "component", type: i1.NbIconComponent, selector: "nb-icon", inputs: ["icon", "pack", "options", "status", "config"] }, { kind: "directive", type: i1.NbInputDirective, selector: "input[nbInput],textarea[nbInput]", inputs: ["fieldSize", "status", "shape", "fullWidth"] }, { kind: "directive", type: i2.ɵNgNoValidate, selector: "form:not([ngNoForm]):not([ngNativeValidate])" }, { kind: "directive", type: i2.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i2.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i2.NgControlStatusGroup, selector: "[formGroupName],[formArrayName],[ngModelGroup],[formGroup],[formArray],form:not([ngNoForm]),[ngForm]" }, { kind: "directive", type: i2.FormGroupDirective, selector: "[formGroup]", inputs: ["formGroup"], outputs: ["ngSubmit"], exportAs: ["ngForm"] }, { kind: "directive", type: i2.FormControlName, selector: "[formControlName]", inputs: ["formControlName", "disabled", "ngModel"], outputs: ["ngModelChange"] }, { kind: "component", type: i3.BackNavigationComponent, selector: "ngx-back-navigation", inputs: ["haveLink"] }, { kind: "pipe", type: i4.TranslatePipe, name: "translate" }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
};
UpworkAuthorizeComponent = UpworkAuthorizeComponent_1 = __decorate([
    UntilDestroy()
], UpworkAuthorizeComponent);
export { UpworkAuthorizeComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: UpworkAuthorizeComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-upwork-authorize', standalone: false, changeDetection: ChangeDetectionStrategy.OnPush, template: "<nb-card class=\"card-scroll\">\n\t<nb-card-header class=\"d-flex\">\n\t\t<ngx-back-navigation></ngx-back-navigation>\n\t\t<h5>{{ 'MENU.UPWORK' | translate }}</h5>\n\t</nb-card-header>\n\t<nb-card-body>\n\t\t<form class=\"col-xl-6 col-12\" [formGroup]=\"form\" (ngSubmit)=\"authorizeUpwork(form.value)\">\n\t\t\t<div class=\"form-group\">\n\t\t\t\t<label for=\"consumerKey\" class=\"label\">{{ 'INTEGRATIONS.UPWORK_PAGE.API_KEY' | translate }}</label>\n\t\t\t\t<input\n\t\t\t\t\tfullWidth\n\t\t\t\t\tid=\"consumerKey\"\n\t\t\t\t\tformControlName=\"consumerKey\"\n\t\t\t\t\ttype=\"text\"\n\t\t\t\t\tnbInput\n\t\t\t\t\t[placeholder]=\"'FORM.PLACEHOLDERS.UPWORK_API_KEY' | translate\"\n\t\t\t\t/>\n\t\t\t</div>\n\t\t\t<div class=\"form-group\">\n\t\t\t\t<label for=\"consumerSecret\" class=\"label\">{{ 'INTEGRATIONS.UPWORK_PAGE.SECRET' | translate }}</label>\n\t\t\t\t<input\n\t\t\t\t\tfullWidth\n\t\t\t\t\tid=\"consumerSecret\"\n\t\t\t\t\tformControlName=\"consumerSecret\"\n\t\t\t\t\ttype=\"text\"\n\t\t\t\t\tnbInput\n\t\t\t\t\t[placeholder]=\"'FORM.PLACEHOLDERS.UPWORK_SECRET' | translate\"\n\t\t\t\t/>\n\t\t\t</div>\n\t\t\t<div class=\"hint\">\n\t\t\t\t<nb-icon icon=\"info-outline\"></nb-icon>\n\t\t\t\t{{ 'INTEGRATIONS.UPWORK_PAGE.NEXT_STEP_INFO' | translate }}\n\t\t\t</div>\n\t\t\t<button nbButton status=\"primary\" [disabled]=\"form.invalid\" size=\"small\" outline>\n\t\t\t\t{{ 'BUTTONS.NEXT' | translate }}\n\t\t\t</button>\n\t\t</form>\n\t</nb-card-body>\n</nb-card>\n", styles: [".hint{margin-bottom:20px}button{box-shadow:var(--gauzy-shadow);border:none!important}:host nb-card,:host nb-card-body{background-color:var(--gauzy-card-2)}\n"] }]
        }] });
//# sourceMappingURL=upwork-authorize.component.js.map