import { __decorate, __metadata } from "tslib";
import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { debounceTime, filter, tap } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { firstValueFrom } from 'rxjs';
import { NbDialogService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'underscore';
import { environment } from '@gauzy/ui-config';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { FeatureStoreService, Store } from '@gauzy/ui-core/core';
import { CountdownConfirmationComponent } from '../user/forms/countdown-confirmation/countdown-confirmation.component';
import * as i0 from "@angular/core";
import * as i1 from "@angular/router";
import * as i2 from "@gauzy/ui-core/core";
import * as i3 from "@ngx-translate/core";
import * as i4 from "@nebular/theme";
import * as i5 from "@angular/common";
let FeatureToggleComponent = class FeatureToggleComponent extends TranslationBaseComponent {
    constructor(_activatedRoute, _featureStoreService, _storeService, translationService, dialogService) {
        super(translationService);
        this._activatedRoute = _activatedRoute;
        this._featureStoreService = _featureStoreService;
        this._storeService = _storeService;
        this.translationService = translationService;
        this.dialogService = dialogService;
        this.blocks$ = this._featureStoreService.blocks$;
        this.loading = true;
        this.featureTenant = [];
        this.featureOrganizations = [];
        this.featureTogglesDefinitions = [];
    }
    ngOnInit() {
        this._activatedRoute.data
            .pipe(tap(({ isOrganization }) => (this.isOrganization = isOrganization)), untilDestroyed(this))
            .subscribe();
        this._storeService.user$
            .pipe(filter((user) => !!user), tap((user) => (this.user = user)), tap(() => this.getFeatures()), untilDestroyed(this))
            .subscribe();
        this._storeService.selectedOrganization$
            .pipe(filter((organization) => !!organization), tap((organization) => (this.organization = organization)), tap(() => (this.loading = true)), debounceTime(50), tap(() => (this.loading = false)), tap(() => this.getFeatureOrganizations()), untilDestroyed(this))
            .subscribe();
        this._storeService.featureTenant$
            .pipe(tap((value) => (this.featureTenant = value)), untilDestroyed(this))
            .subscribe();
        this._featureStoreService.featureOrganizations$
            .pipe(tap((value) => {
            this.featureOrganizations = value;
            if (this.organization && this.isOrganization) {
                this._storeService.featureOrganizations = value;
            }
        }), untilDestroyed(this))
            .subscribe();
        this._storeService.featureToggles$
            .pipe(tap((toggles) => (this.featureTogglesDefinitions = toggles)), untilDestroyed(this))
            .subscribe();
    }
    ngOnChanges(change) { }
    getFeatures() {
        this._featureStoreService.loadFeatures(['children']).pipe(untilDestroyed(this)).subscribe();
    }
    getFeatureOrganizations() {
        if (!this.user) {
            return;
        }
        const { tenantId } = this.user;
        this._featureStoreService
            .loadFeatureOrganizations(['feature'], {
            tenantId,
            ...(this.organization && this.isOrganization
                ? {
                    organizationId: this.organization.id
                }
                : {})
        })
            .pipe(untilDestroyed(this))
            .subscribe();
    }
    async featureChanged(isEnabled, feature) {
        const result = await firstValueFrom(this.dialogService.open(CountdownConfirmationComponent, {
            context: {
                recordType: feature.description,
                isEnabled: isEnabled
            },
            closeOnBackdropClick: false
        }).onClose);
        if (result && result === 'continue') {
            this.emitFeatureToggle(feature, isEnabled);
        }
        else {
            if (!environment.IS_ELECTRON) {
                window.location.reload();
            }
        }
    }
    emitFeatureToggle(feature, isEnabled) {
        const { tenantId } = this.user;
        const { id: featureId } = feature;
        const request = {
            tenantId,
            featureId,
            isEnabled
        };
        if (this.organization && this.isOrganization) {
            const { id: organizationId } = this.organization;
            request['organizationId'] = organizationId;
        }
        this._featureStoreService
            .changedFeature(request)
            .pipe(tap(() => {
            if (!environment.IS_ELECTRON) {
                window.location.reload();
            }
        }))
            .subscribe();
    }
    enabledFeature(row) {
        let unique = [];
        if (this.isOrganization) {
            unique = [...this.featureOrganizations, ...this.featureTenant];
        }
        else {
            unique = [...this.featureTenant];
        }
        const filtered = _.uniq(unique, (x) => x.featureId);
        const featureOrganization = filtered.find((featureOrganization) => featureOrganization.featureId === row.id);
        if (featureOrganization && featureOrganization.isEnabled === false) {
            return featureOrganization.isEnabled;
        }
        const featureToggle = this.featureTogglesDefinitions.find((item) => item.name == row.code);
        if (featureToggle) {
            return featureToggle.enabled;
        }
        return true;
    }
    getTranslationFormat(text) {
        return text.replace(/ /g, '_').replace(/,|&/g, '').replace(/__/g, '_').toUpperCase();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: FeatureToggleComponent, deps: [{ token: i1.ActivatedRoute }, { token: i2.FeatureStoreService }, { token: i2.Store }, { token: i3.TranslateService }, { token: i4.NbDialogService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: FeatureToggleComponent, isStandalone: false, selector: "ga-feature-toggle", inputs: { organization: "organization" }, usesInheritance: true, usesOnChanges: true, ngImport: i0, template: "<nb-card class=\"card-feature\" [nbSpinner]=\"loading\" nbSpinnerStatus=\"primary\" nbSpinnerSize=\"large\">\n  <nb-card-header>\n    @if (isOrganization) {\n      <header>\n        {{ 'FEATURE_PAGE.HEADER' | translate : { name: organization?.name } }}\n      </header>\n    } @else {\n      <header>\n        {{ 'FEATURE_PAGE.HEADER' | translate : { name: user?.tenant?.name } }}\n      </header>\n    }\n  </nb-card-header>\n  @if (!loading) {\n    <nb-card-body class=\"features\">\n      <div class=\"mansory-layout\">\n        @for (block of blocks$ | async; track block) {\n          @for (row of block; track row) {\n            <div class=\"shortcut-card\">\n              <nb-card [status]=\"row?.status\">\n                <nb-card-header class=\"p-3\">\n                  <div class=\"row\">\n                    <div class=\"col-6\">\n                      @if (row?.icon) {\n                        <nb-icon [icon]=\"row?.icon\"></nb-icon>\n                      }\n                      <span>\n                        {{ getTranslationFormat('SETTINGS_FEATURES.' + row?.name) | translate }}\n                      </span>\n                    </div>\n                    @if (row?.isPaid) {\n                      <div class=\"col-6\">\n                        <button nbButton [status]=\"'basic'\">\n                          {{ 'BUTTONS.BUY' | translate }}\n                        </button>\n                      </div>\n                    }\n                  </div>\n                </nb-card-header>\n                <nb-card-body class=\"border border-top-0 p-3\">\n                  <div class=\"row\">\n                    <div class=\"col-10\">\n                      {{\n                      getTranslationFormat(\n                      'SETTINGS_FEATURES_DESCRIPTION' +\n                      '.' +\n                      row?.name +\n                      '.' +\n                      row?.description\n                      ) | translate\n                      }}\n                    </div>\n                    <div class=\"col-2\">\n                      <nb-toggle\n                        [checked]=\"enabledFeature(row)\"\n                        (checkedChange)=\"featureChanged($event, row)\"\n                        labelPosition=\"start\"\n                        status=\"basic\"\n                      ></nb-toggle>\n                    </div>\n                  </div>\n                  @if (row?.children.length > 0) {\n                    <div class=\"row\">\n                      <nb-list>\n                        @for (child of row?.children; track child) {\n                          <nb-list-item class=\"border-top\">\n                            <nb-checkbox\n                              [checked]=\"enabledFeature(child)\"\n                              (checkedChange)=\"featureChanged($event, child)\"\n                              status=\"basic\"\n                              >\n                              {{\n                              getTranslationFormat(\n                              'SETTINGS_FEATURES_TEXT' + '.' + row?.name + '.' + child?.name\n                              ) | translate\n                              }}\n                            </nb-checkbox>\n                          </nb-list-item>\n                        }\n                      </nb-list>\n                    </div>\n                  }\n                </nb-card-body>\n              </nb-card>\n            </div>\n          }\n        }\n      </div>\n    </nb-card-body>\n  }\n</nb-card>\n", styles: [":host header{font-size:18px;font-weight:600;line-height:30px;letter-spacing:0em}:host nb-card{background-color:var(--gauzy-card-2)}:host nb-card.card-feature{height:calc(100vh - 16.5rem);border-radius:0 0 var(--border-radius) var(--border-radius);padding:0;margin:0}:host nb-card-body.features{overflow:auto}:host nb-card-body.features nb-card{background-color:unset}:host nb-card-body.features nb-card nb-card-body{border-radius:0 0 var(--border-radius) var(--border-radius);color:var(--gauzy-text-color-2)}:host nb-card-body.features nb-card nb-card-body nb-list-item nb-checkbox ::ng-deep span.checked+span.text{color:var(--text-primary-color)}:host nb-card-body.features nb-card nb-card-body nb-list-item nb-checkbox ::ng-deep span+span.text{color:var(--gauzy-text-color-2)}.mansory-layout{-webkit-column-count:2;-moz-column-count:2;column-count:2}.shortcut-card{position:relative;display:inline-block;width:100%;-webkit-transition:1s ease all;transition:1s ease all;box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;margin-bottom:1rem}@media only screen and (max-width:1200px){.mansory-layout{-moz-column-count:1;-webkit-column-count:1;column-count:1}}@media only screen and (min-width:1680px){.mansory-layout{width:calc(100% - 5rem)}}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "component", type: i4.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "component", type: i4.NbCardComponent, selector: "nb-card", inputs: ["size", "status", "accent"] }, { kind: "component", type: i4.NbCardBodyComponent, selector: "nb-card-body" }, { kind: "component", type: i4.NbCardHeaderComponent, selector: "nb-card-header" }, { kind: "component", type: i4.NbCheckboxComponent, selector: "nb-checkbox", inputs: ["checked", "disabled", "status", "indeterminate"], outputs: ["checkedChange"] }, { kind: "component", type: i4.NbIconComponent, selector: "nb-icon", inputs: ["icon", "pack", "options", "status", "config"] }, { kind: "component", type: i4.NbListComponent, selector: "nb-list", inputs: ["role"] }, { kind: "component", type: i4.NbListItemComponent, selector: "nb-list-item", inputs: ["role"] }, { kind: "directive", type: i4.NbSpinnerDirective, selector: "[nbSpinner]", inputs: ["nbSpinnerMessage", "nbSpinnerStatus", "nbSpinnerSize", "nbSpinner"] }, { kind: "component", type: i4.NbToggleComponent, selector: "nb-toggle", inputs: ["checked", "disabled", "status", "labelPosition"], outputs: ["checkedChange"] }, { kind: "pipe", type: i5.AsyncPipe, name: "async" }, { kind: "pipe", type: i3.TranslatePipe, name: "translate" }] }); }
};
FeatureToggleComponent = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [ActivatedRoute,
        FeatureStoreService,
        Store,
        TranslateService,
        NbDialogService])
], FeatureToggleComponent);
export { FeatureToggleComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: FeatureToggleComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-feature-toggle', standalone: false, template: "<nb-card class=\"card-feature\" [nbSpinner]=\"loading\" nbSpinnerStatus=\"primary\" nbSpinnerSize=\"large\">\n  <nb-card-header>\n    @if (isOrganization) {\n      <header>\n        {{ 'FEATURE_PAGE.HEADER' | translate : { name: organization?.name } }}\n      </header>\n    } @else {\n      <header>\n        {{ 'FEATURE_PAGE.HEADER' | translate : { name: user?.tenant?.name } }}\n      </header>\n    }\n  </nb-card-header>\n  @if (!loading) {\n    <nb-card-body class=\"features\">\n      <div class=\"mansory-layout\">\n        @for (block of blocks$ | async; track block) {\n          @for (row of block; track row) {\n            <div class=\"shortcut-card\">\n              <nb-card [status]=\"row?.status\">\n                <nb-card-header class=\"p-3\">\n                  <div class=\"row\">\n                    <div class=\"col-6\">\n                      @if (row?.icon) {\n                        <nb-icon [icon]=\"row?.icon\"></nb-icon>\n                      }\n                      <span>\n                        {{ getTranslationFormat('SETTINGS_FEATURES.' + row?.name) | translate }}\n                      </span>\n                    </div>\n                    @if (row?.isPaid) {\n                      <div class=\"col-6\">\n                        <button nbButton [status]=\"'basic'\">\n                          {{ 'BUTTONS.BUY' | translate }}\n                        </button>\n                      </div>\n                    }\n                  </div>\n                </nb-card-header>\n                <nb-card-body class=\"border border-top-0 p-3\">\n                  <div class=\"row\">\n                    <div class=\"col-10\">\n                      {{\n                      getTranslationFormat(\n                      'SETTINGS_FEATURES_DESCRIPTION' +\n                      '.' +\n                      row?.name +\n                      '.' +\n                      row?.description\n                      ) | translate\n                      }}\n                    </div>\n                    <div class=\"col-2\">\n                      <nb-toggle\n                        [checked]=\"enabledFeature(row)\"\n                        (checkedChange)=\"featureChanged($event, row)\"\n                        labelPosition=\"start\"\n                        status=\"basic\"\n                      ></nb-toggle>\n                    </div>\n                  </div>\n                  @if (row?.children.length > 0) {\n                    <div class=\"row\">\n                      <nb-list>\n                        @for (child of row?.children; track child) {\n                          <nb-list-item class=\"border-top\">\n                            <nb-checkbox\n                              [checked]=\"enabledFeature(child)\"\n                              (checkedChange)=\"featureChanged($event, child)\"\n                              status=\"basic\"\n                              >\n                              {{\n                              getTranslationFormat(\n                              'SETTINGS_FEATURES_TEXT' + '.' + row?.name + '.' + child?.name\n                              ) | translate\n                              }}\n                            </nb-checkbox>\n                          </nb-list-item>\n                        }\n                      </nb-list>\n                    </div>\n                  }\n                </nb-card-body>\n              </nb-card>\n            </div>\n          }\n        }\n      </div>\n    </nb-card-body>\n  }\n</nb-card>\n", styles: [":host header{font-size:18px;font-weight:600;line-height:30px;letter-spacing:0em}:host nb-card{background-color:var(--gauzy-card-2)}:host nb-card.card-feature{height:calc(100vh - 16.5rem);border-radius:0 0 var(--border-radius) var(--border-radius);padding:0;margin:0}:host nb-card-body.features{overflow:auto}:host nb-card-body.features nb-card{background-color:unset}:host nb-card-body.features nb-card nb-card-body{border-radius:0 0 var(--border-radius) var(--border-radius);color:var(--gauzy-text-color-2)}:host nb-card-body.features nb-card nb-card-body nb-list-item nb-checkbox ::ng-deep span.checked+span.text{color:var(--text-primary-color)}:host nb-card-body.features nb-card nb-card-body nb-list-item nb-checkbox ::ng-deep span+span.text{color:var(--gauzy-text-color-2)}.mansory-layout{-webkit-column-count:2;-moz-column-count:2;column-count:2}.shortcut-card{position:relative;display:inline-block;width:100%;-webkit-transition:1s ease all;transition:1s ease all;box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;margin-bottom:1rem}@media only screen and (max-width:1200px){.mansory-layout{-moz-column-count:1;-webkit-column-count:1;column-count:1}}@media only screen and (min-width:1680px){.mansory-layout{width:calc(100% - 5rem)}}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }], ctorParameters: () => [{ type: i1.ActivatedRoute }, { type: i2.FeatureStoreService }, { type: i2.Store }, { type: i3.TranslateService }, { type: i4.NbDialogService }], propDecorators: { organization: [{
                type: Input
            }] } });
//# sourceMappingURL=feature-toggle.component.js.map